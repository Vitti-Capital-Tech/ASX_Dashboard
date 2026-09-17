# Low-Level Design (LLD)
## Vitti ASX Intelligence Dashboard

### 1. Data Ingestion Module (`fetch_asx.py`)

#### Purpose
To retrieve, parse, enrich, and serialize the daily ASX market announcements.

#### Workflow details:
1.  **API Call:** Connects to `https://asx.api.markitdigital.com/asx-research/1.0/markets/announcements?entityXids=[]&page=0&itemsPerPage=500` with a fixed desktop-Chrome User-Agent and an `asx.com.au` Referer to avoid basic bot blocking. Retries 3× with a 3s/6s backoff.
2.  **Date Filtering:** Each item's UTC `date` is converted to `Australia/Sydney` and compared against the target day, so an announcement lodged at 09:00 AEST is filed under the Sydney trading day rather than the UTC one.
3.  **Scope:** `MARKET_SENSITIVE_ONLY = False` — the whole day is ingested. The constant remains as an escape hatch: setting it `True` narrows the log to `is_alpha()` items only (price sensitive, trading halts/suspensions, substantial holdings), which is how the log used to be built.
4.  **Market Sensitivity:** `market_sensitive` is a verbatim copy of the API's `isPriceSensitive` boolean. No heuristic, keyword rule, or model output ever writes this field.
5.  **State Management:** Compares the fetched list against existing entries in `logs/{YYYY-MM-DD}.json` using `ticker` + `time` + `headline` as a composite primary key, so only the delta is sent for enrichment.
6.  **Enrichment (`summarise_batch`):**
    *   **Batching:** New announcements are chunked into groups of `AI_BATCH_SIZE` (default 10) and each group becomes **one** LLM call. `AI_CONCURRENCY` (default 4) groups run in parallel via a `ThreadPoolExecutor`.
    *   **Ordering:** Groups are formed alpha-first (`is_alpha()`), so a run killed mid-flight leaves the price-sensitive announcements with real summaries rather than placeholders.
    *   **Prompt Engineering (`build_batch_prompt`):** Announcements are numbered `[1]`–`[n]` and the model must return `{"results": [{"id": n, "summary": [3 strings], "tags": [...], "sentiment": "bullish|bearish|neutral"}]}`.
    *   **Response Alignment (`_call_ai_group`):** Entries are matched back by `id`. If the model omits ids but returns the right count, results are aligned positionally instead of burning a retry. If any announcement in the group lacks its 3 bullets, the whole group raises and retries.
    *   **Failover Logic:** 3 attempts against Anthropic (`ANTHROPIC_MODEL`, default `claude-opus-4-6`), then 3 against Groq (`GROQ_MODEL`, default `llama-3.3-70b-versatile`), with `2**attempt` backoff — flat delays are not enough when `AI_CONCURRENCY` requests share a rate limit. If every attempt fails, each announcement in the group gets a deterministic placeholder summary (`_fallback_result`) and is still appended to the log.
7.  **Serialization:** Reads the target day's JSON, appends the new objects to the `announcements` array, recomputes `total` and `market_sensitive_count`, and re-writes the file safely.

#### Cost characteristics
Ingesting the full day multiplies announcement volume ~2.7× (≈300 → ≈800 per day) but batching cuts LLM calls ~10×, so the net call count *fell*:

| | Sensitive-only, 1 call each | Full day, 10 per call |
| --- | --- | --- |
| Announcements logged / day | ~300 | ~800 |
| LLM calls / day | ~300 | **~80** |
| Calls in the peak 10:00 AM run | ~80 | **~24** |

#### Tuning knobs
All read via `_env_or_default`, which treats the empty strings GitHub Actions injects as unset:

| Variable | Default | Effect |
| --- | --- | --- |
| `AI_BATCH_SIZE` | `10` | Announcements per LLM call. Raising it cuts calls further but widens the blast radius of one malformed response, since a group retries as a unit. |
| `AI_CONCURRENCY` | `4` | Groups in flight at once. Raise only if the provider's rate limit has headroom. |
| `ANTHROPIC_MODEL` | `claude-opus-4-6` | Primary summariser. |
| `GROQ_MODEL` | `llama-3.3-70b-versatile` | Failover summariser. |

