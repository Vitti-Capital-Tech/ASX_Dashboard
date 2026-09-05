// TypeScript types for ASX announcement data

export type SentimentLabel = 'bullish' | 'bearish' | 'neutral';

export interface Announcement {
  ticker: string;
  company: string;
  headline: string;
  time: string;          // ISO string
  url: string;
  market_sensitive: boolean;
  document_type: string;
  summary: string[];
  tags: string[];
  /** From AI (Claude/Groq); older logs omit this and the UI infers a fallback. */
  sentiment?: SentimentLabel;
}

export interface DayLog {
  date: string;
  total: number;
  market_sensitive_count: number;
  generated_at: string;
  announcements: Announcement[];
}

export interface PlacementSummary {
  ticker: string;
  company: string;
  deal_type: 'Placement' | 'IPO';
  subject: string;
  summary: string;
  received_at: string;
}

export interface PlacementDayLog {
  date: string;
  total: number;
  generated_at: string;
  placements: PlacementSummary[];
}

export type ViewMode = 'grid' | 'list';

// ── Sentiment scorecard (written by verify_sentiment.py after the ASX close) ──

/** correct/wrong = cleared the dead band; flat = moved less than it;
 *  pending = post-close news whose next session has not printed yet;
 *  no_data = halted, suspended, or not on Yahoo. */
export type Verdict = 'correct' | 'wrong' | 'flat' | 'pending' | 'no_data';

export interface ScoredCall {
  ticker: string;
  company: string;
  headline: string;
  url: string;
  time: string;
  document_type: string;
  market_sensitive: boolean;
  sentiment: SentimentLabel;
  /** Which session the news belongs to: before the open, during, or after. */
  bucket: 'pre_open' | 'intraday' | 'post_close';
  /** Ticker had both a bullish and a bearish call that day — excluded from stats. */
  conflict: boolean;
  session_date: string | null;
  prev_close: number | null;
  close: number | null;
  return_pct: number | null;
  index_return_pct: number | null;
  /** Move net of the benchmark. This is what the verdict is judged on. */
  abnormal_pct: number | null;
  verdict: Verdict;
}

export interface SentimentStat {
  scored: number;
  correct: number;
  wrong: number;
  flat: number;
  hit_rate: number | null;
  avg_abnormal_pct: number | null;
}

export type SentimentStats = Record<SentimentLabel, SentimentStat>;

export interface ScorecardStats {
  by_sentiment: SentimentStats;
  /** Average bullish move minus average bearish move — the real edge measure. */
  spread_pct: number | null;
  directional_hit_rate: number | null;
  directional_scored: number;
  pending: number;
  no_data: number;
  conflicts: number;
}

export interface Highlight {
  ticker: string;
  company: string;
  headline: string;
  sentiment: SentimentLabel;
  abnormal_pct: number;
  return_pct: number;
  url: string;
}

export interface Scorecard {
  date: string;
  generated_at: string;
  benchmark: string;
  threshold_pct: number;
  stats: ScorecardStats;
  highlights: { best_calls: Highlight[]; worst_calls: Highlight[] };
  results: ScoredCall[];
}

export interface ScorecardSummary {
  generated_at: string;
  days_scored: number;
  benchmark: string;
  threshold_pct: number;
  by_sentiment: SentimentStats;
  spread_pct: number | null;
  directional_hit_rate: number | null;
  directional_scored: number;
  daily: { date: string; hit_rate: number | null; scored: number; spread_pct: number | null }[];
}
