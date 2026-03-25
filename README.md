# Vitti - ASX Announcement Dashboard

A daily intelligence tool that automatically fetches ASX announcements, generates AI bullet-point summaries using Groq, flags market-sensitive releases, and presents everything in a searchable web dashboard.

---

## How It Works

```
GitHub Actions (cron 8am AEST)
  └── fetch_asx.py
        ├── Fetches all ASX announcements via the official MarkitDigital JSON API (bypassing legacy geo-blocks)
        ├── Sends each to Groq (llama-3.3-70b-versatile) for a summary and tags
        ├── Preserves the native `market_sensitive` flag directly from the API
        └── Writes `logs/YYYY-MM-DD.json` - auto-committed to the repository

index.html (open in browser or deploy to GitHub Pages)
  ├── Reads logs/YYYY-MM-DD.json for the selected date
  ├── Offers search, tag filters, category tabs, and market-sensitive toggles
  ├── Features a responsive, premium UI with mobile off-canvas menus
  └── Allows download via CSV or Print PDF
```

---

## Setup

### 1. Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/Vitti.git
cd Vitti
pip install -r requirements.txt
```

### 2. Set Environment Variables
```bash
cp .env.example .env
# Edit .env and add your Groq API key: https://console.groq.com/keys
```

### 3. Add GitHub Secret
In your repo → **Settings → Secrets → Actions → New repository secret**:
- Name: `GROQ_API_KEY`
- Value: your key from https://console.groq.com/keys

### 4. Push to GitHub
The GitHub Actions workflow (`.github/workflows/daily_asx.yml`) will automatically run every day at **8am AEST** and commit a new `logs/YYYY-MM-DD.json`.

You can also trigger it manually from the **Actions tab → Daily ASX Announcements → Run workflow**.

---

## Run Manually (Local)
```bash
# Fetch today's announcements with AI summaries
python fetch_asx.py

# Fetch for a specific date
python fetch_asx.py --date 2026-03-25

# Skip Groq (just fetch raw data, no summaries)
python fetch_asx.py --no-ai
```

---

## View the Dashboard
Open `index.html` directly in a browser.  
Or deploy to **GitHub Pages**: Settings → Pages → Source: `main` / `root`.

A sample log (logs/2026-03-25.json) is included so the dashboard works immediately.

---

## Log Format (`logs/YYYY-MM-DD.json`)
```json
{
  "date": "2026-03-25",
  "total": 12,
  "market_sensitive_count": 4,
  "generated_at": "2026-03-25T22:01:00+00:00",
  "announcements": [
    {
      "ticker": "BHP",
      "company": "BHP Group Limited",
      "headline": "Quarterly Production Report",
      "time": "2026-03-25T08:10:00",
      "url": "https://www.asx.com.au/...",
      "market_sensitive": true,
      "document_type": "Quarterly Report",
      "summary": ["bullet 1", "bullet 2", "bullet 3"],
      "tags": ["Quarterly", "Mining", "Production"]
    }
  ]
}
```

---

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Fetcher | Python 3.12, `requests` |
| AI Summaries | Groq API (`llama-3.3-70b-versatile`) |
| Scheduling | GitHub Actions cron |
| Dashboard | Vanilla HTML / CSS / JS |
| Deployment | GitHub Pages (optional) |
