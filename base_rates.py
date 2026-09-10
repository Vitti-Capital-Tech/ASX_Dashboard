"""
What happened last time a situation like this came up.

Reads the event dataset built by build_history.py and answers, for a given
announcement, how comparable past announcements actually moved. "The last 395
capital raises repriced -0.5% on the day and 61% of them fell" is a base rate
someone can size a decision against, which is the thing a sentiment label on
its own can never be.

The whole module is organised around one danger, because this is where features
like this go wrong.

    Stacking conditions shrinks the sample fast, but the answer keeps looking
    just as confident.

    "capital raises"                                    ~395 cases
    "capital raises in mining"                          ~150
    "capital raise, mining, volume already elevated"      ~8

Eight cases tells you essentially nothing, and rendered on a card it reads with
exactly the authority of the 395-case version. So:

  - Nothing is returned below MIN_SAMPLE. Not a number with a caveat — nothing,
    so a caller has no way to render a claim that is not supported.
  - Every answer carries `n` and the `basis` it was computed on, so a reader can
    see whether it rests on 400 cases or 40.
  - Lookup starts specific and widens until the sample is big enough, rather
    than starting broad. The narrowest defensible comparison is the useful one.

Nothing here predicts. A base rate says what usually followed, which is useful
for sizing confidence and useless as a certainty.

Usage:
    python base_rates.py --coverage          # what the dataset can answer today
    python base_rates.py --type "Capital Raise"
"""

from __future__ import annotations

import argparse
import json
import statistics as stats
from pathlib import Path

ROOT = Path(__file__).parent
EVENTS_FILE = ROOT / 'analysis' / 'events.jsonl'

# Below this many comparable cases, no claim is made. Thirty is the
# conventional floor for a median and a proportion to be worth quoting; the
# real reason for a floor at all is that a small sample looks identical to a
# large one once it is a number on a card.
MIN_SAMPLE = 30

# Horizons carried through from the dataset.
HORIZONS = ('reaction_pct', 'fwd_5_pct', 'fwd_20_pct')


def load_events(path: Path = EVENTS_FILE) -> list[dict]:
    if not path.exists():
        return []
    out = []
    for line in path.read_text(encoding='utf-8').splitlines():
        if not line.strip():
            continue
        try:
            out.append(json.loads(line))
        except json.JSONDecodeError:
            continue
    return out


def _summarise(rows: list[dict], basis: str) -> dict | None:
    """
    Turn matched events into a base rate, or None if the sample is too thin.

    Each horizon is summarised over the events that actually have it, which
    differ: `reaction_pct` exists the same day, `fwd_20_pct` only twenty
    sessions later. Reporting one `n` for all three would overstate the later
    horizons, so each carries its own.
    """
    reactions = [r['reaction_pct'] for r in rows if r.get('reaction_pct') is not None]
    if len(reactions) < MIN_SAMPLE:
        return None

    out: dict = {'basis': basis, 'n': len(reactions)}

    for h in HORIZONS:
        vals = [r[h] for r in rows if r.get(h) is not None]
        if len(vals) < MIN_SAMPLE:
            out[h] = None
            continue
        out[h] = {
            'n': len(vals),
            # Median, not mean: one +400% shell stock would drag a mean into
            # fiction, and these samples always contain a few.
            'median': round(stats.median(vals), 2),
            'up_pct': round(sum(1 for v in vals if v > 0) / len(vals) * 100, 1),
        }

    return out


def _match(events: list[dict], *, document_type: str | None = None,
           tag: str | None = None, ticker: str | None = None,
           elevated_volume: bool | None = None) -> list[dict]:
    rows = events
    if ticker:
        rows = [r for r in rows if r.get('ticker') == ticker]
    if document_type:
        rows = [r for r in rows if r.get('document_type') == document_type]
    if tag:
        rows = [r for r in rows if tag in (r.get('tags') or [])]
    if elevated_volume is not None:
        def hot(r: dict) -> bool:
            c = r.get('context') or {}
            v = c.get('volume_trend_ratio')
            return v is not None and v >= 1.5
        rows = [r for r in rows if hot(r) == elevated_volume]
    return rows


