"""
ASX Daily Announcement Fetcher
--------------------------------
Fetches all ASX announcements for today via the ASX Market Announcements RSS feed,
generates bullet-point summaries using Anthropic Claude (with Groq failover), and saves a dated JSON log to logs/.

Usage:
    python fetch_asx.py [--date YYYY-MM-DD]  (defaults to today)
    python fetch_asx.py --no-ai              (skip AI, useful for testing)
"""

import os
import json
import time
import argparse
import re
import requests
import xml.etree.ElementTree as ET
from datetime import datetime, timezone, timedelta
from pathlib import Path
from dotenv import load_dotenv
from anthropic import Anthropic
from groq import Groq

# Load environment variables from .env if present
load_dotenv()


def _env_or_default(key: str, default: str) -> str:
    """GitHub Actions often injects empty strings; treat those as unset."""
    v = (os.environ.get(key) or "").strip()
    return v if v else default


# ─────────────────────────────────────────────────────────────
# Config
# ─────────────────────────────────────────────────────────────

ANTHROPIC_API_KEY = (os.environ.get("ANTHROPIC_API_KEY") or "").strip()
ANTHROPIC_MODEL   = _env_or_default("ANTHROPIC_MODEL", "claude-opus-4-6")
GROQ_API_KEY      = (os.environ.get("GROQ_API_KEY") or "").strip()
# llama3-70b-8192 was retired; see https://console.groq.com/docs/deprecations
GROQ_MODEL        = _env_or_default("GROQ_MODEL", "llama-3.3-70b-versatile")

AEST = timezone(timedelta(hours=11))
MARKET_SENSITIVE_ONLY = True  # Only process Alpha news (Price Sensitive, Halts, Placements)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    ),
    "Accept": "application/rss+xml, application/xml, text/xml, */*",
    "Referer": "https://www.asx.com.au/",
}

# ASX Market Announcements Platform API
ASX_JSON_URL = "https://asx.api.markitdigital.com/asx-research/1.0/markets/announcements?entityXids=%5B%5D&page=0&itemsPerPage=500"
ASX_PDF_URL_BASE = "https://cdn-api.markitdigital.com/apiman-gateway/ASX/asx-research/1.0/file/"

KNOWN_TAGS = [
    "Results", "AGM", "Capital Raise", "Dividend",
    "Quarterly", "Production", "Merger & Acquisition",
    "Board Change", "Trading Halt", "Substantial Holding",
    "Compliance", "Mining", "Healthcare", "Technology",
    "Finance", "Energy", "Property", "Retail", "Other",
]

SENTIMENT_VALUES = frozenset({"bullish", "bearish", "neutral"})

LOGS_DIR = Path(__file__).parent / "logs"


# ─────────────────────────────────────────────────────────────
# Fetch from API
# ─────────────────────────────────────────────────────────────

def fetch_announcements(date_str: str, retries: int = 3) -> list[dict]:
    """
    Fetch ASX announcements from the MarkitDigital API and
    filter to announcements released on `date_str` (YYYY-MM-DD in AEST).
    """
    for attempt in range(1, retries + 1):
        print(f"[fetch] Attempt {attempt}/{retries}: GET {ASX_JSON_URL.split('?')[0]}")
        try:
            resp = requests.get(ASX_JSON_URL, headers=HEADERS, timeout=60)
            resp.raise_for_status()
            
            data = resp.json()
            items = data.get("data", {}).get("items", [])
            print(f"[fetch] Success. Downloaded {len(items)} raw announcements")
            
            filtered = []
            for item in items:
                raw_date = item.get("date", "")
                if not raw_date: continue
                
                # Parse "2026-03-25T02:30:11.000Z"
                try:
                    dt_utc = datetime.strptime(raw_date[:19], "%Y-%m-%dT%H:%M:%S").replace(tzinfo=timezone.utc)
                except ValueError:
                    continue
                
                dt_aest = dt_utc.astimezone(AEST)
                if dt_aest.strftime("%Y-%m-%d") != date_str:
                    continue
                
                market_sensitive = bool(item.get("isPriceSensitive", False))
                headline = item.get("headline", "").strip()
                
                # ─── NOISE FILTER ───
                # If True, skip all Admin noise (Director listings, minor Appendix updates, etc.)
                if MARKET_SENSITIVE_ONLY:
                    h = headline.lower()
                    is_halt = "trading halt" in h or "suspension" in h or "pause in trading" in h
                    is_substantial = "substantial hold" in h
                    if not (market_sensitive or is_halt or is_substantial):
                        continue

                ticker = item.get("symbol", "")
                company = ticker
                company_info = item.get("companyInfo", [])
                if company_info and len(company_info) > 0:
                    company = company_info[0].get("displayName", ticker)
                    
                headline = item.get("headline", "").strip()
                document_key = item.get("documentKey", "")
                pdf_url = f"{ASX_PDF_URL_BASE}{document_key}" if document_key else ""
                market_sensitive = item.get("isPriceSensitive", False)
                
                filtered.append({
                    "ticker":           ticker[:6],
                    "company":          company,
                    "headline":         headline,
                    "time":             dt_utc.isoformat(),
                    "url":              pdf_url,
                    "market_sensitive": bool(market_sensitive),
                    "document_type":    _guess_doc_type(headline),
                    "summary":          [],
                    "tags":             [],
                })
                
            print(f"[fetch] Filtering complete. Found {len(filtered)} matching {date_str} in AEST.")
            return filtered
            
        except Exception as e:
            print(f"[fetch] Attempt {attempt} failed: {e}")
            if attempt < retries:
                wait = attempt * 3
                print(f"[fetch] Retrying in {wait}s...")
                time.sleep(wait)
            else:
                print("[fetch] All retry attempts failed.")
    return []


