# Calibration

What the sentiment calls have actually been worth, regenerated after each
close by `calibration.py` and pasted into the next day's prompt. Nothing
here is hand-written; edit `calibration.py` if a finding is wrong.

- Window: last 5 trading days, 1585 graded calls
- Dead band: moves under 1% net of the ASX 200 count as no move
- Generated: 2026-09-13T17:27:04.988233+00:00

## Headline

Directional calls (bullish/bearish): **65%** correct on 334 graded calls.

| Label | Graded | Hit rate |
| --- | ---: | ---: |
| bullish | 274 | 66.8% |
| bearish | 60 | 56.7% |

## Does the label separate from the base rate?

Stocks called neutral moved 1% or more anyway **59.8%** of the time (n=1050). Every graded announcement moved 62.1% of the time.

The gap between those two numbers is the whole information content of a neutral
call. It is small. Part of that is the measurement: the grading window is the
full session, so a stock that moved on something else entirely is counted
against the label. Part of it is not.

## Where the calls hold up, and where they do not

| Filing | Graded | Hit rate |
| --- | ---: | ---: |
| Market sensitive | 186 | 73.7% |
| Not flagged | 148 | 54.1% |

The exchange's own flag is doing more work than the model is. On unflagged
filings the directional calls are close to a coin flip.

| Document type | Graded | Hit rate |
| --- | ---: | ---: |
| Market Update | 284 | 66.9% |

Document types with fewer than 30 graded calls are omitted rather
than shown with a caveat. They will appear as the sample fills in.

## Largest misses

| Ticker | Called | Move | Headline |
| --- | --- | ---: | --- |
| TSR | bearish | +27.9% | Proposed issue of securities - TSR |
| OSX | bullish | -19.9% | OSX secures market access to Thailand orthopaedic market |
| RRR | bearish | +15.7% | Response to ASX Price and Volume Query |
| MGU | bullish | -14.2% | Assays Define 32.5km2 Priority Area at Piracanjuba North |
| CRR | bullish | -13.2% | Full-Format DSD Cell Sustains Month of Cycling |

Moves beyond ±30% are excluded from this list. At that size the
likelier explanation is a consolidation or a rights issue repricing the shares,
not news the model could have read. They still count in the hit rates above.
