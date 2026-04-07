'use client';

import { DayLog } from '@/types';
import { formatDateLabel, getSentiment } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface Props {
  date: string;
  availableDates: string[];
  log: DayLog | null;
  filtered: number;
  activeTags: Set<string>;
  onDateChange: (d: string) => void;
  onTagToggle: (tag: string) => void;
  onCsvDownload: () => void;
  tagCounts: Record<string, number>;
}

export default function Sidebar({
  date, availableDates, log, filtered,
  activeTags, onDateChange,
  onTagToggle, onCsvDownload, tagCounts,
}: Props) {
  const [maxDate, setMaxDate] = useState('');
  useEffect(() => {
    const local = new Date();
    local.setHours(local.getHours() + 11);
    setMaxDate(local.toISOString().slice(0, 10));
  }, []);

  const haltCount = log?.announcements.filter(a => {
    const t = a.headline.toLowerCase();
    return t.includes('halt') || t.includes('suspension') || t.includes('pause') ||
           a.tags.some(tag => ['halt', 'suspension', 'pause'].some(k => tag.toLowerCase().includes(k)));
  }).length ?? 0;

  const bullishCount = log?.announcements.filter(a => getSentiment(a) === 'bullish').length ?? 0;
  const bearishCount = log?.announcements.filter(a => getSentiment(a) === 'bearish').length ?? 0;
  const neutralCount = log?.announcements.filter(a => getSentiment(a) === 'neutral').length ?? 0;

  const substantialCount = log?.announcements.filter(a =>
    a.tags?.some(t => t.toLowerCase().includes('substantial')) ||
    a.document_type?.toLowerCase().includes('substantial')
  ).length ?? 0;

  const sensitiveCount = log?.announcements.filter(a => a.market_sensitive).length ?? 0;

  const stats = [
    {
      label: 'Announcements',
      value: log?.announcements.length ?? '–',
      sub: 'total captured',
      icon: (
        <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4"><path d="M4 4h12v2H4zM4 9h12v2H4zM4 14h8v2H4z" fill="currentColor" opacity="0.9"/></svg>
      ),
      color: 'indigo',
    },
    {
      label: 'Market Sensitive',
      value: sensitiveCount,
      sub: 'high priority',
      icon: (
        <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4"><path d="M10 2l2.5 5 5.5.8-4 3.9.95 5.5L10 14.5l-4.95 2.7L6 11.7 2 7.8l5.5-.8z" fill="currentColor"/></svg>
      ),
      color: 'rose',
    },
    {
      label: 'Substantial Holders',
      value: substantialCount,
      sub: 'ownership changes',
      icon: (
        <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4"><path d="M10 2a4 4 0 100 8 4 4 0 000-8zM3 18a7 7 0 0114 0H3z" fill="currentColor"/></svg>
      ),
      color: 'blue',
    },
    {
      label: 'Bullish Signals',
      value: bullishCount,
      sub: 'upside potential',
      icon: (
        <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4"><path d="M2.5 13.5l4-4 3 3 7.5-7.5M17 5v5m0-5h-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
      ),
      color: 'emerald',
    },
    {
      label: 'Bearish Signals',
      value: bearishCount,
      sub: 'downside risk',
      icon: (
        <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4"><path d="M17.5 6.5l-4 4-3-3-7.5 7.5M2.5 15v-5m0 5h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
      ),
      color: 'fuchsia',
    },
    {
      label: 'Neutral',
      value: neutralCount,
      sub: 'balanced / procedural',
      icon: (
        <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4"><path d="M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
      ),
      color: 'slate',
    },
    {
      label: 'Active Tickers',
      value: log ? new Set(log.announcements.map(a => a.ticker)).size : '–',
      sub: 'companies active',
      icon: (
        <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.8"/><path d="M7 10.5l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
      ),
      color: 'indigo',
    },
    {
      label: 'Trading Halts',
      value: haltCount,
      sub: 'halted today',
      icon: (
        <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4"><rect x="5" y="4" width="4" height="12" rx="1.5" fill="currentColor"/><rect x="11" y="4" width="4" height="12" rx="1.5" fill="currentColor"/></svg>
      ),
      color: 'amber',
    },
  ];

  const colorMap: Record<string, { bg: string; text: string; border: string; icon: string; glow: string }> = {
    indigo: {
      bg: 'bg-indigo-500/[0.08]',
      text: 'text-indigo-300',
      border: 'border-indigo-500/20',
      icon: 'text-indigo-400 bg-indigo-500/15',
      glow: 'shadow-[0_0_20px_rgba(99,102,241,0.12)]',
    },
    blue: {
      bg: 'bg-blue-500/[0.08]',
      text: 'text-blue-300',
      border: 'border-blue-500/20',
      icon: 'text-blue-400 bg-blue-500/15',
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.12)]',
    },
    rose: {
      bg: 'bg-rose-500/[0.08]',
      text: 'text-rose-300',
      border: 'border-rose-500/20',
      icon: 'text-rose-400 bg-rose-500/15',
      glow: 'shadow-[0_0_20px_rgba(244,63,94,0.12)]',
    },
    emerald: {
      bg: 'bg-emerald-500/[0.07]',
      text: 'text-emerald-300',
      border: 'border-emerald-500/20',
      icon: 'text-emerald-400 bg-emerald-500/15',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.1)]',
    },
    amber: {
      bg: 'bg-amber-500/[0.07]',
      text: 'text-amber-300',
      border: 'border-amber-500/20',
      icon: 'text-amber-400 bg-amber-500/15',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.1)]',
    },
  };

  return (
    <aside className="w-[280px] min-w-[280px] flex flex-col h-screen sticky top-0 overflow-y-auto overflow-x-hidden pb-8 [scrollbar-width:none] relative transition-all duration-300"
      style={{ 
        background: 'var(--bg-sidebar)', 
        borderRight: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sidebar)'
      }}>

      {/* Top gradient accent line (Vibrant only) */}
      <div className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-500"
        style={{ 
          background: 'linear-gradient(90deg, var(--accent) 0%, var(--accent-light) 40%, var(--success) 100%)',
          opacity: 1
        }} />

      {/* Subtle corner glow (Vibrant only) */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full pointer-events-none transition-opacity duration-500"
        style={{ 
          background: 'radial-gradient(ellipse at 0% 0%, var(--accent-dim) 0%, transparent 70%)',
          opacity: 1
        }} />

      {/* ── Logo ── */}
      <div className="px-6 pt-8 pb-6 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.045)' }}>
        <div className="flex items-center gap-3.5">
          {/* Icon with gradient glow */}
          <div className="relative w-10 h-10 flex-shrink-0">
            <div className="absolute inset-0 rounded-[12px]"
              style={{ 
                background: 'linear-gradient(135deg, var(--accent), var(--accent-light))', 
                boxShadow: 'var(--glow-accent), 0 4px 12px rgba(0,0,0,0.2)', 
                inset: '0px'
              }} />
            <div className="absolute inset-0 flex items-center justify-center rounded-[12px]">
              <svg viewBox="0 0 16 16" fill="none" className="w-5 h-5">
                <rect x="1.5" y="9.5" width="3" height="5" rx="1" fill="white" opacity="0.75"/>
                <rect x="6.5" y="5.5" width="3" height="9" rx="1" fill="white"/>
                <rect x="11.5" y="2" width="3" height="12.5" rx="1" fill="white" opacity="0.92"/>
              </svg>
            </div>
          </div>

          <div>
            <div className="text-[1.2rem] font-extrabold tracking-tight leading-none" style={{ color: 'var(--text-primary)' }}>
              Vitti<em className="not-italic"
                style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ASX</em>
            </div>
            <div className="text-[0.58rem] font-bold uppercase tracking-[0.22em] mt-1"
              style={{ color: 'var(--text-dim)' }}>
              Intelligence Center
            </div>
          </div>
        </div>
      </div>

      {/* ── Date Picker ── */}
      <div className="px-6 py-5 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.045)' }}>
        <label className="block text-[0.6rem] font-bold uppercase tracking-[0.2em] mb-2.5"
          style={{ color: 'rgba(148,163,184,0.6)' }}>
          Trading Date
        </label>
        <div className="relative group">
          <select
            value={date}
            onChange={e => onDateChange(e.target.value)}
            className="w-full pl-3 pr-9 py-2.5 rounded-xl font-mono text-[0.8rem] outline-none cursor-pointer appearance-none transition-all truncate"
            style={{
              background: 'var(--border-subtle)',
              border: '1px solid var(--border-med)',
              color: 'var(--text-primary)',
              boxShadow: 'inset 0 1px 0 var(--border-subtle)',
            }}
          >
            {date && !availableDates.includes(date) && (
              <option value={date} style={{ background: 'var(--bg-sidebar)', color: 'var(--text-primary)' }}>{formatDateLabel(date)} (Live)</option>
            )}
            {availableDates.map(d => (
              <option key={d} value={d} style={{ background: 'var(--bg-sidebar)', color: 'var(--text-primary)' }}>{formatDateLabel(d)}</option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-indigo-400 transition-colors">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <path d="M4 6l4 4 4-4"/>
            </svg>
          </div>
        </div>
        {log && (
          <p className="text-[0.68rem] font-medium mt-2.5 flex items-center gap-1.5" style={{ color: 'var(--text-dim)' }}>
            <span className="w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--success)', boxShadow: '0 0 6px var(--success)' }} />
            {formatDateLabel(log.date)} · Data loaded
          </p>
        )}
      </div>

      {/* ── Market Overview Stats ── */}
      <div className="px-6 py-5 flex-shrink-0" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <label className="block text-[0.6rem] font-bold uppercase tracking-[0.2em] mb-4"
          style={{ color: 'var(--text-dim)' }}>
          Market Overview
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {stats.map(({ label, value, sub, icon, color }) => {
            const cssVar = (
              color === 'indigo' || color === 'blue' ? 'accent'
              : color === 'emerald' ? 'success'
              : color === 'rose' || color === 'fuchsia' ? 'danger'
              : color === 'amber' ? 'warning'
              : color === 'slate' ? 'text-dim'
              : 'accent'
            );
            return (
              <div key={label}
                className={`relative rounded-[14px] p-3.5 border group cursor-default overflow-hidden hover:-translate-y-0.5 hover:brightness-110 transition-all duration-200`}
                style={{
                  background: `color-mix(in srgb, var(--${cssVar}), transparent 92%)`,
                  borderColor: `color-mix(in srgb, var(--${cssVar}), transparent 80%)`,
                  boxShadow: 'var(--glow-accent)',
                }}>
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center mb-2.5`}
                  style={{ 
                    background: `color-mix(in srgb, var(--${cssVar}), transparent 85%)`,
                    color: `var(--${cssVar})`
                  }}>
                  {icon}
                </div>
                <div className={`font-mono text-[1.55rem] font-bold leading-none tracking-tight mb-1`}
                   style={{ color: `var(--${cssVar})` }}>
                  {value}
                </div>
                <div className="text-[0.6rem] font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--text-dim)' }}>
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Export Button ── */}
      <div className="px-6 py-5 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.045)' }}>
        <button
          onClick={onCsvDownload}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-white text-[0.82rem] font-bold tracking-wide transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #06b6d4 100%)',
            boxShadow: '0 4px 20px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
          }}
        >
          <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 drop-shadow">
            <path d="M8 2v8M5 7l3 3 3-3M3 13h10" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Export CSV Data
        </button>
      </div>

      {/* ── Active Topics / Tags ── */}
      <div className="px-6 py-5 flex-shrink-0">
        <label className="flex items-center justify-between text-[0.6rem] font-bold uppercase tracking-[0.2em] mb-3.5"
          style={{ color: 'rgba(148,163,184,0.6)' }}>
          <span>Active Topics</span>
          {activeTags.size > 0 && (
            <span className="text-indigo-400 bg-indigo-500/15 border border-indigo-500/25 px-2 py-0.5 rounded-full text-[0.55rem] font-bold normal-case tracking-normal">
              {activeTags.size} active
            </span>
          )}
        </label>
        <div className="flex flex-col gap-1">
          {Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([tag, count]) => {
              const active = activeTags.has(tag);
              return (
                <button
                  key={tag}
                  onClick={() => onTagToggle(tag)}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-[0.8rem] font-medium
                    transition-all duration-150 border
                    ${active
                      ? 'bg-indigo-500/12 text-indigo-300 border-indigo-500/25'
                      : 'bg-transparent border-transparent hover:bg-white/[0.04] hover:border-white/[0.07]'
                    }`}
                  style={active ? { color: 'rgba(165,180,252,0.9)' } : { color: 'rgba(148,163,184,0.6)' }}
                >
                  <span className="flex items-center gap-2.5">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-200
                      ${active ? 'bg-indigo-400 shadow-[0_0_6px_rgba(99,102,241,0.8)]' : 'bg-slate-700 group-hover:bg-slate-500'}`} />
                    {tag}
                  </span>
                  <span className={`font-mono text-[0.65rem] px-1.5 py-0.5 rounded-md transition-colors
                    ${active
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/25'
                      : 'text-slate-600 group-hover:text-slate-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })
          }
        </div>
      </div>
    </aside>
  );
}
