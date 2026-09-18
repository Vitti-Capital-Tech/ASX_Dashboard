"""
ASX Sentiment Scorecard
-----------------------
Grades the bullish/bearish/neutral calls in logs/<date>.json against what the
share price actually did that day, using Yahoo Finance end-of-day closes.

Runs after the ASX close. Writes scorecard/<date>.json plus a rolling
scorecard/summary.json for downstream consumers (dashboard, LinkedIn content,
other projects).

Usage:
    python verify_sentiment.py                  # today's AEST date
    python verify_sentiment.py --date 2026-09-04
    python verify_sentiment.py --backfill 5     # also re-resolve recent days
"""

import os
import json
import math
import argparse
import zoneinfo
from datetime import datetime, timedelta
from pathlib import Path

import pandas as pd
import yfinance as yf


def _env_or_default(key: str, default: str) -> str:
    """GitHub Actions often injects empty strings; treat those as unset."""
    v = (os.environ.get(key) or "").strip()
    return v if v else default


# ─────────────────────────────────────────────────────────────
# Config
# ─────────────────────────────────────────────────────────────

AEST = zoneinfo.ZoneInfo("Australia/Sydney")  # Handles AEST/AEDT automatically

ROOT          = Path(__file__).parent
LOGS_DIR      = ROOT / "logs"
SCORECARD_DIR = ROOT / "scorecard"

# S&P/ASX 200. Every move is measured NET of this, so a bullish call is not
# marked wrong just because the whole market fell that day.
BENCHMARK = _env_or_default("BENCHMARK", "^AXJO")

# Dead band. A move smaller than this is market noise, not a reaction to the
# news, so it counts as "flat" rather than a hit or a miss for the AI.
THRESHOLD_PCT = float(_env_or_default("SENTIMENT_THRESHOLD_PCT", "1.0"))

# ASX continuous trading: 10:00-16:00 local. Announcements before the open get
# the whole day's move; ones after the close belong to the NEXT session.
MARKET_OPEN_HOUR  = 10
MARKET_CLOSE_HOUR = 16

SCORED_LABELS = ("bullish", "bearish", "neutral")

# yfinance rejects very long ticker lists in one call.
CHUNK = 100

# How far back Yahoo serves 1-minute bars. Slightly under the documented 30 so
# a run near the boundary does not spend its requests discovering the edge.
VWAP_MAX_AGE_DAYS = 28


# ─────────────────────────────────────────────────────────────
# Price data
# ─────────────────────────────────────────────────────────────

def yahoo_symbol(ticker: str) -> str:
    """ASX ticker -> Yahoo symbol. BHP -> BHP.AX"""
    return f"{ticker.strip().upper()}.AX"


def fetch_prices(symbols: list[str], date_str: str) -> dict[str, pd.DataFrame]:
    """
    Daily bars spanning the target date, with enough lead-in to find the
    previous close across a long weekend, and enough trail to resolve
    post-close announcements against the next session.
    """
    target = datetime.strptime(date_str, "%Y-%m-%d").date()
    start = (target - timedelta(days=10)).isoformat()
    end   = (target + timedelta(days=5)).isoformat()

    out: dict[str, pd.DataFrame] = {}
    for i in range(0, len(symbols), CHUNK):
        chunk = symbols[i:i + CHUNK]
        print(f"[prices] fetching {i + 1}-{i + len(chunk)} of {len(symbols)}...")
        try:
            raw = yf.download(
                chunk, start=start, end=end,
                group_by="ticker", auto_adjust=False,
                progress=False, threads=True,
            )
        except Exception as e:
            print(f"[prices] chunk failed: {e}")
            continue

        if raw is None or raw.empty:
            continue

        for sym in chunk:
            try:
                df = raw[sym] if isinstance(raw.columns, pd.MultiIndex) else raw
                df = df.dropna(subset=["Close"])
                if not df.empty:
                    out[sym] = df
            except (KeyError, TypeError):
                continue

    print(f"[prices] got bars for {len(out)}/{len(symbols)} symbols.")
    return out


