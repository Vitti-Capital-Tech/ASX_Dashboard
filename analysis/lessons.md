# Lessons

Blind spots the model identified in its own wrong calls, written down after the
close by `reflect.py` and read back to it the next morning. This is a ledger, not
a rolling window — nothing here is ever deleted.

- Last reflection: 2026-09-22
- 62 active, 2 candidate, 0 dormant

A lesson enters as a **candidate** and stays out of the daily prompt until the same
blind spot turns up on 2 separate days, because one occurrence cannot be told
apart from a coincidence. A lesson that stops recurring for 60 days goes **dormant**
and leaves the prompt, keeping its history.

## Active

In front of the model before every call it makes.

### L029 — Substantial holding filing headlined 'Becoming a substantial holder' (i.e. a new substantial holder crossing the 5% threshold for the first time) at a deeply de-rated stock, not flagged market sensitive

'Becoming a substantial holder' is categorically different from a change in an existing substantial holding — it announces that a new party has crossed 5% for the first time, which is unambiguously accumulation, not a reduction; do not apply the L001 bearish default (which addresses direction ambiguity) to a maiden substantial-holder filing; call bullish or neutral-to-bullish when the headline contains 'becoming' rather than 'change in', because direction is confirmed as acquisition by the filing type itself.

_Seen 11×. First written 2026-09-16, last reinforced 2026-09-21._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-21 | LOT | neutral | +8.7% | Change in substantial holding |
| 2026-09-21 | LOT | neutral | +8.7% | Change in substantial holding |
| 2026-09-21 | LOT | neutral | +8.7% | Change in substantial holding |
| 2026-09-21 | LOT | neutral | +8.7% | Change in substantial holding |
| 2026-09-17 | AUQ | neutral | +9.6% | Change in substantial holding |

### L031 — Change of Director's Interest Notice filed into elevated volume (5-day volume >1.5x average) at a stock that is NOT near a multi-month high, with no direction disclosed in the headline

L001's bearish default was designed for holders selling into strength; a director's interest notice into elevated volume on a stock that is not extended is structurally different — the director may be acquiring, and insider buying at a depressed price is a constructive signal. Do not apply the L001 bearish default to director interest notices when the stock is not near a recent high; call neutral and require confirmation of direction before leaning bearish, because the base rate for director purchases (constructive) is meaningfully higher than for sales at non-extended prices.

_Seen 9×. First written 2026-09-16, last reinforced 2026-09-21._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-21 | MEM | neutral | -16.7% | Change of Director's Interest Notice |
| 2026-09-21 | MEM | neutral | -16.7% | Change of Director's Interest Notice |
| 2026-09-17 | AUQ | neutral | +9.6% | Change of Director's Interest Notice (F Masani) |
| 2026-09-17 | AUQ | neutral | +9.6% | Change of Director's Interest Notice (F Masani) |
| 2026-09-17 | AUQ | neutral | +9.6% | Change of Director's Interest Notice (F Masani) |

### L002 — Drilling activity announcement (programme start, follow-up drilling underway) with no assay results disclosed

An announcement that drilling has commenced or is underway is a programme statement, not a result — it tells the market only that money is being spent. Do not call bullish on activity-commencement announcements alone; wait for assay data. Flag as neutral until results are released.

_Seen 8×. First written 2026-09-14, last reinforced 2026-09-16._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-16 | MRR | neutral | -7.4% | Minrex Commences Maiden Greenfield Drilling at Tlamino |
| 2026-09-16 | MQR | neutral | -14.6% | DRILLING TO COMMENCE AT YINDI GOLD PROJECT |
| 2026-09-16 | RR1 | neutral | +7.4% | Murchison South Advances to Step Out Drilling |
| 2026-09-16 | MQR | neutral | -14.6% | DRILLING TO COMMENCE AT YINDI GOLD PROJECT |
| 2026-09-16 | RR1 | neutral | +7.4% | Murchison South Advances to Step Out Drilling |

### L014 — Market-sensitive 'development pathway' or strategic-progress announcement on a junior at a 12-month low with near-zero median daily turnover, where volume has spiked sharply in relative terms

When median daily turnover is near zero and relative volume spikes materially (e.g. 3x), even a small number of absolute trades can represent genuine accumulation by an informed party — do not dismiss the volume signal as noise purely because the base is tiny. On a market-sensitive filing at a 12-month low, a relative volume spike of this magnitude combined with a strategic-progress headline should shift the call to bullish rather than neutral, because the marginal buyer is likely informed and the downside is already largely priced.

_Seen 8×. First written 2026-09-15, last reinforced 2026-09-18._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-18 | IBR | neutral | +19.1% | Receipt of final development agreement notice |
| 2026-09-18 | IBR | neutral | +19.1% | Receipt of final development agreement notice |
| 2026-09-18 | IBR | neutral | +19.1% | Receipt of final development agreement notice |
| 2026-09-18 | IBR | neutral | +19.1% | Receipt of final development agreement notice |
| 2026-09-15 | PNT | neutral | +20.9% | Panther Advances Laverton Gold Development Pathway |

### L017 — Cessation of securities (options lapsing unexercised or performance rights forfeited) at a deeply de-rated micro-cap, filed in isolation with no companion capital raise filing on the same day

Options lapsing unexercised at a distressed micro-cap can be read as a positive register-cleaning event — it removes a future dilution overhang without any immediate cash outflow, which on a stock already severely de-rated can be modestly constructive. Do not call bearish on cessation alone; absent a companion raise filing, default to neutral rather than bearish, and consider neutral-to-bullish when the cessation removes a meaningful dilution overhang.

_Seen 8×. First written 2026-09-15, last reinforced 2026-09-18._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-18 | NVX | neutral | -9.1% | Notification of cessation of securities - NVX |
| 2026-09-18 | NVX | neutral | -9.1% | Notification of cessation of securities - NVX |
| 2026-09-18 | NVX | neutral | -9.1% | Notification of cessation of securities - NVX |
| 2026-09-18 | NVX | neutral | -9.1% | Notification of cessation of securities - NVX |
| 2026-09-15 | GCM | bearish | +10.9% | Notification of cessation of securities - GCM |

### L027 — Capital raise (placement) announcement flagged market sensitive at a thinly traded micro-cap, where the raise quantum is large relative to the company's normal daily turnover (e.g. >100 trading days of normal volume), and the intended use of proceeds addresses a specific operational catalyst (named project, named programme)

A large placement relative to normal liquidity, when use of proceeds is specific and operational (not generic 'working capital'), can be read as a funded-catalyst signal rather than a dilution event — the market may re-rate positively on the certainty of execution that the capital now enables; before defaulting to bearish on any placement, ask whether the proceeds are tied to a named near-term catalyst and whether the raise removes a going-concern or execution risk; if yes, call neutral-to-bullish rather than bearish.

_Seen 8×. First written 2026-09-16, last reinforced 2026-09-18._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-18 | NHU | bearish | +7.6% | Application for quotation of securities - NHU |
| 2026-09-18 | NHU | bearish | +7.6% | Application for quotation of securities - NHU |
| 2026-09-17 | TMX | bearish | +13.9% | Issue of Shares and Options |
| 2026-09-17 | TMX | bearish | +13.9% | Issue of Shares and Options |
| 2026-09-17 | TMX | bearish | +13.9% | Application for quotation of securities - TMX |

### L001 — Change in substantial holding filed into elevated recent volume (5-day volume >1.5x average) on a stock near a multi-month high

When volume has been running hot into a substantial holding change, treat the direction of the change as the critical unknown — a reduction by a substantial holder into strength is a material bearish signal, not a neutral procedural event. If you cannot confirm the direction is an increase, default to bearish when the tape is already extended.

_Seen 7×. First written 2026-09-14, last reinforced 2026-09-22._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-22 | LMG | bullish | -21.4% | LMG Successful Equity Raise |
| 2026-09-21 | FMR | bullish | -8.3% | Sale of Canadian Assets |
| 2026-09-16 | VYS | bearish | +11.1% | Change of Director's Interest Notice |
| 2026-09-14 | KCC | bullish | -7.2% | Kincora Receives Further Mongolia Divestment Proceeds |
| 2026-09-14 | SRL | neutral | -15.5% | Change in substantial holding |

### L041 — Despatch of prospectus announcement at a stock 50%+ below its 12-month high, where the prospectus is for a rights issue or entitlement offer (not a placement) and the offer price implies existing holders can participate at current or near-current prices rather than suffering pure dilution

A prospectus despatch is not uniformly bearish — distinguish between a placement prospectus (dilutive, outsiders getting shares at discount) and an entitlement offer prospectus (existing holders given the right to maintain their position); before calling bearish on despatch of prospectus at a distressed stock, ask whether the offer is a rights issue that gives existing holders a participation option, because an entitlement offer at a deeply de-rated stock can be read as a funded-catalyst signal and a floor-setting event rather than a dilution threat; default to neutral rather than bearish when the structure is participatory rather than exclusionary.

