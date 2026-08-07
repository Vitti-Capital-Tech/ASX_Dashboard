# High-Level Design (HLD)
## Vitti ASX Intelligence Dashboard

### 1. Overview
The Vitti ASX Intelligence Dashboard is an automated pipeline designed to track, summarize, and display market-moving announcements from the Australian Securities Exchange (ASX).

### 2. Architecture Goal
The system is built on a **Decoupled Serverless Architecture**. It segregates the heavy lifting (data fetching and AI processing) from the presentation layer (the Next.js User Interface).

### 3. Core Components

#### A. The Data Engine (Python Pipeline)
*   **Source:** Polls the official MarkitDigital ASX JSON API.
*   **Processing:** Identifies newly released announcements.
*   **AI Integration:** Forwards announcements to the **Groq API** (running LLaMA 3.3). The AI reads the headline and outputs:
    1.  A 3-bullet-point summary.
    2.  Semantic tags (e.g., "Mining", "Dividend").
    3.  A "Bullish" or "Bearish" sentiment score.
*   **Storage:** The final enriched data is saved directly as a JSON file (`logs/YYYY-MM-DD.json`).

#### B. The Presentation Layer (Next.js 14)
*   **Framework:** Built entirely on Next.js App Router with React 18.
*   **Backend-for-Frontend (BFF):** Local API routes (`/api/logs/[date]` and `/api/placements/[date]`) act as bridges, reading local JSON logs or querying external backend APIs and serving them securely to the browser.
*   **Client Interface:** A highly responsive dashboard using Tailwind CSS ("Midnight Intelligence" theme). It features client-side text filtering, layout toggling, theme switching, and a dedicated copy-to-clipboard system for WhatsApp messages.

#### C. Placement/IPO Engine & WhatsApp Summary Generator
*   **Source:** Placement and campaign details are served by the external placement backend on AWS EC2.
*   **AI Summary Pipeline (`fetch_msg.py`):** Integrates with the Anthropic Claude API to generate a highly concise 5-6 line summary optimized for mobile readability/sharing on WhatsApp. Also capable of drafting professional client emails.
*   **Export Pipeline (`scripts/export_placements.py`):** Optional local/offline helper that extracts from a configured placement SQLite database path and serializes campaign details into daily JSON files (`placements/YYYY-MM-DD.json`).
*   **EC2 API Integration:** The dashboard pulls live placement and campaign details through Next.js proxy routes referencing an external API server running on AWS EC2 (`http://3.25.70.124:8000`).

### 4. System Flow Diagram

```mermaid
graph TD
    %% ASX Announcements Pipeline
    ASX[ASX Markit API] -->|Raw JSON| FA(fetch_asx.py)
    FA -->|Headline/Context| G{Groq LLaMA-3}
    G -->|AI Summary & Tags| FA
    FA -->|Appends to| DL[(logs/YYYY-MM-DD.json)]
    DL --> BFF1[Next.js API: /api/logs/date]

    %% Placement & IPO Pipeline
    DB[(Configured Placement DB)] -->|Pending Campaigns| EP(export_placements.py)
    EP -->|Source Text| FM(fetch_msg.py)
    FM -->|Claude API| WA[5-6 Line WhatsApp Summary]
    EP -->|JSON Serialization| PL[(placements/YYYY-MM-DD.json)]
    EC2[EC2 API Server :8000] -->|Serves placement data| BFF2[Next.js API: /api/placements/date]

    %% Frontend Layer
    BFF1 --> Dashboard[React Dashboard]
    BFF2 --> Dashboard
    Dashboard -->|Copy to Clipboard| Clip[Clipboard / Client Sharing]
```

### 5. Automation Strategy
*   **Extraction:** A GitHub Actions workflow (`.github/workflows/daily_asx.yml`) runs the Python engine on ASX trading days — every **5 minutes** across the **8:00 – 10:00 AM AEST** opening window, then **hourly until 2:00 PM AEST**. The dense early cadence exists because most market-sensitive announcements are released before and just after the open.
*   **Timezone Handling:** GitHub cron is UTC-only, so the schedule is pinned in UTC while a lightweight `gate` job resolves the real `Australia/Sydney` time at runtime. This keeps behaviour correct across the AEST/AEDT changeover and suppresses weekend runs, without maintaining two parallel sets of cron expressions.
*   **Delivery Reliability:** GitHub provides **no SLA on scheduled workflows**. Measurement over 100 consecutive runs (Jul–Aug 2026) showed it delivering only ~2 of the 12 events requested per hour, with arrival delays of 0–70 minutes, and on 6 Aug 2026 it dropped an entire two-hour block. The schedule is therefore deliberately **over-provisioned**: each cron entry is an independent chance to land a run, not a guaranteed tick. A hard delivery guarantee would require an external scheduler firing `repository_dispatch` instead of relying on GitHub's shared cron.
*   **Idempotency:** Because the fetcher keys on `URL` + `time`, a delayed, duplicated, or catch-up run can never double-write. This is what makes over-provisioning safe.
*   **Display:** The Next.js dashboard uses a `setInterval` hook to poll the local API route every 5 minutes. As the Python script appends new items to the JSON file, the dashboard automatically updates without requiring a page refresh.
