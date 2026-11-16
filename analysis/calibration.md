# Calibration

What the sentiment calls have actually been worth, regenerated after each
close by `calibration.py` and pasted into the next day's prompt. Nothing
here is hand-written; edit `calibration.py` if a finding is wrong.

- Window: last 20 trading days, 5387 graded calls
- Dead band: moves under 1% net of the ASX 200 count as no move
- Generated: 2026-11-16T08:53:31.714486+00:00

## Headline

Directional calls (bullish/bearish): **59.4%** correct on 1213 graded calls.

| Label | Graded | Hit rate |
| --- | ---: | ---: |
| bullish | 734 | 59.3% |
| bearish | 479 | 59.5% |

## Does the label separate from the base rate?

Stocks called neutral moved 1% or more anyway **58.4%** of the time (n=3403). Every graded announcement moved 59.5% of the time.

The gap between those two numbers is the whole information content of a neutral
call. It is small. Part of that is the measurement: the grading window is the
full session, so a stock that moved on something else entirely is counted
against the label. Part of it is not.

## Where the calls hold up, and where they do not

| Filing | Graded | Hit rate |
| --- | ---: | ---: |
| Market sensitive | 786 | 61.5% |
| Not flagged | 427 | 55.5% |

The exchange's own flag is doing more work than the model is. On unflagged
filings the directional calls are close to a coin flip.

| Document type | Graded | Hit rate |
| --- | ---: | ---: |
| Market Update | 731 | 59.5% |
| Quarterly Report | 183 | 61.2% |
| Annual General Meeting | 114 | 60.5% |
| Substantial Holding | 62 | 48.4% |
| Results | 49 | 59.2% |

Document types with fewer than 30 graded calls are omitted rather
than shown with a caveat. They will appear as the sample fills in.

## Largest misses

| Ticker | Called | Move | Headline |
| --- | --- | ---: | --- |
| ZIP | bullish | -29.5% | 1Q FY27 results update |
| GW1 | bullish | -29.4% | Strategic Partnership with Atana Elements inc. |
| SGA | bearish | +28.1% | IMARC Revised Investor Presentation |
| WRX | bullish | -25.7% | Drilling Intersects Broad Shallow Silver Mineralisation |
| AX8 | bearish | +25.0% | Quarterly Activities/Appendix 5B Cash Flow Report |

Moves beyond ±30% are excluded from this list. At that size the
likelier explanation is a consolidation or a rights issue repricing the shares,
not news the model could have read. They still count in the hit rates above.
