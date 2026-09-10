"""
Market context for an ASX announcement — what the price was doing when it landed.

Turns "Non Renounceable Entitlement Offer" into "Non Renounceable Entitlement
Offer, on volume that has run 2.5x its average for a week, 4% off a 3-month
high". The announcement says what happened; this says what the market was
already doing about it.

Two rules the whole module is built around.

1. NO LOOK-AHEAD. Context is computed only from bars that closed BEFORE the
   announcement. Around 80% of ASX filings land pre-open, so the day's own bar
   does not exist yet anyway — but for the historical half of this feature the
   rule is load-bearing: if the "situation before the news" included the price
   reaction to the news, then measuring what followed becomes circular and every
   past analogue is worthless. `bars_before()` is the only way price data enters
   a context, and it is exclusive by construction.

2. FACTS, NOT CALLS. Every field is a measurement. "closed above its 60-day high
   on 4x volume" is a fact a reader can check; "breakout, momentum building" is
   a recommendation wearing a fact's clothes. The numbers are computed here and
   rendered verbatim; they are also handed to the model so its prose can be
   grounded in them, but the model is never the source of a number on screen.

Usage:
    python market_context.py --self-test
    python market_context.py --ticker LTR --date 2026-09-08
"""

from __future__ import annotations

import argparse
import json
import math
import warnings
from datetime import datetime, timedelta

import pandas as pd
import yfinance as yf

warnings.filterwarnings('ignore')

# ─────────────────────────────────────────────────────────────
# Config
# ─────────────────────────────────────────────────────────────

# One year of daily bars covers the 52-week high and leaves room for the
# 20-day averages to be full at the start of the window.
HISTORY_PERIOD = '1y'

# Trading-day windows. ASX trades ~21 days a month.
SHORT_WINDOW = 5      # "the last few days"
BASE_WINDOW = 20      # the average those days are compared against
QUARTER_WINDOW = 63   # ~3 months
BREAKOUT_WINDOW = 60

# Below this many bars the averages are not meaningful and no context is built.
MIN_BARS = 30

# Median daily turnover, in A$, under which the ratios describe noise rather
# than interest. A 3x volume day on a stock that trades $8k is two people.
# Deliberately low: plenty of legitimate ASX small caps sit near here, and the
# `liquid` flag lets a caller soften the language rather than hide the numbers.
MIN_TURNOVER_AUD = 50_000

# "At" a high means within this of it — an exact touch is rare and not the point.
NEAR_PCT = 1.0

# A breakout needs both halves: a new high AND the volume to support it. Price
# alone drifts to new highs on nothing.
BREAKOUT_VOLUME_MULTIPLE = 2.0

# yfinance rejects very long ticker lists in one call.
CHUNK = 100


def yahoo_symbol(ticker: str) -> str:
    """ASX ticker -> Yahoo symbol. BHP -> BHP.AX"""
    return f"{ticker.strip().upper()}.AX"


# ─────────────────────────────────────────────────────────────
# Price history
# ─────────────────────────────────────────────────────────────

def fetch_history(tickers: list[str], period: str = HISTORY_PERIOD) -> dict[str, pd.DataFrame]:
    """
    One long pull per ticker, sliced locally afterwards.

    Deliberately not one request per announcement or per day. The fetcher runs
    every ~5 minutes through the Sydney morning across ~300 tickers; asking
    Yahoo for each of those on each run would be throttled within the hour. A
    year of bars fetched once answers every question this module asks, for every
    announcement of the day, and for a backfill over past days too.
    """
    symbols = sorted({yahoo_symbol(t) for t in tickers if t})
    out: dict[str, pd.DataFrame] = {}

    for i in range(0, len(symbols), CHUNK):
        chunk = symbols[i:i + CHUNK]
        print(f"[prices] {i + 1}-{i + len(chunk)} of {len(symbols)}...")
        try:
            raw = yf.download(chunk, period=period, group_by='ticker',
                              auto_adjust=False, progress=False, threads=True)
        except Exception as e:
            print(f"[prices] chunk failed: {e}")
            continue

        if raw is None or raw.empty:
            continue

        for sym in chunk:
            try:
                df = raw[sym] if isinstance(raw.columns, pd.MultiIndex) else raw
                df = df.dropna(subset=['Close', 'Volume'])
                if not df.empty:
                    out[sym] = df
            except (KeyError, TypeError):
                continue

    print(f"[prices] history for {len(out)}/{len(symbols)} symbols.")
    return out


