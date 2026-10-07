# Calibration

What the sentiment calls have actually been worth, regenerated after each
close by `calibration.py` and pasted into the next day's prompt. Nothing
here is hand-written; edit `calibration.py` if a finding is wrong.

- Window: last 20 trading days, 4980 graded calls
- Dead band: moves under 1% net of the ASX 200 count as no move
- Generated: 2026-10-07T08:54:47.076656+00:00

## Headline

Directional calls (bullish/bearish): **56.3%** correct on 1037 graded calls.

| Label | Graded | Hit rate |
| --- | ---: | ---: |
| bullish | 709 | 59.5% |
| bearish | 328 | 49.4% |

## Does the label separate from the base rate?

Stocks called neutral moved 1% or more anyway **52.8%** of the time (n=3462). Every graded announcement moved 57.6% of the time.

The gap between those two numbers is the whole information content of a neutral
call. It is small. Part of that is the measurement: the grading window is the
full session, so a stock that moved on something else entirely is counted
against the label. Part of it is not.

## Where the calls hold up, and where they do not

| Filing | Graded | Hit rate |
| --- | ---: | ---: |
| Market sensitive | 591 | 58% |
| Not flagged | 446 | 54% |

The exchange's own flag is doing more work than the model is. On unflagged
filings the directional calls are close to a coin flip.

| Document type | Graded | Hit rate |
| --- | ---: | ---: |
| Market Update | 831 | 57.9% |
| Substantial Holding | 95 | 49.5% |
| Results | 37 | 54.1% |

Document types with fewer than 30 graded calls are omitted rather
than shown with a caveat. They will appear as the sample fills in.

## Largest misses

| Ticker | Called | Move | Headline |
| --- | --- | ---: | --- |
| BC8 | bullish | -25.7% | FY27 Guidance & Outlook |
| MEK | bullish | -25.5% | Institutional Placement Funding The Next Phase of Growth |
| IMA | bullish | -25.4% | Reinstatement to Quotation |
| LUX | bullish | -25.3% | First holes intersect zones of visual copper mineralisation |
| GLL | bearish | +25.1% | Prospectus |

Moves beyond ±30% are excluded from this list. At that size the
likelier explanation is a consolidation or a rights issue repricing the shares,
not news the model could have read. They still count in the hit rates above.
