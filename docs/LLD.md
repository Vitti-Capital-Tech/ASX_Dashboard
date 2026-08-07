# Low-Level Design (LLD)
## Vitti ASX Intelligence Dashboard

### 1. Data Ingestion Module (`fetch_asx.py`)

#### Purpose
To retrieve, parse, enrich, and serialize the daily ASX market announcements.

#### Workflow details:
1.  **API Call:** Connects to `https://www.asx.com.au/asx/1/company/announcements?...` using a randomized User-Agent to prevent basic rate-limiting/blocking.
2.  **State Management:** Compares the fetched list against existing entries in `logs/{YYYY-MM-DD}.json` utilizing `URL` and `time` as composite primary keys to avoid duplicate processing.
3.  **Enrichment:**
    *   Initiates an HTTP POST to Groq's LLaMA-v3.3 endpoint.
    *   **Prompt Engineering:** Defines a rigid system prompt enforcing JSON output format: `{"summary": [], "tags": [], "score": int}`.
    *   **Fallback Logic:** If the AI fails to respond (due to timeout or quota limits), the announcement is still appended to the log but with empty `summary` and `tags` arrays.
4.  **Serialization:** Reads the target day's JSON, appends the new objects to the `announcements` array, and re-writes the file safely.

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
    1. Filter out non-sensitive announcements (`sensitiveOnly` true/false).
    2. Filter by Category Toggles.
    3. Filter by Sidebar Tags (Set intersection).
    4. Fuzzy text search on `ticker`, `company`, and `headline`.
    5. Sorting weights: Market Sensitive -> Bullish Score -> Chronological.

#### C. Presentation Components
*   **`Sidebar.tsx`:** Manages control inputs (Date picker, Focus Mode switch). Iterates over `tagCounts` to render the dynamic taxonomy.
*   **`Topbar.tsx`:** Handles Global string search, grid/list layout preference, and the light/dark theme toggle integration.
*   **`AnnouncementCard.tsx` / `AnnouncementRow.tsx`:** Smart components that inject semantic styling based on the data props (e.g., rendering the pulsing Red dot if `market_sensitive === true`). Implements heavy Tailwind CSS specific to the nested theme wrappers (`dark:bg-[#0d1022]`).

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
*   Re-runs are safe via the `URL` + `time` composite key described in §1.2, so a delayed or duplicated event never double-writes.
*   The commit step no-ops when nothing changed: `git diff --cached --quiet || git commit`.
*   A `git pull --rebase origin main` precedes `git push` so interleaved runs cannot reject each other on a stale ref.

#### E. Known Limitation
GitHub's shared scheduler offers no delivery guarantee, and no cron configuration can create one — on 6 Aug 2026 an entire 24-event block was dropped, delaying the first fetch to 00:01 UTC. Guaranteeing a run before a fixed wall-clock deadline requires an external scheduler (e.g. cron-job.org or a Cloudflare Worker) firing `repository_dispatch`, layered on top of the existing crons rather than replacing them.