_Seen 7×. First written 2026-09-17, last reinforced 2026-09-18._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-18 | ATT | bearish | +9.1% | Lodgement of Prospectus |
| 2026-09-18 | ATT | bearish | +9.1% | Lodgement of Prospectus |
| 2026-09-18 | ATT | bearish | +9.1% | Lodgement of Prospectus |
| 2026-09-18 | ATT | bearish | +9.1% | Lodgement of Prospectus |
| 2026-09-18 | DBF | neutral | +13.1% | Supplementary Prospectus |

### L057 — Royalty or non-core asset sale with fully disclosed cash proceeds (e.g. A$17.5 million) at a near-zero-liquidity micro-cap (median daily turnover <A$5,000/day), where the proceeds are large relative to inferred market capitalisation but the stock has been deeply de-rated and thinly traded for an extended period

Before calling bullish on a disclosed-proceeds asset sale at a near-zero-liquidity micro-cap, ask whether the company retains any operational asset or revenue-generating activity post-sale — if the divested asset was the primary value driver, the cash proceeds may be read as a liquidation signal rather than a balance-sheet strengthening event, and the market may discount the residual entity to near-zero regardless of the cash; default to neutral rather than bullish when the sold asset appears central to the investment thesis and no retained operational catalyst is signalled in the headline.

_Seen 7×. First written 2026-09-21, last reinforced 2026-09-22._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-22 | PGM | bullish | -9.0% | PGM receives final US$2 million from sale of Owendale |
| 2026-09-22 | PGM | bullish | -9.0% | PGM receives final US$2 million from sale of Owendale |
| 2026-09-22 | PGM | bullish | -9.0% | PGM receives final US$2 million from sale of Owendale |
| 2026-09-21 | FZR | bullish | -7.5% | Sale of Bowdens Silver Royalty for A$17.5 million |
| 2026-09-21 | FZR | bullish | -7.5% | Sale of Bowdens Silver Royalty for A$17.5 million |

### L010 — Generic 'Investor Presentation' filing by a junior explorer or pre-revenue company, not flagged market sensitive, with no specific catalyst disclosed in the headline

An investor presentation without a named catalyst (resource estimate, drilling result, funding announcement) is most commonly awareness-building ahead of a capital raise — which is dilutive. Default to bearish rather than neutral when no substantive content is signalled in the headline, because the filing implicitly flags that management is actively marketing stock.

_Seen 6×. First written 2026-09-14, last reinforced 2026-09-17._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-17 | I88 | bearish | +9.6% | RIU Uranium Investment Conference Presentation |
| 2026-09-16 | LIO | neutral | -15.7% | Investor Presentation - Good Oil and Gas Conference |
| 2026-09-16 | LIO | neutral | -15.7% | Investor Presentation - Good Oil and Gas Conference |
| 2026-09-15 | KAL | bearish | +10.9% | Investor Presentation |
| 2026-09-14 | CEL | neutral | -7.1% | Investor Presentation |

### L018 — Gold assay results described as 'extending' mineralisation (rather than upgrading grade or defining resource boundaries) at an explorer 60%+ below its 12-month high, with volume running materially above average into the announcement

When volume is elevated ahead of assay results at a deeply de-rated explorer, the market has already partially priced the news — an 'extension' result (which adds strike length but not necessarily grade or resource quantum) is structurally weaker than a resource-upgrade result and is vulnerable to a sell-the-news reaction into the pre-positioned volume. Call bearish rather than neutral on extension-only assay announcements into elevated volume at stocks with severe prior de-ratings.

_Seen 6×. First written 2026-09-15, last reinforced 2026-09-16._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-16 | PNR | bearish | +9.0% | Racetrack drilling extends mineralised strike length to 900m |
| 2026-09-16 | PNR | bearish | +9.0% | Racetrack drilling extends mineralised strike length to 900m |
| 2026-09-15 | RML | neutral | -8.9% | Latest Gold Assays Extend Golden Gate Mineralisation |
| 2026-09-15 | RML | neutral | -8.9% | Latest Gold Assays Extend Golden Gate Mineralisation |
| 2026-09-15 | RML | neutral | -8.9% | Latest Gold Assays Extend Golden Gate Mineralisation |

### L023 — Drilling programme commencement announcement (L002 shape) that also contains a named policy or strategic update element (e.g. 'US Elemental Update', 'Critical Minerals Strategy Update') for a company with material exposure to an active government critical minerals agenda, stock 60%+ below 12-month high

When a drill-commencement announcement is bundled with a named strategic or policy update, do not apply L002 in isolation — parse whether the secondary element contains substantive policy, offtake, or funding news that is independent of the drill result; if it does, the filing has two information layers and the policy/strategic layer can be the market-moving one. Ask: does the non-drilling component stand alone as a catalyst? If yes, upgrade from neutral toward bullish when the stock is materially de-rated and the strategic context (e.g. US critical minerals policy) is actively supportive.

_Seen 6×. First written 2026-09-15, last reinforced 2026-09-21._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-21 | EPM | neutral | +13.3% | Drilling to Advance Greenland 208 Mt Gronnedal Resource |
| 2026-09-21 | EPM | neutral | +13.3% | Drilling to Advance Greenland 208 Mt Gronnedal Resource |
| 2026-09-21 | EPM | neutral | +13.3% | Drilling to Advance Greenland 208 Mt Gronnedal Resource |
| 2026-09-21 | EPM | neutral | +13.3% | Drilling to Advance Greenland 208 Mt Gronnedal Resource |
| 2026-09-15 | JLL | neutral | +8.7% | McDermitt Drilling Program to Commence & US Elemental Update |

### L028 — Change in substantial holding filing where the stock has been running above-average volume but is NOT near a multi-month high (i.e. the L001 'elevated volume into strength' trigger does not fire), and no direction of change is disclosed in the headline

L001 defaults to bearish when volume is elevated AND the stock is near a high. When the stock is not near a high, the default logic inverts — a substantial holder accumulating into a depressed, above-average-volume tape is more likely to be a strategic buyer than an exiting holder; do not apply the L001 bearish default when the stock is not extended; instead call neutral and require confirmation of direction before leaning bearish.

_Seen 6×. First written 2026-09-16, last reinforced 2026-09-22._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-22 | DCC | bearish | +8.5% | Change in substantial holding |
| 2026-09-22 | DCC | bearish | +8.5% | Change in substantial holding |
| 2026-09-22 | DCC | bearish | +8.5% | Change in substantial holding |
| 2026-09-17 | AUQ | neutral | +9.6% | Change in substantial holding |
| 2026-09-16 | VYS | bearish | +11.1% | Change in substantial holding |

### L058 — Market-sensitive project-update announcement (titled '[Project Name] Update' with no specific milestone in the headline) at a stock at a multi-month low with thin liquidity and no volume data available

A generic project-update headline flagged market sensitive, where the title names only the project and not a specific positive milestone (resource, permit, funding, partner), carries equal probability of containing bad news as good — the market-sensitive flag is necessary but not sufficient to infer direction; default to neutral rather than applying an asymmetric upside assumption, and require headline-level milestone specificity before leaning bullish or bearish at a depressed stock.

_Seen 6×. First written 2026-09-21, last reinforced 2026-09-22._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-22 | IRD | neutral | -10.3% | Corporate Update |
| 2026-09-22 | IRD | neutral | -10.3% | Corporate Update |
| 2026-09-22 | IRD | neutral | -10.3% | Corporate Update |
| 2026-09-21 | AGR | neutral | -14.3% | TRES ESTRADAS UPDATE |
| 2026-09-21 | AGR | neutral | -14.3% | TRES ESTRADAS UPDATE |

### L005 — Drilling intercept result where the headline grade and width appear strong, but the stock is deeply de-rated (>50% below 12-month high)

Before calling bullish on a strong-looking intercept, ask whether the company's de-rating reflects a known structural problem (funding gap, sovereign risk, permitting failure, commodity price collapse) that a single drill result cannot fix. If the stock has fallen >50% from its high, the market has already seen prior results and re-priced; one good hole is rarely sufficient to reverse that narrative without accompanying funding, resource upgrade, or offtake news.

_Seen 5×. First written 2026-09-14, last reinforced 2026-09-16._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-16 | UM1 | bullish | -9.8% | Trenches Expose New Zones of Gold Mineralisation |
| 2026-09-14 | ENR | bullish | -7.8% | High-Grade Niobium Zone Emerging at Joyce |
| 2026-09-14 | GRE | bullish | -9.0% | Extensional Whundo Drilling Hits 4.8m at 7.1% Cu 0.9g/t Au |
| 2026-09-14 | ENR | bullish | -7.8% | High-Grade Niobium Zone Emerging at Joyce |
| 2026-09-14 | GRE | bullish | -9.0% | Extensional Whundo Drilling Hits 4.8m at 7.1% Cu 0.9g/t Au |

### L007 — Asset divestment announcement by a company trading more than 60% below its 12-month high, with no proceeds or deal terms disclosed in the headline

