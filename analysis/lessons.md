# Lessons

Blind spots the model identified in its own wrong calls, written down after the
close by `reflect.py` and read back to it the next morning. This is a ledger, not
a rolling window — nothing here is ever deleted.

- Last reflection: 2026-10-29
- 229 active, 12 candidate, 0 dormant

A lesson enters as a **candidate** and stays out of the daily prompt until the same
blind spot turns up on 2 separate days, because one occurrence cannot be told
apart from a coincidence. A lesson that stops recurring for 60 days goes **dormant**
and leaves the prompt, keeping its history.

## Active

In front of the model before every call it makes.

### L058 — Market-sensitive project-update announcement (titled '[Project Name] Update' with no specific milestone in the headline) at a stock at a multi-month low with thin liquidity and no volume data available

A generic project-update headline flagged market sensitive, where the title names only the project and not a specific positive milestone (resource, permit, funding, partner), carries equal probability of containing bad news as good — the market-sensitive flag is necessary but not sufficient to infer direction; default to neutral rather than applying an asymmetric upside assumption, and require headline-level milestone specificity before leaning bullish or bearish at a depressed stock.

_Seen 33×. First written 2026-09-21, last reinforced 2026-10-26._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-26 | VR8 | neutral | -20.2% | VR8 Advances DFI Funding Preparation & DFS Workstreams |
| 2026-10-26 | VR8 | neutral | -20.2% | VR8 Advances DFI Funding Preparation & DFS Workstreams |
| 2026-10-26 | VR8 | neutral | -20.2% | VR8 Advances DFI Funding Preparation & DFS Workstreams |
| 2026-10-26 | VR8 | neutral | -20.2% | VR8 Advances DFI Funding Preparation & DFS Workstreams |
| 2026-10-22 | EMA | neutral | -8.7% | Cote D Ivoire Strategic Gold Portfolio Investor Presentation |

### L031 — Change of Director's Interest Notice filed into elevated volume (5-day volume >1.5x average) at a stock that is NOT near a multi-month high, with no direction disclosed in the headline

L001's bearish default was designed for holders selling into strength; a director's interest notice into elevated volume on a stock that is not extended is structurally different — the director may be acquiring, and insider buying at a depressed price is a constructive signal. Do not apply the L001 bearish default to director interest notices when the stock is not near a recent high; call neutral and require confirmation of direction before leaning bearish, because the base rate for director purchases (constructive) is meaningfully higher than for sales at non-extended prices.

_Seen 31×. First written 2026-09-16, last reinforced 2026-10-27._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-27 | EVE | neutral | +17.7% | Change of Director's Interest Notice |
| 2026-10-27 | EVE | neutral | +17.7% | Change of Director's Interest Notice |
| 2026-10-27 | EVE | neutral | +17.7% | Change of Director's Interest Notice |
| 2026-10-27 | EVE | neutral | +17.7% | Change of Director's Interest Notice |
| 2026-10-21 | RMY | neutral | +8.4% | Change of Director's Interest Notice - David Williams |

### L050 — Application for quotation of securities filed by a uranium or thematic-sector junior at a 12-month low with below-average volume (<0.5x) and near-zero liquidity (median daily turnover <A$10,000/day), where the sector is in an active thematic re-rating (e.g. uranium cycle)

An application for quotation at a 12-month low on a uranium or active-thematic junior is not uniformly bearish — the raise has already completed and the new capital may fund the next operational step in a sector where thematic inflows are active; before calling bearish on quotation-of-securities at a thematic junior, ask whether the proceeds enable a named near-term catalyst (drill start, resource work, offtake) and whether the sector theme is attracting specialist fund inflows that make fresh paper absorbable; if both conditions hold, default to neutral rather than bearish, because the dilution is already done and the funded-catalyst signal may dominate the supply-overhang concern.

_Seen 29×. First written 2026-09-18, last reinforced 2026-10-23._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-23 | UM1 | neutral | -9.1% | Application for quotation of securities - UM1 |
| 2026-10-23 | UM1 | neutral | -9.1% | Application for quotation of securities - UM1 |
| 2026-10-23 | UM1 | neutral | -9.1% | Application for quotation of securities - UM1 |
| 2026-10-23 | UM1 | neutral | -9.1% | Application for quotation of securities - UM1 |
| 2026-10-14 | PER | neutral | -24.4% | Application for quotation of securities - PER |

### L109 — Change of substantial holder interest (direction ambiguous, not 'becoming') at a stock 85%+ below its 12-month high with suppressed pre-announcement volume (<0.7x average) and near-zero median daily turnover, where the direction of the change is not disclosed in the headline

At extreme de-ratings (>85% below high) with suppressed volume and near-zero liquidity, an ambiguous substantial-holder change filing carries a higher-than-average probability of reflecting a reduction by a holder exiting a distressed position rather than accumulation — the base rate for institutional exit is higher at these distress levels. When volume is also suppressed (no evidence of accumulation), default to neutral-to-bearish rather than purely neutral, and require confirmation of an increase before calling constructive.

_Seen 26×. First written 2026-10-01, last reinforced 2026-10-29._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-29 | SKY | neutral | -18.0% | Change in substantial holding |
| 2026-10-26 | VUL | bearish | +10.5% | Change in substantial holding |
| 2026-10-26 | VUL | bearish | +10.5% | Change in substantial holding |
| 2026-10-26 | VUL | bearish | +10.5% | Change in substantial holding |
| 2026-10-26 | VUL | bearish | +10.5% | Change in substantial holding |

### L082 — Extension-only or geometry-only assay headline ('extends towards surface', 'extends at depth', 'step-out confirms continuity') at a stock >60% below its 12-month high, with 'high-grade' descriptor present in the headline but no grade or width numbers disclosed, and pre-announcement volume elevated (>1.5x) but at near-zero absolute liquidity (median daily turnover <A$10,000/day)

When 'high-grade' is paired with an extension descriptor in the same headline, do not treat the filing as a pure extension result under L018 — the 'high-grade' qualifier signals that grade data is present in the body and may be the market-moving element; before applying L018's bearish default, ask whether the 'high-grade' language in the headline is a substantive grade claim (i.e., grade data exists in the filing) or purely marketing language; if substantive grade data is present or strongly implied by the descriptor, downgrade the L018 bearish call to neutral rather than bearish, because the grade content may be sufficient to sustain buying even at a deeply de-rated stock.

_Seen 25×. First written 2026-09-24, last reinforced 2026-10-28._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-28 | TNC | bearish | +15.9% | Mt Oxide Drilling Advances as Copper Corridor Extends |
| 2026-10-28 | TNC | bearish | +15.9% | Mt Oxide Drilling Advances as Copper Corridor Extends |
| 2026-10-28 | TNC | bearish | +15.9% | Mt Oxide Drilling Advances as Copper Corridor Extends |
| 2026-10-28 | TNC | bearish | +15.9% | Mt Oxide Drilling Advances as Copper Corridor Extends |
| 2026-10-27 | HWK | bullish | -14.7% | Cactus Corridor Drills Strong Copper-Gold-Silver Assays Utah |

### L041 — Despatch of prospectus announcement at a stock 50%+ below its 12-month high, where the prospectus is for a rights issue or entitlement offer (not a placement) and the offer price implies existing holders can participate at current or near-current prices rather than suffering pure dilution

A prospectus despatch is not uniformly bearish — distinguish between a placement prospectus (dilutive, outsiders getting shares at discount) and an entitlement offer prospectus (existing holders given the right to maintain their position); before calling bearish on despatch of prospectus at a distressed stock, ask whether the offer is a rights issue that gives existing holders a participation option, because an entitlement offer at a deeply de-rated stock can be read as a funded-catalyst signal and a floor-setting event rather than a dilution threat; default to neutral rather than bearish when the structure is participatory rather than exclusionary.

_Seen 24×. First written 2026-09-17, last reinforced 2026-10-08._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-08 | CYP | bearish | +9.9% | Prospectus |
| 2026-10-08 | PRX | neutral | -19.6% | Prospectus |
| 2026-10-08 | CYP | bearish | +9.9% | Prospectus |
| 2026-10-08 | PRX | neutral | -19.6% | Prospectus |
| 2026-10-08 | CYP | bearish | +9.9% | Prospectus |

### L027 — Capital raise (placement) announcement flagged market sensitive at a thinly traded micro-cap, where the raise quantum is large relative to the company's normal daily turnover (e.g. >100 trading days of normal volume), and the intended use of proceeds addresses a specific operational catalyst (named project, named programme)

A large placement relative to normal liquidity, when use of proceeds is specific and operational (not generic 'working capital'), can be read as a funded-catalyst signal rather than a dilution event — the market may re-rate positively on the certainty of execution that the capital now enables; before defaulting to bearish on any placement, ask whether the proceeds are tied to a named near-term catalyst and whether the raise removes a going-concern or execution risk; if yes, call neutral-to-bullish rather than bearish.

_Seen 23×. First written 2026-09-16, last reinforced 2026-10-20._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-20 | AEI | bearish | +14.2% | Placement of Shares |
| 2026-10-20 | AEI | bearish | +14.2% | Placement of Shares |
| 2026-10-20 | STV | bearish | +20.3% | Proposed issue of securities - STV |
| 2026-10-20 | AEI | bearish | +14.2% | Placement of Shares |
| 2026-10-20 | STV | bearish | +20.3% | Proposed issue of securities - STV |

### L099 — AGM date and director nomination deadline filing at a stock at or near a multi-month HIGH (not deeply de-rated) with elevated recent volume (>1.5x average) and near-zero median daily turnover

When the stock is at a multi-month high rather than a de-rated low, the L048 activist-accumulation logic inverts — elevated volume into an AGM notice on an extended, near-zero-liquidity stock is more consistent with holders front-running potential dilutive resolutions (new share issuance, option grants) or an anticipated negative outcome at the meeting; lean bearish rather than neutral when the stock is near a recent high, volume is elevated, and liquidity is near-zero, because the AGM may be the catalyst for selling by holders who ran the stock in anticipation of a resolution that disappoints.

_Seen 23×. First written 2026-09-28, last reinforced 2026-10-26._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-26 | HWK | neutral | -12.7% | 2026 AGM - Letter to Shareholders & Proxy Form |
| 2026-10-26 | SCP | neutral | -13.8% | Notice of Annual General Meeting/Proxy Form |
| 2026-10-23 | CBE | neutral | -8.4% | Notice of Annual General Meeting/Proxy Form |
| 2026-10-19 | OR3 | neutral | -9.2% | Notice of 2026 Annual General Meeting and Proxy Form |
| 2026-10-19 | OR3 | neutral | -9.2% | Notice of 2026 Annual General Meeting and Proxy Form |

### L048 — AGM date and director nomination deadline filing at a deeply de-rated junior explorer (60%+ below 12-month high) with elevated recent volume (5-day volume >1.5x average) and near-zero median daily turnover, where the director nomination window opens a credible pathway for a contested or activist appointment

An AGM notice is not always content-free when the stock is deeply de-rated and volume is elevated — the director nomination deadline is a governance event that can attract activist or strategic interest; before calling neutral, ask whether the volume spike coincides with a known activist position or a corporate action rumour, and if the stock has the shape of an activist target (deep de-rating, illiquid, small board), lean neutral-to-bullish rather than purely neutral. Here the volume (1.92x) into a near-zero-liquidity stock (median ~A$345/day) at a 63% de-rating was dismissed as noise, but at that liquidity level even a single informed buyer opening or building a position ahead of a nomination deadline is a material signal.

_Seen 21×. First written 2026-09-18, last reinforced 2026-10-26._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-26 | HWK | neutral | -12.7% | 2026 AGM - Letter to Shareholders & Proxy Form |
| 2026-10-20 | FGH | bearish | +12.8% | Notice of Annual General Meeting and Proxy Form |
| 2026-10-08 | 4DS | neutral | +17.4% | Date of AGM & Closing Date for Director Nominations |
| 2026-10-08 | WTL | neutral | +7.4% | Notice of Annual General Meeting/Proxy Form |
| 2026-10-08 | 4DS | neutral | +17.4% | Date of AGM & Closing Date for Director Nominations |

### L151 — Notice of AGM filing (not flagged market sensitive) at a stock 50%+ below its 12-month high with pre-announcement volume materially BELOW average (<0.3x) and near-zero median daily turnover, where no price action spike or activist signal is present

When volume is deeply suppressed (not merely flat) into an AGM notice at a distressed, near-zero-liquidity stock, the absence of any buyer interest is itself a bearish signal — the register is disengaged and the AGM creates no near-term catalyst; lean bearish rather than neutral, because a non-flagged procedural filing into a silent, distressed tape more commonly precedes a dilutive resolution or a going-concern update at the meeting than a positive outcome.

_Seen 21×. First written 2026-10-12, last reinforced 2026-10-23._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-23 | HCH | neutral | -8.6% | Notice of Annual General Meeting/Proxy Form |
| 2026-10-23 | BH6 | neutral | -14.8% | Notice of Annual General Meeting/Proxy Form |
| 2026-10-20 | RMI | neutral | -19.7% | Notice of Annual General Meeting/Proxy Form |
| 2026-10-20 | VRX | bearish | +8.0% | Notice of Annual General Meeting/Proxy Form |
| 2026-10-20 | RMI | neutral | -19.7% | Notice of Annual General Meeting/Proxy Form |

### L155 — Market-sensitive quarterly trading report at a profitable, revenue-generating industrial or technology company (not a junior explorer) where the stock is at a multi-month low (3-month or 12-month), no price action volume data is emphasised, and the report covers a named calendar quarter

For a profitable, operationally active company (as distinct from a junior explorer), a market-sensitive quarterly trading report at a multi-month low carries asymmetric upside — the stock is already pricing deterioration, and a report that merely confirms stable or growing revenue functions as a floor-setting catalyst; apply L092-style asymmetric logic to quarterly trading reports at operationally sound companies at depressed prices, leaning neutral-to-bullish rather than neutral, because the flag confirms the numbers moved in a direction management deems reportable and the downside is already largely priced.

_Seen 21×. First written 2026-10-13, last reinforced 2026-10-29._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-29 | ADO | bearish | +13.8% | Quarterly Activities/Appendix 4C Cash Flow Report |
| 2026-10-29 | IOV | neutral | +16.0% | Quarterly Activities/Appendix 4C Cash Flow Report |
| 2026-10-28 | DEV | neutral | +12.9% | Quarterly Activities and Cashflow Report - September 2026 |
| 2026-10-28 | XPN | neutral | +16.7% | Quarterly Activities/Appendix 4C Cash Flow Report |
| 2026-10-28 | DEV | neutral | +12.9% | Quarterly Activities and Cashflow Report - September 2026 |

### L197 — Market-sensitive combined quarterly activities and cashflow report at a junior with 60%+ de-rating and near-zero absolute liquidity, where the cashflow component introduces going-concern or runway risk that the activities component cannot offset

A combined activities-and-cashflow quarterly flagged market sensitive at a deeply de-rated, near-zero-liquidity junior is not symmetric — the cashflow component introduces a hard negative asymmetry (going-concern qualification, sub-two-quarter runway) that the activities component rarely offsets; lean bearish rather than neutral when the stock is 60%+ below its high, liquidity is near-zero, and the quarterly bundles both operational and financial data under a market-sensitive flag, because the financial data is the dominant risk and the flag confirms the quantum is material.

_Seen 21×. First written 2026-10-22, last reinforced 2026-10-29._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-29 | YUG | bearish | +10.9% | Quarterly Activities/Appendix 5B Cash Flow Report |
| 2026-10-28 | AX8 | bearish | +25.0% | Quarterly Activities/Appendix 5B Cash Flow Report |
| 2026-10-28 | AX8 | bearish | +25.0% | Quarterly Activities/Appendix 5B Cash Flow Report |
| 2026-10-28 | GBE | neutral | +9.8% | Quarterly Activities/Appendix 5B Cash Flow Report |
| 2026-10-28 | AX8 | bearish | +25.0% | Quarterly Activities/Appendix 5B Cash Flow Report |

### L017 — Cessation of securities (options lapsing unexercised or performance rights forfeited) at a deeply de-rated micro-cap, filed in isolation with no companion capital raise filing on the same day

Options lapsing unexercised at a distressed micro-cap can be read as a positive register-cleaning event — it removes a future dilution overhang without any immediate cash outflow, which on a stock already severely de-rated can be modestly constructive. Do not call bearish on cessation alone; absent a companion raise filing, default to neutral rather than bearish, and consider neutral-to-bullish when the cessation removes a meaningful dilution overhang.

_Seen 20×. First written 2026-09-15, last reinforced 2026-10-19._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-19 | MBK | neutral | +24.6% | Notification of cessation of securities - MBK |
| 2026-10-19 | MBK | neutral | +24.6% | Notification of cessation of securities - MBK |
| 2026-10-19 | MBK | neutral | +24.6% | Notification of cessation of securities - MBK |
| 2026-10-19 | MBK | neutral | +24.6% | Notification of cessation of securities - MBK |
| 2026-10-13 | CNQ | neutral | -9.8% | Notification of cessation of securities - CNQ |

### L018 — Gold assay results described as 'extending' mineralisation (rather than upgrading grade or defining resource boundaries) at an explorer 60%+ below its 12-month high, with volume running materially above average into the announcement

When volume is elevated ahead of assay results at a deeply de-rated explorer, the market has already partially priced the news — an 'extension' result (which adds strike length but not necessarily grade or resource quantum) is structurally weaker than a resource-upgrade result and is vulnerable to a sell-the-news reaction into the pre-positioned volume. Call bearish rather than neutral on extension-only assay announcements into elevated volume at stocks with severe prior de-ratings.

_Seen 20×. First written 2026-09-15, last reinforced 2026-10-27._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-27 | HWK | bullish | -14.7% | Cactus Corridor Drills Strong Copper-Gold-Silver Assays Utah |
| 2026-10-27 | HWK | bullish | -14.7% | Cactus Corridor Drills Strong Copper-Gold-Silver Assays Utah |
| 2026-10-27 | HWK | bullish | -14.7% | Cactus Corridor Drills Strong Copper-Gold-Silver Assays Utah |
| 2026-10-06 | ITM | neutral | -8.3% | Significant Extension to Gold-Antimony Shoots at Sabre |
| 2026-10-06 | SHN | neutral | -15.7% | Gold mineralisation footprint extended at Sybil |

### L187 — Market-sensitive quarterly report at a stock with zero recorded volume (0.0x ratio) and near-zero or zero median daily turnover, where the filing is the primary periodic operational update

When a quarterly report is flagged market sensitive at a completely dormant, zero-liquidity stock, the flag is the dominant signal — the company has judged the content price-relevant, and in a register with no active sellers the asymmetry favours a relief-buying response to any non-catastrophic disclosure; lean neutral-to-bullish rather than neutral, because L016's zero-volume logic (no motivated sellers) combines with the market-sensitive flag to create asymmetric upside.

_Seen 20×. First written 2026-10-20, last reinforced 2026-10-29._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-29 | REC | neutral | +17.7% | Quarterly Activities/Appendix 5B Cash Flow Report |
| 2026-10-28 | GBE | neutral | +9.8% | Quarterly Activities/Appendix 5B Cash Flow Report |
| 2026-10-28 | AMN | bearish | +16.7% | September 2026 Quarterly Activities and Cash Flow Report |
| 2026-10-28 | GBE | neutral | +9.8% | Quarterly Activities/Appendix 5B Cash Flow Report |
| 2026-10-28 | AMN | bearish | +16.7% | September 2026 Quarterly Activities and Cash Flow Report |

### L010 — Generic 'Investor Presentation' filing by a junior explorer or pre-revenue company, not flagged market sensitive, with no specific catalyst disclosed in the headline

An investor presentation without a named catalyst (resource estimate, drilling result, funding announcement) is most commonly awareness-building ahead of a capital raise — which is dilutive. Default to bearish rather than neutral when no substantive content is signalled in the headline, because the filing implicitly flags that management is actively marketing stock.

_Seen 19×. First written 2026-09-14, last reinforced 2026-10-27._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-27 | EGA | neutral | -13.8% | Investor Presentation |
| 2026-10-27 | EGA | neutral | -13.8% | Investor Presentation |
| 2026-10-27 | EGA | neutral | -13.8% | Investor Presentation |
| 2026-10-22 | EMA | neutral | -8.7% | Cote D Ivoire Strategic Gold Portfolio Investor Presentation |
| 2026-10-08 | LSR | neutral | -21.5% | October 2026 Investor Presentation |

### L049 — Online investor briefing announcement (not flagged market sensitive, no named catalyst in headline) by a junior developer or explorer 50%+ below its 12-month high, with 5-day volume materially BELOW average (<0.6x) and the company having material exposure to an active government critical minerals or industrial policy agenda

When pre-announcement volume is suppressed (below 0.6x average) rather than elevated, the L010 pre-raise-marketing bearish logic is weakened — there is no evidence of active marketing-into-accumulation, and the low volume may simply reflect a news-starved register waiting for a briefing catalyst; before defaulting to bearish on a non-flagged briefing at a de-rated junior, ask whether the company has a specific government or policy nexus (critical minerals designation, named project in a national programme) that makes the briefing content strategically credible rather than purely dilution-preparatory; if yes, default to neutral rather than bearish, reserving bearish only for briefings with elevated volume (evidence of active distribution) or explicit placement language.

_Seen 19×. First written 2026-09-18, last reinforced 2026-10-23._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-23 | BOA | neutral | -12.0% | BOA Investor Webinar Presentation |
| 2026-10-23 | BOA | neutral | -12.0% | BOA Investor Webinar Presentation |
| 2026-10-23 | BOA | neutral | -12.0% | BOA Investor Webinar Presentation |
| 2026-10-23 | BOA | neutral | -12.0% | BOA Investor Webinar Presentation |
| 2026-10-14 | A8G | bearish | +20.6% | Investor Presentation |

### L089 — Cleansing notice for a share placement at a stock 80%+ below its 12-month high, where the headline specifies 'Share Placement' (not a rights issue) and no use-of-proceeds information is available, but L027's funded-catalyst moderating logic is invoked to reach neutral rather than bearish

L027's funded-catalyst moderating logic requires a named operational use of proceeds to be visible — when the headline contains only 'Cleansing Notice - Share Placement' with no companion announcement disclosing proceeds deployment, the funded-catalyst condition is unmet and the default should revert to bearish (per L011), not neutral; do not apply L027 as a moderator unless a named catalyst is explicitly linked to the proceeds in an accessible companion filing.

_Seen 19×. First written 2026-09-25, last reinforced 2026-10-23._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-23 | 3DA | bearish | +8.8% | Cleansing Notice |
| 2026-10-19 | FRE | neutral | -15.6% | Cleansing Notice |
| 2026-10-19 | FRE | neutral | -15.6% | Cleansing Notice |
| 2026-10-19 | FRE | neutral | -15.6% | Cleansing Notice |
| 2026-10-19 | FRE | neutral | -15.6% | Cleansing Notice |

### L186 — Notice of AGM filing at a stock 60-75% below its 12-month high with near-zero absolute liquidity and no volume data available (volume ratio cannot be computed), where L151 was applied but the absence of volume data means the key L151 condition ('suppressed volume') cannot be confirmed

L151's bearish default requires confirmed suppressed volume as the key signal of a disengaged register; when no volume data is available, the suppression condition is unverified and L151 should not be applied — default to neutral rather than bearish when the AGM notice is the only filing and volume data is absent, because the bearish inference depends on a condition you cannot observe.

_Seen 19×. First written 2026-10-20, last reinforced 2026-10-28._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-28 | ID8 | bearish | +10.4% | Notice of Annual General Meeting/Proxy Form |
| 2026-10-28 | ID8 | bearish | +10.4% | Notice of Annual General Meeting/Proxy Form |
| 2026-10-28 | ID8 | bearish | +10.4% | Notice of Annual General Meeting/Proxy Form |
| 2026-10-28 | ID8 | bearish | +10.4% | Notice of Annual General Meeting/Proxy Form |
| 2026-10-27 | VR8 | neutral | +20.4% | Notice of Annual General Meeting/Proxy Form/Notice of Access |

### L132 — Cleansing notice for a share placement (no companion investor presentation visible) at a deeply de-rated micro-cap (60%+ below 12-month high), where a same-day application for quotation of securities is the only companion filing and no use-of-proceeds information is available

Before calling bearish on a cleansing-notice-plus-quotation cluster at a distressed stock, check whether the quotation filing implies only a small raise quantum relative to the stock's implied market cap — if the raise is small and the stock is already severely de-rated, the market may read the completed raise as a funded-survival signal rather than a dilution event, and the correct call is neutral rather than bearish. L089's bearish default requires confirmed absence of any funded-catalyst signal; when the raise has already closed and the stock is priced for near-insolvency, the asymmetry may favour neutral.

_Seen 18×. First written 2026-10-06, last reinforced 2026-10-23._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-23 | 3DA | bearish | +8.8% | Cleansing Notice |
| 2026-10-23 | TAL | bearish | +19.0% | Cleansing Statement |
| 2026-10-23 | 3DA | bearish | +8.8% | Cleansing Notice |
| 2026-10-23 | TAL | bearish | +19.0% | Cleansing Statement |
| 2026-10-23 | TAL | bearish | +19.0% | Cleansing Statement |

### L094 — Full-year statutory accounts filing (not flagged market sensitive) at a junior explorer with 5-day volume running >1.5x average, where the headline names no specific positive catalyst and the filing type is purely compliance-driven

Elevated volume into a statutory accounts filing at a junior explorer is more likely to reflect holders selling ahead of an expected going-concern qualification or poor cash position disclosure than informed accumulation — the accounts are a scheduled event and sophisticated holders who have reviewed the cash burn trajectory will have advance read on the likely auditor commentary; do not dismiss the volume signal as noise when the filing type is accounts rather than an operational release; lean bearish rather than neutral when volume is elevated into a compliance-only accounts filing at a de-rated junior, because the elevated activity more likely reflects distribution than accumulation.

_Seen 17×. First written 2026-09-28, last reinforced 2026-10-19._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-19 | ZNO | bearish | +28.5% | Quarterly Activities/Appendix 4C Cash Flow Report |
| 2026-10-13 | IXR | neutral | -18.2% | September Quarterly Activities & Cash Flow Report |
| 2026-10-13 | IXR | neutral | -29.1% | September Quarterly Activities & Cash Flow Report |
| 2026-10-13 | IXR | neutral | -29.1% | September Quarterly Activities & Cash Flow Report |
| 2026-10-07 | MHK | neutral | -8.2% | Appendix 4G and Corporate Governance Statement |

### L146 — Initial Director's Interest Notice (not a change notice — a first disclosure of an opening position) at a deeply de-rated junior (>50% below 12-month high) with near-zero or zero liquidity and no market-sensitive flag

An Initial Director's Interest Notice discloses what a director already holds at the point of appointment or first disclosure — it is not necessarily a fresh purchase and may reveal a pre-existing holding with no cash committed at current prices; do not treat it as constructive insider buying without confirming the acquisition date and price are recent and at-market; default to neutral, and lean bearish rather than neutral at near-zero-liquidity stocks where even a small disclosed holding creates a prospective supply overhang if the director chooses to sell.

_Seen 17×. First written 2026-10-09, last reinforced 2026-10-21._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-21 | NYM | neutral | -18.4% | Initial Director's Interest Notice |
| 2026-10-21 | NYM | neutral | -18.4% | Initial Director's Interest Notice |
| 2026-10-21 | NYM | neutral | -18.4% | Initial Director's Interest Notice |
| 2026-10-21 | NYM | neutral | -18.4% | Initial Director's Interest Notice |
| 2026-10-20 | MCA | neutral | +8.0% | Initial Director's Interest Notice |

### L002 — Drilling activity announcement (programme start, follow-up drilling underway) with no assay results disclosed

An announcement that drilling has commenced or is underway is a programme statement, not a result — it tells the market only that money is being spent. Do not call bullish on activity-commencement announcements alone; wait for assay data. Flag as neutral until results are released.

_Seen 16×. First written 2026-09-14, last reinforced 2026-10-27._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-27 | ZEU | bullish | -17.1% | Drilling Contract Executed - Diaguili Drilling to Commence |
| 2026-10-27 | ZEU | bullish | -17.1% | Drilling Contract Executed - Diaguili Drilling to Commence |
| 2026-10-19 | CUE | bullish | -7.7% | Palm Valley Appraisal Well PV15 Commences |
| 2026-10-19 | CUE | bullish | -7.7% | Palm Valley Appraisal Well PV15 Commences |
| 2026-10-09 | DAL | bullish | -8.6% | Dalaroo plans follow up of Discovery Hole |

### L043 — Investor presentation at a named investor forum (e.g. 'Metals Investor Forum', 'RIU', 'Noosa Mining') by a junior explorer, not flagged market sensitive, with no price action data available

Before applying L010's bearish default, distinguish between a generic online awareness filing and a presentation at a named sector-specialist investor forum — the latter attracts an audience of active buyers in the commodity, not passive observers, and can itself be an accumulation catalyst; default to neutral rather than bearish when the forum is named and sector-specialist, reserving bearish only for generic non-conference online or roadshow filings with no named audience.

_Seen 16×. First written 2026-09-18, last reinforced 2026-10-28._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-28 | NPM | bearish | +16.7% | Presentation - South-West Connect Conference |
| 2026-10-28 | NPM | bearish | +16.7% | Presentation - South-West Connect Conference |
| 2026-10-28 | NPM | bearish | +16.7% | Presentation - South-West Connect Conference |
| 2026-10-27 | SVY | neutral | +17.7% | Conference Presentation - IMARC |
| 2026-10-21 | IFN | neutral | -14.6% | Australian Microcap Investment Conference Presentation |

### L056 — 'Becoming a substantial holder' (maiden 5% crossing, direction unambiguously accumulation per L029) at a company with known recent material adverse history (operational failure, geopolitical event, significant prior de-rating) where no price action data is available to assess current positioning

L029 establishes a bullish prior for maiden substantial-holder filings, but before applying it, ask whether the company has a known unresolved structural problem (sovereign risk event, debt covenant breach, asset impairment) that a 5% crossing does not address — if a named adverse event is recent and unresolved, the new holder may be a distressed-debt or restructuring buyer rather than a long-only accumulator, which is not uniformly bullish for equity holders; downgrade to neutral when a recent material adverse event is known and unresolved.

_Seen 16×. First written 2026-09-21, last reinforced 2026-10-20._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-20 | MBK | bullish | -9.7% | Becoming a substantial holder |
| 2026-10-20 | MBK | bullish | -9.7% | Becoming a substantial holder |
| 2026-10-20 | MBK | bullish | -9.7% | Becoming a substantial holder |
| 2026-10-20 | MBK | bullish | -9.7% | Becoming a substantial holder |
| 2026-10-16 | ID1 | bullish | -12.1% | Becoming a substantial holder |

### L073 — Rig-secured or drill-start announcement (L002 shape) at a junior explorer 80%+ below its 12-month high, with pre-announcement volume materially BELOW average (<0.5x), where the headline specifies a hard near-term start date (month named) rather than a generic 'programme commencement'

When pre-announcement volume is suppressed (no crowded long to unwind) and the headline names a specific start month, the announcement functions as a hard-timeline commitment rather than a vague activity statement — it removes scheduling uncertainty at a stock already priced for maximum pessimism; do not apply L002's neutral default mechanically when the de-rating exceeds 80% and volume is suppressed; lean neutral-to-bullish, because the funded-operational-certainty signal may be the catalyst the depressed register was waiting for.

_Seen 16×. First written 2026-09-24, last reinforced 2026-10-12._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-12 | LMS | neutral | +10.3% | Drilling Commences at Oonagalabi Copper-Zinc Project |
| 2026-10-12 | LMS | neutral | +10.3% | Drilling Commences at Oonagalabi Copper-Zinc Project |
| 2026-10-12 | LMS | neutral | +10.3% | Drilling Commences at Oonagalabi Copper-Zinc Project |
| 2026-10-12 | LMS | neutral | +10.3% | Drilling Commences at Oonagalabi Copper-Zinc Project |
| 2026-10-07 | DTM | neutral | +9.2% | Maiden Drilling to Test Walwa System at Depth |

### L029 — Substantial holding filing headlined 'Becoming a substantial holder' (i.e. a new substantial holder crossing the 5% threshold for the first time) at a deeply de-rated stock, not flagged market sensitive

'Becoming a substantial holder' is categorically different from a change in an existing substantial holding — it announces that a new party has crossed 5% for the first time, which is unambiguously accumulation, not a reduction; do not apply the L001 bearish default (which addresses direction ambiguity) to a maiden substantial-holder filing; call bullish or neutral-to-bullish when the headline contains 'becoming' rather than 'change in', because direction is confirmed as acquisition by the filing type itself.

_Seen 15×. First written 2026-09-16, last reinforced 2026-10-13._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-13 | CTT | neutral | +16.7% | Becoming a substantial holder |
| 2026-10-13 | CTT | neutral | +16.7% | Becoming a substantial holder |
| 2026-10-13 | CTT | neutral | +25.0% | Becoming a substantial holder |
| 2026-10-13 | CTT | neutral | +25.0% | Becoming a substantial holder |
| 2026-09-21 | LOT | neutral | +8.7% | Change in substantial holding |

### L097 — Annual report or full-year compliance filing (not flagged market sensitive) at a junior explorer or developer with no price action data available and no companion operational announcement

An annual report without a market-sensitive flag can still contain a silent negative catalyst — specifically a going-concern qualification or a materially worse-than-expected cash position; when no price action data is available to assess prior positioning, do not default to neutral without first asking whether the auditor's report or cash flow statement is likely to contain a going-concern note given the company's known burn rate and funding history; if a going-concern qualification is probable given the company profile, lean bearish rather than neutral.

