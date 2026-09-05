// Top-level sections and the filter vocabulary for the announcements feed.
//
// These were one flat list of 16 "categories" in the tab bar, which meant a
// section link and a filter looked and behaved identically. Splitting them
// also lets sentiment and category compose — "bullish Results" was impossible
// while a single activeCategory held both.

import type { SentimentLabel, ViewKey } from '@/types';

export const VIEWS: { key: ViewKey; label: string }[] = [
  { key: 'announcements', label: 'Announcements' },
  { key: 'accuracy', label: 'Accuracy' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'us', label: 'US / Canada' },
];

/** Views backed by the placements pipeline, mapped to a region (see lib/markets.ts). */
export const VIEW_REGION: Partial<Record<ViewKey, string>> = {
  whatsapp: 'au',
  us: 'us',
};

export type SentimentFilter = 'all' | SentimentLabel;

export const SENTIMENT_FILTERS: { key: SentimentFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'bullish', label: '▲ Bullish' },
  { key: 'bearish', label: '▼ Bearish' },
  { key: 'neutral', label: 'Neutral' },
];

export const ALL_CATEGORIES = 'All categories';

export const CATEGORIES = [
  ALL_CATEGORIES,
  'Quarterly', 'Results', 'Dividend', 'Capital Raise', 'AGM',
  'Merger & Acquisition', 'Trading Halt', 'Board Change', 'Substantial Holding',
];
