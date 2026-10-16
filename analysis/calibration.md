# Calibration

What the sentiment calls have actually been worth, regenerated after each
close by `calibration.py` and pasted into the next day's prompt. Nothing
here is hand-written; edit `calibration.py` if a finding is wrong.

- Window: last 20 trading days, 5199 graded calls
- Dead band: moves under 1% net of the ASX 200 count as no move
- Generated: 2026-10-16T08:52:00.656495+00:00

## Headline

Directional calls (bullish/bearish): **53.8%** correct on 1038 graded calls.

| Label | Graded | Hit rate |
| --- | ---: | ---: |
| bullish | 701 | 54.9% |
| bearish | 337 | 51.3% |

## Does the label separate from the base rate?

Stocks called neutral moved 1% or more anyway **55.6%** of the time (n=3660). Every graded announcement moved 59.4% of the time.

The gap between those two numbers is the whole information content of a neutral
call. It is small. Part of that is the measurement: the grading window is the
full session, so a stock that moved on something else entirely is counted
against the label. Part of it is not.

## Where the calls hold up, and where they do not

| Filing | Graded | Hit rate |
| --- | ---: | ---: |
| Market sensitive | 586 | 55.3% |
| Not flagged | 452 | 51.8% |

The exchange's own flag is doing more work than the model is. On unflagged
filings the directional calls are close to a coin flip.

| Document type | Graded | Hit rate |
| --- | ---: | ---: |
| Market Update | 810 | 54.2% |
| Substantial Holding | 105 | 53.3% |
| Results | 38 | 57.9% |

Document types with fewer than 30 graded calls are omitted rather
than shown with a caveat. They will appear as the sample fills in.

## Largest misses

| Ticker | Called | Move | Headline |
| --- | --- | ---: | --- |
| POL | bullish | -26.3% | UML Development commences |
| BC8 | bullish | -25.7% | FY27 Guidance & Outlook |
| MEK | bullish | -25.5% | Institutional Placement Funding The Next Phase of Growth |
| IMA | bullish | -25.4% | Reinstatement to Quotation |
| LUX | bullish | -25.3% | First holes intersect zones of visual copper mineralisation |

Moves beyond ±30% are excluded from this list. At that size the
likelier explanation is a consolidation or a rights issue repricing the shares,
not news the model could have read. They still count in the hit rates above.
