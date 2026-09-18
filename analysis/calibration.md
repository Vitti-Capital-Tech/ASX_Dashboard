# Calibration

What the sentiment calls have actually been worth, regenerated after each
close by `calibration.py` and pasted into the next day's prompt. Nothing
here is hand-written; edit `calibration.py` if a finding is wrong.

- Window: last 20 trading days, 4587 graded calls
- Dead band: moves under 1% net of the ASX 200 count as no move
- Generated: 2026-09-18T08:49:27.522064+00:00

## Headline

Directional calls (bullish/bearish): **60.1%** correct on 998 graded calls.

| Label | Graded | Hit rate |
| --- | ---: | ---: |
| bullish | 777 | 61.6% |
| bearish | 221 | 54.8% |

## Does the label separate from the base rate?

Stocks called neutral moved 1% or more anyway **55.4%** of the time (n=3010). Every graded announcement moved 58.6% of the time.

The gap between those two numbers is the whole information content of a neutral
call. It is small. Part of that is the measurement: the grading window is the
full session, so a stock that moved on something else entirely is counted
against the label. Part of it is not.

## Where the calls hold up, and where they do not

| Filing | Graded | Hit rate |
| --- | ---: | ---: |
| Market sensitive | 570 | 65.3% |
| Not flagged | 428 | 53.3% |

The exchange's own flag is doing more work than the model is. On unflagged
filings the directional calls are close to a coin flip.

| Document type | Graded | Hit rate |
| --- | ---: | ---: |
| Market Update | 808 | 62.5% |
| Results | 50 | 46% |
| Substantial Holding | 49 | 36.7% |
| Dividend | 30 | 53.3% |

Document types with fewer than 30 graded calls are omitted rather
than shown with a caveat. They will appear as the sample fills in.

## Largest misses

| Ticker | Called | Move | Headline |
| --- | --- | ---: | --- |
| TSR | bearish | +27.9% | $1.1 Million Placement to Fund Critical Minerals Strategy |
| REG | bullish | -27.5% | Government announces AN-ACC pricing from 1 October 2026 |
| M2R | bearish | +24.7% | $1.25M Placement to Advance Gidji JV Gold Project |
| OSX | bullish | -19.9% | OSX secures market access to Thailand orthopaedic market |
| TZN | bearish | +19.1% | Finance Facility Update |

Moves beyond ±30% are excluded from this list. At that size the
likelier explanation is a consolidation or a rights issue repricing the shares,
not news the model could have read. They still count in the hit rates above.
