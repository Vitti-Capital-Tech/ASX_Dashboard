"""
The model reads back its own misses and writes down what it failed to consider.

The scorecard says a call was wrong. It cannot say why. This module closes that
gap: after the close it hands the day's misses back to the model — the headline
it read, the price action it was shown, the reasoning it gave, and what the
stock actually did — and asks one question. What did you fail to take into
account before you committed to that label?

The answers accumulate in analysis/lessons.json. It is a ledger, not a window:
a lesson written in September is still there in March, because the point is to
carry a blind spot forward indefinitely rather than let it age out of a rolling
average. calibration.py puts the earned ones at the top of the next day's
prompt.

    As with everything else here, this is not training. The model cannot
    remember this. Nothing survives an API call except a file, so the file is
    doing all of the work.

The whole module is organised around one danger, because this is exactly where
a reflection loop goes wrong.

    A model asked "why were you wrong?" will always produce an answer, and the
    answer will always sound insightful.

    Most misses have no lesson in them. A stock fell because the whole sector
    fell, or because a holder was selling, or for no reason anyone can name
    from the filing. Write those up as lessons and within a month the prompt
    is a wall of plausible-sounding superstition, every line of it crowding out
    the few rules that are real.

    So:

      - "No lesson here" is an explicit, encouraged answer, and the prompt says
        so in as many words.
      - A new lesson is a CANDIDATE. It does not go into the daily prompt until
        the same blind spot has been identified on a different day, because one
        occurrence is a coincidence and the model cannot tell the difference.
      - The existing ledger goes into the reflection prompt, so a recurrence is
        recorded against the lesson that already exists instead of spawning a
        near-duplicate of it.
      - Nothing is ever deleted. A lesson that stops recurring goes dormant and
        leaves the prompt, but stays in the file with its history intact.

Usage:
    python reflect.py                    # reflect on today's AEST date
    python reflect.py --date 2026-09-10
    python reflect.py --date 2026-09-10 --dry-run   # print, write nothing
"""

from __future__ import annotations

import argparse
import json
import os
import zoneinfo
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv
from anthropic import Anthropic

load_dotenv()

AEST = zoneinfo.ZoneInfo("Australia/Sydney")

ROOT          = Path(__file__).parent
LOGS_DIR      = ROOT / "logs"
SCORECARD_DIR = ROOT / "scorecard"
LESSONS_FILE  = ROOT / "analysis" / "lessons.json"
LESSONS_MD    = ROOT / "analysis" / "lessons.md"


def _env_or_default(key: str, default: str) -> str:
    v = (os.environ.get(key) or "").strip()
    return v if v else default


ANTHROPIC_API_KEY = (os.environ.get("ANTHROPIC_API_KEY") or "").strip()
ANTHROPIC_MODEL   = _env_or_default("ANTHROPIC_MODEL", "claude-opus-4-6")

# How many of the day's misses to reflect on. The worst ones, because a call
# that missed by 12% had something to miss; one that missed by 1.2% mostly had
# noise. Also keeps the reflection to a single bounded API call.
MAX_MISSES = 20

# A move larger than this is treated as a corporate action — a consolidation, a
# rights issue repricing — rather than a reaction anyone could have read from
# the filing. Reflecting on these teaches the model that routine quotation
# notices are catastrophic, which is worse than teaching it nothing.
OUTLIER_PCT = 30.0

# A neutral call only counts as a miss worth examining if the stock really
# moved. Neutral calls that drifted 1-2% are the dead band doing its job, and
# there are hundreds of them a day.
NEUTRAL_MISS_PCT = 5.0

# Times a blind spot must be identified, on different days, before its lesson
# is allowed into the daily prompt. One occurrence is a coincidence.
PROMOTE_AFTER = int(_env_or_default("LESSON_PROMOTE_AFTER", "2"))

# Days without a recurrence before an active lesson goes dormant and leaves the
# prompt. It stays in the file — dormant is not deleted.
DORMANT_AFTER_DAYS = int(_env_or_default("LESSON_DORMANT_DAYS", "60"))

