'use client';

import { Announcement } from '@/types';
import { formatTime, getSentiment, TAG_STYLE } from '@/lib/utils';

interface Props {
  ann: Announcement;
}

export default function AnnouncementRow({ ann }: Props) {
  const sentiment = getSentiment(ann);
  const sensitive = ann.market_sensitive;

  const token = sentiment === 'bullish' ? 'success' : sentiment === 'bearish' ? 'danger' : 'text-dim';

  return (
    // Same treatment as the card: a neutral frame with sentiment on an inset
    // rail, rather than a saturated border. Text stays selectable — this is a
    // research tool, and people copy tickers and headlines out of it.
    <div
      className="group relative flex items-center gap-4 px-5 pl-6 py-3 rounded-[14px] transition-all duration-150"
      style={{
        background: `linear-gradient(100deg,
                       color-mix(in srgb, var(--${token}), transparent 95%) 0%,
                       var(--bg-card) 30%)`,
        border: '1px solid var(--border-subtle)',
      }}
    >
      <span aria-hidden
        className="absolute left-0 top-[14px] bottom-[14px] w-[3px] rounded-full"
        style={{
          background: `linear-gradient(180deg, var(--${token}) 0%,
                         color-mix(in srgb, var(--${token}), transparent 55%) 100%)`,
        }} />

      {/* ── Ticker + Signals ── */}
      <div className="flex flex-col items-center gap-1.5 w-[76px] flex-shrink-0">
        <span className="font-mono text-[0.78rem] font-black tracking-[0.05em] px-2 py-1 rounded-lg w-full text-center"
          style={{ background: 'var(--border-subtle)', border: '1px solid var(--border-med)', color: 'var(--text-primary)' }}>
          {ann.ticker}
        </span>

        {sentiment === 'bullish' && (
          <span className="flex items-center gap-0.5 text-[0.63rem] font-bold uppercase tracking-[0.03em]"
            style={{ color: 'var(--success)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
            </svg>
            Bullish
          </span>
        )}
        {sentiment === 'bearish' && (
          <span className="flex items-center gap-0.5 text-[0.63rem] font-bold uppercase tracking-[0.03em]"
            style={{ color: 'var(--danger)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5">
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>
            </svg>
            Bearish
          </span>
        )}
        {sentiment === 'neutral' && (
          <span className="flex items-center gap-0.5 text-[0.63rem] font-bold uppercase tracking-[0.03em]"
            style={{ color: 'var(--text-dim)' }}>
            Neutral
          </span>
        )}

        {sensitive && (
          <span className="flex items-center gap-1 text-[0.63rem] font-bold uppercase tracking-[0.03em]"
            style={{ color: 'var(--danger)' }}>
            <span className="relative flex h-1 w-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: 'var(--danger)' }} />
              <span className="relative inline-flex rounded-full h-1 w-1" style={{ background: 'var(--danger)' }} />
            </span>
            Sensitive
          </span>
        )}
      </div>

      {/* ── Company + Time ── */}
      <div className="w-[148px] flex-shrink-0 flex flex-col justify-center pr-4" style={{ borderRight: '1px solid var(--border-subtle)' }}>
        <div className="text-[0.82rem] font-bold truncate transition-colors duration-150" style={{ color: 'var(--text-primary)' }} title={ann.company}>
          {ann.company}
        </div>
        <div className="font-mono text-[0.7rem] font-medium tabular-nums mt-0.5 flex items-center gap-1"
          style={{ color: 'var(--text-secondary)' }}>
          <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5 flex-shrink-0">
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M6 3.5V6l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          {formatTime(ann.time)}
        </div>
      </div>

      {/* ── Headline + Tags + Link ── */}
      <div className="flex-1 min-w-0 flex items-center justify-between gap-3">
        <a
          href={ann.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-0 block"
        >
          <span className="text-[0.875rem] font-bold line-clamp-1 leading-snug tracking-[-0.01em] transition-colors duration-150"
            style={{ color: 'var(--text-primary)' }}>
            {ann.headline}
          </span>
        </a>

        {/* Tags */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {ann.tags.slice(0, 2).map(tag => (
            <span key={tag} style={TAG_STYLE}
              className="hidden md:inline text-[0.66rem] font-medium px-2 py-[0.15rem] rounded-md">
              {tag}
            </span>
          ))}
        </div>

        {/* External link button */}
        <a
          href={ann.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open on ASX"
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-150
                     text-[var(--text-dim)] bg-[var(--border-subtle)] border border-[var(--border-med)]
                     hover:text-[var(--accent-light)] hover:bg-[var(--accent-dim)] hover:border-[var(--border-accent)]"
        >
          <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
            <path d="M4.5 11.5L11.5 4.5M11.5 4.5H6.5M11.5 4.5V9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