def session_move(df, date_str: str, use_next: bool):
    """
    (prev_close, open, close, session_date) for the session the news belongs to.

    Bars come straight from the exchange calendar, so public holidays and
    long weekends resolve themselves - we never guess which day traded.
    Returns None when the session has not printed yet (post-close news on
    the evening of the run) or the stock was halted / suspended.
    """
    if df is None or df.empty:
        return None

    days = [d.date().isoformat() for d in df.index]
    target = date_str

    if use_next:
        later = [d for d in days if d > target]
        if not later:
            return None          # next session has not happened yet -> pending
        target = later[0]

    if target not in days:
        return None              # no bar: halt, suspension, or holiday

    idx = days.index(target)
    if idx == 0:
        return None              # no previous close inside the window

    prev_close = float(df["Close"].iloc[idx - 1])
    close      = float(df["Close"].iloc[idx])
    if prev_close <= 0:
        return None

    # The open can be missing on a thin stock where the daily bar was built
    # from a single late trade. None rather than falling back to the close,
    # which would silently report an open-to-close move of zero.
    try:
        op = float(df["Open"].iloc[idx])
        if not math.isfinite(op) or op <= 0:
            op = None
    except (KeyError, TypeError, ValueError):
        op = None

    return prev_close, op, close, target


def fetch_vwap(symbols: list[str], session_dates: set[str]) -> dict[tuple[str, str], float]:
    """
    Volume-weighted average price per (symbol, session), from 1-minute bars.

    ── Why intraday, and what that costs ──────────────────────────────────────
    A daily bar carries no VWAP, and the usual stand-in — (high + low + close)/3
    — is not volume weighted at all. On a stock that gapped and then traded all
    day at the other end of its range those two answer different questions, and
    the whole point of the column is to say where the volume actually went.

    The price of being honest about it is history: Yahoo serves 1-minute bars
    for roughly the last 30 days only. Beyond that the VWAP is simply absent,
    and every consumer renders it as a dash rather than substituting a proxy
    that would quietly mean something else in older rows. A scorecard re-run
    over an old date cannot recover it.

    Failure is an empty dict, never an exception: VWAP is a column, and the
    scorecard's verdicts do not depend on it.
    """
    out: dict[tuple[str, str], float] = {}
    if not symbols or not session_dates:
        return out

    # Yahoo's 1-minute window is about 30 days. Asking for an older session is
    # not a slow path, it is a guaranteed miss — and on a --force backfill over
    # months of scorecards it is hundreds of pointless chunk requests against a
    # host that rate-limits. Skipped with a line saying so, rather than
    # silently returning nothing.
    oldest = (datetime.now(AEST).date() - timedelta(days=VWAP_MAX_AGE_DAYS))

    for session in sorted(session_dates):
        try:
            day = datetime.strptime(session, "%Y-%m-%d").date()
        except ValueError:
            continue

        if day < oldest:
            print(f"[vwap] {session}: older than {VWAP_MAX_AGE_DAYS}d, "
                  f"outside Yahoo's intraday window - skipped.")
            continue

        # Yahoo's `end` is exclusive, so one session is [day, day+1).
        start, end = day.isoformat(), (day + timedelta(days=1)).isoformat()

        for i in range(0, len(symbols), CHUNK):
            chunk = symbols[i:i + CHUNK]
            print(f"[vwap] {session}: {i + 1}-{i + len(chunk)} of {len(symbols)}...")
            try:
                raw = yf.download(
                    chunk, start=start, end=end, interval="1m",
                    group_by="ticker", auto_adjust=False,
                    progress=False, threads=True,
                )
            except Exception as e:
                print(f"[vwap] chunk failed: {e}")
                continue

            if raw is None or raw.empty:
                continue

            for sym in chunk:
                try:
                    df = raw[sym] if isinstance(raw.columns, pd.MultiIndex) else raw
                    df = df.dropna(subset=["Close", "Volume"])
                    vol = df["Volume"].astype(float)
                    traded = float(vol.sum())
                    if traded <= 0:
                        continue
                    # Typical price per MINUTE, weighted by that minute's volume.
                    # This is the standard construction; the approximation it
                    # replaces applies the same formula to the whole day at once,
                    # which is a different number entirely.
                    typical = (df["High"].astype(float)
                               + df["Low"].astype(float)
                               + df["Close"].astype(float)) / 3
                    v = float((typical * vol).sum() / traded)
                    if math.isfinite(v) and v > 0:
                        out[(sym, session)] = round(v, 4)
                except (KeyError, TypeError, ValueError):
                    continue

    print(f"[vwap] computed for {len(out)} symbol-sessions.")
    return out


