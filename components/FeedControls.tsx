'use client';

import { useState } from 'react';
import type { ViewMode } from '@/types';

interface Props {
  search: string;
  viewMode: ViewMode;
  onSearchChange: (s: string) => void;
  onViewChange: (v: ViewMode) => void;
  onCsvDownload: () => void;
  canExport: boolean;
}

/**
 * Search, layout toggle and export for the announcements feed. These sat in the
 * global topbar, where the layout toggle stayed visible on views that have no
 * grid to toggle. They belong to the feed, so they render with it.
 */
export default function FeedControls({
  search, viewMode, onSearchChange, onViewChange, onCsvDownload, canExport,
}: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <>
      <div className="relative flex items-center flex-1 min-w-[150px] sm:flex-none">
        <svg className="absolute left-3.5 w-3.5 h-3.5 pointer-events-none transition-colors duration-150"
          style={{ color: focused ? 'var(--accent)' : 'var(--text-dim)', opacity: focused ? 1 : 0.5 }}
          viewBox="0 0 16 16" fill="none">
          <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.6" />
          <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search tickers, companies…"
          aria-label="Search announcements"
          className="text-[0.8rem] font-medium pl-9 pr-8 py-2 outline-none rounded-xl w-full sm:w-[200px] sm:focus:w-[240px] transition-[width,border-color,box-shadow] duration-200"
          style={{
            background: 'var(--border-subtle)',
            border: focused ? '1px solid var(--accent)' : '1px solid var(--border-med)',
            color: 'var(--text-primary)',
            boxShadow: focused ? 'var(--glow-accent)' : 'none',
          }}
        />
        {search && (
          <button onClick={() => onSearchChange('')} aria-label="Clear search"
            className="absolute right-3 transition-colors" style={{ color: 'var(--text-dim)' }}>
            <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
              <path d="M4 12L12 4M4 4l8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex rounded-xl p-0.5 gap-0.5"
        style={{ background: 'var(--border-subtle)', border: '1px solid var(--border-med)' }}>
        {(['grid', 'list'] as ViewMode[]).map(v => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            title={`${v === 'grid' ? 'Grid' : 'List'} view`}
            aria-label={`${v === 'grid' ? 'Grid' : 'List'} view`}
            aria-pressed={viewMode === v}
            className="w-8 h-7 flex items-center justify-center rounded-lg transition-all duration-150"
            style={viewMode === v
              ? { background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--border-accent)' }
              : { color: 'var(--text-dim)', border: '1px solid transparent' }}>
            {v === 'grid' ? (
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                <path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={onCsvDownload}
        disabled={!canExport}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[0.75rem] font-semibold transition-all duration-150 hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
        style={{ background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', color: 'var(--accent-light)' }}>
        <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
          <path d="M8 2v8M5 7l3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Export CSV
      </button>
    </>
  );
}
