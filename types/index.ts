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