def for_announcement(events: list[dict], ann: dict) -> dict | None:
    """
    The narrowest base rate that still has enough cases behind it.

    Tried specific first and widened, because "this company's own results" is
    worth more than "results anywhere" when there is enough of it — and when
    there is not, saying nothing about this company beats inventing a pattern
    from four filings.
    """
    doc = ann.get('document_type') or None
    tags = ann.get('tags') or []
    tag = tags[0] if tags else None
    ticker = ann.get('ticker') or None
    ctx = ann.get('market_context') or ann.get('context') or {}
    vol = ctx.get('volume_trend_ratio')
    hot = vol is not None and vol >= 1.5

    ladder: list[tuple[str, dict]] = []
    if ticker and doc:
        ladder.append((f'{ticker} {doc}', {'ticker': ticker, 'document_type': doc}))
    if doc and hot:
        ladder.append((f'{doc}, volume already elevated',
                       {'document_type': doc, 'elevated_volume': True}))
    if doc and tag:
        ladder.append((f'{doc} in {tag}', {'document_type': doc, 'tag': tag}))
    if doc:
        ladder.append((doc, {'document_type': doc}))
    if tag:
        ladder.append((tag, {'tag': tag}))

    for basis, kwargs in ladder:
        result = _summarise(_match(events, **kwargs), basis)
        if result:
            return result
    return None


def describe(rate: dict | None) -> str | None:
    """One factual sentence, or None. Never a recommendation."""
    if not rate:
        return None
    r = rate.get('reaction_pct')
    if not r:
        return None
    parts = [
        f"The last {r['n']} comparable filings ({rate['basis']}) repriced a median "
        f"{r['median']:+.2f}% against the index on the day, {r['up_pct']:.0f}% of them up"
    ]
    f5 = rate.get('fwd_5_pct')
    if f5:
        parts.append(f"and a median {f5['median']:+.2f}% over the five sessions after")
    return ' '.join(parts) + '.'


# ─────────────────────────────────────────────────────────────
# CLI
# ─────────────────────────────────────────────────────────────

def main() -> None:
    ap = argparse.ArgumentParser(description='Base rates from past announcements')
    ap.add_argument('--coverage', action='store_true',
                    help='What the dataset can and cannot answer yet')
    ap.add_argument('--type', help='Base rate for one document_type')
    args = ap.parse_args()

    events = load_events()
    if not events:
        print(f'No dataset at {EVENTS_FILE}. Run build_history.py first.')
        return

    dates = sorted({e['date'] for e in events})
    print(f'{len(events)} events, {dates[0]} to {dates[-1]} ({len(dates)} trading days)')
    print(f'Minimum sample for a claim: {MIN_SAMPLE}')
    print()

    if args.type:
        rate = _summarise(_match(events, document_type=args.type), args.type)
        print(describe(rate) or
              f'Not enough comparable cases for "{args.type}" yet - '
              f'{len(_match(events, document_type=args.type))} on record, {MIN_SAMPLE} needed.')
        return

    if args.coverage:
        import collections
        counts = collections.Counter(
            e['document_type'] for e in events if e.get('reaction_pct') is not None
        )
        print(f"{'document_type':24} {'cases':>6}  status")
        for doc, n in counts.most_common():
            ok = 'ANSWERABLE' if n >= MIN_SAMPLE else f'needs {MIN_SAMPLE - n} more'
            print(f'{doc:24} {n:6}  {ok}')
        print()
        answerable = sum(1 for n in counts.values() if n >= MIN_SAMPLE)
        print(f'{answerable} of {len(counts)} categories have enough history to quote.')

        # Days-to-ready per category, from that category's own arrival rate.
        # An estimate off the total event count would say a thin category is
        # ready already, because the total is dominated by Market Update.
        days = max(1, len(dates))
        waiting = [
            (doc, (MIN_SAMPLE - n) / (n / days))
            for doc, n in counts.items() if n < MIN_SAMPLE and n > 0
        ]
        if waiting:
            slowest = max(waiting, key=lambda w: w[1])
            print(f'At current arrival rates the last of them ({slowest[0]}) needs about '
                  f'{slowest[1]:.0f} more trading days.')
        return

    ap.print_help()


if __name__ == '__main__':
    main()
