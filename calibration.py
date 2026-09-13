"""
Handing the model its own scorecard back.

The scorecard already grades yesterday's bullish/bearish/neutral calls against
what the share price actually did. Nothing read it. This module closes that
loop: it turns scorecard/*.json into a short, factual account of where the
calls have been going wrong, writes it to analysis/calibration.md, and hands
the same text to the model at the top of every prompt.

    IMPORTANT: this is not training. The Claude API is stateless — each call
    starts with no memory of any previous one, and nothing learned on Monday
    survives to Tuesday unless it is in Tuesday's prompt. The only thing that
    persists between calls is a file. So the "memory" here is literally
    analysis/calibration.md, regenerated nightly and pasted back in.

The whole module is organised around one danger, because this is where a
feedback loop like this goes wrong.

    A measured miss rate and an instruction to the model are not the same
    thing, and turning the first into the second is how you teach noise.

    Three of the largest "misses" in the sample are a rights issue closing and
    a notice about unquoted securities, priced -50%. No model could have called
    those, and they are not really moves: the share count changed underneath
    the price. Feeding them back as lessons would teach the model that routine
    quotation notices are catastrophic.

    So:

      - Findings below MIN_SAMPLE are not reported at all. Not a number with a
        caveat — nothing, so the prompt cannot carry a claim that thin.
      - Moves beyond OUTLIER_PCT are excluded from the worked examples, because
        at that size a corporate action is the likelier explanation than news.
      - Every finding carries the n it rests on, so the model can weigh a split
        measured on 334 calls differently from one measured on 30.
      - Instructions are issued only where the evidence supports an instruction.
        Everything else is stated as a fact and left to the model's judgement.

Usage:
    python calibration.py              # print what the model will be told
    python calibration.py --write      # refresh analysis/calibration.md
    python calibration.py --days 20    # widen the window
"""

from __future__ import annotations

import argparse
import json
from collections import defaultdict
from datetime import datetime, timezone
from functools import lru_cache
from pathlib import Path

ROOT           = Path(__file__).parent
SCORECARD_DIR  = ROOT / "scorecard"
CALIBRATION_MD = ROOT / "analysis" / "calibration.md"

# Trading days of scorecard to read. Long enough for the splits to mean
# something, short enough that a change in the prompt shows up in the numbers
# within a fortnight rather than being averaged away forever.
WINDOW_DAYS = 20

# Same floor, and the same reasoning, as base_rates.MIN_SAMPLE: below this a
# proportion is not worth quoting, and quoted it looks exactly like one that is.
MIN_SAMPLE = 30

# A one-day move larger than this is treated as a corporate action — a
# consolidation, a rights issue repricing, a resumption from a long halt —
# rather than a reaction the model could have anticipated. Excluded from the
# worked examples only; the headline rates still count them, because dropping
# inconvenient days from a hit rate is how a hit rate becomes a marketing
# number.
OUTLIER_PCT = 30.0

# How many concrete misses to show. Enough to be a pattern, few enough that the
# model does not start pattern-matching on the specific tickers.
N_EXAMPLES = 5


# ─────────────────────────────────────────────────────────────
# Reading the scorecard
# ─────────────────────────────────────────────────────────────

