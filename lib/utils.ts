// Utility functions shared across the dashboard

import type { SentimentLabel } from '@/types';

export function formatTime(iso: string): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleTimeString('en-AU', {
      hour: '2-digit', minute: '2-digit', hour12: true,
      timeZone: 'Australia/Sydney'
    });
  } catch { return iso; }
}

export function formatDateLabel(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-AU', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
      timeZone: 'Australia/Sydney'
    });
  } catch { return dateStr; }
}

// AEST = UTC+11 (Australian Eastern Time during daylight saving)
export function todayAEST(): string {
  const now = new Date();
  const aest = new Date(now.getTime() + 11 * 60 * 60 * 1000);
  return aest.toISOString().slice(0, 10);
}

type AnnText = { market_sensitive: boolean; headline: string; summary: string[]; sentiment?: string };

export function isBullish(ann: AnnText): boolean {
  return getSentiment(ann) === 'bullish';
}

function inferBearishHeuristic(ann: AnnText): boolean {
  const text = (ann.headline + ' ' + (ann.summary || []).join(' ')).toLowerCase();
  const ceaseSub =
    ((text.includes('ceasing') || text.includes('ceases')) && text.includes('substantial')) ||
    text.includes('ceases to be a substantial');
  if (!ann.market_sensitive) return ceaseSub;
  const keywords = [
    'impairment', 'downgrade', 'loss after tax', 'statutory loss', 'net loss',
    'capital raising', 'entitlement offer', 'accelerated', 'non-renounceable',
    'breach', 'covenant', 'going concern', 'administration', 'liquidat',
    'class action', 'investigation', 'suspension', 'failed to', 'withdrawn',
    'terminat', 'writedown', 'write-down', 'dilut', 'shortfall',
  ];
  return ceaseSub || keywords.some(k => text.includes(k));
}

function inferBullishHeuristic(ann: AnnText): boolean {
  const text = (ann.headline + ' ' + (ann.summary || []).join(' ')).toLowerCase();
  if (text.includes('becoming a substantial holder')) return true;
  if (!ann.market_sensitive) return false;
  const keywords = [
    'discovery', 'intercept', 'high-grade', 'record', 'dividend', 'profit',
    'growth', 'expansion', 'success', 'partnership', 'favourable', 'increase',
    'upgrade', 'positive', 'surplus', 'exceeded', 'breakthrough', 'acquisition',
    'merger', 'award', 'contract', 'buy-back', 'buyback', 'placement', 'raising',
  ];
  return keywords.some(k => text.includes(k));
}

/** Prefer model `sentiment`; for older logs without it, use light keyword heuristics. */
export function getSentiment(ann: AnnText): SentimentLabel {
  const s = ann.sentiment?.toLowerCase();
  if (s === 'bullish' || s === 'bearish' || s === 'neutral') return s;
  if (inferBullishHeuristic(ann)) return 'bullish';
  if (inferBearishHeuristic(ann)) return 'bearish';
  return 'neutral';
}

export function sentimentRank(s: SentimentLabel): number {
  if (s === 'bullish') return 0;
  if (s === 'bearish') return 1;
  return 2;
}

/**
 * Tags are nominal labels, so they get one calm treatment rather than a colour
 * each. The old per-category Tailwind palette classes lived in this file, which
 * was never in tailwind.config content — so every one of them was purged at
 * build time and the chips fell back to Tailwind's default near-white border
 * with inherited text. They read as the loudest thing on the card.
 */
export const TAG_STYLE = {
  background: 'var(--border-subtle)',
  border: '1px solid var(--border-med)',
  color: 'var(--text-dim)',
} as const;

/**
 * Small-caps section heading. Sans, not mono, and 11px rather than 9-10px.
 *
 * The type scale had a dozen labels, badges and chips sitting at 0.52-0.62rem
 * in the monospace face, uppercased, with 0.14-0.22em of tracking. Mono is
 * built for columns of digits: uppercased and letterspaced below ~10px its
 * uniform widths stop reading as words. Language wears the sans face; the mono
 * face is reserved for data — tickers, times, counts, prices.
 */
export const SECTION_LABEL = 'text-[0.68rem] font-semibold uppercase tracking-[0.1em]';

/** Pill badge — sentiment, sensitivity. Sans, so "BULLISH" reads as a word. */
export const BADGE_TEXT = 'text-[0.65rem] font-bold uppercase tracking-[0.03em]';
