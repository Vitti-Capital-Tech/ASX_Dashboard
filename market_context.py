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
import os
import warnings
from datetime import datetime, timedelta, timezone
from pathlib import Path

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
HALF_WINDOW = 126     # ~6 months
YEAR_WINDOW = 252     # ~52 weeks
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

# RSI period. 14 is the convention, and the number a reader who already knows
# what "RSI 72" means has in their head; any other period would need a label.
RSI_WINDOW = 14

# A "month" of bars. The monthly high/low columns walk back in blocks of this,
# so Month1 is the most recent ~21 sessions and Month2 the ~21 before it.
MONTH_WINDOW = 21
MONTHS_BACK = 3

# Shares on issue are the one figure here that no amount of price history can
# give, and the only one needing a request per ticker. Cached for a day: the
# fetcher runs every ~5 minutes, and a share count moves on placements and
# buybacks, not on the hour.
FUNDAMENTALS_CACHE = Path(__file__).with_name('.cache') / 'fundamentals.json'
FUNDAMENTALS_TTL_HOURS = 24

# yfinance rejects very long ticker lists in one call.
CHUNK = 100

# S&P/ASX 200. Outcomes are measured net of it, for the same reason the
# scorecard is: on a day the index falls 2% every announcement looks bearish.
BENCHMARK_DEFAULT = '^AXJO'


def yahoo_symbol(ticker: str) -> str:
    """ASX ticker -> Yahoo symbol. BHP -> BHP.AX"""
    return f"{ticker.strip().upper()}.AX"


# ─────────────────────────────────────────────────────────────
# Price history
# ─────────────────────────────────────────────────────────────

def fetch_history(tickers: list[str], period: str = HISTORY_PERIOD,
                  extra: list[str] | None = None) -> dict[str, pd.DataFrame]:
    """
    One long pull per ticker, sliced locally afterwards.

    Deliberately not one request per announcement or per day. The fetcher runs
    every ~5 minutes through the Sydney morning across ~300 tickers; asking
    Yahoo for each of those on each run would be throttled within the hour. A
    year of bars fetched once answers every question this module asks, for every
    announcement of the day, and for a backfill over past days too.
    """
    symbols = sorted({yahoo_symbol(t) for t in tickers if t})
    # `extra` takes symbols verbatim — an index like ^AXJO has no .AX suffix.
    symbols += [e for e in (extra or []) if e not in symbols]
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


def fetch_shares_outstanding(tickers: list[str],
                            cache_path: Path = FUNDAMENTALS_CACHE,
                            ttl_hours: int = FUNDAMENTALS_TTL_HOURS) -> dict[str, float]:
    """
    Shares on issue per Yahoo symbol, cached on disk for `ttl_hours`.

    Market cap is the one column here that price bars cannot produce, and
    yfinance has no bulk endpoint for the share count — it is a request per
    ticker. The fetcher runs every ~5 minutes across ~300 tickers, so without
    the cache this alone would be throttled inside the hour.

    Deliberately returns the SHARE COUNT rather than Yahoo's own market cap.
    Yahoo's figure is marked to the live price, which for a past date would
    fold the reaction to the news into the situation that preceded it — the
    look-ahead rule this module is built around. The count is multiplied by
    whichever close the context is being computed to, in compute_context().

    Missing entries are simply absent from the returned dict; a market cap that
    could not be established renders as blank, which is honest.
    """
    symbols = sorted({yahoo_symbol(t) for t in tickers if t})
    if not symbols:
        return {}

    cache: dict[str, dict] = {}
    try:
        cache = json.loads(cache_path.read_text(encoding='utf-8'))
    except (OSError, json.JSONDecodeError, ValueError):
        cache = {}

    now = datetime.now(timezone.utc)
    fresh: dict[str, float] = {}
    stale: list[str] = []
    for sym in symbols:
        entry = cache.get(sym) or {}
        shares = entry.get('shares')
        try:
            age_h = (now - datetime.fromisoformat(entry['fetched_at'])).total_seconds() / 3600
        except (KeyError, TypeError, ValueError):
            age_h = None
        if shares and age_h is not None and age_h < ttl_hours:
            fresh[sym] = float(shares)
        else:
            stale.append(sym)

    if stale:
        print(f"[fundamentals] refreshing {len(stale)} of {len(symbols)} share counts...")
    for sym in stale:
        shares = None
        try:
            info = yf.Ticker(sym).fast_info
            for key in ('shares', 'shares_outstanding', 'implied_shares_outstanding'):
                try:
                    v = info[key]
                except (KeyError, TypeError, AttributeError):
                    v = None
                if v and math.isfinite(float(v)) and float(v) > 0:
                    shares = float(v)
                    break
        except Exception:
            shares = None

        if shares:
            fresh[sym] = shares
            cache[sym] = {'shares': shares, 'fetched_at': now.isoformat()}
        elif (cache.get(sym) or {}).get('shares'):
            # A stale count beats an empty column: it is wrong by whatever was
            # issued since, not wrong by an order of magnitude.
            fresh[sym] = float(cache[sym]['shares'])

    try:
        cache_path.parent.mkdir(parents=True, exist_ok=True)
        cache_path.write_text(json.dumps(cache, indent=1, sort_keys=True), encoding='utf-8')
    except OSError as e:
        print(f"[fundamentals] cache not written: {e}")

    print(f"[fundamentals] share counts for {len(fresh)}/{len(symbols)} symbols.")
    return fresh


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


