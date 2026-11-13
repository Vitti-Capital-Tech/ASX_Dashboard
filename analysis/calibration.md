# Calibration

What the sentiment calls have actually been worth, regenerated after each
close by `calibration.py` and pasted into the next day's prompt. Nothing
here is hand-written; edit `calibration.py` if a finding is wrong.

- Window: last 20 trading days, 5491 graded calls
- Dead band: moves under 1% net of the ASX 200 count as no move
- Generated: 2026-11-13T10:41:43.950168+00:00

## Headline

Directional calls (bullish/bearish): **58.8%** correct on 1232 graded calls.

| Label | Graded | Hit rate |
| --- | ---: | ---: |
| bullish | 745 | 58.8% |
| bearish | 487 | 58.9% |

## Does the label separate from the base rate?

Stocks called neutral moved 1% or more anyway **58.8%** of the time (n=3464). Every graded announcement moved 59.6% of the time.

The gap between those two numbers is the whole information content of a neutral
call. It is small. Part of that is the measurement: the grading window is the
full session, so a stock that moved on something else entirely is counted
against the label. Part of it is not.

## Where the calls hold up, and where they do not

| Filing | Graded | Hit rate |
| --- | ---: | ---: |
| Market sensitive | 793 | 61.4% |
| Not flagged | 439 | 54.2% |

The exchange's own flag is doing more work than the model is. On unflagged
filings the directional calls are close to a coin flip.

| Document type | Graded | Hit rate |
| --- | ---: | ---: |
| Market Update | 746 | 59% |
| Quarterly Report | 190 | 61.1% |
| Annual General Meeting | 114 | 60.5% |
| Substantial Holding | 61 | 45.9% |
| Results | 50 | 58% |

Document types with fewer than 30 graded calls are omitted rather
than shown with a caveat. They will appear as the sample fills in.

## Largest misses

| Ticker | Called | Move | Headline |
| --- | --- | ---: | --- |
| ZIP | bullish | -29.5% | 1Q FY27 results update |
| GW1 | bullish | -29.4% | Strategic Partnership with Atana Elements inc. |
| ZNO | bearish | +28.5% | Quarterly Activities/Appendix 4C Cash Flow Report |
| SGA | bearish | +28.1% | IMARC Revised Investor Presentation |
| WRX | bullish | -25.7% | Drilling Intersects Broad Shallow Silver Mineralisation |

Moves beyond ±30% are excluded from this list. At that size the
likelier explanation is a consolidation or a rights issue repricing the shares,
not news the model could have read. They still count in the hit rates above.