def load_results(days: int = WINDOW_DAYS, directory: Path | None = None) -> list[dict]:
    """
    Graded calls from the most recent `days` scorecards, newest day last.

    Rows the scorecard could not settle are dropped here rather than counted as
    anything: `no_data` and `pending` have no outcome yet, and `conflict` rows
    are several announcements from one ticker on one day, where the single
    day's move cannot be attributed to any one of them.
    """
    # Resolved here rather than as a default argument, which would freeze the
    # directory at import and quietly ignore anything a test pointed it at.
    directory = directory or SCORECARD_DIR
    if not directory.exists():
        return []

    files = sorted(p for p in directory.glob("*.json") if p.name != "summary.json")
    rows: list[dict] = []

    for path in files[-days:]:
        try:
            day = json.loads(path.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            continue
        for r in day.get("results") or []:
            if r.get("conflict") or r.get("verdict") in ("no_data", "pending"):
                continue
            if r.get("abnormal_pct") is None:
                continue
            rows.append(r)

    return rows


def _hit_rate(rows: list[dict]) -> tuple[int, float | None]:
    """(decided calls, % correct) over directional calls only."""
    decided = [r for r in rows if r.get("verdict") in ("correct", "wrong")]
    if not decided:
        return 0, None
    correct = sum(1 for r in decided if r["verdict"] == "correct")
    return len(decided), round(correct / len(decided) * 100, 1)


def _moved(r: dict, threshold: float) -> bool:
    return abs(r["abnormal_pct"]) >= threshold


# ─────────────────────────────────────────────────────────────
# Findings
# ─────────────────────────────────────────────────────────────

def build(days: int = WINDOW_DAYS) -> dict | None:
    """
    Everything the calibration file and the prompt are built from, or None when
    there is not yet enough graded history to say anything.
    """
    rows = load_results(days)
    if len(rows) < MIN_SAMPLE:
        return None

    threshold = _threshold(days)
    directional = [r for r in rows if r.get("sentiment") in ("bullish", "bearish")]

    out: dict = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "days": _days_covered(days),
        "threshold_pct": threshold,
        "graded": len(rows),
    }

    n, rate = _hit_rate(directional)
    out["directional"] = {"n": n, "hit_rate": rate}

    for label in ("bullish", "bearish"):
        n, rate = _hit_rate([r for r in rows if r.get("sentiment") == label])
        out[label] = {"n": n, "hit_rate": rate} if n >= MIN_SAMPLE else None

    # The base rate this whole exercise is measured against: how often ANY
    # announcing stock moved. A label only tells you something if it separates
    # from this.
    moved_all = sum(1 for r in rows if _moved(r, threshold))
    out["base_move_rate"] = round(moved_all / len(rows) * 100, 1)

    neutral = [r for r in rows if r.get("sentiment") == "neutral"]
    if len(neutral) >= MIN_SAMPLE:
        moved_n = sum(1 for r in neutral if _moved(r, threshold))
        out["neutral"] = {
            "n": len(neutral),
            "move_rate": round(moved_n / len(neutral) * 100, 1),
        }
    else:
        out["neutral"] = None

    out["market_sensitive"] = _split_by(
        directional, lambda r: bool(r.get("market_sensitive"))
    )
    out["document_type"] = _split_by(
        directional, lambda r: r.get("document_type") or "Unknown"
    )
    out["misses"] = _worked_examples(directional)

    return out


def _split_by(rows: list[dict], key) -> dict:
    """Hit rate per group, dropping every group thinner than MIN_SAMPLE."""
    groups: dict = defaultdict(list)
    for r in rows:
        groups[key(r)].append(r)

    out = {}
    for k, group in groups.items():
        n, rate = _hit_rate(group)
        if n >= MIN_SAMPLE:
            out[k] = {"n": n, "hit_rate": rate}
    return out


def _worked_examples(rows: list[dict]) -> list[dict]:
    """
    The largest genuine misses — a directional call that the market took the
    other way. Concrete cases are what the model can actually use; a hit rate
    tells it there is a problem, an example tells it what the problem looks
    like.
    """
    misses = [
        r for r in rows
        if r.get("verdict") == "wrong" and abs(r["abnormal_pct"]) <= OUTLIER_PCT
    ]
    misses.sort(key=lambda r: -abs(r["abnormal_pct"]))

    # One per ticker, so a single bad day for one stock does not fill the list.
    seen: set[str] = set()
    out = []
    for r in misses:
        if r.get("ticker") in seen:
            continue
        seen.add(r.get("ticker"))
        out.append({
            "ticker": r.get("ticker"),
            "headline": r.get("headline"),
            "document_type": r.get("document_type"),
            "called": r.get("sentiment"),
            "abnormal_pct": r["abnormal_pct"],
        })
        if len(out) == N_EXAMPLES:
            break
    return out


def _threshold(days: int) -> float:
    """The dead band the scorecard graded against, read back off the files."""
    for path in sorted(SCORECARD_DIR.glob("*.json"), reverse=True):
        if path.name == "summary.json":
            continue
        try:
            return float(json.loads(path.read_text(encoding="utf-8"))["threshold_pct"])
        except (json.JSONDecodeError, OSError, KeyError, TypeError, ValueError):
            continue
    return 1.0


def _days_covered(days: int) -> int:
    files = [p for p in SCORECARD_DIR.glob("*.json") if p.name != "summary.json"]
    return min(len(files), days)


# ─────────────────────────────────────────────────────────────
# Rendering
# ─────────────────────────────────────────────────────────────