#### Known limitations
*   **Page-size ceiling:** the API is called with `page=0&itemsPerPage=500`, so any single fetch sees only the most recent 500 announcements *across all days*. On a heavy day (823 on 26 Aug 2026) one run cannot cover the day alone — coverage depends on runs landing repeatedly through the session. Paginating would remove the dependency.
*   **Afternoon gap:** the cron stops at 14:00 AEST (gate bound 15), but announcements keep arriving until ~19:00. On 26 Aug 2026 the log captured 249 of the day's 296 price-sensitive announcements; all 47 missing were lodged after 12:37 AEST, the last run of that day. Extending the schedule is the fix.
*   **Historical logs predate full-day ingestion:** logs written before `MARKET_SENSITIVE_ONLY` was set to `False` contain only the alpha subset, so their `market_sensitive_count / total` ratio reads ~97%. They cannot be backfilled — the API retains roughly six days of history.

### 1b. Price Context Module (`market_context.py`)

#### Purpose
To measure what a stock's price was doing **going into** an announcement, and to be the single place those measurements are defined so the prompt, the card, the table and the historical event file can never disagree.

#### Two invariants
*   **No look-ahead.** `bars_before()` is the only path by which price data enters a context, and it is exclusive of the announcement's own date by construction. Around 80% of ASX filings land pre-open, so the day's bar does not exist yet anyway; for backfilled and historical contexts the rule is load-bearing, since folding the reaction to the news into the situation preceding it makes every past analogue worthless.
*   **Facts, not calls.** Every field is a measurement a reader can check. The model is handed the same numbers to ground its prose, but is never the source of one that renders.

#### Fetching
*   `fetch_history()` pulls one long window per ticker (`1y` live, `2y` for backfill and base rates) in batches of 100 symbols, then slices locally. The fetcher runs every ~5 minutes across ~300 tickers, so a request per announcement would be throttled inside an hour.
*   `fetch_shares_outstanding()` is the one figure price bars cannot give, and the one with no bulk endpoint — a request per ticker. It is cached to `.cache/fundamentals.json` (gitignored) for 24 hours, and returns the **share count** rather than Yahoo's own market cap, which is marked to the live price and would break the look-ahead rule. The count is priced at whichever close the context is computed to.

#### Measurements (`compute_context`)
Returns `None` rather than a dict of nulls when there are fewer than `MIN_BARS` (30) bars — a caller can then omit the block entirely, which reads better than a row of dashes.

| Field | Window | Definition |
| --- | --- | --- |
| `last_close` | — | Last close strictly before the announcement date. |
| `market_cap_aud` | — | `round(last_close, 4) × shares_outstanding`. Rounded close on purpose: otherwise the close in one table column times the share count does not give the cap in the next. |
| `beta` | `MIN_BARS`+ shared sessions | Covariance of daily returns with `^AXJO` over benchmark variance. Computed here rather than read from Yahoo's profile, which is a 5-year monthly figure, is missing for most small caps, and costs a request per ticker. The benchmark is cut with `bars_before()` too. |
| `rsi_14` | `RSI_WINDOW` = 14 | Wilder's smoothing (EMA with α = 1/14), not a flat mean of the last 14 changes — the smoothed version is what charting packages draw, and the alternative would give two different numbers under one name. No down days → 100; a completely flat line → 50, since "maximum strength" would misdescribe a price that has not moved. |
| `avg_volume_20`, `volume_change_pct` | `BASE_WINDOW` = 20 | The same two facts as `volume_trend_ratio` / `volume_last_ratio`, in the units a table column wants: shares, and a percentage rather than a multiple. Derived from the same ratio so a column and a chip cannot disagree. |
| `high_52w`, `low_52w` | `YEAR_WINDOW` = 252 | Explicitly the last 252 sessions, **not** the whole frame passed in. |
| `high_3m`, `low_3m` | `QUARTER_WINDOW` = 63 | Absolute levels beside the existing `pct_from_3m_*` distances. |
| `month{1,2,3}_{high,low}` | `MONTH_WINDOW` = 21 | Blocks of 21 trading days walking back; month1 is the most recent. Trading-day blocks rather than calendar months because these columns are read side by side, and a month containing Easter is not comparable with one that does not. A block with fewer than 21 bars reads `None`, so a partial month never sits beside two full ones. |

