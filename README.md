# Vitti ASX Intelligence Center

Welcome to the **Vitti ASX Intelligence Center**!

This is an automated tool designed to help you instantly understand what is happening on the Australian Securities Exchange (ASX), even if you have zero trading experience.

Every day, hundreds of companies release official announcements on the stock market. Reading through all of these dense, financial PDFs is impossible. This tool does the hard work for you.

---

## What This Tool Does For You

1. **Auto-Fetches the News:** Automatically pulls the latest official announcements from the ASX throughout the trading day — every few minutes around the market open, then hourly. **Every** announcement is captured, not just the market-moving ones, so the feed mirrors the ASX's own daily list (~800 on a busy reporting day).
2. **AI Summaries:** Instead of reading a 50-page PDF, AI reads it instantly and gives you 3 bullet points explaining what happened. Every announcement gets one, price-sensitive or not.
3. **Flags Market-Sensitive News:** The ASX tells us if a piece of news is expected to move the stock price. These are highlighted in your feed so you know what matters. See [Market Sensitive, explained](#market-sensitive-explained) below.
4. **Highlights Bullish News:** Our AI analyzes text and flags positive announcements with a green **▲ BULLISH** badge and a glowing green card.
5. **Tracks Substantial Holders:** Detects when major investors cross the 5% ownership threshold — a key signal for potential takeovers or institutional confidence.
6. **Organizes by Category:** Filter news by type — Bullish, Dividends, Capital Raises, Results, Substantial Holding, Trading Halts, and more.
7. **WhatsApp Summary Generation:** Formats copy-pastable, mobile-friendly 5-6 line summaries for Placement & IPO campaigns, facilitating direct sharing with clients.

---

## Market Sensitive, explained

The **Sensitive** badge is not our judgement — it is the ASX's own flag, the same `$` shown in the "Price sens." column of [the ASX's Today's Announcements page](https://www.asx.com.au/asx/v2/statistics/todayAnns.do). The company itself declares it when lodging, so we pass it straight through untouched.

**Expect roughly a third of the day to be market sensitive.** Measured over 27 Aug 2026, the ASX page listed 814 announcements with 317 `$` markers (39%); the API we read reported 314 of 800 — agreeing with the page on **765 of 765** announcements matched by ticker and headline. Typical range:

| Date (2026) | Announcements | Market sensitive |
| --- | --- | --- |
| 20 Aug | 340 | 69 (20%) |
| 21 Aug | 609 | 152 (25%) |
| 25 Aug | 718 | 223 (31%) |
| 26 Aug | 823 | 296 (36%) |
| 27 Aug | 800 | 314 (39%) |

The ratio climbs through August because FY results season floods the market with Appendix 4E filings, which companies routinely flag as price sensitive.

> **If the count looks too low, check the clock.** The day builds up as it goes: on 27 Aug there were only 57 sensitive announcements by 8:00 AM AEST, 258 by 10:00 AM, and 314 by the close. A morning snapshot is not a short day.

---

## How to Use the Dashboard

1. **Pick a Date:** On the left sidebar, choose the date you want to inspect.
2. **Filter by Category:** Use the tab bar at the top to filter by "Bullish", "Substantial Holding", "Results", etc.
3. **WhatsApp Messages Tab:** Access the **Whatsapp Messages** tab to view processed Placement & IPO summaries. Hover over any card and click the copy button to copy the pre-formatted 5-6 line summary directly to your clipboard.
4. **Search:** Type a ticker (e.g. `BHP`) or company name into the search bar to find specific news.
5. **Market Overview:** The sidebar shows a live summary — total announcements, sensitive news count, substantial holders, bullish signals, active tickers, and trading halts.
6. **Export:** Click **Export CSV Data** in the sidebar to download the full day's data.

---

## How to Run Locally

1. Open your terminal and navigate to this folder.
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open your browser and go to: `http://localhost:3000`

The dashboard auto-refreshes every 5 minutes. To manually fetch fresh announcements, run:
```bash
python fetch_asx.py
```

---

## Automated Data Pipeline

A GitHub Actions workflow runs the fetcher automatically on ASX trading days (**Monday–Friday**, Sydney time):

| Sydney time | How often | Why |
| --- | --- | --- |
| 8:00 – 10:00 AM | Every 5 minutes | Pre-open and the opening rush, when most market-sensitive news lands |
| 10:00 AM – 2:00 PM | Hourly | Steadier trickle through the rest of the session |

Schedule times live in the workflow as UTC, but a `gate` step re-checks the real Sydney clock before every fetch — so the timing follows the AEST/AEDT changeover automatically and never fires on weekends.

> **Note on timing:** GitHub gives **no delivery guarantee** for scheduled workflows. Measured across 100 consecutive runs (Jul–Aug 2026), it actually delivered only about 2 of the 12 runs requested each hour and arrived anywhere from on-time to 70 minutes late; on 6 Aug 2026 it skipped a full two-hour block. The workflow therefore asks for far more slots than it needs, so that losing most of them still leaves at least one early run. All runs are idempotent — re-running never creates duplicates.

If a run is missed or you need fresh data right now, trigger one manually from the **GitHub Actions** tab → **Run workflow**. Manual runs bypass the schedule and the weekday check entirely.

---

## Accuracy Scorecard — were we right?

The **BULLISH** / **BEARISH** badge is the AI's prediction of where the share price is
headed. The **Accuracy** tab is where that prediction gets marked.

Every weekday evening, after the ASX closes, an automated job pulls the real
end-of-day price for every ticker we called that day and checks whether the stock
actually did what we said it would. Nothing is graded by hand.

### How a call is marked

- **Measured against the market.** A stock is only judged on how it moved *relative to the
  S&P/ASX 200*. If the whole market fell 2% and our bullish pick fell 0.5%, that pick
  beat the market and counts as correct. Without this, a bad day for the index would fail
  every bullish call at once.
- **Small moves do not count.** Anything under **1%** net of the index is noise, not a
  reaction to the news, so it is marked *No real move* rather than a hit or a miss. The
  headline hit rate only counts calls that actually moved.
- **Timing decides the day.** News released before the 10:00 open is judged on that day's
  close. News released after the 16:00 close is judged on the *next* session, and sits as
  *Pending* until that price exists.
- **Mixed days are excluded.** If one ticker gets both a bullish and a bearish call on the
  same day, a single closing price cannot settle both, so it is left out of the hit rate.
- **Halted and suspended stocks** have no price to check and are marked *No price*.

### The numbers on the tab

| Metric | What it tells you |
| --- | --- |
| **Hit rate** | Share of directional calls that went the right way. |
| **Bullish / Bearish hit rate** | Whether the AI is better at spotting good news or bad news. |
| **Bull − Bear spread** | How far bullish picks beat bearish ones on average. This is the real test — a high hit rate with no spread is not an edge. |
| **Neutral control** | Average move of the announcements we called neutral. Bullish picks have to beat *this*, not zero, to mean anything. |

Use **Copy post summary** for a plain-English, paste-ready recap of the day, and
**Export CSV** for the full call-by-call detail.

### For other projects consuming this

The scorecard is committed to `scorecard/` as plain JSON and served over three endpoints:

| Endpoint | Returns |
| --- | --- |
| `GET /api/scorecard/summary` | Rolling all-time accuracy. Small, stable payload — poll this one. |
| `GET /api/scorecard/<YYYY-MM-DD>` | One day's full detail, including `highlights.best_calls`. |
| `GET /api/scorecard/available` | Every date that has been scored. |

### Running it by hand

```bash
python verify_sentiment.py --date 2026-09-04
```

`--backfill N` also re-checks the previous N days, which is how post-close announcements
get resolved once the next session prints. Re-running a day is safe — it simply
recomputes the same file. Override `BENCHMARK` or `SENTIMENT_THRESHOLD_PCT` (as env vars
or GitHub Actions variables) to change the index or the 1% dead band.

---

## For Developers & Technical Users

For a deeper understanding of the architecture and AI pipeline:

- [High-Level Design (HLD)](docs/HLD.md)
- [Low-Level Design (LLD)](docs/LLD.md)

### Developer CLI & Export Commands

To run the WhatsApp message generator CLI directly, you can pass a raw source text:
```bash
python fetch_msg.py --input "Raw text from placement document..."
```

To export Placement & IPO details from the sqlite database:
```bash
python scripts/export_placements.py --db path/to/placement/state.db --out ./placements --date YYYY-MM-DD
```

---
*Created by [Tushar Bhardwaj](https://minianonlink.vercel.app/tusharbhardwaj) for automated market intelligence.*