When a deeply distressed company announces a divestment without disclosing proceeds or strategic rationale, the market default is to read it as a distress signal — asset quality concern or cash preservation — rather than strategic rationalisation. In the absence of disclosed terms, lean bearish rather than neutral when the stock is already severely de-rated, because the filing confirms asset disposal without confirming value recovery.

_Seen 5×. First written 2026-09-14, last reinforced 2026-09-17._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-17 | LIO | neutral | +17.8% | Lion Completes Seram (Non-Bula) PSC Sale |
| 2026-09-17 | LIO | neutral | +17.8% | Lion Completes Seram (Non-Bula) PSC Sale |
| 2026-09-14 | MDI | neutral | -7.2% | Divestment of Northern Territory Exploration assets |
| 2026-09-14 | MDI | neutral | -7.2% | Divestment of Northern Territory Exploration assets |
| 2026-09-14 | MDI | neutral | -7.2% | Divestment of Northern Territory Exploration assets |

### L009 — Executive Chairman appointment at a micro-cap or small-cap with an identifiable strategic context (e.g. foreign operations, asset sale process, exploration pivot), filed into above-average recent volume

An Executive Chairman appointment is not always procedural — consolidating board and executive authority in a single named individual is a governance signal that the company is repositioning or that prior leadership has departed under pressure. Before calling neutral, ask whether the appointee is known in the sector and whether the role consolidation implies an acceleration of a known strategic process (sale, JV, restructure); if so, lean bullish or bearish depending on the appointee's track record and the strategic context.

_Seen 5×. First written 2026-09-14, last reinforced 2026-09-16._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-16 | CAZ | neutral | +9.7% | Board Changes & Strategic Review |
| 2026-09-15 | INF | neutral | -24.1% | Board Changes to Accelerate USA Projects |
| 2026-09-15 | INF | neutral | -24.1% | Board Changes to Accelerate USA Projects |
| 2026-09-14 | AA2 | neutral | +7.7% | Appointment of Executive Chairman |
| 2026-09-14 | AA2 | neutral | +7.7% | Appointment of Executive Chairman |

### L016 — Proposed issue of securities filed as part of a strategic cornerstone placement to a named, well-resourced industry participant (e.g. major miner, sovereign fund, large institution) rather than a generic placement to anonymous investors

A placement to a named strategic counterparty with disclosed due-diligence credentials is qualitatively different from a retail or generic institutional placement — it sets a credible reference valuation and signals informed buyer conviction. Default to bullish rather than neutral when the incoming holder is a credible strategic name, even when the filing itself is procedural, because the identity of the placee is the material fact.

_Seen 5×. First written 2026-09-15, last reinforced 2026-09-18._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-18 | EUR | neutral | +8.5% | Application for quotation of securities - EUR |
| 2026-09-15 | WCN | neutral | +12.7% | Proposed issue of securities - WCN |
| 2026-09-15 | WCN | neutral | +12.7% | Proposed issue of securities - WCN |
| 2026-09-15 | WCN | neutral | +12.7% | Proposed issue of securities - WCN |
| 2026-09-15 | WCN | neutral | +12.7% | Proposed issue of securities - WCN |

### L020 — Cleansing statement filed by a junior at a 12-month low, accompanied on the same day by an investor presentation (identifiable via same-day filing cluster)

When a cleansing statement and an investor presentation are filed together at a 12-month low, the presentation may be the use-of-proceeds marketing document for the just-completed raise rather than a pre-raise awareness filing — meaning fresh capital has arrived with a stated deployment plan. Ask whether the raise proceeds create a funded runway that removes the near-term going-concern risk; if so, the cleansing statement signals dilution already absorbed and a funded catalyst pipeline, which is neutral-to-bullish rather than bearish. Do not apply L011 in isolation when a companion presentation discloses a credible use of proceeds.

_Seen 5×. First written 2026-09-15, last reinforced 2026-09-17._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-17 | AAU | bearish | +12.1% | Despatch of Prospectus |
| 2026-09-17 | AM5 | neutral | -20.4% | Application for quotation of securities - AM5 |
| 2026-09-16 | IOV | bearish | +13.7% | IOV Secures $4.25 Million Placement |
| 2026-09-15 | KAL | bearish | +10.9% | Investor Presentation |
| 2026-09-15 | KAL | bearish | +10.9% | Cleansing Statement |

### L026 — Metallurgical testwork result (recovery rate) announced as market sensitive at a junior explorer 50%+ below its 12-month high, with volume running above average into the announcement and no accompanying resource estimate or scoping study

A strong recovery rate headline (e.g. >90% gold recovery) is a project de-risking milestone but is not a standalone re-rating catalyst — it confirms processability, which the market discounts heavily unless accompanied by a resource estimate update or scoping study that translates the recovery into project economics; before calling bullish on metallurgy-only results at a deeply de-rated stock, ask whether the recovery figure can be monetised without a concurrent resource or feasibility update; if not, default to neutral rather than bullish.

_Seen 5×. First written 2026-09-16, last reinforced 2026-09-21._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-21 | COD | bullish | -8.3% | Strong Copper & Silver Results Drive Elizabeth Creek PFS |
| 2026-09-16 | TMX | bullish | -14.6% | Metallurgy Confirms Lightning Gold Up to 93.7% Gold Recovery |
| 2026-09-16 | TMX | bullish | -14.6% | Metallurgy Confirms Lightning Gold Up to 93.7% Gold Recovery |
| 2026-09-16 | TMX | bullish | -14.6% | Metallurgy Confirms Lightning Gold Up to 93.7% Gold Recovery |
| 2026-09-16 | TMX | bullish | -14.6% | Metallurgy Confirms Lightning Gold Up to 93.7% Gold Recovery |

### L032 — Board Changes combined with a Strategic Review announcement, flagged market sensitive, at a stock 50%+ below its 12-month high with above-average recent volume

A 'Board Changes & Strategic Review' filing at a deeply de-rated stock is not a procedural governance event — the strategic review component signals that incumbent leadership has been displaced and an asset or corporate process has been opened, which at a stock with heavily priced-in bad news creates asymmetric upside (sale, merger, or asset monetisation). When the filing is market-sensitive and combines board change with an explicit strategic review, lean bullish rather than neutral, because the downside is already largely priced and the review announcement itself sets a floor by signalling management accountability and potential value realisation.

_Seen 5×. First written 2026-09-16, last reinforced 2026-09-21._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-21 | RLF | neutral | -12.5% | Change in Board Structure |
| 2026-09-21 | RLF | neutral | -12.5% | Change in Board Structure |
| 2026-09-16 | CAZ | neutral | +9.7% | Board Changes & Strategic Review |
| 2026-09-16 | CAZ | neutral | +9.7% | Board Changes & Strategic Review |
| 2026-09-16 | CAZ | neutral | +9.7% | Board Changes & Strategic Review |

### L040 — Application for quotation of securities plus same-day Issue of Shares and Options filing (L003 cluster) at a stock 40-60% below its 12-month high, where the options component of the issue is material (i.e. options are attached to placement shares at a ratio ≥1:1) and no named strategic placee is disclosed

Before calling bearish on an application-for-quotation plus issue-of-shares-and-options cluster purely on dilution grounds, ask whether the options component signals that the placement was priced with significant incentive to attract buyers into a distressed stock — heavily optioned placements at de-rated micro-caps can be read by the market as a funded-catalyst signal (the raise completed despite the de-rating) rather than a pure dilution event; default to neutral rather than bearish when the cluster involves options and no strategic concerns (e.g. going-concern disclosure, asset impairment) accompany it.

_Seen 5×. First written 2026-09-17, last reinforced 2026-09-18._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-18 | EUR | neutral | +8.5% | Application for quotation of securities - EUR |
| 2026-09-18 | EUR | neutral | +8.5% | Application for quotation of securities - EUR |
| 2026-09-17 | OMG | neutral | +13.9% | Application for quotation of securities - OMG |
| 2026-09-17 | OMG | neutral | +13.9% | Application for quotation of securities - OMG |
| 2026-09-17 | TMX | bearish | +13.9% | Issue of Shares and Options |

### L048 — AGM date and director nomination deadline filing at a deeply de-rated junior explorer (60%+ below 12-month high) with elevated recent volume (5-day volume >1.5x average) and near-zero median daily turnover, where the director nomination window opens a credible pathway for a contested or activist appointment

An AGM notice is not always content-free when the stock is deeply de-rated and volume is elevated — the director nomination deadline is a governance event that can attract activist or strategic interest; before calling neutral, ask whether the volume spike coincides with a known activist position or a corporate action rumour, and if the stock has the shape of an activist target (deep de-rating, illiquid, small board), lean neutral-to-bullish rather than purely neutral. Here the volume (1.92x) into a near-zero-liquidity stock (median ~A$345/day) at a 63% de-rating was dismissed as noise, but at that liquidity level even a single informed buyer opening or building a position ahead of a nomination deadline is a material signal.

