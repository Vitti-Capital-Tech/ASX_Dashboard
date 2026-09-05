'use client';

import type { ReactNode } from 'react';

/**
 * The one place a view's title, context line and actions live. Export used to
 * sit bottom-left in the sidebar on the feed and top-right inside the scorecard
 * — the same action in opposite corners depending on where you were.
 */
export default function ViewHeader({ title, subtitle, actions }: {
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3 mb-5">
      <div className="min-w-0">
        <h2 className="text-[1.35rem] font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-[0.78rem] mt-1.5 leading-relaxed max-w-[62ch]" style={{ color: 'var(--text-dim)' }}>
            {subtitle}
          </p>
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
