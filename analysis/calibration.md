# Calibration

What the sentiment calls have actually been worth, regenerated after each
close by `calibration.py` and pasted into the next day's prompt. Nothing
here is hand-written; edit `calibration.py` if a finding is wrong.

- Window: last 7 trading days, 2165 graded calls
- Dead band: moves under 1% net of the ASX 200 count as no move
- Generated: 2026-09-14T07:51:25.329535+00:00

## Headline

Directional calls (bullish/bearish): **64%** correct on 456 graded calls.

| Label | Graded | Hit rate |
| --- | ---: | ---: |
| bullish | 352 | 64.5% |
| bearish | 104 | 62.5% |

## Does the label separate from the base rate?

Stocks called neutral moved 1% or more anyway **57.4%** of the time (n=1455). Every graded announcement moved 60.7% of the time.

The gap between those two numbers is the whole information content of a neutral
call. It is small. Part of that is the measurement: the grading window is the
full session, so a stock that moved on something else entirely is counted
against the label. Part of it is not.

## Where the calls hold up, and where they do not

| Filing | Graded | Hit rate |
| --- | ---: | ---: |
| Market sensitive | 244 | 69.7% |
| Not flagged | 212 | 57.5% |

The exchange's own flag is doing more work than the model is. On unflagged
filings the directional calls are close to a coin flip.

| Document type | Graded | Hit rate |
| --- | ---: | ---: |
| Market Update | 386 | 65.8% |

Document types with fewer than 30 graded calls are omitted rather
than shown with a caveat. They will appear as the sample fills in.

## Largest misses

| Ticker | Called | Move | Headline |
| --- | --- | ---: | --- |
| TSR | bearish | +27.9% | Proposed issue of securities - TSR |
| OSX | bullish | -19.9% | OSX secures market access to Thailand orthopaedic market |
| RRR | bearish | +15.7% | Response to ASX Price and Volume Query |
| PLC | bullish | -14.4% | Follow-Up RC Drilling Underway at Rochefort |
| MGU | bullish | -14.2% | Assays Define 32.5km2 Priority Area at Piracanjuba North |

Moves beyond ±30% are excluded from this list. At that size the
likelier explanation is a consolidation or a rights issue repricing the shares,
not news the model could have read. They still count in the hit rates above.
