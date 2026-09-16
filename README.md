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
7. **Screener Table View:** Switch the feed to **List** and the same announcements lay out as a sortable table — market cap, beta, RSI, average volume and how far off it today is, 52-week and monthly high/low, and the latest close, beside each headline. See [The table view, column by column](#the-table-view-column-by-column) below.
8. **WhatsApp Summary Generation:** Formats copy-pastable, mobile-friendly 5-6 line summaries for Placement & IPO campaigns, facilitating direct sharing with clients.

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

## The table view, column by column

List view shows the day's announcements as a screener. Every number in it describes **the company's price going into that announcement** — never a live quote, and never a forecast.

| Column | What it is |
| --- | --- |
| **ASX Code** | The ticker. An amber ★ means the ASX flagged the filing price-sensitive — the same star the sidebar's Market sensitive tile uses. |
| **Company / Announcement** | The company name and the headline. The headline links to the original ASX document. |
| **Time** | When it was lodged, Sydney time. |
| **Type** | The ASX's own document type — "Quarterly Activities Report", "Trading Halt", and so on. |
| **Sentiment** | The AI's bullish / bearish / neutral call on the announcement. |
| **Signals** | Why this row is flagged — see [Signals](#signals-what-gets-flagged-and-why) below. A dash means nothing fired. |
| **Mkt Cap (A$M)** | Shares on issue times the latest close, in millions of Australian dollars. |
| **Beta (vs XJO)** | How much the stock moves when the S&P/ASX 200 moves, from a year of daily moves. 1.0 tracks the index; 2.0 swings twice as hard; below zero moves against it. |
| **Avg Vol (20d, M)** | Average shares traded per day over the last 20 sessions, in millions. |
| **Vol Chg (%)** | The latest session's volume against that 20-day average. `+150` means one-and-a-half times more shares changed hands than usual. |
| **RSI (14d)** | The standard 14-day momentum gauge, 0 to 100. Shaded red above 80 ("overbought"), green below 30 ("oversold"). These are conventions, not calls. |
| **52W High / Low** | The highest and lowest the stock traded over the last 52 weeks. |
| **Latest Close** | The last closing price **before** the announcement. Hover it to see which day that was. |
| **M1–M3 High / Low** | The high and low of each of the last three months, most recent first. A month here is 21 trading days, so the three are directly comparable; an incomplete month shows a dash rather than a partial figure. |

**A dash means we do not have that number**, most often because the stock is newly listed, suspended, or Yahoo Finance has no history for it. It never means zero.

**Why these are yesterday's numbers.** Around 80% of ASX announcements land before the market opens, so the day's own bar does not exist yet when we measure. More importantly, folding the price reaction to a piece of news into the picture of what preceded it would make every one of these columns circular. The measurement window always stops at the last close before the filing.

**Not included:** the spreadsheet these columns came from also carried *Confidence* and *Quarters of Funding*. Neither exists anywhere in this pipeline — the AI does not emit a confidence score, and quarters of funding needs the cash-burn line out of each company's Appendix 4C. Rather than show an empty column, they are left out.

### Signals — what gets flagged, and why

Three hundred announcements a day is too many to read down. A handful of them are on a stock doing something measurable, and those rows are tinted end to end, badged in the **Signals** column, and lifted to the top of the table.

| Badge | Fires when | Row tint |
| --- | --- | --- |
| **RSI 80+** | 14-day RSI above 80 | red |
| **RSI 30−** | 14-day RSI below 30 | green |
| **▲ 3M / 6M / 12M HIGH** | Last close within 1% of that window's high | indigo |
| **▼ 3M / 6M / 12M LOW** | Last close within 1% of that window's low | amber |

Every one of these is a measurement out of `market_context.py`, not a judgement. **Nothing here is a buy or a sell** — an RSI of 85 is a fact about the last fourteen sessions, and what it means is the reader's call.

Three rules keep the flags honest:

- **Only the longest window is badged.** A stock at its 12-month high is also at its 3- and 6-month high; three badges saying so is noise.
- **A window that fires high *and* low is dropped.** Within 1% of both means the entire range is under about 2% — a suspended or barely-traded stock sitting on one price, where "at its 12-month high" is true and says nothing.
- **RSI flags at 80, not the conventional 70.** At 70 roughly a fifth of a busy day qualifies, and a highlight that fires that often stops being one. The column shades at the same threshold, so the cell and the row can never disagree.

Filter the table to any one of them with the chips above it — the count on each chip is how many rows it matches today. When several signals land on one row, the tint and the edge follow the first of RSI 80+, RSI 30−, near high, near low; the badges still show all of them.

**Hovering a flagged row does not recolour it.** Hover brightens the row rather than washing over it, so a red row stays red under the pointer. The coloured edge down its left side never changes at all — that edge is also what a reader who cannot separate the hues has in place of them.

**An open row and its drawer are one card**, joined by what they share rather than by a box drawn round them: the same surface, the same signal tint running through both, the coloured edge down the left of each, and no divider between them. So a green row opens into a green drawer, and it is never ambiguous which ticker the detail belongs to.

**Open as many rows as you like.** Opening one does not close another — comparing two filings is most of the reason to open them in place rather than one at a time.

---

## How to Use the Dashboard

1. **Pick a Date:** On the left sidebar, choose the date you want to inspect.
2. **Filter by Category:** Use the tab bar at the top to filter by "Bullish", "Substantial Holding", "Results", etc.
3. **WhatsApp Messages Tab:** Access the **Whatsapp Messages** tab to view processed Placement & IPO summaries. Hover over any card and click the copy button to copy the pre-formatted 5-6 line summary directly to your clipboard.
4. **Search:** Type a ticker (e.g. `BHP`) or company name into the search bar to find specific news.
5. **Market Overview:** The sidebar shows a live summary — total announcements, sensitive news count, substantial holders, bullish signals, active tickers, and trading halts.
6. **Grid or List:** The dashboard opens on the screener table (**List**) — it shows the whole day at once and is the only view carrying the signal flags. The toggle in the top bar switches to the card feed (**Grid**), and your choice is remembered from then on.
7. **Sort the table:** In List view, click any number column heading to sort by it — biggest first, then smallest, then a third click to go back to the feed's own order (sensitive news first, then bullish, then newest).
8. **Click a row for the detail:** The table has no room for prose, so a drawer opens underneath the row — the AI's three points on the left, the price going into the filing and the tags on the right, laid out like the card in Grid view. It stays pinned to the left of the screen while you drag the table sideways through the later columns, so it never scrolls out of reach. Click again to close; clicking the headline still just opens the ASX document.
9. **Filter to the flagged rows:** The chips above the table narrow it to any one signal — see [Signals](#signals-what-gets-flagged-and-why). Unfiltered, flagged rows come first, then rows that at least have price context, then the rest. Sorting by a column takes the order over completely.
10. **Export:** Click **Export CSV Data** in the sidebar to download the full day's data.

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

## Market-Sensitive News API

For feeding another dashboard. `/api/logs/<date>` already returns a whole day,
but that is ~400 announcements when the price-sensitive ones are ~50 — so this
endpoint does the filtering server side and returns a flat, stable shape.

```
GET /api/market-sensitive
```

| Parameter | Default | Meaning |
| --- | --- | --- |
| `date` | most recent day held | A single trading day, `YYYY-MM-DD` |
| `days` | `1` | The N most recent trading days instead (max 30) |
| `sentiment` | all | `bullish` \| `bearish` \| `neutral` |
| `since` | — | Only announcements released after this ISO instant |
| `limit` | `200` | Cap on items (max 1000) |

The response shape is identical for one day or thirty, so a consumer never has
to branch on it:

```json
{
  "from": "2026-09-02", "to": "2026-09-04",
  "count": 53, "truncated": false,
  "latest_released_at": "2026-09-04T03:30:49+00:00",
  "items": [
    {
      "id": "2924-03131900-6A1342243",
      "date": "2026-09-04",
      "ticker": "LLM",
      "company": "LOYAL METALS LTD",
      "headline": "IMPLEMENTATION OF SCHEME OF ARRANGEMENT",
      "url": "https://cdn-api.markitdigital.com/.../2924-03131900-6A1342243",
      "released_at": "2026-09-04T03:09:24+00:00",
      "sentiment": "bullish",
      "document_type": "Market Update",
      "tags": ["Merger & Acquisition", "Compliance"],
      "summary": ["...", "...", "..."]
    }
  ]
}
```

`url` is the hyperlink — the announcement PDF on the ASX platform.

### Polling a day as it fills

`fetch_asx.py` runs every ~5 minutes through the Sydney morning and hourly until
early afternoon, so today's feed grows all day — the 4 Sept log was rewritten 17
times. Three things make following it cheap:

- **`id` never changes.** It is the ASX document id, so a consumer upserts
  rather than inserts and re-polling can never duplicate a row. `save_log()`
  merges and deduplicates rather than overwriting, so items only accumulate —
  nothing you have already stored disappears from a later response.
- **`since` returns only what is newer.** Store `latest_released_at` from a
  response and pass it back as `since` on the next poll.
- **An ETag short-circuits an unchanged feed.** Send `If-None-Match` and an
  unchanged day answers `304` with no body. The tag covers each day's
  `generated_at` and count, so it changes exactly when the data does.

Polling every 5 minutes during market hours matches the fetcher; more often just
returns 304s.

### Where it lives

This dashboard is deployed at **https://asx.vitticapital.ai**, so the endpoint is:

```
https://asx.vitticapital.ai/api/market-sensitive?days=1
```

### Consuming it from another Next.js app

Fetch it server side — a Server Component, route handler or server action — so
there is no cross-origin request and no CORS to configure:

```ts
const res = await fetch(`${process.env.ASX_API_URL}/api/market-sensitive?days=1`, {
  headers: process.env.ASX_API_KEY ? { 'x-api-key': process.env.ASX_API_KEY } : {},
  // `force-cache` is what opts in. From Next 15 fetch is uncached by default,
  // so `next: { revalidate }` on its own silently refetches every request.
  cache: 'force-cache',
  next: { revalidate: 300 },   // re-check every 5 minutes
});
const { items } = await res.json();
```

The client dashboard does exactly this in `lib/asx/news.ts`.

### Locking it down

The endpoint is open by default, matching the other read endpoints — the data is
public ASX filings. Set `ASX_API_KEY` in the environment to require it, supplied
as either `x-api-key` or `Authorization: Bearer <key>`. Note this is a
server-to-server secret: do not put it in a browser bundle.

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

### Filtering the calls, and the total underneath

Two rows of filters sit above the call-by-call table and stack with each other, so
**Bullish + Wrong** is one click each and shows exactly the bullish calls that went
against us.

| Filter | Options |
| --- | --- |
| **Verdict** | All calls · Correct · Wrong · No real move · No price |
| **Direction** | Both · ▲ Bullish · ▼ Bearish |

Under them, the **Net** column added up over whatever is left on screen:

| Figure | What it is |
| --- | --- |
| **Sum of net** | Every shown call's move net of the index, added together. |
| **Avg per call** | That sum divided by the number of calls with a price. |
| **As called** | The same sum with bearish rows sign-flipped, so a correct call of either kind adds to it. Only shown when both directions are on screen — filtered to one, the sign already means the same thing on every row. |

**This is not a return.** It is percentage points added up across notional equal
positions on one-day moves, with no sizing, no entry price and no costs in it. Treat it
as a way to size the day's damage or the day's win, not as a P&L.

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

## Learning from the misses

Grading the calls is only half of it. Two modules feed the result back into the next
day's prompt.

This is not training, and it is worth being precise about why. The model has no memory
between API calls — each one starts cold, and nothing it "learns" on Monday exists on
Tuesday. A file is the only thing that persists, so the loop is: grade → write the file →
paste the file back in. Yesterday's misses influence today's calls because they are
sitting in today's prompt, not because anything was retrained.

### The numbers — `calibration.py`

Reads the last 20 days of `scorecard/` and writes
[`analysis/calibration.md`](analysis/calibration.md): what the directional calls were
worth, and where they hold up. Findings with fewer than 30 graded calls behind them are
not reported at all, rather than reported with a caveat.

```bash
python calibration.py            # print exactly what the model will be told
python calibration.py --write    # refresh analysis/calibration.md
```

### The blind spots — `reflect.py`

After the close, the day's wrong calls go back to the model — the headline it read, the
price action it was shown, the reasoning it gave, and what the stock actually did — with
one question: what did you fail to consider before you committed to that label? Whatever
it names is written to `analysis/lessons.json` and rendered to
[`analysis/lessons.md`](analysis/lessons.md), and the earned ones sit at the top of every
prompt from then on.

Unlike the calibration numbers this is a **ledger, not a window**. A lesson written in
September is still there in March. Nothing is ever deleted.

```bash
python reflect.py                            # reflect on today
python reflect.py --date 2026-09-10 --dry-run
```

Three rules keep it from filling up with superstition, because a model asked "why were
you wrong?" will always produce an answer and the answer will always sound insightful:

| Rule | Why |
| --- | --- |
| `"no lesson here"` is an encouraged answer | Most misses are sector moves or sellers, not analytical errors. |
| A new lesson is a **candidate** until the same blind spot recurs on another day | One occurrence cannot be told apart from a coincidence. |
| Unreinforced for 60 days → **dormant**, out of the prompt, still in the file | The list stays a checklist instead of becoming wallpaper. |

Thresholds are `LESSON_PROMOTE_AFTER` and `LESSON_DORMANT_DAYS`. Set the first to `1` to
put every new lesson straight into the prompt.

Both run nightly at the end of the scorecard workflow. With too little history to say
anything dependable, they say nothing and the prompt goes out unchanged.

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

The table view's numbers are attached by the fetcher as it saves each announcement, so a log written **before** a column existed has a blank where that column should be. To rebuild them over logs you already have:
```bash
python scripts/backfill_context.py --days 30           # last 30 days of logs
python scripts/backfill_context.py --days 5 --dry-run  # report, write nothing
```
It recomputes each announcement's context from bars that closed before **its own** log date, so a backfilled row and a live one are the same measurement. Nothing else in the log is touched.

To check the measurements themselves against live prices:
```bash
python market_context.py --self-test
python market_context.py --ticker BHP --date 2026-09-16
```

---
*Created by [Tushar Bhardwaj](https://minianonlink.vercel.app/tusharbhardwaj) for automated market intelligence.*