_Seen 15×. First written 2026-09-28, last reinforced 2026-10-15._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-15 | NNL | neutral | -11.0% | Letter to Shareholders, Notice of AGM and Proxy Form |
| 2026-10-12 | HMG | neutral | -11.9% | Quarterly Activities Report and Appendix 5B |
| 2026-10-12 | HMG | neutral | -11.9% | Quarterly Activities Report and Appendix 5B |
| 2026-10-12 | HMG | neutral | -11.9% | Quarterly Activities Report and Appendix 5B |
| 2026-10-07 | MHK | neutral | -8.2% | Appendix 4G and Corporate Governance Statement |

### L020 — Cleansing statement filed by a junior at a 12-month low, accompanied on the same day by an investor presentation (identifiable via same-day filing cluster)

When a cleansing statement and an investor presentation are filed together at a 12-month low, the presentation may be the use-of-proceeds marketing document for the just-completed raise rather than a pre-raise awareness filing — meaning fresh capital has arrived with a stated deployment plan. Ask whether the raise proceeds create a funded runway that removes the near-term going-concern risk; if so, the cleansing statement signals dilution already absorbed and a funded catalyst pipeline, which is neutral-to-bullish rather than bearish. Do not apply L011 in isolation when a companion presentation discloses a credible use of proceeds.

_Seen 14×. First written 2026-09-15, last reinforced 2026-10-06._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-06 | RNV | bearish | +11.9% | Cleansing Notice |
| 2026-10-06 | RNV | bearish | +11.9% | Cleansing Notice |
| 2026-09-30 | CDR | neutral | +13.0% | Cleansing Notice |
| 2026-09-30 | CDR | neutral | +13.0% | Cleansing Notice |
| 2026-09-30 | CDR | neutral | +13.0% | Cleansing Notice |

### L046 — Webinar or online presentation announcement (not a named specialist-sector conference, not flagged market sensitive) at a deeply de-rated technology or semiconductor company (50%+ below 12-month high) where the presenting company has a named, distinctive technology with active sector-level investor interest (e.g. AI, neuromorphic computing)

An AI or semiconductor webinar for a company with a named proprietary technology is not equivalent to a generic junior-explorer awareness filing — the audience is sector-informed and the act of presenting in an active thematic (AI, semiconductors) can itself trigger accumulation by thematic investors; before calling neutral, ask whether the sector theme is actively re-rating and whether the company's technology is the type that attracts thematic inflows independent of fundamentals; if yes, lean neutral-to-bullish rather than neutral, because thematic buying is not contingent on new fundamental disclosures.

_Seen 14×. First written 2026-09-18, last reinforced 2026-10-21._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-21 | BOT | neutral | +8.2% | Botanix Webinar on 27 October - Registration Information |
| 2026-10-12 | CDE | neutral | +24.2% | CDE develops ConnectQR as an app for ChatGPT and Claude |
| 2026-10-12 | CDE | neutral | +24.2% | CDE develops ConnectQR as an app for ChatGPT and Claude |
| 2026-10-12 | CDE | neutral | +24.2% | CDE develops ConnectQR as an app for ChatGPT and Claude |
| 2026-10-12 | CDE | neutral | +24.2% | CDE develops ConnectQR as an app for ChatGPT and Claude |

### L039 — Investor presentation filed for a named sector-specialist conference (e.g. RIU Uranium Investment Day, Noosa Mining) at a deeply de-rated micro-cap (60%+ below 12-month high) where the conference is a known gathering of specialist institutional and sophisticated investors in that commodity, and the stock is flagged or is in an actively re-rating sector theme (e.g. uranium)

A named specialist-sector conference presentation is not equivalent to a generic awareness-marketing filing under L010 — the audience is sector-informed and the act of presenting can itself trigger accumulation by specialist funds who were not previously holders; before applying L010's bearish default, ask whether the conference is a known catalyst event for the sector (i.e. RIU Uranium, Noosa Mining) and whether the sector is in an active thematic re-rating; if yes, downgrade from bearish to neutral, because the dilution-marketing logic of L010 does not apply when the audience is buying, not being sold to.

_Seen 13×. First written 2026-09-17, last reinforced 2026-10-20._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-20 | HWK | bearish | +8.7% | HWK Microcap Conference Presentation - October 2026 |
| 2026-10-20 | HWK | bearish | +8.7% | HWK Microcap Conference Presentation - October 2026 |
| 2026-10-20 | HWK | bearish | +8.7% | HWK Microcap Conference Presentation - October 2026 |
| 2026-10-07 | BMN | neutral | +8.7% | Global Uranium Conference 2026 Presentation |
| 2026-10-07 | BMN | neutral | +8.7% | Global Uranium Conference 2026 Presentation |

### L054 — Drill intercept result headlined as a footprint expansion ('hits X mineralisation Y metres outside current resource') at a junior miner with no price action data available, where the result is described by mineralisation type rather than by grade and width

A headline describing what was hit (mineralisation type, distance from resource) rather than how much (grade, width) is structurally an extension result without economic quantification — apply L018's logic regardless of volume data when grade and width are absent from the headline; call neutral rather than bullish, because the market cannot size the value addition without grade data and the filing confirms presence but not economics.

_Seen 13×. First written 2026-09-21, last reinforced 2026-10-15._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-15 | CPM | bullish | -10.4% | RC Drilling Intersects Broad Cu at Attina and Ardmore North |
| 2026-10-15 | CPM | bullish | -10.4% | RC Drilling Intersects Broad Cu at Attina and Ardmore North |
| 2026-10-15 | CPM | bullish | -10.4% | RC Drilling Intersects Broad Cu at Attina and Ardmore North |
| 2026-10-15 | CPM | bullish | -10.4% | RC Drilling Intersects Broad Cu at Attina and Ardmore North |
| 2026-10-14 | EG1 | bullish | -11.9% | Final Aircore Results,4 Defined Gold Prospects at Mt Monger |

### L059 — Debt facility extension announcement flagged market sensitive at a deeply de-rated micro-cap (60%+ below 12-month high) with thin liquidity, where the extension removes a near-term maturity cliff and no punitive terms are disclosed in the headline

A market-sensitive debt extension at a distressed micro-cap is primarily a survival event — it removes the going-concern cliff that was the dominant overhang, and the absence of disclosed punitive terms in the headline is the key qualifier; lean neutral-to-bullish rather than neutral when the extension is flagged material and no covenant or conversion language appears in the headline, because removing an existential risk at a stock already priced for distress is asymmetrically positive even if the underlying business remains weak.

_Seen 13×. First written 2026-09-21, last reinforced 2026-10-19._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-19 | STV | bullish | -17.1% | Swift Extends Pure Debt Facility to March 2028 |
| 2026-10-19 | STV | bullish | -17.1% | Swift Extends Pure Debt Facility to March 2028 |
| 2026-10-19 | STV | bullish | -17.1% | Swift Extends Pure Debt Facility to March 2028 |
| 2026-10-19 | STV | bullish | -17.1% | Swift Extends Pure Debt Facility to March 2028 |
| 2026-10-09 | TZL | neutral | -14.0% | Business and Funding Update |

### L074 — Drill-start or rig-secured announcement (L002 shape) flagged market sensitive at a junior explorer with pre-announcement volume materially BELOW average (<0.5x) and the headline contains 'fast tracked', 'accelerated', or equivalent urgency language implying an externally imposed or opportunity-driven timeline compression

Urgency language ('fast tracked', 'accelerated') in a drill-commencement headline is not merely cosmetic — it signals that an external catalyst (permit window, joint-venture milestone, financing condition, or competitive pressure) is driving the timeline, which is an incremental information layer beyond a standard programme statement; when volume is suppressed (no pre-positioning to unwind) and the headline contains explicit acceleration language, lean neutral-to-bullish rather than applying L002's neutral default, because the urgency implies a specific near-term binary event that the market may not have priced.

_Seen 13×. First written 2026-09-24, last reinforced 2026-10-07._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-07 | DTM | neutral | +9.2% | Maiden Drilling to Test Walwa System at Depth |
| 2026-10-02 | AM5 | neutral | +19.2% | Antares Commences Maiden AC Drilling at Quinns |
| 2026-10-01 | TAT | neutral | +25.1% | First drill program at Nightflower Ag in 18 years underway |
| 2026-10-01 | TAT | neutral | +25.1% | First drill program at Nightflower Ag in 18 years underway |
| 2026-10-01 | TAT | neutral | +25.1% | First drill program at Nightflower Ag in 18 years underway |

### L092 — Market-sensitive investor presentation filed by a deeply de-rated company (60%+ below 12-month high) where the presentation is explicitly tied to a full-year or half-year result release (i.e. both the result and the presentation are filed simultaneously or within the same session), and the presentation title references a specific financial year (e.g. 'FY26 Investor Presentation')

A result-season investor presentation flagged market sensitive is not an awareness-marketing filing under L010 — it is the company's primary forward-guidance and recovery-narrative document accompanying a reported financial period; when the stock is deeply de-rated and the market-sensitive flag is present, the presentation likely contains new guidance, cost targets, or strategic pivots that can re-rate the stock independently of the underlying result; lean neutral-to-bullish rather than neutral, because the combination of a named financial year, a market-sensitive flag, and a severely de-rated price creates asymmetric upside if the content signals a credible recovery path.

_Seen 13×. First written 2026-09-28, last reinforced 2026-10-28._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-28 | SDR | neutral | +18.1% | Chair's & CEO's Address to Shareholders |
| 2026-10-28 | SDR | neutral | +18.1% | Chair's & CEO's Address to Shareholders |
| 2026-10-28 | SDR | neutral | +18.1% | Chair's & CEO's Address to Shareholders |
| 2026-10-28 | SDR | neutral | +18.1% | Chair's & CEO's Address to Shareholders |
| 2026-10-21 | CVB | neutral | +10.9% | CVB Quarterly Investor Presentation - Q1 FY27 |

### L121 — CEO or senior executive transition announcement flagged market sensitive at a profitable, revenue-generating technology or financial services company (not a distressed junior), where no price action data is available and the company has an identifiable ongoing M&A or growth strategy

A CEO transition at a revenue-generating technology or financial services company with a known growth or M&A strategy is not uniformly bearish — the incoming CEO may signal acceleration of the strategic agenda or a positive reset of management credibility; before defaulting to bearish on any CEO transition, ask whether the company is profitable and strategically active, because the base rate for positive market reactions to CEO changes at growing, profitable companies is materially higher than at distressed or operationally challenged companies; default to neutral rather than bearish when the company is operationally sound and the transition is framed as planned rather than forced.

_Seen 13×. First written 2026-10-02, last reinforced 2026-10-29._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-29 | MAD | neutral | -11.2% | Chief Financial Officer Transition |
| 2026-10-29 | MAD | neutral | -11.2% | Chief Financial Officer Transition |
| 2026-10-21 | NTD | neutral | +12.7% | Appointment of Chief Operating and Financial Officer |
| 2026-10-21 | NTD | neutral | +12.7% | Appointment of Chief Operating and Financial Officer |
| 2026-10-21 | NTD | neutral | +12.7% | Appointment of Chief Operating and Financial Officer |

### L001 — Change in substantial holding filed into elevated recent volume (5-day volume >1.5x average) on a stock near a multi-month high

When volume has been running hot into a substantial holding change, treat the direction of the change as the critical unknown — a reduction by a substantial holder into strength is a material bearish signal, not a neutral procedural event. If you cannot confirm the direction is an increase, default to bearish when the tape is already extended.

_Seen 12×. First written 2026-09-14, last reinforced 2026-10-09._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-09 | BOE | neutral | -10.6% | Change in substantial holding |
| 2026-10-09 | BOE | neutral | -10.6% | Change in substantial holding |
| 2026-10-09 | BOE | neutral | -10.6% | Change in substantial holding |
| 2026-10-09 | BOE | neutral | -10.6% | Change in substantial holding |
| 2026-09-28 | 3DA | neutral | -11.6% | Notification of cessation of securities - 3DA |

### L006 — Single contract win announcement (no dollar value disclosed) for a thinly traded micro-cap services or technology company, flagged market sensitive

When a contract announcement omits revenue value entirely, treat the omission as a material qualifier — the market cannot size the earnings impact and often re-rates the stock down as the news fails to meet the implicit expectation set by the market-sensitive flag. Do not call bullish on a contract win without a disclosed or estimable dollar value; default to neutral until quantum is known.

_Seen 12×. First written 2026-09-14, last reinforced 2026-10-27._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-27 | RGT | bullish | -14.2% | RGT Executes Global Licence for Non-Core Cannabis Genetics |
| 2026-10-19 | AKN | neutral | -7.6% | Results of EGM |
| 2026-10-13 | PCK | bullish | -13.1% | PainChek expands Sabra contracts to 23 US communities |
| 2026-10-13 | PCK | bullish | -13.1% | PainChek expands Sabra contracts to 23 US communities |
| 2026-09-28 | MX1 | bullish | -9.1% | MX1 - DHS CT Baggage Scanner Contract Extension |

### L104 — Forward guidance announcement (FY guidance, production outlook) flagged market sensitive at a gold producer or operating miner with no price action data available, where the headline frames the filing as 'FY[X] Guidance & Outlook' rather than as a results beat or resource upgrade

A guidance announcement is directionally ambiguous without knowing whether the disclosed numbers beat or miss prior consensus or management signals — 'guidance issued' is not the same as 'guidance beat'; before calling bullish on a guidance filing, require either (a) explicit beat language in the headline, (b) a disclosed metric that can be compared to a prior anchor, or (c) price action confirming the tape was not already positioned for positive news; when none of these are available, default to neutral rather than bullish, because disappointing guidance at an extended valuation is as probable as a beat and the downside is asymmetrically large.

_Seen 12×. First written 2026-09-30, last reinforced 2026-10-28._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-28 | AMI | neutral | +10.3% | Quarterly Update and Outlook - September 2026 |
| 2026-10-28 | AMI | neutral | +10.3% | Quarterly Update and Outlook - September 2026 |
| 2026-10-23 | ALK | neutral | -10.9% | Q1 FY27 Earnings Conference Call Presentation |
| 2026-10-22 | MFG | neutral | -9.1% | 2026 AGM Chair and CEO Addresses and Presentation Slides |
| 2026-10-15 | CIA | neutral | -9.6% | FY2027 Q2 Preliminary Results & Notice of Final Results |

### L120 — Reinstatement to quotation announcement flagged market sensitive at a stock near a recent high (within 5% of 3-month high) with deeply suppressed pre-announcement volume (<0.2x average) and non-trivial absolute liquidity (median turnover >A$5,000/day)

A reinstatement near a recent high with suppressed volume is structurally different from both a distress reinstatement (L065) and a generic neutral reinstatement — the suppressed volume rules out pre-positioning, the near-high price context rules out distress, and the market-sensitive flag implies a positive accompanying disclosure; lean neutral-to-bullish rather than purely neutral, because the combination of reinstatement into strength with no pre-positioning and a material-sensitive flag is more consistent with a positive catalyst being released than with a dilutive or negative event.

_Seen 12×. First written 2026-10-02, last reinforced 2026-10-08._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-08 | VRC | neutral | -8.3% | Reinstatement to Quotation |
| 2026-10-08 | VRC | neutral | -8.3% | Reinstatement to Quotation |
| 2026-10-08 | VRC | neutral | -8.3% | Reinstatement to Quotation |
| 2026-10-08 | VRC | neutral | -8.3% | Reinstatement to Quotation |
| 2026-10-05 | MOT | neutral | -7.5% | Reinstatement to Quotation |

### L139 — Notification regarding unquoted securities (ASX Appendix 3B or equivalent) at a stock 50%+ below its 12-month high with below-average pre-announcement volume (<0.7x), where the filing is not flagged market sensitive and no companion quotation application or operational announcement is filed on the same day

A standalone unquoted-securities notification without a companion quotation application can signal that previously issued but unquoted shares (e.g. from a prior private placement) are about to become quotable — the prospective arrival of new freely tradeable paper into a thinly traded, deeply de-rated register is a dilution-overhang signal; lean bearish rather than neutral when no operational catalyst accompanies the filing, because the dominant near-term mechanic is supply arriving into a thin market.

_Seen 12×. First written 2026-10-08, last reinforced 2026-10-28._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-28 | ASV | neutral | +11.9% | Notification regarding unquoted securities - ASV |
| 2026-10-28 | ASV | neutral | +11.9% | Notification regarding unquoted securities - ASV |
| 2026-10-28 | ASV | neutral | +11.9% | Notification regarding unquoted securities - ASV |
| 2026-10-28 | ASV | neutral | +11.9% | Notification regarding unquoted securities - ASV |
| 2026-10-09 | AGY | neutral | -11.4% | Notification regarding unquoted securities - AGY |

### L148 — Market-sensitive 'Gold Drilling Update' or equivalent assay/drilling update headline (not titled as a specific intercept result) at a junior explorer 50%+ below its 12-month high with near-zero absolute liquidity (median daily turnover <A$10/day), where no grade or width appears in the headline

A 'Drilling Update' headline without disclosed grade or width at near-zero absolute liquidity is structurally equivalent to L058's generic project-update pattern — the market-sensitive flag does not substitute for absent economic data; lean bearish rather than neutral when the headline names only a project and a process ('drilling update') without a positive milestone descriptor, because the dominant reason to issue a non-specific flagged update at a deeply de-rated, near-zero-liquidity stock is to disclose disappointing or inconclusive results rather than a positive intercept, which would have been headlined with grade and width.

_Seen 12×. First written 2026-10-12, last reinforced 2026-10-23._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-23 | ALM | neutral | -12.5% | Drilling Results - Briggs Copper Project |
| 2026-10-15 | WC1 | neutral | -13.2% | Salazar Scandium Beneficiation Testwork Underway |
| 2026-10-15 | WC1 | neutral | -13.2% | Salazar Scandium Beneficiation Testwork Underway |
| 2026-10-14 | NES | neutral | -19.4% | Soil geochemistry outlines multiple targets at southern GP |
| 2026-10-14 | NES | neutral | -19.4% | Soil geochemistry outlines multiple targets at southern GP |

### L182 — Generic named communication filing (Shareholder Letter, Chairman's Letter, CEO Update) at a stock at a 12-month low with near-zero absolute liquidity (median daily turnover effectively A$0/day) and zero pre-announcement volume (0.0x), where the filing is not flagged market sensitive and no operational content is named in the headline

Do not default to bearish on a shareholder letter at a completely dormant, near-zero-liquidity stock purely on the grounds of filing type and distress — when absolute liquidity is zero and volume is zero, there are no motivated sellers active in the market and any communication from management, however generic, can function as a re-engagement signal that attracts the first buyer; default to neutral rather than bearish when the register is completely dormant, reserving bearish for letters that contain explicit negative language (funding shortfall, wind-down, going-concern) in the headline.

_Seen 12×. First written 2026-10-20, last reinforced 2026-10-22._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-22 | BEL | bearish | +12.9% | Letter to Shareholders - Notice of AGM, Proxy Form |
| 2026-10-22 | INF | bearish | +20.4% | Shareholder Letter - 2026 Annual General Meeting |
| 2026-10-22 | INF | bearish | +20.4% | Shareholder Letter - 2026 Annual General Meeting |
| 2026-10-22 | INF | bearish | +20.4% | Shareholder Letter - 2026 Annual General Meeting |
| 2026-10-22 | BEL | bearish | +12.9% | Letter to Shareholders - Notice of AGM, Proxy Form |

### L062 — First drill hole result announcing mineralisation intersected ('Intersects X and Y in First Drill Hole') at a stock at a 12-month low with near-zero median daily turnover and near-zero pre-announcement volume, where the headline names the minerals but does not disclose grade or width

A 'first drill hole intersects' headline without disclosed grade and width is structurally equivalent to a footprint-expansion result under L054 — the market cannot price economic value from mineralisation presence alone; before calling bullish on a maiden intercept, require that grade and width appear in the headline or are clearly implied by the market-sensitive flag and filing body; default to neutral rather than bullish when the headline names only mineralisation type and not economic parameters, because the result confirms geological presence but not project value.

_Seen 11×. First written 2026-09-21, last reinforced 2026-10-13._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-13 | AQX | bullish | -14.3% | Horn Island Drilling Completed with All Holes Mineralised |
| 2026-10-13 | AQX | bullish | -14.3% | Horn Island Drilling Completed with All Holes Mineralised |
| 2026-10-07 | LUX | bullish | -25.3% | First holes intersect zones of visual copper mineralisation |
| 2026-10-07 | LUX | bullish | -25.3% | First holes intersect zones of visual copper mineralisation |
| 2026-10-07 | LUX | bullish | -25.3% | First holes intersect zones of visual copper mineralisation |

### L098 — Soft promotional filing (executive interview, chairman video, non-flagged media release) at a stock at or near a multi-month high with no new operational data content

A promotional piece with no new assay, resource, funding, or partnership data at a stock already at a multi-month high carries asymmetric downside — the tape is extended on speculative optimism and the filing delivers nothing to sustain it; call bearish rather than neutral when the filing is purely promotional, carries no market-sensitive flag, and the stock is at a local high, because the sell-the-news dynamic is the dominant near-term mechanic.

_Seen 11×. First written 2026-09-28, last reinforced 2026-10-21._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-21 | IFN | neutral | -14.6% | Australian Microcap Investment Conference Presentation |
| 2026-10-21 | IFN | neutral | -14.6% | Australian Microcap Investment Conference Presentation |
| 2026-10-08 | NCC | neutral | -16.1% | NAOS Investor Roadshow - Presentation Materials |
| 2026-10-08 | NCC | neutral | -16.1% | NAOS Investor Roadshow - Presentation Materials |
| 2026-10-08 | NCC | neutral | -16.1% | NAOS Investor Roadshow - Presentation Materials |

### L201 — Results of Meeting filing (not AGM results — a named EGM or general meeting result) at a stock where no price action data is available and no market-sensitive flag is present, where contested or capital-authority resolutions were plausibly on the agenda

Before calling neutral on a Results of Meeting filing, check whether the underlying notice of meeting (which should be identifiable from prior filings) contained capital-authority resolutions (placement capacity, share consolidation, name change) — if contested or materially dilutive resolutions were on the agenda, a failed resolution is bearish and a passed resolution enables near-term supply; when no price action data is available and capital resolutions were plausibly on the agenda, default to bearish rather than neutral, because the base rate for Results of Meeting filings containing value-relevant outcomes (passed dilution authority or failed critical resolution) is higher than the neutral default assumes.

_Seen 11×. First written 2026-10-22, last reinforced 2026-10-27._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-27 | GRS | neutral | -14.1% | Results of Meeting |
| 2026-10-27 | GRS | neutral | -14.1% | Results of Meeting |
| 2026-10-27 | SXE | neutral | +13.1% | Results of Meeting |
| 2026-10-27 | GRS | neutral | -14.1% | Results of Meeting |
| 2026-10-27 | GRS | neutral | -14.1% | Results of Meeting |

### L028 — Change in substantial holding filing where the stock has been running above-average volume but is NOT near a multi-month high (i.e. the L001 'elevated volume into strength' trigger does not fire), and no direction of change is disclosed in the headline

L001 defaults to bearish when volume is elevated AND the stock is near a high. When the stock is not near a high, the default logic inverts — a substantial holder accumulating into a depressed, above-average-volume tape is more likely to be a strategic buyer than an exiting holder; do not apply the L001 bearish default when the stock is not extended; instead call neutral and require confirmation of direction before leaning bearish.

_Seen 10×. First written 2026-09-16, last reinforced 2026-10-05._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-05 | RLF | neutral | +10.7% | Form 604 Change in Substantial Shareholding |
| 2026-10-05 | RLF | neutral | +10.7% | Form 604 Change in Substantial Shareholding |
| 2026-10-01 | CTT | neutral | +21.1% | Change in substantial holding |
| 2026-09-22 | DCC | bearish | +8.5% | Change in substantial holding |
| 2026-09-22 | DCC | bearish | +8.5% | Change in substantial holding |

### L055 — AGM filing that bundles a resolution to change the company name alongside director nominations, at a stock 50%+ below its 12-month high with near-zero median daily turnover

A name-change resolution in an AGM notice at a deeply de-rated micro-cap is a leading indicator of a strategic pivot (new commodity, new geography, or post-restructure rebrand) that often precedes an operational announcement or capital raise; do not treat as purely administrative — lean neutral-to-bullish rather than neutral, because the name change signals management has already decided on a new direction and the AGM is the formal gate for executing it.

_Seen 10×. First written 2026-09-21, last reinforced 2026-10-29._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-29 | AUZ | neutral | +28.7% | Australian Mines Proposes Name Change to First Scandium |
| 2026-10-29 | AUZ | neutral | +28.7% | Australian Mines Proposes Name Change to First Scandium |
| 2026-10-20 | FGH | bearish | +12.8% | Notice of Annual General Meeting and Proxy Form |
| 2026-10-19 | DWG | neutral | +8.2% | 2026 AGM Letter of Access, Notice of Meeting and Proxy |
| 2026-10-01 | CCE | neutral | +7.5% | 2026 AGM Key Dates |

### L069 — Named project milestone completion announcement (concept stage, pre-FEED, scoping) flagged market sensitive at a thinly traded micro-cap at or near a multi-month high with suppressed pre-announcement volume (<0.5x average), where the milestone gates the next phase but does not itself commit capital or name a counterparty

A concept-stage or pre-FEED completion at a stock already at its multi-month high means the milestone was anticipated and is priced — before calling bullish, ask whether the completion announcement names a specific next gating event (funding partner, government grant, FID date) that was not previously disclosed; if not, call neutral rather than bullish, because a phase-completion without a named next catalyst is a 'task done' filing that confirms progress already implied by the stock's price level rather than creating new upside.

_Seen 10×. First written 2026-09-23, last reinforced 2026-10-12._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-12 | REC | bullish | -12.1% | Completion of Ironstone Well Gold Project Acquisition |
| 2026-10-12 | REC | bullish | -12.1% | Completion of Ironstone Well Gold Project Acquisition |
| 2026-10-06 | WOA | bullish | -7.7% | Industrial Scale Study for WA Lupin Protein Facility |
| 2026-10-06 | WOA | bullish | -7.7% | Industrial Scale Study for WA Lupin Protein Facility |
| 2026-10-06 | WOA | bullish | -7.7% | Industrial Scale Study for WA Lupin Protein Facility |

### L088 — Market-sensitive response to an ASX price and volume query at a stock within 5% of a multi-month high, where volume has been elevated in the prior sessions

Do not apply L037's bullish default when the stock is near a multi-month high rather than a low — a market-sensitive query response into strength is as likely to disclose a dilutive capital raise or negative operational update that explains the prior price move as it is to confirm a positive catalyst; default to neutral rather than bullish, and require document-level confirmation of direction before leaning either way.

_Seen 10×. First written 2026-09-25, last reinforced 2026-10-08._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-08 | MGH | neutral | -21.6% | Response to ASX Price Query |
| 2026-10-08 | MGH | neutral | -21.6% | Response to ASX Price Query |
| 2026-10-08 | MGH | neutral | -21.6% | Response to ASX Price Query |
| 2026-10-08 | MGH | neutral | -21.6% | Response to ASX Price Query |
| 2026-10-07 | EXR | bullish | -21.0% | Response to ASX Price Query |

### L102 — Positive scoping study result (market-sensitive, NPV/IRR metrics implied by 'positive' framing) at a thinly traded junior in a commodity sector experiencing adverse price momentum (e.g. gold scoping study in a gold price downturn, or battery metals in a metals bear market), with pre-announcement volume materially below average

Before calling bullish on a scoping study at a de-rated junior, ask whether the commodity price used in the study's base-case NPV is consistent with the prevailing spot price — scoping studies use a fixed commodity price assumption that may be materially above current spot, which means the disclosed NPV overstates real-world project economics at the time of announcement and the market will immediately haircut the headline number; if the commodity is in a known adverse price trend, default to neutral rather than bullish on a scoping study result, because the NPV-to-market-cap re-rating logic depends on the commodity price assumption being credible.

_Seen 10×. First written 2026-09-29, last reinforced 2026-10-29._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-29 | AHK | bullish | -12.8% | Sandy Mitchell Rare Earths Scoping Study - A$883M NPV |
| 2026-10-29 | AHK | bullish | -12.8% | Sandy Mitchell Rare Earths Scoping Study - A$883M NPV |
| 2026-10-05 | VR8 | bullish | -6.6% | V-Iron Plant Scoping Study Supports Progression to DFS |
| 2026-10-05 | VR8 | bullish | -6.6% | V-Iron Plant Scoping Study Supports Progression to DFS |
| 2026-10-05 | VR8 | bullish | -6.6% | V-Iron Plant Scoping Study Supports Progression to DFS |

### L147 — Generic 'Operational Update [Month Year]' headline flagged market sensitive at a single-asset, single-commodity producer (e.g. bauxite, coal, iron ore) with known exposure to seasonal or weather-driven disruption, where no price action data is available

For a single-asset commodity producer with known seasonal risk, a monthly operational update flagged market sensitive is directionally skewed bearish relative to a symmetric neutral call — the company flags routine updates as market sensitive only when the period contained a material deviation, and in weather-exposed single-asset operations the base rate for negative deviations (wet season disruption, shipping delays, cost blowouts) materially exceeds the base rate for positive surprises; lean bearish rather than neutral when the headline is a dated operational update with no positive milestone language and the operation is known to be weather or logistics constrained.

_Seen 10×. First written 2026-10-12, last reinforced 2026-10-27._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-27 | AUQ | neutral | -15.7% | Quarterly Activities/Appendix 5B Cash Flow Report |
| 2026-10-22 | CRN | neutral | -10.7% | Quarterly Activities Report Q3 2026 |
| 2026-10-22 | CRN | neutral | -10.7% | Quarterly Activities Report Q3 2026 |
| 2026-10-22 | CRN | neutral | -10.7% | Quarterly Activities Report Q3 2026 |
| 2026-10-22 | CRN | neutral | -10.7% | Quarterly Activities Report Q3 2026 |

### L192 — Market-sensitive quarterly financial performance report at a commercial-stage, revenue-generating pharmaceutical or life sciences company with no price action data available, where the headline frames the filing as a named-quarter financial result rather than a clinical or regulatory milestone

Before defaulting to neutral on a market-sensitive quarterly financial result at a commercial pharma company with no price action data, ask whether the company has a known consensus revenue or earnings estimate that the result will either beat or miss — a market-sensitive quarterly at a commercial-stage pharma is directionally asymmetric: a miss at a stock with institutional following can produce sharp selling as models are revised; when no price action data is available to assess whether a beat is already priced, default to bearish rather than neutral for market-sensitive quarterly results at commercial-stage pharma where analyst consensus exists and the filing type is a financial-performance report rather than a clinical update, because the downside from a miss is asymmetrically large relative to an in-line result.

_Seen 10×. First written 2026-10-21, last reinforced 2026-10-23._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-23 | ZIP | bullish | -29.5% | 1Q FY27 results update |
| 2026-10-23 | ZIP | bullish | -29.5% | 1Q FY27 results update |
| 2026-10-23 | ZIP | bullish | -29.5% | 1Q FY27 results update |
| 2026-10-22 | MFG | neutral | -9.1% | 2026 AGM Chair and CEO Addresses and Presentation Slides |
| 2026-10-22 | CXZ | neutral | +9.5% | Quarterly Report |

### L032 — Board Changes combined with a Strategic Review announcement, flagged market sensitive, at a stock 50%+ below its 12-month high with above-average recent volume

A 'Board Changes & Strategic Review' filing at a deeply de-rated stock is not a procedural governance event — the strategic review component signals that incumbent leadership has been displaced and an asset or corporate process has been opened, which at a stock with heavily priced-in bad news creates asymmetric upside (sale, merger, or asset monetisation). When the filing is market-sensitive and combines board change with an explicit strategic review, lean bullish rather than neutral, because the downside is already largely priced and the review announcement itself sets a floor by signalling management accountability and potential value realisation.

_Seen 9×. First written 2026-09-16, last reinforced 2026-10-14._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-14 | LGI | neutral | +13.7% | Board and Executive Changes |
| 2026-10-14 | LGI | neutral | +13.7% | Board and Executive Changes |
| 2026-10-14 | LGI | neutral | +13.7% | Board and Executive Changes |
| 2026-10-14 | LGI | neutral | +13.7% | Board and Executive Changes |
| 2026-09-21 | RLF | neutral | -12.5% | Change in Board Structure |

### L037 — Market-sensitive response to an ASX price query at a stock at or near a 12-month low with volume running materially above average (>3x) and median daily turnover near zero

An ASX price query response that is flagged market sensitive and lands into a volume spike at a 12-month low almost always contains an affirmative disclosure — the exchange queries only when price action is anomalous, and a market-sensitive response confirms the company has something to say rather than a 'not aware of any reason' denial; lean bullish rather than neutral when the response is market-sensitive, the stock is at a multi-month low, and volume has already spiked, because the filing type itself signals an embedded catalyst rather than a denial.

_Seen 9×. First written 2026-09-17, last reinforced 2026-10-26._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-26 | STK | neutral | -29.8% | Response to ASX Price Query |
| 2026-10-13 | IMA | neutral | +14.8% | Response to ASX Price Query |
| 2026-10-13 | IMA | neutral | +14.8% | Response to ASX Price Query |
| 2026-10-07 | EXR | bullish | -21.0% | Response to ASX Price Query |
| 2026-09-25 | AMD | bullish | -12.4% | Response to ASX Price and Volume Query |

### L047 — Well mobilisation or rig-move commencement announcement (L002 shape) at an oil and gas junior that is near-zero liquidity (median daily turnover <A$1,000/day) with 5-day volume running >3x the 20-day average, stock 40-60% below its 12-month high