def _rsi(close: pd.Series, window: int = RSI_WINDOW) -> float | None:
    """
    Wilder's RSI to the last bar, or None when there is not enough history.

    Wilder's smoothing rather than a flat mean of the last 14 changes: the
    smoothed version is what every charting package draws, and a reader
    comparing this column against their own screen would otherwise find two
    different numbers with the same name.
    """
    if len(close) < window + 1:
        return None
    delta = close.diff().dropna()
    gain = delta.clip(lower=0.0)
    loss = (-delta).clip(lower=0.0)
    alpha = 1 / window
    avg_gain = gain.ewm(alpha=alpha, min_periods=window, adjust=False).mean().iloc[-1]
    avg_loss = loss.ewm(alpha=alpha, min_periods=window, adjust=False).mean().iloc[-1]
    if not (math.isfinite(avg_gain) and math.isfinite(avg_loss)):
        return None
    if avg_loss == 0:
        # No down days in the window. 100 when it has been rising, and for a
        # line that has not moved at all — a suspended or untraded stub — 50,
        # since "maximum strength" would be a lie about a flat price.
        return 100.0 if avg_gain > 0 else 50.0
    return round(100 - 100 / (1 + avg_gain / avg_loss), 2)


def _monthly_extremes(hist: pd.DataFrame, months: int = MONTHS_BACK) -> dict:
    """
    High and low for each of the last `months` blocks of MONTH_WINDOW bars.

    Month1 is the most recent block, Month2 the one before it, and so on back.
    Blocks of trading days rather than calendar months on purpose: these columns
    are read side by side, and a calendar month that happened to contain Easter
    is not comparable with one that did not.

    A partial block reads as None rather than as the few bars that exist. Four
    sessions labelled "Month3" next to two full months invites exactly the
    comparison that is not there.
    """
    out: dict[str, float | None] = {}
    for m in range(1, months + 1):
        end = len(hist) - (m - 1) * MONTH_WINDOW
        start = end - MONTH_WINDOW
        block = hist.iloc[start:end] if start >= 0 else None
        if block is None or len(block) < MONTH_WINDOW:
            out[f'month{m}_high'] = None
            out[f'month{m}_low'] = None
            continue
        out[f'month{m}_high'] = round(float(block['High'].max()), 4)
        out[f'month{m}_low'] = round(float(block['Low'].min()), 4)
    return out


