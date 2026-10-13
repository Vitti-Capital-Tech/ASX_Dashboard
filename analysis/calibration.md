# Calibration

What the sentiment calls have actually been worth, regenerated after each
close by `calibration.py` and pasted into the next day's prompt. Nothing
here is hand-written; edit `calibration.py` if a finding is wrong.

- Window: last 20 trading days, 5050 graded calls
- Dead band: moves under 1% net of the ASX 200 count as no move
- Generated: 2026-10-13T07:58:19.273450+00:00

## Headline

Directional calls (bullish/bearish): **54.3%** correct on 1002 graded calls.

| Label | Graded | Hit rate |
| --- | ---: | ---: |
| bullish | 662 | 56% |
| bearish | 340 | 50.9% |

## Does the label separate from the base rate?

Stocks called neutral moved 1% or more anyway **53.8%** of the time (n=3579). Every graded announcement moved 58% of the time.

The gap between those two numbers is the whole information content of a neutral
call. It is small. Part of that is the measurement: the grading window is the
full session, so a stock that moved on something else entirely is counted
against the label. Part of it is not.

## Where the calls hold up, and where they do not

| Filing | Graded | Hit rate |
| --- | ---: | ---: |
| Market sensitive | 565 | 55.9% |
| Not flagged | 437 | 52.2% |

The exchange's own flag is doing more work than the model is. On unflagged
filings the directional calls are close to a coin flip.

| Document type | Graded | Hit rate |
| --- | ---: | ---: |
| Market Update | 786 | 55.2% |
| Substantial Holding | 100 | 49% |
| Results | 37 | 56.8% |

Document types with fewer than 30 graded calls are omitted rather
than shown with a caveat. They will appear as the sample fills in.

## Largest misses

| Ticker | Called | Move | Headline |
| --- | --- | ---: | --- |
| SNM | bullish | -27.3% | Northern drilling extends mineralisation beyond current MRE |
| POL | bullish | -27.2% | UML Development commences |
| BC8 | bullish | -25.7% | FY27 Guidance & Outlook |
| MEK | bullish | -25.5% | Institutional Placement Funding The Next Phase of Growth |
| IMA | bullish | -25.4% | Reinstatement to Quotation |

Moves beyond ±30% are excluded from this list. At that size the
likelier explanation is a consolidation or a rights issue repricing the shares,
not news the model could have read. They still count in the hit rates above.
