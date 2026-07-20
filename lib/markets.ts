// Market → EC2 API base URL. Single source of truth for region-scoped summaries.
// (Move these to env vars, e.g. EC2_API_AU / EC2_API_US, when convenient.)
export const MARKETS = {
  au: { label: 'Australia', api: 'http://3.25.70.124:8000' },
  us: { label: 'US/Canada', api: 'http://3.25.70.124:8001' },
} as const;

export type MarketKey = keyof typeof MARKETS;

/** Resolve a region key (from a query param) to its API base, defaulting to AU. */
export function marketApi(region?: string | null): string {
  const key = (region ?? 'au') as MarketKey;
  return (MARKETS[key] ?? MARKETS.au).api;
}