# Most lessons the prompt will ever carry. Past this the list stops being a
# checklist and becomes wallpaper.
MAX_ACTIVE_IN_PROMPT = 15


# ─────────────────────────────────────────────────────────────
# The ledger
# ─────────────────────────────────────────────────────────────

def load_lessons(path: Path | None = None) -> dict:
    path = path or LESSONS_FILE
    if not path.exists():
        return {"version": 1, "updated_at": None, "next_id": 1, "lessons": []}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        # A corrupt ledger must not take the pipeline down with it, but it must
        # not be silently replaced by an empty one either.
        raise SystemExit(f"{path} is unreadable. Fix or remove it by hand.")


def save_lessons(ledger: dict, path: Path | None = None) -> None:
    path = path or LESSONS_FILE
    path.parent.mkdir(parents=True, exist_ok=True)
    ledger["updated_at"] = datetime.now(timezone.utc).isoformat()
    path.write_text(json.dumps(ledger, indent=2, ensure_ascii=False) + "\n",
                    encoding="utf-8")


def _status(lesson: dict, today: str) -> str:
    """
    Where a lesson stands today.

    candidate — seen once. Real or coincidence, nothing can tell yet.
    active    — seen enough times to earn a place in the prompt.
    dormant   — earned it once, but has not recurred in a long time.
    """
    if lesson["times_seen"] < PROMOTE_AFTER:
        return "candidate"
    try:
        gap = (datetime.strptime(today, "%Y-%m-%d")
               - datetime.strptime(lesson["last_seen"], "%Y-%m-%d")).days
    except (ValueError, KeyError, TypeError):
        return "active"
    return "dormant" if gap > DORMANT_AFTER_DAYS else "active"


def active_lessons(ledger: dict | None = None, today: str | None = None) -> list[dict]:
    """The lessons that have earned a place in the daily prompt."""
    ledger = ledger if ledger is not None else load_lessons()
    today = today or datetime.now(AEST).strftime("%Y-%m-%d")

    earned = [l for l in ledger.get("lessons", []) if _status(l, today) == "active"]
    # Most-reinforced first: the blind spot seen nine times matters more than
    # the one seen twice, and if the list is ever truncated that is the order
    # to truncate in.
    earned.sort(key=lambda l: (-l["times_seen"], l.get("last_seen") or ""))
    return earned[:MAX_ACTIVE_IN_PROMPT]


# ─────────────────────────────────────────────────────────────
# What the model got wrong, and what it was looking at
# ─────────────────────────────────────────────────────────────

def gather_misses(date_str: str) -> list[dict]:
    """
    The day's misses, each rejoined to what the model actually saw when it made
    the call. Without the reasoning and the price context, a reflection is just
    the model inventing a story about a headline.
    """
    sc_path = SCORECARD_DIR / f"{date_str}.json"
    log_path = LOGS_DIR / f"{date_str}.json"
    if not sc_path.exists() or not log_path.exists():
        return []

    scored = json.loads(sc_path.read_text(encoding="utf-8")).get("results") or []
    logged = json.loads(log_path.read_text(encoding="utf-8")).get("announcements") or []
    by_url = {a.get("url"): a for a in logged if a.get("url")}

    misses = []
    for r in scored:
        if r.get("conflict") or r.get("verdict") != "wrong":
            continue
        move = r.get("abnormal_pct")
        if move is None or abs(move) > OUTLIER_PCT:
            continue
        if r.get("sentiment") == "neutral" and abs(move) < NEUTRAL_MISS_PCT:
            continue

        ann = by_url.get(r.get("url"), {})
        ctx = ann.get("market_context") or {}
        misses.append({
            "ticker": r.get("ticker"),
            "company": r.get("company"),
            "headline": r.get("headline"),
            "document_type": r.get("document_type"),
            "market_sensitive": bool(r.get("market_sensitive")),
            "called": r.get("sentiment"),
            "abnormal_pct": move,
            "reasoning": ann.get("summary") or [],
            "price_context": ctx.get("notes") or [],
            "caveat": ctx.get("caveat"),
        })

    misses.sort(key=lambda m: -abs(m["abnormal_pct"]))
    return misses[:MAX_MISSES]