# ─────────────────────────────────────────────────────────────
# Scoring
# ─────────────────────────────────────────────────────────────

def bucket_of(ann: dict) -> str:
    """pre_open | intraday | post_close, in Sydney local time."""
    raw = ann.get("time") or ""
    try:
        dt = datetime.fromisoformat(raw.replace("Z", "+00:00")).astimezone(AEST)
    except ValueError:
        return "pre_open"        # unparseable: treat as same-session news
    if dt.hour < MARKET_OPEN_HOUR:
        return "pre_open"
    if dt.hour < MARKET_CLOSE_HOUR:
        return "intraday"
    return "post_close"


def verdict_for(sentiment: str, abnormal_pct: float) -> str:
    """
    correct / wrong / flat, judged on the market-adjusted move.

    A neutral call is "correct" when the stock did NOT move materially - that
    is exactly what neutral predicts, and it makes neutral a fair control
    group rather than a free pass.
    """
    if abs(abnormal_pct) < THRESHOLD_PCT:
        return "correct" if sentiment == "neutral" else "flat"
    if sentiment == "neutral":
        return "wrong"
    went_up = abnormal_pct > 0
    return "correct" if went_up == (sentiment == "bullish") else "wrong"


# Which call survives when one ticker filed several times in a session. A
# directional call outranks a neutral one: "Change of Director's Interest
# Notice" is procedural noise filed beside the announcement that actually said
# something, and scoring the day as neutral because four such notices
# outnumbered one bearish call measures the paperwork, not the judgement.
_CALL_RANK = {"bullish": 2, "bearish": 2, "neutral": 1}


def _representative(rows: list[dict]) -> dict:
    """The announcement a merged row should show, out of several."""
    return sorted(
        rows,
        key=lambda r: (
            _CALL_RANK.get(r["sentiment"], 0),
            1 if r.get("market_sensitive") else 0,
            r.get("time") or "",
        ),
        reverse=True,
    )[0]


def merge_by_ticker(rows: list[dict]) -> list[dict]:
    """
    One row per ticker per session, instead of one per announcement.

    ── The bug this fixes ─────────────────────────────────────────────────────
    Every announcement was scored against the same closing price, so a ticker
    that filed seven times cast seven votes on one price move. ABX filed five
    times into a single -18.36% session and the bearish hit rate counted five
    correct calls; BCM's five procedural notices and two bearish ones split one
    -3.35% move into five wrong and two correct. Across the scorecards 25% of
    rows were repeats of a ticker already counted.

    That is not a display quirk. A hit rate is a count of independent
    judgements, and these were never independent: one stock, one move, one
    outcome. Merging makes each ticker-session worth exactly one vote.

    Grouped by (ticker, session_date) rather than ticker alone, because
    post-close news is scored against the NEXT session and must not be folded
    into the same day's calls. Unpriced rows keep their own grouping key so a
    pending row never merges with a settled one.
    """
    groups: dict[tuple, list[dict]] = {}
    order: list[tuple] = []
    for r in rows:
        key = (r["ticker"], r.get("session_date"), r["verdict"] in ("pending", "no_data"))
        if key not in groups:
            groups[key] = []
            order.append(key)
        groups[key].append(r)

    merged = []
    for key in order:
        rows_in = groups[key]
        if len(rows_in) == 1:
            row = dict(rows_in[0])
            row["announcements"] = 1
            row["also"] = []
            merged.append(row)
            continue

        rep = _representative(rows_in)
        row = dict(rep)
        row["announcements"] = len(rows_in)
        # Every other headline this ticker filed that session, so merging hides
        # nothing — the table can list them under the row it kept.
        row["also"] = [r["headline"] for r in rows_in if r is not rep]
        # The flag is about the ticker's day, not one filing, so it survives
        # any merge: a ticker called both ways cannot be settled by one close.
        row["conflict"] = any(r.get("conflict") for r in rows_in)
        merged.append(row)

    return merged


