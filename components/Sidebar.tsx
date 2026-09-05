'use client';

import { useMemo } from 'react';
import { DayLog } from '@/types';
import { formatDateLabel, getSentiment } from '@/lib/utils';
import { ALL_CATEGORIES, type SentimentFilter } from '@/lib/views';
import MarketOverview, { type TileAction } from './MarketOverview';
import Select from './Select';

interface Props {
  date: string;
  availableDates: string[];
  log: DayLog | null;
  activeTags: Set<string>;
  sentiment: SentimentFilter;
  category: string;
  marketSensitiveOnly: boolean;
  /** Filters only act on the announcements feed, so the active state is
   *  suppressed elsewhere rather than claiming a filter is on that no
   *  visible list is obeying. */
  filtersApply: boolean;
  /** Counts are unknown mid-fetch; showing the last day's is worse than a dash. */
  loading: boolean;
  onDateChange: (d: string) => void;
  onTagToggle: (tag: string) => void;
  onSentimentChange: (s: SentimentFilter) => void;
  onCategoryChange: (c: string) => void;
  onSensitiveToggle: () => void;
  onResetFilters: () => void;
  tagCounts: Record<string, number>;
}

export default function Sidebar({
  date, availableDates, log, activeTags, sentiment, category, marketSensitiveOnly, filtersApply, loading,
  onDateChange, onTagToggle, onSentimentChange, onCategoryChange,
  onSensitiveToggle, onResetFilters, tagCounts,
}: Props) {

  const counts = useMemo(() => {
    const anns = log?.announcements ?? [];
    const has = (a: DayLog['announcements'][number], k: string) =>
      a.tags?.some(t => t.toLowerCase().includes(k)) || a.document_type?.toLowerCase().includes(k);
    return {
      total: anns.length,
      sensitive: anns.filter(a => a.market_sensitive).length,
      substantial: anns.filter(a => has(a, 'substantial')).length,
      bullish: anns.filter(a => getSentiment(a) === 'bullish').length,
      bearish: anns.filter(a => getSentiment(a) === 'bearish').length,
      neutral: anns.filter(a => getSentiment(a) === 'neutral').length,
      halts: anns.filter(a => {
        const t = a.headline.toLowerCase();
        return t.includes('halt') || t.includes('suspension') || t.includes('pause')
          || a.tags?.some(tag => ['halt', 'suspension', 'pause'].some(k => tag.toLowerCase().includes(k)));
      }).length,
    };
  }, [log]);

  const dateOptions = useMemo(() => {
    const opts = availableDates.map(d => ({ value: d, label: formatDateLabel(d) }));
    // Today has no committed log until the first fetch of the session lands.
    if (date && !availableDates.includes(date)) {
      opts.unshift({ value: date, label: `${formatDateLabel(date)} (Live)` });
    }
    return opts;
  }, [availableDates, date]);

  function isActive(action: TileAction): boolean {
    if (!filtersApply) return false;
    switch (action.type) {
      case 'reset': return sentiment === 'all' && category === ALL_CATEGORIES && !marketSensitiveOnly;
      case 'sensitive': return marketSensitiveOnly;
      case 'sentiment': return sentiment === action.value;
      case 'category': return category === action.value;
    }
  }

  function handleTile(action: TileAction) {
    const active = isActive(action);
    switch (action.type) {
      case 'reset': onResetFilters(); break;
      case 'sensitive': onSensitiveToggle(); break;
      // Clicking the tile that is already on turns it back off, so a tile is
      // never a one-way trip into a filter the user then has to hunt to undo.
      case 'sentiment': onSentimentChange(active ? 'all' : action.value); break;
      case 'category': onCategoryChange(active ? ALL_CATEGORIES : action.value); break;
    }
  }

  return (
    <aside className="w-[280px] min-w-[280px] flex flex-col h-screen sticky top-0 overflow-y-auto overflow-x-hidden pb-8 [scrollbar-width:none] relative transition-all duration-300"
      style={{
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sidebar)',
      }}>

      <div className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: 'linear-gradient(90deg, var(--accent) 0%, var(--accent-light) 40%, var(--success) 100%)' }} />
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 0% 0%, var(--accent-dim) 0%, transparent 70%)' }} />

      {/* ── Brand ── */}
      <div className="px-6 pt-8 pb-6 flex-shrink-0" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-3.5">
          <div className="relative w-10 h-10 flex-shrink-0">
            <div className="absolute inset-0 rounded-[12px]"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light))', boxShadow: 'var(--glow-accent), 0 4px 12px rgba(0,0,0,0.2)' }} />
            <div className="absolute inset-0 flex items-center justify-center rounded-[12px]">
              <svg viewBox="0 0 16 16" fill="none" className="w-5 h-5">
                <rect x="1.5" y="9.5" width="3" height="5" rx="1" fill="white" opacity="0.75" />
                <rect x="6.5" y="5.5" width="3" height="9" rx="1" fill="white" />
                <rect x="11.5" y="2" width="3" height="12.5" rx="1" fill="white" opacity="0.92" />
              </svg>
            </div>
          </div>
          <div>
            <div className="text-[1.2rem] font-extrabold tracking-tight leading-none" style={{ color: 'var(--text-primary)' }}>
              Vitti<em className="not-italic"
                style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ASX</em>
            </div>
            <div className="text-[0.58rem] font-bold uppercase tracking-[0.22em] mt-1" style={{ color: 'var(--text-dim)' }}>
              Intelligence Center
            </div>
          </div>
        </div>
      </div>

      {/* ── Trading date ── */}
      <div className="px-6 py-5 flex-shrink-0" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <span className="block text-[0.6rem] font-bold uppercase tracking-[0.2em] mb-2.5"
          style={{ color: 'var(--text-dim)' }}>
          Trading Date
        </span>
        <Select
          block
          value={date}
          options={dateOptions}
          onChange={onDateChange}
          ariaLabel="Trading date"
        />
        {log && (
          <p className="text-[0.68rem] font-medium mt-2.5 flex items-center gap-1.5" style={{ color: 'var(--text-dim)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--success)', boxShadow: '0 0 6px var(--success)' }} />
            {formatDateLabel(log.date)} · Data loaded
          </p>
        )}
      </div>

      <MarketOverview
        counts={counts}
        hasLog={!!log}
        loading={loading}
        isActive={isActive}
        onSelect={handleTile}
      />

      {/* ── Topics ── */}
      <div className="px-6 py-5 flex-shrink-0">
        <div className="flex items-center justify-between text-[0.6rem] font-bold uppercase tracking-[0.2em] mb-3.5"
          style={{ color: 'var(--text-dim)' }}>
          <span>Topics</span>
          {filtersApply && activeTags.size > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[0.55rem] font-bold normal-case tracking-normal"
              style={{ background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', color: 'var(--accent-light)' }}>
              {activeTags.size} active
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          {Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).map(([tag, count]) => {
            const active = activeTags.has(tag);
            return (
              <button
                key={tag}
                onClick={() => onTagToggle(tag)}
                aria-pressed={active}
                className="group flex items-center justify-between px-3 py-2.5 rounded-xl text-[0.8rem] font-medium transition-all duration-150 border"
                style={active
                  ? { background: 'var(--accent-dim)', borderColor: 'var(--border-accent)', color: 'var(--accent-light)' }
                  : { background: 'transparent', borderColor: 'transparent', color: 'var(--text-dim)' }}>
                <span className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-200"
                    style={active
                      ? { background: 'var(--accent)', boxShadow: '0 0 6px var(--accent)' }
                      : { background: 'var(--border-med)' }} />
                  {tag}
                </span>
                <span className="font-mono text-[0.65rem] px-1.5 py-0.5 rounded-md"
                  style={active
                    ? { background: 'var(--accent-dim)', color: 'var(--accent-light)' }
                    : { color: 'var(--text-dim)', opacity: 0.7 }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
