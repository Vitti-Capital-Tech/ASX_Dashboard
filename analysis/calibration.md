# Calibration

What the sentiment calls have actually been worth, regenerated after each
close by `calibration.py` and pasted into the next day's prompt. Nothing
here is hand-written; edit `calibration.py` if a finding is wrong.

- Window: last 20 trading days, 5684 graded calls
- Dead band: moves under 1% net of the ASX 200 count as no move
- Generated: 2026-10-28T08:44:34.122787+00:00

## Headline

Directional calls (bullish/bearish): **54.3%** correct on 1209 graded calls.

| Label | Graded | Hit rate |
| --- | ---: | ---: |
| bullish | 754 | 56.6% |
| bearish | 455 | 50.3% |

## Does the label separate from the base rate?

Stocks called neutral moved 1% or more anyway **57.5%** of the time (n=3730). Every graded announcement moved 59.3% of the time.

The gap between those two numbers is the whole information content of a neutral
call. It is small. Part of that is the measurement: the grading window is the
full session, so a stock that moved on something else entirely is counted
against the label. Part of it is not.

## Where the calls hold up, and where they do not

| Filing | Graded | Hit rate |
| --- | ---: | ---: |
| Market sensitive | 663 | 56.3% |
| Not flagged | 546 | 51.8% |

The exchange's own flag is doing more work than the model is. On unflagged
filings the directional calls are close to a coin flip.

| Document type | Graded | Hit rate |
| --- | ---: | ---: |
| Market Update | 863 | 54.5% |
| Substantial Holding | 85 | 49.4% |
| Annual General Meeting | 79 | 60.8% |
| Quarterly Report | 69 | 49.3% |
| Results | 39 | 59% |

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