def _guess_doc_type(title: str) -> str:
    t = title.lower()
    if "quarterly" in t:           return "Quarterly Report"
    if "half year" in t or "1h " in t or "2h " in t: return "Half Yearly Report"
    if "annual" in t and "report" in t: return "Annual Report"
    if "agm" in t or "annual general" in t: return "Annual General Meeting"
    if "dividend" in t:            return "Dividend"
    if "trading halt" in t:        return "Trading Halt"
    if "capital raise" in t or "placement" in t or "entitlement" in t: return "Capital Raise"
    if "acquisition" in t or "merger" in t or "takeover" in t: return "Merger & Acquisition"
    if "director" in t or "change of" in t: return "Director Notice"
    if "substantial hold" in t:    return "Substantial Holding"
    if "results" in t:             return "Results"
    return "Market Update"


# ─────────────────────────────────────────────────────────────
# AI Summarisation & Failover
# ─────────────────────────────────────────────────────────────

def build_prompt(headline: str, company: str, doc_type: str, market_sensitive: bool) -> str:
    sensitivity = "MARKET SENSITIVE" if market_sensitive else "not market sensitive"
    tags_list   = ", ".join(KNOWN_TAGS)
    return f"""You are a senior financial analyst and news editor specializing in the ASX (Australian Securities Exchange).
Your goal is to provide high-signal, professional insight for institutional investors.

Announcement details:
- Company: {company}
- Headline: {headline}
- Document Type: {doc_type}
- Market Sensitive: {sensitivity}

TASKS:
1. MANDATORY: provide EXACTLY 3 high-impact bullet points. 
2. INSIGHT: Focus on the "so what?" (e.g. cash runway, revenue growth, or technical significance).
3. TAGS: Select 1-3 relevant categories from this list ONLY: {tags_list}
4. SENTIMENT: Classify expected near-term share-price bias for this headline ONLY as exactly one of: bullish, bearish, neutral.
   - bullish: net positive for valuation or sentiment (e.g. strong results, accretive deal, favourable outcome)
   - bearish: net negative (e.g. large loss, dilution, downgrade, covenant breach, major impairment)
   - neutral: procedural, administrative, unclear impact, or balanced / wait-for-detail (use when not clearly bullish or bearish)

Strict Output Format (JSON ONLY):
{{
  "summary": [
    "Insightful point 1 - focus on impact",
    "Insightful point 2 - focus on numbers/results",
    "Insightful point 3 - focus on next steps/outlook"
  ],
  "tags": ["Category 1", "Category 2"],
  "sentiment": "bullish"
}}"""


