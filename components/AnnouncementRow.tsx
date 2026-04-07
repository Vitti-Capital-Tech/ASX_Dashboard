'use client';

import { Announcement } from '@/types';
import { formatTime, getSentiment, tagClass, TAG_BG } from '@/lib/utils';

interface Props {
  ann: Announcement;
}

export default function AnnouncementRow({ ann }: Props) {
  const sentiment = getSentiment(ann);
  const sensitive = ann.market_sensitive;

  const rowStyle =
    sentiment === 'bullish'
      ? {
          background: 'color-mix(in srgb, var(--success), transparent 92%)',
          border: '1px solid color-mix(in srgb, var(--success), transparent 82%)',
          borderLeft: '3px solid var(--success)',
        }
      : sentiment === 'bearish'
        ? {
            background: 'color-mix(in srgb, var(--danger), transparent 92%)',
            border: '1px solid color-mix(in srgb, var(--danger), transparent 82%)',
            borderLeft: '3px solid var(--danger)',
          }
        : {
            background: 'var(--border-subtle)',
            border: '1px solid var(--border-subtle)',
            borderLeft: '3px solid color-mix(in srgb, var(--text-dim), transparent 50%)',
          };

  return (
    <div
      className="group flex items-center gap-4 px-5 py-3 rounded-[14px] cursor-default select-none transition-all duration-150"
      style={rowStyle}
    >

      {/* ── Ticker + Signals ── */}
      <div className="flex flex-col items-center gap-1.5 w-[76px] flex-shrink-0 font-mono">
        <span className="text-[0.78rem] font-black tracking-[0.05em] px-2 py-1 rounded-lg w-full text-center"
          style={{ background: 'var(--border-subtle)', border: '1px solid var(--border-med)', color: 'var(--text-primary)' }}>
          {ann.ticker}
        </span>

        {sentiment === 'bullish' && (
          <span className="flex items-center gap-0.5 font-mono text-[0.52rem] font-bold uppercase tracking-[0.06em]"
            style={{ color: 'var(--success)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
            </svg>
            Bullish
          </span>
        )}
        {sentiment === 'bearish' && (
          <span className="flex items-center gap-0.5 font-mono text-[0.52rem] font-bold uppercase tracking-[0.06em]"
            style={{ color: 'var(--danger)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5">
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>
            </svg>
            Bearish
          </span>
        )}
        {sentiment === 'neutral' && (
          <span className="flex items-center gap-0.5 font-mono text-[0.52rem] font-bold uppercase tracking-[0.06em]"
            style={{ color: 'var(--text-dim)' }}>
            Neutral
          </span>
        )}

        {sensitive && (
          <span className="flex items-center gap-1 font-mono text-[0.52rem] font-bold uppercase tracking-[0.05em]"
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
        <div className="font-mono text-[0.65rem] mt-0.5 flex items-center gap-1" style={{ color: 'var(--text-dim)' }}>
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
          {ann.tags.slice(0, 2).map(tag => {
            const cls = tagClass(tag);
            return (
              <span key={tag} className={`hidden md:inline font-mono text-[0.57rem] font-bold uppercase tracking-[0.1em]
                px-2 py-0.5 rounded-md border ${TAG_BG[cls] ?? TAG_BG['']}`}>
                {tag}
              </span>
            );
          })}
        </div>

        {/* External link button */}
        <a
          href={ann.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-150"
          style={{ 
            color: 'var(--text-dim)', 
            background: 'var(--border-subtle)', 
            border: '1px solid var(--border-med)' 
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(165,180,252,0.9)';
            (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(99,102,241,0.1)';
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(99,102,241,0.25)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(100,116,139,0.6)';
            (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.03)';
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.06)';
          }}
        >
          <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
            <path d="M4.5 11.5L11.5 4.5M11.5 4.5H6.5M11.5 4.5V9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
