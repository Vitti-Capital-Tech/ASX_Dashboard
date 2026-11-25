# Calibration

What the sentiment calls have actually been worth, regenerated after each
close by `calibration.py` and pasted into the next day's prompt. Nothing
here is hand-written; edit `calibration.py` if a finding is wrong.

- Window: last 20 trading days, 4818 graded calls
- Dead band: moves under 1% net of the ASX 200 count as no move
- Generated: 2026-11-25T08:43:22.024512+00:00

## Headline

Directional calls (bullish/bearish): **59.6%** correct on 1094 graded calls.

| Label | Graded | Hit rate |
| --- | ---: | ---: |
| bullish | 726 | 58.3% |
| bearish | 368 | 62.2% |

## Does the label separate from the base rate?

Stocks called neutral moved 1% or more anyway **62.6%** of the time (n=3194). Every graded announcement moved 64.3% of the time.

The gap between those two numbers is the whole information content of a neutral
call. It is small. Part of that is the measurement: the grading window is the
full session, so a stock that moved on something else entirely is counted
against the label. Part of it is not.

## Where the calls hold up, and where they do not

| Filing | Graded | Hit rate |
| --- | ---: | ---: |
| Market sensitive | 735 | 61.4% |
| Not flagged | 359 | 56% |

The exchange's own flag is doing more work than the model is. On unflagged
filings the directional calls are close to a coin flip.

| Document type | Graded | Hit rate |
| --- | ---: | ---: |
| Market Update | 710 | 58.3% |
| Quarterly Report | 132 | 66.7% |
| Substantial Holding | 65 | 55.4% |
| Annual General Meeting | 64 | 60.9% |
| Results | 48 | 56.2% |

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
