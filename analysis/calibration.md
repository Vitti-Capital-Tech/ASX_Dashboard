# Calibration

What the sentiment calls have actually been worth, regenerated after each
close by `calibration.py` and pasted into the next day's prompt. Nothing
here is hand-written; edit `calibration.py` if a finding is wrong.

- Window: last 20 trading days, 5273 graded calls
- Dead band: moves under 1% net of the ASX 200 count as no move
- Generated: 2026-11-19T10:42:54.545725+00:00

## Headline

Directional calls (bullish/bearish): **60.7%** correct on 1211 graded calls.

| Label | Graded | Hit rate |
| --- | ---: | ---: |
| bullish | 762 | 60.1% |
| bearish | 449 | 61.7% |

## Does the label separate from the base rate?

Stocks called neutral moved 1% or more anyway **60.6%** of the time (n=3390). Every graded announcement moved 62% of the time.

The gap between those two numbers is the whole information content of a neutral
call. It is small. Part of that is the measurement: the grading window is the
full session, so a stock that moved on something else entirely is counted
against the label. Part of it is not.

## Where the calls hold up, and where they do not

| Filing | Graded | Hit rate |
| --- | ---: | ---: |
| Market sensitive | 801 | 62.4% |
| Not flagged | 410 | 57.3% |

The exchange's own flag is doing more work than the model is. On unflagged
filings the directional calls are close to a coin flip.

| Document type | Graded | Hit rate |
| --- | ---: | ---: |
| Market Update | 755 | 60.3% |
| Quarterly Report | 170 | 62.9% |
| Annual General Meeting | 99 | 64.6% |
| Substantial Holding | 67 | 50.7% |
| Results | 45 | 62.2% |

Document types with fewer than 30 graded calls are omitted rather
than shown with a caveat. They will appear as the sample fills in.

## Largest misses

| Ticker | Called | Move | Headline |
| --- | --- | ---: | --- |
| ZIP | bullish | -29.5% | 1Q FY27 results update |
| GW1 | bullish | -29.4% | Strategic Partnership with Atana Elements inc. |
| TIO | bullish | -29.0% | Temas Signs Quebec RCL Contract and Appoints Anthony Travers |
| SGA | bearish | +28.1% | IMARC Revised Investor Presentation |
| WRX | bullish | -25.7% | Drilling Intersects Broad Shallow Silver Mineralisation |

Moves beyond ±30% are excluded from this list. At that size the
likelier explanation is a consolidation or a rights issue repricing the shares,
not news the model could have read. They still count in the hit rates above.