def score_day(date_str: str) -> dict:
    log_path = LOGS_DIR / f"{date_str}.json"
    if not log_path.exists():
        raise FileNotFoundError(f"No log for {date_str} - run fetch_asx.py first.")

    log = json.loads(log_path.read_text(encoding="utf-8"))
    anns = [a for a in log.get("announcements", [])
            if (a.get("sentiment") or "") in SCORED_LABELS]
    print(f"[score] {date_str}: {len(anns)} labelled announcements.")

    # A ticker carrying both a bullish and a bearish call the same day cannot be
    # settled by one closing price, so those are flagged and kept out of the
    # headline hit rate.
    seen: dict[str, set[str]] = {}
    for a in anns:
        seen.setdefault(a.get("ticker", ""), set()).add(a["sentiment"])
    conflicted = {t for t, s in seen.items() if "bullish" in s and "bearish" in s}

    symbols = sorted({yahoo_symbol(a["ticker"]) for a in anns if a.get("ticker")})
    prices = fetch_prices(symbols + [BENCHMARK], date_str)
    bench = prices.get(BENCHMARK)

    results = []
    for a in anns:
        ticker = (a.get("ticker") or "").strip().upper()
        bucket = bucket_of(a)
        use_next = bucket == "post_close"

        # Straight from the log's own context block, which the fetcher already
        # computed from bars that closed BEFORE the announcement. Copied rather
        # than recomputed so the accuracy tab and the feed cannot disagree
        # about the same stock, and so "was this tradeable size" can be asked
        # of a result without loading a second file.
        ctx = a.get("market_context") or {}

        row = {
            "ticker": ticker,
            "company": a.get("company", ""),
            "headline": a.get("headline", ""),
            "url": a.get("url", ""),
            "time": a.get("time", ""),
            "document_type": a.get("document_type", ""),
            "market_sensitive": bool(a.get("market_sensitive")),
            "sentiment": a["sentiment"],
            "bucket": bucket,
            "conflict": ticker in conflicted,
            "tags": a.get("tags") or [],
            "avg_turnover_aud": ctx.get("avg_turnover_aud"),
            "liquid": ctx.get("liquid"),
            "avg_volume_20": ctx.get("avg_volume_20"),
            "rsi_14": ctx.get("rsi_14"),
            "market_cap_aud": ctx.get("market_cap_aud"),
            "session_date": None,
            "prev_close": None,
            "open": None,
            "vwap": None,
            # How much of the move was already gone at the open. The number an
            # intraday plan lives or dies on: news read pre-market cannot be
            # traded until the open, so anything inside the gap is not
            # capturable, only observable.
            "gap_pct": None,
            "intraday_verdict": "no_data",
            "close": None,
            "return_pct": None,
            "open_close_pct": None,
            "index_return_pct": None,
            "abnormal_pct": None,
            "verdict": "no_data",
        }

        move = session_move(prices.get(yahoo_symbol(ticker)), date_str, use_next)
        if move is None:
            # Post-close news on the evening of the run has no next session yet;
            # a later run picks it up. Anything else is a halt or suspension.
            row["verdict"] = "pending" if use_next else "no_data"
            results.append(row)
            continue

        prev_close, op, close, session_date = move
        ret = (close / prev_close - 1) * 100

        idx_ret = 0.0
        bmove = session_move(bench, date_str, use_next)
        if bmove:
            idx_ret = (bmove[2] / bmove[0] - 1) * 100

        abnormal = ret - idx_ret
        row.update({
            "session_date": session_date,
            "prev_close": round(prev_close, 4),
            "open": round(op, 4) if op else None,
            "close": round(close, 4),
            "return_pct": round(ret, 2),
            # The session's own move, with the overnight gap excluded. Reported
            # beside `return_pct` rather than instead of it: 69% of these
            # filings land before the open, and for those the reaction IS the
            # gap — measuring from the open would miss the event and report the
            # drift that followed it.
            "open_close_pct": round((close / op - 1) * 100, 2) if op else None,
            "gap_pct": round((op / prev_close - 1) * 100, 2) if op else None,
            "index_return_pct": round(idx_ret, 2),
            "abnormal_pct": round(abnormal, 2),
            "verdict": verdict_for(a["sentiment"], abnormal),
            # Raw, not index-adjusted, unlike `verdict`. A trader who buys at
            # the open and sells at the close banks the raw move; subtracting
            # the index would describe a hedged position nobody here is
            # running. Same dead band, so the two verdicts stay comparable.
            "intraday_verdict": (
                verdict_for(a["sentiment"], (close / op - 1) * 100)
                if op else "no_data"
            ),
        })
        results.append(row)

    # VWAP last: it needs the sessions the rows actually resolved to, and it is
    # the one figure whose absence costs a column rather than a verdict.
    sessions = {r["session_date"] for r in results if r.get("session_date")}
    priced = sorted({yahoo_symbol(r["ticker"]) for r in results if r.get("session_date")})
    try:
        vwaps = fetch_vwap(priced, sessions)
    except Exception as e:
        print(f"[vwap] unavailable, continuing without it: {e}")
        vwaps = {}
    for r in results:
        if r.get("session_date"):
            r["vwap"] = vwaps.get((yahoo_symbol(r["ticker"]), r["session_date"]))

    results = merge_by_ticker(results)
    print(f"[score] {date_str}: {len(results)} rows after merging by ticker.")

    return {
        "date": date_str,
        "generated_at": datetime.now(AEST).isoformat(),
        "benchmark": BENCHMARK,
        "threshold_pct": THRESHOLD_PCT,
        "stats": compute_stats(results),
        # The same day graded on what a trader could have captured. A separate
        # block rather than a replacement: the two answer different questions,
        # and on this data they disagree sharply — the edge is mostly inside
        # the gap, which is exactly what a reader needs to be able to see.
        "intraday_stats": compute_stats(results, "intraday_verdict", "open_close_pct"),
        "highlights": compute_highlights(results),
        "results": results,
    }


