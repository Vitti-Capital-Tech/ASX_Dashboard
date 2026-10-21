# Calibration

What the sentiment calls have actually been worth, regenerated after each
close by `calibration.py` and pasted into the next day's prompt. Nothing
here is hand-written; edit `calibration.py` if a finding is wrong.

- Window: last 20 trading days, 5330 graded calls
- Dead band: moves under 1% net of the ASX 200 count as no move
- Generated: 2026-10-21T07:51:25.350360+00:00

## Headline

Directional calls (bullish/bearish): **53.5%** correct on 1050 graded calls.

| Label | Graded | Hit rate |
| --- | ---: | ---: |
| bullish | 709 | 54.7% |
| bearish | 341 | 51% |

## Does the label separate from the base rate?

Stocks called neutral moved 1% or more anyway **56%** of the time (n=3714). Every graded announcement moved 59% of the time.

The gap between those two numbers is the whole information content of a neutral
call. It is small. Part of that is the measurement: the grading window is the
full session, so a stock that moved on something else entirely is counted
against the label. Part of it is not.

## Where the calls hold up, and where they do not

| Filing | Graded | Hit rate |
| --- | ---: | ---: |
| Market sensitive | 592 | 55.9% |
| Not flagged | 458 | 50.4% |

The exchange's own flag is doing more work than the model is. On unflagged
filings the directional calls are close to a coin flip.

| Document type | Graded | Hit rate |
| --- | ---: | ---: |
| Market Update | 812 | 53.7% |
| Substantial Holding | 98 | 53.1% |
| Results | 35 | 60% |

Document types with fewer than 30 graded calls are omitted rather
than shown with a caveat. They will appear as the sample fills in.

## Largest misses

| Ticker | Called | Move | Headline |
| --- | --- | ---: | --- |
| ZNO | bearish | +28.5% | Quarterly Activities/Appendix 4C Cash Flow Report |
| POL | bullish | -26.3% | UML Development commences |
| BC8 | bullish | -25.7% | FY27 Guidance & Outlook |
| MEK | bullish | -25.5% | Institutional Placement Funding The Next Phase of Growth |
| 1AD | bullish | -25.4% | RDTI receipt, Advanced Overseas Finding |

Moves beyond ±30% are excluded from this list. At that size the
likelier explanation is a consolidation or a rights issue repricing the shares,
not news the model could have read. They still count in the hit rates above.