_Seen 5×. First written 2026-09-18, last reinforced 2026-09-22._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-22 | MEU | neutral | -7.5% | Date of Annual General Meeting |
| 2026-09-22 | CYV | neutral | +10.8% | Annual General Meeting Date |
| 2026-09-22 | PV1 | neutral | +16.4% | 2026 Annual General Meeting |
| 2026-09-22 | BNR | neutral | +18.2% | Notification of 2026 AGM |
| 2026-09-22 | TRI | neutral | -25.3% | Notice of AGM and Closing Date for Director Nominations |

### L050 — Application for quotation of securities filed by a uranium or thematic-sector junior at a 12-month low with below-average volume (<0.5x) and near-zero liquidity (median daily turnover <A$10,000/day), where the sector is in an active thematic re-rating (e.g. uranium cycle)

An application for quotation at a 12-month low on a uranium or active-thematic junior is not uniformly bearish — the raise has already completed and the new capital may fund the next operational step in a sector where thematic inflows are active; before calling bearish on quotation-of-securities at a thematic junior, ask whether the proceeds enable a named near-term catalyst (drill start, resource work, offtake) and whether the sector theme is attracting specialist fund inflows that make fresh paper absorbable; if both conditions hold, default to neutral rather than bearish, because the dilution is already done and the funded-catalyst signal may dominate the supply-overhang concern.

_Seen 5×. First written 2026-09-18, last reinforced 2026-09-22._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-22 | SQX | bearish | +21.1% | Application for quotation of securities - SQX |
| 2026-09-22 | SQX | bearish | +21.1% | Application for quotation of securities - SQX |
| 2026-09-22 | SQX | bearish | +21.1% | Application for quotation of securities - SQX |
| 2026-09-18 | NHU | bearish | +7.6% | Application for quotation of securities - NHU |
| 2026-09-18 | EUR | neutral | +8.5% | Application for quotation of securities - EUR |

### L003 — Multiple administrative filings (e.g. cessation of securities plus quotation of securities) lodged by the same company on the same day

When two or more procedural filings land simultaneously from the same issuer, treat the cluster as a potential signal of a capital raise or restructuring event that has just completed — ask what underlying transaction generated both filings and whether it implies dilution or a change in register composition that the market has not yet absorbed.

_Seen 4×. First written 2026-09-14, last reinforced 2026-09-14._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-14 | KLV | neutral | -13.7% | Application for quotation of securities - KLV |
| 2026-09-14 | KLV | neutral | -13.7% | Notification of cessation of securities - KLV |
| 2026-09-14 | SRL | neutral | -15.5% | Application for quotation of securities - SRL |
| 2026-09-14 | KLV | neutral | -13.7% | Application for quotation of securities - KLV |
| 2026-09-14 | KLV | neutral | -13.7% | Notification of cessation of securities - KLV |

### L004 — Clinical or scientific presentation announcement (oral or poster) at a named medical/scientific conference, stock at or near a multi-month low

An oral presentation slot at a competitive scientific conference is a positive credibility signal that is not merely procedural — it is peer selection of the data as noteworthy. When the stock is already at a significant low, this combination creates asymmetric upside that a neutral call misses; lean bullish when the presentation is oral, the conference is named and credible, and the stock is materially depressed.

_Seen 4×. First written 2026-09-14, last reinforced 2026-09-14._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-14 | RAD | neutral | +12.4% | RAD oral presentation at SNO26 on RAD101 Phase IIb data |
| 2026-09-14 | RAD | neutral | +12.4% | RAD oral presentation at SNO26 on RAD101 Phase IIb data |
| 2026-09-14 | RAD | neutral | +12.4% | RAD oral presentation at SNO26 on RAD101 Phase IIb data |
| 2026-09-14 | RAD | neutral | +12.4% | RAD oral presentation at SNO26 on RAD101 Phase IIb data |

### L006 — Single contract win announcement (no dollar value disclosed) for a thinly traded micro-cap services or technology company, flagged market sensitive

When a contract announcement omits revenue value entirely, treat the omission as a material qualifier — the market cannot size the earnings impact and often re-rates the stock down as the news fails to meet the implicit expectation set by the market-sensitive flag. Do not call bullish on a contract win without a disclosed or estimable dollar value; default to neutral until quantum is known.

_Seen 4×. First written 2026-09-14, last reinforced 2026-09-17._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-17 | I88 | bearish | +9.6% | RIU Uranium Investment Conference Presentation |
| 2026-09-14 | AMX | bullish | -11.0% | AMX secures Daly Waters LiDAR and Imagery survey project |
| 2026-09-14 | AMX | bullish | -11.0% | AMX secures Daly Waters LiDAR and Imagery survey project |
| 2026-09-14 | AMX | bullish | -11.0% | AMX secures Daly Waters LiDAR and Imagery survey project |

### L011 — Cleansing notice filed by a company at or near a multi-month high, stock extremely illiquid (median daily turnover <A$100/day)

A cleansing notice confirms a prior exempt offer has completed and new shares are now freely tradeable — treat this as a dilution-confirmation event, not a neutral administrative filing. When the stock is at a local high and liquidity is near-zero, the incoming free float of newly placeable shares into a thin market is a material bearish overhang; lean bearish rather than neutral.

_Seen 4×. First written 2026-09-14, last reinforced 2026-09-17._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-17 | AM5 | neutral | -20.4% | Application for quotation of securities - AM5 |
| 2026-09-15 | KAL | bearish | +10.9% | Investor Presentation |
| 2026-09-15 | KAL | bearish | +10.9% | Cleansing Statement |
| 2026-09-14 | C7A | neutral | -25.1% | Cleansing Notice |

### L013 — Completion-of-survey announcement (soil geochemistry, geophysical, mapping) at a junior explorer where no prior price action data is available, filing not flagged market sensitive

A survey-completion filing is subtly different from a survey-commencement filing: completion means results are now in hand and will be interpreted shortly, which can itself be a near-term catalyst signal. Without price action data to judge positioning, do not default to neutral on completion — the absence of tape data removes the key bearish argument (extended positioning vulnerable to unwind) that makes commencement announcements neutral; lean neutral-to-bullish when completion implies imminent result publication.

_Seen 4×. First written 2026-09-15, last reinforced 2026-09-15._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-15 | SLB | neutral | +26.4% | Maiden Soil Geochemical Survey Completed at HoL Updated |
| 2026-09-15 | SLB | neutral | +26.4% | Maiden Soil Geochemical Survey Completed at HoL Updated |
| 2026-09-15 | SLB | neutral | +26.4% | Maiden Soil Geochemical Survey Completed at HoL Updated |
| 2026-09-15 | SLB | neutral | +26.4% | Maiden Soil Geochemical Survey Completed at HoL Updated |

### L015 — Investor presentation filed simultaneously with a capital raise announcement by a small-cap or micro-cap, where the presentation is the marketing document for the raise

When a presentation is explicitly the collateral for a concurrent capital raise (identifiable via same-day L003 cluster), it is not a neutral awareness filing — it is confirmation that dilution is in progress and the stock will be re-priced at the placement price. Call bearish, not neutral, when the presentation serves the raise rather than standing alone as an operational update.

_Seen 4×. First written 2026-09-15, last reinforced 2026-09-15._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-15 | DWG | neutral | -15.8% | Presentation-Gov Reg Infrastructure. Built for Global Scale |
| 2026-09-15 | DWG | neutral | -15.8% | Presentation-Gov Reg Infrastructure. Built for Global Scale |
| 2026-09-15 | DWG | neutral | -15.8% | Presentation-Gov Reg Infrastructure. Built for Global Scale |
| 2026-09-15 | DWG | neutral | -15.8% | Presentation-Gov Reg Infrastructure. Built for Global Scale |

### L021 — Government or official-body selection of a junior's project for a named investment summit, trade mission, or critical minerals programme (not flagged market sensitive), stock 40-60% below 12-month high

Selection by a government or multilateral body for a named investment summit is not purely promotional — it is an implicit third-party endorsement of the project's strategic credibility within a national or supranational critical minerals agenda, which can function as a near-term re-rating catalyst independent of any technical result. Do not apply L010 (pre-raise awareness marketing) to government-selection announcements; instead lean neutral-to-bullish when the selecting body is credible, the project is in a jurisdiction with active critical minerals policy, and the stock is materially de-rated.

_Seen 4×. First written 2026-09-15, last reinforced 2026-09-17._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-17 | I88 | bearish | +9.6% | RIU Uranium Investment Conference Presentation |
| 2026-09-17 | CR3 | bearish | +16.2% | Investor Presentation - RIU Uranium Investment Day |
| 2026-09-15 | PL9 | neutral | +10.0% | Prairie Project Selected for Canada Investment Summit |
| 2026-09-15 | PL9 | neutral | +10.0% | Prairie Project Selected for Canada Investment Summit |
| 2026-09-15 | PL9 | neutral | +10.0% | Prairie Project Selected for Canada Investment Summit |