At near-zero-liquidity oil and gas juniors, a mobilisation announcement into a large relative volume spike represents a qualitatively different market dynamic than L002 assumes — the start of physical well operations at a named well in an illiquid stock is a discrete binary event that the market treats as a risk-on catalyst, not merely a programme statement; do not dismiss the volume ratio as noise purely because the absolute base is tiny when the ratio exceeds 3x and the announcement names a specific well beginning active operations; lean neutral-to-bullish rather than neutral when these conditions coincide, because the marginal buyer in an illiquid well-operations stock is typically informed about the well's prospects.

_Seen 9×. First written 2026-09-18, last reinforced 2026-10-08._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-08 | LKO | neutral | +28.4% | Wombat 5 Workover, Perforation and Testing |
| 2026-10-08 | LKO | neutral | +28.4% | Wombat 5 Workover, Perforation and Testing |
| 2026-10-08 | LKO | neutral | +28.4% | Wombat 5 Workover, Perforation and Testing |
| 2026-10-08 | LKO | neutral | +28.4% | Wombat 5 Workover, Perforation and Testing |
| 2026-09-24 | L1M | neutral | +20.7% | Phase 3 soil program underway at Warby Tungsten Project |

### L124 — Market-sensitive target-generation announcement ('gold targets generated', 'priority targets identified') at a junior explorer at a 12-month low with volume running 1.5–2x average and near-zero median daily turnover, where the filing identifies drill-ready anomalies by name or structural context

A market-sensitive target-generation announcement is not merely a programme statement — management and their advisers have judged the quality of the targets as price-relevant, which implies the targets are specific, drillable, and structurally significant beyond routine anomaly mapping; when the stock is at a 12-month low and relative volume is elevated (even on a near-zero absolute base), lean neutral-to-bullish rather than neutral, because the market-sensitive flag is the signal that this target-generation step is the catalyst the depressed register was waiting for.

_Seen 9×. First written 2026-10-05, last reinforced 2026-10-20._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-20 | OLY | neutral | +18.8% | High Priority Nexus Target Identified at Jacknife Project |
| 2026-10-20 | OLY | neutral | +18.8% | High Priority Nexus Target Identified at Jacknife Project |
| 2026-10-20 | OLY | neutral | +18.8% | High Priority Nexus Target Identified at Jacknife Project |
| 2026-10-20 | OLY | neutral | +18.8% | High Priority Nexus Target Identified at Jacknife Project |
| 2026-10-14 | NES | neutral | -19.4% | Soil geochemistry outlines multiple targets at southern GP |

### L004 — Clinical or scientific presentation announcement (oral or poster) at a named medical/scientific conference, stock at or near a multi-month low

An oral presentation slot at a competitive scientific conference is a positive credibility signal that is not merely procedural — it is peer selection of the data as noteworthy. When the stock is already at a significant low, this combination creates asymmetric upside that a neutral call misses; lean bullish when the presentation is oral, the conference is named and credible, and the stock is materially depressed.

_Seen 8×. First written 2026-09-14, last reinforced 2026-10-07._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-07 | PYC | bullish | -7.7% | PKD Program - Presentation of Data at ASN Conference |
| 2026-10-07 | PYC | bullish | -7.7% | PKD Program - Presentation of Data at ASN Conference |
| 2026-10-07 | PYC | bullish | -7.7% | PKD Program - Presentation of Data at ASN Conference |
| 2026-10-07 | PYC | bullish | -7.7% | PKD Program - Presentation of Data at ASN Conference |
| 2026-09-14 | RAD | neutral | +12.4% | RAD oral presentation at SNO26 on RAD101 Phase IIb data |

### L011 — Cleansing notice filed by a company at or near a multi-month high, stock extremely illiquid (median daily turnover <A$100/day)

A cleansing notice confirms a prior exempt offer has completed and new shares are now freely tradeable — treat this as a dilution-confirmation event, not a neutral administrative filing. When the stock is at a local high and liquidity is near-zero, the incoming free float of newly placeable shares into a thin market is a material bearish overhang; lean bearish rather than neutral.

_Seen 8×. First written 2026-09-14, last reinforced 2026-09-28._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-28 | SPD | neutral | -8.3% | Full Year Statutory Accounts - YE 30 June 2026 |
| 2026-09-25 | ATT | neutral | -19.6% | Cleansing Notice - Share Placement |
| 2026-09-25 | ATT | neutral | -19.6% | Cleansing Notice - Share Placement |
| 2026-09-25 | ATT | neutral | -19.6% | Cleansing Notice - Share Placement |
| 2026-09-17 | AM5 | neutral | -20.4% | Application for quotation of securities - AM5 |

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

### L026 — Metallurgical testwork result (recovery rate) announced as market sensitive at a junior explorer 50%+ below its 12-month high, with volume running above average into the announcement and no accompanying resource estimate or scoping study

A strong recovery rate headline (e.g. >90% gold recovery) is a project de-risking milestone but is not a standalone re-rating catalyst — it confirms processability, which the market discounts heavily unless accompanied by a resource estimate update or scoping study that translates the recovery into project economics; before calling bullish on metallurgy-only results at a deeply de-rated stock, ask whether the recovery figure can be monetised without a concurrent resource or feasibility update; if not, default to neutral rather than bullish.

_Seen 8×. First written 2026-09-16, last reinforced 2026-10-14._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-14 | TM1 | bullish | -14.8% | SOUTHWEST DELIVERS HIGH-GRADE PGM MINERALISATION FROM SURFAC |
| 2026-10-12 | BOA | bullish | -20.2% | High-grade copper results reinforce Ricci Lees potential |
| 2026-10-07 | PNN | bullish | -9.9% | SANTA ANNA MINERALOGICAL STUDY CONFIRMS NB RICH PYROCHLORE |
| 2026-09-21 | COD | bullish | -8.3% | Strong Copper & Silver Results Drive Elizabeth Creek PFS |
| 2026-09-16 | TMX | bullish | -14.6% | Metallurgy Confirms Lightning Gold Up to 93.7% Gold Recovery |

### L038 — Completed asset divestment announcement (titled 'Completes … Sale') at a stock 50%+ below its 12-month high, not flagged market sensitive, where the asset disposed is a non-core or operationally burdensome interest (e.g. a PSC, a JV stake, a legacy mine) and the headline uses the word 'Completes' rather than 'Announces'

A completion announcement is categorically different from an intention or signing announcement — it confirms cash (or consideration) has actually changed hands and the liability or cost centre has been extinguished; before applying L007's bearish default, ask whether the disposed asset was a drag (cash burn, sovereign risk, contingent liability) whose removal is itself the positive catalyst; if so, lean neutral-to-bullish rather than bearish, because the market may re-rate on balance-sheet simplification even without a disclosed quantum.

_Seen 8×. First written 2026-09-17, last reinforced 2026-10-20._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-20 | VAN | neutral | +12.3% | Completes Sale of Bullabulling Project |
| 2026-10-20 | VAN | neutral | +12.3% | Completes Sale of Bullabulling Project |
| 2026-10-20 | VAN | neutral | +12.3% | Completes Sale of Bullabulling Project |
| 2026-10-20 | VAN | neutral | +12.3% | Completes Sale of Bullabulling Project |
| 2026-09-21 | UNT | neutral | +9.1% | Unith Extends Debt Facility to 30 April 2027 |

### L051 — First-sample or initial surface/channel sampling result confirming in-situ mineralisation (not alluvial, not a drill intercept) at a junior explorer, flagged market sensitive, with below-average pre-announcement volume (<0.5x)

A market-sensitive 'first samples confirm in-situ' result is not a programme statement under L002 — it is an actual analytical result establishing primary hard-rock mineralisation for the first time, which is a genuine geological de-risking event; when pre-announcement volume is suppressed (no crowded long to unwind), do not default to neutral — lean neutral-to-bullish, because the result is real data rather than a commencement notice and the sell-the-news risk is low.

_Seen 8×. First written 2026-09-21, last reinforced 2026-10-08._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-08 | WYX | neutral | +15.1% | Sampling Commences at Gascoyne Gold Project |
| 2026-10-06 | BUR | bullish | -17.2% | Cane Bore Assays Confirm CID Iron Mineralisation at North an |
| 2026-10-06 | BUR | bullish | -17.2% | Cane Bore Assays Confirm CID Iron Mineralisation at North an |
| 2026-10-01 | DLY | neutral | +14.5% | Large-Scale MVT Zn-Pb Target at Box Hole, Huckitta Project |
| 2026-09-21 | LIB | neutral | +25.0% | FIRST SAMPLES CONFIRM IN-SITU GOLD FROM HARD ROCK, OKO NORTH |

### L052 — Market-sensitive announcement that a target company's board has rejected a 'further revised' (second or subsequent) acquisition proposal from a named acquirer, with volume elevated (>1.5x average) and stock near a multi-month high

A board rejection of a further-revised offer, when the stock is already near its high on elevated volume, signals that M&A optionality is fully priced and the rejection increases deal-collapse risk rather than bump probability — the market interprets the rejection as the acquirer's limit being reached rather than as leverage for a higher bid; call bearish rather than bullish when this is a second-or-subsequent rejection into an extended, pre-positioned tape.

_Seen 8×. First written 2026-09-21, last reinforced 2026-10-15._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-15 | INA | bullish | -11.5% | Update on Further Revised Non-Binding Indicative Offer |
| 2026-10-15 | INA | bullish | -11.5% | Update on Further Revised Non-Binding Indicative Offer |
| 2026-10-15 | INA | bullish | -11.5% | Update on Further Revised Non-Binding Indicative Offer |
| 2026-10-15 | INA | bullish | -11.5% | Update on Further Revised Non-Binding Indicative Offer |
| 2026-09-21 | PPT | bullish | -15.1% | Perpetual rejects further revised proposal from EQT |

### L057 — Royalty or non-core asset sale with fully disclosed cash proceeds (e.g. A$17.5 million) at a near-zero-liquidity micro-cap (median daily turnover <A$5,000/day), where the proceeds are large relative to inferred market capitalisation but the stock has been deeply de-rated and thinly traded for an extended period

Before calling bullish on a disclosed-proceeds asset sale at a near-zero-liquidity micro-cap, ask whether the company retains any operational asset or revenue-generating activity post-sale — if the divested asset was the primary value driver, the cash proceeds may be read as a liquidation signal rather than a balance-sheet strengthening event, and the market may discount the residual entity to near-zero regardless of the cash; default to neutral rather than bullish when the sold asset appears central to the investment thesis and no retained operational catalyst is signalled in the headline.

_Seen 8×. First written 2026-09-21, last reinforced 2026-09-22._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-22 | PGM | bullish | -9.0% | PGM receives final US$2 million from sale of Owendale |
| 2026-09-22 | PGM | bullish | -9.0% | PGM receives final US$2 million from sale of Owendale |
| 2026-09-22 | PGM | bullish | -9.0% | PGM receives final US$2 million from sale of Owendale |
| 2026-09-22 | PGM | bullish | -9.0% | PGM receives final US$2 million from sale of Owendale |
| 2026-09-21 | FZR | bullish | -7.5% | Sale of Bowdens Silver Royalty for A$17.5 million |

### L065 — Reinstatement to quotation announcement at a stock 80%+ below its 12-month high with zero pre-halt volume (0.0x ratio reflecting the halt period itself, not organic inactivity), paired with a concurrent small capital raise (e.g. A$5M funding advance) that is small relative to the implied cumulative losses that drove the de-rating

Before calling bullish on a reinstatement, ask whether the concurrent capital event resolves the underlying distress or merely extends it marginally — a small funding advance into a stock 80%+ below its high may be sufficient to lift the halt condition but insufficient to change the market's assessment of terminal risk; when the raise quantum is small relative to the scale of the de-rating, default to neutral rather than bullish, because reinstatement into a near-insolvent register frequently produces a sell-on-return-of-liquidity reaction as trapped holders exit.

_Seen 8×. First written 2026-09-23, last reinforced 2026-09-25._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-25 | NXN | bullish | -14.7% | Reinstatement to Quotation |
| 2026-09-25 | NXN | bullish | -14.7% | Reinstatement to Quotation |
| 2026-09-25 | NXN | bullish | -14.7% | Reinstatement to Quotation |
| 2026-09-25 | NXN | bullish | -14.7% | Reinstatement to Quotation |
| 2026-09-23 | IMA | bullish | -25.4% | Reinstatement to Quotation |

### L067 — Firm placement commitments announced as market sensitive at a stock at or near a multi-month high, where the raise quantum is large (e.g. A$70M) and the placement discount to the prevailing market price is the dominant near-term trading mechanic

When a large placement is announced at a stock at a multi-month high, the placement discount is immediately executable arbitrage for incoming placees and creates a mechanical price ceiling at the issue price — call bearish rather than neutral when the stock is extended, the raise is large, and the headline does not disclose a specific near-term funded catalyst (construction start, resource upgrade) that justifies paying above the placement price; the funded-catalyst moderating logic of L027 requires a named near-term operational trigger, not merely a general project advancement narrative.

_Seen 8×. First written 2026-09-23, last reinforced 2026-10-12._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-12 | BM1 | neutral | -9.8% | Placement to continue growth drilling & early works capital |
| 2026-10-02 | CBE | bullish | -7.5% | Completion of A$90M Institutional Capital Raise |
| 2026-10-02 | CBE | bullish | -7.5% | Completion of A$90M Institutional Capital Raise |
| 2026-09-24 | USL | bullish | -11.7% | Unico Raises $60 Million to Accelerate Development |
| 2026-09-23 | SVL | neutral | -14.7% | Silver Mines Receives Firm Commitments to Raise $70 Million |

### L076 — 'Becoming a substantial holder' (maiden 5% crossing, confirmed accumulation per L029) at a stock that is NOT deeply de-rated — specifically within 5% of a multi-month high — in a sector (e.g. lithium, base metals) that is in a confirmed cyclical downtrend at the time of the filing, where the commodity price trend is adverse

L029's bullish prior for maiden substantial-holder filings assumes the accumulation is informed and constructive, but at a stock near a multi-month high in a sector with adverse commodity price momentum, the new 5% holder may simply be slower to react to sector deterioration than the market; before applying L029's bullish default, ask whether the sector commodity price trend is negative and whether the stock's proximity to a recent high reflects sector beta rather than company-specific strength; if yes, downgrade to neutral, because the new holder's conviction may be a lagging rather than a leading signal.

_Seen 8×. First written 2026-09-24, last reinforced 2026-09-29._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-29 | WZR | bullish | -6.6% | Becoming a substantial holder |
| 2026-09-29 | WZR | bullish | -6.6% | Becoming a substantial holder |
| 2026-09-29 | WZR | bullish | -6.6% | Becoming a substantial holder |
| 2026-09-29 | WZR | bullish | -6.6% | Becoming a substantial holder |
| 2026-09-24 | CXO | bullish | -14.8% | Becoming a substantial holder |

### L080 — Large capital raise (>A$20M) headlined as 'Raises $X million to Accelerate Development' or similar, flagged market sensitive, at a junior developer or explorer where no price action data is available and no placement discount relative to last trade is disclosed in the headline

A large headline raise quantum is not sufficient for a bullish call without confirming the placement price relative to last trade — when the raise is large and no discount is visible in the headline, the placement price may represent a material discount that creates immediate arbitrage selling pressure from existing holders; default to neutral rather than bullish until the issue price and its discount to the prevailing market price are confirmed, because the funded-catalyst logic of L027 requires the raise to be accretive relative to where the stock is trading, not merely large in absolute terms.

_Seen 8×. First written 2026-09-24, last reinforced 2026-10-13._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-13 | CPN | bullish | -23.1% | Investor Webinar Presentation - Updated Kelpie MRE |
| 2026-10-02 | PGD | neutral | -9.9% | PGD Secures $2.25m to Advance Gold & Iron Exploration |
| 2026-10-02 | PGD | neutral | -9.9% | PGD Secures $2.25m to Advance Gold & Iron Exploration |
| 2026-10-02 | PGD | neutral | -9.9% | PGD Secures $2.25m to Advance Gold & Iron Exploration |
| 2026-10-02 | PGD | neutral | -9.9% | PGD Secures $2.25m to Advance Gold & Iron Exploration |

### L085 — Institutional placement flagged market sensitive at a stock within 5% of a multi-month high with 5-day volume running >1.5x average, where the headline frames the raise as funding a named growth phase rather than generic working capital

L027's funded-catalyst moderating logic requires the raise to be priced constructively relative to the market — when the stock is near a multi-month high and volume is already elevated (signalling pre-positioning), the placement price will almost certainly be set at a discount to the prevailing market price, creating immediate arbitrage selling; the funded-catalyst framing does not override the mechanical price ceiling imposed by the placement discount when the stock is extended; call bearish rather than bullish when the stock is near a recent high, volume is elevated, and a large placement is announced, because the discount arbitrage dominates the narrative signal in the near term.

_Seen 8×. First written 2026-09-25, last reinforced 2026-10-23._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-23 | 3DA | bearish | +8.8% | Cleansing Notice |
| 2026-10-12 | BM1 | neutral | -9.8% | Placement to continue growth drilling & early works capital |
| 2026-10-02 | CBE | bullish | -7.5% | Completion of A$90M Institutional Capital Raise |
| 2026-10-02 | CBE | bullish | -7.5% | Completion of A$90M Institutional Capital Raise |
| 2026-09-25 | MEK | bullish | -25.5% | Institutional Placement Funding The Next Phase of Growth |

### L086 — Auditor change notification (not flagged market sensitive, no reason given) at a junior miner where the stock has closed above its 60-day high on extreme relative volume (>3x) on the same session or the immediately prior session

When an auditor-change filing lands into a session where the stock has already closed above a multi-month technical high on extreme volume, the filing itself is not the market-moving event — the extreme volume and breakout preceded the filing and reflect a separate undisclosed catalyst; applying a bearish governance lens to the auditor change while the tape is signalling a major positive catalyst in progress is the error. Call bearish on the auditor-change signal only when volume is not simultaneously signalling a breakout; when both occur together, the tape signal dominates and the correct call is bearish on the auditor change is suspended — default to neutral and flag the volume-breakout as the primary unknown.

_Seen 8×. First written 2026-09-25, last reinforced 2026-10-06._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-06 | WBT | neutral | -13.5% | Change of Auditor |
| 2026-10-06 | WBT | neutral | -13.5% | Change of Auditor |
| 2026-10-06 | WBT | neutral | -13.5% | Change of Auditor |
| 2026-10-06 | WBT | neutral | -13.5% | Change of Auditor |
| 2026-09-25 | VKA | neutral | -18.3% | NOTIFICATION OF CHANGE OF EXTERNAL AUDITOR |

### L126 — Market-sensitive investor update with explicit operational acceleration language ('Accelerating X', 'Strong Y') at a near-zero absolute liquidity micro-cap SaaS or technology company 50%+ below its 12-month high, where volume is elevated relative to a near-zero base (1.5–2x) but no specific contract, customer name, or revenue figure is disclosed in the headline

Acceleration language in a market-sensitive headline at a near-zero-liquidity technology micro-cap is a qualitative claim, not a quantitative result — 'accelerating US implementation' and 'strong UK' describe directional sentiment rather than disclosed revenue, contract, or customer data; before calling bullish on acceleration language, require either a named customer, a disclosed revenue metric, or a contract win in the headline or body; if only qualitative momentum descriptors are present without quantitative anchors, default to neutral rather than bullish, because the market will discount unverifiable qualitative claims at a deeply de-rated, illiquid stock and the sell-the-news risk is material when the headline delivers sentiment rather than data.

_Seen 8×. First written 2026-10-05, last reinforced 2026-10-26._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-26 | X2M | bullish | -20.2% | X2M Smart Energy Launches at McMahons Place Echuca |
| 2026-10-26 | X2M | bullish | -20.2% | X2M Smart Energy Launches at McMahons Place Echuca |
| 2026-10-20 | FTI | bullish | -8.6% | NOL8 Releases Commercial Software V2.0 Ahead of Schedule |
| 2026-10-12 | FTI | bullish | -8.8% | Independent Testing Confirms NOL8's Economic Performance |
| 2026-10-05 | IOD | bullish | -6.6% | Investor Update-Accelerating US Implementation and Strong UK |

### L166 — Change of Director's Interest Notice at a deeply de-rated, near-zero-liquidity stock with deeply suppressed pre-announcement volume (<0.4x average), where direction is undisclosed in the headline and the stock has no near-term catalyst visible

When both de-rating and volume suppression are extreme and no companion operational filing is present, the absence of any buyer activity removes the constructive insider-buying argument — a director transacting quietly into a silent, distressed, illiquid register is statistically more likely to be a small disposal than an accumulation; lean bearish rather than neutral when volume is deeply suppressed, the stock is severely de-rated, and no operational catalyst accompanies the notice.

_Seen 8×. First written 2026-10-15, last reinforced 2026-10-19._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-19 | RMY | neutral | -10.4% | Change of Director's Interest Notice - David Williams |
| 2026-10-19 | NVA | neutral | -11.7% | Change of Director's Interest Notice - CG and AG |
| 2026-10-19 | RMY | neutral | -10.4% | Change of Director's Interest Notice - David Williams |
| 2026-10-19 | NVA | neutral | -11.7% | Change of Director's Interest Notice - CG and AG |
| 2026-10-19 | RMY | neutral | -10.4% | Change of Director's Interest Notice - David Williams |

### L178 — Results of General Meeting (not AGM) filing at a stock 50%+ below its 12-month high, not flagged market sensitive, with no headline disclosure of whether resolutions passed or failed

A non-flagged EGM or GM result without explicit 'all resolutions passed' or 'resolution failed' language in the headline is ambiguous but carries a directional skew: if all resolutions had passed cleanly the company would typically say so, and the absence of confirmation language at a distressed stock raises the probability of a partial failure or a dilutive capital authority that disappointed relative to expectations; lean bearish rather than neutral when the headline omits resolution outcomes and the stock is deeply de-rated.

_Seen 8×. First written 2026-10-19, last reinforced 2026-10-21._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-21 | MYG | neutral | -9.9% | Results of Meeting |
| 2026-10-21 | MYG | neutral | -9.9% | Results of Meeting |
| 2026-10-21 | MYG | neutral | -9.9% | Results of Meeting |
| 2026-10-21 | MYG | neutral | -9.9% | Results of Meeting |
| 2026-10-19 | AM5 | neutral | -17.1% | Results of General Meeting |

### L189 — Market-sensitive strategic pivot announcement ('broadens strategy', 'new [commodity] opportunity', 'pivots to [named project]') at a junior explorer 50%+ below its 12-month high, with volume running 1.5–2x average, where the headline names a large-scale or thematic opportunity but no resource, partner, or permit is disclosed

A market-sensitive strategic pivot to a named thematic commodity (tin, lithium, uranium) at a deeply de-rated stock is not merely a project update — the pivot itself reframes the investment thesis and can function as a re-rating catalyst independent of milestone specificity; do not apply L058's neutral default when the filing is market-sensitive and the pivot names a specific large-scale opportunity in an active thematic, because the narrative reset at a stock priced for maximum pessimism on its prior thesis creates asymmetric upside even without disclosed economic parameters; lean neutral-to-bullish rather than neutral in this configuration.

_Seen 8×. First written 2026-10-21, last reinforced 2026-10-26._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-26 | IPT | neutral | +18.0% | Impact Minerals announces new strategy built on HPA focus |
| 2026-10-26 | IPT | neutral | +18.0% | Impact Minerals announces new strategy built on HPA focus |
| 2026-10-26 | IPT | neutral | +18.0% | Impact Minerals announces new strategy built on HPA focus |
| 2026-10-26 | IPT | neutral | +18.0% | Impact Minerals announces new strategy built on HPA focus |
| 2026-10-21 | PGM | neutral | +22.1% | PGM broadens strategy with large-scale NT Tin Opportunity |

### L005 — Drilling intercept result where the headline grade and width appear strong, but the stock is deeply de-rated (>50% below 12-month high)

Before calling bullish on a strong-looking intercept, ask whether the company's de-rating reflects a known structural problem (funding gap, sovereign risk, permitting failure, commodity price collapse) that a single drill result cannot fix. If the stock has fallen >50% from its high, the market has already seen prior results and re-priced; one good hole is rarely sufficient to reverse that narrative without accompanying funding, resource upgrade, or offtake news.

_Seen 7×. First written 2026-09-14, last reinforced 2026-09-29._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-29 | CAE | bullish | -10.7% | Breccia Resource Increases by 37% Contained Metal |
| 2026-09-28 | SKY | bullish | -7.7% | High-Grade Drilling Drives Tallebung Resource Growth |
| 2026-09-16 | UM1 | bullish | -9.8% | Trenches Expose New Zones of Gold Mineralisation |
| 2026-09-14 | ENR | bullish | -7.8% | High-Grade Niobium Zone Emerging at Joyce |
| 2026-09-14 | GRE | bullish | -9.0% | Extensional Whundo Drilling Hits 4.8m at 7.1% Cu 0.9g/t Au |

### L008 — Early-stage geophysical survey commencement announcement (airborne magnetic, gravity, CSAMT etc.) on an illiquid junior explorer at or near a multi-month high, not flagged market sensitive

A survey commencement is a programme-activity statement with no data content — it tells the market only that fieldwork has started, which is often already anticipated after prior announcements. Treat as neutral-to-bearish when the stock is already at a local high, because speculative positioning built ahead of the announcement has no new result to feed on and is vulnerable to unwind.

_Seen 7×. First written 2026-09-14, last reinforced 2026-10-26._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-26 | PUR | neutral | -9.9% | IP Survey Expands Gold Drill Targets at Sascha Marcelina |
| 2026-10-26 | PUR | neutral | -9.9% | IP Survey Expands Gold Drill Targets at Sascha Marcelina |
| 2026-09-28 | CMB | neutral | -9.3% | Date of AGM and Closing Date for Director Nominations |
| 2026-09-28 | NHE | neutral | -9.3% | Interview - Dennis Donald - Executive Chairman |
| 2026-09-24 | L1M | neutral | +20.7% | Phase 3 soil program underway at Warby Tungsten Project |

### L009 — Executive Chairman appointment at a micro-cap or small-cap with an identifiable strategic context (e.g. foreign operations, asset sale process, exploration pivot), filed into above-average recent volume

An Executive Chairman appointment is not always procedural — consolidating board and executive authority in a single named individual is a governance signal that the company is repositioning or that prior leadership has departed under pressure. Before calling neutral, ask whether the appointee is known in the sector and whether the role consolidation implies an acceleration of a known strategic process (sale, JV, restructure); if so, lean bullish or bearish depending on the appointee's track record and the strategic context.

_Seen 7×. First written 2026-09-14, last reinforced 2026-09-30._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-30 | BOE | bullish | -12.4% | Peter Botten commences as Boss Energy Chair |
| 2026-09-30 | BOE | bullish | -12.4% | Peter Botten commences as Boss Energy Chair |
| 2026-09-16 | CAZ | neutral | +9.7% | Board Changes & Strategic Review |
| 2026-09-15 | INF | neutral | -24.1% | Board Changes to Accelerate USA Projects |
| 2026-09-15 | INF | neutral | -24.1% | Board Changes to Accelerate USA Projects |

### L013 — Completion-of-survey announcement (soil geochemistry, geophysical, mapping) at a junior explorer where no prior price action data is available, filing not flagged market sensitive

A survey-completion filing is subtly different from a survey-commencement filing: completion means results are now in hand and will be interpreted shortly, which can itself be a near-term catalyst signal. Without price action data to judge positioning, do not default to neutral on completion — the absence of tape data removes the key bearish argument (extended positioning vulnerable to unwind) that makes commencement announcements neutral; lean neutral-to-bullish when completion implies imminent result publication.

_Seen 7×. First written 2026-09-15, last reinforced 2026-10-06._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-06 | AS2 | neutral | -13.1% | Project-wide soil sampling complete at EPL 7626, Uis Project |
| 2026-10-06 | AS2 | neutral | -13.1% | Project-wide soil sampling complete at EPL 7626, Uis Project |
| 2026-10-06 | NRX | neutral | +7.8% | Maiden Sleitat Tin Exploration Completed and New Appointment |
| 2026-10-06 | AS2 | neutral | -13.1% | Project-wide soil sampling complete at EPL 7626, Uis Project |
| 2026-09-15 | SLB | neutral | +26.4% | Maiden Soil Geochemical Survey Completed at HoL Updated |

### L023 — Drilling programme commencement announcement (L002 shape) that also contains a named policy or strategic update element (e.g. 'US Elemental Update', 'Critical Minerals Strategy Update') for a company with material exposure to an active government critical minerals agenda, stock 60%+ below 12-month high

When a drill-commencement announcement is bundled with a named strategic or policy update, do not apply L002 in isolation — parse whether the secondary element contains substantive policy, offtake, or funding news that is independent of the drill result; if it does, the filing has two information layers and the policy/strategic layer can be the market-moving one. Ask: does the non-drilling component stand alone as a catalyst? If yes, upgrade from neutral toward bullish when the stock is materially de-rated and the strategic context (e.g. US critical minerals policy) is actively supportive.

_Seen 7×. First written 2026-09-15, last reinforced 2026-10-15._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-15 | AKN | bullish | -15.3% | US Support for Greenland Critical Minerals Exploration |
| 2026-09-21 | EPM | neutral | +13.3% | Drilling to Advance Greenland 208 Mt Gronnedal Resource |
| 2026-09-21 | EPM | neutral | +13.3% | Drilling to Advance Greenland 208 Mt Gronnedal Resource |
| 2026-09-21 | EPM | neutral | +13.3% | Drilling to Advance Greenland 208 Mt Gronnedal Resource |
| 2026-09-21 | EPM | neutral | +13.3% | Drilling to Advance Greenland 208 Mt Gronnedal Resource |

### L034 — Extension-only drill result (L018 shape) at a stock 50–70% below its 12-month high, where pre-announcement volume is materially BELOW average (volume ratio <0.7x)

L018's bearish default was built for elevated-volume scenarios where sell-the-news risk is the dominant concern. When volume is suppressed ahead of an extension result, the pre-positioning argument inverts — there is no crowded long to unwind, and thin pre-positioning into a material geological result at a deeply de-rated stock can produce a relief-buying response. Do not apply L018's bearish call when pre-announcement volume is below average; default to neutral instead, and reserve bearish for extension results into elevated volume only.

_Seen 7×. First written 2026-09-16, last reinforced 2026-10-22._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-22 | RMI | neutral | +13.5% | GOLD-SILVER RESULTS EXPAND WADI SALAMAH POTENTIAL |
| 2026-09-24 | BMR | bearish | +9.1% | Torpys High-Grade Mineralisation Extends Towards Surface |
| 2026-09-24 | BMR | bearish | +9.1% | Torpys High-Grade Mineralisation Extends Towards Surface |
| 2026-09-21 | HWK | neutral | +8.8% | Exploration Underway at the Olympus Scandium Project, WA |
| 2026-09-21 | HWK | neutral | +8.8% | Exploration Underway at the Olympus Scandium Project, WA |

### L044 — Supplementary prospectus filed by a deeply de-rated, near-zero-liquidity micro-cap (70%+ below 12-month high, median daily turnover <A$15,000/day), not flagged market sensitive

A supplementary prospectus is not uniformly administrative — it amends a live offer document, which means a capital raise is actively in progress and fresh capital is imminent; before calling neutral, ask whether the primary prospectus is an entitlement offer or rights issue that gives existing holders a participation right at current prices, because in a near-zero-liquidity stock even a small completed raise can function as a funded-catalyst and floor-setting signal; apply the same participatory-vs-exclusionary distinction as L041 and default to neutral-to-bullish rather than purely neutral when the structure is participatory.

_Seen 7×. First written 2026-09-18, last reinforced 2026-09-25._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-25 | LMG | neutral | -5.8% | Supplementary Prospectus |
| 2026-09-25 | LMG | neutral | -5.8% | Supplementary Prospectus |
| 2026-09-25 | LMG | neutral | -5.8% | Supplementary Prospectus |
| 2026-09-25 | LMG | neutral | -5.8% | Supplementary Prospectus |
| 2026-09-18 | DBF | neutral | +13.1% | Supplementary Prospectus |

### L114 — Compound positive headline ('Major Intercepts & Access Cleared') at a junior explorer 60%+ below its 12-month high, where 'major intercepts' implies quantitative drill results but no grade or width is disclosed in the headline, and 'access cleared' implies a prior impediment resolved, with no pre-announcement volume data available

Before calling bullish on a compound headline that pairs an intercept descriptor ('major intercepts') with an operational unlock ('access cleared'), confirm that the intercept component contains disclosed grade and width data — 'major' is a marketing qualifier, not a grade disclosure; if grade and width are absent from the headline, apply L054's neutral default to the intercept component and treat the compound framing as potentially obscuring the absence of economic data rather than amplifying the positive signal.

_Seen 7×. First written 2026-10-01, last reinforced 2026-10-15._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-15 | ITM | bullish | -10.8% | High-Grade Antimony and Deeper Gold at Falchion |
| 2026-10-15 | ITM | bullish | -10.8% | High-Grade Antimony and Deeper Gold at Falchion |
| 2026-10-15 | ITM | bullish | -10.8% | High-Grade Antimony and Deeper Gold at Falchion |
| 2026-10-15 | ITM | bullish | -10.8% | High-Grade Antimony and Deeper Gold at Falchion |
| 2026-10-01 | TM1 | bullish | -9.4% | Major Intercepts & Access Cleared for Resource Drilling |

