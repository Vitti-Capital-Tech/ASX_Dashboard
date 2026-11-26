# Calibration

What the sentiment calls have actually been worth, regenerated after each
close by `calibration.py` and pasted into the next day's prompt. Nothing
here is hand-written; edit `calibration.py` if a finding is wrong.

- Window: last 20 trading days, 4687 graded calls
- Dead band: moves under 1% net of the ASX 200 count as no move
- Generated: 2026-11-26T08:41:46.661681+00:00

## Headline

Directional calls (bullish/bearish): **59.1%** correct on 1067 graded calls.

| Label | Graded | Hit rate |
| --- | ---: | ---: |
| bullish | 732 | 58.9% |
| bearish | 335 | 59.7% |

## Does the label separate from the base rate?

Stocks called neutral moved 1% or more anyway **63.3%** of the time (n=3154). Every graded announcement moved 65.4% of the time.

The gap between those two numbers is the whole information content of a neutral
call. It is small. Part of that is the measurement: the grading window is the
full session, so a stock that moved on something else entirely is counted
against the label. Part of it is not.

## Where the calls hold up, and where they do not

| Filing | Graded | Hit rate |
| --- | ---: | ---: |
| Market sensitive | 690 | 62.2% |
| Not flagged | 377 | 53.6% |

The exchange's own flag is doing more work than the model is. On unflagged
filings the directional calls are close to a coin flip.

| Document type | Graded | Hit rate |
| --- | ---: | ---: |
| Market Update | 726 | 58.7% |
| Quarterly Report | 83 | 68.7% |
| Substantial Holding | 68 | 52.9% |
| Annual General Meeting | 62 | 56.5% |
| Results | 50 | 56% |

Document types with fewer than 30 graded calls are omitted rather
than shown with a caveat. They will appear as the sample fills in.

## Largest misses

| Ticker | Called | Move | Headline |
| --- | --- | ---: | --- |
| GW1 | bullish | -29.4% | Strategic Partnership with Atana Elements inc. |
| TIO | bullish | -29.0% | Temas Signs Quebec RCL Contract and Appoints Anthony Travers |
| WRX | bullish | -25.7% | Drilling Intersects Broad Shallow Silver Mineralisation |
| CQT | bearish | +25.4% | Significant Management & Operational Restructuring |
| CYL | bullish | -24.9% | Quarterly Activities Report - September 2026 |

Moves beyond ±30% are excluded from this list. At that size the
likelier explanation is a consolidation or a rights issue repricing the shares,
not news the model could have read. They still count in the hit rates above.
