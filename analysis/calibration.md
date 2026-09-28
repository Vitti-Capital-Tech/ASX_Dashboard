# Calibration

What the sentiment calls have actually been worth, regenerated after each
close by `calibration.py` and pasted into the next day's prompt. Nothing
here is hand-written; edit `calibration.py` if a finding is wrong.

- Window: last 20 trading days, 4878 graded calls
- Dead band: moves under 1% net of the ASX 200 count as no move
- Generated: 2026-09-28T07:15:19.859013+00:00

## Headline

Directional calls (bullish/bearish): **59.4%** correct on 1095 graded calls.

| Label | Graded | Hit rate |
| --- | ---: | ---: |
| bullish | 803 | 60.8% |
| bearish | 292 | 55.5% |

## Does the label separate from the base rate?

Stocks called neutral moved 1% or more anyway **52.6%** of the time (n=3194). Every graded announcement moved 57.3% of the time.

The gap between those two numbers is the whole information content of a neutral
call. It is small. Part of that is the measurement: the grading window is the
full session, so a stock that moved on something else entirely is counted
against the label. Part of it is not.

## Where the calls hold up, and where they do not

| Filing | Graded | Hit rate |
| --- | ---: | ---: |
| Market sensitive | 608 | 64.1% |
| Not flagged | 487 | 53.4% |

The exchange's own flag is doing more work than the model is. On unflagged
filings the directional calls are close to a coin flip.

| Document type | Graded | Hit rate |
| --- | ---: | ---: |
| Market Update | 890 | 61.5% |
| Substantial Holding | 83 | 43.4% |
| Results | 44 | 54.5% |

Document types with fewer than 30 graded calls are omitted rather
than shown with a caveat. They will appear as the sample fills in.

## Largest misses

| Ticker | Called | Move | Headline |
| --- | --- | ---: | --- |
| TSR | bearish | +27.9% | $1.1 Million Placement to Fund Critical Minerals Strategy |
| REG | bullish | -27.5% | Government announces AN-ACC pricing from 1 October 2026 |
| MEK | bullish | -25.5% | Institutional Placement Funding The Next Phase of Growth |
| IMA | bullish | -25.4% | Reinstatement to Quotation |
| M2R | bearish | +24.7% | $1.25M Placement to Advance Gidji JV Gold Project |

Moves beyond ±30% are excluded from this list. At that size the
likelier explanation is a consolidation or a rights issue repricing the shares,
not news the model could have read. They still count in the hit rates above.