### L022 — Permit submission (bulk sampling, exploration, environmental) announced as market sensitive by a junior explorer 40-60% below its 12-month high, with no prior permit submission flagged

A maiden permit submission flagged as market sensitive signals that management and their legal advisers regard the regulatory gate as a material project milestone, not a routine step — the market-sensitive designation is the key qualifier that distinguishes this from a generic activity statement. Do not default to neutral purely because no data has been returned; lean neutral-to-bullish when the permit is the first of its kind for the project, the stock is materially de-rated, and the market-sensitive flag is present, because approval opens the next operational phase and the flag indicates the company believes the market does not have this priced.

_Seen 4×. First written 2026-09-15, last reinforced 2026-09-18._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-18 | VTX | neutral | +8.7% | Operational Update - Varied EPL Issued |
| 2026-09-15 | OD6 | neutral | +10.0% | MAIDEN QUINN DRILLING BULK SAMLPLING PERMIT SUBMITTED |
| 2026-09-15 | OD6 | neutral | +10.0% | MAIDEN QUINN DRILLING BULK SAMLPLING PERMIT SUBMITTED |
| 2026-09-15 | OD6 | neutral | +10.0% | MAIDEN QUINN DRILLING BULK SAMLPLING PERMIT SUBMITTED |

### L024 — Market-sensitive acquisition announcement where the acquirer's stock is at a multi-month high and the target is a named junior peer with identifiable asset overlap, but the headline omits transaction terms (consideration type, ratio, or cash component)

When consideration terms are absent from the headline of a market-sensitive acquisition announcement, the market will price the worst-case dilution scenario — treat as bearish rather than neutral when the acquirer is at a multi-month high, because the scrip-issuance risk is immediately visible but the strategic upside is not quantifiable without terms; do not default to neutral pending deal detail.

_Seen 4×. First written 2026-09-16, last reinforced 2026-09-16._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-16 | FAU | neutral | -16.9% | JAV: FIRST AU TO ACQUIRE JAVELIN MINERALS |
| 2026-09-16 | FAU | neutral | -16.9% | FIRST AU TO ACQUIRE JAVELIN MINERALS |
| 2026-09-16 | FAU | neutral | -16.9% | JAV: FIRST AU TO ACQUIRE JAVELIN MINERALS |
| 2026-09-16 | FAU | neutral | -16.9% | FIRST AU TO ACQUIRE JAVELIN MINERALS |
| 2026-09-16 | FAU | neutral | -16.9% | JAV: FIRST AU TO ACQUIRE JAVELIN MINERALS |

### L025 — Oil or gas well operations update (titled 'Operations Update' or similar) at a stock 80%+ below its 12-month high, not flagged market sensitive, with no flow-rate or pressure data in the headline, but implying active well intervention is underway

An operations update on a named well at an oil and gas junior — even without disclosed results — can signal that a well intervention has succeeded enough to warrant public disclosure; before applying L002 or L005, ask whether the headline's operational specificity (named well, active verb) implies a result is embedded in the body of the filing; if so, do not default to bearish on the de-rating alone — call neutral pending body review rather than bearish.

_Seen 4×. First written 2026-09-16, last reinforced 2026-09-16._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-16 | XST | bearish | +16.4% | Diona-1 Operations Update |
| 2026-09-16 | XST | bearish | +16.4% | Diona-1 Operations Update |
| 2026-09-16 | AXP | neutral | -9.4% | Oil Flow Rates Enhanced at Charlie 1 Well After Controlled F |
| 2026-09-16 | XST | bearish | +16.4% | Diona-1 Operations Update |
| 2026-09-16 | XST | bearish | +16.4% | Diona-1 Operations Update |

### L030 — Production or processing restart announcement (refinery, plant, mill) flagged market sensitive at a stock 70%+ below its 12-month high, with below-average volume in the prior sessions

A refinery or plant restart flagged as market sensitive is qualitatively different from a drill result or resource update — it signals a transition from development to active production-phase activity, which can be a discrete re-rating event even at a deeply de-rated stock; do not apply L005 (single-result insufficient to reverse de-rating) mechanically to operational restart announcements, because the restart itself changes the company's revenue-generating status; call neutral-to-bullish when the market-sensitive flag is present and the announcement confirms commencement of a production-phase activity, even with below-average pre-announcement volume.

_Seen 4×. First written 2026-09-16, last reinforced 2026-09-16._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-16 | AT4 | neutral | +9.2% | Del Sol Refinery Restart Campaign Commencing |
| 2026-09-16 | AT4 | neutral | +9.2% | Del Sol Refinery Restart Campaign Commencing |
| 2026-09-16 | AXP | neutral | -9.4% | Oil Flow Rates Enhanced at Charlie 1 Well After Controlled F |
| 2026-09-16 | AT4 | neutral | +9.2% | Del Sol Refinery Restart Campaign Commencing |
| 2026-09-16 | AT4 | neutral | +9.2% | Del Sol Refinery Restart Campaign Commencing |

### L034 — Extension-only drill result (L018 shape) at a stock 50–70% below its 12-month high, where pre-announcement volume is materially BELOW average (volume ratio <0.7x)

L018's bearish default was built for elevated-volume scenarios where sell-the-news risk is the dominant concern. When volume is suppressed ahead of an extension result, the pre-positioning argument inverts — there is no crowded long to unwind, and thin pre-positioning into a material geological result at a deeply de-rated stock can produce a relief-buying response. Do not apply L018's bearish call when pre-announcement volume is below average; default to neutral instead, and reserve bearish for extension results into elevated volume only.

_Seen 4×. First written 2026-09-16, last reinforced 2026-09-21._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-21 | HWK | neutral | +8.8% | Exploration Underway at the Olympus Scandium Project, WA |
| 2026-09-21 | HWK | neutral | +8.8% | Exploration Underway at the Olympus Scandium Project, WA |
| 2026-09-21 | HWK | neutral | +8.8% | Exploration Underway at the Olympus Scandium Project, WA |
| 2026-09-16 | PNR | bearish | +9.0% | Racetrack drilling extends mineralised strike length to 900m |

### L035 — Market-sensitive tenement application announcement (new ground, additional block, adjacent tenure) at a junior explorer with 5-day volume running >1.5x average, with no price-position data indicating the stock is near a multi-month high

A market-sensitive tenement application is not merely an activity statement — management and their advisers have judged it material, which implies the ground is strategically significant (district consolidation, blocking a competitor, covering a known geophysical anomaly); do not default to neutral on a flagged tenement announcement into elevated volume; lean neutral-to-bullish when the market-sensitive designation is present, because the flag is itself the signal that the tenure has identifiable value beyond routine acreage.

_Seen 4×. First written 2026-09-17, last reinforced 2026-09-17._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-17 | AMD | neutral | +17.2% | Application to secure another key iron ore tenement |
| 2026-09-17 | AMD | neutral | +17.2% | Application to secure another key iron ore tenement |
| 2026-09-17 | AMD | neutral | +17.2% | Application to secure another key iron ore tenement |
| 2026-09-17 | AMD | neutral | +17.2% | Application to secure another key iron ore tenement |

### L036 — Supplementary JORC Table 1 filing (technical compliance document supporting a prior resource or exploration result) flagged market sensitive at a stock 50%+ below its 12-month high

A supplementary JORC Table 1 flagged as market sensitive is not merely an audit-trail filing — the market-sensitive designation signals that the underlying resource estimate it supports is itself a material new disclosure (maiden resource, significant upgrade) that may not have been fully absorbed when the primary announcement landed; do not call neutral on a market-sensitive Table 1 purely because it is labelled supplementary — treat it as confirmation that a substantive resource event has occurred and lean neutral-to-bullish when the stock is materially de-rated and the flag is present.

_Seen 4×. First written 2026-09-17, last reinforced 2026-09-17._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-17 | ERL | neutral | +10.7% | Supplementary Information - JORC Table 1 for Yuinmery |
| 2026-09-17 | ERL | neutral | +10.7% | Supplementary Information - JORC Table 1 for Yuinmery |
| 2026-09-17 | ERL | neutral | +10.7% | Supplementary Information - JORC Table 1 for Yuinmery |
| 2026-09-17 | ERL | neutral | +10.7% | Supplementary Information - JORC Table 1 for Yuinmery |

### L037 — Market-sensitive response to an ASX price query at a stock at or near a 12-month low with volume running materially above average (>3x) and median daily turnover near zero

An ASX price query response that is flagged market sensitive and lands into a volume spike at a 12-month low almost always contains an affirmative disclosure — the exchange queries only when price action is anomalous, and a market-sensitive response confirms the company has something to say rather than a 'not aware of any reason' denial; lean bullish rather than neutral when the response is market-sensitive, the stock is at a multi-month low, and volume has already spiked, because the filing type itself signals an embedded catalyst rather than a denial.

