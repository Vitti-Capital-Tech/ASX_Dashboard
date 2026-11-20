# Calibration

What the sentiment calls have actually been worth, regenerated after each
close by `calibration.py` and pasted into the next day's prompt. Nothing
here is hand-written; edit `calibration.py` if a finding is wrong.

- Window: last 20 trading days, 5132 graded calls
- Dead band: moves under 1% net of the ASX 200 count as no move
- Generated: 2026-11-20T10:42:50.727593+00:00

## Headline

Directional calls (bullish/bearish): **59.8%** correct on 1179 graded calls.

| Label | Graded | Hit rate |
| --- | ---: | ---: |
| bullish | 756 | 60.3% |
| bearish | 423 | 58.9% |

## Does the label separate from the base rate?

Stocks called neutral moved 1% or more anyway **61.4%** of the time (n=3324). Every graded announcement moved 62.8% of the time.

The gap between those two numbers is the whole information content of a neutral
call. It is small. Part of that is the measurement: the grading window is the
full session, so a stock that moved on something else entirely is counted
against the label. Part of it is not.

## Where the calls hold up, and where they do not

| Filing | Graded | Hit rate |
| --- | ---: | ---: |
| Market sensitive | 786 | 62.3% |
| Not flagged | 393 | 54.7% |

The exchange's own flag is doing more work than the model is. On unflagged
filings the directional calls are close to a coin flip.

| Document type | Graded | Hit rate |
| --- | ---: | ---: |
| Market Update | 747 | 60.1% |
| Quarterly Report | 166 | 62.7% |
| Annual General Meeting | 75 | 56% |
| Substantial Holding | 71 | 49.3% |
| Results | 44 | 63.6% |

Document types with fewer than 30 graded calls are omitted rather
than shown with a caveat. They will appear as the sample fills in.

## Largest misses

| Ticker | Called | Move | Headline |
| --- | --- | ---: | --- |
| GW1 | bullish | -29.4% | Strategic Partnership with Atana Elements inc. |
| TIO | bullish | -29.0% | Temas Signs Quebec RCL Contract and Appoints Anthony Travers |
| SGA | bearish | +28.1% | IMARC Revised Investor Presentation |
| WRX | bullish | -25.7% | Drilling Intersects Broad Shallow Silver Mineralisation |
| AX8 | bearish | +25.0% | Quarterly Activities/Appendix 5B Cash Flow Report |

Moves beyond ±30% are excluded from this list. At that size the
likelier explanation is a consolidation or a rights issue repricing the shares,
not news the model could have read. They still count in the hit rates above.