#### Fixed in this module
`y_high` / `y_low` were previously taken over the entire frame handed in. The live fetcher passes a year, so the live path was correct — but `build_history.py` passes `2y` (`3y` on request), which meant every `pct_from_52w_*` it wrote into `analysis/events.jsonl` was really a 2-to-3-year extreme under a 52-week name. Harmless while it fed a sentence; not harmless once a column headed **52W High** prints the level. `YEAR_WINDOW` now clamps it. **Regenerating `events.jsonl` will therefore shift its `pct_from_52w_*` values** — they will read as smaller distances, because a 52-week extreme is nearer than a 3-year one.

#### Backfill (`scripts/backfill_context.py`)
Contexts are attached at save time, so a field added to this module today is absent from every log written before today. The backfill walks selected logs, pulls history once across every ticker in the range, and recomputes each context **against its own log date** — the same function the live path calls, so a backfilled row and a live one are indistinguishable. It writes `context_backfilled_at` on the log, touches no other announcement field (the summary and sentiment are what the model said at the time), and leaves an existing context in place where price data can no longer be had.

### 1c. Sentiment Scoring (`verify_sentiment.py`)

#### Purpose
To grade each day's sentiment calls against what the price actually did, and write `scorecard/YYYY-MM-DD.json`.

#### One ticker, one vote (`merge_by_ticker`)
Every announcement used to be scored separately, and every announcement from the same ticker resolved to the **same** closing price. A hit rate is a count of independent judgements, and these were never independent — one stock, one move, one outcome.

Observed in the data: ABX filed five times into a single −18.36% session and the bearish hit rate counted five correct calls; BCM's five procedural notices and two bearish calls split one −3.35% move into five wrong and two correct. **833 of 3,373 rows (25%) were repeats of a ticker already counted.**

Rows are now grouped by `(ticker, session_date, unpriced)` and collapsed:
*   **Session in the key**, because post-close news is judged against the *next* session and must not fold into the same day's calls. Measured across the existing scorecards, no group spans two sessions — the key is there so that stays true rather than because it currently bites.
*   **Unpriced in the key**, so a `pending` row never merges into a settled one.
*   **Directional beats neutral** (`_CALL_RANK`). "Change of Director's Interest Notice" is paperwork filed beside the announcement that said something; scoring the day neutral because four such notices outnumbered one bearish call measures the filing habit, not the judgement.
*   **`conflict` survives any merge** — it describes the ticker's day, not one filing.
*   **Nothing is hidden:** `announcements` carries the count and `also` carries the headlines not shown, which the table reveals on hover.

Effect on the published numbers: 3,373 rows → 2,540, with daily hit rates moving a few points in both directions and mostly **down** (17 Sep: 66.7% over 72 calls → 62.1% over 58). Existing scorecard files predate the merge and must be regenerated to pick it up.

#### Price columns
| Field | Source | Notes |
| --- | --- | --- |
| `open` | Daily bar | `None` on a thin stock whose bar came from one late trade — never falls back to the close, which would report an open-to-close move of zero. |
| `vwap` | **1-minute bars** (`fetch_vwap`) | Σ(typical × volume) / Σ(volume), typical = (H+L+C)/3 **per minute**. Deliberately not the daily (H+L+C)/3, which is not volume weighted and answers a different question on a stock that gapped and then traded all day at the other end of its range. Yahoo serves 1-minute history for ~30 days, so older sessions are `null` and a re-run cannot recover them; no proxy is substituted, because one column carrying two meanings is worse than a dash. Failure is an empty dict — VWAP is a column, and no verdict depends on it. |
| `open_close_pct` | Daily bar | `(close / open − 1) × 100`. |

#### Why the verdict is still judged on `abnormal_pct`
69% of scored announcements (2,316 of 3,373) are lodged pre-open, and for those the entire reaction is the overnight gap. `open_close_pct` measures the session *after* the market has already repriced the news, so judging on it would score most pre-open calls flat or wrong and report something close to noise. It is published beside `abnormal_pct`, answering the separate question of whether the move held once the market opened.

#### `spread_pct`
Still computed and still written to the scorecard JSON; removed from the dashboard's two stat tiles only, so restoring it is a UI change and no history is lost.

### 2. Frontend Application (`Next.js 14 App Router`)

