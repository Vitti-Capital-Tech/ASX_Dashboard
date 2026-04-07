'use client';

import { Announcement } from '@/types';
import { formatTime, getSentiment, tagClass, TAG_BG } from '@/lib/utils';

interface Props {
  ann: Announcement;
}

export default function AnnouncementCard({ ann }: Props) {
  const sentiment = getSentiment(ann);
  const sensitive = ann.market_sensitive;

  const cardSurface =
    sentiment === 'bullish'
      ? {
          background:
            'linear-gradient(135deg, color-mix(in srgb, var(--success), transparent 90%) 0%, var(--bg-card) 60%)',
          border: '1px solid color-mix(in srgb, var(--success), transparent 75%)',
          borderLeft: '3px solid var(--success)',
          boxShadow: 'var(--glow-accent)',
        }
      : sentiment === 'bearish'
        ? {
            background:
              'linear-gradient(135deg, color-mix(in srgb, var(--danger), transparent 92%) 0%, var(--bg-card) 60%)',
            border: '1px solid color-mix(in srgb, var(--danger), transparent 78%)',
            borderLeft: '3px solid var(--danger)',
            boxShadow: 'var(--glow-accent)',
          }
        : {
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderLeft: '3px solid color-mix(in srgb, var(--text-dim), transparent 40%)',
            boxShadow: 'var(--shadow-card)',
          };

  return (
    <div
      className="group relative flex flex-col gap-3.5 p-5 rounded-[18px] cursor-default select-none transition-all duration-300 hover:-translate-y-1 min-w-0"
      style={{
        ...cardSurface,
      }}
      onMouseEnter={e => {
        if (sentiment === 'bullish') {
          (e.currentTarget as HTMLElement).style.boxShadow =
            '-4px 0 20px rgba(16,185,129,0.12), 0 20px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(16,185,129,0.18)';
        } else if (sentiment === 'bearish') {
          (e.currentTarget as HTMLElement).style.boxShadow =
            '-4px 0 20px rgba(244,63,94,0.12), 0 20px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(244,63,94,0.18)';
        } else {
          (e.currentTarget as HTMLElement).style.boxShadow =
            '0 20px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(99,102,241,0.12)';
        }
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.35)';
      }}
    >

      {/* ── Meta row: ticker, badges, time ── */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Ticker */}
        <span className="font-mono text-[0.8rem] font-black tracking-[0.06em] px-2.5 py-1 rounded-lg"
          style={{ background: 'var(--border-subtle)', border: '1px solid var(--border-med)', color: 'var(--text-primary)' }}>
          {ann.ticker}
        </span>

        {/* Sentiment badge */}
        {sentiment === 'bullish' && (
          <span className="flex items-center gap-1 font-mono text-[0.58rem] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded-md"
            style={{ background: 'color-mix(in srgb, var(--success), transparent 90%)', border: '1px solid color-mix(in srgb, var(--success), transparent 75%)', color: 'var(--success)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
            </svg>
            Bullish
          </span>
        )}
        {sentiment === 'bearish' && (
          <span className="flex items-center gap-1 font-mono text-[0.58rem] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded-md"
            style={{ background: 'color-mix(in srgb, var(--danger), transparent 90%)', border: '1px solid color-mix(in srgb, var(--danger), transparent 75%)', color: 'var(--danger)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5">
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>
            </svg>
            Bearish
          </span>
        )}
        {sentiment === 'neutral' && (
          <span className="flex items-center gap-1 font-mono text-[0.58rem] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded-md"
            style={{ background: 'color-mix(in srgb, var(--text-dim), transparent 88%)', border: '1px solid color-mix(in srgb, var(--text-dim), transparent 65%)', color: 'var(--text-dim)' }}>
            Neutral
          </span>
        )}

        {/* Market sensitive badge */}
        {sensitive && (
          <span className="flex items-center gap-1.5 font-mono text-[0.58rem] font-bold tracking-[0.06em] uppercase px-2 py-0.5 rounded-md"
            style={{ background: 'color-mix(in srgb, var(--danger), transparent 90%)', border: '1px solid color-mix(in srgb, var(--danger), transparent 75%)', color: 'var(--danger)' }}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: 'var(--danger)' }} />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: 'var(--danger)' }} />
            </span>
            Sensitive
          </span>
        )}

        {/* Time */}
        <div className="flex items-center gap-1 ml-auto font-mono text-[0.62rem]" style={{ color: 'var(--text-dim)' }}>
          <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5 flex-shrink-0">
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M6 3.5V6l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          {formatTime(ann.time)}
        </div>
      </div>

      {/* ── Company name ── */}
      <div className="text-[0.65rem] font-extrabold uppercase tracking-[0.18em] truncate -mt-1 transition-colors duration-150"
        style={{ color: 'var(--text-dim)' }}>
        {ann.company}
      </div>

      {/* ── Headline ── */}
      <a
        href={ann.url || '#'}
        target="_blank"
        rel="noopener noreferrer"
        onClick={e => e.stopPropagation()}
        className="block"
      >
        <h3 className="text-[0.93rem] font-bold leading-[1.6] line-clamp-2 tracking-[-0.01em] transition-colors duration-150"
          style={{ color: 'var(--text-primary)' }}>
          {ann.headline}
        </h3>
        <span className="inline-flex items-center gap-1 mt-1.5 text-[0.65rem] font-bold transition-colors duration-150"
          style={{ color: 'var(--accent)' }}>
          View on ASX
          <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5">
            <path d="M1.5 8.5L8.5 1.5M8.5 1.5H4M8.5 1.5V6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </a>

      {/* ── AI Summary ── */}
      {ann.summary && ann.summary.length > 0 && (
        <div className="rounded-xl p-3.5 mt-0.5 transition-colors min-w-0" style={{
          background: 'var(--border-subtle)',
          border: '1px solid var(--border-med)',
        }}>
          <div className="flex items-center gap-1.5 mb-2.5">
            {/* AI sparkle icon */}
            <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--accent)' }}>
              <path d="M8 1l1.2 4.8L14 8l-4.8 1.2L8 15l-1.2-4.8L2 8l4.8-1.2z" fill="currentColor" opacity="0.9"/>
            </svg>
            <span className="text-[0.58rem] font-bold uppercase tracking-[0.18em]"
              style={{ color: 'var(--accent)' }}>AI Summary</span>
          </div>
          <ul className="flex flex-col gap-2.5 min-w-0">
            {ann.summary.map((point, i) => (
              <li key={i} className="flex gap-2.5 text-[0.8rem] leading-[1.65] text-pretty break-words min-w-0"
                style={{ color: 'var(--text-secondary)' }}>
                <span className="mt-2 w-1 h-1 rounded-full flex-shrink-0 self-start"
                  style={{ background: 'var(--accent)' }} />
                <span className="min-w-0 flex-1">{point.replace(/^[\s\-\*\•\d\.]+\s*/, '')}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Tags ── */}
      {ann.tags && ann.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-3.5 mt-auto" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          {ann.tags.map(tag => {
            const cls = tagClass(tag);
            return (
              <span key={tag} className={`font-mono text-[0.58rem] font-bold uppercase tracking-[0.1em]
                px-2 py-0.5 rounded-md border ${TAG_BG[cls] ?? TAG_BG['']}`}>
                {tag}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