def bars_before(df: pd.DataFrame | None, date_str: str) -> pd.DataFrame | None:
    """
    Every bar that closed strictly before `date_str`.

    The only path by which price data reaches a context, so the no-look-ahead
    rule holds by construction rather than by remembering to apply it. Exclusive
    of the date itself: an 8am announcement precedes that day's close, and for a
    past announcement including its own day would fold the reaction to the news
    into the situation that preceded it.
    """
    if df is None or df.empty:
        return None
    cutoff = pd.Timestamp(date_str)
    idx = df.index
    if getattr(idx, 'tz', None) is not None:
        cutoff = cutoff.tz_localize(idx.tz)
    before = df[idx < cutoff]
    return before if not before.empty else None


# ─────────────────────────────────────────────────────────────
# The measurements
# ─────────────────────────────────────────────────────────────

def _pct(a: float, b: float) -> float | None:
    """`a` relative to `b`, as a percentage. None when b is unusable."""
    if b is None or b == 0 or not math.isfinite(b):
        return None
    return round((a / b - 1) * 100, 2)


def compute_context(df: pd.DataFrame | None, date_str: str) -> dict | None:
    """
    What the price was doing going into `date_str`, or None if it cannot be said.

    Returns None rather than a dict of nulls when there is too little history:
    a caller can then omit the whole block, which reads better than a row of
    dashes and cannot be mistaken for "nothing was happening".
    """
    hist = bars_before(df, date_str)
    if hist is None or len(hist) < MIN_BARS:
        return None

    close = hist['Close']
    high = hist['High']
    low = hist['Low']
    vol = hist['Volume']

    last_close = float(close.iloc[-1])
    if not math.isfinite(last_close) or last_close <= 0:
        return None

    base_vol = float(vol.tail(BASE_WINDOW).mean())
    recent_vol = float(vol.tail(SHORT_WINDOW).mean())
    last_vol = float(vol.iloc[-1])

    turnover = float((close * vol).tail(BASE_WINDOW).median())

    q = hist.tail(QUARTER_WINDOW)
    q_high, q_low = float(q['High'].max()), float(q['Low'].min())
    y_high, y_low = float(high.max()), float(low.min())

    # Where in the 3-month range the last close sits: 0 at the low, 1 at the high.
    span = q_high - q_low
    range_pos = round((last_close - q_low) / span, 3) if span > 0 else None

    # A new high needs a window that EXCLUDES the day being measured, or every
    # day trivially closes at its own high.
    prior = hist.iloc[:-1].tail(BREAKOUT_WINDOW)
    prior_high = float(prior['High'].max()) if len(prior) else None
    vol_multiple = round(last_vol / base_vol, 2) if base_vol > 0 else None
    broke_out = bool(
        prior_high is not None
        and last_close > prior_high
        and vol_multiple is not None
        and vol_multiple >= BREAKOUT_VOLUME_MULTIPLE
    )

    from_q_high = _pct(last_close, q_high)
    from_y_high = _pct(last_close, y_high)

    return {
        # The date of the last bar used, so a reader knows what "recent" means
        # and can tell a quiet feed from a stale one.
        'as_of': hist.index[-1].date().isoformat(),
        'bars': int(len(hist)),
        'last_close': round(last_close, 4),

        # Volume. `trend` is the question actually asked — has it been building
        # over several days — rather than whether one day happened to be busy.
        'volume_trend_ratio': round(recent_vol / base_vol, 2) if base_vol > 0 else None,
        'volume_last_ratio': vol_multiple,
        'avg_turnover_aud': int(turnover) if math.isfinite(turnover) else None,
        'liquid': bool(math.isfinite(turnover) and turnover >= MIN_TURNOVER_AUD),

        # Position. Negative percentages mean "below the high by this much".
        'pct_from_3m_high': from_q_high,
        'pct_from_3m_low': _pct(last_close, q_low),
        'pct_from_52w_high': from_y_high,
        'pct_from_52w_low': _pct(last_close, y_low),
        'range_position_3m': range_pos,
        'at_3m_high': bool(from_q_high is not None and from_q_high >= -NEAR_PCT),
        'at_3m_low': bool(_pct(last_close, q_low) is not None and _pct(last_close, q_low) <= NEAR_PCT),
        'at_52w_high': bool(from_y_high is not None and from_y_high >= -NEAR_PCT),
        'at_52w_low': bool(_pct(last_close, y_low) is not None and _pct(last_close, y_low) <= NEAR_PCT),

        'broke_out': broke_out,
    }