def _call_ai_one(client, model: str, prompt: str, provider: str) -> dict:
    """Make a single AI call to either Anthropic or Groq."""
    if provider == 'anthropic':
        resp = client.messages.create(
            model=model,
            max_tokens=600,
            temperature=0.4,
            messages=[{"role": "user", "content": prompt}],
        )
        raw = ""
        for block in resp.content:
            if hasattr(block, 'text'): raw += block.text
    else:  # groq
        resp = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=model,
            temperature=0.4,
            max_tokens=600,
            response_format={"type": "json_object"}
        )
        raw = resp.choices[0].message.content

    # Clean JSON
    raw = raw.strip()
    if raw.startswith("```json"):
        raw = raw.split("```json")[1].split("```")[0].strip()
    elif raw.startswith("```"):
        raw = raw.split("```")[1].strip()
    
    parsed = json.loads(raw)
    
    # Validation: Ensure at least 3 points
    summary = parsed.get("summary", [])
    if len(summary) < 3:
        raise ValueError(f"AI returned only {len(summary)} points. Retrying...")
    
    return parsed


def normalise_sentiment(raw) -> str:
    s = raw.strip().lower() if isinstance(raw, str) else ""
    if s in SENTIMENT_VALUES:
        return s
    return "neutral"


def summarise_with_failover(anthropic_client, groq_client, ann) -> dict:
    """Implement 3x Anthropic followed by 3x Groq logic."""
    prompt = build_prompt(
        ann["headline"], ann["company"],
        ann["document_type"], ann["market_sensitive"],
    )
    
    # 1. Try Anthropic (3 times)
    if anthropic_client:
        for attempt in range(1, 4):
            try:
                print(f"[anthropic] {ann['ticker']} attempt {attempt}/3...")
                out = _call_ai_one(anthropic_client, ANTHROPIC_MODEL, prompt, 'anthropic')
                print(f"[anthropic] {ann['ticker']} ok")
                return out
            except Exception as e:
                print(f"[anthropic] Attempt {attempt} failed: {e}")
                if attempt < 3: time.sleep(1)

    # 2. Try Groq (3 times)
    if groq_client:
        for attempt in range(1, 4):
            try:
                print(f"   [groq] {ann['ticker']} failover attempt {attempt}/3...")
                out = _call_ai_one(groq_client, GROQ_MODEL, prompt, 'groq')
                print(f"   [groq] {ann['ticker']} ok")
                return out
            except Exception as e:
                print(f"   [groq] Attempt {attempt} failed: {e}")
                if attempt < 3: time.sleep(1)

    # Final Fallback
    print(f"[ai] {ann['ticker']} fallback (no LLM response) — placeholder summary")
    return {
        "summary": [f"High-priority announcement from {ann['ticker']}", f"Topic: {ann['headline']}", "Review PDF for full details."],
        "tags": ["Other"],
        "sentiment": "neutral",
    }


def summarise_batch(anthropic_client, groq_client, announcements: list[dict], delay: float = 0.5) -> list[dict]:
    """Process a batch of announcements with failover logic."""
    total = len(announcements)
    for i, ann in enumerate(announcements, 1):
        print(f"[ai] {i}/{total} processing {ann['ticker']}...")
        
        result = summarise_with_failover(anthropic_client, groq_client, ann)
        ann["summary"] = result.get("summary", [])[0:4] # Cap at 4
        ann["tags"]    = result.get("tags", [])
        ann["sentiment"] = normalise_sentiment(result.get("sentiment"))
        
        if i < total:
            time.sleep(delay)
    return announcements


# ─────────────────────────────────────────────────────────────
# Save
# ─────────────────────────────────────────────────────────────