_Seen 4×. First written 2026-09-17, last reinforced 2026-09-17._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-17 | BGE | neutral | +10.7% | Response to ASX Price Query |
| 2026-09-17 | BGE | neutral | +10.7% | Response to ASX Price Query |
| 2026-09-17 | BGE | neutral | +10.7% | Response to ASX Price Query |
| 2026-09-17 | BGE | neutral | +10.7% | Response to ASX Price Query |

### L038 — Completed asset divestment announcement (titled 'Completes … Sale') at a stock 50%+ below its 12-month high, not flagged market sensitive, where the asset disposed is a non-core or operationally burdensome interest (e.g. a PSC, a JV stake, a legacy mine) and the headline uses the word 'Completes' rather than 'Announces'

A completion announcement is categorically different from an intention or signing announcement — it confirms cash (or consideration) has actually changed hands and the liability or cost centre has been extinguished; before applying L007's bearish default, ask whether the disposed asset was a drag (cash burn, sovereign risk, contingent liability) whose removal is itself the positive catalyst; if so, lean neutral-to-bullish rather than bearish, because the market may re-rate on balance-sheet simplification even without a disclosed quantum.

_Seen 4×. First written 2026-09-17, last reinforced 2026-09-21._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-21 | UNT | neutral | +9.1% | Unith Extends Debt Facility to 30 April 2027 |
| 2026-09-17 | LIO | neutral | +17.8% | Lion Completes Seram (Non-Bula) PSC Sale |
| 2026-09-17 | LIO | neutral | +17.8% | Lion Completes Seram (Non-Bula) PSC Sale |
| 2026-09-17 | LIO | neutral | +17.8% | Lion Completes Seram (Non-Bula) PSC Sale |

### L039 — Investor presentation filed for a named sector-specialist conference (e.g. RIU Uranium Investment Day, Noosa Mining) at a deeply de-rated micro-cap (60%+ below 12-month high) where the conference is a known gathering of specialist institutional and sophisticated investors in that commodity, and the stock is flagged or is in an actively re-rating sector theme (e.g. uranium)

A named specialist-sector conference presentation is not equivalent to a generic awareness-marketing filing under L010 — the audience is sector-informed and the act of presenting can itself trigger accumulation by specialist funds who were not previously holders; before applying L010's bearish default, ask whether the conference is a known catalyst event for the sector (i.e. RIU Uranium, Noosa Mining) and whether the sector is in an active thematic re-rating; if yes, downgrade from bearish to neutral, because the dilution-marketing logic of L010 does not apply when the audience is buying, not being sold to.

_Seen 4×. First written 2026-09-17, last reinforced 2026-09-18._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-18 | TVN | bearish | +7.9% | Online Investor Briefing |
| 2026-09-18 | BRN | neutral | +8.0% | BrainChip to present in AI and Semiconductor webinar |
| 2026-09-17 | I88 | bearish | +9.6% | RIU Uranium Investment Conference Presentation |
| 2026-09-17 | CR3 | bearish | +16.2% | Investor Presentation - RIU Uranium Investment Day |
| 2026-09-17 | I88 | bearish | +9.6% | RIU Uranium Investment Conference Presentation |

### L043 — Investor presentation at a named investor forum (e.g. 'Metals Investor Forum', 'RIU', 'Noosa Mining') by a junior explorer, not flagged market sensitive, with no price action data available

Before applying L010's bearish default, distinguish between a generic online awareness filing and a presentation at a named sector-specialist investor forum — the latter attracts an audience of active buyers in the commodity, not passive observers, and can itself be an accumulation catalyst; default to neutral rather than bearish when the forum is named and sector-specialist, reserving bearish only for generic non-conference online or roadshow filings with no named audience.

_Seen 4×. First written 2026-09-18, last reinforced 2026-09-18._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-18 | USL | bearish | +13.2% | Metals Investor Forum Presentation |
| 2026-09-18 | USL | bearish | +13.2% | Metals Investor Forum Presentation |
| 2026-09-18 | TVN | bearish | +7.9% | Online Investor Briefing |
| 2026-09-18 | USL | bearish | +13.2% | Metals Investor Forum Presentation |
| 2026-09-18 | USL | bearish | +13.2% | Metals Investor Forum Presentation |

### L051 — First-sample or initial surface/channel sampling result confirming in-situ mineralisation (not alluvial, not a drill intercept) at a junior explorer, flagged market sensitive, with below-average pre-announcement volume (<0.5x)

A market-sensitive 'first samples confirm in-situ' result is not a programme statement under L002 — it is an actual analytical result establishing primary hard-rock mineralisation for the first time, which is a genuine geological de-risking event; when pre-announcement volume is suppressed (no crowded long to unwind), do not default to neutral — lean neutral-to-bullish, because the result is real data rather than a commencement notice and the sell-the-news risk is low.

_Seen 4×. First written 2026-09-21, last reinforced 2026-09-21._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-21 | LIB | neutral | +25.0% | FIRST SAMPLES CONFIRM IN-SITU GOLD FROM HARD ROCK, OKO NORTH |
| 2026-09-21 | LIB | neutral | +25.0% | FIRST SAMPLES CONFIRM IN-SITU GOLD FROM HARD ROCK, OKO NORTH |
| 2026-09-21 | LIB | neutral | +25.0% | FIRST SAMPLES CONFIRM IN-SITU GOLD FROM HARD ROCK, OKO NORTH |
| 2026-09-21 | LIB | neutral | +25.0% | FIRST SAMPLES CONFIRM IN-SITU GOLD FROM HARD ROCK, OKO NORTH |

### L052 — Market-sensitive announcement that a target company's board has rejected a 'further revised' (second or subsequent) acquisition proposal from a named acquirer, with volume elevated (>1.5x average) and stock near a multi-month high

A board rejection of a further-revised offer, when the stock is already near its high on elevated volume, signals that M&A optionality is fully priced and the rejection increases deal-collapse risk rather than bump probability — the market interprets the rejection as the acquirer's limit being reached rather than as leverage for a higher bid; call bearish rather than bullish when this is a second-or-subsequent rejection into an extended, pre-positioned tape.

_Seen 4×. First written 2026-09-21, last reinforced 2026-09-21._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-21 | PPT | bullish | -15.1% | Perpetual rejects further revised proposal from EQT |
| 2026-09-21 | PPT | bullish | -15.1% | Perpetual rejects further revised proposal from EQT |
| 2026-09-21 | PPT | bullish | -15.1% | Perpetual rejects further revised proposal from EQT |
| 2026-09-21 | PPT | bullish | -15.1% | Perpetual rejects further revised proposal from EQT |

### L053 — Market-sensitive merger or 'join forces' announcement between two named companies where the structure involves combining equity (merger rather than acquisition), stock of the announcing party is near a multi-month high on elevated volume (>1.5x), and consideration terms (exchange ratio, premium) are absent from the headline

Apply L024's logic symmetrically to merger announcements: when a merger is announced without disclosed exchange ratio or consideration at a stock near its high on elevated volume, the market will immediately price worst-case dilution for the announcing party's shareholders; call bearish rather than bullish when terms are absent, the stock is extended, and the structure implies scrip issuance — strategic upside is not quantifiable but dilution risk is immediately visible.

_Seen 4×. First written 2026-09-21, last reinforced 2026-09-21._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-21 | TLX | bullish | -11.7% | Telix and ITM Join Forces to Create Radiopharma Powerhouse |
| 2026-09-21 | TLX | bullish | -11.7% | Telix and ITM Join Forces to Create Radiopharma Powerhouse |
| 2026-09-21 | TLX | bullish | -11.7% | Telix and ITM Join Forces to Create Radiopharma Powerhouse |
| 2026-09-21 | TLX | bullish | -11.7% | Telix and ITM Join Forces to Create Radiopharma Powerhouse |

### L054 — Drill intercept result headlined as a footprint expansion ('hits X mineralisation Y metres outside current resource') at a junior miner with no price action data available, where the result is described by mineralisation type rather than by grade and width

A headline describing what was hit (mineralisation type, distance from resource) rather than how much (grade, width) is structurally an extension result without economic quantification — apply L018's logic regardless of volume data when grade and width are absent from the headline; call neutral rather than bullish, because the market cannot size the value addition without grade data and the filing confirms presence but not economics.

_Seen 4×. First written 2026-09-21, last reinforced 2026-09-21._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-21 | KLI | bullish | -9.7% | Killi Hits Coarse Magnetite 600m Outside Current Resource |
| 2026-09-21 | KLI | bullish | -9.7% | Killi Hits Coarse Magnetite 600m Outside Current Resource |
| 2026-09-21 | KLI | bullish | -9.7% | Killi Hits Coarse Magnetite 600m Outside Current Resource |
| 2026-09-21 | KLI | bullish | -9.7% | Killi Hits Coarse Magnetite 600m Outside Current Resource |

### L055 — AGM filing that bundles a resolution to change the company name alongside director nominations, at a stock 50%+ below its 12-month high with near-zero median daily turnover