def describe(ctx: dict | None) -> list[str]:
    """
    The context as short factual clauses, for a prompt or a caption.

    Only what is worth saying: a stock sitting mid-range on average volume gets
    an empty list, and a caller should say nothing rather than "volume normal,
    price unremarkable". Ordered loudest first.
    """
    if not ctx:
        return []

    out: list[str] = []

    if not ctx['liquid']:
        out.append(
            f"thinly traded (median turnover about A${ctx['avg_turnover_aud']:,}/day), "
            "so the ratios below describe very little actual trading"
        )

    if ctx['broke_out']:
        out.append(
            f"closed above its {BREAKOUT_WINDOW}-day high on "
            f"{ctx['volume_last_ratio']}x its {BASE_WINDOW}-day average volume"
        )

    trend = ctx['volume_trend_ratio']
    if trend is not None and trend >= 1.5:
        out.append(
            f"volume over the last {SHORT_WINDOW} sessions ran {trend}x its "
            f"{BASE_WINDOW}-day average"
        )
    elif trend is not None and trend <= 0.6:
        out.append(f"volume over the last {SHORT_WINDOW} sessions was {trend}x its average")

    if ctx['at_52w_high']:
        out.append("at a 12-month high")
    elif ctx['at_3m_high'] and not ctx['broke_out']:
        out.append("at a 3-month high")
    elif ctx['at_52w_low']:
        out.append("at a 12-month low")
    elif ctx['at_3m_low']:
        out.append("at a 3-month low")
    elif ctx['pct_from_3m_high'] is not None and ctx['pct_from_3m_high'] >= -5:
        out.append(f"{abs(ctx['pct_from_3m_high'])}% off its 3-month high")
    elif ctx['pct_from_52w_high'] is not None and ctx['pct_from_52w_high'] <= -50:
        out.append(f"{abs(ctx['pct_from_52w_high'])}% below its 12-month high")

    return out


# ─────────────────────────────────────────────────────────────
# CLI
# ─────────────────────────────────────────────────────────────

def _show(ticker: str, date_str: str, hist: dict[str, pd.DataFrame]) -> None:
    ctx = compute_context(hist.get(yahoo_symbol(ticker)), date_str)
    print(f"\n--- {ticker} going into {date_str} ---")
    if ctx is None:
        print("   no context (too little history)")
        return
    print(json.dumps(ctx, indent=2))
    lines = describe(ctx)
    print("   reads as: " + ("; ".join(lines) if lines else "(nothing worth saying)"))


def main() -> None:
    ap = argparse.ArgumentParser(description="Market context for an ASX announcement")
    ap.add_argument('--ticker')
    ap.add_argument('--date', default=datetime.now().strftime('%Y-%m-%d'))
    ap.add_argument('--self-test', action='store_true',
                    help="Run the no-look-ahead and shape checks against live data")
    args = ap.parse_args()

    if args.self_test:
        tickers = ['BHP', 'LTR', 'AAU', 'FCT']
        hist = fetch_history(tickers)

        print("\n=== no-look-ahead: bars_before must exclude the date itself ===")
        df = hist[yahoo_symbol('BHP')]
        last = df.index[-1].date().isoformat()
        before = bars_before(df, last)
        print(f"  full history last bar : {last}")
        print(f"  bars_before({last}) last bar : {before.index[-1].date().isoformat()}")
        print(f"  excluded the cutoff day: {before.index[-1].date().isoformat() < last}")

        print("\n=== same ticker, two dates a month apart, must differ ===")
        d1, d2 = df.index[-40].date().isoformat(), df.index[-1].date().isoformat()
        c1 = compute_context(df, d1)
        c2 = compute_context(df, d2)
        print(f"  {d1}: as_of={c1['as_of']} close={c1['last_close']}")
        print(f"  {d2}: as_of={c2['as_of']} close={c2['last_close']}")
        print(f"  contexts differ: {c1 != c2}")

        print("\n=== thin history returns None rather than nulls ===")
        print(f"  compute_context(first {MIN_BARS - 5} bars) -> "
              f"{compute_context(df.head(MIN_BARS - 5), d2)}")

        for t in tickers:
            _show(t, args.date, hist)
        return

    if not args.ticker:
        ap.error("--ticker is required unless --self-test")

    hist = fetch_history([args.ticker])
    _show(args.ticker, args.date, hist)


if __name__ == '__main__':
    main()
