# Calibration

What the sentiment calls have actually been worth, regenerated after each
close by `calibration.py` and pasted into the next day's prompt. Nothing
here is hand-written; edit `calibration.py` if a finding is wrong.

- Window: last 20 trading days, 4943 graded calls
- Dead band: moves under 1% net of the ASX 200 count as no move
- Generated: 2026-11-24T08:41:30.052064+00:00

## Headline

Directional calls (bullish/bearish): **60%** correct on 1145 graded calls.

| Label | Graded | Hit rate |
| --- | ---: | ---: |
| bullish | 739 | 59.8% |
| bearish | 406 | 60.3% |

## Does the label separate from the base rate?

Stocks called neutral moved 1% or more anyway **62.3%** of the time (n=3224). Every graded announcement moved 63.8% of the time.

The gap between those two numbers is the whole information content of a neutral
call. It is small. Part of that is the measurement: the grading window is the
full session, so a stock that moved on something else entirely is counted
against the label. Part of it is not.

## Where the calls hold up, and where they do not

| Filing | Graded | Hit rate |
| --- | ---: | ---: |
| Market sensitive | 764 | 62.2% |
| Not flagged | 381 | 55.6% |

The exchange's own flag is doing more work than the model is. On unflagged
filings the directional calls are close to a coin flip.

| Document type | Graded | Hit rate |
| --- | ---: | ---: |
| Market Update | 737 | 59.3% |
| Quarterly Report | 149 | 65.1% |
| Substantial Holding | 68 | 55.9% |
| Annual General Meeting | 67 | 59.7% |
| Results | 49 | 59.2% |

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
