# Calibration

What the sentiment calls have actually been worth, regenerated after each
close by `calibration.py` and pasted into the next day's prompt. Nothing
here is hand-written; edit `calibration.py` if a finding is wrong.

- Window: last 20 trading days, 5651 graded calls
- Dead band: moves under 1% net of the ASX 200 count as no move
- Generated: 2026-10-27T10:48:52.053662+00:00

## Headline

Directional calls (bullish/bearish): **54%** correct on 1159 graded calls.

| Label | Graded | Hit rate |
| --- | ---: | ---: |
| bullish | 741 | 55.3% |
| bearish | 418 | 51.7% |

## Does the label separate from the base rate?

Stocks called neutral moved 1% or more anyway **57%** of the time (n=3780). Every graded announcement moved 59% of the time.

The gap between those two numbers is the whole information content of a neutral
call. It is small. Part of that is the measurement: the grading window is the
full session, so a stock that moved on something else entirely is counted
against the label. Part of it is not.

## Where the calls hold up, and where they do not

| Filing | Graded | Hit rate |
| --- | ---: | ---: |
| Market sensitive | 636 | 55.3% |
| Not flagged | 523 | 52.4% |

The exchange's own flag is doing more work than the model is. On unflagged
filings the directional calls are close to a coin flip.

| Document type | Graded | Hit rate |
| --- | ---: | ---: |
| Market Update | 844 | 54.3% |
| Substantial Holding | 81 | 50.6% |
| Annual General Meeting | 70 | 58.6% |
| Quarterly Report | 52 | 48.1% |
| Results | 39 | 56.4% |

Document types with fewer than 30 graded calls are omitted rather
than shown with a caveat. They will appear as the sample fills in.

## Largest misses

| Ticker | Called | Move | Headline |
| --- | --- | ---: | --- |
| ZIP | bullish | -29.5% | 1Q FY27 results update |
| ZNO | bearish | +28.5% | Quarterly Activities/Appendix 4C Cash Flow Report |
| POL | bullish | -26.3% | UML Development commences |
| BC8 | bullish | -25.7% | FY27 Guidance & Outlook |
| 1AD | bullish | -25.4% | RDTI receipt, Advanced Overseas Finding |

Moves beyond ±30% are excluded from this list. At that size the
likelier explanation is a consolidation or a rights issue repricing the shares,
not news the model could have read. They still count in the hit rates above.