def prompt_block(days: int = WINDOW_DAYS) -> str | None:
    """
    The section pasted into every prompt, or None when there is nothing
    dependable to say — in which case the prompt goes out exactly as it did
    before this module existed.
    """
    cal = build(days)
    if not cal or not cal["directional"]["hit_rate"]:
        return None

    t = cal["threshold_pct"]
    lines = [
        "YOUR TRACK RECORD ON THIS TASK",
        f"Your own calls over the last {cal['days']} trading days were graded against the "
        f"actual close, net of the ASX 200. A move smaller than {t:g}% counts as no move. "
        "This is measured, not an opinion, and it is here to calibrate you — not to push "
        "you toward any particular label.",
        f"- Directional calls (bullish/bearish): {cal['directional']['hit_rate']:g}% correct "
        f"on {cal['directional']['n']} graded calls.",
    ]

    for label in ("bullish", "bearish"):
        s = cal.get(label)
        if s:
            lines.append(f"  - {label}: {s['hit_rate']:g}% on {s['n']}.")

    ms = cal["market_sensitive"]
    if True in ms and False in ms:
        hot, cold = ms[True], ms[False]
        lines.append(
            f"- On MARKET SENSITIVE filings you are right {hot['hit_rate']:g}% of the time "
            f"(n={hot['n']}); on filings not flagged market sensitive, {cold['hit_rate']:g}% "
            f"(n={cold['n']}). Weight your conviction accordingly: an unflagged filing has "
            "to make its own case before it earns a directional call."
        )

    if cal["neutral"]:
        n = cal["neutral"]
        lines.append(
            f"- Stocks you called neutral moved {t:g}%+ anyway {n['move_rate']:g}% of the time "
            f"(n={n['n']}); across every graded announcement the figure is "
            f"{cal['base_move_rate']:g}%. Read that as a limit on what neutral is currently "
            "telling anyone, and note the grading window is the whole session, so some of "
            "that movement belongs to other news."
        )

    lessons = _lessons_section()
    if lessons:
        # The ledger supersedes the raw miss list: a worked-out blind spot is
        # more use than the example it came from. Until it has earned a couple
        # of lessons, the examples are what there is.
        lines.append(lessons)
    elif cal["misses"]:
        lines.append("- Your largest recent misses, with what you called and what happened:")
        for m in cal["misses"]:
            lines.append(
                f"    {m['ticker']} — \"{m['headline']}\" — you said {m['called']}, "
                f"it went {m['abnormal_pct']:+.1f}%."
            )

    return "\n".join(lines)


def _lessons_section() -> str | None:
    """
    The blind spots the model has identified in its own wrong calls, from
    reflect.py's ledger. Absent until at least one lesson has been seen often
    enough to be worth acting on.

    Imported lazily because reflect.py pulls in the Anthropic SDK, and
    calibration is imported by anything that wants the numbers.
    """
    try:
        from reflect import active_lessons
    except ImportError:
        return None

    try:
        lessons = active_lessons()
    except SystemExit:
        # A corrupt ledger should stop the nightly reflection, not the morning
        # fetch. The prompt simply goes out without the lessons section.
        return None

    if not lessons:
        return None

    lines = [
        "",
        "LESSONS FROM YOUR OWN WRONG CALLS",
        "Each of these was written by you, after reviewing a call the market proved wrong, "
        "and each has come up on more than one day. Check every announcement below against "
        "this list before you commit to a label.",
    ]
    for l in lessons:
        lines.append(f"  [{l['id']}] {l['trigger']} (seen {l['times_seen']}x)")
        lines.append(f"      {l['rule']}")
    return "\n".join(lines)


