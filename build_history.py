"""
Build the event dataset the analogue lookup runs on.

For every market-sensitive announcement in logs/, records what the price was
doing before it and what the price did after it. That pairing is the whole
point: it turns "Capital Raise" into "the last 395 capital raises moved -2.1%
on the day and gave back another 1.4% over the week", which is a base rate
someone can size a decision against.

Written once and refreshed occasionally, not on the daily path — the daily job
appends the day's events instead. One long history pull per ticker (about 20
requests for 1,900 tickers) and every outcome computed locally from it, rather
than 110 days x 300 tickers of per-day fetches, which is both slower and the
shape most likely to get throttled.

Three outcomes per event, because "what happened after" is really three
questions and they often disagree:

    reaction   the last close before the news -> the close of its own session.
               The immediate repricing.
    fwd_5      that session's close -> 5 sessions later. Whether it held.
    fwd_20     that session's close -> 20 sessions later. Whether it mattered.

All three are net of the S&P/ASX 200, for the same reason the scorecard is: on
a day the index falls 2% every announcement looks bearish, and an unadjusted
base rate would mostly measure the market's mood over the sample period.

Usage:
    python build_history.py                    # every log
    python build_history.py --days 10          # the 10 most recent logs
    python build_history.py --period 3y        # more lookback per ticker
"""

from __future__ import annotations

import argparse
import json
import zoneinfo
from datetime import datetime
from pathlib import Path

import pandas as pd

from market_context import (
    BENCHMARK_DEFAULT,
    bars_before,
    compute_context,
    fetch_history,
    yahoo_symbol,
)

ROOT = Path(__file__).parent
LOGS_DIR = ROOT / 'logs'
OUT_DIR = ROOT / 'analysis'
OUT_FILE = OUT_DIR / 'events.jsonl'

# ASX continuous trading is 10:00-16:00 local. Anything after the close belongs
# to the next session — the same attribution the scorecard uses, so a base rate
# built here is comparable with the accuracy figures.
MARKET_CLOSE_HOUR = 16
AEST = zoneinfo.ZoneInfo('Australia/Sydney')  # handles AEST/AEDT

FORWARD_HORIZONS = {'fwd_5': 5, 'fwd_20': 20}


def session_index(df: pd.DataFrame, date_str: str, after_close: bool) -> int | None:
    """
    Row number of the session an announcement is judged on, or None.

    Bars come from the exchange calendar, so holidays and long weekends resolve
    themselves rather than being guessed at.
    """
    days = [d.date().isoformat() for d in df.index]
    if after_close:
        later = [i for i, d in enumerate(days) if d > date_str]
        return later[0] if later else None
    try:
        return days.index(date_str)
    except ValueError:
        return None  # halted, suspended, or a non-trading day


def pct_move(df: pd.DataFrame, i_from: int, i_to: int) -> float | None:
    """Close-to-close percentage between two row numbers."""
    if i_from < 0 or i_to >= len(df) or i_from >= len(df):
        return None
    a = float(df['Close'].iloc[i_from])
    b = float(df['Close'].iloc[i_to])
    if a <= 0:
        return None
    return (b / a - 1) * 100


def build_events(dates: list[str], hist: dict[str, pd.DataFrame]) -> list[dict]:
    bench = hist.get(BENCHMARK_DEFAULT)
    events: list[dict] = []

    for date_str in dates:
        try:
            log = json.loads((LOGS_DIR / f'{date_str}.json').read_text(encoding='utf-8'))
        except (OSError, json.JSONDecodeError):
            continue

        for ann in log.get('announcements', []):
            if not ann.get('market_sensitive'):
                continue

            ticker = (ann.get('ticker') or '').strip().upper()
            df = hist.get(yahoo_symbol(ticker))
            if df is None or df.empty:
                continue

            # The log's own date is already the Sydney trading date, so only
            # the hour decides whether this belongs to the next session.
            after_close = False
            raw_time = ann.get('time') or ''
            if raw_time:
                try:
                    after_close = datetime.fromisoformat(
                        raw_time.replace('Z', '+00:00')
                    ).astimezone(AEST).hour >= MARKET_CLOSE_HOUR
                except ValueError:
                    after_close = False

            i = session_index(df, date_str, after_close)
            if i is None or i == 0:
                continue

            # Context strictly before the announcement — the same function the
            # live path uses, so a past event and a live one are described by
            # identical measurements.
            ctx = compute_context(df, date_str)

            bi = session_index(bench, date_str, after_close) if bench is not None else None

            def adjusted(a: int, b: int, ba: int | None, bb: int | None) -> float | None:
                mv = pct_move(df, a, b)
                if mv is None:
                    return None
                bm = pct_move(bench, ba, bb) if (bench is not None and ba is not None and bb is not None) else 0.0
                return round(mv - (bm or 0.0), 2)

            row = {
                'date': date_str,
                'ticker': ticker,
                'document_type': ann.get('document_type', ''),
                'tags': ann.get('tags') or [],
                'sentiment': ann.get('sentiment') or 'neutral',
                'headline': ann.get('headline', ''),
                # The immediate repricing.
                'reaction_pct': adjusted(i - 1, i, (bi - 1) if bi else None, bi),
                'context': ctx,
            }

            for name, n in FORWARD_HORIZONS.items():
                row[f'{name}_pct'] = (
                    adjusted(i, i + n, bi, (bi + n) if bi is not None else None)
                    if i + n < len(df) else None
                )

            events.append(row)

    return events


def main() -> None:
    ap = argparse.ArgumentParser(description='Build the analogue event dataset')
    ap.add_argument('--days', type=int, default=0,
                    help='Only the N most recent logs (0 = all)')
    ap.add_argument('--period', default='2y',
                    help='History per ticker. Needs to cover the oldest log plus '
                         'a year of lookback for the 52-week high.')
    ap.add_argument('--out', default=str(OUT_FILE))
    args = ap.parse_args()

    dates = sorted(
        p.stem for p in LOGS_DIR.glob('[0-9]*.json')
    )
    if args.days:
        dates = dates[-args.days:]
    if not dates:
        print('[build] no logs found.')
        return

    tickers: set[str] = set()
    for d in dates:
        try:
            log = json.loads((LOGS_DIR / f'{d}.json').read_text(encoding='utf-8'))
        except (OSError, json.JSONDecodeError):
            continue
        for a in log.get('announcements', []):
            if a.get('market_sensitive') and a.get('ticker'):
                tickers.add(a['ticker'])

    print(f'[build] {len(dates)} logs, {dates[0]} to {dates[-1]}, {len(tickers)} tickers.')

    hist = fetch_history(sorted(tickers), period=args.period, extra=[BENCHMARK_DEFAULT])
    events = build_events(dates, hist)

    OUT_DIR.mkdir(exist_ok=True)
    out = Path(args.out)
    with out.open('w', encoding='utf-8') as f:
        for e in events:
            f.write(json.dumps(e) + '\n')

    scored = sum(1 for e in events if e['reaction_pct'] is not None)
    with_ctx = sum(1 for e in events if e['context'])
    print(f'[build] wrote {len(events)} events to {out}')
    print(f'[build]   with a measurable reaction : {scored}')
    print(f'[build]   with pre-announcement context: {with_ctx}')


if __name__ == '__main__':
    main()
