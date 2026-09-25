# Calibration

What the sentiment calls have actually been worth, regenerated after each
close by `calibration.py` and pasted into the next day's prompt. Nothing
here is hand-written; edit `calibration.py` if a finding is wrong.

- Window: last 20 trading days, 4965 graded calls
- Dead band: moves under 1% net of the ASX 200 count as no move
- Generated: 2026-09-25T06:59:12.773372+00:00

## Headline

Directional calls (bullish/bearish): **59.2%** correct on 1140 graded calls.

| Label | Graded | Hit rate |
| --- | ---: | ---: |
| bullish | 842 | 60.7% |
| bearish | 298 | 55% |

## Does the label separate from the base rate?

Stocks called neutral moved 1% or more anyway **52.1%** of the time (n=3199). Every graded announcement moved 56.9% of the time.

The gap between those two numbers is the whole information content of a neutral
call. It is small. Part of that is the measurement: the grading window is the
full session, so a stock that moved on something else entirely is counted
against the label. Part of it is not.

## Where the calls hold up, and where they do not

| Filing | Graded | Hit rate |
| --- | ---: | ---: |
| Market sensitive | 632 | 63.8% |
| Not flagged | 508 | 53.5% |

The exchange's own flag is doing more work than the model is. On unflagged
filings the directional calls are close to a coin flip.

| Document type | Graded | Hit rate |
| --- | ---: | ---: |
| Market Update | 926 | 61.3% |
| Substantial Holding | 82 | 41.5% |
| Results | 49 | 51% |

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
