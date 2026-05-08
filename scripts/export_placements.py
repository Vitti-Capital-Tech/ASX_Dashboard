#!/usr/bin/env python3
"""
Export placement/IPO email summaries from the Placement_copy SQLite database
into JSON files that the ASX dashboard can serve.

Usage:
    python scripts/export_placements.py [--db PATH] [--out DIR] [--date YYYY-MM-DD]

Defaults:
    --db   ../Placement_copy/email_processor/state.db
    --out  ./placements
    --date (today in AEST)
"""

import argparse
import json
import os
import re
import sqlite3
from datetime import datetime, timezone, timedelta

AEST = timezone(timedelta(hours=10))


def get_placements(db_path: str, target_date: str):
    """Fetch approved/pending placement campaigns for a given date from the DB."""
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    rows = conn.execute(
        """
        SELECT ticker, deal_name, email_subject, source_text, status, created_at
        FROM pending_approval_campaigns
        WHERE date(created_at) = ?
        ORDER BY created_at DESC
        """,
        (target_date,),
    ).fetchall()
    conn.close()
    return rows


def classify_deal(subject: str, deal_name: str) -> str:
    """Guess whether a deal is a Placement or IPO from the subject/deal name."""
    text = (subject + " " + deal_name).lower()
    if "ipo" in text or "initial public offering" in text or re.search(r'\blisting\b', text):
        return "IPO"
    return "Placement"


def make_summary(source_text: str) -> str:
    """
    Create a short plain-text summary from the source text.
    If the Anthropic API key is available, use fetch_msg(); otherwise
    return the first 6 non-empty lines of source_text as a fallback.
    """
    try:
        import sys
        placement_root = os.path.join(os.path.dirname(__file__), "..", "..", "Placement_copy")
        sys.path.insert(0, os.path.abspath(placement_root))
        from fetch_msg import fetch_msg
        result = fetch_msg(source_text)
        if result and result.strip():
            return result
    except Exception:
        pass

    lines = [l.strip() for l in source_text.splitlines() if l.strip()]
    return "\n".join(lines[:6])


def export_day(db_path: str, out_dir: str, target_date: str):
    rows = get_placements(db_path, target_date)
    placements = []
    for r in rows:
        placements.append(
            {
                "ticker": r["ticker"] or "N/A",
                "company": r["deal_name"] or "",
                "deal_type": classify_deal(r["email_subject"] or "", r["deal_name"] or ""),
                "subject": r["email_subject"] or "",
                "summary": make_summary(r["source_text"] or ""),
                "received_at": r["created_at"],
            }
        )

    payload = {
        "date": target_date,
        "total": len(placements),
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "placements": placements,
    }

    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, f"{target_date}.json")
    with open(out_path, "w") as f:
        json.dump(payload, f, indent=2)
    print(f"Exported {len(placements)} placements to {out_path}")


def main():
    parser = argparse.ArgumentParser(description="Export placement summaries to JSON")
    parser.add_argument(
        "--db",
        default=os.path.join(os.path.dirname(__file__), "..", "..", "Placement_copy", "email_processor", "state.db"),
        help="Path to the Placement_copy SQLite database",
    )
    parser.add_argument(
        "--out",
        default=os.path.join(os.path.dirname(__file__), "..", "placements"),
        help="Output directory for JSON files",
    )
    parser.add_argument(
        "--date",
        default=datetime.now(AEST).strftime("%Y-%m-%d"),
        help="Date to export (YYYY-MM-DD), defaults to today AEST",
    )
    args = parser.parse_args()
    export_day(os.path.abspath(args.db), os.path.abspath(args.out), args.date)


if __name__ == "__main__":
    main()