#### A. Backend for Frontend (BFF) Route (`/app/api/logs/[date]/route.ts`)
*   **Method:** GET
*   **Params:** `date` (YYYY-MM-DD format)
*   **Validation:** Regex enforces proper date structure (`/^\d{4}-\d{2}-\d{2}$/`). Returns `400 Bad Request` on failure.
*   **Execution:** Computes the absolute path to the local `logs/` directory using `process.cwd()` to dynamically locate and `readFile` the JSON document. Responds with `404 Not Found` if the file does not exist, triggering a distinct "Empty State" UI rather than a crash.

#### B. Global State & Context (`page.tsx`)
*   **Client Hook:** Forces client-side hydration via `use client` and `useEffect(() => setIsClient(true))` to prevent SSR hydration mismatches when doing timezone math for the `Date` object mapping to AEST.
*   **Polling Engine:** Implements `setInterval` referencing `REFRESH_MS = 300000` (5 minutes). Triggers `fetchLog(date)` silently to keep data fresh.
*   **Memoized Computations:** Utilizes `useMemo` for filtering data to ensure high performance on large datasets:
    1. Filter out non-sensitive announcements (`marketSensitiveOnly` true/false). Now that the full day is ingested, this toggle is a real filter — it typically narrows ~800 announcements to ~300, where previously the log held almost nothing but sensitive items and the toggle was close to a no-op.
    2. Filter by Category Toggles.
    3. Filter by Sidebar Tags (Set intersection).
    4. Fuzzy text search on `ticker`, `company`, and `headline`.
    5. Sorting weights: Market Sensitive -> `sentimentRank` (bullish, then neutral, then bearish) -> reverse chronological. This is the feed's editorial order; the table view can re-sort on any numeric column and returns to this order on a third click of the same heading.

#### B2. Client Holdings Route (`/app/api/client-tickers/route.ts`)
*   **Method:** GET. No parameters — the book is today's book whichever trading date the feed is showing.
*   **Upstream:** `GET {CLIENT_DASHBOARD_URL}/api/holdings/codes` with `Authorization: Bearer {CLIENT_DASHBOARD_API_KEY}`, 15s timeout. The mirror of `lib/asx/news.ts` in the client dashboard, which reads this project's `/api/market-sensitive` with the same shape of contract.
*   **Why a proxy at all:** the secret. A browser fetch would have to ship it to every visitor; this route holds the credential and the browser calls the route.
*   **Failure contract:** always HTTP 200, with `{ ok: false, codes: [], error: "<reason>" }`. Deliberately not an error status — the page has something useful to do with the reason, and rendering an unfiltered-looking empty feed would assert something false about the book. Unset env vars, 401, non-200, timeout and an unreachable host each produce their own `error` string.
*   **Input trust:** the payload crosses a deployment boundary, so `codes` is re-validated here — non-strings dropped, trimmed, upper-cased, de-duplicated and sorted — rather than trusted into the page.

#### B3. The Clients Ticker view (`page.tsx`)
*   **Not a second feed.** `isFeedView` is `activeView === 'announcements' || isClientsView`, so the view reuses the whole existing pipeline — `filtered` → `sorted` → grid or screener table — with one extra predicate. Search, sentiment, category, tags, the market-sensitive toggle and the Grid/List choice all work in it because none of them know it exists.
*   **The predicate:** `heldCodes.has(ann.ticker.toUpperCase())`, against a `Set` built once per fetch — it is asked once per announcement per render on a feed that reaches 800 rows.
*   **Guarded on arrival:** the predicate returns `false` for every row while `clientTickers?.ok` is not yet true. Filtering against an empty set during the fetch would flash "nothing held today" over a day that is full of it, so the view shows a spinner, then either the feed or the failure notice — never a silently empty one.
*   **Fetched on first open, not on mount.** Most sessions never open the tab, and the list changes when the morning import lands rather than between requests. It is not keyed on `date` either: a held book is current whichever past day the feed is showing.
*   **Its own empty state.** "Nothing on held stock today" names the number of held tickers and says it is a quiet day for the book rather than a missing feed, and the Clear Filters button is withheld unless a filter is actually narrowing something.

