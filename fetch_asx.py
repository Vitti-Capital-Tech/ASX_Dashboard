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
GROQ_MODEL   = "llama-3.3-70b-versatile"

AEST = timezone(timedelta(hours=10))

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    ),
    "Accept": "application/rss+xml, application/xml, text/xml, */*",
    "Referer": "https://www.asx.com.au/",
}

# ASX Market Announcements Platform RSS feed (publicly available)
ASX_RSS_URL = "https://www.asx.com.au/asx/rss/market.do?by=asxCode"

KNOWN_TAGS = [
    "Results", "AGM", "Capital Raise", "Dividend",
    "Quarterly", "Production", "Merger & Acquisition",
    "Board Change", "Trading Halt", "Compliance",
    "Mining", "Healthcare", "Technology", "Finance",
    "Energy", "Property", "Retail", "Other",
]

LOGS_DIR = Path(__file__).parent / "logs"


# ─────────────────────────────────────────────────────────────
# Fetch from RSS
# ─────────────────────────────────────────────────────────────

def fetch_announcements(date_str: str, retries: int = 3) -> list[dict]:
    """
    Fetch ASX announcements from the public RSS feed and
    filter to announcements released on `date_str` (YYYY-MM-DD).
    """
    for attempt in range(1, retries + 1):
        print(f"[fetch] Attempt {attempt}/{retries}: GET {ASX_RSS_URL}")
        try:
            resp = requests.get(ASX_RSS_URL, headers=HEADERS, timeout=60)
            resp.raise_for_status()
            items = _parse_rss(resp.content, date_str)
            print(f"[fetch] Success. Found {len(items)} announcements for {date_str}")
            return items
        except Exception as e:
            print(f"[fetch] Attempt {attempt} failed: {e}")
            if attempt < retries:
                wait = attempt * 3
                print(f"[fetch] Retrying in {wait}s...")
                time.sleep(wait)
            else:
                print("[fetch] All retry attempts failed.")
    return []


def _parse_rss(content: bytes, date_str: str) -> list[dict]:
    """Parse RSS XML and return announcements matching the given date."""
    
    xml_text = content.decode('utf-8', errors='replace')
    items = []
    
    # 1. Grab all <item>...</item> blocks
    item_blocks = re.findall(r"<item>(.*?)</item>", xml_text, flags=re.DOTALL | re.IGNORECASE)
    
    for block in item_blocks:
        # 2. Extract specific fields using regex
        title_match = re.search(r"<title>(.*?)</title>", block, re.DOTALL | re.IGNORECASE)
        link_match = re.search(r"<link>(.*?)</link>", block, re.DOTALL | re.IGNORECASE)
        pub_date_match = re.search(r"<pubDate>(.*?)</pubDate>", block, re.DOTALL | re.IGNORECASE)
        desc_match = re.search(r"<description>(.*?)</description>", block, re.DOTALL | re.IGNORECASE)
        # creator often has namespace dc:creator
        creator_match = re.search(r"<[^>]*?creator[^>]*>(.*?)</[^>]*?creator>", block, re.DOTALL | re.IGNORECASE)
        
        # Clean text
        title       = _clean_xml_text(title_match.group(1)) if title_match else ""
        link        = _clean_xml_text(link_match.group(1)) if link_match else ""
        pub_date    = _clean_xml_text(pub_date_match.group(1)) if pub_date_match else ""
        description = _clean_xml_text(desc_match.group(1)) if desc_match else ""
        creator     = _clean_xml_text(creator_match.group(1)) if creator_match else ""
        
        if not title or not pub_date:
            continue

        # Parse pubDate → datetime
        dt = _parse_pub_date(pub_date)
        if dt is None:
            continue

        # Filter by date in AEST
        dt_aest = dt.astimezone(AEST)
        if dt_aest.strftime("%Y-%m-%d") != date_str:
            continue

        # Try to extract ticker from creator field or title
        ticker  = creator.strip().upper() if creator.strip() else _extract_ticker(title)
        company = _extract_company(description) or creator.strip()

        # Market sensitive: ASX usually marks this in the title/description
        market_sensitive = bool(
            re.search(r"market[\s\-]?sensitive", title + description, re.IGNORECASE)
        )

        items.append({
            "ticker":           ticker,
            "company":          company,
            "headline":         title.strip(),
            "time":             dt.isoformat(),
            "url":              link.strip(),
            "market_sensitive": market_sensitive,
            "document_type":    _guess_doc_type(title),
            "summary":          [],
            "tags":             [],
        })

    return items