def save_log(date_str: str, announcements: list[dict]) -> Path:
    LOGS_DIR.mkdir(exist_ok=True)
    path = LOGS_DIR / f"{date_str}.json"
    
    # Load existing data if file exists to append/deduplicate
    existing_announcements = []
    if path.exists():
        try:
            with open(path, "r", encoding="utf-8") as f:
                old_data = json.load(f)
                existing_announcements = old_data.get("announcements", [])
        except Exception as e:
            print(f"[save] Error loading existing log: {e}")

    # Deduplicate based on composite key (ticker, time, headline) to be absolutely bulletproof
    seen_keys = {f"{a['ticker']}_{a['time']}_{a['headline']}" for a in existing_announcements}
    new_to_add = [a for a in announcements if f"{a['ticker']}_{a['time']}_{a['headline']}" not in seen_keys]
    
    combined = existing_announcements + new_to_add
    # Sort by time descending
    combined.sort(key=lambda x: x["time"], reverse=True)

    payload = {
        "date":                  date_str,
        "total":                 len(combined),
        "market_sensitive_count": sum(1 for a in combined if a["market_sensitive"]),
        "generated_at":          datetime.now(timezone.utc).isoformat(),
        "announcements":         combined,
    }
    with open(path, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
    
    if new_to_add:
        print(f"[save] Appended {len(new_to_add)} new announcements. Total now: {len(combined)}")
    else:
        print(f"[save] No new announcements found. Total remains: {len(combined)}")
    return path


def run_process(args):
    print(f"\n{'='*60}")
    print(f"  ASX Announcement Fetcher  |  {args.date}")
    print(f"{'='*60}\n")

    # 1. Load existing log to find what we already have
    path = LOGS_DIR / f"{args.date}.json"
    seen_keys = set()
    if path.exists():
        try:
            with open(path, "r", encoding="utf-8") as f:
                old_data = json.load(f)
                seen_keys = {f"{a['ticker']}_{a['time']}_{a['headline']}" for a in old_data.get("announcements", [])}
        except: pass

    # 2. Fetch latest from ASX
    fetched = fetch_announcements(args.date)
    if not fetched:
        print("[main] No announcements found for this date.")
        return

    # 3. Filter only NEW announcements
    new_announcements = [a for a in fetched if f"{a['ticker']}_{a['time']}_{a['headline']}" not in seen_keys]
    if not new_announcements:
        print("[main] All fetched announcements are already in the log. Skipping AI.")
        return

    print(f"[main] Found {len(new_announcements)} NEW announcements to process.")

    # 4. AI summarise ONLY new ones
    if not args.no_ai:
        print(
            f"[ai] Anthropic: {'on' if ANTHROPIC_API_KEY else 'OFF (set ANTHROPIC_API_KEY)'} "
            f"model={ANTHROPIC_MODEL} | "
            f"Groq: {'on' if GROQ_API_KEY else 'OFF (set GROQ_API_KEY)'} "
            f"model={GROQ_MODEL}"
        )
        if not ANTHROPIC_API_KEY and not GROQ_API_KEY:
            print("[ai] WARNING: No LLM keys — placeholder summaries only.")
        a_client = Anthropic(api_key=ANTHROPIC_API_KEY) if ANTHROPIC_API_KEY else None
        g_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None
        new_announcements = summarise_batch(a_client, g_client, new_announcements)
    else:
        for a in new_announcements:
            a["summary"] = [f"ASX announcement: {a['headline']}"]
            a["tags"]    = ["Other"]
            a["sentiment"] = "neutral"

    # 5. Save/Append
    save_log(args.date, new_announcements)


def main():
    parser = argparse.ArgumentParser(description="Fetch and summarise ASX announcements")
    # ─── Default Date Logic ───
    now_aest = datetime.now(AEST)
    # If before 10:00 AM AEST, default to yesterday's date
    if now_aest.hour < 10:
        default_date = (now_aest - timedelta(days=1)).strftime("%Y-%m-%d")
    else:
        default_date = now_aest.strftime("%Y-%m-%d")

    parser.add_argument(
        "--date",
        default=default_date,
        help="Date to fetch (YYYY-MM-DD), defaults to smart logical date for AEST",
    )
    parser.add_argument(
        "--no-ai",
        action="store_true",
        help="Skip AI summarisation (useful for testing)",
    )
    parser.add_argument(
        "--loop",
        action="store_true",
        help="Run in a loop every 5 minutes during the 9:00 - 10:15 window",
    )
    args = parser.parse_args()

    if args.loop:
        print(f"[loop] Starting morning loop (9:00 AM - 10:15 AM AEST)...")
        while True:
            now = datetime.now(AEST)
            # Check if we are within the window
            # 9:00 AM to 10:15 AM
            start_time = now.replace(hour=9, minute=0, second=0, microsecond=0)
            end_time   = now.replace(hour=10, minute=15, second=0, microsecond=0)
            
            if now < start_time:
                wait_secs = (start_time - now).total_seconds()
                print(f"[loop] Too early. Waiting until 9:00 AM ({int(wait_secs)}s remaining)...")
                time.sleep(min(wait_secs, 300))
                continue
            
            if now > end_time:
                print(f"[loop] Current time {now.strftime('%H:%M')} is past 10:15 AM. Loop finished.")
                break
            
            print(f"\n[loop] {now.strftime('%H:%M')} Round start...")
            run_process(args)
            
            print(f"[loop] Round complete. Sleeping 5 minutes...")
            time.sleep(300)
    else:
        run_process(args)
    print("\n[main] Done.")


if __name__ == "__main__":
    main()