# ─────────────────────────────────────────────────────────────
# Stats
# ─────────────────────────────────────────────────────────────

def _blank() -> dict:
    return {"scored": 0, "correct": 0, "wrong": 0, "flat": 0,
            "hit_rate": None, "avg_abnormal_pct": None}


def _finalise(stats: dict, moves: dict) -> None:
    """Turn raw counts into hit rates and average moves, in place."""
    for label, s in stats.items():
        decided = s["correct"] + s["wrong"]
        s["scored"] = decided + s["flat"]
        s["hit_rate"] = round(s["correct"] / decided * 100, 1) if decided else None
        s["avg_abnormal_pct"] = (
            round(sum(moves[label]) / len(moves[label]), 2) if moves[label] else None
        )


def _headline(stats: dict) -> tuple:
    """(spread_pct, directional_hit_rate, directional_scored)"""
    bull = stats["bullish"]["avg_abnormal_pct"]
    bear = stats["bearish"]["avg_abnormal_pct"]
    spread = round(bull - bear, 2) if bull is not None and bear is not None else None

    dec = sum(stats[l]["correct"] + stats[l]["wrong"] for l in ("bullish", "bearish"))
    cor = sum(stats[l]["correct"] for l in ("bullish", "bearish"))
    return spread, (round(cor / dec * 100, 1) if dec else None), dec