# ─────────────────────────────────────────────────────────────
# The reflection
# ─────────────────────────────────────────────────────────────

def build_reflection_prompt(misses: list[dict], ledger: dict) -> str:
    existing = ledger.get("lessons", [])
    if existing:
        known = "\n".join(
            f"  [{l['id']}] (trigger: {l['trigger']}) {l['rule']}"
            for l in existing
        )
    else:
        known = "  (none yet — this is the first reflection)"

    def one(i: int, m: dict) -> str:
        rows = [
            f"[{i}] {m['company']} ({m['ticker']}) — {m['document_type']}"
            f"{' — MARKET SENSITIVE' if m['market_sensitive'] else ''}",
            f"    Headline: {m['headline']}",
        ]
        if m["price_context"]:
            line = "; ".join(m["price_context"])
            if m["caveat"]:
                line += f"; {m['caveat']}"
            rows.append(f"    Price action you were shown going in: {line}")
        else:
            rows.append("    Price action you were shown going in: none was available")
        if m["reasoning"]:
            rows.append("    What you wrote at the time:")
            rows += [f"      - {b}" for b in m["reasoning"]]
        rows.append(f"    You called it: {m['called'].upper()}")
        rows.append(
            f"    What actually happened: {m['abnormal_pct']:+.1f}% "
            "against the ASX 200 that session."
        )
        return "\n".join(rows)

    listing = "\n\n".join(one(i, m) for i, m in enumerate(misses, 1))
    n = len(misses)

    return f"""You are reviewing your own work as an ASX analyst, after the fact.

Yesterday you classified ASX announcements as bullish, bearish or neutral. Below are
{n} calls that the market proved wrong, each with the information you had at the time,
the reasoning you gave, and what the share price actually did net of the index.

Your job is NOT to explain the move. It is to identify, where one exists, the
consideration you failed to apply BEFORE you committed to the label — a question you
did not ask, an angle you did not weigh, a piece of context you had and did not use.
Something that, as a standing rule, would have made you call this one differently and
would generalise to future announcements of the same shape.

LESSONS YOU HAVE ALREADY WRITTEN DOWN:
{known}

THE MISSES:

{listing}

For each miss, return exactly one of three verdicts:

  "existing"  — this is a repeat of a lesson above. Give its id. Prefer this whenever
                the miss is even roughly the shape of a rule you already have; the list
                is meant to get stronger with repetition, not longer with near-duplicates.

  "new"       — a genuine blind spot that none of the existing lessons covers. Give a
                `trigger` (the kind of announcement the rule applies to, so you can
                recognise the situation next time) and a `rule` (what to do about it,
                in one or two sentences, as an instruction to yourself).

  "none"      — there is no lesson here.

MOST MISSES ARE "none". A stock can fall on good news because the sector fell, because
a holder was selling, because the move was already priced, or for no reason visible in
the filing at all. None of those are analytical errors and none of them generalise.
Inventing a rule from an unforecastable move is worse than having no rule, because the
rule will be in front of you every day afterwards. Only write "new" when you can say
precisely what you should have asked and are confident it would apply again.

Return JSON ONLY:
{{
  "reflections": [
    {{"id": 1, "verdict": "existing", "lesson_id": "L003"}},
    {{"id": 2, "verdict": "none", "why": "sector-wide selloff, nothing in the filing"}},
    {{"id": 3, "verdict": "new",
      "trigger": "Drilling or assay results from pre-revenue explorers",
      "rule": "Ask whether the result changes project economics or only confirms what \
the previous announcement already established. Confirmatory assays are usually priced."}}
  ]
}}"""