### L170 — Full-year annual report at a consumer-facing healthcare or cannabis company (not a junior mineral explorer) at a 12-month low with elevated pre-announcement volume (>1.5x average), where the company has a known commercial revenue base (i.e. is not pre-revenue) and the de-rating reflects regulatory or sector headwinds rather than a going-concern crisis

L094's bearish default was built for junior explorers where the primary negative risk is a going-concern qualification or a deteriorating cash position with no revenue offset; do not apply L094 to revenue-generating consumer-facing companies where the annual report may contain positive commercial metrics (revenue growth, margin improvement, regulatory approval) that offset the compliance framing — default to neutral rather than bearish when the company has a known revenue base and the de-rating reflects sector rather than company-specific failure.

_Seen 7×. First written 2026-10-16, last reinforced 2026-10-19._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-19 | ZNO | bearish | +28.5% | Quarterly Activities/Appendix 4C Cash Flow Report |
| 2026-10-19 | ZNO | bearish | +28.5% | Quarterly Activities/Appendix 4C Cash Flow Report |
| 2026-10-19 | ZNO | bearish | +28.5% | Quarterly Activities/Appendix 4C Cash Flow Report |
| 2026-10-16 | VIT | bearish | +24.0% | FY26 Annual Report |
| 2026-10-16 | VIT | bearish | +24.0% | FY26 Annual Report |

### L171 — Market-sensitive ASX price query response at a 12-month low where no pre-announcement volume data is available (volume ratio cannot be computed) and the company is a clinical-stage biotech with known trial risk

L037 establishes a bullish prior for market-sensitive query responses at multi-month lows into volume spikes, but the bullish prior depends on the volume spike confirming informed accumulation; when no volume data is available and the company is a clinical-stage biotech where an adverse trial update is a plausible negative catalyst, the query may have been triggered by a price decline rather than a price rise — default to bearish rather than neutral when the stock is at a 12-month low, the company is clinical-stage, and no volume data is available to confirm the query was triggered by upward rather than downward anomalous movement, because downward-query responses at clinical biotechs carry a materially higher base rate of negative disclosure.

_Seen 7×. First written 2026-10-16, last reinforced 2026-10-26._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-26 | STK | neutral | -29.8% | Response to ASX Price Query |
| 2026-10-26 | STK | neutral | -29.8% | Response to ASX Price Query |
| 2026-10-26 | STK | neutral | -29.8% | Response to ASX Price Query |
| 2026-10-16 | ATX | neutral | -21.0% | Response to ASX Price Query |
| 2026-10-16 | ATX | neutral | -21.0% | Response to ASX Price Query |

### L173 — Quarterly investor webinar announcement (not flagged market sensitive) at a deeply de-rated medical technology or hardware company (>80% below 12-month high) with elevated pre-announcement volume (>2x average), where the company has a named commercial product and known revenue, distinguishing it from a pre-revenue junior explorer

L094's bearish default applies to junior explorers where elevated volume into a compliance filing signals distribution ahead of a going-concern disclosure; do not apply L094 to commercial-stage technology companies where a quarterly webinar may contain a positive revenue or partnership update — at an extreme de-rating (>80%), the asymmetry favours upside on any non-catastrophic quarterly result; default to neutral rather than bearish when the company has a named commercial product and the webinar is the primary investor update vehicle rather than a purely compliance-driven filing.

_Seen 7×. First written 2026-10-16, last reinforced 2026-10-21._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-21 | BOT | neutral | +8.2% | Botanix Webinar on 27 October - Registration Information |
| 2026-10-21 | BOT | neutral | +8.2% | Botanix Webinar on 27 October - Registration Information |
| 2026-10-21 | BOT | neutral | +8.2% | Botanix Webinar on 27 October - Registration Information |
| 2026-10-16 | CVB | bearish | +13.3% | Q1 FY27 Quarterly Results Investor Webinar |
| 2026-10-16 | CVB | bearish | +13.3% | Q1 FY27 Quarterly Results Investor Webinar |

### L221 — Named sector-specialist conference presentation (IMARC, RIU, Noosa Mining equivalent) at a stock at a 12-month low with volume running 1.5–2.5x average, where the conference is a credible critical-minerals or base-metals forum with known institutional and strategic attendance, and the stock is thinly traded with near-zero absolute liquidity

IMARC and equivalent tier-1 mining-industry conferences attract strategic acquirers, offtake partners, and specialist fund managers — not merely retail awareness; when the stock is at a 12-month low on elevated relative volume and the conference is a named tier-1 industry forum (not a generic investor roadshow), apply L039's logic rather than L049's: lean neutral-to-bullish rather than neutral, because the audience composition makes accumulation by an informed strategic party more probable than pre-raise distribution, and the elevated volume at a depressed price is the confirming signal.

_Seen 7×. First written 2026-10-27, last reinforced 2026-10-28._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-28 | QML | neutral | +10.4% | IMARC Conference Presentation |
| 2026-10-28 | SGA | bearish | +28.1% | IMARC Revised Investor Presentation |
| 2026-10-28 | QML | neutral | +10.4% | IMARC Conference Presentation |
| 2026-10-28 | SGA | bearish | +28.1% | IMARC Revised Investor Presentation |
| 2026-10-28 | QML | neutral | +10.4% | IMARC Conference Presentation |

### L025 — Oil or gas well operations update (titled 'Operations Update' or similar) at a stock 80%+ below its 12-month high, not flagged market sensitive, with no flow-rate or pressure data in the headline, but implying active well intervention is underway

An operations update on a named well at an oil and gas junior — even without disclosed results — can signal that a well intervention has succeeded enough to warrant public disclosure; before applying L002 or L005, ask whether the headline's operational specificity (named well, active verb) implies a result is embedded in the body of the filing; if so, do not default to bearish on the de-rating alone — call neutral pending body review rather than bearish.

_Seen 6×. First written 2026-09-16, last reinforced 2026-09-24._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-24 | GLL | neutral | -24.3% | Zydeco Sidetrack to Commence Testing 5 x Shallow Oil Targets |
| 2026-09-24 | GLL | neutral | -24.3% | Zydeco Sidetrack to Commence Testing 5 x Shallow Oil Targets |
| 2026-09-16 | XST | bearish | +16.4% | Diona-1 Operations Update |
| 2026-09-16 | XST | bearish | +16.4% | Diona-1 Operations Update |
| 2026-09-16 | AXP | neutral | -9.4% | Oil Flow Rates Enhanced at Charlie 1 Well After Controlled F |

### L066 — Simultaneous departure of two named senior officers (e.g. CFO and Company Secretary together in a single filing) at a stock 70%+ below its 12-month high with suppressed pre-announcement volume (<0.5x average)

Before calling bearish on a dual C-suite departure at a distressed micro-cap, ask whether the departing roles are operational or purely administrative — a combined CFO/Company Secretary role (common at micro-caps where one person holds both titles) may represent a routine cost-saving restructure rather than a governance crisis, and suppressed volume suggests the market has no negative advance knowledge; default to neutral rather than bearish when the departure involves roles that can be combined or outsourced without operational disruption, reserving bearish for named operational executives (CEO, COO, Chief Scientist) departing in distress conditions.

_Seen 6×. First written 2026-09-23, last reinforced 2026-10-14._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-14 | TSR | neutral | -20.2% | Appointment of CFO and Company Secretary |
| 2026-10-14 | TSR | neutral | -20.2% | Appointment of CFO and Company Secretary |
| 2026-09-23 | HYT | bearish | +16.3% | Change of Company Secretary & Chief Financial Officer |
| 2026-09-23 | HYT | bearish | +16.3% | Change of Company Secretary & Chief Financial Officer |
| 2026-09-23 | HYT | bearish | +16.3% | Change of Company Secretary & Chief Financial Officer |

### L079 — AGM presentation filing (not flagged market sensitive) at a stock within 5% of a multi-month high, where the company is a mid-to-large-cap with identifiable institutional following and the AGM presentation is the primary scheduled investor communication for the period (i.e., no interim results or investor day is scheduled nearby)

An AGM presentation at a mid-cap with institutional ownership near a multi-month high, where no other scheduled communication is imminent, functions as the primary earnings-outlook and capital-allocation update for the period — it is not merely procedural even without a market-sensitive flag; before calling neutral, ask whether the AGM document is the company's sole forward-guidance vehicle for the half-year; if yes, lean neutral-to-bullish when the stock's prior tape is constructive and the company has a track record of using AGM presentations to provide positive operational updates.

_Seen 6×. First written 2026-09-24, last reinforced 2026-10-22._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-22 | MFG | neutral | -9.1% | 2026 AGM Chair and CEO Addresses and Presentation Slides |
| 2026-10-22 | MFG | neutral | -9.1% | 2026 AGM Chair and CEO Addresses and Presentation Slides |
| 2026-09-24 | MGH | neutral | +8.7% | AGM Presentation |
| 2026-09-24 | SLS | neutral | +10.2% | Date of AGM and Closing Date for Nominations of Directors |
| 2026-09-24 | MGH | neutral | +8.7% | AGM Presentation |

### L081 — Completion of capital consolidation (share consolidation/reverse split) announcement at a near-zero-liquidity micro-cap (median daily turnover <A$10/day) with relative volume running >2x average, where the consolidation has just formally completed and no companion capital raise is yet filed

A completed share consolidation at a near-zero-liquidity stock into elevated relative volume signals that the consolidation has reset the price to a level that makes the stock tradeable again — the completion itself can attract fresh buyers who were deterred by the sub-cent price; before calling neutral, ask whether the consolidation restores a tradeable price point and whether any companion raise or operational announcement is imminent; lean neutral-to-bullish rather than neutral when the consolidation has just completed, liquidity is near-zero, and relative volume is elevated, because the price-reset can be the catalyst for re-engagement by a buyer cohort that was previously locked out by the price level.

_Seen 6×. First written 2026-09-24, last reinforced 2026-10-19._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-19 | AMS | bearish | +9.6% | Consolidation/Split - AMS |
| 2026-10-19 | AMS | bearish | +9.6% | Consolidation/Split - AMS |
| 2026-10-19 | AMS | bearish | +9.6% | Consolidation/Split - AMS |
| 2026-10-19 | AMS | bearish | +9.6% | Consolidation/Split - AMS |
| 2026-09-24 | BP8 | neutral | +17.4% | Completion of Consolidation of Capital |

### L093 — Principal or primary environmental approval announcement (flagged market sensitive) for an oil and gas or resources project in a Southeast Asian or emerging-market jurisdiction, where the stock is 50%+ below its 12-month high and pre-announcement volume is materially below average (<0.5x)

Before calling bullish on a principal environmental approval, ask whether the approval itself is the final gating constraint or merely one of several sequential regulatory hurdles still required before drilling or development capital can be committed — in SE Asian and emerging-market jurisdictions, 'principal environmental approval' often precedes separate operational, social, and fiscal permits that can each take years; if the approval does not directly enable a disclosed next operational step (farm-out launch, FID, drill start), default to neutral rather than bullish, because the market may already have priced the approval probability and will focus immediately on the remaining permit gaps.

_Seen 6×. First written 2026-09-28, last reinforced 2026-10-28._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-28 | CRD | neutral | -12.1% | Quarterly Activities Report & Appendix 5B - 2026 Q3 |
| 2026-10-28 | CRD | neutral | -12.1% | Quarterly Activities Report & Appendix 5B - 2026 Q3 |
| 2026-10-28 | CRD | neutral | -12.1% | Quarterly Activities Report & Appendix 5B - 2026 Q3 |
| 2026-09-28 | FDR | bullish | -12.4% | KTJ Project Secures Principal Environmental Approval |
| 2026-09-28 | FDR | bullish | -12.4% | KTJ Project Secures Principal Environmental Approval |

### L108 — Named senior executive or chair appointment announcement (not flagged market sensitive, no price action data available) at an operating or near-operating resources company that is in a known cyclical or operational headwind, where the appointee's credentials are strong but unrelated to the company's specific current operational challenge (e.g. a project-finance or M&A specialist appointed at a company facing cost overruns or production ramp issues)

Before calling bullish on a high-profile board appointment, ask whether the appointee's primary expertise addresses the company's specific current problem — a credentialed executive whose background is in deal-making or growth phases does not resolve a cost, production, or balance-sheet crisis, and the market may read the appointment as signalling that existing management has failed to fix the operational issue rather than as a pure quality upgrade; default to neutral rather than bullish when the appointee's skills do not directly map to the company's dominant known risk.

_Seen 6×. First written 2026-09-30, last reinforced 2026-10-19._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-19 | CBE | bullish | -11.0% | CBE Appoints Mining Heavyweight as Chairman to Drive Growth |
| 2026-10-19 | CBE | bullish | -11.0% | CBE Appoints Mining Heavyweight as Chairman to Drive Growth |
| 2026-10-19 | CBE | bullish | -11.0% | CBE Appoints Mining Heavyweight as Chairman to Drive Growth |
| 2026-10-19 | CBE | bullish | -11.0% | CBE Appoints Mining Heavyweight as Chairman to Drive Growth |
| 2026-10-13 | TXR | neutral | +20.0% | Talonx Appoints Former MOD Resources Executive Director |

### L116 — Change in substantial holding (direction ambiguous, not 'becoming') at a stock with near-zero median daily turnover (A$0–A$100/day) and 5-day volume running >3x average, where the extreme volume ratio is entirely attributable to a near-zero base rather than any meaningful absolute dollar flow

When median daily turnover is effectively zero and the volume ratio is extreme (>3x) purely because the denominator is near-zero, do not treat the volume spike as a directional signal at all — the ratio is arithmetically unstable and reflects the absence of a trading history rather than informed activity; default to neutral-to-bearish on an ambiguous substantial-holder change at near-zero liquidity, because the dominant base rate at effectively untradeable stocks is holder exit rather than strategic accumulation, and the volume data cannot distinguish between them.

_Seen 6×. First written 2026-10-01, last reinforced 2026-10-13._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-13 | GLL | neutral | -20.0% | Change in substantial holding |
| 2026-10-13 | CYV | neutral | -15.4% | Change in substantial holding |
| 2026-10-13 | ALV | neutral | +22.9% | Webinar Invitation - Bluebush IAC HREE Project Brazil |
| 2026-10-12 | RIE | neutral | -11.3% | Letter to Shareholders - Annual General Meeting |
| 2026-10-09 | EGY | neutral | -17.3% | Notification regarding unquoted securities - EGY |

### L144 — Non-market-sensitive 'Drilling Schedule Update' or equivalent project-schedule-only headline (no intercept, no resource, no permit) at a stock deeply de-rated (>60% below 12-month high) with pre-announcement volume elevated (>1.5x average), where the headline names only a schedule change rather than a positive operational milestone

A schedule update headline at a deeply de-rated stock with elevated volume into the filing is more likely to contain a delay or deferral than an acceleration — the elevated volume may reflect holders front-running a negative schedule disclosure rather than accumulation ahead of a positive one. When the headline is not market-sensitive, names only a schedule change, and volume is elevated, lean bearish rather than neutral, because the filing shape (schedule, not results) combined with elevated pre-announcement activity is the classic distribution-ahead-of-bad-news pattern.

_Seen 6×. First written 2026-10-09, last reinforced 2026-10-21._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-21 | BUX | neutral | +9.8% | Wolverine Project - Drilling Program Update |
| 2026-10-21 | BUX | neutral | +9.8% | Wolverine Project - Drilling Program Update |
| 2026-10-21 | BUX | neutral | +9.8% | Wolverine Project - Drilling Program Update |
| 2026-10-09 | NES | neutral | -20.6% | Yarri Gold Project - Drilling Schedule Update |
| 2026-10-09 | NES | neutral | -20.6% | Yarri Gold Project - Drilling Schedule Update |

### L145 — Change of Director's Interest Notice at a stock at or near a multi-month high (within 5% of 3-month high) with suppressed pre-announcement volume (<0.5x average) and near-zero absolute liquidity (median daily turnover <A$10,000/day), where no direction is disclosed in the headline

At a stock at a multi-month high with suppressed volume and near-zero liquidity, a director interest notice carries an asymmetric bearish risk: the director is the most informed seller into strength, and in a near-zero-liquidity stock even a small disclosed sale is disproportionately large relative to normal float; lean bearish rather than neutral when the stock is at a recent high, volume is suppressed (not elevated, ruling out broad distribution already underway), and the filing type is a director interest notice, because the informed-seller-into-strength base rate dominates the constructive-purchase interpretation at extended prices.

_Seen 6×. First written 2026-10-09, last reinforced 2026-10-15._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-15 | NPM | neutral | +12.6% | Change of Director's Interest Notice - Mason |
| 2026-10-13 | AUV | neutral | -14.3% | Change of Director's Interest Notice |
| 2026-10-13 | AUV | neutral | -14.3% | Change of Director's Interest Notice |
| 2026-10-09 | CSX | neutral | -16.6% | Change of Director's Interest Notice |
| 2026-10-09 | CSX | neutral | -16.6% | Change of Director's Interest Notice |

### L168 — Market-sensitive 'defines multiple targets' or equivalent multi-target characterisation announcement (not an assay intercept result, not a programme commencement) at a junior explorer at a 12-month low with suppressed pre-announcement volume (<0.5x average) and thin but non-zero liquidity

A 'defines multiple targets' headline flagged market sensitive is not a pure programme statement under L002 — it reports interpreted analytical output (geochemistry, geophysics, or surface sampling that has been processed into drillable targets), which is a substantive geological de-risking step; when the stock is at a 12-month low, volume is suppressed (no crowded long to unwind), and the market-sensitive flag is present, lean neutral-to-bullish rather than neutral, because the target-definition result is real interpreted data, not merely an activity commencement notice.

_Seen 6×. First written 2026-10-16, last reinforced 2026-10-20._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-20 | PMM | bullish | -12.7% | Pioneer Identifies Five Gold-Copper Targets at San Francisco |
| 2026-10-20 | PMM | bullish | -12.7% | Pioneer Identifies Five Gold-Copper Targets at San Francisco |
| 2026-10-16 | TAT | neutral | +26.3% | High-grade Cu-Au defines multiple targets at OK-Bellevue |
| 2026-10-16 | TAT | neutral | +26.3% | High-grade Cu-Au defines multiple targets at OK-Bellevue |
| 2026-10-16 | TAT | neutral | +26.3% | High-grade Cu-Au defines multiple targets at OK-Bellevue |

### L184 — Notice of AGM filing at a stock at a 3-month low (not a 12-month low) with volume running >2x average and near-zero absolute liquidity, where L151's bearish default was applied but the stock is not at its worst historical price level

L151's bearish default requires the stock to be at a 12-month low with suppressed volume — when the stock is at a 3-month low rather than a 12-month low and volume is elevated (not suppressed), the setup is closer to L048's activist-accumulation pattern than L151's disengaged-register pattern; default to neutral rather than bearish when the de-rating is not at an extreme and volume is elevated, because the elevated volume may reflect informed accumulation ahead of a governance event rather than distribution ahead of a dilutive resolution.

_Seen 6×. First written 2026-10-20, last reinforced 2026-10-29._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-29 | ADO | bearish | +13.8% | Quarterly Activities/Appendix 4C Cash Flow Report |
| 2026-10-23 | YUG | bearish | +10.4% | Letter to Shareholders - Notice of AGM |
| 2026-10-23 | YUG | bearish | +10.4% | Letter to Shareholders - Notice of AGM |
| 2026-10-20 | FGH | bearish | +12.8% | Notice of Annual General Meeting and Proxy Form |
| 2026-10-20 | FGH | bearish | +12.8% | Notice of Annual General Meeting and Proxy Form |

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

### L022 — Permit submission (bulk sampling, exploration, environmental) announced as market sensitive by a junior explorer 40-60% below its 12-month high, with no prior permit submission flagged

A maiden permit submission flagged as market sensitive signals that management and their legal advisers regard the regulatory gate as a material project milestone, not a routine step — the market-sensitive designation is the key qualifier that distinguishes this from a generic activity statement. Do not default to neutral purely because no data has been returned; lean neutral-to-bullish when the permit is the first of its kind for the project, the stock is materially de-rated, and the market-sensitive flag is present, because approval opens the next operational phase and the flag indicates the company believes the market does not have this priced.

_Seen 5×. First written 2026-09-15, last reinforced 2026-10-05._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-05 | BRU | neutral | -7.2% | Buru refers the Rafael Project to the EPA WA |
| 2026-09-18 | VTX | neutral | +8.7% | Operational Update - Varied EPL Issued |
| 2026-09-15 | OD6 | neutral | +10.0% | MAIDEN QUINN DRILLING BULK SAMLPLING PERMIT SUBMITTED |
| 2026-09-15 | OD6 | neutral | +10.0% | MAIDEN QUINN DRILLING BULK SAMLPLING PERMIT SUBMITTED |
| 2026-09-15 | OD6 | neutral | +10.0% | MAIDEN QUINN DRILLING BULK SAMLPLING PERMIT SUBMITTED |

### L035 — Market-sensitive tenement application announcement (new ground, additional block, adjacent tenure) at a junior explorer with 5-day volume running >1.5x average, with no price-position data indicating the stock is near a multi-month high

A market-sensitive tenement application is not merely an activity statement — management and their advisers have judged it material, which implies the ground is strategically significant (district consolidation, blocking a competitor, covering a known geophysical anomaly); do not default to neutral on a flagged tenement announcement into elevated volume; lean neutral-to-bullish when the market-sensitive designation is present, because the flag is itself the signal that the tenure has identifiable value beyond routine acreage.

_Seen 5×. First written 2026-09-17, last reinforced 2026-10-13._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-13 | OR3 | bullish | -12.9% | Kal East Gold Project Tenure Expanded By 55% |
| 2026-09-17 | AMD | neutral | +17.2% | Application to secure another key iron ore tenement |
| 2026-09-17 | AMD | neutral | +17.2% | Application to secure another key iron ore tenement |
| 2026-09-17 | AMD | neutral | +17.2% | Application to secure another key iron ore tenement |
| 2026-09-17 | AMD | neutral | +17.2% | Application to secure another key iron ore tenement |

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

### L063 — Four or more simultaneous Director's Interest Notices filed on the same day at a deeply de-rated stock (>70% below 12-month high) with elevated recent volume (>2x average), where the filing count suggests a coordinated company-wide equity event (vesting, grant, or on-market purchase programme)

When four or more director interest notices land simultaneously, the coordination itself is the signal — a company-wide vesting or grant event at a distressed stock often accompanies a performance milestone or remuneration restructure that management deems constructive; treat the cluster as a probable positive internal event (vesting on achievement, or coordinated on-market buying) and lean neutral-to-bullish rather than neutral, because the base rate for coordinated director acquisitions at heavily de-rated prices is meaningfully more constructive than a single ambiguous filing.

_Seen 5×. First written 2026-09-22, last reinforced 2026-10-21._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-21 | RMY | neutral | +8.4% | Change of Director's Interest Notice - David Williams |
| 2026-09-22 | RAD | neutral | +14.0% | Change of Director's Interest Notices x 4 |
| 2026-09-22 | RAD | neutral | +14.0% | Change of Director's Interest Notices x 4 |
| 2026-09-22 | RAD | neutral | +14.0% | Change of Director's Interest Notices x 4 |
| 2026-09-22 | RAD | neutral | +14.0% | Change of Director's Interest Notices x 4 |

### L072 — Conference presentation announcement at a named, broadly accessible investor conference (e.g. ASX SMIDcaps Conference) by a pre-revenue biotech or life sciences company, not flagged market sensitive, with no named catalyst in the headline and no price action data available

Before calling neutral on an ASX SMIDcaps or equivalent broad-market investor conference announcement, distinguish it from the L010 pre-raise-marketing bearish default — the ASX SMIDcaps audience includes active generalist fund managers who may not follow the stock, and a presentation slot can itself trigger fresh accumulation independent of any new fundamental disclosure; default to neutral rather than bearish when the conference is a named ASX-organised or equivalent institutional forum, reserving bearish only for generic online webinars or roadshows with no curated institutional audience.

_Seen 5×. First written 2026-09-23, last reinforced 2026-10-01._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-01 | SHG | bearish | +7.7% | Company Presentation |
| 2026-10-01 | SHG | bearish | +7.7% | Company Presentation |
| 2026-10-01 | SHG | bearish | +7.7% | Company Presentation |
| 2026-10-01 | SHG | bearish | +7.7% | Company Presentation |
| 2026-09-23 | AVE | neutral | -9.5% | Avecho to present at the ASX SMIDcaps Conference |

### L075 — Project expansion or tenement enlargement headline ('Project Expanded', 'Ground Extended', 'Additional Tenure Secured') at a junior explorer 60%+ below its 12-month high with near-zero median daily turnover (<A$1,000/day), NOT flagged market sensitive, with pre-announcement volume below average (<0.6x)

A project-expansion headline at a deeply de-rated, near-zero-liquidity junior with suppressed volume does not carry the L008 sell-the-news risk (no elevated pre-positioning) and is not the pre-raise marketing signal of L010 (no market-sensitive flag and no named capital event); in this configuration the announcement is more likely to be a genuine operational update that a news-starved register treats as a positive trigger; default to neutral-to-bullish rather than neutral when the de-rating exceeds 60%, liquidity is near-zero, volume is suppressed, and the headline confirms ground or project growth without an accompanying raise signal.

_Seen 5×. First written 2026-09-24, last reinforced 2026-10-13._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-13 | OR3 | bullish | -12.9% | Kal East Gold Project Tenure Expanded By 55% |
| 2026-09-24 | BSR | neutral | +17.4% | Bald Peaks Project Expanded |
| 2026-09-24 | BSR | neutral | +17.4% | Bald Peaks Project Expanded |
| 2026-09-24 | BSR | neutral | +17.4% | Bald Peaks Project Expanded |
| 2026-09-24 | BSR | neutral | +17.4% | Bald Peaks Project Expanded |

### L087 — Aircore or RC drilling programme completion announcement headlined as a 'Gold Discovery' (or equivalent named discovery language) flagged market sensitive at a junior explorer 60%+ below its 12-month high, where the headline bundles programme completion with discovery framing but no assay grades are yet disclosed

L002 covers commencement announcements; L013 covers survey completion. A programme-completion announcement that pairs 'completed' with active discovery language ('Gold Discovery') occupies a third category — it signals that the company believes results already in hand are discovery-grade, even before assay publication; treat the discovery language as a substantive signal that separates this from a neutral programme-completion filing. When the headline names a discovery and the filing is market-sensitive, lean neutral-to-bullish rather than applying L002's neutral default, because management has made an affirmative claim about result quality that the market-sensitive flag endorses.

_Seen 5×. First written 2026-09-25, last reinforced 2026-10-14._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-14 | EG1 | bullish | -11.9% | Final Aircore Results,4 Defined Gold Prospects at Mt Monger |
| 2026-09-25 | AUV | neutral | +14.7% | Gold Discovery Aircore Program at Nuckulla Hill Completed |
| 2026-09-25 | AUV | neutral | +14.7% | Gold Discovery Aircore Program at Nuckulla Hill Completed |
| 2026-09-25 | AUV | neutral | +14.7% | Gold Discovery Aircore Program at Nuckulla Hill Completed |
| 2026-09-25 | AUV | neutral | +14.7% | Gold Discovery Aircore Program at Nuckulla Hill Completed |

### L091 — Earn-in or JV agreement announcement (market-sensitive, named asset, named jurisdiction) at a stock 50%+ below its 12-month high, where the jurisdiction carries elevated sovereign or operational risk (e.g. Angola, DRC, Guinea) and no earn-in cash commitment or timeline is disclosed in the headline

Before calling bullish on an earn-in agreement, ask whether the jurisdiction's sovereign risk profile is itself a primary reason for the prior de-rating — if it is, a new agreement to spend more capital in that jurisdiction may compound rather than resolve the market's concern; default to neutral rather than bullish when the jurisdiction is a known risk factor for the stock and no earn-in quantum or timeline is disclosed, because the deal confirms exposure to the risk rather than removing it.

_Seen 5×. First written 2026-09-28, last reinforced 2026-10-14._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-14 | AKN | neutral | -12.7% | Presentation re Acquisition of Greenland Niobium Project |
| 2026-10-14 | AKN | neutral | -12.7% | Presentation re Acquisition of Greenland Niobium Project |
| 2026-09-28 | TYX | bullish | -20.2% | Agreement To Earn 70% Interest REE And Nb Project, Angola |
| 2026-09-28 | TYX | bullish | -20.2% | Agreement To Earn 70% Interest REE And Nb Project, Angola |
| 2026-09-28 | TYX | bullish | -20.2% | Agreement To Earn 70% Interest REE And Nb Project, Angola |

### L095 — Amendment to lead manager mandate announcement (not flagged market sensitive) at a stock at a 12-month low with volume running >3x average, where the amendment signals an active capital raise is being structured but has not yet been announced

An amendment to a lead manager mandate is a pre-raise administrative signal that a capital event is imminent — but the amendment itself, rather than the subsequent raise announcement, is when the market already knows dilution is coming; at a 12-month low on extreme relative volume, the dominant read is that holders are front-running dilution by selling before the placement is announced and the stock re-prices to the issue discount; lean bearish rather than neutral on a lead-manager-mandate amendment into extreme volume at a 12-month low, because the filing confirms a raise is in progress and the elevated volume more likely reflects exit ahead of dilution than accumulation ahead of a funded catalyst.

_Seen 5×. First written 2026-09-28, last reinforced 2026-10-15._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-15 | GW1 | neutral | -9.9% | Proposed issue of securities - GW1 |
| 2026-10-15 | GW1 | neutral | -9.9% | Proposed issue of securities - GW1 |
| 2026-09-28 | BUY | neutral | -8.5% | Amendment to lead manager mandate |
| 2026-09-28 | BUY | neutral | -8.5% | Amendment to lead manager mandate |
| 2026-09-28 | BUY | neutral | -8.5% | Amendment to lead manager mandate |

### L100 — Government agency contract extension announcement (market-sensitive) at a deeply de-rated stock (60%+ below 12-month high) where the contract is an extension of an existing programme rather than a new award, and no extended duration or dollar value is disclosed in the headline

A contract extension without disclosed duration or value confirms only that the existing relationship continues — it does not expand the revenue base or resolve the commercial uncertainty that drove the de-rating; before calling bullish on a government contract extension, ask whether the extension is for a materially longer term or higher value than the prior contract, and if neither is disclosed, default to neutral rather than bullish, because the market has already priced the baseline relationship and the extension delivers no new economic information.

_Seen 5×. First written 2026-09-28, last reinforced 2026-10-19._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-19 | SKK | bullish | -21.3% | Stakk Extends Contract with Chime Financial to December 2027 |
| 2026-10-19 | SKK | bullish | -21.3% | Stakk Extends Contract with Chime Financial to December 2027 |
| 2026-10-19 | SKK | bullish | -21.3% | Stakk Extends Contract with Chime Financial to December 2027 |
| 2026-10-19 | SKK | bullish | -21.3% | Stakk Extends Contract with Chime Financial to December 2027 |
| 2026-09-28 | MX1 | bullish | -9.1% | MX1 - DHS CT Baggage Scanner Contract Extension |

### L105 — Market-sensitive 'status unchanged' or 'remains unchanged' reassurance announcement at a junior developer or explorer with known operational risk in a frontier or elevated-risk jurisdiction, where the headline explicitly frames the filing as confirming continuity rather than announcing a positive development, and pre-announcement volume is suppressed (<0.5x average)

A market-sensitive reassurance filing ('export remains unchanged', 'licence remains in good standing') signals that a specific negative concern was live enough to require formal disclosure — the market-sensitive flag on a 'nothing has changed' announcement confirms the underlying risk is real and material, not hypothetical; before calling neutral, ask whether the reassurance filing implicitly acknowledges a known operational or regulatory threat that the market had not yet fully priced; if the filing confirms the threat exists but is currently contained, lean bearish rather than neutral, because the disclosure of the risk itself can catalyse selling by holders who were unaware of it.

_Seen 5×. First written 2026-09-30, last reinforced 2026-10-28._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-28 | CRD | neutral | -12.1% | Quarterly Activities Report & Appendix 5B - 2026 Q3 |
| 2026-09-30 | LIN | neutral | -19.4% | Kangankunde Concentrate Export Remains Unchanged |
| 2026-09-30 | LIN | neutral | -19.4% | Kangankunde Concentrate Export Remains Unchanged |
| 2026-09-30 | LIN | neutral | -19.4% | Kangankunde Concentrate Export Remains Unchanged |
| 2026-09-30 | LIN | neutral | -19.4% | Kangankunde Concentrate Export Remains Unchanged |

### L111 — Completion of a minimum holding buy-back announcement flagged market sensitive at a stock 80%+ below its 12-month high with near-zero median daily turnover and suppressed pre-announcement volume (<0.6x average)

A minimum holding buy-back completion, while procedurally administrative, has a specific positive mechanic at near-zero-liquidity micro-caps: it removes a known cohort of forced or reluctant small holders from the register, improving the quality of the remaining register and marginally reducing share count; at a near-zero-liquidity stock where the buy-back represents a meaningful percentage of the float, the register-cleaning effect can function as a floor-setting catalyst similar to L017's cessation logic — lean neutral-to-bullish rather than neutral when the filing is market-sensitive, the stock is severely de-rated, and the buy-back has fully completed.

_Seen 5×. First written 2026-10-01, last reinforced 2026-10-28._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-28 | EPY | neutral | +11.6% | Update - Notification of buy-back - EPY |
| 2026-10-01 | CLU | neutral | +10.3% | Completion of Minimum Holding Buy-Back |
| 2026-10-01 | CLU | neutral | +10.3% | Completion of Minimum Holding Buy-Back |
| 2026-10-01 | CLU | neutral | +10.3% | Completion of Minimum Holding Buy-Back |
| 2026-10-01 | CLU | neutral | +10.3% | Completion of Minimum Holding Buy-Back |