def _beta(close: pd.Series, bench: pd.DataFrame | None, date_str: str) -> float | None:
    """
    Daily-return beta against the benchmark, over the sessions the two share.

    Computed from the history already in hand rather than read off Yahoo's
    profile: that figure is a 5-year monthly beta, it is missing for most of the
    small caps this feed is full of, and fetching it is a request per ticker.
    The benchmark is cut with bars_before() too, so a past date is measured
    against the index as it stood then.
    """
    if bench is None or bench.empty:
        return None
    b = bars_before(bench, date_str)
    if b is None or len(b) < MIN_BARS:
        return None

    pair = pd.concat(
        [close.pct_change().rename('stock'), b['Close'].pct_change().rename('bench')],
        axis=1, join='inner',
    ).replace([float('inf'), float('-inf')], pd.NA).dropna()
    if len(pair) < MIN_BARS:
        return None

    var = float(pair['bench'].var())
    if not math.isfinite(var) or var == 0:
        return None
    cov = float(pair['stock'].cov(pair['bench']))
    return round(cov / var, 3) if math.isfinite(cov) else None


def compute_context(df: pd.DataFrame | None, date_str: str,
                    bench: pd.DataFrame | None = None,
                    shares_outstanding: float | None = None) -> dict | None:
    """
    What the price was doing going into `date_str`, or None if it cannot be said.

    Returns None rather than a dict of nulls when there is too little history:
    a caller can then omit the whole block, which reads better than a row of
    dashes and cannot be mistaken for "nothing was happening".

    `bench` and `shares_outstanding` are optional because the two callers differ
    in what they can supply, and a beta or a market cap that is absent costs a
    column while a missing context costs the whole block. Both obey the same
    no-look-ahead rule as everything else: the benchmark is cut at the same
    date, and the share count is priced at the same close.
    """
    hist = bars_before(df, date_str)
    if hist is None or len(hist) < MIN_BARS:
        return None

    close = hist['Close']
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

    # Six months sits between the two windows that already existed. A stock can
    # be 20% off its 12-month high and still at the top of everything the last
    # half-year did, and neither of the other two windows shows that.
    h = hist.tail(HALF_WINDOW)
    h_high, h_low = float(h['High'].max()), float(h['Low'].min())

    # Explicitly the last 252 sessions, not "whatever was passed in". The live
    # fetcher hands over a year of bars and the two are the same thing, but
    # build_history.py pulls 2-3 years for its base rates — so every
    # `52w` field it wrote was really a 2-year extreme under a 52-week label.
    # Harmless while they were only percentages feeding a sentence; not harmless
    # now that a column headed "52W High" prints the level itself.
    y = hist.tail(YEAR_WINDOW)
    y_high, y_low = float(y['High'].max()), float(y['Low'].min())

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
    from_h_high = _pct(last_close, h_high)
    from_y_high = _pct(last_close, y_high)

    rsi = _rsi(close)
    beta = _beta(close, bench, date_str)
    # Priced at the close as REPORTED, not at full float precision. Otherwise
    # the close in one column times the share count does not give the market
    # cap in the next, and on a stock quoted at 0.008 that gap is visible.
    market_cap = (round(round(last_close, 4) * shares_outstanding, 2)
                  if shares_outstanding and math.isfinite(shares_outstanding) else None)

    return {
        # The date of the last bar used, so a reader knows what "recent" means
        # and can tell a quiet feed from a stale one.
        'as_of': hist.index[-1].date().isoformat(),
        'bars': int(len(hist)),
        'last_close': round(last_close, 4),

        # Priced at the close above rather than at today's, so a row about a
        # past announcement shows the company as it was sized that morning.
        'market_cap_aud': market_cap,
        'shares_outstanding': int(shares_outstanding) if shares_outstanding else None,
        'beta': beta,
        'rsi_14': rsi,

        # Volume. `trend` is the question actually asked — has it been building
        # over several days — rather than whether one day happened to be busy.
        'volume_trend_ratio': round(recent_vol / base_vol, 2) if base_vol > 0 else None,
        'volume_last_ratio': vol_multiple,
        'avg_turnover_aud': int(turnover) if math.isfinite(turnover) else None,
        'liquid': bool(math.isfinite(turnover) and turnover >= MIN_TURNOVER_AUD),

        # The same two facts as the ratios above, in the units a table wants:
        # shares rather than a multiple, and a percentage change rather than a
        # multiple of 1. Both measure the latest session against the 20-day
        # average, so a column and a chip can never disagree.
        'avg_volume_20': int(base_vol) if math.isfinite(base_vol) else None,
        'volume_change_pct': (round((vol_multiple - 1) * 100, 2)
                              if vol_multiple is not None else None),

        # Position. Negative percentages mean "below the high by this much".
        'pct_from_3m_high': from_q_high,
        'pct_from_3m_low': _pct(last_close, q_low),
        'pct_from_6m_high': from_h_high,
        'pct_from_6m_low': _pct(last_close, h_low),
        'pct_from_52w_high': from_y_high,
        'pct_from_52w_low': _pct(last_close, y_low),

        # The levels themselves. The percentages say how far off a high the
        # price is; a table also has to print the high.
        'high_52w': round(y_high, 4),
        'low_52w': round(y_low, 4),
        'high_3m': round(q_high, 4),
        'low_3m': round(q_low, 4),
        'high_6m': round(h_high, 4),
        'low_6m': round(h_low, 4),
        **_monthly_extremes(hist),
        'range_position_3m': range_pos,
        'at_3m_high': bool(from_q_high is not None and from_q_high >= -NEAR_PCT),
        'at_3m_low': bool(_pct(last_close, q_low) is not None and _pct(last_close, q_low) <= NEAR_PCT),
        'at_6m_high': bool(from_h_high is not None and from_h_high >= -NEAR_PCT),
        'at_6m_low': bool(_pct(last_close, h_low) is not None and _pct(last_close, h_low) <= NEAR_PCT),
        'at_52w_high': bool(from_y_high is not None and from_y_high >= -NEAR_PCT),
        'at_52w_low': bool(_pct(last_close, y_low) is not None and _pct(last_close, y_low) <= NEAR_PCT),

        'broke_out': broke_out,
    }


