#!/usr/bin/env python3
"""
Recompute `market_context` on logs that were written before a column existed.

The live fetcher attaches context at the moment it saves an announcement, so a
column added today is blank on every log saved before today — the dashboard's
table view shows a page of dashes until the next trading morning. This walks
back over saved logs and recomputes each context with the current code.

It is the same computation the live path runs, from the same function, so a
backfilled row and a live one are indistinguishable. In particular it obeys the
same no-look-ahead rule: each announcement's context is still measured only
from bars that closed before ITS OWN log date, not from today's price.

Two things it does NOT do. It does not touch any other field of an
announcement — the headline, summary and sentiment are what the model said at
the time and are not re-derived. And it does not invent a context where there
was none to be had: a ticker Yahoo has never heard of stays without one.

Usage:
    python scripts/backfill_context.py --days 30
    python scripts/backfill_context.py --from 2026-08-01 --to 2026-08-31
    python scripts/backfill_context.py --days 5 --dry-run
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import date, datetime, timedelta
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from market_context import (  # noqa: E402
    BENCHMARK_DEFAULT,
    compute_context,
    describe,
    fetch_history,
    fetch_shares_outstanding,
    interpret,
    liquidity_caveat,
    yahoo_symbol,
)

LOGS_DIR = REPO_ROOT / 'logs'

# Longer than the live fetcher's year. A context for a date three months back
# needs the 52 weeks BEFORE that date, which a one-year pull ending today does
# not contain. compute_context() clamps its own windows, so the extra history
# lengthens the reach rather than widening the measurements.
BACKFILL_PERIOD = '2y'


def log_dates(logs_dir: Path, start: str | None, end: str | None,
              days: int | None) -> list[str]:
    """The log dates to rewrite, oldest first."""
    available = sorted(p.stem for p in logs_dir.glob('*.json'))
    if days:
        cutoff = (date.today() - timedelta(days=days)).isoformat()
        return [d for d in available if d >= cutoff]
    return [d for d in available
            if (start is None or d >= start) and (end is None or d <= end)]


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--days', type=int, help='Backfill the last N days of logs')
    ap.add_argument('--from', dest='start', help='First log date (YYYY-MM-DD)')
    ap.add_argument('--to', dest='end', help='Last log date (YYYY-MM-DD)')
    ap.add_argument('--logs', default=str(LOGS_DIR), help='Logs directory')
    ap.add_argument('--period', default=BACKFILL_PERIOD,
                    help=f'How much history to pull per ticker (default {BACKFILL_PERIOD})')
    ap.add_argument('--dry-run', action='store_true',
                    help='Report what would change without writing anything')
    args = ap.parse_args()

    logs_dir = Path(args.logs)
    dates = log_dates(logs_dir, args.start, args.end, args.days)
    if not dates:
        print('[backfill] no logs matched.')
        return

    # Load every log first, so the price pull covers all of them in one pass.
    # A request per day would be a request per day per ticker on a feed where
    # the same names recur constantly.
    loaded: dict[str, dict] = {}
    tickers: set[str] = set()
    for d in dates:
        try:
            log = json.loads((logs_dir / f'{d}.json').read_text(encoding='utf-8'))
        except (OSError, json.JSONDecodeError) as e:
            print(f'[backfill] {d}: unreadable, skipped ({e})')
            continue
        loaded[d] = log
        tickers.update(a['ticker'] for a in log.get('announcements', []) if a.get('ticker'))

    if not tickers:
        print('[backfill] no tickers in the selected logs.')
        return

    print(f'[backfill] {len(loaded)} logs, {len(tickers)} distinct tickers, '
          f'{dates[0]} to {dates[-1]}')

    hist = fetch_history(sorted(tickers), period=args.period, extra=[BENCHMARK_DEFAULT])
    bench = hist.get(BENCHMARK_DEFAULT)
    try:
        shares = fetch_shares_outstanding(sorted(tickers))
    except Exception as e:
        print(f'[backfill] share counts unavailable, market cap omitted: {e}')
        shares = {}

    total_written = total_missing = 0
    for d, log in loaded.items():
        anns = log.get('announcements', [])
        written = missing = 0
        for a in anns:
            sym = yahoo_symbol(a.get('ticker', ''))
            try:
                ctx = compute_context(hist.get(sym), d, bench=bench,
                                      shares_outstanding=shares.get(sym))
            except Exception:
                ctx = None
            if not ctx:
                # Leave whatever was there. An older context computed from data
                # Yahoo has since stopped serving is worth more than nothing.
                missing += 1
                continue
            ctx['notes'] = describe(ctx)
            ctx['caveat'] = liquidity_caveat(ctx)
            ctx['reading'] = interpret(ctx, a.get('ticker', ''))
            a['market_context'] = ctx
            written += 1

        total_written += written
        total_missing += missing
        print(f'  {d}: {written}/{len(anns)} contexts rebuilt'
              + (f', {missing} without price data' if missing else ''))

        if not args.dry_run:
            log['context_backfilled_at'] = datetime.now().astimezone().isoformat()
            (logs_dir / f'{d}.json').write_text(
                json.dumps(log, indent=2, ensure_ascii=False), encoding='utf-8')

    verb = 'would rebuild' if args.dry_run else 'rebuilt'
    print(f'[backfill] {verb} {total_written} contexts across {len(loaded)} logs'
          + (f'; {total_missing} announcements had no price data' if total_missing else ''))
    if args.dry_run:
        print('[backfill] dry run — nothing written.')


if __name__ == '__main__':
    main()
