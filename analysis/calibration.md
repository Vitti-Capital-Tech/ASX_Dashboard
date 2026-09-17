# Calibration

What the sentiment calls have actually been worth, regenerated after each
close by `calibration.py` and pasted into the next day's prompt. Nothing
here is hand-written; edit `calibration.py` if a finding is wrong.

- Window: last 10 trading days, 3038 graded calls
- Dead band: moves under 1% net of the ASX 200 count as no move
- Generated: 2026-09-17T08:48:36.019550+00:00

## Headline

Directional calls (bullish/bearish): **62.8%** correct on 643 graded calls.

| Label | Graded | Hit rate |
| --- | ---: | ---: |
| bullish | 446 | 63.5% |
| bearish | 197 | 61.4% |

## Does the label separate from the base rate?

Stocks called neutral moved 1% or more anyway **54.7%** of the time (n=2051). Every graded announcement moved 58.9% of the time.

The gap between those two numbers is the whole information content of a neutral
call. It is small. Part of that is the measurement: the grading window is the
full session, so a stock that moved on something else entirely is counted
against the label. Part of it is not.

## Where the calls hold up, and where they do not

| Filing | Graded | Hit rate |
| --- | ---: | ---: |
| Market sensitive | 329 | 66.6% |
| Not flagged | 314 | 58.9% |

The exchange's own flag is doing more work than the model is. On unflagged
filings the directional calls are close to a coin flip.

| Document type | Graded | Hit rate |
| --- | ---: | ---: |
| Market Update | 543 | 65% |

Document types with fewer than 30 graded calls are omitted rather
than shown with a caveat. They will appear as the sample fills in.

## Largest misses

| Ticker | Called | Move | Headline |
| --- | --- | ---: | --- |
| TSR | bearish | +27.9% | Proposed issue of securities - TSR |
| OSX | bullish | -19.9% | OSX secures market access to Thailand orthopaedic market |
| XST | bearish | +16.4% | Diona-1 Operations Update |
| CR3 | bearish | +16.2% | Investor Presentation - RIU Uranium Investment Day |
| RRR | bearish | +15.7% | Response to ASX Price and Volume Query |

Moves beyond ±30% are excluded from this list. At that size the
likelier explanation is a consolidation or a rights issue repricing the shares,
not news the model could have read. They still count in the hit rates above.
