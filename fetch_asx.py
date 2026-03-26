"""
ASX Daily Announcement Fetcher
--------------------------------
Fetches all ASX announcements for today via the ASX Market Announcements RSS feed,
generates bullet-point summaries using Groq AI, and saves a dated JSON log to logs/.

Usage:
    python fetch_asx.py [--date YYYY-MM-DD]  (defaults to today)
    python fetch_asx.py --no-ai              (skip Groq, useful for testing)
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
from groq import Groq

# Load environment variables from .env if present
load_dotenv()

# ─────────────────────────────────────────────────────────────
# Config
# ─────────────────────────────────────────────────────────────

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
GROQ_MODELS  = ["llama-3.1-8b-instant", "llama3-8b-8192", "mixtral-8x7b-32768", "gemma2-9b-it"]

AEST = timezone(timedelta(hours=11))

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
ASX_JSON_URL = "https://asx.api.markitdigital.com/asx-research/1.0/markets/announcements?entityXids=%5B%5D&page=0&itemsPerPage=200"
ASX_PDF_URL_BASE = "https://cdn-api.markitdigital.com/apiman-gateway/ASX/asx-research/1.0/file/"

KNOWN_TAGS = [
    "Results", "AGM", "Capital Raise", "Dividend",
    "Quarterly", "Production", "Merger & Acquisition",
    "Board Change", "Trading Halt", "Compliance",
    "Mining", "Healthcare", "Technology", "Finance",
    "Energy", "Property", "Retail", "Other",
]

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


def _extract_ticker(title: str) -> str:
    m = re.match(r"^\s*([A-Z]{2,5})\s*[-:]", title)
    return m.group(1) if m else ""


def _extract_company(desc: str) -> str:
    m = re.search(r"<b>(.*?)</b>", desc)
    return m.group(1).strip() if m else ""


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
    if "results" in t:             return "Results"
    return "Market Update"


# ─────────────────────────────────────────────────────────────
# Groq AI Summarisation
# ─────────────────────────────────────────────────────────────

def build_prompt(headline: str, company: str, doc_type: str, market_sensitive: bool) -> str:
    sensitivity = "MARKET SENSITIVE" if market_sensitive else "not market sensitive"
    tags_list   = ", ".join(KNOWN_TAGS)
    return f"""You are a financial analyst assistant specialising in ASX (Australian Securities Exchange) announcements.

Announcement details:
- Company: {company}
- Headline: {headline}
- Document Type: {doc_type}
- Market Sensitive: {sensitivity}

Tasks:
1. Write 3-5 concise bullet points summarising what this announcement likely covers based on the headline and document type. Each bullet should start with a dash (-).
2. Choose 1-4 relevant tags from this list only: {tags_list}

Respond in this exact JSON format (no markdown, no extra text):
{{
  "summary": ["bullet 1", "bullet 2", "bullet 3"],
  "tags": ["Tag1", "Tag2"]
}}"""


def summarise_batch(client: Groq, announcements: list[dict], delay: float = 2.1) -> list[dict]:
    """Summarise announcements one by one with rate-limit fallback across multiple LLMs."""
    total = len(announcements)
    for i, ann in enumerate(announcements, 1):
        print(f"[groq] {i}/{total}  {ann['ticker']} - {ann['headline'][:60]}")
        prompt = build_prompt(
            ann["headline"], ann["company"],
            ann["document_type"], ann["market_sensitive"],
        )
        
        success = False
        for model in GROQ_MODELS:
            try:
                response = client.chat.completions.create(
                    model=model,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.3,
                    max_tokens=300,
                )
                raw    = response.choices[0].message.content.strip()
                parsed = json.loads(raw)
                ann["summary"] = parsed.get("summary", [])
                ann["tags"]    = parsed.get("tags", [])
                success = True
                break  # Successfully generated, exit the fallback loop
            except Exception as e:
                # Print specific error and try the next model silently
                print(f"[groq] Model {model} failed for {ann['ticker']}: {str(e)[:100]}...")
                continue
                
        if not success:
            print(f"[groq] CRITICAL: All fallback models failed for {ann['ticker']}, using raw text")
            ann["summary"] = [f"ASX announcement: {ann['headline']}"]
            ann["tags"]    = ["Other"]
            
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
        if not GROQ_API_KEY:
            print("[main] WARNING: GROQ_API_KEY not set. Using fallback.")
            for a in new_announcements:
                a["summary"] = [f"ASX announcement: {a['headline']}"]
                a["tags"]    = ["Other"]
        else:
            client = Groq(api_key=GROQ_API_KEY)
            new_announcements = summarise_batch(client, new_announcements)
    else:
        for a in new_announcements:
            a["summary"] = [f"ASX announcement: {a['headline']}"]
            a["tags"]    = ["Other"]

    # 5. Save/Append
    save_log(args.date, new_announcements)


def main():
    parser = argparse.ArgumentParser(description="Fetch and summarise ASX announcements")
    parser.add_argument(
        "--date",
        default=datetime.now(AEST).strftime("%Y-%m-%d"),
        help="Date to fetch (YYYY-MM-DD), defaults to today AEST",
    )
    parser.add_argument(
        "--no-ai",
        action="store_true",
        help="Skip Groq summarisation (useful for testing)",
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
