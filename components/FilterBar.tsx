'use client';

import {
  ALL_CATEGORIES, CATEGORIES, SENTIMENT_FILTERS, type SentimentFilter,
} from '@/lib/views';
import Select from './Select';

interface Props {
  sentiment: SentimentFilter;
  category: string;
  marketSensitiveOnly: boolean;
  activeTagCount: number;
  sensitiveCount: number;
  onSentimentChange: (s: SentimentFilter) => void;
  onCategoryChange: (c: string) => void;
  onSensitiveToggle: () => void;
  onClear: () => void;
}

/**
 * Every filter for the feed, in one row above the feed. They used to be spread
 * across the tab bar, the sidebar stat tiles and a sidebar toggle, so narrowing
 * the list meant hunting through three regions of the screen.
 */
export default function FilterBar({
  sentiment, category, marketSensitiveOnly, activeTagCount, sensitiveCount,
  onSentimentChange, onCategoryChange, onSensitiveToggle, onClear,
}: Props) {
  const dirty =
    sentiment !== 'all' || category !== ALL_CATEGORIES ||
    marketSensitiveOnly || activeTagCount > 0;

  return (
    <div className="flex flex-wrap items-center gap-2.5 mb-5">

      {/* Sentiment — segmented, because the options are mutually exclusive */}
      <div className="flex rounded-xl p-0.5 gap-0.5"
        style={{ background: 'var(--border-subtle)', border: '1px solid var(--border-med)' }}>
        {SENTIMENT_FILTERS.map(s => {
          const active = sentiment === s.key;
          return (
            <button
              key={s.key}
              onClick={() => onSentimentChange(s.key)}
              aria-pressed={active}
              className="px-3 py-1.5 rounded-lg text-[0.74rem] font-semibold whitespace-nowrap transition-all duration-150"
              style={{
                background: active ? 'var(--accent-dim)' : 'transparent',
                border: `1px solid ${active ? 'var(--border-accent)' : 'transparent'}`,
                color: active ? 'var(--accent-light)' : 'var(--text-dim)',
              }}>
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Category — a dropdown, not nine more pills */}
      <Select
        value={category}
        options={CATEGORIES.map(c => ({ value: c, label: c }))}
        onChange={onCategoryChange}
        ariaLabel="Filter by category"
        highlighted={category !== ALL_CATEGORIES}
      />

      {/* Market sensitive — a filter, so it belongs with the filters */}
      <button
        onClick={onSensitiveToggle}
        aria-pressed={marketSensitiveOnly}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[0.74rem] font-semibold transition-all duration-150"
        style={marketSensitiveOnly ? {
          background: 'color-mix(in srgb, var(--danger), transparent 88%)',
          border: '1px solid color-mix(in srgb, var(--danger), transparent 70%)',
          color: 'var(--danger)',
        } : {
          background: 'var(--border-subtle)',
          border: '1px solid var(--border-med)',
          color: 'var(--text-dim)',
        }}>
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
          <path d="M10 2l2.5 5 5.5.8-4 3.9.95 5.5L10 14.5l-4.95 2.7L6 11.7 2 7.8l5.5-.8z" />
        </svg>
        Market sensitive
        {marketSensitiveOnly && <span className="font-mono opacity-80">{sensitiveCount}</span>}
      </button>

      {dirty && (
        <button
          onClick={onClear}
          className="px-3 py-2 rounded-xl text-[0.72rem] font-semibold transition-colors duration-150"
          style={{ color: 'var(--text-dim)' }}>
          Clear filters
        </button>
      )}
    </div>
  );
}