#### C. Presentation Components
*   **`Sidebar.tsx`:** Manages control inputs (Date picker, Focus Mode switch). Iterates over `tagCounts` to render the dynamic taxonomy.
*   **`Topbar.tsx`:** Handles Global string search, grid/list layout preference, and the light/dark theme toggle integration.
*   **`AnnouncementCard.tsx`:** Grid view. Smart component that injects semantic styling based on the data props (e.g. rendering the pulsing Red dot if `market_sensitive === true`).
*   **`AnnouncementTable.tsx`:** List view, as a screener table. Columns are declared as a single array of `{key, label, unit, align, value, render}` descriptors, so sorting is generic and the six monthly high/low columns are generated rather than written out. Specifics worth knowing:
    *   **Column set:** ASX Code (with the sensitive dot), Company, Announcement (linked to the ASX document), Time, Type, Sentiment, then the `market_context` measurements — Mkt Cap, Beta, Avg Vol, Vol Chg, RSI, 52W High/Low, Latest Close, and M1–M3 High/Low.
    *   **Sorting:** click cycles descending → ascending → back to the feed's own editorial order (`sortKey = null`). `value` is absent on the text columns, which therefore do not sort. Rows with a missing measurement sink to the bottom in **both** directions, so "smallest market cap" surfaces the smallest company that has one rather than the stubs Yahoo has never heard of.
    *   **Absent vs zero:** `ctxNum()` narrows anything non-finite to `null` and every formatter renders that as an em dash. Logs written before a column existed simply lack the key, which is why the new `MarketContext` fields are typed optional.
    *   **Precision:** prices are formatted at a precision chosen from their own magnitude (4dp under $1, 2dp over $100) — a fixed 2dp would round an 0.008 stock away to nothing. Market cap and average volume are scaled to millions; numeric cells are mono + `tabular-nums` so columns of digits align.
    *   **Layout:** twenty columns do not fit a laptop, so the table is the one horizontally scrolling element on the page, with the ticker column pinned (`sticky left-0`). The pinned cell takes its background from a class rather than an inline style so the row hover still wins.
    *   **Not present:** the source spreadsheet also carried *Confidence* and *Quarters of Funding*. Neither has a source in this pipeline — the summariser emits no confidence score, and quarters of funding requires the cash-burn line from each company's Appendix 4C. Adding either means a pipeline change, not a UI one.

### 3. Theme Configuration
*   Controlled via Tailwind's `darkMode: 'class'` mode.
*   A user preference token (`vitti-theme`) is cached in `localStorage` upon interaction.
*   React enforces the `dark` or `light` class onto the root `<html>` tag dynamically on mount and change.

### 4. WhatsApp Messages and Placements Module

#### A. WhatsApp Summary Generator (`fetch_msg.py`)
*   **API Connection:** Communicates with Anthropic's Messages endpoint (`https://api.anthropic.com/v1/messages`).
*   **Key Functions:**
    *   `generate_client_email(summary_text)`: Sends a system prompt enforcing HTML-only output to build a client-ready email describing the opportunity. Strips code block syntax wrappers from the response.
    *   `fetch_msg(summary_text)`: Requests a 5-6 line summary in a natural human tone. Enforces plain-text format, removes markdown bullets/headings, and limits output length to a maximum of 6 lines.
*   **CLI Interface:** Accepts `--input` to process a string argument, `--loop` to fetch morning updates repeatedly, or `--date` to target specific days.

#### B. Placements Exporter (`scripts/export_placements.py`)
*   **Database Ingestion:** Optional local/offline helper. Queries the `pending_approval_campaigns` table in a configured SQLite database path (`--db` or `PLACEMENT_DB_PATH`) for campaigns created on a given date.
*   **Deal Classification:** Inspects the email subject and deal name using the `classify_deal` function to categorize the campaign as `"IPO"` or `"Placement"`.
*   **Summary Logic:** Resolves the WhatsApp text using `fetch_msg(source_text)` from `fetch_msg.py` if available; falls back to the first 6 non-empty lines of raw source text if API keys or imports are missing.
*   **Serialization:** Saves a daily JSON document structured as `PlacementDayLog` to `placements/{date}.json`.

#### C. Backend API Integration
*   **`/app/api/placements/route.ts`**: Handles GET requests, fetching the list of dates that have active placements from `http://3.25.70.124:8000/api/placements`.
*   **`/app/api/placements/[date]/route.ts`**: Handles GET requests for a specific date parameter. Validates the parameter via regex (`/^\d{4}-\d{2}-\d{2}$/`) and proxies requests to `http://3.25.70.124:8000/api/placements/${date}`.

