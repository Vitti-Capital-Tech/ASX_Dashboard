'use client';

import type { ReactNode } from 'react';

export interface HeaderStat {
  value: ReactNode;
  label: string;
}

/**
 * The one place a view's title, context and actions live. Export used to sit
 * bottom-left in the sidebar on the feed and top-right inside the scorecard —
 * the same action in opposite corners depending on where you were.
 *
 * `stats` exists because the feed's context was one dim run-on line:
 * "400 announcements · 53 market sensitive · Fri, 4 Sept 2026". Three separate
 * facts at one weight, in one colour, separated by punctuation — so it read as
 * a sentence rather than as numbers, and none of them were legible at a glance.
 * Use `stats` for counts and `subtitle` for prose; a view wanting both is a
 * sign it is saying too much.
 */
export default function ViewHeader({ title, subtitle, stats, meta, actions }: {
  title: string;
  subtitle?: ReactNode;
  stats?: HeaderStat[];
  /** Trailing context that is not a number — the trading date, typically. */
  meta?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 mb-5">
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="text-[1.35rem] font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h2>
          {meta && (
            <span className="text-[0.78rem] font-medium" style={{ color: 'var(--text-dim)' }}>
              {meta}
            </span>
          )}
        </div>

        {subtitle && (
          <p className="text-[0.8rem] mt-1.5 leading-relaxed max-w-[62ch]" style={{ color: 'var(--text-dim)' }}>
            {subtitle}
          </p>
        )}

        {stats && stats.length > 0 && (
          // The number carries the weight and the mono face; the label stays
          // small and quiet beside it. A gap separates the pairs, so no
          // punctuation is doing structural work.
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1.5 mt-2.5">
            {stats.map(s => (
              <span key={s.label} className="flex items-baseline gap-1.5">
                <b className="font-mono text-[1rem] font-bold tabular-nums leading-none"
                  style={{ color: 'var(--text-primary)' }}>
                  {s.value}
                </b>
                <span className="text-[0.74rem] font-medium" style={{ color: 'var(--text-dim)' }}>
                  {s.label}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Full width on phones so the actions get their own row instead of
          overflowing off the right edge. */}
      {actions && (
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:flex-shrink-0">{actions}</div>
      )}
    </header>
  );
}
