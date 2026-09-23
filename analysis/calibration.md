# Calibration

What the sentiment calls have actually been worth, regenerated after each
close by `calibration.py` and pasted into the next day's prompt. Nothing
here is hand-written; edit `calibration.py` if a finding is wrong.

- Window: last 20 trading days, 4902 graded calls
- Dead band: moves under 1% net of the ASX 200 count as no move
- Generated: 2026-09-23T06:57:47.538603+00:00

## Headline

Directional calls (bullish/bearish): **59.4%** correct on 1170 graded calls.

| Label | Graded | Hit rate |
| --- | ---: | ---: |
| bullish | 887 | 61.1% |
| bearish | 283 | 54.1% |

## Does the label separate from the base rate?

Stocks called neutral moved 1% or more anyway **53.4%** of the time (n=3086). Every graded announcement moved 57.9% of the time.

The gap between those two numbers is the whole information content of a neutral
call. It is small. Part of that is the measurement: the grading window is the
full session, so a stock that moved on something else entirely is counted
against the label. Part of it is not.

## Where the calls hold up, and where they do not

| Filing | Graded | Hit rate |
| --- | ---: | ---: |
| Market sensitive | 667 | 64.2% |
| Not flagged | 503 | 53.1% |

The exchange's own flag is doing more work than the model is. On unflagged
filings the directional calls are close to a coin flip.

| Document type | Graded | Hit rate |
| --- | ---: | ---: |
| Market Update | 941 | 62% |
| Substantial Holding | 66 | 39.4% |
| Results | 60 | 45% |
| Dividend | 33 | 48.5% |

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