def render_markdown(cal: dict) -> str:
    """The durable, human-readable version kept in the repo."""
    t = cal["threshold_pct"]
    lines = [
        "# Calibration",
        "",
        "What the sentiment calls have actually been worth, regenerated after each",
        "close by `calibration.py` and pasted into the next day's prompt. Nothing",
        "here is hand-written; edit `calibration.py` if a finding is wrong.",
        "",
        f"- Window: last {cal['days']} trading days, {cal['graded']} graded calls",
        f"- Dead band: moves under {t:g}% net of the ASX 200 count as no move",
        f"- Generated: {cal['generated_at']}",
        "",
        "## Headline",
        "",
        f"Directional calls (bullish/bearish): **{cal['directional']['hit_rate']:g}%** "
        f"correct on {cal['directional']['n']} graded calls.",
        "",
        "| Label | Graded | Hit rate |",
        "| --- | ---: | ---: |",
    ]

    for label in ("bullish", "bearish"):
        s = cal.get(label)
        lines.append(
            f"| {label} | {s['n']} | {s['hit_rate']:g}% |" if s
            else f"| {label} | — | too few to report |"
        )

    lines += ["", "## Does the label separate from the base rate?", ""]
    if cal["neutral"]:
        n = cal["neutral"]
        lines += [
            f"Stocks called neutral moved {t:g}% or more anyway **{n['move_rate']:g}%** of the "
            f"time (n={n['n']}). Every graded announcement moved {cal['base_move_rate']:g}% of "
            "the time.",
            "",
            "The gap between those two numbers is the whole information content of a neutral",
            "call. It is small. Part of that is the measurement: the grading window is the",
            "full session, so a stock that moved on something else entirely is counted",
            "against the label. Part of it is not.",
        ]
    else:
        lines.append("Not enough neutral calls graded yet.")

    lines += ["", "## Where the calls hold up, and where they do not", ""]

    ms = cal["market_sensitive"]
    if True in ms and False in ms:
        lines += [
            "| Filing | Graded | Hit rate |",
            "| --- | ---: | ---: |",
            f"| Market sensitive | {ms[True]['n']} | {ms[True]['hit_rate']:g}% |",
            f"| Not flagged | {ms[False]['n']} | {ms[False]['hit_rate']:g}% |",
            "",
            "The exchange's own flag is doing more work than the model is. On unflagged",
            "filings the directional calls are close to a coin flip.",
            "",
        ]

    if cal["document_type"]:
        lines += ["| Document type | Graded | Hit rate |", "| --- | ---: | ---: |"]
        for k, s in sorted(cal["document_type"].items(), key=lambda kv: -kv[1]["n"]):
            lines.append(f"| {k} | {s['n']} | {s['hit_rate']:g}% |")
        lines += [
            "",
            f"Document types with fewer than {MIN_SAMPLE} graded calls are omitted rather",
            "than shown with a caveat. They will appear as the sample fills in.",
            "",
        ]

    lines += ["## Largest misses", ""]
    if cal["misses"]:
        lines += ["| Ticker | Called | Move | Headline |", "| --- | --- | ---: | --- |"]
        for m in cal["misses"]:
            lines.append(
                f"| {m['ticker']} | {m['called']} | {m['abnormal_pct']:+.1f}% | {m['headline']} |"
            )
        lines += [
            "",
            f"Moves beyond ±{OUTLIER_PCT:g}% are excluded from this list. At that size the",
            "likelier explanation is a consolidation or a rights issue repricing the shares,",
            "not news the model could have read. They still count in the hit rates above.",
        ]
    else:
        lines.append("None inside the plausible range this window.")

    return "\n".join(lines) + "\n"


@lru_cache(maxsize=1)
def cached_prompt_block() -> str | None:
    """
    prompt_block(), computed once per process.

    fetch_asx.py builds a prompt per batch across a thread pool, and every one
    of them gets the same block; re-reading twenty JSON files for each would be
    pure waste.
    """
    return prompt_block()


# ─────────────────────────────────────────────────────────────
# CLI
# ─────────────────────────────────────────────────────────────

def main() -> None:
    ap = argparse.ArgumentParser(description="Feed the scorecard back to the model.")
    ap.add_argument("--days", type=int, default=WINDOW_DAYS,
                    help=f"Trading days of scorecard to read (default {WINDOW_DAYS}).")
    ap.add_argument("--write", action="store_true",
                    help="Refresh analysis/calibration.md.")
    args = ap.parse_args()

    cal = build(args.days)
    if not cal:
        print("Not enough graded history yet — the prompt will go out unchanged.")
        return

    if args.write:
        CALIBRATION_MD.parent.mkdir(parents=True, exist_ok=True)
        CALIBRATION_MD.write_text(render_markdown(cal), encoding="utf-8")
        print(f"Wrote {CALIBRATION_MD.relative_to(ROOT)} "
              f"({cal['graded']} graded calls over {cal['days']} days)")
        return

    block = prompt_block(args.days)
    print(block or "Nothing dependable to say yet.")


if __name__ == "__main__":
    main()