### L125 — Market-sensitive expert or specialist engagement announcement ('structural experts engaged', 'technical adviser appointed') at a junior explorer ahead of a drill programme, where no expert firm is named and no drill date or programme is disclosed in the headline

Engaging an unnamed expert is a preparatory activity statement, not a result or a funded commitment — it tells the market only that a service has been contracted, which is weaker than a drill start and weaker than a data result; before calling bullish on an expert-engagement headline, ask whether a named expert with a known track record is disclosed and whether a drill date or programme follows in the body; if neither is present, default to neutral rather than bullish, because the market-sensitive flag on a preparatory service engagement frequently overstates the informational content.

_Seen 5×. First written 2026-10-05, last reinforced 2026-10-20._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-20 | PMM | bullish | -12.7% | Pioneer Identifies Five Gold-Copper Targets at San Francisco |
| 2026-10-05 | CRR | bullish | -12.6% | Guiana Shield Structural Experts Engaged for Suriname Gold |
| 2026-10-05 | CRR | bullish | -12.6% | Guiana Shield Structural Experts Engaged for Suriname Gold |
| 2026-10-05 | CRR | bullish | -12.6% | Guiana Shield Structural Experts Engaged for Suriname Gold |
| 2026-10-05 | CRR | bullish | -12.6% | Guiana Shield Structural Experts Engaged for Suriname Gold |

### L129 — Non-flagged market-update announcement introducing a new named business line or product ('RideTour', 'Platform X') combined with pilot collaboration launches at a micro-cap technology or consumer company at a 3-month low, with no disclosed revenue, partner names, or financial terms, and suppressed pre-announcement volume (<0.5x)

A new named business line paired with 'pilot collaborations' is not a contractual or revenue event, but at a deeply de-rated micro-cap in a news-starved register even a qualitative operational signal can produce a sharp relief-buying move that a neutral call misses entirely. Before defaulting to neutral purely on the absence of a market-sensitive flag and undisclosed partner names, ask whether the company has been in a prolonged operational silence and whether the announcement represents the first evidence of commercial traction — if yes, lean neutral-to-bullish rather than neutral, because the bar for a positive surprise in a news-starved register is lower than the bar you are implicitly applying.

_Seen 5×. First written 2026-10-06, last reinforced 2026-10-14._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-14 | CP8 | bearish | +14.9% | OTC Company Presentation |
| 2026-10-06 | VMT | neutral | +16.8% | VMT Establishes RideTour and Launches Pilot Collaborations |
| 2026-10-06 | VMT | neutral | +16.8% | VMT Establishes RideTour and Launches Pilot Collaborations |
| 2026-10-06 | VMT | neutral | +16.8% | VMT Establishes RideTour and Launches Pilot Collaborations |
| 2026-10-06 | VMT | neutral | +16.8% | VMT Establishes RideTour and Launches Pilot Collaborations |

### L136 — Named project permitting update (titled '[Project Name] - Permitting Update' or '[Project Name] Area X Permitting Update') at a junior developer 60%+ below its 12-month high, NOT flagged market sensitive, where the headline specifies a permitting process milestone but does not use 'granted', 'approved', or 'issued' language

A permitting update without approval language is as likely to contain a delay, objection, or extension of the assessment timeline as a positive milestone — the absence of the market-sensitive flag at a stock this de-rated means the update does not confirm a gate has been passed; default to bearish rather than neutral when the headline names a permitting process step without confirmed approval language and the filing is unflagged, because the dominant reason to issue a non-flagged permitting update at a distressed stock is to manage expectations around a delay rather than to announce a grant.

_Seen 5×. First written 2026-10-07, last reinforced 2026-10-14._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-14 | PLC | neutral | -13.7% | Geo-Spectral Survey Commences at Abbotts Gold Project, WA |
| 2026-10-08 | HOR | neutral | -8.3% | DSO Sampling and Site Upgrades Advance Horseshoe Lights |
| 2026-10-07 | KRM | neutral | -9.4% | Penikat Project, Finland - Area 6 Permitting Update |
| 2026-10-07 | KRM | neutral | -9.4% | Penikat Project, Finland - Area 6 Permitting Update |
| 2026-10-07 | KRM | neutral | -9.4% | Penikat Project, Finland - Area 6 Permitting Update |

### L138 — Market-sensitive criminal complaint or civil legal action filing by a company against a named individual (insider, former officer, or contractor) at a stock deeply de-rated (>70% below 12-month high), where the complaint alleges fraud or misappropriation that is plausibly connected to the company's prior de-rating

A criminal complaint against a named alleged wrongdoer signals that management has concluded the harm is quantifiable and recoverable, and that the filing itself reframes the prior de-rating as caused by identified misconduct rather than structural business failure — lean neutral-to-bullish rather than neutral, because the narrative shift from 'the company failed' to 'the company was defrauded and is fighting back' is asymmetrically positive for a stock already priced for near-zero recovery.

_Seen 5×. First written 2026-10-08, last reinforced 2026-10-28._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-28 | ETM | bearish | +11.7% | Legal Update |
| 2026-10-08 | CLA | neutral | +15.1% | Filing of Criminal Complaint for Estafa Against E Chalmers |
| 2026-10-08 | CLA | neutral | +15.1% | Filing of Criminal Complaint for Estafa Against E Chalmers |
| 2026-10-08 | CLA | neutral | +15.1% | Filing of Criminal Complaint for Estafa Against E Chalmers |
| 2026-10-08 | CLA | neutral | +15.1% | Filing of Criminal Complaint for Estafa Against E Chalmers |

### L141 — Market-sensitive sampling commencement announcement (surface, soil, or channel) at a near-zero-liquidity junior explorer (median daily turnover effectively A$0/day) with below-average pre-announcement volume (<0.7x), stock 50%+ below its 12-month high

A market-sensitive sampling-commencement filing at a near-zero-liquidity stock with suppressed volume is not equivalent to L002's neutral programme-statement default — the market-sensitive flag signals management regards the specific programme as price-relevant (new target, re-started programme, or JV-triggered activity), and at near-zero absolute liquidity even a single informed buyer creates a disproportionate price move; lean neutral-to-bullish rather than neutral when the flag is present and the stock has near-zero liquidity with suppressed pre-announcement volume, because the sell-the-news risk is minimal and the flag implies substantive body content.

_Seen 5×. First written 2026-10-08, last reinforced 2026-10-14._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-14 | PLC | neutral | -13.7% | Geo-Spectral Survey Commences at Abbotts Gold Project, WA |
| 2026-10-14 | PLC | neutral | -13.7% | Geo-Spectral Survey Commences at Abbotts Gold Project, WA |
| 2026-10-08 | WYX | neutral | +15.1% | Sampling Commences at Gascoyne Gold Project |
| 2026-10-08 | WYX | neutral | +15.1% | Sampling Commences at Gascoyne Gold Project |
| 2026-10-08 | WYX | neutral | +15.1% | Sampling Commences at Gascoyne Gold Project |

### L150 — Generic 'Shareholder Update' headline (not flagged market sensitive, no named catalyst) at a stock at a 12-month low with near-zero absolute liquidity (median daily turnover <A$5,000/day) and no price action volume data to assess pre-announcement activity

A generic 'Shareholder Update' at a 12-month low without a market-sensitive flag is structurally more likely to contain negative operational or financial news than positive news — companies with genuinely positive developments headline the specific milestone rather than issuing a generic update, and a non-flagged generic update at a distressed, illiquid stock more commonly addresses underperformance, funding concerns, or operational setbacks; lean bearish rather than neutral when the headline is entirely generic, the stock is at a 12-month low, and the filing is not flagged market sensitive.

_Seen 5×. First written 2026-10-12, last reinforced 2026-10-22._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-22 | ODA | neutral | -13.4% | FY27 Q1 Investor Webinar Video |
| 2026-10-12 | TRU | neutral | -11.9% | Shareholder Update |
| 2026-10-12 | TRU | neutral | -11.9% | Shareholder Update |
| 2026-10-12 | TRU | neutral | -11.9% | Shareholder Update |
| 2026-10-12 | TRU | neutral | -11.9% | Shareholder Update |

### L152 — Named senior executive appointment at a stock 80%+ below its 12-month high with near-zero absolute liquidity (median daily turnover effectively A$0/day) and deeply suppressed pre-announcement volume (<0.1x average), where the appointee brings credentials from a named prior transaction (M&A, takeover, or development deal) that is publicly known and verifiable

When an appointee's credentials are tied to a specific named prior transaction that is publicly known (e.g. MOD Resources acquisition), the market can immediately verify the track record and attach a deal-optionality premium — treat this as a credible corporate-action signal rather than a generic board filing; lean neutral-to-bullish rather than neutral when the appointee's background implies a specific transaction type (M&A, asset sale, JV) and the stock is priced for near-zero recovery, because the appointment signals the company is pursuing that transaction type.

_Seen 5×. First written 2026-10-13, last reinforced 2026-10-20._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-20 | MCA | neutral | +8.0% | Initial Director's Interest Notice |
| 2026-10-20 | MCA | neutral | +8.0% | Initial Director's Interest Notice |
| 2026-10-13 | TXR | neutral | +20.0% | Talonx Appoints Former MOD Resources Executive Director |
| 2026-10-13 | TXR | neutral | +20.0% | Talonx Appoints Former MOD Resources Executive Director |
| 2026-10-13 | TXR | neutral | +20.0% | Talonx Appoints Former MOD Resources Executive Director |

### L163 — Named CFO or Company Secretary appointment at a near-zero-liquidity junior (median daily turnover <A$100/day) with suppressed pre-announcement volume (<0.5x average) and no price action indicating the stock is near a high

A CFO appointment at a near-zero-liquidity junior with suppressed volume is not a dilution signal — it is a governance-infrastructure step that the market may read as a precursor to a funded operational phase; before calling neutral, ask whether the appointee fills a gap that was a credible going-concern or compliance risk, and if so lean neutral-to-bullish rather than neutral, because the appointment removes an administrative overhang in a news-starved, illiquid register where even a small positive signal can produce a disproportionate price response.

_Seen 5×. First written 2026-10-14, last reinforced 2026-10-16._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-16 | DTZ | bearish | +22.5% | Change of CFO |
| 2026-10-16 | DTZ | bearish | +22.5% | Change of CFO |
| 2026-10-16 | DTZ | bearish | +22.5% | Change of CFO |
| 2026-10-16 | DTZ | bearish | +22.5% | Change of CFO |
| 2026-10-14 | TSR | neutral | -20.2% | Appointment of CFO and Company Secretary |

### L175 — 'Update — Proposed issue of securities' filing at a stock deeply de-rated (>70% below 12-month high), where the 'update' framing implies an amendment or extension to an existing proposed raise rather than a new raise announcement, and no companion cleansing notice or quotation application is filed on the same day

An 'Update' to a proposed securities issue at a deeply de-rated stock is structurally different from a new dilutive proposal — an amendment or extension often signals that the raise has found sufficient support to proceed on modified terms, which at a distressed micro-cap can be read as a funded-survival signal rather than a dilution escalation; before defaulting to bearish, ask whether the update implies the raise is closing rather than failing, and default to neutral rather than bearish when the update language implies progress toward completion rather than a new capital ask.

_Seen 5×. First written 2026-10-16, last reinforced 2026-10-20._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-20 | STV | bearish | +20.3% | Proposed issue of securities - STV |
| 2026-10-16 | WCE | bearish | +9.2% | Update - Proposed issue of securities - WCE |
| 2026-10-16 | WCE | bearish | +9.2% | Update - Proposed issue of securities - WCE |
| 2026-10-16 | WCE | bearish | +9.2% | Update - Proposed issue of securities - WCE |
| 2026-10-16 | WCE | bearish | +9.2% | Update - Proposed issue of securities - WCE |

### L209 — Market-sensitive earnings conference call presentation (not a results filing itself, but the presentation deck accompanying a named quarterly earnings call) at a company with no price action data available, where the filing is the collateral for an imminent live call rather than a standalone result

An earnings conference call presentation flagged market sensitive is a vehicle for guidance revision, not a result — before calling neutral, ask whether the presentation contains disclosed guidance metrics (production, revenue, cost) that can be benchmarked against prior consensus or management signals; if such metrics are present or strongly implied by the market-sensitive flag, apply L192-style asymmetric logic and default to bearish rather than neutral when no beat language appears in the headline, because guidance disappointments at covered companies are asymmetrically large relative to in-line results.

_Seen 5×. First written 2026-10-23, last reinforced 2026-10-29._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-29 | IDX | neutral | -15.2% | AGM - Chair & CEO Presentations |
| 2026-10-29 | IDX | neutral | -15.2% | AGM - Chair & CEO Presentations |
| 2026-10-23 | ALK | neutral | -10.9% | Q1 FY27 Earnings Conference Call Presentation |
| 2026-10-23 | ALK | neutral | -10.9% | Q1 FY27 Earnings Conference Call Presentation |
| 2026-10-23 | ALK | neutral | -10.9% | Q1 FY27 Earnings Conference Call Presentation |

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

### L036 — Supplementary JORC Table 1 filing (technical compliance document supporting a prior resource or exploration result) flagged market sensitive at a stock 50%+ below its 12-month high

A supplementary JORC Table 1 flagged as market sensitive is not merely an audit-trail filing — the market-sensitive designation signals that the underlying resource estimate it supports is itself a material new disclosure (maiden resource, significant upgrade) that may not have been fully absorbed when the primary announcement landed; do not call neutral on a market-sensitive Table 1 purely because it is labelled supplementary — treat it as confirmation that a substantive resource event has occurred and lean neutral-to-bullish when the stock is materially de-rated and the flag is present.

_Seen 4×. First written 2026-09-17, last reinforced 2026-09-17._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-17 | ERL | neutral | +10.7% | Supplementary Information - JORC Table 1 for Yuinmery |
| 2026-09-17 | ERL | neutral | +10.7% | Supplementary Information - JORC Table 1 for Yuinmery |
| 2026-09-17 | ERL | neutral | +10.7% | Supplementary Information - JORC Table 1 for Yuinmery |
| 2026-09-17 | ERL | neutral | +10.7% | Supplementary Information - JORC Table 1 for Yuinmery |

### L053 — Market-sensitive merger or 'join forces' announcement between two named companies where the structure involves combining equity (merger rather than acquisition), stock of the announcing party is near a multi-month high on elevated volume (>1.5x), and consideration terms (exchange ratio, premium) are absent from the headline

Apply L024's logic symmetrically to merger announcements: when a merger is announced without disclosed exchange ratio or consideration at a stock near its high on elevated volume, the market will immediately price worst-case dilution for the announcing party's shareholders; call bearish rather than bullish when terms are absent, the stock is extended, and the structure implies scrip issuance — strategic upside is not quantifiable but dilution risk is immediately visible.

_Seen 4×. First written 2026-09-21, last reinforced 2026-09-21._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-21 | TLX | bullish | -11.7% | Telix and ITM Join Forces to Create Radiopharma Powerhouse |
| 2026-09-21 | TLX | bullish | -11.7% | Telix and ITM Join Forces to Create Radiopharma Powerhouse |
| 2026-09-21 | TLX | bullish | -11.7% | Telix and ITM Join Forces to Create Radiopharma Powerhouse |
| 2026-09-21 | TLX | bullish | -11.7% | Telix and ITM Join Forces to Create Radiopharma Powerhouse |

### L061 — Board structure change announcement (not flagged market sensitive, no named appointments or departures in headline) at a stock 60%+ below its 12-month high with no volume data indicating elevated activity

A generic 'Change in Board Structure' headline at a deeply de-rated micro-cap, even without named individuals or a market-sensitive flag, should not default to neutral — parse whether the headline implies a net reduction in board size (consolidation of authority, cost-cutting signal) or the departure of a named executive, both of which at a distressed company are incrementally bearish; lean bearish rather than neutral when the headline implies simplification or departure rather than addition, because at a deeply de-rated stock board shrinkage typically signals managed wind-down or cost-preservation rather than strategic renewal.

_Seen 4×. First written 2026-09-21, last reinforced 2026-10-15._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-15 | AMS | neutral | +11.2% | Jeromy Young to retire from Atomos Board |
| 2026-10-05 | AHN | neutral | -10.2% | Annual General Meeting Information |
| 2026-09-21 | RLF | neutral | -12.5% | Change in Board Structure |
| 2026-09-21 | RLF | neutral | -12.5% | Change in Board Structure |

### L064 — Market-sensitive announcement that a specific quantum of previously restricted or escrowed capital has been unlocked (not a new raise, not an asset sale) at a deeply de-rated micro-cap (>60% below 12-month high) with near-zero median daily turnover, where the unlocked amount is material relative to the implied market capitalisation

Unlocking restricted capital is a liquidity event that removes a specific constraint without the dilution of a new placement — when the quantum is material relative to the company's implied market cap and the stock is already severely de-rated, the market-sensitive flag signals that the cash accretion per share is the moving part; lean neutral-to-bullish rather than neutral, because restricted-capital releases are not dilutive and can represent a meaningful funded-runway extension at a company priced for near-insolvency.

_Seen 4×. First written 2026-09-22, last reinforced 2026-09-22._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-22 | CTN | neutral | +8.6% | $1.29M in Restricted Capital Unlocked |
| 2026-09-22 | CTN | neutral | +8.6% | $1.29M in Restricted Capital Unlocked |
| 2026-09-22 | CTN | neutral | +8.6% | $1.29M in Restricted Capital Unlocked |
| 2026-09-22 | CTN | neutral | +8.6% | $1.29M in Restricted Capital Unlocked |

### L068 — Positive operational result (water drilling, soil sampling, geophysical survey) flagged market sensitive at a junior resources company, where the result de-risks a specific project constraint (water access, site accessibility) but does not directly address mineralisation grade, resource tonnage, or project economics, and the stock has already closed above its 60-day high on extreme relative volume on the day of or prior to the announcement

Before calling bullish on an infrastructure or operational de-risking result (water drilling, road access, power connection), ask whether the result advances the economic value of the project directly or merely removes a prerequisite constraint — a positive water result confirms the mine can be built but does not confirm it should be built; when the stock has already moved above a multi-month technical high on extreme volume ahead of the announcement, the result is largely priced and the correct call is neutral rather than bullish, because the market has already re-rated on the anticipation and the result delivers no grade or economic data to sustain the move.

_Seen 4×. First written 2026-09-23, last reinforced 2026-09-23._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-23 | NYM | bullish | -10.6% | PTR: Rosewood Positive Water Drilling Results |
| 2026-09-23 | NYM | bullish | -10.6% | PTR: Rosewood Positive Water Drilling Results |
| 2026-09-23 | NYM | bullish | -10.6% | PTR: Rosewood Positive Water Drilling Results |
| 2026-09-23 | NYM | bullish | -10.6% | PTR: Rosewood Positive Water Drilling Results |

### L070 — 'Funding Secured' announcement flagged market sensitive at a project-stage company with no price action data available and no companion 'Proposed Issue of Securities' filing visible at the time of classification, where the funding structure (equity vs. debt vs. grant) is unconfirmed in the headline

Before calling bullish on a 'Funding Secured' headline, confirm the funding structure — equity funding at a distressed company almost always involves a discount placement that generates immediate sell-the-raise pressure, and 'funding secured' language is equally consistent with a discounted equity raise as with non-dilutive debt or grant; when no companion 'Proposed Issue of Securities' filing is yet visible but one is flagged as expected on the same day, default to neutral rather than bullish until the structure is confirmed, because the dilution scenario is as probable as the non-dilutive scenario from the headline alone.

_Seen 4×. First written 2026-09-23, last reinforced 2026-09-23._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-23 | VBX | bullish | -9.8% | Funding Secured to Maintain Wuudagu Momentum |
| 2026-09-23 | VBX | bullish | -9.8% | Funding Secured to Maintain Wuudagu Momentum |
| 2026-09-23 | VBX | bullish | -9.8% | Funding Secured to Maintain Wuudagu Momentum |
| 2026-09-23 | VBX | bullish | -9.8% | Funding Secured to Maintain Wuudagu Momentum |

### L071 — Named gold (or base metal) discovery update headlined as both 'drilling and assay update' at a junior explorer 60%+ below its 12-month high, with 5-day volume running >2x average, where the headline explicitly names a discovery (not merely a programme) and pairs drilling with assay data in a single release

When the headline names a specific discovery and bundles assay data with drilling in the same release, this is not a pure extension result under L018 — the discovery framing implies grade data is present that may justify the pre-positioning; do not default to neutral purely on the elevated-volume sell-the-news logic when the headline signals both discovery-level branding and assay content, because the grade data embedded in the filing may be sufficient to sustain or extend the re-rating; lean neutral-to-bullish rather than neutral, and reserve the L018 bearish call for extension-only headlines that lack discovery language.

_Seen 4×. First written 2026-09-23, last reinforced 2026-09-24._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-24 | BMR | bearish | +9.1% | Torpys High-Grade Mineralisation Extends Towards Surface |
| 2026-09-23 | MEU | neutral | +12.1% | Greenewood gold discovery - drilling and assay update |
| 2026-09-23 | MEU | neutral | +12.1% | Greenewood gold discovery - drilling and assay update |
| 2026-09-23 | MEU | neutral | +12.1% | Greenewood gold discovery - drilling and assay update |

### L077 — Market-sensitive announcement combining a cost-reduction action with a capital structure simplification at a stock 70%+ below its 12-month high, where the headline uses both 'lowers cost base' and 'simplifies capital structure' language without disclosing specific quantum or counterparty

A dual cost-and-capital-structure announcement at a deeply distressed stock without disclosed quantum is a survival-management filing, not a value-creation event — the absence of specific numbers (savings quantum, debt reduced, obligations extinguished) means the market cannot size the benefit and will default to reading it as distress signalling; lean bearish rather than neutral when the headline combines cost and capital actions without disclosing specific numeric outcomes, because the filing confirms the company is in triage mode and the quantum uncertainty prevents any positive re-rating.

_Seen 4×. First written 2026-09-24, last reinforced 2026-09-24._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-24 | HYT | neutral | -13.6% | HyTerra Lowers Cost Base and Simplifies Capital Structure |
| 2026-09-24 | HYT | neutral | -13.6% | HyTerra Lowers Cost Base and Simplifies Capital Structure |
| 2026-09-24 | HYT | neutral | -13.6% | HyTerra Lowers Cost Base and Simplifies Capital Structure |
| 2026-09-24 | HYT | neutral | -13.6% | HyTerra Lowers Cost Base and Simplifies Capital Structure |

### L078 — Market-sensitive 'Transaction Process Deed update' combined with forward earnings guidance (e.g. 'FY27 outlook') at a stock with elevated recent volume (>1.5x average), where the transaction process has been publicly known for multiple months and the guidance component introduces a new positive earnings anchor independent of the deal outcome

When a transaction-process update is bundled with forward earnings guidance, parse the two components independently — if the guidance component introduces a credible new positive earnings anchor (e.g. specific revenue or margin targets not previously disclosed) that stands alone regardless of deal outcome, the guidance is the market-moving element, not the transaction uncertainty; do not allow the 'mixed message' transaction narrative to override a clearly positive standalone guidance disclosure; lean bullish rather than bearish when the guidance is specific and new, even if the transaction language is ambiguous.

_Seen 4×. First written 2026-09-24, last reinforced 2026-09-24._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-24 | OFX | bearish | +11.6% | Update on the Transaction Process Deed and FY27 outlook |
| 2026-09-24 | OFX | bearish | +11.6% | Update on the Transaction Process Deed and FY27 outlook |
| 2026-09-24 | OFX | bearish | +11.6% | Update on the Transaction Process Deed and FY27 outlook |
| 2026-09-24 | OFX | bearish | +11.6% | Update on the Transaction Process Deed and FY27 outlook |

### L084 — Market-sensitive M&A response filing (e.g. 'Response to Bidder's Statement') at a takeover target, where the headline does not disclose the board's recommendation direction but the filing type itself (a formal Bidder's Statement response) implies a recommendation is contained within

A formal 'Response to Bidder's Statement' is not directionally neutral — under ASX and Corporations Act requirements, a target board must include a recommendation; the filing type itself guarantees a recommendation is present in the document body, making this a bullish signal when a bid premium exists and the stock has been trading below the bid price; default to bullish rather than neutral, because the base rate for target boards recommending acceptance or seeking a higher offer is materially higher than for outright rejection, and the bid price itself sets a hard floor that limits downside.

_Seen 4×. First written 2026-09-25, last reinforced 2026-09-25._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-25 | RCT | neutral | +29.1% | Response to Iris Bidder's Statement |
| 2026-09-25 | RCT | neutral | +29.1% | Response to Iris Bidder's Statement |
| 2026-09-25 | RCT | neutral | +29.1% | Response to Iris Bidder's Statement |
| 2026-09-25 | RCT | neutral | +29.1% | Response to Iris Bidder's Statement |

### L101 — Drilling programme scale-up announcement ('programme doubled', 'holes added') combined with an explicit near-term results signpost ('results near', 'assays imminent') at a stock near a multi-month high, where no assay data is yet disclosed

A programme doubling signals genuine management conviction in the geology and functions as a forward credibility statement, while 'results near' language converts the filing from a pure programme statement into a pre-results catalyst notice — together these two elements are stronger than either alone; do not apply L002's neutral default when the headline combines a scale-up with an explicit near-term results signpost, because the market reads the combination as management telegraphing confidence in forthcoming data; lean neutral-to-bullish rather than neutral in this configuration.

_Seen 4×. First written 2026-09-29, last reinforced 2026-09-29._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-29 | QML | neutral | +10.8% | Drilling Program Doubled as Mt Chalmers Barge Results Near |
| 2026-09-29 | QML | neutral | +10.8% | Drilling Program Doubled as Mt Chalmers Barge Results Near |
| 2026-09-29 | QML | neutral | +10.8% | Drilling Program Doubled as Mt Chalmers Barge Results Near |
| 2026-09-29 | QML | neutral | +10.8% | Drilling Program Doubled as Mt Chalmers Barge Results Near |

### L103 — Annual Mineral Resource and Ore Reserve Statement filed as market-sensitive by a gold producer that is deeply de-rated (>50% below 12-month high), where the filing is the company's primary annual resource update and the market-sensitive flag confirms the exchange views the content as price-relevant

An annual resource and reserve statement flagged market sensitive is not directionally ambiguous in the same way as a generic project update — the market-sensitive designation on a scheduled annual filing means the numbers have moved materially relative to the prior year; at a deeply de-rated gold producer where the bear case is largely priced, the asymmetry favours upside (an upgrade re-rates; a modest depletion is already priced); lean neutral-to-bullish rather than neutral when the filing is market-sensitive, the stock is severely de-rated, and the gold price environment is supportive, because the flag signals the resource has moved in a direction management deems reportable.

_Seen 4×. First written 2026-09-29, last reinforced 2026-09-29._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-29 | PNR | neutral | +6.0% | Annual Mineral Resource & Ore Reserve Statement |
| 2026-09-29 | PNR | neutral | +6.0% | Annual Mineral Resource & Ore Reserve Statement |
| 2026-09-29 | PNR | neutral | +6.0% | Annual Mineral Resource & Ore Reserve Statement |
| 2026-09-29 | PNR | neutral | +6.0% | Annual Mineral Resource & Ore Reserve Statement |

### L106 — Operational continuity or site-tenure announcement (lease extension, licence renewal, access agreement) for a junior with operations in Southeast Asia or a similar emerging-market jurisdiction, not flagged market sensitive, where the site is the company's primary or only named operational asset and no financial terms are disclosed

A lease or site-tenure extension for the primary operational asset of a thinly covered junior can function as an unexpected positive catalyst in a news-starved register — the 'so what' is not valuation re-rating but elimination of a previously unquantified tenure risk that may have been quietly suppressing the price; before calling neutral on a site-tenure filing, ask whether tenure uncertainty was a plausible latent overhang on the stock; if yes, lean neutral-to-bullish rather than neutral, because tenure removal is an asymmetric positive for a company whose only asset was at risk.

_Seen 4×. First written 2026-09-30, last reinforced 2026-09-30._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-30 | OSS | neutral | +15.8% | Three-Year Extension of Takalar Site Lease |
| 2026-09-30 | OSS | neutral | +15.8% | Three-Year Extension of Takalar Site Lease |
| 2026-09-30 | OSS | neutral | +15.8% | Three-Year Extension of Takalar Site Lease |
| 2026-09-30 | OSS | neutral | +15.8% | Three-Year Extension of Takalar Site Lease |

### L110 — Market-sensitive announcement of a new physical commercial presence (representative office, branch, JV office) in a high-value licensing or partnering jurisdiction (e.g. China, US, EU) by a pre-revenue biotech or technology company that is 50%+ below its 12-month high and near-zero liquidity

A market-sensitive office-opening in a named high-value jurisdiction for a pre-revenue biotech or technology company is not merely administrative — management and their advisers have assessed the physical presence as price-relevant, which implies either an imminent named partnership is being shepherded or the jurisdiction's commercial significance is itself the catalyst; lean neutral-to-bullish rather than neutral when the market-sensitive flag is present and the jurisdiction is a known licensing or partnering hub for the company's technology, because the flag signals the office is a commercial milestone rather than a back-office function.

_Seen 4×. First written 2026-10-01, last reinforced 2026-10-01._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-01 | 1AD | neutral | +16.3% | China Representative Office opens |
| 2026-10-01 | 1AD | neutral | +16.3% | China Representative Office opens |
| 2026-10-01 | 1AD | neutral | +16.3% | China Representative Office opens |
| 2026-10-01 | 1AD | neutral | +16.3% | China Representative Office opens |

### L112 — Change in substantial holding (direction ambiguous, not 'becoming') at a stock 60%+ below its 12-month high with 5-day volume running >2x average, where the stock is a named consumer-facing brand or retail business (not a junior explorer) and the de-rating reflects sector or macro headwinds rather than a company-specific operational failure

At a deeply de-rated consumer or retail company with elevated volume into an ambiguous substantial-holder change, the base rate for the change being accumulation by a value or activist buyer is materially higher than at a distressed micro-cap explorer — the de-rating reflects cyclical rather than terminal risk and the elevated volume is more likely informed buying than distribution; lean neutral-to-bullish rather than purely neutral, and require confirmation of a reduction before calling bearish.

_Seen 4×. First written 2026-10-01, last reinforced 2026-10-05._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-05 | RLF | neutral | +10.7% | Form 604 Change in Substantial Shareholding |
| 2026-10-01 | CTT | neutral | +21.1% | Change in substantial holding |
| 2026-10-01 | CTT | neutral | +21.1% | Change in substantial holding |
| 2026-10-01 | CTT | neutral | +21.1% | Change in substantial holding |

### L113 — Market-sensitive targeting announcement ('Large-Scale [System Type] Target at [Named Location]') at a junior explorer at a 12-month low with below-average pre-announcement volume (<0.6x), where the target is characterised by a named, globally recognised deposit-type descriptor (e.g. MVT, IOCG, Carlin, VMS) that implies potential scale

A market-sensitive filing that names a specific large-scale deposit system type (not merely 'anomaly' or 'zone') is a substantive geological claim — the deposit-type descriptor conveys implicit scale and economic analogue information that a generic target announcement does not; when volume is suppressed (no sell-the-news risk) and the stock is at a 12-month low, lean neutral-to-bullish rather than neutral, because the named system type is the market-moving information layer.

_Seen 4×. First written 2026-10-01, last reinforced 2026-10-20._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-20 | PMM | bullish | -12.7% | Pioneer Identifies Five Gold-Copper Targets at San Francisco |
| 2026-10-01 | DLY | neutral | +14.5% | Large-Scale MVT Zn-Pb Target at Box Hole, Huckitta Project |
| 2026-10-01 | DLY | neutral | +14.5% | Large-Scale MVT Zn-Pb Target at Box Hole, Huckitta Project |
| 2026-10-01 | DLY | neutral | +14.5% | Large-Scale MVT Zn-Pb Target at Box Hole, Huckitta Project |

### L115 — Retail investor Q&A call advisory (date-setting notice, not flagged market sensitive, no operational content in headline) at a deeply de-rated junior or developer (60%+ below 12-month high) with below-average pre-announcement volume

A retail investor Q&A call advisory at a deeply de-rated, news-starved micro-cap can itself function as a sentiment catalyst independent of its content — the act of management scheduling a direct engagement signals operational confidence and can trigger accumulation by retail holders who interpret the call as a precursor to a positive update; before defaulting to neutral on an advisory-only filing, ask whether the company has been in a prolonged communications silence and whether the Q&A call represents a resumption of engagement that a distressed register treats as a floor signal; lean neutral-to-bullish rather than neutral when the de-rating exceeds 60% and the company has been communication-silent.

_Seen 4×. First written 2026-10-01, last reinforced 2026-10-26._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-26 | TG1 | neutral | +14.1% | El Donna RC Drilling Advancement |
| 2026-10-01 | LMG | neutral | +8.7% | Retail Investor Q&A Call Advisory 9 October 2026 |
| 2026-10-01 | LMG | neutral | +8.7% | Retail Investor Q&A Call Advisory 9 October 2026 |
| 2026-10-01 | OSS | neutral | +16.3% | Development Plan for Takalar Seaweed Innovation Centre |
| 2026-10-01 | LMG | neutral | +8.7% | Retail Investor Q&A Call Advisory 9 October 2026 |

### L118 — Dispatch of renounceable rights issue documents at a junior or small-cap, not flagged market sensitive, with no price action data available, where the offer period has just commenced and take-up risk is the dominant near-term uncertainty

