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
  /** Absent when Yahoo was unreachable or the stock has too little history. */
  market_context?: MarketContext;
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

/** Top-level sections. Distinct from the feed's filters — see lib/views.ts. */
export type ViewKey = 'announcements' | 'accuracy' | 'whatsapp' | 'us';

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

// ── Market context (attached by fetch_asx.py via market_context.py) ──

/**
 * What the price was doing going INTO an announcement, measured only from bars
 * that closed before it. Every field is a measurement, not a call — the model
 * is given these same numbers but is never the source of one that renders.
 */
export interface MarketContext {
  /** Date of the last bar used, so "recent" is never ambiguous. */
  as_of: string;
  bars: number;
  last_close: number;

  /** Last 5 sessions' average volume over the 20-day average. */
  volume_trend_ratio: number | null;
  /** The latest session's volume over the 20-day average. */
  volume_last_ratio: number | null;
  avg_turnover_aud: number | null;
  /** False when turnover is too small for the ratios above to mean anything. */
  liquid: boolean;

  pct_from_3m_high: number | null;
  pct_from_3m_low: number | null;
  pct_from_52w_high: number | null;
  pct_from_52w_low: number | null;
  /** 0 at the 3-month low, 1 at the 3-month high. */
  range_position_3m: number | null;
  at_3m_high: boolean;
  at_3m_low: boolean;
  at_52w_high: boolean;
  at_52w_low: boolean;

  /** Closed above its 60-day high on at least 2x average volume. */
  broke_out: boolean;

  /** The same clauses given to the prompt, so text and display cannot diverge. */
  notes: string[];
}