def compute_stats(results: list[dict],
                  verdict_key: str = "verdict",
                  move_key: str = "abnormal_pct") -> dict:
    """
    Hit rate counts only calls that cleared the dead band, so a quiet day
    cannot inflate the score. Conflicted tickers are excluded outright.

    Parameterised over which measure settles a call, because the tab now asks
    the question two ways. The default pair grades the market-adjusted move
    from the previous close, which is the AI's forecast skill. Passing
    `intraday_verdict`/`open_close_pct` grades the move from the OPEN, which is
    the part a trader who reads the news pre-market can actually capture — the
    overnight gap is gone before they can act on it.
    """
    stats = {label: _blank() for label in SCORED_LABELS}
    moves: dict[str, list[float]] = {label: [] for label in SCORED_LABELS}

    for r in results:
        if r["conflict"] or r.get(verdict_key) in ("no_data", "pending", None):
            continue
        move = r.get(move_key)
        if move is None:
            continue
        stats[r["sentiment"]][r[verdict_key]] += 1
        moves[r["sentiment"]].append(move)

    _finalise(stats, moves)
    # The number that actually matters: do the stocks we called bullish beat the
    # ones we called bearish? A high hit rate with no spread is not an edge.
    spread, hit_rate, dec = _headline(stats)

    return {
        "by_sentiment": stats,
        "spread_pct": spread,
        "directional_hit_rate": hit_rate,
        "directional_scored": dec,
        # `.get`, because build_summary() reads every scorecard on disk and the
        # older ones were written before this basis existed. A missing verdict
        # counts as neither pending nor no_data — it is simply not gradeable
        # this way, which the row count already reflects.
        "pending": sum(1 for r in results if r.get(verdict_key) == "pending"),
        "no_data": sum(1 for r in results if r.get(verdict_key) == "no_data"),
        "conflicts": sum(1 for r in results if r["conflict"]),
    }


def compute_highlights(results: list[dict], n: int = 5) -> dict:
    """Biggest hits and misses - the raw material for social posts."""
    decided = [r for r in results
               if not r["conflict"] and r["sentiment"] in ("bullish", "bearish")
               and r["verdict"] in ("correct", "wrong")]

    def top(verdict):
        rows = sorted((r for r in decided if r["verdict"] == verdict),
                      key=lambda r: abs(r["abnormal_pct"]), reverse=True)[:n]
        return [{k: r[k] for k in
                 ("ticker", "company", "headline", "sentiment",
                  "abnormal_pct", "return_pct", "url")} for r in rows]

    return {"best_calls": top("correct"), "worst_calls": top("wrong")}


def _by_document_type(rows: list[dict], min_calls: int = 5) -> list[dict]:
    """
    Directional accuracy per document type, on both bases.

    Types below `min_calls` settled calls are dropped rather than published
    with a hit rate: one call at 100% outranks eleven at 73% in any sort, and
    the resulting list is a ranking of small samples.
    """
    groups: dict[str, list[dict]] = {}
    for r in rows:
        if r.get("sentiment") == "neutral":
            continue
        groups.setdefault((r.get("document_type") or "Other").strip() or "Other", []).append(r)

    out = []
    for name, rs in groups.items():
        full = compute_stats(rs)
        intra = compute_stats(rs, "intraday_verdict", "open_close_pct")
        if full["directional_scored"] < min_calls:
            continue
        out.append({
            "document_type": name,
            "scored": full["directional_scored"],
            "hit_rate": full["directional_hit_rate"],
            "intraday_scored": intra["directional_scored"],
            "intraday_hit_rate": intra["directional_hit_rate"],
            # Signed by the call, so bullish and bearish are comparable and a
            # bearish call that came good reads as a win.
            "intraday_avg_as_called": _avg_as_called(rs, "open_close_pct"),
            "avg_as_called": _avg_as_called(rs, "abnormal_pct"),
        })
    return sorted(out, key=lambda x: x["scored"], reverse=True)


def _avg_as_called(rows: list[dict], move_key: str) -> float | None:
    vals = []
    for r in rows:
        v = r.get(move_key)
        if v is None or r.get("conflict"):
            continue
        vals.append(-v if r["sentiment"] == "bearish" else v)
    return round(sum(vals) / len(vals), 2) if vals else None


