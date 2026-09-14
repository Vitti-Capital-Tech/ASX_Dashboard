# Lessons

Blind spots the model identified in its own wrong calls, written down after the
close by `reflect.py` and read back to it the next morning. This is a ledger, not
a rolling window — nothing here is ever deleted.

- Last reflection: 2026-09-14
- 7 active, 3 candidate, 0 dormant

A lesson enters as a **candidate** and stays out of the daily prompt until the same
blind spot turns up on 2 separate days, because one occurrence cannot be told
apart from a coincidence. A lesson that stops recurring for 60 days goes **dormant**
and leaves the prompt, keeping its history.

## Active

In front of the model before every call it makes.

### L001 — Change in substantial holding filed into elevated recent volume (5-day volume >1.5x average) on a stock near a multi-month high

When volume has been running hot into a substantial holding change, treat the direction of the change as the critical unknown — a reduction by a substantial holder into strength is a material bearish signal, not a neutral procedural event. If you cannot confirm the direction is an increase, default to bearish when the tape is already extended.

_Seen 3×. First written 2026-09-14, last reinforced 2026-09-14._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-14 | SRL | neutral | -15.5% | Change in substantial holding |
| 2026-09-14 | SRL | neutral | -15.5% | Change in substantial holding |
| 2026-09-14 | SRL | neutral | -15.5% | Change in substantial holding |

### L002 — Drilling activity announcement (programme start, follow-up drilling underway) with no assay results disclosed

An announcement that drilling has commenced or is underway is a programme statement, not a result — it tells the market only that money is being spent. Do not call bullish on activity-commencement announcements alone; wait for assay data. Flag as neutral until results are released.

_Seen 3×. First written 2026-09-14, last reinforced 2026-09-14._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-14 | PLC | bullish | -14.4% | Follow-Up RC Drilling Underway at Rochefort |
| 2026-09-14 | PLC | bullish | -14.4% | Follow-Up RC Drilling Underway at Rochefort |
| 2026-09-14 | PLC | bullish | -14.4% | Follow-Up RC Drilling Underway at Rochefort |

### L003 — Multiple administrative filings (e.g. cessation of securities plus quotation of securities) lodged by the same company on the same day

When two or more procedural filings land simultaneously from the same issuer, treat the cluster as a potential signal of a capital raise or restructuring event that has just completed — ask what underlying transaction generated both filings and whether it implies dilution or a change in register composition that the market has not yet absorbed.

_Seen 3×. First written 2026-09-14, last reinforced 2026-09-14._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-14 | KLV | neutral | -13.7% | Application for quotation of securities - KLV |
| 2026-09-14 | KLV | neutral | -13.7% | Notification of cessation of securities - KLV |
| 2026-09-14 | SRL | neutral | -15.5% | Application for quotation of securities - SRL |
| 2026-09-14 | KLV | neutral | -13.7% | Application for quotation of securities - KLV |
| 2026-09-14 | KLV | neutral | -13.7% | Notification of cessation of securities - KLV |

### L004 — Clinical or scientific presentation announcement (oral or poster) at a named medical/scientific conference, stock at or near a multi-month low

An oral presentation slot at a competitive scientific conference is a positive credibility signal that is not merely procedural — it is peer selection of the data as noteworthy. When the stock is already at a significant low, this combination creates asymmetric upside that a neutral call misses; lean bullish when the presentation is oral, the conference is named and credible, and the stock is materially depressed.

_Seen 3×. First written 2026-09-14, last reinforced 2026-09-14._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-14 | RAD | neutral | +12.4% | RAD oral presentation at SNO26 on RAD101 Phase IIb data |
| 2026-09-14 | RAD | neutral | +12.4% | RAD oral presentation at SNO26 on RAD101 Phase IIb data |
| 2026-09-14 | RAD | neutral | +12.4% | RAD oral presentation at SNO26 on RAD101 Phase IIb data |

### L005 — Drilling intercept result where the headline grade and width appear strong, but the stock is deeply de-rated (>50% below 12-month high)

Before calling bullish on a strong-looking intercept, ask whether the company's de-rating reflects a known structural problem (funding gap, sovereign risk, permitting failure, commodity price collapse) that a single drill result cannot fix. If the stock has fallen >50% from its high, the market has already seen prior results and re-priced; one good hole is rarely sufficient to reverse that narrative without accompanying funding, resource upgrade, or offtake news.

