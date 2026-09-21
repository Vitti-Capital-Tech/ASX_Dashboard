# Calibration

What the sentiment calls have actually been worth, regenerated after each
close by `calibration.py` and pasted into the next day's prompt. Nothing
here is hand-written; edit `calibration.py` if a finding is wrong.

- Window: last 20 trading days, 4689 graded calls
- Dead band: moves under 1% net of the ASX 200 count as no move
- Generated: 2026-09-21T07:52:23.787221+00:00

## Headline

Directional calls (bullish/bearish): **59.9%** correct on 1056 graded calls.

| Label | Graded | Hit rate |
| --- | ---: | ---: |
| bullish | 822 | 61.4% |
| bearish | 234 | 54.7% |

## Does the label separate from the base rate?

Stocks called neutral moved 1% or more anyway **54.8%** of the time (n=3030). Every graded announcement moved 58.4% of the time.

The gap between those two numbers is the whole information content of a neutral
call. It is small. Part of that is the measurement: the grading window is the
full session, so a stock that moved on something else entirely is counted
against the label. Part of it is not.

## Where the calls hold up, and where they do not

| Filing | Graded | Hit rate |
| --- | ---: | ---: |
| Market sensitive | 613 | 64.6% |
| Not flagged | 443 | 53.5% |

The exchange's own flag is doing more work than the model is. On unflagged
filings the directional calls are close to a coin flip.

| Document type | Graded | Hit rate |
| --- | ---: | ---: |
| Market Update | 857 | 62.4% |
| Results | 53 | 45.3% |
| Substantial Holding | 53 | 37.7% |
| Dividend | 31 | 51.6% |

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