A name-change resolution in an AGM notice at a deeply de-rated micro-cap is a leading indicator of a strategic pivot (new commodity, new geography, or post-restructure rebrand) that often precedes an operational announcement or capital raise; do not treat as purely administrative — lean neutral-to-bullish rather than neutral, because the name change signals management has already decided on a new direction and the AGM is the formal gate for executing it.

_Seen 4×. First written 2026-09-21, last reinforced 2026-09-21._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-21 | GIB | neutral | +9.7% | 2026 AGM Director Nominations & Resolution to Change Name |
| 2026-09-21 | ADN | neutral | +16.7% | Date of 2026 AGM |
| 2026-09-21 | GIB | neutral | +9.7% | 2026 AGM Director Nominations & Resolution to Change Name |
| 2026-09-21 | ADN | neutral | +16.7% | Date of 2026 AGM |
| 2026-09-21 | GIB | neutral | +9.7% | 2026 AGM Director Nominations & Resolution to Change Name |

### L056 — 'Becoming a substantial holder' (maiden 5% crossing, direction unambiguously accumulation per L029) at a company with known recent material adverse history (operational failure, geopolitical event, significant prior de-rating) where no price action data is available to assess current positioning

L029 establishes a bullish prior for maiden substantial-holder filings, but before applying it, ask whether the company has a known unresolved structural problem (sovereign risk event, debt covenant breach, asset impairment) that a 5% crossing does not address — if a named adverse event is recent and unresolved, the new holder may be a distressed-debt or restructuring buyer rather than a long-only accumulator, which is not uniformly bullish for equity holders; downgrade to neutral when a recent material adverse event is known and unresolved.

_Seen 4×. First written 2026-09-21, last reinforced 2026-09-21._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-21 | RSG | bullish | -8.5% | Becoming a substantial holder |
| 2026-09-21 | RSG | bullish | -8.5% | Becoming a substantial holder |
| 2026-09-21 | RSG | bullish | -8.5% | Becoming a substantial holder |
| 2026-09-21 | RSG | bullish | -8.5% | Becoming a substantial holder |

### L008 — Early-stage geophysical survey commencement announcement (airborne magnetic, gravity, CSAMT etc.) on an illiquid junior explorer at or near a multi-month high, not flagged market sensitive

A survey commencement is a programme-activity statement with no data content — it tells the market only that fieldwork has started, which is often already anticipated after prior announcements. Treat as neutral-to-bearish when the stock is already at a local high, because speculative positioning built ahead of the announcement has no new result to feed on and is vulnerable to unwind.

_Seen 3×. First written 2026-09-14, last reinforced 2026-09-16._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-16 | LIO | neutral | -15.7% | Investor Presentation - Good Oil and Gas Conference |
| 2026-09-14 | LCL | neutral | -12.6% | Airborne magnetic survey to commence in PNG |
| 2026-09-14 | LCL | neutral | -12.6% | Airborne magnetic survey to commence in PNG |

### L019 — Announcement packaging multiple simultaneous high-conviction catalysts (e.g. resource drilling + scoping study + JV buyout in a single headline) at a junior explorer or developer, with no price action data available

When three or more distinct value-creating events are announced simultaneously, ask whether the packaging itself signals execution risk or financial pressure — a company announcing a JV buyout, scoping study, and active drilling in one release may be doing so because it needs to justify a concurrent capital raise or shore up investor confidence ahead of a funding shortfall. Check for a same-day capital raise filing before calling bullish; if a raise is present or the announcement reads as a 'kitchen sink' designed to support a valuation pitch, downgrade to neutral.

_Seen 3×. First written 2026-09-15, last reinforced 2026-09-15._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-15 | EMC | bullish | -11.6% | Resource Drilling, Scoping Study, JV Buyout at Revere Gold |
| 2026-09-15 | EMC | bullish | -11.6% | Resource Drilling, Scoping Study, JV Buyout at Revere Gold |
| 2026-09-15 | EMC | bullish | -11.6% | Resource Drilling, Scoping Study, JV Buyout at Revere Gold |

### L044 — Supplementary prospectus filed by a deeply de-rated, near-zero-liquidity micro-cap (70%+ below 12-month high, median daily turnover <A$15,000/day), not flagged market sensitive

A supplementary prospectus is not uniformly administrative — it amends a live offer document, which means a capital raise is actively in progress and fresh capital is imminent; before calling neutral, ask whether the primary prospectus is an entitlement offer or rights issue that gives existing holders a participation right at current prices, because in a near-zero-liquidity stock even a small completed raise can function as a funded-catalyst and floor-setting signal; apply the same participatory-vs-exclusionary distinction as L041 and default to neutral-to-bullish rather than purely neutral when the structure is participatory.

_Seen 3×. First written 2026-09-18, last reinforced 2026-09-18._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-18 | DBF | neutral | +13.1% | Supplementary Prospectus |
| 2026-09-18 | DBF | neutral | +13.1% | Supplementary Prospectus |
| 2026-09-18 | DBF | neutral | +13.1% | Supplementary Prospectus |

### L045 — Regulatory licence variation announcement (EPL variation, exploration licence amendment, permit modification) with 'Issued' or 'Granted' language at a junior miner/explorer 60%+ below its 12-month high, not flagged market sensitive

A 'varied EPL issued' or equivalent granted-licence announcement removes a specific regulatory risk and confirms the company has active, approved work authorisation — this is structurally different from a mere application or a generic operational update; before defaulting to neutral on the grounds of no assay data or prior de-rating, ask whether the varied licence now enables a specific next operational step (drill start, bulk sample, resource extension) that was previously blocked; if so, lean neutral-to-bullish rather than neutral, because the grant itself is the gating event the market was waiting for.

_Seen 3×. First written 2026-09-18, last reinforced 2026-09-18._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-18 | VTX | neutral | +8.7% | Operational Update - Varied EPL Issued |
| 2026-09-18 | VTX | neutral | +8.7% | Operational Update - Varied EPL Issued |
| 2026-09-18 | VTX | neutral | +8.7% | Operational Update - Varied EPL Issued |

### L046 — Webinar or online presentation announcement (not a named specialist-sector conference, not flagged market sensitive) at a deeply de-rated technology or semiconductor company (50%+ below 12-month high) where the presenting company has a named, distinctive technology with active sector-level investor interest (e.g. AI, neuromorphic computing)

An AI or semiconductor webinar for a company with a named proprietary technology is not equivalent to a generic junior-explorer awareness filing — the audience is sector-informed and the act of presenting in an active thematic (AI, semiconductors) can itself trigger accumulation by thematic investors; before calling neutral, ask whether the sector theme is actively re-rating and whether the company's technology is the type that attracts thematic inflows independent of fundamentals; if yes, lean neutral-to-bullish rather than neutral, because thematic buying is not contingent on new fundamental disclosures.

_Seen 3×. First written 2026-09-18, last reinforced 2026-09-18._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-18 | BRN | neutral | +8.0% | BrainChip to present in AI and Semiconductor webinar |
| 2026-09-18 | BRN | neutral | +8.0% | BrainChip to present in AI and Semiconductor webinar |
| 2026-09-18 | BRN | neutral | +8.0% | BrainChip to present in AI and Semiconductor webinar |

### L047 — Well mobilisation or rig-move commencement announcement (L002 shape) at an oil and gas junior that is near-zero liquidity (median daily turnover <A$1,000/day) with 5-day volume running >3x the 20-day average, stock 40-60% below its 12-month high

At near-zero-liquidity oil and gas juniors, a mobilisation announcement into a large relative volume spike represents a qualitatively different market dynamic than L002 assumes — the start of physical well operations at a named well in an illiquid stock is a discrete binary event that the market treats as a risk-on catalyst, not merely a programme statement; do not dismiss the volume ratio as noise purely because the absolute base is tiny when the ratio exceeds 3x and the announcement names a specific well beginning active operations; lean neutral-to-bullish rather than neutral when these conditions coincide, because the marginal buyer in an illiquid well-operations stock is typically informed about the well's prospects.

_Seen 3×. First written 2026-09-18, last reinforced 2026-09-18._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-18 | LIO | neutral | +7.7% | Bula-Karang-1 Update - Mobilisation Commences |
| 2026-09-18 | LIO | neutral | +7.7% | Bula-Karang-1 Update - Mobilisation Commences |
| 2026-09-18 | LIO | neutral | +7.7% | Bula-Karang-1 Update - Mobilisation Commences |

### L059 — Debt facility extension announcement flagged market sensitive at a deeply de-rated micro-cap (60%+ below 12-month high) with thin liquidity, where the extension removes a near-term maturity cliff and no punitive terms are disclosed in the headline

A market-sensitive debt extension at a distressed micro-cap is primarily a survival event — it removes the going-concern cliff that was the dominant overhang, and the absence of disclosed punitive terms in the headline is the key qualifier; lean neutral-to-bullish rather than neutral when the extension is flagged material and no covenant or conversion language appears in the headline, because removing an existential risk at a stock already priced for distress is asymmetrically positive even if the underlying business remains weak.