def run_reflection(misses: list[dict], ledger: dict, model: str) -> list[dict]:
    if not ANTHROPIC_API_KEY:
        raise SystemExit("ANTHROPIC_API_KEY is not set; cannot reflect.")

    client = Anthropic(api_key=ANTHROPIC_API_KEY)
    resp = client.messages.create(
        model=model,
        max_tokens=min(8000, 300 * len(misses) + 1000),
        messages=[{"role": "user",
                   "content": build_reflection_prompt(misses, ledger)}],
    )

    raw = "".join(b.text for b in resp.content if hasattr(b, "text")).strip()
    if raw.startswith("```json"):
        raw = raw.split("```json")[1].split("```")[0].strip()
    elif raw.startswith("```"):
        raw = raw.split("```")[1].strip()

    parsed = json.loads(raw)
    return parsed.get("reflections") if isinstance(parsed, dict) else parsed


# ─────────────────────────────────────────────────────────────
# Merging into the ledger
# ─────────────────────────────────────────────────────────────

def merge(ledger: dict, reflections: list[dict], misses: list[dict],
          date_str: str) -> dict:
    """
    Fold one day's reflections into the ledger, and report what changed.

    A lesson is only ever reinforced once per day. The model reviewing twenty
    misses will quite reasonably attribute several of them to the same blind
    spot, and counting each one separately would let a single bad day promote a
    lesson on its own — which is the exact thing PROMOTE_AFTER exists to stop.
    """
    by_id = {l["id"]: l for l in ledger["lessons"]}
    reinforced_today: set[str] = set()
    added, reinforced, skipped = [], [], 0

    for ref in reflections or []:
        idx = ref.get("id")
        miss = misses[idx - 1] if isinstance(idx, int) and 1 <= idx <= len(misses) else None
        verdict = (ref.get("verdict") or "").lower()

        if verdict == "none" or miss is None:
            skipped += 1
            continue

        example = {
            "date": date_str,
            "ticker": miss["ticker"],
            "headline": miss["headline"],
            "called": miss["called"],
            "abnormal_pct": miss["abnormal_pct"],
        }

        if verdict == "existing":
            lesson = by_id.get(ref.get("lesson_id"))
            if not lesson:
                skipped += 1
                continue
            if lesson["id"] in reinforced_today:
                lesson["examples"].append(example)
                continue
            reinforced_today.add(lesson["id"])
            lesson["times_seen"] += 1
            lesson["last_seen"] = date_str
            lesson["examples"].append(example)
            reinforced.append(lesson)

        elif verdict == "new":
            trigger, rule = (ref.get("trigger") or "").strip(), (ref.get("rule") or "").strip()
            if not trigger or not rule:
                skipped += 1
                continue
            lesson = {
                "id": f"L{ledger['next_id']:03d}",
                "trigger": trigger,
                "rule": rule,
                "created": date_str,
                "last_seen": date_str,
                "times_seen": 1,
                "examples": [example],
            }
            ledger["next_id"] += 1
            ledger["lessons"].append(lesson)
            by_id[lesson["id"]] = lesson
            reinforced_today.add(lesson["id"])
            added.append(lesson)
        else:
            skipped += 1

    # Keep only enough examples to show a reader what the rule looks like in
    # practice. The ledger is read every day; it should not grow without bound.
    for lesson in ledger["lessons"]:
        lesson["examples"] = lesson["examples"][-5:]

    ledger["last_reflected"] = date_str
    return {"added": added, "reinforced": reinforced, "no_lesson": skipped}


# ─────────────────────────────────────────────────────────────
# Rendering
# ─────────────────────────────────────────────────────────────

