# Calibration

What the sentiment calls have actually been worth, regenerated after each
close by `calibration.py` and pasted into the next day's prompt. Nothing
here is hand-written; edit `calibration.py` if a finding is wrong.

- Window: last 20 trading days, 5894 graded calls
- Dead band: moves under 1% net of the ASX 200 count as no move
- Generated: 2026-11-04T06:44:07.661048+00:00

## Headline

Directional calls (bullish/bearish): **56.9%** correct on 1289 graded calls.

| Label | Graded | Hit rate |
| --- | ---: | ---: |
| bullish | 736 | 55% |
| bearish | 553 | 59.3% |

## Does the label separate from the base rate?

Stocks called neutral moved 1% or more anyway **58%** of the time (n=3744). Every graded announcement moved 59% of the time.

The gap between those two numbers is the whole information content of a neutral
call. It is small. Part of that is the measurement: the grading window is the
full session, so a stock that moved on something else entirely is counted
against the label. Part of it is not.

## Where the calls hold up, and where they do not

| Filing | Graded | Hit rate |
| --- | ---: | ---: |
| Market sensitive | 775 | 58.8% |
| Not flagged | 514 | 53.9% |

The exchange's own flag is doing more work than the model is. On unflagged
filings the directional calls are close to a coin flip.

| Document type | Graded | Hit rate |
| --- | ---: | ---: |
| Market Update | 794 | 56.2% |
| Quarterly Report | 199 | 60.8% |
| Annual General Meeting | 102 | 63.7% |
| Substantial Holding | 78 | 47.4% |
| Results | 42 | 54.8% |

Document types with fewer than 30 graded calls are omitted rather
than shown with a caveat. They will appear as the sample fills in.

## Largest misses

| Ticker | Called | Move | Headline |
| --- | --- | ---: | --- |
| ZIP | bullish | -29.5% | 1Q FY27 results update |
| GW1 | bullish | -29.4% | Strategic Partnership with Atana Elements inc. |
| ZNO | bearish | +28.5% | Quarterly Activities/Appendix 4C Cash Flow Report |
| SGA | bearish | +28.1% | IMARC Revised Investor Presentation |
| POL | bullish | -26.3% | UML Development commences |

Moves beyond ±30% are excluded from this list. At that size the
likelier explanation is a consolidation or a rights issue repricing the shares,
not news the model could have read. They still count in the hit rates above.
