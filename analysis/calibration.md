# Calibration

What the sentiment calls have actually been worth, regenerated after each
close by `calibration.py` and pasted into the next day's prompt. Nothing
here is hand-written; edit `calibration.py` if a finding is wrong.

- Window: last 20 trading days, 4812 graded calls
- Dead band: moves under 1% net of the ASX 200 count as no move
- Generated: 2026-09-22T08:50:03.894973+00:00

## Headline

Directional calls (bullish/bearish): **59.9%** correct on 1103 graded calls.

| Label | Graded | Hit rate |
| --- | ---: | ---: |
| bullish | 848 | 61.6% |
| bearish | 255 | 54.5% |

## Does the label separate from the base rate?

Stocks called neutral moved 1% or more anyway **54%** of the time (n=3083). Every graded announcement moved 57.9% of the time.

The gap between those two numbers is the whole information content of a neutral
call. It is small. Part of that is the measurement: the grading window is the
full session, so a stock that moved on something else entirely is counted
against the label. Part of it is not.

## Where the calls hold up, and where they do not

| Filing | Graded | Hit rate |
| --- | ---: | ---: |
| Market sensitive | 635 | 64.9% |
| Not flagged | 468 | 53.2% |

The exchange's own flag is doing more work than the model is. On unflagged
filings the directional calls are close to a coin flip.

| Document type | Graded | Hit rate |
| --- | ---: | ---: |
| Market Update | 892 | 62.2% |
| Substantial Holding | 61 | 39.3% |
| Results | 54 | 46.3% |
| Dividend | 31 | 51.6% |

Document types with fewer than 30 graded calls are omitted rather
than shown with a caveat. They will appear as the sample fills in.

## Largest misses

| Ticker | Called | Move | Headline |
| --- | --- | ---: | --- |
| TSR | bearish | +27.9% | $1.1 Million Placement to Fund Critical Minerals Strategy |
| REG | bullish | -27.5% | Government announces AN-ACC pricing from 1 October 2026 |
| M2R | bearish | +24.7% | $1.25M Placement to Advance Gidji JV Gold Project |
| LMG | bullish | -21.4% | LMG Successful Equity Raise |
| SQX | bearish | +21.1% | Application for quotation of securities - SQX |

Moves beyond ±30% are excluded from this list. At that size the
likelier explanation is a consolidation or a rights issue repricing the shares,
not news the model could have read. They still count in the hit rates above.
