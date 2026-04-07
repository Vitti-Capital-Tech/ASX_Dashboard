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

export function tagClass(tag: string): string {
  const t = tag.toLowerCase();
  if (t.includes('mining') || t.includes('production')) return 'tag-mining';
  if (t.includes('finance') || t.includes('dividend') || t.includes('results')) return 'tag-finance';
  if (t.includes('healthcare') || t.includes('health')) return 'tag-healthcare';
  if (t.includes('technology')) return 'tag-technology';
  if (t.includes('energy') || t.includes('oil')) return 'tag-energy';
  if (t.includes('substantial')) return 'tag-substantial';
  return '';
}

export const TAG_BG: Record<string, string> = {
  'tag-mining':      'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'tag-finance':     'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'tag-healthcare':  'bg-violet-500/10 text-violet-400 border-violet-500/20',
  'tag-technology':  'bg-sky-500/10 text-sky-400 border-sky-500/20',
  'tag-energy':      'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'tag-substantial': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  '':                'bg-slate-500/10 text-slate-400 border-slate-500/20',
};