A renounceable rights issue dispatch marks the point at which the offer is fully live and the market begins pricing take-up risk in real time — if the stock trades at or below the offer price during the offer period, the rights become worthless and the raise fails or requires sub-underwriting at a discount; treat dispatch as a bearish event rather than neutral when no price action data is available to confirm the stock is trading comfortably above the offer price, because the launch of the rights-trading window itself introduces a mechanical sell signal for holders who choose to sell entitlements rather than subscribe.

_Seen 4×. First written 2026-10-02, last reinforced 2026-10-02._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-02 | FG1 | neutral | -19.5% | Dispatch of Renounceable Rights Issue Documents |
| 2026-10-02 | FG1 | neutral | -19.5% | Dispatch of Renounceable Rights Issue Documents |
| 2026-10-02 | FG1 | neutral | -19.5% | Dispatch of Renounceable Rights Issue Documents |
| 2026-10-02 | FG1 | neutral | -19.5% | Dispatch of Renounceable Rights Issue Documents |

### L119 — Market-sensitive legal or regulatory decision announcement (court ruling, tribunal decision, government determination) at a junior resources company with operations in a named foreign jurisdiction, where the decision direction (favourable vs. adverse) is not disclosed in the headline and pre-announcement volume is near-zero

A court or regulatory decision flagged market sensitive is not directionally neutral — the market-sensitive designation confirms the outcome is material, and the absence of positive framing in the headline ('DPM Announces Constitutional Court Decision' rather than 'DPM Wins Constitutional Court Ruling') is itself a negative signal; when the headline names a legal decision without signalling a favourable outcome, default to bearish rather than neutral, because issuers with genuinely positive rulings almost always frame the headline constructively, and a neutral framing implies the result is adverse or ambiguous.

_Seen 4×. First written 2026-10-02, last reinforced 2026-10-02._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-02 | DPM | neutral | -10.6% | DPM Announces Constitutional Court of BiH Decision |
| 2026-10-02 | DPM | neutral | -10.6% | DPM Announces Constitutional Court of BiH Decision |
| 2026-10-02 | DPM | neutral | -10.6% | DPM Announces Constitutional Court of BiH Decision |
| 2026-10-02 | DPM | neutral | -10.6% | DPM Announces Constitutional Court of BiH Decision |

### L123 — Named regulatory milestone (e.g. JDC approval, FDA milestone) for a named compound at a pre-revenue biotech 50%+ below its 12-month high, not flagged market sensitive, where the milestone is a process checkpoint rather than a pivotal clinical or approval outcome

Before calling bullish on a named regulatory milestone, ask whether the milestone is a gating process event (a scheduled checkpoint within a development plan, often linked to staged payments) rather than a pivotal efficacy or safety readout — process milestones confirm the programme is on track but do not de-risk the primary clinical hypothesis; when the announcement is not market-sensitive and the milestone is procedural rather than pivotal, default to neutral rather than bullish, because the market has already priced on-track probability and the milestone delivers no new clinical signal.

_Seen 4×. First written 2026-10-05, last reinforced 2026-10-05._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-05 | 1AD | bullish | -25.1% | EW-001 JDC milestone approvals |
| 2026-10-05 | 1AD | bullish | -25.1% | EW-001 JDC milestone approvals |
| 2026-10-05 | 1AD | bullish | -25.1% | EW-001 JDC milestone approvals |
| 2026-10-05 | 1AD | bullish | -25.1% | EW-001 JDC milestone approvals |

### L127 — EPA or equivalent environmental regulator referral announcement (flagged market sensitive) at a junior developer, where the referral initiates a formal environmental impact assessment process rather than completing one, and the project is in a jurisdiction with a known history of lengthy or contested EIA processes

An EPA referral opens an assessment process whose outcome and timeline are entirely uncertain and potentially years away — it is a necessary but not sufficient step, and the market-sensitive flag reflects procedural significance rather than value creation; default to bearish rather than neutral when the referral initiates rather than concludes the regulatory process, because the filing confirms the project is entering a prolonged uncertainty window rather than exiting one, and investors who were holding in anticipation of a near-term development decision will re-price to reflect the extended timeline.

_Seen 4×. First written 2026-10-05, last reinforced 2026-10-07._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-07 | KRM | neutral | -9.4% | Penikat Project, Finland - Area 6 Permitting Update |
| 2026-10-05 | BRU | neutral | -7.2% | Buru refers the Rafael Project to the EPA WA |
| 2026-10-05 | BRU | neutral | -7.2% | Buru refers the Rafael Project to the EPA WA |
| 2026-10-05 | BRU | neutral | -7.2% | Buru refers the Rafael Project to the EPA WA |

### L130 — Market-sensitive 'Record Cash Generation' or equivalent operational-beat headline at a tungsten, specialty-metals, or niche commodity producer where the commodity price has recently deteriorated or where the 'record' metric is relative to a prior low base, with pre-announcement volume materially below average (<0.5x)

Before calling bullish on a 'record cash generation' headline at a niche commodity producer, ask whether the record is set against a prior depressed baseline (e.g., post-restart, post-ramp) rather than against steady-state operations — a record from a low base does not confirm structural margin improvement and the market may already have priced the operational recovery; additionally check whether the commodity price has deteriorated since the cash-generation period ended, which would make the historical cash figure backward-looking and non-representative of forward economics; if either condition holds, default to neutral rather than bullish.

_Seen 4×. First written 2026-10-06, last reinforced 2026-10-06._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-06 | EQR | bullish | -12.0% | Record Cash Generation on Higher Production |
| 2026-10-06 | EQR | bullish | -12.0% | Record Cash Generation on Higher Production |
| 2026-10-06 | BUR | bullish | -17.2% | Cane Bore Assays Confirm CID Iron Mineralisation at North an |
| 2026-10-06 | EQR | bullish | -12.0% | Record Cash Generation on Higher Production |
| 2026-10-06 | WMG | neutral | -13.1% | Final Phase 5 RC Assay Results from Mulga Tank |

### L133 — Market-sensitive tenant administration or insolvency update filed by a listed REIT, where the REIT has disclosed step-in rights, alternative operator arrangements, or security deposits in prior filings, and the administration involves a named tenant operating in a sector with multiple qualified operators (e.g. childcare)

Before calling bearish on a tenant-administration announcement at a REIT, ask whether the sector has a deep pool of alternative operators and whether the REIT's lease structures include protective mechanisms (step-in rights, government-backed tenancy, security bonds) that limit income disruption — in childcare and similar regulated sectors, administrators typically continue operations and REITs recover quickly via operator substitution; default to neutral rather than bearish when these structural protections are plausible from the REIT's known portfolio type.

_Seen 4×. First written 2026-10-07, last reinforced 2026-10-07._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-07 | ARF | bearish | +13.1% | Edge Early Learning Administration Update |
| 2026-10-07 | ARF | bearish | +13.1% | Edge Early Learning Administration Update |
| 2026-10-07 | ARF | bearish | +13.1% | Edge Early Learning Administration Update |
| 2026-10-07 | ARF | bearish | +13.1% | Edge Early Learning Administration Update |

### L134 — Market-sensitive third-party transaction announcement (named major counterparty reporting a transaction) involving infrastructure that is critical to the announcing company's operations (concentrator, port, pipeline, refinery), where the announcing company is a small dependent user of that infrastructure and pre-announcement volume is below average

When a major infrastructure owner (e.g. BHP) announces a transaction involving a facility that a junior depends on for processing or offtake, the junior's market-sensitive filing should be read through the lens of 'does this transaction secure or threaten infrastructure access?' — a sale to a continuing operator or a capacity-securing deal is a positive resolution of an overhang that was quietly suppressing the junior's valuation; before calling neutral, ask whether the prior uncertainty about infrastructure continuity was a latent negative that the transaction now resolves, and lean neutral-to-bullish when the transaction appears to confirm operational continuity for the dependent junior.

_Seen 4×. First written 2026-10-07, last reinforced 2026-10-07._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-07 | LM8 | neutral | +11.8% | BHP Reports Kambalda Nickel Concentrator Transaction |
| 2026-10-07 | LM8 | neutral | +11.8% | BHP Reports Kambalda Nickel Concentrator Transaction |
| 2026-10-07 | LM8 | neutral | +11.8% | BHP Reports Kambalda Nickel Concentrator Transaction |
| 2026-10-07 | LM8 | neutral | +11.8% | BHP Reports Kambalda Nickel Concentrator Transaction |

### L140 — Appointment of a named financial adviser announced (not flagged market sensitive) at a stock at or near a multi-month low with volume running >1.5x average, where the adviser role is not specified as a capital raise mandate

A financial adviser appointment into above-average volume at a depressed stock is a pre-transaction signal that corporate value-crystallisation activity (asset sale, merger, or strategic review) is being formally structured — the adviser appointment is the public confirmation that a process is live; lean bullish rather than neutral when volume is elevated and the stock is at a multi-month low, because the base rate for adviser appointments at distressed companies is weighted toward value-realisation transactions rather than dilutive raises, and the elevated volume suggests informed positioning ahead of an anticipated announcement.

_Seen 4×. First written 2026-10-08, last reinforced 2026-10-08._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-08 | CUF | neutral | +7.2% | Appointment of Financial Adviser |
| 2026-10-08 | CUF | neutral | +7.2% | Appointment of Financial Adviser |
| 2026-10-08 | CUF | neutral | +7.2% | Appointment of Financial Adviser |
| 2026-10-08 | CUF | neutral | +7.2% | Appointment of Financial Adviser |

### L143 — Share Purchase Plan completion announcement (titled '[Company] Share Purchase Plan Completes' or equivalent) at a uranium developer or thematic-sector junior, not flagged market sensitive, with no price action data available

An SPP completion crystallises dilution at the exact moment the offer closes — any overhang uncertainty during the open period resolves into confirmed new supply hitting the register simultaneously; before calling neutral on SPP completion, ask whether the raise quantum is likely to have been scaled back (indicating weak demand) or fully subscribed, because a scaled-back SPP at a uranium developer signals insufficient retail conviction and the completion announcement itself is the moment sellers who had been waiting for the close begin to exit; default to bearish rather than neutral when no price action data is available to confirm the stock held above the SPP offer price during the offer period, because a SPP completion without market-sensitive flagging and without disclosed full-subscription confirmation more commonly reflects a partially filled raise that removes the bullish optionality without adding the funded-catalyst signal.

_Seen 4×. First written 2026-10-09, last reinforced 2026-10-09._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-09 | BMN | neutral | -8.0% | Share Purchase Plan Completes |
| 2026-10-09 | BMN | neutral | -8.0% | Share Purchase Plan Completes |
| 2026-10-09 | BMN | neutral | -8.0% | Share Purchase Plan Completes |
| 2026-10-09 | BMN | neutral | -8.0% | Share Purchase Plan Completes |

### L149 — Market-sensitive resource estimate upgrade ('X% Increase to MRE') headlined with an 'Amended' suffix, at a junior explorer with no price action data available, where the amendment qualifier indicates a correction to a prior release

The 'Amended' suffix on a resource upgrade is not cosmetic — it signals the original release contained an error material enough to require a formal correction, which the market reads as a governance and technical credibility concern that offsets the upgrade itself; before calling bullish on an amended resource announcement, ask whether the amendment narrows, restates, or introduces uncertainty into the headline metric, and if so default to neutral rather than bullish, because the correction disclosure can dominate the upgrade signal in an environment where junior explorers are held to high data-quality standards.

_Seen 4×. First written 2026-10-12, last reinforced 2026-10-12._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-12 | CPN | bullish | -20.0% | 45% Increase to MRE at Kelpie Tin Deposit - Amended |
| 2026-10-12 | CPN | bullish | -20.0% | 45% Increase to MRE at Kelpie Tin Deposit - Amended |
| 2026-10-12 | CPN | bullish | -20.0% | 45% Increase to MRE at Kelpie Tin Deposit - Amended |
| 2026-10-12 | CPN | bullish | -20.0% | 45% Increase to MRE at Kelpie Tin Deposit - Amended |

### L157 — SPP closing date reminder filing at a stock 60%+ below its 12-month high with volume running above average (>1.5x), where the reminder itself is the primary filing and no new financial terms are disclosed

An SPP closing date reminder into elevated volume at a deeply de-rated stock is a distribution signal, not a neutral administrative notice — holders who have decided not to subscribe are selling their positions ahead of the close rather than participating, and the elevated volume confirms exit activity rather than accumulation; lean bearish rather than neutral when volume is elevated into an SPP reminder at a distressed stock.

_Seen 4×. First written 2026-10-14, last reinforced 2026-10-14._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-14 | PV1 | neutral | -19.4% | SPP Closing Date Reminder |
| 2026-10-14 | PV1 | neutral | -19.4% | SPP Closing Date Reminder |
| 2026-10-14 | PV1 | neutral | -19.4% | SPP Closing Date Reminder |
| 2026-10-14 | PV1 | neutral | -19.4% | SPP Closing Date Reminder |

### L158 — Application for quotation of securities at a medical technology or life sciences company (not a junior resources explorer) that is 80%+ below its 12-month high, where the filing coincides with suppressed pre-announcement volume and no companion capital raise announcement is visible on the same day

For medical technology companies, a quotation application at extreme de-rating levels may reflect completion of a strategic or milestone-linked raise rather than a generic dilutive placement — before defaulting to neutral, ask whether the company has a named near-term clinical or regulatory catalyst that the new capital directly enables; if a specific catalyst is identifiable from prior announcements, lean neutral-to-bullish rather than neutral, because the funded-catalyst logic applies to med-tech companies at least as strongly as to thematic resource juniors.

_Seen 4×. First written 2026-10-14, last reinforced 2026-10-14._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-14 | IPD | neutral | +17.3% | Application for quotation of securities - IPD |
| 2026-10-14 | PER | neutral | -24.4% | Application for quotation of securities - PER |
| 2026-10-14 | IPD | neutral | +17.3% | Application for quotation of securities - IPD |
| 2026-10-14 | PER | neutral | -24.4% | Application for quotation of securities - PER |
| 2026-10-14 | IPD | neutral | +17.3% | Application for quotation of securities - IPD |

### L159 — Commercial negotiations update on a named M&A or strategic transaction (not flagged market sensitive) at a stock 50%+ below its 12-month high, where the filing explicitly names an ongoing negotiation rather than announcing a binding outcome

A named negotiations update at a deeply de-rated stock — even without a binding outcome — confirms the deal process is live and that both parties have engaged sufficiently to warrant public disclosure; before calling neutral on the grounds of outcome ambiguity, ask whether the mere confirmation of active negotiation is itself the re-rating catalyst for a stock that had been pricing deal-collapse risk; lean neutral-to-bullish rather than neutral when the update confirms continued engagement on a transaction whose collapse was plausibly priced in, because the continuation news reduces the probability of the bear case the market had been discounting.

_Seen 4×. First written 2026-10-14, last reinforced 2026-10-14._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-14 | ASB | neutral | +10.8% | Commercial negotiations update in proposed AUSA Transaction |
| 2026-10-14 | ASB | neutral | +10.8% | Commercial negotiations update in proposed AUSA Transaction |
| 2026-10-14 | ASB | neutral | +10.8% | Commercial negotiations update in proposed AUSA Transaction |
| 2026-10-14 | ASB | neutral | +10.8% | Commercial negotiations update in proposed AUSA Transaction |

### L165 — Named production record (e.g. '100,000oz Ag production record', 'record quarterly output') at a single-commodity producer 50%+ below its 12-month high, where the record is the headline milestone but no realised price, cash cost, or cash flow figure is disclosed alongside it

Before calling bullish on a production record at a deeply de-rated producer, ask whether the record translates into economic value at current commodity prices — a volume record at a below-breakeven realised price is not a re-rating catalyst; require disclosure of cash cost per unit or operating cash flow alongside the production figure before calling bullish, and default to neutral when only the production quantum is named.

_Seen 4×. First written 2026-10-15, last reinforced 2026-10-15._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-15 | BHM | bullish | -12.4% | Sept Qtr Delivers Milestone & 100,000oz Ag Production Record |
| 2026-10-15 | BHM | bullish | -12.4% | Sept Qtr Delivers Milestone & 100,000oz Ag Production Record |
| 2026-10-15 | BHM | bullish | -12.4% | Sept Qtr Delivers Milestone & 100,000oz Ag Production Record |
| 2026-10-15 | BHM | bullish | -12.4% | Sept Qtr Delivers Milestone & 100,000oz Ag Production Record |

### L169 — Named jurisdictional engagement update ('Advances Engagement for [Location] Activities') at a stock deeply de-rated (>60% below 12-month high) with near-zero absolute liquidity (median daily turnover effectively A$0/day) and elevated relative volume (>2x), where the headline names a specific US state or high-value jurisdiction and the company has a known critical minerals or industrial policy nexus

When median daily turnover is effectively zero and relative volume is elevated, do not discard the volume signal as noise purely on ratio-instability grounds — at genuinely untradeable stocks, any above-zero activity is itself the signal; when the headline names a specific named US jurisdiction and the company has a critical minerals or policy-relevant technology, lean neutral-to-bullish rather than neutral, applying the same logic as L023 and L049, because even qualitative jurisdictional engagement progress in an active policy environment can be the re-rating catalyst a dormant register was waiting for.

_Seen 4×. First written 2026-10-16, last reinforced 2026-10-16._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-16 | VRC | neutral | +24.0% | Volt Advances Engagement for Alabama Activities |
| 2026-10-16 | VRC | neutral | +24.0% | Volt Advances Engagement for Alabama Activities |
| 2026-10-16 | VRC | neutral | +24.0% | Volt Advances Engagement for Alabama Activities |
| 2026-10-16 | VRC | neutral | +24.0% | Volt Advances Engagement for Alabama Activities |

### L172 — Trading halt flagged market sensitive at a stock near a multi-month high (within 5% of 3-month high) with near-zero absolute liquidity (median daily turnover <A$2,000/day), where the halt is announced without any accompanying disclosure of the pending announcement's nature

A trading halt near a recent high at a near-zero-liquidity stock is structurally more likely to precede a dilutive capital raise than a positive operational announcement — the proximity to the high creates an attractive pricing window for a placement, and at near-zero liquidity any new supply is disproportionately large relative to the float; call bearish rather than neutral when the halt is near a recent high and liquidity is near-zero, because the funded-raise-into-strength pattern dominates the positive-catalyst pattern at this liquidity level.

_Seen 4×. First written 2026-10-16, last reinforced 2026-10-16._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-16 | AEI | neutral | -15.3% | Trading Halt |
| 2026-10-16 | AEI | neutral | -15.3% | Trading Halt |
| 2026-10-16 | AEI | neutral | -15.3% | Trading Halt |
| 2026-10-16 | AEI | neutral | -15.3% | Trading Halt |

### L174 — Named tier-1 counterparty collaboration 'advance' announcement (not flagged market sensitive) at a deep-tech or advanced manufacturing company 60%+ below its 12-month high, where the named counterparty is a globally recognised industrial or engineering group and the headline uses progress language ('advances', 'deepens', 'expands') rather than inception language ('signs MOU', 'enters agreement')

Progress language with a named tier-1 industrial counterparty at a deeply de-rated advanced-manufacturing company is structurally stronger than a new MOU — it signals the relationship has survived commercial evaluation and is moving toward application; lean neutral-to-bullish rather than neutral when the counterparty is globally credible, the language indicates progression rather than initiation, and the stock is severely de-rated, because the tier-1 name functions as an implicit endorsement of the technology that the market may not have fully priced.

_Seen 4×. First written 2026-10-16, last reinforced 2026-10-16._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-16 | TTT | neutral | +13.3% | Titomic Advances Collaboration with Bechtel Plant Machinery |
| 2026-10-16 | TTT | neutral | +13.3% | Titomic Advances Collaboration with Bechtel Plant Machinery |
| 2026-10-16 | TTT | neutral | +13.3% | Titomic Advances Collaboration with Bechtel Plant Machinery |
| 2026-10-16 | TTT | neutral | +13.3% | Titomic Advances Collaboration with Bechtel Plant Machinery |

### L176 — Completion of a named asset acquisition ('Completes Acquisition of [Named Project]') flagged market sensitive at a micro-cap with suppressed pre-announcement volume (<0.5x average) and near-zero absolute liquidity (median daily turnover <A$5,000/day), where no consideration structure, JORC resource, or permitting status is disclosed in the headline

A completion announcement for a named asset acquisition without disclosed consideration, resource, or permitting status leaves the market unable to assess whether the acquisition is value-accretive or dilutive — the absence of terms at a near-zero-liquidity micro-cap means the market's first instinct is to sell the uncertainty rather than buy the headline; before calling bullish on an acquisition completion without disclosed terms, require at minimum a named consideration structure or a JORC resource reference; default to neutral rather than bullish when all three key parameters (consideration, resource, permitting) are absent from the headline.

_Seen 4×. First written 2026-10-16, last reinforced 2026-10-16._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-16 | M4M | bullish | -8.7% | Macro Completes Acquisition of Yandi South Iron Ore Project |
| 2026-10-16 | M4M | bullish | -8.7% | Macro Completes Acquisition of Yandi South Iron Ore Project |
| 2026-10-16 | M4M | bullish | -8.7% | Macro Completes Acquisition of Yandi South Iron Ore Project |
| 2026-10-16 | M4M | bullish | -8.7% | Macro Completes Acquisition of Yandi South Iron Ore Project |

### L177 — Numbered clinical trial progress update ('Update No. X') at a clinical-stage biotech at a multi-month low, not flagged market sensitive, where the numbered update sequence implies interim milestone reporting rather than a topline efficacy readout

A numbered interim clinical update that is not flagged market sensitive signals a procedural milestone (enrolment progress, safety signal, site activation) rather than primary endpoint data — however, at a stock already at a multi-month low, even a procedural positive (clean safety, enrolment ahead of schedule, protocol unchanged) can provide meaningful relief-buying against a heavily discounted register; lean neutral-to-bullish rather than purely neutral when the update is numbered (implying a pre-disclosed reporting cadence), the stock is at a multi-month low, and the absence of adverse language in the headline ('no safety concerns', 'on track') is itself informative.

_Seen 4×. First written 2026-10-16, last reinforced 2026-10-16._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-16 | NYR | neutral | +8.3% | PROTECT-MI Phase IIa Clinical Trial Update No 3 |
| 2026-10-16 | NYR | neutral | +8.3% | PROTECT-MI Phase IIa Clinical Trial Update No 3 |
| 2026-10-16 | NYR | neutral | +8.3% | PROTECT-MI Phase IIa Clinical Trial Update No 3 |
| 2026-10-16 | NYR | neutral | +8.3% | PROTECT-MI Phase IIa Clinical Trial Update No 3 |

### L179 — Non-market-sensitive operational update ('Operational Update [Named Mine/Project]') at a producing or near-producing miner 60%+ below its 12-month high, where the headline names a specific operational site but discloses no production rate, grade, cost, or positive milestone

A non-flagged operational update at a named producing site that omits all quantitative metrics (tonnes mined, grade, cost per ounce) is more likely to contain negative operational news (underperformance vs. plan, equipment issues, grade reconciliation problems) than a positive update — companies with good numbers headline the number; lean bearish rather than neutral when the update is unflagged, names only the site and the word 'update', and no metric appears in the headline.

_Seen 4×. First written 2026-10-19, last reinforced 2026-10-19._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-19 | VTX | neutral | -12.3% | Operational Update Reward Gold Mine |
| 2026-10-19 | VTX | neutral | -12.3% | Operational Update Reward Gold Mine |
| 2026-10-19 | VTX | neutral | -12.3% | Operational Update Reward Gold Mine |
| 2026-10-19 | VTX | neutral | -12.3% | Operational Update Reward Gold Mine |

### L180 — Named discovery headline ('High-Grade [Metal] Lode discovered at [Named Mine]') flagged market sensitive at a producing or past-producing mine site (not a greenfield explorer), with below-average pre-announcement volume, where no grade or width data appears in the headline

When a 'discovered' headline is applied to a named producing mine site rather than a greenfield target, ask whether the discovery is within existing mine infrastructure (underground, open pit) where the economic relevance depends on extractable grade and tonnage relative to current mine plan — without disclosed grade and width, a lode 'discovery' at a producing site is structurally equivalent to L054's footprint-expansion result and should be called neutral rather than bullish, because 'discovered' is a marketing descriptor and the mine context means the market immediately asks whether the grade justifies stopping or re-directing the existing operation.

_Seen 4×. First written 2026-10-19, last reinforced 2026-10-19._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-19 | ARI | bullish | -10.4% | High-Grade Gold Lode discovered at Cosmopolitan Gold Mine |
| 2026-10-19 | ARI | bullish | -10.4% | High-Grade Gold Lode discovered at Cosmopolitan Gold Mine |
| 2026-10-19 | ARI | bullish | -10.4% | High-Grade Gold Lode discovered at Cosmopolitan Gold Mine |
| 2026-10-19 | ARI | bullish | -10.4% | High-Grade Gold Lode discovered at Cosmopolitan Gold Mine |

### L183 — Market-sensitive 'planning underway' or 'programme planning commenced' headline for a named drilling or resource-definition programme at a junior explorer 50%+ below its 12-month high, with no drill start date, rig name, or programme quantum disclosed

A market-sensitive 'planning underway' headline for a named drill programme occupies a category between L002 (commencement) and a pure programme statement — it confirms management has committed to a resource-definition drill but has not yet secured a rig or named a start date, which means a hard catalyst is imminent but not yet delivered; do not default to neutral on the L058 grounds of insufficient milestone specificity when the market-sensitive flag is present and the named programme (resource-definition drilling) implies a near-term binding commitment; lean neutral-to-bullish rather than neutral, because the flag signals management regards the planning milestone as price-relevant and the resource-definition framing implies a funded programme rather than speculative activity.

_Seen 4×. First written 2026-10-20, last reinforced 2026-10-20._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-20 | PEC | neutral | +9.4% | Raptor Resource Definition Drilling Planning Underway |
| 2026-10-20 | PEC | neutral | +9.4% | Raptor Resource Definition Drilling Planning Underway |
| 2026-10-20 | PEC | neutral | +9.4% | Raptor Resource Definition Drilling Planning Underway |
| 2026-10-20 | PEC | neutral | +9.4% | Raptor Resource Definition Drilling Planning Underway |

### L190 — Cleansing notice filed on the same day as a named asset acquisition completion announcement at a stock 60%+ below its 12-month high, where the cleansing notice is the companion filing to the acquisition rather than standing alone

When a cleansing notice accompanies a named asset acquisition completion (identifiable via same-day filing cluster), do not apply L089's standalone-cleansing bearish default — the placed capital has been deployed into a named asset rather than generic working capital, which satisfies L027's funded-catalyst condition; treat the cluster as a funded-acquisition signal and lean neutral-to-bullish rather than bearish, because the dilution is already absorbed and the acquisition itself is the catalyst.

_Seen 4×. First written 2026-10-21, last reinforced 2026-10-21._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-21 | ZEU | bearish | +16.5% | Cleansing Notice |
| 2026-10-21 | ZEU | bearish | +16.5% | Cleansing Notice |
| 2026-10-21 | ZEU | bearish | +16.5% | Cleansing Notice |
| 2026-10-21 | ZEU | bearish | +16.5% | Cleansing Notice |

### L191 — Results webcast scheduling notification (not the results themselves) at a profitable or revenue-generating financial services or lending company that is 50%+ below its 12-month high, not flagged market sensitive, with no volume data available

A webcast notification for an upcoming quarterly result at a deeply de-rated, revenue-generating lending or financial services company is not content-free — it confirms a scheduled results event is imminent at a stock already priced for deterioration, creating asymmetric upside if the forthcoming numbers are non-catastrophic; lean neutral-to-bullish rather than neutral, applying L155-style asymmetric logic to the scheduling notice itself when the company has a known revenue base, the stock is severely de-rated, and the webcast implies a near-term catalyst that a distressed register will treat as a floor-testing event.

_Seen 4×. First written 2026-10-21, last reinforced 2026-10-21._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-21 | PLT | neutral | +8.6% | 2Q27 results - webcast notification |
| 2026-10-21 | PLT | neutral | +8.6% | 2Q27 results - webcast notification |
| 2026-10-21 | PLT | neutral | +8.6% | 2Q27 results - webcast notification |
| 2026-10-21 | PLT | neutral | +8.6% | 2Q27 results - webcast notification |

### L195 — First assay result from a named project headlined as 'supporting' a specific mining method (open pit, underground) rather than disclosing grade and width as the primary headline metric, at a stock 60%+ below its 12-month high

When the headline frames assay results in terms of strategic validation ('supports open pit strategy') rather than leading with grade and width numbers, treat the result as structurally closer to a geometry-only or extension-only filing — the strategic framing may be compensating for grades that are not strong enough to stand alone; require disclosed grade and width in the headline before calling bullish, and default to neutral when the headline leads with method rather than metric.

_Seen 4×. First written 2026-10-22, last reinforced 2026-10-22._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-22 | BVR | bullish | -22.0% | First Pickle Crow Assay Results Support Open Pit Strategy |
| 2026-10-22 | BVR | bullish | -22.0% | First Pickle Crow Assay Results Support Open Pit Strategy |
| 2026-10-22 | BVR | bullish | -22.0% | First Pickle Crow Assay Results Support Open Pit Strategy |
| 2026-10-22 | BVR | bullish | -22.0% | First Pickle Crow Assay Results Support Open Pit Strategy |

### L196 — Market-sensitive investor presentation named after a specific project (not a generic company presentation) at a stock that has closed above its 60-day high on extreme relative volume (>10x) but with near-zero absolute liquidity (median daily turnover effectively A$0/day), where the presentation names no specific milestone (permit, funding, resource, offtake) in the headline

When the extreme volume ratio is entirely attributable to a near-zero absolute base, the ratio carries no institutional-intent signal and should not be used to justify a bullish call; apply L058's neutral default to a project-named presentation with no milestone in the headline, and do not allow an extreme-but-meaningless volume ratio to override the absence of content — call neutral rather than bullish.

_Seen 4×. First written 2026-10-22, last reinforced 2026-10-22._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-22 | EGY | bullish | -21.3% | EGY Cogenic Investor Presentation |
| 2026-10-22 | EGY | bullish | -21.3% | EGY Cogenic Investor Presentation |
| 2026-10-22 | EGY | bullish | -21.3% | EGY Cogenic Investor Presentation |
| 2026-10-22 | EGY | bullish | -21.3% | EGY Cogenic Investor Presentation |

### L198 — Named-project, grade-and-width assay result (specific metres and g/t disclosed in headline) flagged market sensitive at a stock where no price action data is available, where the headline uses 'growth confirmed' or equivalent language implying the result is an extension of an existing system rather than a maiden discovery

Even when grade and width appear in the headline, ask whether the framing ('material growth confirmed', 'extends mineralisation') signals that the result adds to an already-known system rather than establishing a new one — the market may have already partially priced the extension narrative from prior releases, and 'confirmation' language implies the result meets but does not exceed prior expectations; when no price action data is available to assess pre-positioning and the headline uses confirmation rather than discovery language, default to neutral rather than bullish.

_Seen 4×. First written 2026-10-22, last reinforced 2026-10-22._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-22 | BTR | bullish | -15.2% | Material growth at TMH confirmed with 305m @ 1.33g/t Au |
| 2026-10-22 | BTR | bullish | -15.2% | Material growth at TMH confirmed with 305m @ 1.33g/t Au |
| 2026-10-22 | BTR | bullish | -15.2% | Material growth at TMH confirmed with 305m @ 1.33g/t Au |
| 2026-10-22 | BTR | bullish | -15.2% | Material growth at TMH confirmed with 305m @ 1.33g/t Au |

### L199 — Non-dilutive government agency debt announcement (EXIM, EFIC, or equivalent export credit agency loan) to a subsidiary of a listed parent, at a stock 50%+ below its 12-month high, where the loan is denominated in foreign currency and no drawdown timeline or associated revenue recognition schedule is disclosed

An export credit agency loan to a named subsidiary is not equivalent to a direct cash injection into the listed parent — the listed entity's access to the funds depends on intercompany structures, and the market will immediately ask whether the subsidiary's debt is recourse to the parent or ring-fenced; before calling bullish on a subsidiary-level government loan, confirm whether the proceeds flow to the listed parent's balance sheet and whether drawdown is conditional on contract milestones; if neither is disclosed, default to neutral rather than bullish.

_Seen 4×. First written 2026-10-22, last reinforced 2026-10-22._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-22 | TTT | bullish | -14.9% | EXIM Lends USD 10.3M to Titomic USA, Inc. |
| 2026-10-22 | TTT | bullish | -14.9% | EXIM Lends USD 10.3M to Titomic USA, Inc. |
| 2026-10-22 | TTT | bullish | -14.9% | EXIM Lends USD 10.3M to Titomic USA, Inc. |
| 2026-10-22 | TTT | bullish | -14.9% | EXIM Lends USD 10.3M to Titomic USA, Inc. |

### L200 — Named resource delivery headline ('Delivers Significant Resource at [Named Project]') flagged market sensitive at a stock at a 12-month low with suppressed pre-announcement volume (<0.5x), where 'significant' is management language and no resource quantum, classification, or grade appears in the headline

When 'significant' is the sole qualitative descriptor for a resource result and no tonnes, grade, or JORC classification appears in the headline, treat the filing as structurally ambiguous — 'significant' is management framing that cannot be benchmarked against peer valuations without a number; require at minimum a resource quantum or grade in the headline before calling bullish, and default to neutral when the headline's only economic descriptor is a management qualifier rather than a disclosed metric.