_Seen 3×. First written 2026-09-21, last reinforced 2026-09-21._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-21 | UNT | neutral | +9.1% | Unith Extends Debt Facility to 30 April 2027 |
| 2026-09-21 | UNT | neutral | +9.1% | Unith Extends Debt Facility to 30 April 2027 |
| 2026-09-21 | UNT | neutral | +9.1% | Unith Extends Debt Facility to 30 April 2027 |

### L060 — Asset divestment announcement flagged market sensitive at a stock at or near its 12-month high with no disclosed proceeds, where the divested assets are the company's primary or only named asset portfolio rather than a clearly non-core or legacy holding

L007's distress-default does not apply when the stock is at a 12-month high, but the bullish flip is not automatic when proceeds are undisclosed and the divested assets are core rather than peripheral — when the sold portfolio is the company's named primary asset, the market may read the divestment as strategic exit rather than rationalisation, creating uncertainty about what the residual entity is worth; default to neutral rather than bullish when proceeds are absent and the sold asset is central to the investment thesis, regardless of the stock's price level.

_Seen 3×. First written 2026-09-21, last reinforced 2026-09-21._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-21 | FMR | bullish | -8.3% | Sale of Canadian Assets |
| 2026-09-21 | FMR | bullish | -8.3% | Sale of Canadian Assets |
| 2026-09-21 | FMR | bullish | -8.3% | Sale of Canadian Assets |

### L063 — Four or more simultaneous Director's Interest Notices filed on the same day at a deeply de-rated stock (>70% below 12-month high) with elevated recent volume (>2x average), where the filing count suggests a coordinated company-wide equity event (vesting, grant, or on-market purchase programme)

When four or more director interest notices land simultaneously, the coordination itself is the signal — a company-wide vesting or grant event at a distressed stock often accompanies a performance milestone or remuneration restructure that management deems constructive; treat the cluster as a probable positive internal event (vesting on achievement, or coordinated on-market buying) and lean neutral-to-bullish rather than neutral, because the base rate for coordinated director acquisitions at heavily de-rated prices is meaningfully more constructive than a single ambiguous filing.

_Seen 3×. First written 2026-09-22, last reinforced 2026-09-22._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-22 | RAD | neutral | +14.0% | Change of Director's Interest Notices x 4 |
| 2026-09-22 | RAD | neutral | +14.0% | Change of Director's Interest Notices x 4 |
| 2026-09-22 | RAD | neutral | +14.0% | Change of Director's Interest Notices x 4 |

### L064 — Market-sensitive announcement that a specific quantum of previously restricted or escrowed capital has been unlocked (not a new raise, not an asset sale) at a deeply de-rated micro-cap (>60% below 12-month high) with near-zero median daily turnover, where the unlocked amount is material relative to the implied market capitalisation

Unlocking restricted capital is a liquidity event that removes a specific constraint without the dilution of a new placement — when the quantum is material relative to the company's implied market cap and the stock is already severely de-rated, the market-sensitive flag signals that the cash accretion per share is the moving part; lean neutral-to-bullish rather than neutral, because restricted-capital releases are not dilutive and can represent a meaningful funded-runway extension at a company priced for near-insolvency.

_Seen 3×. First written 2026-09-22, last reinforced 2026-09-22._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-22 | CTN | neutral | +8.6% | $1.29M in Restricted Capital Unlocked |
| 2026-09-22 | CTN | neutral | +8.6% | $1.29M in Restricted Capital Unlocked |
| 2026-09-22 | CTN | neutral | +8.6% | $1.29M in Restricted Capital Unlocked |

### L033 — Trenching result (surface exposure of new mineralised zones) announced as market sensitive at a junior explorer 50%+ below its 12-month high, with no assay grades disclosed in the headline

Treat a trenching result without disclosed assay grades as structurally equivalent to an extension-only drill result under L018 — the geological finding (new zones) is not economically quantifiable without grade data, and the market-sensitive flag does not substitute for that missing information; default to neutral rather than bullish until grade data is published, because the announcement confirms presence but not value.

_Seen 2×. First written 2026-09-16, last reinforced 2026-09-16._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-16 | UM1 | bullish | -9.8% | Trenches Expose New Zones of Gold Mineralisation |
| 2026-09-16 | UM1 | bullish | -9.8% | Trenches Expose New Zones of Gold Mineralisation |

### L049 — Online investor briefing announcement (not flagged market sensitive, no named catalyst in headline) by a junior developer or explorer 50%+ below its 12-month high, with 5-day volume materially BELOW average (<0.6x) and the company having material exposure to an active government critical minerals or industrial policy agenda

When pre-announcement volume is suppressed (below 0.6x average) rather than elevated, the L010 pre-raise-marketing bearish logic is weakened — there is no evidence of active marketing-into-accumulation, and the low volume may simply reflect a news-starved register waiting for a briefing catalyst; before defaulting to bearish on a non-flagged briefing at a de-rated junior, ask whether the company has a specific government or policy nexus (critical minerals designation, named project in a national programme) that makes the briefing content strategically credible rather than purely dilution-preparatory; if yes, default to neutral rather than bearish, reserving bearish only for briefings with elevated volume (evidence of active distribution) or explicit placement language.

_Seen 2×. First written 2026-09-18, last reinforced 2026-09-18._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-18 | TVN | bearish | +7.9% | Online Investor Briefing |
| 2026-09-18 | TVN | bearish | +7.9% | Online Investor Briefing |

### L061 — Board structure change announcement (not flagged market sensitive, no named appointments or departures in headline) at a stock 60%+ below its 12-month high with no volume data indicating elevated activity

A generic 'Change in Board Structure' headline at a deeply de-rated micro-cap, even without named individuals or a market-sensitive flag, should not default to neutral — parse whether the headline implies a net reduction in board size (consolidation of authority, cost-cutting signal) or the departure of a named executive, both of which at a distressed company are incrementally bearish; lean bearish rather than neutral when the headline implies simplification or departure rather than addition, because at a deeply de-rated stock board shrinkage typically signals managed wind-down or cost-preservation rather than strategic renewal.

_Seen 2×. First written 2026-09-21, last reinforced 2026-09-21._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-21 | RLF | neutral | -12.5% | Change in Board Structure |
| 2026-09-21 | RLF | neutral | -12.5% | Change in Board Structure |

### L062 — First drill hole result announcing mineralisation intersected ('Intersects X and Y in First Drill Hole') at a stock at a 12-month low with near-zero median daily turnover and near-zero pre-announcement volume, where the headline names the minerals but does not disclose grade or width

A 'first drill hole intersects' headline without disclosed grade and width is structurally equivalent to a footprint-expansion result under L054 — the market cannot price economic value from mineralisation presence alone; before calling bullish on a maiden intercept, require that grade and width appear in the headline or are clearly implied by the market-sensitive flag and filing body; default to neutral rather than bullish when the headline names only mineralisation type and not economic parameters, because the result confirms geological presence but not project value.

_Seen 2×. First written 2026-09-21, last reinforced 2026-09-21._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-21 | MEG | bullish | -7.7% | Megado Intersects Copper and Silver in First Drill Hole |
| 2026-09-21 | MEG | bullish | -7.7% | Megado Intersects Copper and Silver in First Drill Hole |

## Candidates

Seen once. Waiting to see whether they are real or were a coincidence.

### L012 — Unflagged infrastructure or access agreement announcement (haul road, easement, water licence) for a junior developer, with no dollar value, timeline, or work programme attached

A legal-access or infrastructure agreement removes a project risk but does not advance resource, funding, or permitting milestones — it is a prerequisite event, not a value-creation event. Default to bearish rather than neutral when the filing is unflagged and no follow-on catalyst (drill start, feasibility update, funding) is disclosed, because the market often reads the announcement as confirming the project is still in an early gating phase.

_Seen 1×. First written 2026-09-14, last reinforced 2026-09-14._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-14 | RGL | neutral | -8.4% | Haul Road Agreement Delivers Win for RGL's Kal Gold Project |

### L042 — Receipt of a Section 249D shareholder requisition notice at a stock deeply de-rated (>70% below 12-month high), where the requisitioning party is a named industry peer or competitor rather than a passive financial holder

A Section 249D requisition from a named industry peer is not straightforwardly bullish — the requisitioning party may be seeking to install board control in order to pursue a transaction on terms favourable to itself rather than to minority shareholders; before calling bullish, ask whether the requisitioner is a competitor whose agenda may be value-extractive for the target's minorities, and default to neutral rather than bullish when the requistioner's strategic interest is potentially adversarial to existing holders.

_Seen 1×. First written 2026-09-17, last reinforced 2026-09-17._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-17 | GSS | bullish | -10.0% | Receipt of Section 249D Notice from BCAL Diagnostics |

## Dormant

Earned their place once and have not recurred since. Kept for the record.

_None yet._