def build_summary() -> dict:
    """
    Rolling all-time totals across every scorecard file, on both bases.

    Every scorecard's rows are read rather than its precomputed stats, because
    the all-time figure has to be a count over calls, not an average of daily
    averages — a 12-call day and a 300-call day do not carry equal weight.
    """
    rows: list[dict] = []
    days = []

    for f in sorted(SCORECARD_DIR.glob("[0-9]*.json")):
        try:
            day = json.loads(f.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            continue
        rows.extend(day.get("results", []))
        intra = day.get("intraday_stats") or {}
        days.append({
            "date": day["date"],
            "hit_rate": day["stats"]["directional_hit_rate"],
            "scored": day["stats"]["directional_scored"],
            "spread_pct": day["stats"]["spread_pct"],
            "intraday_hit_rate": intra.get("directional_hit_rate"),
            "intraday_scored": intra.get("directional_scored"),
        })

    full = compute_stats(rows)
    intraday = compute_stats(rows, "intraday_verdict", "open_close_pct")
    by_type = _by_document_type(rows)

    return {
        "generated_at": datetime.now(AEST).isoformat(),
        "days_scored": len(days),
        "benchmark": BENCHMARK,
        "threshold_pct": THRESHOLD_PCT,
        "by_sentiment": full["by_sentiment"],
        "spread_pct": full["spread_pct"],
        "directional_hit_rate": full["directional_hit_rate"],
        "directional_scored": full["directional_scored"],
        # The same calls graded on the move from the open. Kept as its own
        # block so a reader can see the gap between the two rather than being
        # handed one number and told which question it answers.
        "intraday": {
            "by_sentiment": intraday["by_sentiment"],
            "spread_pct": intraday["spread_pct"],
            "directional_hit_rate": intraday["directional_hit_rate"],
            "directional_scored": intraday["directional_scored"],
        },
        # Per announcement type, both bases. Computed here rather than in the
        # browser because the answer spans every scorecard on disk, and the tab
        # is handed one day plus this file. It is what lets a morning list say
        # "this kind of filing has kept running after the open 8 times out of
        # 11" beside a ticker, instead of only what the AI thinks of it.
        "by_document_type": by_type,
        "daily": days[-60:],
    }


# ─────────────────────────────────────────────────────────────
# Entry point
# ─────────────────────────────────────────────────────────────

def save(payload: dict, name: str) -> Path:
    SCORECARD_DIR.mkdir(exist_ok=True)
    path = SCORECARD_DIR / name
    path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    return path


def main():
    parser = argparse.ArgumentParser(
        description="Score ASX sentiment calls against actual closes")
    parser.add_argument("--date", default=datetime.now(AEST).strftime("%Y-%m-%d"),
                        help="Trading date to score (YYYY-MM-DD), defaults to today AEST")
    parser.add_argument("--backfill", type=int, default=3,
                        help="Also re-score the N previous days, to resolve pending post-close news")
    parser.add_argument("--force", action="store_true",
                        help="Re-score every day in range even if nothing is pending. "
                             "Needed after a scoring change — the default skips a settled "
                             "day, so a merge or a new column would never reach history.")
    args = parser.parse_args()

    target = datetime.strptime(args.date, "%Y-%m-%d").date()

    # Today first, so the day everyone is waiting on lands even if an older
    # re-score fails.
    dates = [args.date]
    for i in range(1, args.backfill + 1):
        d = (target - timedelta(days=i)).isoformat()
        if (LOGS_DIR / f"{d}.json").exists():
            dates.append(d)

    scored_any = False
    for d in dates:
        existing = SCORECARD_DIR / f"{d}.json"
        if d != args.date and existing.exists() and not args.force:
            # Only revisit an older day if something is still unresolved.
            try:
                prev = json.loads(existing.read_text(encoding="utf-8"))
                if prev.get("stats", {}).get("pending", 0) == 0:
                    continue
            except (json.JSONDecodeError, OSError):
                pass
        try:
            payload = score_day(d)
        except FileNotFoundError as e:
            print(f"[skip] {e}")
            continue
        except Exception as e:
            print(f"[error] {d}: {e}")
            continue

        path = save(payload, f"{d}.json")
        st = payload["stats"]
        print(f"[done] {path.name}: {st['directional_scored']} directional calls, "
              f"hit rate {st['directional_hit_rate']}%, spread {st['spread_pct']}%, "
              f"{st['pending']} pending, {st['no_data']} no data.")
        scored_any = True

    if scored_any:
        s = build_summary()
        save(s, "summary.json")
        print(f"[summary] {s['days_scored']} days, all-time hit rate "
              f"{s['directional_hit_rate']}% over {s['directional_scored']} calls.")


if __name__ == "__main__":
    main()