_Seen 4×. First written 2026-10-22, last reinforced 2026-10-22._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-22 | LSR | bullish | -13.8% | Lodestar Delivers Significant Resource at Ned's Creek Gold |
| 2026-10-22 | LSR | bullish | -13.8% | Lodestar Delivers Significant Resource at Ned's Creek Gold |
| 2026-10-22 | LSR | bullish | -13.8% | Lodestar Delivers Significant Resource at Ned's Creek Gold |
| 2026-10-22 | LSR | bullish | -13.8% | Lodestar Delivers Significant Resource at Ned's Creek Gold |

### L207 — A numbered supplementary target's statement (fourth, fifth, sixth or later iteration) in an active takeover, where the stock is near or above the bid price on above-average volume

A late-iteration supplementary target's statement (sixth supplement implies the process has been protracted and contested) most commonly signals the target board is exhausting its defensive arguments rather than receiving a higher offer — each successive supplement reduces the probability of a bump and increases deal-fatigue selling; default to bearish rather than bullish when the supplement count is high (≥4) and the stock is already elevated on anticipation of a bump that has not materialised.

_Seen 4×. First written 2026-10-23, last reinforced 2026-10-23._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-23 | ZNC | bullish | -10.3% | Sixth Supplementary Target's Statement |
| 2026-10-23 | ZNC | bullish | -10.3% | Sixth Supplementary Target's Statement |
| 2026-10-23 | ZNC | bullish | -10.3% | Sixth Supplementary Target's Statement |
| 2026-10-23 | ZNC | bullish | -10.3% | Sixth Supplementary Target's Statement |

### L210 — Market-sensitive combined strategic review update and trading update at a company where no price action data is available and the strategic review has been publicly known for multiple months

Parse the two components independently: if the strategic review update uses language short of a binding outcome ('progressing', 'ongoing', 'no update') while the trading update is the hard data layer, treat the trading update as the market-moving element and default to bearish rather than neutral when no beat language appears in the headline, because a non-concluded strategic review removes the deal-optionality premium without the trading update necessarily compensating — apply L192-style asymmetric logic to the trading component.

_Seen 4×. First written 2026-10-26, last reinforced 2026-10-26._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-26 | OFX | neutral | -24.7% | Strategic Review Update and 2Q27 Trading Update |
| 2026-10-26 | OFX | neutral | -24.7% | Strategic Review Update and 2Q27 Trading Update |
| 2026-10-26 | OFX | neutral | -24.7% | Strategic Review Update and 2Q27 Trading Update |
| 2026-10-26 | OFX | neutral | -24.7% | Strategic Review Update and 2Q27 Trading Update |

### L211 — Named acquisition shareholder approval announcement ('Overwhelming Shareholder Support for X Acquisition') at a stock at or near a multi-month high, where the approval vote resolves the primary execution risk but no post-approval integration milestone or earnings contribution timeline is disclosed

Shareholder approval of an acquisition resolves deal-break risk but simultaneously removes the primary option-value component that drove the pre-vote run — the stock is now a completion play rather than an approval-probability play; call bearish rather than bullish when the stock is at a multi-month high on approval day, because the market has already priced the approval and the next catalyst (completion, integration, earnings accretion) is months away with no near-term re-rating trigger.

_Seen 4×. First written 2026-10-26, last reinforced 2026-10-26._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-26 | AKA | bullish | -15.3% | Overwhelming Shareholder Support for HGH Acquisition |
| 2026-10-26 | AKA | bullish | -15.3% | Overwhelming Shareholder Support for HGH Acquisition |
| 2026-10-26 | AKA | bullish | -15.3% | Overwhelming Shareholder Support for HGH Acquisition |
| 2026-10-26 | AKA | bullish | -15.3% | Overwhelming Shareholder Support for HGH Acquisition |

### L212 — Completion of a novation agreement announced as market sensitive, with no price action data available, where the identity of the incoming or outgoing party and the nature of the novated contract are not disclosed in the headline

A novation completion is a contract restructuring event whose direction (positive or negative) depends entirely on whether the incoming party is a stronger or weaker counterparty than the outgoing one — when that identity is absent from the headline, the market-sensitive flag combined with the word 'completion' is more likely to signal a positive resolution (a stronger party has stepped in, the company chose to announce) than an adverse one; lean neutral-to-bullish rather than neutral when the filing confirms completion rather than merely commencement of a novation process, because companies do not typically flag the completion of a rescue novation as market sensitive without intending a positive narrative.

_Seen 4×. First written 2026-10-26, last reinforced 2026-10-26._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-26 | A11 | neutral | +15.2% | Completion of Novation Agreement |
| 2026-10-26 | A11 | neutral | +15.2% | Completion of Novation Agreement |
| 2026-10-26 | A11 | neutral | +15.2% | Completion of Novation Agreement |
| 2026-10-26 | A11 | neutral | +15.2% | Completion of Novation Agreement |

### L217 — Named asset divestment (with disclosed headline consideration up to a stated maximum plus a royalty) flagged market sensitive at a deeply de-rated junior (50%+ below 12-month high) with suppressed pre-announcement volume (<0.5x average), where the divested asset is a non-core or geographically distinct project and the seller retains a royalty stream

A market-sensitive asset sale with a disclosed headline consideration (even if contingent) plus a retained NSR royalty is categorically different from L007's undisclosed-terms distress-signal — the disclosed maximum consideration and the retained royalty stream together signal managed strategic rationalisation with ongoing upside participation; lean bullish rather than neutral when both elements are present, the filing is market-sensitive, and pre-announcement volume is suppressed (no crowded long to unwind), because the combination of cash proceeds and retained royalty at a deeply de-rated stock creates asymmetric upside the neutral call misses.

_Seen 4×. First written 2026-10-27, last reinforced 2026-10-27._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-27 | DM1 | neutral | +28.1% | Sale of Tengrela Project for up to A$5 million and 1% NSR |
| 2026-10-27 | DM1 | neutral | +28.1% | Sale of Tengrela Project for up to A$5 million and 1% NSR |
| 2026-10-27 | DM1 | neutral | +28.1% | Sale of Tengrela Project for up to A$5 million and 1% NSR |
| 2026-10-27 | DM1 | neutral | +28.1% | Sale of Tengrela Project for up to A$5 million and 1% NSR |

### L218 — Results of General Meeting (EGM or GM, not AGM) filing at a stock at a 12-month low with near-zero absolute liquidity and no market-sensitive flag, where the meeting agenda plausibly included capital-structure or strategic resolutions

Apply L201's logic to GM results at 12-month lows: before calling neutral, check whether the underlying notice of meeting contained capital-authority or strategic resolutions (consolidation, name change, placement ratification); if such resolutions were on the agenda and the stock is at its lowest price with near-zero liquidity, the passage of a strategic resolution is the re-rating catalyst a disengaged register was waiting for — lean neutral-to-bullish rather than neutral when the meeting agenda was substantively strategic rather than purely procedural.

_Seen 4×. First written 2026-10-27, last reinforced 2026-10-27._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-27 | ATT | neutral | +24.5% | Results of 2026 General Meeting |
| 2026-10-27 | ATT | neutral | +24.5% | Results of 2026 General Meeting |
| 2026-10-27 | ATT | neutral | +24.5% | Results of 2026 General Meeting |
| 2026-10-27 | ATT | neutral | +24.5% | Results of 2026 General Meeting |

### L219 — Market-sensitive geological mapping result ('thick clays mapped', 'clay horizon confirmed') at a junior HREE or ionic-adsorption-clay explorer where no price action data is available, where confirmation of the correct host lithology is the de-risking milestone but no resource tonnage, grade, or drill plan accompanies it

Confirming host lithology (clay thickness, clay type) is a necessary-but-not-sufficient de-risking step for ionic-adsorption HREE projects — apply L135's mineralogical-confirmation logic by analogy and default to neutral rather than bullish when no resource tonnage, grade, or drill start date accompanies the mapping result, because the market will immediately ask 'how much?' and the filing cannot answer.

_Seen 4×. First written 2026-10-27, last reinforced 2026-10-27._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-27 | ALV | bullish | -21.4% | Thick Clays Mapped at Boa Vista Bluebush HREE Project |
| 2026-10-27 | ALV | bullish | -21.4% | Thick Clays Mapped at Boa Vista Bluebush HREE Project |
| 2026-10-27 | ALV | bullish | -21.4% | Thick Clays Mapped at Boa Vista Bluebush HREE Project |
| 2026-10-27 | ALV | bullish | -21.4% | Thick Clays Mapped at Boa Vista Bluebush HREE Project |

### L220 — Market-sensitive quarterly activities and cashflow report at a stock near a multi-month high (within 5% of its 3-month high) with deeply suppressed pre-announcement volume (<0.3x average) and near-zero absolute liquidity, where the quarterly is the primary periodic operational update for a small energy or resources company

When a market-sensitive quarterly lands at a stock near its recent high with deeply suppressed volume, the market has not pre-positioned for a positive surprise — the stock's proximity to its high means the quarterly must substantively beat implied expectations or the tape will pull back from holders who ran the stock in anticipation; lean bearish rather than neutral when the stock is near a recent high, volume is deeply suppressed, and the quarterly headline names no specific positive milestone, because the absence of pre-announcement accumulation combined with an extended price level creates asymmetric downside if the content merely confirms the status quo.

_Seen 4×. First written 2026-10-27, last reinforced 2026-10-27._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-27 | SER | neutral | -13.0% | September 2026 Quarterly Activities & Cashflow Report |
| 2026-10-27 | SER | neutral | -13.0% | September 2026 Quarterly Activities & Cashflow Report |
| 2026-10-27 | SER | neutral | -13.0% | September 2026 Quarterly Activities & Cashflow Report |
| 2026-10-27 | SER | neutral | -13.0% | September 2026 Quarterly Activities & Cashflow Report |

### L225 — Fully subscribed SPP and placement completion announcement at a deeply de-rated micro-cap (>70% below 12-month high) with suppressed pre-announcement volume (<0.3x average), where the 'fully subscribed' descriptor is explicit in the headline but no named operational use of proceeds is disclosed

A 'fully subscribed' raise at a deeply de-rated stock with suppressed pre-announcement volume is not a funded-catalyst signal if no named operational use of proceeds accompanies it — 'fully subscribed' confirms demand at the issue price but the issue price itself (typically at a material discount) creates a mechanical ceiling; before calling bullish or even neutral on a fully-subscribed-raise completion, confirm the issue price relative to last trade and whether a named near-term catalyst is disclosed, because a raise priced at a deep discount into a stock with no operational news is primarily a dilution event regardless of subscription level.

_Seen 4×. First written 2026-10-28, last reinforced 2026-10-28._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-28 | MGT | bullish | -14.2% | MGT Raises $1.32M through Fully Subscribed SPP and Placement |
| 2026-10-28 | MGT | bullish | -14.2% | MGT Raises $1.32M through Fully Subscribed SPP and Placement |
| 2026-10-28 | MGT | bullish | -14.2% | MGT Raises $1.32M through Fully Subscribed SPP and Placement |
| 2026-10-28 | MGT | bullish | -14.2% | MGT Raises $1.32M through Fully Subscribed SPP and Placement |

### L226 — Change of financial year-end announcement (not flagged market sensitive) at a stock 50%+ below its 12-month high, where the new year-end aligns with a named US or international parent, acquirer, or strategic partner's fiscal calendar

A financial year-end change at a deeply de-rated junior can signal alignment with an incoming strategic partner or acquirer whose fiscal calendar is the reference point — before calling neutral, ask whether the new year-end matches a known or plausible strategic counterparty's reporting period; if yes, lean neutral-to-bullish rather than neutral, because the alignment is an implicit signal of an advanced strategic relationship the market has not priced.

_Seen 4×. First written 2026-10-28, last reinforced 2026-10-28._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-28 | 3DA | neutral | +12.8% | Amaero Inc. Announces Change of Financial Year-End |
| 2026-10-28 | 3DA | neutral | +12.8% | Amaero Inc. Announces Change of Financial Year-End |
| 2026-10-28 | 3DA | neutral | +12.8% | Amaero Inc. Announces Change of Financial Year-End |
| 2026-10-28 | 3DA | neutral | +12.8% | Amaero Inc. Announces Change of Financial Year-End |

### L227 — Named order-book cash-collection update ('$Xm orders advance with $Ym received') flagged market sensitive at a thinly traded micro-cap technology or manufacturing company with suppressed pre-announcement volume (<0.6x average), where the received amount is the first confirmed cash against a previously announced order book

A first confirmed cash receipt against a large named order book is not merely a receivables update — it validates the order as real and the counterparty as paying, which at a distressed micro-cap removes the market's primary execution-risk concern about the order; before calling neutral on a cash-receipt update, ask whether this is the first confirmed payment against a previously disclosed order; if yes, lean neutral-to-bullish rather than neutral, because the payment confirmation is the de-risking event the market was waiting for.

_Seen 4×. First written 2026-10-28, last reinforced 2026-10-28._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-28 | SIX | neutral | +12.3% | $41m Mest Water Orders Advance with $1.3m Received |
| 2026-10-28 | SIX | neutral | +12.3% | $41m Mest Water Orders Advance with $1.3m Received |
| 2026-10-28 | SIX | neutral | +12.3% | $41m Mest Water Orders Advance with $1.3m Received |
| 2026-10-28 | SIX | neutral | +12.3% | $41m Mest Water Orders Advance with $1.3m Received |

### L019 — Announcement packaging multiple simultaneous high-conviction catalysts (e.g. resource drilling + scoping study + JV buyout in a single headline) at a junior explorer or developer, with no price action data available

When three or more distinct value-creating events are announced simultaneously, ask whether the packaging itself signals execution risk or financial pressure — a company announcing a JV buyout, scoping study, and active drilling in one release may be doing so because it needs to justify a concurrent capital raise or shore up investor confidence ahead of a funding shortfall. Check for a same-day capital raise filing before calling bullish; if a raise is present or the announcement reads as a 'kitchen sink' designed to support a valuation pitch, downgrade to neutral.

_Seen 3×. First written 2026-09-15, last reinforced 2026-09-15._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-15 | EMC | bullish | -11.6% | Resource Drilling, Scoping Study, JV Buyout at Revere Gold |
| 2026-09-15 | EMC | bullish | -11.6% | Resource Drilling, Scoping Study, JV Buyout at Revere Gold |
| 2026-09-15 | EMC | bullish | -11.6% | Resource Drilling, Scoping Study, JV Buyout at Revere Gold |

### L045 — Regulatory licence variation announcement (EPL variation, exploration licence amendment, permit modification) with 'Issued' or 'Granted' language at a junior miner/explorer 60%+ below its 12-month high, not flagged market sensitive

A 'varied EPL issued' or equivalent granted-licence announcement removes a specific regulatory risk and confirms the company has active, approved work authorisation — this is structurally different from a mere application or a generic operational update; before defaulting to neutral on the grounds of no assay data or prior de-rating, ask whether the varied licence now enables a specific next operational step (drill start, bulk sample, resource extension) that was previously blocked; if so, lean neutral-to-bullish rather than neutral, because the grant itself is the gating event the market was waiting for.

_Seen 3×. First written 2026-09-18, last reinforced 2026-09-18._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-18 | VTX | neutral | +8.7% | Operational Update - Varied EPL Issued |
| 2026-09-18 | VTX | neutral | +8.7% | Operational Update - Varied EPL Issued |
| 2026-09-18 | VTX | neutral | +8.7% | Operational Update - Varied EPL Issued |

### L060 — Asset divestment announcement flagged market sensitive at a stock at or near its 12-month high with no disclosed proceeds, where the divested assets are the company's primary or only named asset portfolio rather than a clearly non-core or legacy holding

L007's distress-default does not apply when the stock is at a 12-month high, but the bullish flip is not automatic when proceeds are undisclosed and the divested assets are core rather than peripheral — when the sold portfolio is the company's named primary asset, the market may read the divestment as strategic exit rather than rationalisation, creating uncertainty about what the residual entity is worth; default to neutral rather than bullish when proceeds are absent and the sold asset is central to the investment thesis, regardless of the stock's price level.

_Seen 3×. First written 2026-09-21, last reinforced 2026-09-21._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-21 | FMR | bullish | -8.3% | Sale of Canadian Assets |
| 2026-09-21 | FMR | bullish | -8.3% | Sale of Canadian Assets |
| 2026-09-21 | FMR | bullish | -8.3% | Sale of Canadian Assets |

### L090 — First named-customer or first contract win announcement (market-sensitive or not) at a near-zero-liquidity micro-cap technology or SaaS company (>90% below 12-month high, median daily turnover <A$500/day) where no contract value is disclosed and the filing is not flagged market sensitive

Apply L006's logic at extreme de-rating levels even when the commercial milestone sounds significant: at >90% below the 12-month high the market has already heavily discounted commercial execution, and a first customer win without a disclosed revenue quantum cannot close the gap between the current price and any recovery thesis. Do not call bullish on a first-customer announcement without a disclosed or clearly estimable contract value; the absence of both a market-sensitive flag and a dollar figure signals the contract is immaterial relative to the scale of value destruction already priced in, and the announcement is more likely to disappoint implicit expectations than to catalyse a re-rating.

_Seen 3×. First written 2026-09-28, last reinforced 2026-09-28._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-28 | SPX | bullish | -20.2% | Spenda AI-Returns Platform Signs First Major FMCG Customer |
| 2026-09-28 | SPX | bullish | -20.2% | Spenda AI-Returns Platform Signs First Major FMCG Customer |
| 2026-09-28 | SPX | bullish | -20.2% | Spenda AI-Returns Platform Signs First Major FMCG Customer |

### L096 — Convertible debenture or convertible note facility announcement (flagged market sensitive) at a junior developer or explorer 50%+ below its 12-month high, where the facility is denominated in a foreign currency (USD) and no conversion price, coupon, or maturity terms are disclosed in the headline

A convertible debenture announcement without disclosed conversion price, coupon, or maturity is structurally more bearish than a straight equity placement at a distressed stock — the headline quantum overstates the benefit because the conversion mechanics (which may be deeply discounted) are the actual value-destructive element; do not call neutral when conversion terms are absent from the headline; lean bearish rather than neutral, because the market will immediately assume worst-case conversion terms (near-spot or discounted) and will price dilution before details are released, particularly when the facility is in a foreign currency that adds FX complexity.

_Seen 3×. First written 2026-09-28, last reinforced 2026-09-28._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-28 | CEL | neutral | -8.2% | Challenger Gold Secures US$24m Convertible Debentures |
| 2026-09-28 | CEL | neutral | -8.2% | Challenger Gold Secures US$24m Convertible Debentures |
| 2026-09-28 | CEL | neutral | -8.2% | Challenger Gold Secures US$24m Convertible Debentures |

### L107 — Extension-only or visible-gold-continuation drill result (L018 shape, no assay grades in headline) at a stock within 5% of a multi-month high, flagged market sensitive, where the extension is at a named underground or high-conviction target (e.g. 'TMH') with a prior discovery narrative

Before applying L018's bearish or neutral default to an extension result near a multi-month high, ask whether the named target already carries a well-established high-grade discovery narrative that makes even a continuation result commercially meaningful to the market — if the target has a known high-grade reputation and the headline confirms continuity rather than merely adding strike length to an undistinguished system, the sell-the-news risk is lower than L018 assumes; lean neutral-to-bullish rather than neutral when these conditions coincide, reserving L018's bearish call for extension results at targets with no established grade narrative.

_Seen 3×. First written 2026-09-30, last reinforced 2026-09-30._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-30 | BTR | neutral | +12.9% | Visible Gold Continues From TMH Extensional Drilling |
| 2026-09-30 | BTR | neutral | +12.9% | Visible Gold Continues From TMH Extensional Drilling |
| 2026-09-30 | BTR | neutral | +12.9% | Visible Gold Continues From TMH Extensional Drilling |

### L131 — Market-sensitive announcement combining a named maiden exploration programme completion ('Maiden X Exploration Completed') with a new appointment in the same headline, at a junior explorer with an active commodity thematic (tin, antimony, lithium), where no price action data is available

A maiden exploration completion paired with a new appointment in a single market-sensitive headline carries two independent information layers — the completion signals results are in hand and will be interpreted shortly (per L013, a near-term catalyst signal), and the appointment may be a strategic hire whose credentials are the body-level signal; do not call neutral on the compound filing purely because neither element is quantified in the headline — lean neutral-to-bullish when the commodity has an active thematic and the completion framing implies results disclosure is imminent, because the market-sensitive flag endorses both elements as jointly material.

_Seen 3×. First written 2026-10-06, last reinforced 2026-10-06._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-06 | NRX | neutral | +7.8% | Maiden Sleitat Tin Exploration Completed and New Appointment |
| 2026-10-06 | NRX | neutral | +7.8% | Maiden Sleitat Tin Exploration Completed and New Appointment |
| 2026-10-06 | NRX | neutral | +7.8% | Maiden Sleitat Tin Exploration Completed and New Appointment |

### L135 — Mineralogical or metallurgical study result (confirming mineral species, e.g. Nb-rich pyrochlore, confirming recoverable mineral form) at a junior explorer 50%+ below its 12-month high, flagged market sensitive, where the result validates the mineralogical pathway but delivers no resource tonnage, grade, or project economics

A mineralogical study confirming the correct mineral species is a necessary-but-not-sufficient de-risking step — it closes one geological uncertainty but does not convert exploration risk into project value without an accompanying resource estimate or scoping study; apply L026's logic by analogy and default to neutral rather than bullish on mineralogy-only confirmations at deeply de-rated stocks, because the market will immediately ask 'how much?' and the filing cannot answer.

_Seen 3×. First written 2026-10-07, last reinforced 2026-10-07._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-07 | PNN | bullish | -9.9% | SANTA ANNA MINERALOGICAL STUDY CONFIRMS NB RICH PYROCHLORE |
| 2026-10-07 | PNN | bullish | -9.9% | SANTA ANNA MINERALOGICAL STUDY CONFIRMS NB RICH PYROCHLORE |
| 2026-10-07 | PNN | bullish | -9.9% | SANTA ANNA MINERALOGICAL STUDY CONFIRMS NB RICH PYROCHLORE |

### L137 — Listing Rule 7.1 breach notification at a deeply de-rated micro-cap (70%+ below 12-month high) with near-zero liquidity, where the breach confirms shares were already issued (i.e., the capital event is complete and the breach is a retrospective compliance disclosure rather than a prospective warning)

A 7.1 breach notification on a completed issuance means the capital has already arrived on the balance sheet — the dilution is done and the cash is in; the market may read the completed raise as a funded-survival signal rather than a governance crisis, particularly at a deeply de-rated stock where any cash injection is asymmetrically positive; before calling bearish on a 7.1 breach, ask whether the breach reflects a completed raise that provides runway the market had not yet priced, and default to neutral rather than bearish when the issuance is retrospective and no ongoing compliance action (suspension, cancellation of securities) is signalled in the headline.

_Seen 3×. First written 2026-10-07, last reinforced 2026-10-07._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-07 | VHL | bearish | +9.2% | Breach of Listing Rule 7.1 |
| 2026-10-07 | VHL | bearish | +9.2% | Breach of Listing Rule 7.1 |
| 2026-10-07 | VHL | bearish | +9.2% | Breach of Listing Rule 7.1 |

### L142 — Severe quantitative revenue or operational deterioration announcement (e.g. revenue down >50% year-on-year) at a stock already at a 12-month low with near-zero liquidity and heavily suppressed pre-announcement volume (<0.3x average), where the headline contains no mitigating language

Before calling bearish on an extreme negative metric at a near-zero-liquidity stock already priced for maximum distress, ask whether the market has already fully discounted a going-concern scenario and whether the suppressed volume signals that all motivated sellers have already exited — when a stock is at its 12-month low with near-zero liquidity and volume is deeply suppressed, the marginal seller may already be gone and a relief-buying or short-covering reaction to even catastrophic news is possible; default to neutral rather than bearish when the de-rating is already extreme, liquidity is effectively zero, and pre-announcement volume confirms no fresh distribution is occurring.

_Seen 3×. First written 2026-10-08, last reinforced 2026-10-27._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-27 | SGR | bearish | +12.6% | Quarterly Activities/Appendix 4C Cash Flow Report |
| 2026-10-27 | SGR | bearish | +12.6% | Quarterly Activities/Appendix 4C Cash Flow Report |
| 2026-10-08 | ANO | bearish | +12.4% | First Quarter FY27 Australian Revenue Down 71% |

### L160 — High-grade surface mineralisation result (market-sensitive, 'from surface' descriptor) at a junior explorer 50%+ below its 12-month high, filed simultaneously with or immediately after an ASX price query response on the same stock on the same day

Before calling bullish on a high-grade surface result paired with a price query response, ask whether the query-response confirmation and the result together have already exhausted the near-term re-rating — when the price has already moved sharply ahead of the dual filing (triggering the query in the first place), the result may be priced into the pre-filing move and the correct call is neutral rather than bullish, because the market has already absorbed the information that prompted the query.

_Seen 3×. First written 2026-10-14, last reinforced 2026-10-14._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-14 | TM1 | bullish | -14.8% | SOUTHWEST DELIVERS HIGH-GRADE PGM MINERALISATION FROM SURFAC |
| 2026-10-14 | TM1 | bullish | -14.8% | SOUTHWEST DELIVERS HIGH-GRADE PGM MINERALISATION FROM SURFAC |
| 2026-10-14 | TM1 | bullish | -14.8% | SOUTHWEST DELIVERS HIGH-GRADE PGM MINERALISATION FROM SURFAC |

### L161 — Escrow release (shares released from escrow, not options lapsing) at a stock 80%+ below its 12-month high with extreme relative volume (>3x) but near-zero absolute liquidity (median daily turnover <A$500/day), where the escrow release involves founder or seed-investor shares rather than institutional placement shares

Before calling bearish on an escrow release at a near-zero-liquidity, deeply de-rated stock, ask whether the newly freed holders have any rational economic incentive to sell at current prices — at 86% below the high, escrowed founders may be long-term holders with no intention to sell into a near-zero market; when absolute liquidity is effectively zero, the supply overhang is theoretical rather than executable, and the elevated volume may reflect speculative buying rather than escrow-holder distribution; default to neutral rather than bearish when the stock is at extreme distress levels and absolute daily turnover is below A$500/day, because the absorptive capacity argument runs both ways.

_Seen 3×. First written 2026-10-14, last reinforced 2026-10-14._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-14 | FLX | bearish | +9.7% | Release of Shares from Escrow |
| 2026-10-14 | FLX | bearish | +9.7% | Release of Shares from Escrow |
| 2026-10-14 | FLX | bearish | +9.7% | Release of Shares from Escrow |

### L181 — Non-Executive Director resignation at a stock at a 12-month low with suppressed pre-announcement volume (<0.5x average) and near-zero absolute liquidity, where no reason for departure is given in the headline

A NED departure at a deeply de-rated, illiquid micro-cap with suppressed volume is not unambiguously bearish — in a disengaged register a voluntary NED resignation may simply reflect board rationalisation or fee pressure rather than a governance crisis, and the suppressed volume confirms no informed holder is front-running a negative event; default to neutral rather than bearish when volume is suppressed and absolute liquidity is near-zero, reserving bearish for NED departures into elevated volume (evidence of informed exit) or where the headline names the reason as a disagreement or adverse event.

_Seen 3×. First written 2026-10-19, last reinforced 2026-10-19._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-19 | HYT | bearish | +19.6% | Resignation of Non-Executive Director |
| 2026-10-19 | HYT | bearish | +19.6% | Resignation of Non-Executive Director |
| 2026-10-19 | HYT | bearish | +19.6% | Resignation of Non-Executive Director |

### L185 — Visible mineralisation intercept result (scheelite, visible gold, native copper) headlined as 'wide zones of visible [mineral]' at a junior explorer, flagged market sensitive, with suppressed pre-announcement volume (<0.6x), where no assay grade or width data appears in the headline

Visible mineralisation language ('visible scheelite', 'visible gold') is structurally equivalent to an extension-only or presence-only result under L054 — it confirms mineralisation is present but provides no economic parameters (grade, width, recovery); before calling bullish on a visible-mineralisation headline, require disclosed assay grades or apply L054's neutral default, because the market will immediately ask 'what grade?' and the filing cannot answer.

_Seen 3×. First written 2026-10-20, last reinforced 2026-10-20._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-20 | VKA | bullish | -9.7% | VIKING INTERSECTS WIDE ZONES OF VISIBLE SCHEELITE AT LINKA |
| 2026-10-20 | VKA | bullish | -9.7% | VIKING INTERSECTS WIDE ZONES OF VISIBLE SCHEELITE AT LINKA |
| 2026-10-20 | VKA | bullish | -9.7% | VIKING INTERSECTS WIDE ZONES OF VISIBLE SCHEELITE AT LINKA |

### L193 — An amendment to a previously filed AGM or investor presentation, flagged market sensitive, with no price action data available, where the amendment is the primary filing rather than a companion to the original document

An amended market-sensitive AGM or investor presentation is not uniformly bearish — amendments more commonly add incremental positive disclosures (updated guidance, new resolution, corrected upward metric) that management felt compelled to include after the original filing, rather than restating a figure downward; before calling neutral or bearish on an amended presentation, ask whether the amendment adds or removes positive content, and default to neutral-to-bullish rather than neutral when no negative framing appears in the headline and the market-sensitive flag is present on the amendment itself.

_Seen 3×. First written 2026-10-21, last reinforced 2026-10-21._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-21 | VSL | neutral | +10.4% | 2026 Annual meeting of shareholders presentation amended |
| 2026-10-21 | VSL | neutral | +10.4% | 2026 Annual meeting of shareholders presentation amended |
| 2026-10-21 | VSL | neutral | +10.4% | 2026 Annual meeting of shareholders presentation amended |

### L203 — AGM combined with a named trading update, flagged market sensitive, at a deeply de-rated (>60% below 12-month high) consumer retail or services company with an identifiable institutional following, where the trading update is the substantive element and the stock's de-rating reflects operational deterioration already known to the market

At a deeply de-rated retailer or services company, an AGM trading update flagged market sensitive is asymmetrically skewed toward a positive surprise relative to expectations already embedded in the price — the stock is pricing significant ongoing deterioration, so a trading update that merely confirms stabilisation or any improvement versus the implied bear case functions as a floor-setting catalyst; do not default to bearish purely because the vehicle is an AGM at a distressed stock; lean neutral-to-bullish when the trading update component is the named substantive element and the de-rating already prices a severe outcome.

_Seen 3×. First written 2026-10-22, last reinforced 2026-10-22._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-22 | BAP | bearish | +14.0% | 2026 Annual General Meeting and Trading Update |
| 2026-10-22 | BAP | bearish | +14.0% | 2026 Annual General Meeting and Trading Update |
| 2026-10-22 | BAP | bearish | +14.0% | 2026 Annual General Meeting and Trading Update |

### L208 — Seven or more simultaneous Initial Director's Interest Notices at a distressed junior (no price action data, no market-sensitive flag), where the volume of filings implies a wholesale board reconstitution rather than a routine appointment

A mass simultaneous initial director disclosure (7 or more) at a distressed junior is not a neutral governance filing — it is more likely to accompany a deed of company arrangement exit, recapitalisation, or administration emergence where a new controlling group has taken over; lean bearish rather than neutral because the incoming board's first act is often a dilutive recapitalisation to fund the restructured entity, and the absence of a market-sensitive flag signals no positive operational content is being disclosed alongside the governance reset.

_Seen 3×. First written 2026-10-23, last reinforced 2026-10-23._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-23 | WMC | neutral | -11.6% | Initial Director's Interest Notice x7 |
| 2026-10-23 | WMC | neutral | -11.6% | Initial Director's Interest Notice x7 |
| 2026-10-23 | WMC | neutral | -11.6% | Initial Director's Interest Notice x7 |

### L213 — Non-market-sensitive 'drilling advancement' or 'drilling progress' operational update (no assay, no resource, no permit) at a stock at a 12-month low with near-zero absolute liquidity (median daily turnover <A$5,000/day) and no pre-announcement volume data available, where the headline names a specific drilling operation by project name

At a 12-month low with near-zero absolute liquidity and no volume data, a named drilling progress update — even without assay data — can function as the first operational signal a completely dormant register has seen, producing a relief-buying response disproportionate to the information content; do not default to neutral purely on L058 grounds when absolute liquidity is near-zero and the stock is at its worst price level, because the bar for a positive surprise in a dormant register is lower than in a normally traded stock; lean neutral-to-bullish when the headline names an active drilling operation at a stock at its 12-month low with effectively no trading history.

_Seen 3×. First written 2026-10-26, last reinforced 2026-10-26._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-26 | TG1 | neutral | +14.1% | El Donna RC Drilling Advancement |
| 2026-10-26 | TG1 | neutral | +14.1% | El Donna RC Drilling Advancement |
| 2026-10-26 | TG1 | neutral | +14.1% | El Donna RC Drilling Advancement |

### L214 — Notice of AGM filing (not flagged market sensitive) at a stock where no de-rating data is available (distance from 12-month high is unknown) and pre-announcement volume is modestly elevated (1.4–1.7x average) at a thinly traded micro-cap with identifiable liquidity (median daily turnover A$20,000–A$50,000/day)

When neither the stock's price position (near high vs near low) nor the direction of elevated volume is known, the AGM-notice filing is genuinely direction-indeterminate — do not apply either L048's neutral-to-bullish or L099's bearish default without first establishing whether the stock is extended or depressed; call neutral and flag the price-position as the missing discriminator, because applying either directional rule without that anchor inverts the logic for half the cases.

_Seen 3×. First written 2026-10-26, last reinforced 2026-10-26._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-26 | SCP | neutral | -13.8% | Notice of Annual General Meeting/Proxy Form |
| 2026-10-26 | SCP | neutral | -13.8% | Notice of Annual General Meeting/Proxy Form |
| 2026-10-26 | SCP | neutral | -13.8% | Notice of Annual General Meeting/Proxy Form |