def _clean_xml_text(text: str) -> str:
    """Helper to unescape standard XML entities cleanly"""
    if not text: return ""
    text = text.strip()
    # Handle standard entities
    text = text.replace("&lt;", "<").replace("&gt;", ">").replace("&quot;", '"').replace("&apos;", "'")
    text = text.replace("&#39;", "'")
    # Ampersand last
    text = text.replace("&amp;", "&")
    # Clean up weird CDATA blocks if present
    text = re.sub(r'<!\[CDATA\[(.*?)\]\]>', r'\1', text, flags=re.DOTALL)
    # Strip any remaining HTML tags just in case
    text = re.sub(r'<[^>]+>', '', text)
    return text.strip()


def _parse_pub_date(raw: str) -> datetime | None:
    formats = [
        "%a, %d %b %Y %H:%M:%S %z",
        "%a, %d %b %Y %H:%M:%S GMT",
        "%Y-%m-%dT%H:%M:%S%z",
    ]
    for fmt in formats:
        try:
            return datetime.strptime(raw.strip(), fmt)
        except ValueError:
            continue
    return None


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


def summarise_batch(client: Groq, announcements: list[dict], delay: float = 0.5) -> list[dict]:
    """Summarise announcements one by one with rate-limit delay."""
    total = len(announcements)
    for i, ann in enumerate(announcements, 1):
        print(f"[groq] {i}/{total}  {ann['ticker']} - {ann['headline'][:60]}")
        prompt = build_prompt(
            ann["headline"], ann["company"],
            ann["document_type"], ann["market_sensitive"],
        )
        try:
            response = client.chat.completions.create(
                model=GROQ_MODEL,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=300,
            )
            raw    = response.choices[0].message.content.strip()
            parsed = json.loads(raw)
            ann["summary"] = parsed.get("summary", [])
            ann["tags"]    = parsed.get("tags", [])
        except json.JSONDecodeError:
            print(f"[groq] JSON parse error for {ann['ticker']}, using fallback")
            ann["summary"] = [f"ASX announcement: {ann['headline']}"]
            ann["tags"]    = ["Other"]
        except Exception as e:
            print(f"[groq] Error for {ann['ticker']}: {e}")
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
    payload = {
        "date":                  date_str,
        "total":                 len(announcements),
        "market_sensitive_count": sum(1 for a in announcements if a["market_sensitive"]),
        "generated_at":          datetime.now(timezone.utc).isoformat(),
        "announcements":         announcements,
    }
    with open(path, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
    print(f"[save] Written {len(announcements)} announcements to {path}")
    return path


# ─────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────

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
    args = parser.parse_args()

    print(f"\n{'='*60}")
    print(f"  ASX Announcement Fetcher  |  {args.date}")
    print(f"{'='*60}\n")

    # 1. Fetch from RSS
    announcements = fetch_announcements(args.date)

    if not announcements:
        print("[main] No announcements found for this date. Saving empty log.")
        save_log(args.date, [])
        return

    # 2. Filter blank headlines
    announcements = [a for a in announcements if a["headline"].strip()]
    print(f"[main] {len(announcements)} valid announcements after filtering")

    # 3. AI summarise
    if not args.no_ai:
        if not GROQ_API_KEY:
            print("[main] WARNING: GROQ_API_KEY not set. Using --no-ai fallback.")
            for a in announcements:
                a["summary"] = [f"ASX announcement: {a['headline']}"]
                a["tags"]    = ["Other"]
        else:
            client = Groq(api_key=GROQ_API_KEY)
            announcements = summarise_batch(client, announcements)
    else:
        for a in announcements:
            a["summary"] = [f"ASX announcement: {a['headline']}"]
            a["tags"]    = ["Other"]

    # 4. Save
    save_log(args.date, announcements)
    print("\n[main] Done.")


if __name__ == "__main__":
    main()
