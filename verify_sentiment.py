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
    (prev_close, close, session_date) for the session the news belongs to.

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
    return prev_close, close, target


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
            "session_date": None,
            "prev_close": None,
            "close": None,
            "return_pct": None,
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

        prev_close, close, session_date = move
        ret = (close / prev_close - 1) * 100

        idx_ret = 0.0
        bmove = session_move(bench, date_str, use_next)
        if bmove:
            idx_ret = (bmove[1] / bmove[0] - 1) * 100

        abnormal = ret - idx_ret
        row.update({
            "session_date": session_date,
            "prev_close": round(prev_close, 4),
            "close": round(close, 4),
            "return_pct": round(ret, 2),
            "index_return_pct": round(idx_ret, 2),
            "abnormal_pct": round(abnormal, 2),
            "verdict": verdict_for(a["sentiment"], abnormal),
        })
        results.append(row)

    return {
        "date": date_str,
        "generated_at": datetime.now(AEST).isoformat(),
        "benchmark": BENCHMARK,
        "threshold_pct": THRESHOLD_PCT,
        "stats": compute_stats(results),
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


def compute_stats(results: list[dict]) -> dict:
    """
    Hit rate counts only calls that cleared the dead band, so a quiet day
    cannot inflate the score. Conflicted tickers are excluded outright.
    """
    stats = {label: _blank() for label in SCORED_LABELS}
    moves: dict[str, list[float]] = {label: [] for label in SCORED_LABELS}

    for r in results:
        if r["conflict"] or r["verdict"] in ("no_data", "pending"):
            continue
        stats[r["sentiment"]][r["verdict"]] += 1
        moves[r["sentiment"]].append(r["abnormal_pct"])

    _finalise(stats, moves)
    # The number that actually matters: do the stocks we called bullish beat the
    # ones we called bearish? A high hit rate with no spread is not an edge.
    spread, hit_rate, dec = _headline(stats)

    return {
        "by_sentiment": stats,
        "spread_pct": spread,
        "directional_hit_rate": hit_rate,
        "directional_scored": dec,
        "pending": sum(1 for r in results if r["verdict"] == "pending"),
        "no_data": sum(1 for r in results if r["verdict"] == "no_data"),
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


def build_summary() -> dict:
    """Rolling all-time totals across every scorecard file."""
    stats = {label: _blank() for label in SCORED_LABELS}
    moves: dict[str, list[float]] = {label: [] for label in SCORED_LABELS}
    days = []

    for f in sorted(SCORECARD_DIR.glob("[0-9]*.json")):
        try:
            day = json.loads(f.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            continue
        for r in day.get("results", []):
            if r["conflict"] or r["verdict"] in ("no_data", "pending"):
                continue
            stats[r["sentiment"]][r["verdict"]] += 1
            moves[r["sentiment"]].append(r["abnormal_pct"])
        days.append({
            "date": day["date"],
            "hit_rate": day["stats"]["directional_hit_rate"],
            "scored": day["stats"]["directional_scored"],
            "spread_pct": day["stats"]["spread_pct"],
        })

    _finalise(stats, moves)
    spread, hit_rate, dec = _headline(stats)

    return {
        "generated_at": datetime.now(AEST).isoformat(),
        "days_scored": len(days),
        "benchmark": BENCHMARK,
        "threshold_pct": THRESHOLD_PCT,
        "by_sentiment": stats,
        "spread_pct": spread,
        "directional_hit_rate": hit_rate,
        "directional_scored": dec,
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
        if d != args.date and existing.exists():
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