def render_markdown(ledger: dict, today: str) -> str:
    lessons = ledger.get("lessons", [])
    groups: dict[str, list] = {"active": [], "candidate": [], "dormant": []}
    for l in lessons:
        groups[_status(l, today)].append(l)
    for g in groups.values():
        g.sort(key=lambda l: (-l["times_seen"], l["id"]))

    lines = [
        "# Lessons",
        "",
        "Blind spots the model identified in its own wrong calls, written down after the",
        "close by `reflect.py` and read back to it the next morning. This is a ledger, not",
        "a rolling window — nothing here is ever deleted.",
        "",
        f"- Last reflection: {ledger.get('last_reflected') or 'never'}",
        f"- {len(groups['active'])} active, {len(groups['candidate'])} candidate, "
        f"{len(groups['dormant'])} dormant",
        "",
        "A lesson enters as a **candidate** and stays out of the daily prompt until the same",
        f"blind spot turns up on {PROMOTE_AFTER} separate days, because one occurrence cannot be told",
        "apart from a coincidence. A lesson that stops recurring for "
        f"{DORMANT_AFTER_DAYS} days goes **dormant**",
        "and leaves the prompt, keeping its history.",
        "",
    ]

    def section(title: str, key: str, blurb: str) -> None:
        lines.extend([f"## {title}", "", blurb, ""])
        if not groups[key]:
            lines.extend(["_None yet._", ""])
            return
        for l in groups[key]:
            lines.append(f"### {l['id']} — {l['trigger']}")
            lines.append("")
            lines.append(l["rule"])
            lines.append("")
            lines.append(
                f"_Seen {l['times_seen']}×. First written {l['created']}, "
                f"last reinforced {l['last_seen']}._"
            )
            lines.append("")
            if l["examples"]:
                lines.append("| Date | Ticker | Called | Move | Headline |")
                lines.append("| --- | --- | --- | ---: | --- |")
                for e in reversed(l["examples"]):
                    lines.append(
                        f"| {e['date']} | {e['ticker']} | {e['called']} | "
                        f"{e['abnormal_pct']:+.1f}% | {e['headline']} |"
                    )
                lines.append("")

    section("Active", "active",
            "In front of the model before every call it makes.")
    section("Candidates", "candidate",
            "Seen once. Waiting to see whether they are real or were a coincidence.")
    section("Dormant", "dormant",
            "Earned their place once and have not recurred since. Kept for the record.")

    return "\n".join(lines)


# ─────────────────────────────────────────────────────────────
# CLI
# ─────────────────────────────────────────────────────────────

def main() -> None:
    ap = argparse.ArgumentParser(
        description="Have the model work out what it missed, and write it down.")
    ap.add_argument("--date", default=datetime.now(AEST).strftime("%Y-%m-%d"),
                    help="Trading date to reflect on (YYYY-MM-DD).")
    ap.add_argument("--model", default=ANTHROPIC_MODEL)
    ap.add_argument("--dry-run", action="store_true",
                    help="Print the reflection; write nothing.")
    args = ap.parse_args()

    misses = gather_misses(args.date)
    if not misses:
        print(f"No misses worth reflecting on for {args.date}.")
        return

    ledger = load_lessons()
    print(f"Reflecting on {len(misses)} misses from {args.date} "
          f"against {len(ledger['lessons'])} existing lessons...")

    reflections = run_reflection(misses, ledger, args.model)
    changed = merge(ledger, reflections, misses, args.date)

    for l in changed["added"]:
        print(f"  NEW       {l['id']} — {l['trigger']}")
    for l in changed["reinforced"]:
        print(f"  SEEN {l['times_seen']}x  {l['id']} — {l['trigger']}")
    print(f"  no lesson: {changed['no_lesson']} of {len(misses)}")

    if args.dry_run:
        print("\n--- dry run, nothing written ---")
        print(render_markdown(ledger, args.date))
        return

    save_lessons(ledger)
    LESSONS_MD.write_text(render_markdown(ledger, args.date), encoding="utf-8")
    print(f"\nWrote {LESSONS_FILE.name} and {LESSONS_MD.name}. "
          f"{len(active_lessons(ledger, args.date))} lesson(s) active in tomorrow's prompt.")


if __name__ == "__main__":
    main()
