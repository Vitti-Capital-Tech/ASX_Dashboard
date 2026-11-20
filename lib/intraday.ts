// Intraday shortlist: narrow the morning's feed to the handful of names worth
// watching for a trade that day.
//
// What this screens for is MOVEMENT AND TRADEABILITY, not direction. Measured
// over 74 scored sessions (Aug–Nov 2026, ~17,000 announcements), each rule
// checked separately on the first and second 37 sessions so a pattern that
// held in only one of them was not kept:
//
//   · The AI sentiment label called the open→close direction right 48.9% of
//     the time — a coin. Bullish calls on a stock that gapped up more than 5%
//     held only 36%: the gap is usually the whole move.
//   · The hard filters roughly double the typical intraday range: median
//     |open→close| 1.23% across everything, ~2.6% on what survives them.
//   · The points ranking below lifts the top 10 a day further (median 2.92% /
//     2.93% in the two halves, vs 2.29% / 1.80% for the names it leaves out).
//     Ranking by market cap alone did not separate them.
//
// No filter here was found to predict direction, so the list answers "where is
// there likely to be a move I can get in and out of" and leaves which way to
// the open and the first minutes of tape.

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
  /** Drop filings that, in the data, do not move the stock intraday: routine
   *  types, and placement or takeover headlines. */
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

/** Headlines with the smallest intraday ranges on liquid names. A raise is
 *  priced before the open; a takeover pins the stock to the bid. */
const LOW_MOVE_HEADLINE = /placement|raising|entitlement|capital raise|acqui|takeover|scheme|merger|\bbid\b/i;

/** Types that moved most on liquid names. Used only to choose which of one
 *  ticker's several filings represents it. */
const PRIMARY_TYPES = new Set(['results', 'merger & acquisition', 'half yearly report']);

// ── Ranking points. Each held in both halves of the sample on its own. ──
const MOVER_HEADLINE = /contract|award|agreement|offtake|result|report|half year|full year|profit/i;
const EXPLORATION_HEADLINE = /drill|assay|intercept|resource/i;
const DEEP_DRAWDOWN_PCT = -50;   // % from the 52-week high
const NEAR_HIGH_PCT = -10;

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
  if ((a.tags ?? []).some(t => ROUTINE_TAGS.has(t.toLowerCase()))) return true;
  return LOW_MOVE_HEADLINE.test(a.headline ?? '');
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

export interface IntradayPick {
  ann: Announcement;
  points: number;
  /** Why it ranked where it did, as short chips. */
  reasons: { label: string; good: boolean }[];
}

/** Points and the reasons for them, for one ticker's passing filings. */
function scoreTicker(rep: Announcement, filings: Announcement[], sensitiveToday: number): IntradayPick {
  const reasons: IntradayPick['reasons'] = [];
  let points = 0;
  const fromHigh = rep.market_context?.pct_from_52w_high;

  if (fromHigh !== null && fromHigh !== undefined && fromHigh < DEEP_DRAWDOWN_PCT) {
    points += 1;
    reasons.push({ label: `${Math.abs(fromHigh).toFixed(0)}% below 52w high`, good: true });
  }
  if (sensitiveToday >= 2) {
    points += 1;
    reasons.push({ label: `${sensitiveToday} sensitive filings`, good: true });
  }
  const mover = filings.find(f => MOVER_HEADLINE.test(f.headline ?? ''));
  if (mover) {
    points += 1;
    const m = (mover.headline ?? '').match(MOVER_HEADLINE)?.[0] ?? 'results';
    reasons.push({ label: m.charAt(0).toUpperCase() + m.slice(1).toLowerCase(), good: true });
  }
  if (fromHigh !== null && fromHigh !== undefined && fromHigh > NEAR_HIGH_PCT) {
    points -= 1;
    reasons.push({ label: 'near 52w high', good: false });
  }
  if (filings.some(f => EXPLORATION_HEADLINE.test(f.headline ?? ''))) {
    points -= 1;
    reasons.push({ label: 'drilling / assay', good: false });
  }
  return { ann: rep, points, reasons };
}

export interface IntradayResult {
  picks: IntradayPick[];
  /** Distinct tickers that passed, before the cap. */
  qualified: number;
}

/**
 * The shortlist: one row per ticker, at most `maxPicks`, highest points first
 * and smallest market cap among equals.
 *
 * `dayAnns` is the whole day's log, not the filtered feed — "two sensitive
 * filings today" is a fact about the stock, and should not change because a
 * sentiment filter hid one of them.
 */
export function pickIntraday(
  anns: Announcement[], dayAnns: Announcement[], p: IntradayParams, date: string,
): IntradayResult {
  const sensitiveCount = new Map<string, number>();
  for (const a of dayAnns) {
    if (!a.market_sensitive) continue;
    const k = a.ticker.toUpperCase();
    sensitiveCount.set(k, (sensitiveCount.get(k) ?? 0) + 1);
  }

  const byTicker = new Map<string, Announcement[]>();
  for (const a of anns) {
    if (intradayReject(a, p, date)) continue;
    const k = a.ticker.toUpperCase();
    const list = byTicker.get(k);
    if (list) list.push(a); else byTicker.set(k, [a]);
  }

  const scored = Array.from(byTicker.entries()).map(([k, filings]) =>
    scoreTicker(filings.reduce(representative), filings, sensitiveCount.get(k) ?? 0));

  scored.sort((a, b) => {
    if (a.points !== b.points) return b.points - a.points;
    const ma = a.ann.market_context?.market_cap_aud ?? Infinity;
    const mb = b.ann.market_context?.market_cap_aud ?? Infinity;
    return ma - mb;
  });
  return { picks: scored.slice(0, p.maxPicks), qualified: scored.length };
}
