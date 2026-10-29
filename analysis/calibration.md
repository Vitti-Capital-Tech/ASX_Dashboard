# Calibration

What the sentiment calls have actually been worth, regenerated after each
close by `calibration.py` and pasted into the next day's prompt. Nothing
here is hand-written; edit `calibration.py` if a finding is wrong.

- Window: last 20 trading days, 5730 graded calls
- Dead band: moves under 1% net of the ASX 200 count as no move
- Generated: 2026-10-29T06:50:35.491265+00:00

## Headline

Directional calls (bullish/bearish): **54.9%** correct on 1214 graded calls.

| Label | Graded | Hit rate |
| --- | ---: | ---: |
| bullish | 728 | 55.8% |
| bearish | 486 | 53.5% |

## Does the label separate from the base rate?

Stocks called neutral moved 1% or more anyway **57.1%** of the time (n=3740). Every graded announcement moved 58.8% of the time.

The gap between those two numbers is the whole information content of a neutral
call. It is small. Part of that is the measurement: the grading window is the
full session, so a stock that moved on something else entirely is counted
against the label. Part of it is not.

## Where the calls hold up, and where they do not

| Filing | Graded | Hit rate |
| --- | ---: | ---: |
| Market sensitive | 689 | 56.5% |
| Not flagged | 525 | 52.8% |

The exchange's own flag is doing more work than the model is. On unflagged
filings the directional calls are close to a coin flip.

| Document type | Graded | Hit rate |
| --- | ---: | ---: |
| Market Update | 826 | 54.7% |
| Quarterly Report | 116 | 54.3% |
| Annual General Meeting | 85 | 62.4% |
| Substantial Holding | 84 | 48.8% |
| Results | 40 | 57.5% |

Document types with fewer than 30 graded calls are omitted rather
than shown with a caveat. They will appear as the sample fills in.

## Largest misses

| Ticker | Called | Move | Headline |
| --- | --- | ---: | --- |
| ZIP | bullish | -29.5% | 1Q FY27 results update |
| ZNO | bearish | +28.5% | Quarterly Activities/Appendix 4C Cash Flow Report |
| SGA | bearish | +28.1% | IMARC Revised Investor Presentation |
| POL | bullish | -26.3% | UML Development commences |
| 1AD | bullish | -25.4% | RDTI receipt, Advanced Overseas Finding |

Moves beyond ±30% are excluded from this list. At that size the
likelier explanation is a consolidation or a rights issue repricing the shares,
not news the model could have read. They still count in the hit rates above.
