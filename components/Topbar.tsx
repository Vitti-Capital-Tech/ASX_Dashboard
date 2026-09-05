'use client';

import type { ViewKey } from '@/types';
import { VIEWS } from '@/lib/views';

interface Props {
  activeView: ViewKey;
  theme: 'dark' | 'light';
  onViewChange: (v: ViewKey) => void;
  onThemeToggle: () => void;
  onMenuToggle: () => void;
  onRefresh: () => void;
  lastUpdated: Date | null;
}

/**
 * Navigation only. Filters used to live here too, mixed in with the section
 * links, so a click could either narrow the current list or move you to a
 * different page — and the strip overflowed far enough to push the default
 * tab off-screen. Filters now live in FilterBar, above the content they act on.
 */
export default function Topbar({
  activeView, theme, onViewChange, onThemeToggle, onMenuToggle, onRefresh, lastUpdated,
}: Props) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-4 px-4 sm:px-6 h-[60px] transition-all duration-300"
      style={{
        background: 'var(--bg-nav)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        boxShadow: theme === 'dark' ? '0 8px 32px rgba(0,0,0,0.35)' : '0 4px 12px rgba(0,0,0,0.05)',
      }}>

      {/* ── Navigation ── */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0 transition-all duration-150"
          style={{ background: 'var(--border-subtle)', border: '1px solid var(--border-med)', color: 'var(--text-secondary)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>

        <nav className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none]" aria-label="Sections">
          {VIEWS.map(v => {
            const active = activeView === v.key;
            return (
              <button
                key={v.key}
                onClick={() => onViewChange(v.key)}
                aria-current={active ? 'page' : undefined}
                className="px-3.5 py-2 rounded-xl text-[0.82rem] font-semibold whitespace-nowrap flex-shrink-0 transition-all duration-150"
                style={{
                  background: active ? 'var(--accent-dim)' : 'transparent',
                  border: `1px solid ${active ? 'var(--border-accent)' : 'transparent'}`,
                  color: active ? 'var(--accent-light)' : 'var(--text-dim)',
                }}>
                {v.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Global utilities ── */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <div className="flex items-center gap-1">
          {lastUpdated && (
            <div className="hidden md:flex flex-col items-end mr-1">
              <span className="text-[0.55rem] font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--text-dim)' }}>
                Updated
              </span>
              <span className="font-mono text-[0.7rem] font-medium" style={{ color: 'var(--text-secondary)' }}>
                {lastUpdated.toLocaleTimeString('en-AU', { timeZone: 'Australia/Sydney', hour: '2-digit', minute: '2-digit', hour12: true })}
              </span>
            </div>
          )}
          <button
            onClick={onRefresh}
            title="Refresh"
            aria-label="Refresh"
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-opacity duration-150 hover:opacity-100"
            style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
          </button>
        </div>

        <div className="w-[1px] h-5 hidden sm:block" style={{ background: 'var(--border-subtle)' }} />

        <button
          onClick={onThemeToggle}
          title="Toggle light / dark"
          aria-label="Toggle light or dark theme"
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200"
          style={{ color: 'var(--text-secondary)', background: 'var(--border-subtle)', border: '1px solid var(--border-med)' }}>
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
              <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
