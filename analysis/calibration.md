# Calibration

What the sentiment calls have actually been worth, regenerated after each
close by `calibration.py` and pasted into the next day's prompt. Nothing
here is hand-written; edit `calibration.py` if a finding is wrong.

- Window: last 20 trading days, 4997 graded calls
- Dead band: moves under 1% net of the ASX 200 count as no move
- Generated: 2026-09-24T08:51:38.535630+00:00

## Headline

Directional calls (bullish/bearish): **59.1%** correct on 1173 graded calls.

| Label | Graded | Hit rate |
| --- | ---: | ---: |
| bullish | 875 | 60.6% |
| bearish | 298 | 54.7% |

## Does the label separate from the base rate?

Stocks called neutral moved 1% or more anyway **52.4%** of the time (n=3170). Every graded announcement moved 57.2% of the time.

The gap between those two numbers is the whole information content of a neutral
call. It is small. Part of that is the measurement: the grading window is the
full session, so a stock that moved on something else entirely is counted
against the label. Part of it is not.

## Where the calls hold up, and where they do not

| Filing | Graded | Hit rate |
| --- | ---: | ---: |
| Market sensitive | 644 | 63.7% |
| Not flagged | 529 | 53.5% |

The exchange's own flag is doing more work than the model is. On unflagged
filings the directional calls are close to a coin flip.

| Document type | Graded | Hit rate |
| --- | ---: | ---: |
| Market Update | 941 | 61.4% |
| Substantial Holding | 78 | 41% |
| Results | 53 | 47.2% |
| Dividend | 33 | 51.5% |

Document types with fewer than 30 graded calls are omitted rather
than shown with a caveat. They will appear as the sample fills in.

## Largest misses

| Ticker | Called | Move | Headline |
| --- | --- | ---: | --- |
| TSR | bearish | +27.9% | $1.1 Million Placement to Fund Critical Minerals Strategy |
| REG | bullish | -27.5% | Government announces AN-ACC pricing from 1 October 2026 |
| IMA | bullish | -25.4% | Reinstatement to Quotation |
| M2R | bearish | +24.7% | $1.25M Placement to Advance Gidji JV Gold Project |
| TUA | bullish | -23.8% | Investor Presentation FY26 |

Moves beyond ±30% are excluded from this list. At that size the
likelier explanation is a consolidation or a rights issue repricing the shares,
not news the model could have read. They still count in the hit rates above.
