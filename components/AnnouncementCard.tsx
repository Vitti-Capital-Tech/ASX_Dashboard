'use client';

import type { CSSProperties } from 'react';
import { Announcement } from '@/types';
import { formatTime, getSentiment, TAG_STYLE } from '@/lib/utils';

interface Props {
  ann: Announcement;
}

const SENTIMENT_TOKEN = {
  bullish: 'success',
  bearish: 'danger',
  neutral: 'text-dim',
} as const;

export default function AnnouncementCard({ ann }: Props) {
  const sentiment = getSentiment(ann);
  const token = SENTIMENT_TOKEN[sentiment];

  // Sentiment rides on one accent edge and one badge. It used to also wash the
  // whole card in a coloured gradient, which turned a screen of 400 cards into
  // a field of green and red and left no quiet surface to read against.
  const surface: CSSProperties & Record<'--card-glow', string> = {
    background: 'var(--bg-card)',
    border: `1px solid color-mix(in srgb, var(--${token}), transparent 86%)`,
    borderLeft: `3px solid color-mix(in srgb, var(--${token}), transparent 30%)`,
    boxShadow: 'var(--shadow-card)',
    // Hover shadow as a custom property, so the class below can apply it
    // without JS. The old handlers wrote box-shadow imperatively and reset it
    // to a hardcoded black on mouse-out — which discarded the card's own
    // shadow after a single hover, and looked wrong in light mode.
    '--card-glow': `0 18px 44px color-mix(in srgb, var(--${token}), transparent 88%),
                    0 0 0 1px color-mix(in srgb, var(--${token}), transparent 80%)`,
  };

  return (
    <article
      className="group relative flex flex-col h-full gap-3 p-5 rounded-[18px] min-w-0
                 transition-[transform,box-shadow] duration-300 hover:-translate-y-1
                 hover:shadow-[var(--card-glow)]"
      style={surface}>

      {/* ── Ticker, badges, time ── */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[0.8rem] font-black tracking-[0.06em] px-2.5 py-1 rounded-lg"
          style={{ background: 'var(--border-subtle)', border: '1px solid var(--border-med)', color: 'var(--text-primary)' }}>
          {ann.ticker}
        </span>

        <span className="flex items-center gap-1 font-mono text-[0.58rem] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded-md"
          style={{
            background: `color-mix(in srgb, var(--${token}), transparent 90%)`,
            border: `1px solid color-mix(in srgb, var(--${token}), transparent 75%)`,
            color: `var(--${token})`,
          }}>
          {sentiment === 'bullish' && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
            </svg>
          )}
          {sentiment === 'bearish' && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5">
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" />
            </svg>
          )}
          {sentiment}
        </span>

        {/* The ASX's own price-sensitive flag. Amber, not red — it means
            "this one matters", not "this is bad news", and a red pill beside a
            red Bearish pill read as one repeated warning. */}
        {ann.market_sensitive && (
          <span className="flex items-center gap-1.5 font-mono text-[0.58rem] font-bold uppercase tracking-[0.06em] px-2 py-0.5 rounded-md"
            style={{
              background: 'color-mix(in srgb, var(--warning), transparent 90%)',
              border: '1px solid color-mix(in srgb, var(--warning), transparent 75%)',
              color: 'var(--warning)',
            }}>
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-2 h-2">
              <path d="M10 2l2.5 5 5.5.8-4 3.9.95 5.5L10 14.5l-4.95 2.7L6 11.7 2 7.8l5.5-.8z" />
            </svg>
            Sensitive
          </span>
        )}

        <span className="flex items-center gap-1.5 ml-auto font-mono text-[0.7rem] font-medium tabular-nums"
          style={{ color: 'var(--text-secondary)' }}>
          <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 flex-shrink-0 opacity-70">
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M6 3.5V6l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          {formatTime(ann.time)}
        </span>
      </div>

      {/* ── Headline, with the company as its lead-in ── */}
      <div className="min-w-0">
        <div className="text-[0.62rem] font-bold uppercase tracking-[0.14em] truncate mb-1.5"
          style={{ color: 'var(--text-dim)' }} title={ann.company}>
          {ann.company}
        </div>
        <a href={ann.url || '#'} target="_blank" rel="noopener noreferrer"
          className="block group/link">
          <h3 className="text-[0.93rem] font-bold leading-[1.45] line-clamp-2 tracking-[-0.01em] group-hover/link:underline"
            style={{ color: 'var(--text-primary)' }} title={ann.headline}>
            {ann.headline}
          </h3>
        </a>
      </div>

      {/* ── AI summary ── */}
      {ann.summary && ann.summary.length > 0 && (
        <div className="rounded-xl p-3.5 min-w-0"
          style={{ background: 'var(--border-subtle)', border: '1px solid var(--border-med)' }}>
          <div className="flex items-center gap-1.5 mb-2.5">
            <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--accent)' }}>
              <path d="M8 1l1.2 4.8L14 8l-4.8 1.2L8 15l-1.2-4.8L2 8l4.8-1.2z" fill="currentColor" opacity="0.9" />
            </svg>
            <span className="text-[0.58rem] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--accent)' }}>
              AI Summary
            </span>
          </div>
          <ul className="flex flex-col gap-2 min-w-0">
            {ann.summary.map((point, i) => (
              <li key={i} className="flex gap-2.5 text-[0.79rem] leading-[1.6] text-pretty break-words min-w-0"
                style={{ color: 'var(--text-secondary)' }}>
                <span className="mt-[0.55em] w-1 h-1 rounded-full flex-shrink-0" style={{ background: 'var(--accent)' }} />
                <span className="min-w-0 flex-1">{point.replace(/^[\s\-*•\d.]+\s*/, '')}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Tags and the source link, pinned to the bottom so cards in a row
             line up instead of ending at ragged heights ── */}
      <div className="flex flex-wrap items-center gap-1.5 pt-3 mt-auto"
        style={{ borderTop: '1px solid var(--border-subtle)' }}>
        {ann.tags?.map(tag => (
          <span key={tag} style={TAG_STYLE}
            className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.1em] px-2 py-0.5 rounded-md">
            {tag}
          </span>
        ))}
        <a href={ann.url || '#'} target="_blank" rel="noopener noreferrer"
          className="ml-auto inline-flex items-center gap-1 text-[0.65rem] font-bold hover:underline"
          style={{ color: 'var(--accent)' }}>
          View on ASX
          <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5">
            <path d="M1.5 8.5L8.5 1.5M8.5 1.5H4M8.5 1.5V6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </article>
  );
}