#### D. Frontend Layout & Clipboard Interaction (`app/page.tsx` & `PlacementCard.tsx`)
*   **Tab Activation:** Adding `'Whatsapp Messages'` into the `CATEGORIES` array.
*   **Dynamic Data Fetching:** Implements a `fetchPlacements` callback wrapper. A `useEffect` hook triggers fetching only when the user switches to the `'Whatsapp Messages'` tab, minimizing API queries on initial load.
*   **`PlacementCard.tsx` rendering**:
    *   Displays ticker, deal type badge (distinct color scheme for IPO vs Placement), company name, received time, subject, and the summary text pre-formatted.
    *   **Clipboard Management:** Employs `navigator.clipboard.writeText` to copy the WhatsApp summary. Integrates a fallback mechanism that creates a temporary off-screen textarea, selects it, and executes `document.execCommand('copy')` to support legacy browsers.
    *   **User Feedback State:** Uses React's `useState` to toggle a temporary `copied` state. Triggers a 2-second timeout to reset the state, changing the copy icon to a checkmark badge.

### 5. Scheduling & CI (`.github/workflows/daily_asx.yml`)

#### A. Cron Schedule
GitHub cron is UTC-only, so each window is expressed in UTC against Sydney's UTC+10 (AEST) / UTC+11 (AEDT) offset:

| Cron expression | UTC window | Sydney equivalent (AEST) |
| --- | --- | --- |
| `2,7,...,52,57 22 * * 0-4` | 22:00 – 23:00 | 08:00 – 09:00, every 5 min |
| `2,7,...,52,57 23 * * 0-4` | 23:00 – 00:00 | 09:00 – 10:00, every 5 min |
| `10 0-4 * * 1-5` | 00:10 – 04:10 | 10:10 – 14:10, hourly |

*   **Day-of-week skew:** the 22:00/23:00 UTC bands use `0-4` (Sun–Thu) because they land on the *previous* UTC calendar day relative to the Sydney trading day. The daytime band uses `1-5` (Mon–Fri), where UTC and Sydney share a date.
*   **Minute offsets:** every entry deliberately avoids minute `:00` — the scheduler's peak-load minute and empirically the most-dropped one.
*   **Attempt count is intentional, not excessive.** GitHub delivered only ~2 of the 12 requested events per hour in measurement, so the surplus entries are redundancy against drops, not a request for 12 fetches.

#### B. The `gate` Job
A cheap pre-flight job whose sole output is `proceed` (`"true"` / `"false"`), consumed by `fetch-and-summarise` through `if: needs.gate.outputs.proceed == 'true'`.

*   Resolves `datetime.now(ZoneInfo("Australia/Sydney"))` at runtime, so DST transitions are handled by the tz database rather than by duplicated cron entries.
*   Proceeds when `weekday < 5 and 8 <= hour <= 15`.
*   The upper bound is **15, not 14**, to absorb scheduler drift. The 04:10 UTC event was measured arriving at ~05:03 UTC (15:03 Sydney); a previous `hour <= 14` bound silently rejected it, killing the final fetch of **every** trading day. Such rejected runs are identifiable in run history by their ~6–12 second duration (gate only, fetch skipped).
*   `workflow_dispatch` short-circuits the gate entirely and always proceeds, so manual catch-up runs work outside market hours.

#### C. Concurrency Scoping
`concurrency` is declared on the **`fetch-and-summarise` job**, not at workflow level. GitHub permits one running plus one pending run per group and cancels the older pending entry when a third arrives; scoping the group to the fetch prevents the seconds-long gate jobs from consuming that headroom. `cancel-in-progress: false` because the job pushes commits and must not be interrupted mid-write.

#### D. Idempotency & Push Safety
*   Re-runs are safe via the `ticker` + `time` + `headline` composite key described in §1.5, so a delayed or duplicated event never double-writes. The same key makes each run incremental: it enriches only announcements the earlier runs have not already logged, so ingesting the full trading day never means re-summarising it.
*   The commit step no-ops when nothing changed: `git diff --cached --quiet || git commit`.
*   A `git pull --rebase origin main` precedes `git push` so interleaved runs cannot reject each other on a stale ref.

#### E. Known Limitation
GitHub's shared scheduler offers no delivery guarantee, and no cron configuration can create one — on 6 Aug 2026 an entire 24-event block was dropped, delaying the first fetch to 00:01 UTC. Guaranteeing a run before a fixed wall-clock deadline requires an external scheduler (e.g. cron-job.org or a Cloudflare Worker) firing `repository_dispatch`, layered on top of the existing crons rather than replacing them.
