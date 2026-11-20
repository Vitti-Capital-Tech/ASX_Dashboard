// Intraday shortlist: narrow the morning's feed to the handful of names worth
// watching for a trade that day.
//
// What this screens for is MOVEMENT AND TRADEABILITY, not direction. Measured
// over 32 scored sessions (Aug–Sep 2026, ~6,000 announcements):
//
//   · The AI sentiment label called the open→close direction right 48.8% of
//     the time — no better than a coin. Bullish calls on a stock that gapped up
//     more than 5% hit only 39%: the gap is usually the whole move.
//   · The filters below roughly double the typical intraday range. Median
//     |open→close| was 1.27% across everything and 2.82% on what survives
//     them, with 47% of survivors moving 3% or more (vs ~20% overall).
//   · No ranking among the survivors reliably beat another, so the order is a
//     convenience (smaller liquid names tend to move more), not a forecast.
//
// So the list answers "where will there be a move I can actually get in and out
// of", and leaves the direction to the open and the first few minutes of tape.

import type { Announcement } from '@/types';

export interface IntradayParams {
  /** Median daily turnover floor, A$. Below ~A$500k a position of any size
   *  moves the price itself and the spread eats the range. */
  minTurnover: number;
  /** Price floor, A$. Under 5c one tick is 1–2% of the price. */
  minPrice: number;
  /** Only announcements released before the 10:00 AM Sydney open — the
   *  morning read. Off includes everything filed so far today. */
  preOpenOnly: boolean;
  /** Only ASX price-sensitive filings. Non-sensitive ones barely move. */
  sensitiveOnly: boolean;
  /** Drop filing types that, in the data, do not move the stock intraday. */
  excludeRoutine: boolean;
  /** How many names to return. */
  maxPicks: number;
}

export const DEFAULT_INTRADAY: IntradayParams = {
  minTurnover: 500_000,
  minPrice: 0.05,
  preOpenOnly: true,
  sensitiveOnly: true,
  excludeRoutine: true,
  maxPicks: 10,
};

export const TURNOVER_OPTIONS = [
  { value: 250_000, label: '≥ A$250k / day' },
  { value: 500_000, label: '≥ A$500k / day' },
  { value: 1_000_000, label: '≥ A$1M / day' },
  { value: 5_000_000, label: '≥ A$5M / day' },
];

export const PRICE_OPTIONS = [
  { value: 0, label: 'Any price' },
  { value: 0.05, label: '≥ 5c' },
  { value: 0.2, label: '≥ 20c' },
  { value: 1, label: '≥ A$1' },
];

export const MAX_PICK_OPTIONS = [5, 10, 15];

/** Filing types whose median open→close move on liquid names was ~1% or less,
 *  or — for a halt — zero, because the stock does not trade. */
const ROUTINE_TYPES = new Set([
  'trading halt', 'dividend', 'annual general meeting', 'director notice',
  'quarterly report', 'annual report',
]);
const ROUTINE_TAGS = new Set(['trading halt', 'compliance', 'dividend', 'agm']);

/** Types that moved most on liquid names. Used only to choose which of one
 *  ticker's several filings represents it, never to rank tickers. */
const PRIMARY_TYPES = new Set(['results', 'merger & acquisition', 'half yearly report']);

const OPEN_HOUR_SYDNEY = 10;

const sydneyParts = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Australia/Sydney',
  year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false,
});

/** True when the filing landed before 10:00 AM Sydney on the log's own date. */
export function releasedBeforeOpen(iso: string, date: string): boolean {
  const t = new Date(iso);
  if (isNaN(t.getTime())) return false;
  const p = Object.fromEntries(sydneyParts.formatToParts(t).map(x => [x.type, x.value]));
  const day = `${p.year}-${p.month}-${p.day}`;
  if (day < date) return true;                      // filed overnight / the evening before
  if (day > date) return false;
  return parseInt(p.hour, 10) % 24 < OPEN_HOUR_SYDNEY;
}

function isRoutine(a: Announcement): boolean {
  if (ROUTINE_TYPES.has((a.document_type ?? '').toLowerCase())) return true;
  return (a.tags ?? []).some(t => ROUTINE_TAGS.has(t.toLowerCase()));
}

/** Why an announcement fails the screen, or null when it passes. */
export function intradayReject(a: Announcement, p: IntradayParams, date: string): string | null {
  if (p.sensitiveOnly && !a.market_sensitive) return 'not price sensitive';
  if (p.preOpenOnly && !releasedBeforeOpen(a.time, date)) return 'after the open';
  if (p.excludeRoutine && isRoutine(a)) return 'routine filing';
  const c = a.market_context;
  // No context means no turnover figure, and an unmeasured stock cannot be
  // vouched for as tradeable — it fails rather than slipping through.
  if (!c) return 'no price data';
  if ((c.avg_turnover_aud ?? 0) < p.minTurnover) return 'too thinly traded';
  if ((c.last_close ?? 0) < p.minPrice) return 'price too low';
  return null;
}

/** Which of one ticker's filings stands for it: sensitive first, then the
 *  heavier filing type, then the latest. */
function representative(a: Announcement, b: Announcement): Announcement {
  if (a.market_sensitive !== b.market_sensitive) return a.market_sensitive ? a : b;
  const pa = PRIMARY_TYPES.has((a.document_type ?? '').toLowerCase());
  const pb = PRIMARY_TYPES.has((b.document_type ?? '').toLowerCase());
  if (pa !== pb) return pa ? a : b;
  return new Date(a.time) >= new Date(b.time) ? a : b;
}

export interface IntradayResult {
  picks: Announcement[];
  /** Distinct tickers that passed, before the cap. */
  qualified: number;
}

/**
 * The shortlist: one row per ticker, at most `maxPicks`, smallest market cap
 * first. Market cap is a tiebreak of convenience — among liquid names the
 * smaller ones had the wider ranges — not a prediction of which will move.
 */
export function pickIntraday(anns: Announcement[], p: IntradayParams, date: string): IntradayResult {
  const byTicker = new Map<string, Announcement>();
  for (const a of anns) {
    if (intradayReject(a, p, date)) continue;
    const key = a.ticker.toUpperCase();
    const prev = byTicker.get(key);
    byTicker.set(key, prev ? representative(prev, a) : a);
  }
  const all = Array.from(byTicker.values()).sort((a, b) => {
    const ma = a.market_context?.market_cap_aud ?? Infinity;
    const mb = b.market_context?.market_cap_aud ?? Infinity;
    if (ma !== mb) return ma - mb;
    return (b.market_context?.avg_turnover_aud ?? 0) - (a.market_context?.avg_turnover_aud ?? 0);
  });
  return { picks: all.slice(0, p.maxPicks), qualified: all.length };
}