### L222 — Market-sensitive global licence or royalty agreement for a 'non-core' asset at a deeply de-rated micro-cap (>65% below 12-month high) with near-zero absolute liquidity, where no licence fee quantum, upfront payment, or named licensee is disclosed in the headline

A 'global licence' for a non-core asset without a disclosed fee quantum or named licensee is structurally equivalent to L006's undisclosed-value contract win — the market cannot size the earnings impact and the 'non-core' framing signals the asset is low-priority to management; do not call bullish on a global licence announcement without a disclosed upfront or royalty quantum, and default to neutral rather than bullish when the licensee is unnamed and no financial terms appear in the headline, because the filing confirms disposal of a secondary asset without confirming value recovery.

_Seen 3×. First written 2026-10-27, last reinforced 2026-10-27._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-27 | RGT | bullish | -14.2% | RGT Executes Global Licence for Non-Core Cannabis Genetics |
| 2026-10-27 | RGT | bullish | -14.2% | RGT Executes Global Licence for Non-Core Cannabis Genetics |
| 2026-10-27 | RGT | bullish | -14.2% | RGT Executes Global Licence for Non-Core Cannabis Genetics |

### L228 — Non-market-sensitive 'Legal Update' headline at a stock 70%+ below its 12-month high where the primary de-rating driver is an identified legal or regulatory dispute (e.g. government revocation, arbitration, licence cancellation) in a named foreign jurisdiction

Before calling bearish on a non-flagged legal update at an extreme-de-rating stock, ask whether the absence of a market-sensitive flag is actually consistent with a partial positive — a 'proceedings ongoing' or 'claim filed' update that merely confirms the dispute is being actively pursued (rather than abandoned) can itself be read as a survival and optionality signal by a register that had been pricing total loss; default to neutral rather than bearish when the headline confirms legal activity is continuing rather than concluding adversely, because at 79%+ de-rating the market has already priced the worst-case outcome and continuation is not incremental bad news.

_Seen 3×. First written 2026-10-28, last reinforced 2026-10-28._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-28 | ETM | bearish | +11.7% | Legal Update |
| 2026-10-28 | ETM | bearish | +11.7% | Legal Update |
| 2026-10-28 | ETM | bearish | +11.7% | Legal Update |

### L229 — Buy-back update notification (not a new buy-back announcement, but a periodic programme update) at a near-zero-liquidity micro-cap with volume running materially above average (>2x), not flagged market sensitive

A buy-back programme update into elevated volume at a near-zero-liquidity stock is not purely procedural — the elevated volume at that liquidity level is the signal, not the filing; before calling neutral, ask whether the volume spike preceded the filing and may reflect informed accumulation ahead of a separately pending announcement that the buy-back update is masking; default to neutral-to-bullish rather than neutral when volume is elevated and absolute liquidity is near-zero, because the filing type may be incidental to the actual market-moving event.

_Seen 3×. First written 2026-10-28, last reinforced 2026-10-28._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-28 | EPY | neutral | +11.6% | Update - Notification of buy-back - EPY |
| 2026-10-28 | EPY | neutral | +11.6% | Update - Notification of buy-back - EPY |
| 2026-10-28 | EPY | neutral | +11.6% | Update - Notification of buy-back - EPY |

### L033 — Trenching result (surface exposure of new mineralised zones) announced as market sensitive at a junior explorer 50%+ below its 12-month high, with no assay grades disclosed in the headline

Treat a trenching result without disclosed assay grades as structurally equivalent to an extension-only drill result under L018 — the geological finding (new zones) is not economically quantifiable without grade data, and the market-sensitive flag does not substitute for that missing information; default to neutral rather than bullish until grade data is published, because the announcement confirms presence but not value.

_Seen 2×. First written 2026-09-16, last reinforced 2026-09-16._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-16 | UM1 | bullish | -9.8% | Trenches Expose New Zones of Gold Mineralisation |
| 2026-09-16 | UM1 | bullish | -9.8% | Trenches Expose New Zones of Gold Mineralisation |

### L122 — Market-sensitive 'distribution update' or equivalent dividend/distribution announcement at a thinly traded micro-cap with suppressed pre-announcement volume (<0.5x), where the filing is the primary scheduled distribution communication for the period

A market-sensitive distribution update is directionally asymmetric in favour of a maintained or increased payout — issuers who cut or suspend distributions almost always use language signalling a reduction ('revised', 'suspended', 'deferred'), while a plain 'distribution update' headline from a company with a distribution history more commonly confirms continuity or an increase; lean neutral-to-bullish rather than neutral when the headline uses neutral framing without cut language and the market-sensitive flag is present, because the flag confirms the quantum is material and the absence of negative framing is itself informative.

_Seen 2×. First written 2026-10-02, last reinforced 2026-10-02._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-02 | CCG | neutral | +7.9% | Distribution update |
| 2026-10-02 | CCG | neutral | +7.9% | Distribution update |

### L128 — Share Purchase Plan 'Notice of Access' filing at a stock at a 12-month low, where the SPP follows a completed placement and existing retail shareholders are being offered participation at the same or near-same price as the placement

A Notice of Access for an SPP is not a dilution event — the dilutive placement has already closed and the SPP gives existing holders a right to participate at the same price, which at a 12-month low functions as a funded-catalyst and floor-setting signal for retail holders who were excluded from the placement; default to neutral rather than bearish when the SPP is participatory and no punitive terms or going-concern language appear in the headline, applying the same participatory-vs-exclusionary distinction as L041.

_Seen 2×. First written 2026-10-05, last reinforced 2026-10-05._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-05 | MGT | bearish | +7.1% | Notice of Access - Share Purchase Plan |
| 2026-10-05 | MGT | bearish | +7.1% | Notice of Access - Share Purchase Plan |

### L153 — Market-sensitive 'sales and gross profit accelerate' or equivalent revenue-momentum headline at a deeply de-rated (>60% below 12-month high) consumer-facing micro-cap with near-zero absolute liquidity (median daily turnover <A$5,000/day), where no specific revenue quantum, margin figure, or cash-runway disclosure appears in the headline

Before calling bullish on a qualitative revenue-acceleration headline at a near-zero-liquidity consumer micro-cap, ask whether the headline discloses an actual number (revenue figure, gross margin percentage, cash runway quarter count) that the market can use to update its going-concern or dilution model — 'accelerate' and 'improve' are directional descriptors, not quantitative anchors; if the headline contains only qualitative momentum language without a disclosed metric, default to neutral rather than bullish, because the market at this de-rating level requires a number to close the gap between the current price and any recovery thesis, and qualitative language alone frequently disappoints implicit expectations.

_Seen 2×. First written 2026-10-13, last reinforced 2026-10-13._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-13 | EXL | bullish | -14.3% | Elixinol Hemp Sales and Gross Profit Accelerate |
| 2026-10-13 | EXL | bullish | -14.3% | Elixinol Hemp Sales and Gross Profit Accelerate |

### L154 — Technical due diligence programme commencement announcement (not flagged market sensitive, no result disclosed) at an oil and gas junior at a 12-month low with suppressed pre-announcement volume (<0.5x average), where the headline names a specific well or asset and frames the activity as 'due diligence' rather than 'drilling' or 'production'

A technical due diligence commencement on a named well or asset at an oil and gas junior implies a potential acquisition, farm-in, or transaction decision is being evaluated — it is not a pure programme statement under L002 but a pre-transaction assessment signal; when the stock is at a 12-month low and volume is suppressed, lean neutral-to-bullish rather than neutral, because the due diligence framing implies a named asset and a named decision window that the market may not have priced, and the suppressed volume removes sell-the-news risk.

_Seen 2×. First written 2026-10-13, last reinforced 2026-10-13._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-13 | BUY | neutral | +14.3% | LB-32 TECHNICAL DUE DILIGENCE PROGRAM COMMENCES |
| 2026-10-13 | BUY | neutral | +14.3% | LB-32 TECHNICAL DUE DILIGENCE PROGRAM COMMENCES |

### L156 — 'Becoming a substantial holder' filing by a named global custodian bank (e.g. MUFG, Citibank, HSBC, BNP Paribas) rather than a named fund manager or strategic investor, at a junior miner or explorer with no price action data available

A custodian bank crossing the 5% threshold is almost always a passive aggregation of client positions rather than a discretionary investment decision — do not apply L029's bullish prior to custodian-bank substantial-holder filings; default to neutral, because the 'becoming' language reflects administrative threshold-crossing by a nominee structure rather than informed accumulation, and the market may actually read the filing as a signal that a prior raise has just settled and new supply is entering the register.

_Seen 2×. First written 2026-10-13, last reinforced 2026-10-29._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-29 | JRL | bullish | -11.6% | Initial Substantial Holder Notices |
| 2026-10-13 | VMM | neutral | -10.8% | Becoming a substantial holder from MUFG |

### L162 — Named M&A acquisition presentation (investor presentation explicitly titled around a named target project/asset acquisition) at a junior 50%+ below its 12-month high, not flagged market sensitive, with no disclosed transaction terms (consideration, structure, conditionality) in the headline

A named-acquisition presentation without disclosed consideration or conditionality signals that the deal may be aspirational, conditional, or unfunded — the market frequently reads the absence of binding terms as a negative signal (execution risk, balance-sheet concern, or overpayment risk); default to bearish rather than neutral when no terms are disclosed and the filing is unflagged, because the presentation is more likely to raise questions about how the junior funds the acquisition than to create re-rating confidence.

_Seen 2×. First written 2026-10-14, last reinforced 2026-10-14._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-14 | AKN | neutral | -12.7% | Presentation re Acquisition of Greenland Niobium Project |
| 2026-10-14 | AKN | neutral | -12.7% | Presentation re Acquisition of Greenland Niobium Project |

### L167 — Proposed issue of securities filing (not flagged market sensitive) accompanied by elevated 5-day volume (>1.5x average), where no use-of-proceeds information is visible in the headline and no companion announcement names a specific operational catalyst

A proposed-issue notice into elevated volume without a named use of proceeds confirms dilution is imminent and the elevated volume reflects placement marketing or holder exit ahead of the raise — call bearish rather than neutral in this configuration, because the raise has not yet closed (unlike a cleansing notice) and the overhang is forward-looking rather than already absorbed.

_Seen 2×. First written 2026-10-15, last reinforced 2026-10-15._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-15 | GW1 | neutral | -9.9% | Proposed issue of securities - GW1 |
| 2026-10-15 | GW1 | neutral | -9.9% | Proposed issue of securities - GW1 |

### L204 — Initial Director's Interest Notice at a liquid, institutionally covered mid-to-large-cap ASX stock (not a distressed junior) with volume running above average (>1.5x), where the stock is near a multi-month high and no market-sensitive flag is present

At a covered, liquid mid-to-large-cap near its high, elevated volume into an initial director interest notice is more likely to reflect unrelated institutional distribution coinciding with a routine compliance filing than constructive insider buying — call bearish on the volume-into-strength signal rather than neutral on the filing, because the informed-seller-into-strength base rate dominates the constructive-purchase interpretation when the stock is extended and the market is liquid enough for institutions to exit.

_Seen 2×. First written 2026-10-22, last reinforced 2026-10-22._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-22 | NCK | neutral | -14.9% | Initial Director's Interest Notice - C Garnsey |
| 2026-10-22 | NCK | neutral | -14.9% | Initial Director's Interest Notice - C Garnsey |

### L205 — Market-sensitive investor presentation filed on the same day as a quarterly cashflow report (4C) by a clinical-stage or pre-revenue biotech at a 12-month low, where the presentation is the narrative companion to the 4C rather than a standalone strategic update

When a market-sensitive investor presentation and a quarterly cashflow report are filed simultaneously, treat the 4C as the dominant document — the presentation is the spin layer and the cashflow is the hard data; do not call neutral on the presentation in isolation when the companion 4C introduces going-concern or runway risk that the presentation cannot offset, and lean bearish when the 4C is the primary price-moving document.

_Seen 2×. First written 2026-10-22, last reinforced 2026-10-27._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-27 | BOT | neutral | -15.8% | Botanix Quarterly Activities Report and Appendix 4C Q1 FY27 |
| 2026-10-22 | OCC | neutral | -12.1% | Q1 FY27 OCC Investor Presentation |

### L215 — Named technical quality improvement announcement ('significantly improves X quality', 'achieves Y specification') flagged market sensitive at a materials or battery-chemistry micro-cap 50%+ below its 12-month high, where the improvement is in a precursor, intermediate, or process output (not a final product) and no independent validation or named customer confirmation is disclosed in the headline

A quality-improvement claim without independent validation or named customer confirmation is a self-reported technical milestone — it removes no commercial risk because offtake partners require third-party verification before contracting; before calling bullish, ask whether the result is independently validated or customer-confirmed, and default to neutral rather than bullish when only internal characterisation is implied by the headline, because the market will immediately discount a self-reported claim at a deeply de-rated micro-cap.

_Seen 2×. First written 2026-10-26, last reinforced 2026-10-26._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-26 | FRB | bullish | -14.4% | Firebird Significantly Improves LMR Precursor Quality |
| 2026-10-26 | FRB | bullish | -14.4% | Firebird Significantly Improves LMR Precursor Quality |

### L223 — Results of Meeting filing at a non-distressed, revenue-generating mid-to-small-cap (electrical contractor, industrial services, or equivalent operating business), not flagged market sensitive, with no price action data available

At an established, revenue-generating operating company (not a distressed junior), a Results of Meeting filing with no market-sensitive flag and no disclosed resolution failure has a materially higher base rate of passing all resolutions cleanly than at a distressed micro-cap — and a clean pass on remuneration or strategic resolutions can itself trigger a relief-buying or short-covering reaction at a depressed price; default to neutral-to-bullish rather than purely neutral when the company is an operating business with identifiable revenue, because the AGM clean-pass signal functions as a governance floor that distressed-register logic does not apply to.

_Seen 2×. First written 2026-10-27, last reinforced 2026-10-27._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-27 | SXE | neutral | +13.1% | Results of Meeting |
| 2026-10-27 | SXE | neutral | +13.1% | Results of Meeting |

### L230 — Market-sensitive 'Quarterly Update and Outlook' filing from a producing mid-tier miner (not a junior explorer or pre-revenue company), with no price action data available, where the headline explicitly includes 'Outlook' language implying forward guidance is the primary content

An 'Outlook' component in a producing miner's market-sensitive quarterly is the market-moving element, not the backward-looking operational summary; when a producing miner with institutional coverage uses 'Outlook' in the headline of a market-sensitive quarterly, the filing asymmetrically skews bullish at a depressed price — producers flag quarterly outlooks as market sensitive primarily when guidance is being maintained or upgraded, not cut (cuts are typically disclosed via separate profit warning filings); lean neutral-to-bullish rather than neutral when the headline names both a quarter and an outlook and the company is an operating miner with institutional coverage.

_Seen 2×. First written 2026-10-28, last reinforced 2026-10-28._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-28 | AMI | neutral | +10.3% | Quarterly Update and Outlook - September 2026 |
| 2026-10-28 | AMI | neutral | +10.3% | Quarterly Update and Outlook - September 2026 |

### L231 — Market-sensitive combined quarterly activities and Appendix 4C/5B cash flow report at a clinical-stage biotech, commercial-stage pharmaceutical, or revenue-generating life sciences company with no price action data available, where the company is not a junior mineral explorer and has an identifiable commercial or clinical catalyst pipeline

Do not apply L197's bearish default to market-sensitive quarterlies at non-explorer companies — for clinical biotechs and commercial pharma, the activities component (milestone achievement, partnership update, revenue ramp) is as likely to be the market-moving element as the cashflow component; default to neutral rather than bearish when the company has a named product or clinical programme, and require body-level confirmation of a going-concern qualifier before leaning bearish.

_Seen 2×. First written 2026-10-29, last reinforced 2026-10-29._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-29 | MSB | neutral | +22.9% | Quarterly Activities/Appendix 4C Cash Flow Report |
| 2026-10-29 | MSB | neutral | +22.9% | Quarterly Activities/Appendix 4C Cash Flow Report |

### L232 — Market-sensitive combined quarterly activities and Appendix 4C/5B cash flow report where no company sector, de-rating level, or liquidity profile is available (truly information-free context beyond the filing type and flag)

When context is entirely absent (no sector, no price position, no volume, no liquidity), do not apply L197's bearish default — L197 requires confirmed de-rating and near-zero liquidity to fire; without those conditions verified, the market-sensitive flag is the only signal and it is symmetric; call neutral and require at least one contextual anchor (de-rating level or sector) before leaning directional.

_Seen 2×. First written 2026-10-29, last reinforced 2026-10-29._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-29 | REC | neutral | +17.7% | Quarterly Activities/Appendix 5B Cash Flow Report |
| 2026-10-29 | JNS | neutral | -21.2% | Quarterly Activities/Appendix 4C Cash Flow Report |
| 2026-10-29 | JNS | neutral | -21.2% | Quarterly Activities/Appendix 4C Cash Flow Report |

### L233 — Market-sensitive combined quarterly activities and Appendix 4C/5B cash flow report at a 12-month low with elevated volume (>2x average) and near-zero absolute liquidity (median daily turnover <A$5,000/day), where the company sector is not a pure junior mineral explorer (e.g. technology, media, services, or a junior with a named commercial product)

L197's bearish default was built for junior mineral explorers where the cashflow component dominates and the activities section cannot offset it; when the company has any commercial revenue, named product, or technology application, the activities component may contain a revenue or contract milestone that is the actual market-moving event; do not apply L197 mechanically to non-explorer micro-caps at 12-month lows with elevated volume — default to neutral rather than bearish, and reserve bearish for confirmed going-concern language in the filing body.

_Seen 2×. First written 2026-10-29, last reinforced 2026-10-29._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-29 | IOV | neutral | +16.0% | Quarterly Activities/Appendix 4C Cash Flow Report |
| 2026-10-29 | VNL | bearish | +20.9% | Quarterly Activities/Appendix 4C Cash Flow Report |
| 2026-10-29 | VNL | bearish | +20.9% | Quarterly Activities/Appendix 4C Cash Flow Report |

### L234 — Market-sensitive combined quarterly activities and Appendix 5B cash flow report at a stock at a 12-month low with near-zero absolute liquidity (median daily turnover <A$2,000/day) and no volume data available, where no sector or company profile information is provided beyond the ticker

When no sector, volume, or company context is available beyond a 12-month-low price position and near-zero liquidity, L197's bearish default should not be applied — the bearish inference requires knowing that the cashflow component dominates, which depends on the company being a cash-burning junior without revenue; absent that confirmation, call neutral and flag the 12-month low as the sole bearish anchor rather than applying L197 mechanically.

_Seen 2×. First written 2026-10-29, last reinforced 2026-10-29._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-29 | PLC | neutral | +19.5% | Quarterly Activities/Appendix 5B Cash Flow Report |
| 2026-10-29 | PLC | neutral | +19.5% | Quarterly Activities/Appendix 5B Cash Flow Report |

### L235 — Market-sensitive order or contract announcement at a deeply de-rated micro-cap (>70% below 12-month high) with suppressed pre-announcement volume (<0.5x average), where the headline discloses a specific dollar value (e.g. A$475k) for a named product in a named international market

A market-sensitive contract win with a disclosed dollar value is categorically different from L006's undisclosed-value contract win — the presence of a specific quantum removes the primary reason to default to neutral; when a dollar figure appears in the headline alongside a named product and named geography at a deeply de-rated stock with suppressed volume (no crowded long to unwind), lean bullish rather than neutral, because the disclosed value allows the market to size the earnings impact and the suppressed volume eliminates sell-the-news risk.

_Seen 2×. First written 2026-10-29, last reinforced 2026-10-29._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-29 | EDE | neutral | +18.8% | Further A$475k South American order for EdenCrete Pz7 |
| 2026-10-29 | EDE | neutral | +18.8% | Further A$475k South American order for EdenCrete Pz7 |

### L236 — Market-sensitive combined quarterly activities and Appendix 5B cash flow report at a gold or precious metals junior explorer 60-70% below its 12-month high with near-zero absolute liquidity (median daily turnover <A$10,000/day), where the exploration activities component may contain a named drill result, assay, or resource update alongside the cashflow disclosure

Before applying L197's bearish default to a gold or metals junior quarterly, ask whether the activities section likely contains a named exploration result (assay, resource) that would have been separately flagged if it were the primary catalyst — if no companion exploration result announcement was filed, the activities section may contain incremental positive news that the market treats as the operative signal; default to neutral rather than bearish when the quarterly is the sole filing and no companion exploration result accompanies it, because the activities positive may offset the cashflow negative at a stock already priced for maximum distress.

_Seen 2×. First written 2026-10-29, last reinforced 2026-10-29._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-29 | KNB | bearish | +17.1% | Quarterly Activities/Appendix 5B Cash Flow Report |
| 2026-10-29 | KNB | bearish | +17.1% | Quarterly Activities/Appendix 5B Cash Flow Report |

### L237 — Market-sensitive quarterly report at a critical minerals or advanced materials company (titanium, scandium, vanadium, rare earths, or equivalent strategic commodity) 70%+ below its 12-month high, where the company has known US or allied-government strategic significance (e.g. US critical minerals designation, DoD supplier, EXIM-backed project) and no price action data is available

For critical-minerals companies with identified government-strategic significance, a market-sensitive quarterly at a deeply de-rated price carries asymmetric upside — the activities component may contain a policy, funding, or offtake update that dwarfs the cashflow risk; do not apply L197's bearish default to critical-minerals companies with named government relationships; default to neutral and require body-level confirmation of a cashflow crisis before leaning bearish, because the funded-catalyst pipeline from government relationships is the dominant narrative at these de-rating levels.

_Seen 2×. First written 2026-10-29, last reinforced 2026-10-29._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-29 | IPX | neutral | +16.2% | September 2026 Quarterly Report |
| 2026-10-29 | IPX | neutral | +16.2% | September 2026 Quarterly Report |

### L238 — Market-sensitive operational progress announcement ('Advances Towards First Production', 'Approaching First Output') at a deeply de-rated micro-cap (>60% below 12-month high) with near-zero absolute liquidity (median daily turnover <A$10,000/day) and elevated relative volume (1.5–2x average), where the headline names a specific commercial product in an active thematic (antimony, critical minerals, battery materials) and production is the named near-term milestone

An 'advances towards first production' headline at a deeply de-rated thematic-commodity micro-cap is categorically different from a generic project-update under L058 — it signals a discrete phase transition from development to production-revenue status that the market prices as a binary re-rating event; do not apply L058's neutral default when the headline names first production as the imminent milestone and the commodity is in an active thematic; lean neutral-to-bullish rather than neutral, because the production-commencement narrative at a stock priced for near-zero recovery creates asymmetric upside even without a confirmed first-output date.

_Seen 2×. First written 2026-10-29, last reinforced 2026-10-29._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-29 | ANT | neutral | +13.8% | ANT Advances Towards First Antimony Concentrate Production |
| 2026-10-29 | ANT | neutral | +13.8% | ANT Advances Towards First Antimony Concentrate Production |

### L239 — Market-sensitive combined quarterly activities and Appendix 4C/5B cash flow report at a uranium or critical-minerals junior 75%+ below its 12-month high with near-zero absolute liquidity (median daily turnover <A$500/day) and elevated relative volume (>2x average), where the uranium or thematic-sector cycle is actively supportive

L197's bearish default was calibrated for generic distressed juniors; at uranium and thematic-sector juniors with extreme de-ratings (>75%) and near-zero absolute liquidity, even a small positive activities disclosure (permit progress, drill start, policy update) can produce a disproportionate price response against a near-zero bid; do not apply L197 to uranium or active-thematic juniors at extreme de-ratings — default to neutral rather than bearish, and apply L050-style thematic logic: ask whether the sector is in an active re-rating cycle before concluding the cashflow risk dominates.

_Seen 2×. First written 2026-10-29, last reinforced 2026-10-29._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-29 | GTI | bearish | +13.8% | Quarterly Activities/Appendix 4C Cash Flow Report |
| 2026-10-29 | GTI | bearish | +13.8% | Quarterly Activities/Appendix 4C Cash Flow Report |

### L240 — Market-sensitive combined quarterly activities and Appendix 5B cash flow report at a junior resources company exactly at the 60% de-rating threshold (58–62% below 12-month high) with near-zero absolute liquidity (median daily turnover <A$7,000/day) and suppressed pre-announcement volume (<0.6x average)

L197's bearish trigger requires the de-rating to be materially at or above 60% — at the boundary (58–62%), the cashflow-dominates-activities logic is not fully established, and suppressed volume (not elevated) removes the distribution-ahead-of-bad-news signal that reinforces L197; do not apply L197's bearish call when volume is suppressed and the de-rating is at the threshold boundary; default to neutral rather than bearish, reserving bearish for confirmed >65% de-ratings with elevated volume or explicit cashflow-crisis language.

_Seen 2×. First written 2026-10-29, last reinforced 2026-10-29._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-29 | LRM | bearish | +12.8% | Quarterly Activities/Appendix 5B Cash Flow Report |
| 2026-10-29 | LRM | bearish | +12.8% | Quarterly Activities/Appendix 5B Cash Flow Report |

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

### L083 — Market-sensitive drill programme scale announcement ('X,000m drill program') combined with a named structural extension result ('extended by Ym') at a junior explorer, with pre-announcement volume below average (<0.6x) and no price-position data indicating stock is near a high

Before calling bullish on a programme-scale-plus-extension headline, ask whether the extension result is characterised by geometry alone (strike length added, no grade or width) — if so, apply L054/L018 logic: the extension is not economically quantifiable without grade data and the programme-scale framing does not substitute for that missing information; default to neutral rather than bullish when the headline pairs programme scale with a geometry-only extension and no grade or width is disclosed.

_Seen 1×. First written 2026-09-24, last reinforced 2026-09-24._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-09-24 | KAO | bullish | -11.4% | 15,000m drill program and Donkey Hill extended by 700m |

### L117 — Named senior board appointments (Chair, Deputy Chair, or equivalent) at a stock at or near a 12-month high, not flagged market sensitive, where the appointee's credentials are not disclosed in the headline and the company is in a sector with active M&A or partnering activity

A chair appointment at a 12-month high without disclosed appointee credentials or a market-sensitive flag signals governance maintenance rather than a positive catalyst — the stock is already extended and the filing delivers no new economic information; call bearish rather than neutral, because the appointment removes no known risk and creates no new upside, leaving the extended tape vulnerable to any adverse read on the new chair's background or to a simple sell-the-news reaction from holders who bought in anticipation of a more substantive announcement.

_Seen 1×. First written 2026-10-01, last reinforced 2026-10-01._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-01 | SPL | neutral | -6.6% | Chair and Deputy Chair Appointments |

### L164 — Market-sensitive survey commencement announcement (geo-spectral, hyperspectral, or equivalent optical/remote-sensing survey) at a near-zero-liquidity junior explorer with deeply suppressed pre-announcement volume (<0.2x average), where the survey targets a named, historically significant project (e.g. a past-producer or named gold field)

L008's neutral-to-bearish default was built for elevated-volume scenarios where speculative pre-positioning is vulnerable to unwind; when volume is deeply suppressed (no crowded long) and the survey is market-sensitive at a named historical project, the sell-the-news risk is absent and the filing may be the first operational activity signal a news-starved register has seen; do not apply L008 when pre-announcement volume is below 0.3x average — default to neutral rather than neutral-to-bearish, and lean neutral-to-bullish when the project has a named historical production or discovery context.

_Seen 1×. First written 2026-10-14, last reinforced 2026-10-14._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-14 | PLC | neutral | -13.7% | Geo-Spectral Survey Commences at Abbotts Gold Project, WA |

### L188 — Named commercial software or product version release ('V2.0', 'Version X') announced as market sensitive at a deeply de-rated technology company (50%+ below 12-month high), where no price action data is available and no named customer, contract, or revenue figure accompanies the release

Before calling bullish on a version-release milestone at a deeply de-rated tech company, ask whether the release itself converts to revenue or merely removes delivery risk — a product version release without a named customer, signed contract, or disclosed revenue pipeline is a development milestone, not a commercial milestone, and the market at this de-rating level requires a commercial anchor to re-rate; default to neutral rather than bullish when no customer or revenue data accompanies the release, because execution risk has been replaced by commercialisation risk which the filing does not address.

_Seen 1×. First written 2026-10-20, last reinforced 2026-10-20._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-20 | FTI | bullish | -8.6% | NOL8 Releases Commercial Software V2.0 Ahead of Schedule |

### L194 — Non-market-sensitive drilling programme update headline (no assay, no resource, no discovery named) at a junior explorer 60%+ below its 12-month high, with pre-announcement volume running >2.5x average and near-zero absolute liquidity (median daily turnover <A$10,000/day)

When volume is extreme relative to a near-zero base on a non-flagged drilling update at a deeply de-rated junior, do not default to L058's neutral — ask whether the volume spike reflects informed accumulation ahead of body-level content (assay results, discovery language, resource update) that the headline understates; lean neutral-to-bullish rather than neutral when the volume ratio exceeds 2.5x and the stock is at a significant de-rating, because at near-zero absolute liquidity a ratio of this magnitude implies a specific buyer is positioned ahead of news the headline obscures.

_Seen 1×. First written 2026-10-21, last reinforced 2026-10-21._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-21 | BUX | neutral | +9.8% | Wolverine Project - Drilling Program Update |

### L202 — Initial Director's Interest Notice at a non-distressed, mid-to-large-cap ASX stock (not a junior explorer) with volume running above average (>1.5x), where the stock has no specific price-distress context and the filing is not flagged market sensitive

At a liquid, covered mid-to-large-cap, an initial director interest notice into elevated volume is more likely to reflect a newly appointed director disclosing a pre-existing holding (no incremental buying signal) coinciding with unrelated distribution by institutional holders — do not call neutral when elevated volume at a non-distressed covered stock is the dominant tape signal; ask whether the volume predates and is unrelated to the filing, and if so lean bearish on the volume signal rather than treating the filing as directionally inert.

_Seen 1×. First written 2026-10-22, last reinforced 2026-10-22._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-22 | NCK | neutral | -14.9% | Initial Director's Interest Notice - C Garnsey |

### L206 — Non-market-sensitive investor presentation on a named foreign-jurisdiction gold portfolio (e.g. West Africa) at a near-zero-liquidity micro-cap with volume running 2–3x average on a near-zero absolute base, where the presentation names a geographic region and a commodity but no specific milestone

When a non-flagged presentation names a frontier or elevated-risk jurisdiction (e.g. Côte d'Ivoire, DRC, Guinea) as the portfolio descriptor, apply L091's sovereign-risk logic by analogy — the jurisdiction name itself is a latent negative qualifier that the market may re-read as a risk flag rather than an opportunity framing; default to bearish rather than neutral when the presentation names a high-sovereign-risk jurisdiction with no disclosed resource, partner, or permit, because the filing may remind holders of the risk rather than attracting new buyers.

_Seen 1×. First written 2026-10-22, last reinforced 2026-10-22._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-22 | EMA | neutral | -8.7% | Cote D Ivoire Strategic Gold Portfolio Investor Presentation |

### L216 — Named commercial site launch or deployment announcement (market-sensitive) at a technology micro-cap 60%+ below its 12-month high, where the named location is a single site with no disclosed revenue quantum, contract value, or rollout pipeline in the headline

Apply L006's logic to commercial deployment announcements: a named single-site launch without a disclosed revenue figure or rollout pipeline is not a commercial scale signal — it is a proof-of-concept event whose economic impact the market cannot size; default to neutral rather than bullish when only one named location is disclosed and no revenue or pipeline quantum accompanies it, because the gap between a single live site and a re-rating thesis is too large for the headline alone to bridge at a deeply de-rated stock.

_Seen 1×. First written 2026-10-26, last reinforced 2026-10-26._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-26 | X2M | bullish | -20.2% | X2M Smart Energy Launches at McMahons Place Echuca |

### L224 — Market-sensitive quarterly Appendix 4C at a company under formal administration or deed of company arrangement (DOCA), trading at a multi-month low, where the 4C is the primary periodic liquidity and trading update during the administration period

At a company in active administration, the quarterly 4C is read through the lens of administration survival rather than ordinary going-concern analysis — any disclosure of continued casino or operational trading volumes, even at reduced levels, signals the business is still running and reduces the probability of immediate equity wipeout; do not default to bearish on a market-sensitive 4C at an administered company at a multi-month low without first asking whether the content confirms operational continuity, because the equity market at administration-distress prices is pricing near-zero and any non-catastrophic operational update is asymmetrically bullish relative to that base.

_Seen 1×. First written 2026-10-27, last reinforced 2026-10-27._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-27 | SGR | bearish | +12.6% | Quarterly Activities/Appendix 4C Cash Flow Report |

### L241 — Change in substantial holding (direction ambiguous) at a junior metals or resources company with no price action data available and no market-sensitive flag, where the filing is not 'becoming' and no prior de-rating or liquidity context is known

When no price action, de-rating, or liquidity data is available to anchor the L109 or L001 frameworks, an ambiguous substantial-holder change at a junior metals company should be called bearish rather than neutral — the base rate for existing substantial holders filing a change notice at juniors is weighted toward partial exit (profit-taking or stop-loss) over accumulation, because holders who are increasing typically wait to cross a new 1% disclosure increment before filing, while reductions trigger mandatory disclosure immediately at any fractional change.

_Seen 1×. First written 2026-10-29, last reinforced 2026-10-29._

| Date | Ticker | Called | Move | Headline |
| --- | --- | --- | ---: | --- |
| 2026-10-29 | SKY | neutral | -18.0% | Change in substantial holding |

## Dormant

Earned their place once and have not recurred since. Kept for the record.

_None yet._
