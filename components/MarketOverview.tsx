'use client';

import React from 'react';
import type { SentimentFilter } from '@/lib/views';

/** What clicking a row does. Every row is a filter shortcut. */
export type TileAction =
  | { type: 'sentiment'; value: SentimentFilter }
  | { type: 'category'; value: string }
  | { type: 'sensitive' }
  | { type: 'reset' };

export interface OverviewCounts {
  total: number;
  sensitive: number;
  substantial: number;
  bullish: number;
  bearish: number;
  neutral: number;
  halts: number;
}

interface Props {
  counts: OverviewCounts;
  hasLog: boolean;
  isActive: (a: TileAction) => boolean;
  onSelect: (a: TileAction) => void;
}

const Glyph = {
  bull: <path d="M2.5 13.5l4-4 3 3 7.5-7.5M17 5v5m0-5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  bear: <path d="M17.5 6.5l-4 4-3-3-7.5 7.5M2.5 15v-5m0 5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  flat: <path d="M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />,
  star: <path d="M10 2l2.5 5 5.5.8-4 3.9.95 5.5L10 14.5l-4.95 2.7L6 11.7 2 7.8l5.5-.8z" fill="currentColor" />,
  holder: <path d="M10 2a4 4 0 100 8 4 4 0 000-8zM3 18a7 7 0 0114 0H3z" fill="currentColor" />,
  halt: <><rect x="5" y="4" width="4" height="12" rx="1.5" fill="currentColor" /><rect x="11" y="4" width="4" height="12" rx="1.5" fill="currentColor" /></>,
};

export default function MarketOverview({ counts, hasLog, isActive, onSelect }: Props) {
  const rows: { label: string; value: number; token: string; glyph: React.ReactNode; action: TileAction }[] = [
    { label: 'Bullish', value: counts.bullish, token: 'success', glyph: Glyph.bull, action: { type: 'sentiment', value: 'bullish' } },
    { label: 'Bearish', value: counts.bearish, token: 'danger', glyph: Glyph.bear, action: { type: 'sentiment', value: 'bearish' } },
    { label: 'Neutral', value: counts.neutral, token: 'text-dim', glyph: Glyph.flat, action: { type: 'sentiment', value: 'neutral' } },
    { label: 'Market sensitive', value: counts.sensitive, token: 'warning', glyph: Glyph.star, action: { type: 'sensitive' } },
    { label: 'Substantial holders', value: counts.substantial, token: 'accent', glyph: Glyph.holder, action: { type: 'category', value: 'Substantial Holding' } },
    { label: 'Trading halts', value: counts.halts, token: 'warning', glyph: Glyph.halt, action: { type: 'category', value: 'Trading Halt' } },
  ];

  // Part-to-whole, so it earns a bar. Every segment is direct-labelled in the
  // rows below, which is what keeps it readable when green and red are hard to
  // tell apart.
  const split = counts.bullish + counts.bearish + counts.neutral;
  const segments = [
    { n: counts.bullish, token: 'success' },
    { n: counts.bearish, token: 'danger' },
    { n: counts.neutral, token: 'text-dim' },
  ].filter(s => s.n > 0);

  const resetActive = isActive({ type: 'reset' });

  return (
    <div className="px-6 py-5 flex-shrink-0" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--text-dim)' }}>
          Market Overview
        </span>
        <span className="text-[0.55rem] font-medium" style={{ color: 'var(--text-dim)', opacity: 0.75 }}>
          tap to filter
        </span>
      </div>

      {/* Total — the anchor, and the way back to an unfiltered feed. */}
      <button
        onClick={() => onSelect({ type: 'reset' })}
        aria-pressed={resetActive}
        className="w-full text-left rounded-2xl p-4 mb-2.5 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99]"
        style={{
          background: resetActive ? 'var(--accent-dim)' : 'var(--border-subtle)',
          border: `1px solid ${resetActive ? 'var(--border-accent)' : 'var(--border-med)'}`,
        }}>
        <div className="flex items-baseline justify-between gap-2 mb-3">
          <span className="font-mono text-[1.9rem] font-bold leading-none tracking-tight"
            style={{ color: resetActive ? 'var(--accent-light)' : 'var(--text-primary)' }}>
            {hasLog ? counts.total : '–'}
          </span>
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--text-dim)' }}>
            Announcements
          </span>
        </div>

        {/* 2px gaps, not borders, separate the segments. */}
        {split > 0 && (
          <div className="flex gap-[2px] h-1.5" aria-hidden>
            {segments.map(s => (
              <div key={s.token}
                style={{
                  width: `${(s.n / split) * 100}%`,
                  background: `var(--${s.token})`,
                  borderRadius: 3,
                  opacity: s.token === 'text-dim' ? 0.45 : 1,
                }} />
            ))}
          </div>
        )}
      </button>

      {/* One row per filter. Full labels fit, nothing is orphaned in a half-empty
          grid row, and six saturated colour blocks become six quiet lines. */}
      <div className="flex flex-col gap-0.5">
        {rows.map(({ label, value, token, glyph, action }) => {
          const active = isActive(action);
          return (
            <button
              key={label}
              onClick={() => onSelect(action)}
              aria-pressed={active}
              className="group flex items-center gap-2.5 pl-2.5 pr-3 py-2 rounded-xl transition-all duration-150"
              style={{
                background: active ? `color-mix(in srgb, var(--${token}), transparent 88%)` : 'transparent',
                border: `1px solid ${active ? `color-mix(in srgb, var(--${token}), transparent 72%)` : 'transparent'}`,
              }}>
              <span className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                style={{
                  background: `color-mix(in srgb, var(--${token}), transparent ${active ? 78 : 88}%)`,
                  color: `var(--${token})`,
                }}>
                <svg viewBox="0 0 20 20" fill="none" className="w-3 h-3">{glyph}</svg>
              </span>
              <span className="text-[0.78rem] font-medium truncate"
                style={{ color: active ? `var(--${token})` : 'var(--text-secondary)' }}>
                {label}
              </span>
              <span className="ml-auto font-mono text-[0.78rem] font-bold tabular-nums flex-shrink-0"
                style={{ color: active ? `var(--${token})` : 'var(--text-dim)' }}>
                {value}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