def liquidity_caveat(ctx: dict | None) -> str | None:
    """
    Why the numbers may not be worth much, or None if they are.

    Separate from describe() so each caller can place it: a card shows it as a
    footnote under the chips, a prompt appends it to the same line. Both need it
    — a 3x volume ratio on A$4,000 a day is two people, and reported without
    this it reads as institutional interest.
    """
    if not ctx or ctx.get('liquid'):
        return None
    t = ctx.get('avg_turnover_aud')
    return (f"thinly traded, median turnover about A${t:,}/day"
            if t is not None else "thinly traded")


def interpret(ctx: dict | None, ticker: str = '') -> list[str]:
    """
    What THIS stock's figures mean, in sentences, for the help tooltip.

    Distinct from describe(), which produces the chip labels. A chip says
    "volume 2.83x avg for 5 sessions"; this says what that combination implies
    for reading the announcement it sits above.

    The tooltip used to carry a generic explanation of the feature — what a
    20-day average is, why the date is yesterday's. Read once and useless
    thereafter, while the thing a reader actually wants is what these particular
    numbers say about this particular filing. The date is folded into the first
    sentence instead, which is the only part of that boilerplate that had to
    survive.

    Observation and mechanism only. "Buyers were competing before this was
    public" is what the tape shows; "so buy it" is not, and does not appear.
    Nothing here is an instruction.
    """
    if not ctx:
        return []

    who = ticker.upper() if ticker else 'The stock'
    out: list[str] = []

    trend = ctx.get('volume_trend_ratio')
    last = ctx.get('volume_last_ratio')

    # Sentence 1: the tape, dated, so nobody reads these as live prices.
    if ctx.get('broke_out'):
        out.append(
            f"Going into this, {who} closed above its {BREAKOUT_WINDOW}-day high on "
            f"{last}x the shares it normally trades — measured to the {ctx['as_of']} close, "
            f"before this announcement was public."
        )
    elif trend is not None and trend >= 1.5:
        out.append(
            f"Going into this, {who} traded {trend}x its usual daily volume over the last "
            f"{SHORT_WINDOW} sessions — measured to the {ctx['as_of']} close, before this "
            f"announcement was public."
        )
    elif trend is not None and trend <= 0.6:
        out.append(
            f"Going into this, {who} traded only {trend}x its usual daily volume over the "
            f"last {SHORT_WINDOW} sessions — measured to the {ctx['as_of']} close."
        )
    else:
        out.append(
            f"Volume into this was around normal, measured to the {ctx['as_of']} close."
        )

    # Sentence 2: where in its own range, and what that does to the reading.
    if ctx.get('at_52w_high'):
        out.append(
            "It was already at a 12-month high, so the market had been bidding it up "
            "regardless of this news — some of what the filing says may already be in the price."
        )
    elif ctx.get('at_3m_high') or ctx.get('broke_out'):
        out.append(
            "It was already at the top of its 3-month range, so it was running into this "
            "rather than reacting to it."
        )
    elif ctx.get('at_52w_low'):
        out.append(
            "It was at a 12-month low, so expectations going in were as low as they have "
            "been all year: bad news here may be largely expected, and good news lands on "
            "a market that had given up on it."
        )
    elif ctx.get('at_3m_low'):
        out.append("It was at the bottom of its 3-month range, already falling into this.")
    else:
        pos = ctx.get('range_position_3m')
        off = ctx.get('pct_from_3m_high')
        if pos is not None and off is not None:
            where = 'upper' if pos >= 0.66 else 'lower' if pos <= 0.33 else 'middle'
            out.append(
                f"The price sat in the {where} part of its 3-month range, "
                f"{abs(off)}% below the high of that period."
            )

    # Sentence 3: whether any of the above is worth anything.
    if not ctx.get('liquid'):
        t = ctx.get('avg_turnover_aud')
        out.append(
            f"Treat all of that with care: it trades about A${t:,} a day, so a volume "
            f"ratio here can be two or three trades rather than genuine interest."
            if t is not None else
            "Treat all of that with care: it is too thinly traded for the ratios to mean much."
        )

    return out


