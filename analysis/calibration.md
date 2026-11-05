# Calibration

What the sentiment calls have actually been worth, regenerated after each
close by `calibration.py` and pasted into the next day's prompt. Nothing
here is hand-written; edit `calibration.py` if a finding is wrong.

- Window: last 20 trading days, 5863 graded calls
- Dead band: moves under 1% net of the ASX 200 count as no move
- Generated: 2026-11-05T08:42:29.175190+00:00

## Headline

Directional calls (bullish/bearish): **57.2%** correct on 1294 graded calls.

| Label | Graded | Hit rate |
| --- | ---: | ---: |
| bullish | 743 | 55% |
| bearish | 551 | 60.1% |

## Does the label separate from the base rate?

Stocks called neutral moved 1% or more anyway **59.5%** of the time (n=3727). Every graded announcement moved 60.2% of the time.

The gap between those two numbers is the whole information content of a neutral
call. It is small. Part of that is the measurement: the grading window is the
full session, so a stock that moved on something else entirely is counted
against the label. Part of it is not.

## Where the calls hold up, and where they do not

| Filing | Graded | Hit rate |
| --- | ---: | ---: |
| Market sensitive | 779 | 59.3% |
| Not flagged | 515 | 54% |

The exchange's own flag is doing more work than the model is. On unflagged
filings the directional calls are close to a coin flip.

| Document type | Graded | Hit rate |
| --- | ---: | ---: |
| Market Update | 798 | 56.3% |
| Quarterly Report | 198 | 61.1% |
| Annual General Meeting | 108 | 63% |
| Substantial Holding | 71 | 49.3% |
| Results | 46 | 56.5% |

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