_Seen 3×. First written 2026-09-14, last reinforced 2026-09-14._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-14 | ENR | bullish | -7.8% | High-Grade Niobium Zone Emerging at Joyce |
| 2026-09-14 | GRE | bullish | -9.0% | Extensional Whundo Drilling Hits 4.8m at 7.1% Cu 0.9g/t Au |
| 2026-09-14 | ENR | bullish | -7.8% | High-Grade Niobium Zone Emerging at Joyce |
| 2026-09-14 | GRE | bullish | -9.0% | Extensional Whundo Drilling Hits 4.8m at 7.1% Cu 0.9g/t Au |
| 2026-09-14 | GRE | bullish | -9.0% | Extensional Whundo Drilling Hits 4.8m at 7.1% Cu 0.9g/t Au |

### L006 — Single contract win announcement (no dollar value disclosed) for a thinly traded micro-cap services or technology company, flagged market sensitive

When a contract announcement omits revenue value entirely, treat the omission as a material qualifier — the market cannot size the earnings impact and often re-rates the stock down as the news fails to meet the implicit expectation set by the market-sensitive flag. Do not call bullish on a contract win without a disclosed or estimable dollar value; default to neutral until quantum is known.

_Seen 2×. First written 2026-09-14, last reinforced 2026-09-14._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-14 | AMX | bullish | -11.0% | AMX secures Daly Waters LiDAR and Imagery survey project |
| 2026-09-14 | AMX | bullish | -11.0% | AMX secures Daly Waters LiDAR and Imagery survey project |

### L007 — Asset divestment announcement by a company trading more than 60% below its 12-month high, with no proceeds or deal terms disclosed in the headline

When a deeply distressed company announces a divestment without disclosing proceeds or strategic rationale, the market default is to read it as a distress signal — asset quality concern or cash preservation — rather than strategic rationalisation. In the absence of disclosed terms, lean bearish rather than neutral when the stock is already severely de-rated, because the filing confirms asset disposal without confirming value recovery.

_Seen 2×. First written 2026-09-14, last reinforced 2026-09-14._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-14 | MDI | neutral | -7.2% | Divestment of Northern Territory Exploration assets |
| 2026-09-14 | MDI | neutral | -7.2% | Divestment of Northern Territory Exploration assets |

## Candidates

Seen once. Waiting to see whether they are real or were a coincidence.

### L008 — Early-stage geophysical survey commencement announcement (airborne magnetic, gravity, CSAMT etc.) on an illiquid junior explorer at or near a multi-month high, not flagged market sensitive

A survey commencement is a programme-activity statement with no data content — it tells the market only that fieldwork has started, which is often already anticipated after prior announcements. Treat as neutral-to-bearish when the stock is already at a local high, because speculative positioning built ahead of the announcement has no new result to feed on and is vulnerable to unwind.

_Seen 1×. First written 2026-09-14, last reinforced 2026-09-14._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-14 | LCL | neutral | -12.6% | Airborne magnetic survey to commence in PNG |

### L009 — Executive Chairman appointment at a micro-cap or small-cap with an identifiable strategic context (e.g. foreign operations, asset sale process, exploration pivot), filed into above-average recent volume

An Executive Chairman appointment is not always procedural — consolidating board and executive authority in a single named individual is a governance signal that the company is repositioning or that prior leadership has departed under pressure. Before calling neutral, ask whether the appointee is known in the sector and whether the role consolidation implies an acceleration of a known strategic process (sale, JV, restructure); if so, lean bullish or bearish depending on the appointee's track record and the strategic context.

_Seen 1×. First written 2026-09-14, last reinforced 2026-09-14._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-14 | AA2 | neutral | +7.7% | Appointment of Executive Chairman |

### L010 — Generic 'Investor Presentation' filing by a junior explorer or pre-revenue company, not flagged market sensitive, with no specific catalyst disclosed in the headline

An investor presentation without a named catalyst (resource estimate, drilling result, funding announcement) is most commonly awareness-building ahead of a capital raise — which is dilutive. Default to bearish rather than neutral when no substantive content is signalled in the headline, because the filing implicitly flags that management is actively marketing stock.

_Seen 1×. First written 2026-09-14, last reinforced 2026-09-14._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-14 | CEL | neutral | -7.1% | Investor Presentation |

## Dormant

Earned their place once and have not recurred since. Kept for the record.

_None yet._