def describe(ctx: dict | None) -> list[str]:
    """
    The context as short factual clauses, for a prompt or a caption.

    Observations only. The illiquidity caveat deliberately does NOT live here:
    it is not something the price did, it is a warning about how much the other
    clauses are worth, and a caller needs to place it differently — the ASX card
    puts it under the chips, a prompt puts it inline. It was briefly the first
    note, which meant a consumer rendering `notes` as chips got a two-line
    sentence in a pill, crowding out the real signals, and phrased "the ratios
    below" for a layout that consumer did not have. Derive it from `liquid` and
    `avg_turnover_aud` instead — see liquidity_caveat().

    Only what is worth saying: a stock sitting mid-range on average volume gets
    an empty list, and a caller should say nothing rather than "volume normal,
    price unremarkable". Ordered loudest first.
    """
    if not ctx:
        return []

    out: list[str] = []

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

def _show(ticker: str, date_str: str, hist: dict[str, pd.DataFrame],
          shares: dict[str, float] | None = None) -> None:
    sym = yahoo_symbol(ticker)
    ctx = compute_context(hist.get(sym), date_str,
                          bench=hist.get(BENCHMARK_DEFAULT),
                          shares_outstanding=(shares or {}).get(sym))
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
        hist = fetch_history(tickers, extra=[BENCHMARK_DEFAULT])
        shares = fetch_shares_outstanding(tickers)

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

        print("")
        print("=== table columns are populated, not just present ===")
        c = compute_context(df, d2, bench=hist.get(BENCHMARK_DEFAULT),
                            shares_outstanding=shares.get(yahoo_symbol('BHP')))
        for k in ('rsi_14', 'beta', 'market_cap_aud', 'avg_volume_20',
                  'volume_change_pct', 'high_52w', 'low_52w',
                  'month1_high', 'month2_high', 'month3_high'):
            print(f"  {k:<18} {c.get(k)}")
        print(f"  RSI within 0-100      : {c['rsi_14'] is None or 0 <= c['rsi_14'] <= 100}")
        print(f"  52w high >= last close: {c['high_52w'] >= c['last_close']}")
        print(f"  52w low  <= last close: {c['low_52w'] <= c['last_close']}")

        for t in tickers:
            _show(t, args.date, hist, shares)
        return

    if not args.ticker:
        ap.error("--ticker is required unless --self-test")

    hist = fetch_history([args.ticker], extra=[BENCHMARK_DEFAULT])
    _show(args.ticker, args.date, hist, fetch_shares_outstanding([args.ticker]))


if __name__ == '__main__':
    main()
