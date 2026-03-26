'use client';

import { DayLog } from '@/types';
import { formatDateLabel } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface Props {
  date: string;
  log: DayLog | null;
  filtered: number;
  sensitiveOnly: boolean;
  activeTags: Set<string>;
  onDateChange: (d: string) => void;
  onSensitiveToggle: (v: boolean) => void;
  onTagToggle: (tag: string) => void;
  onCsvDownload: () => void;
  tagCounts: Record<string, number>;
}

export default function Sidebar({
  date, log, filtered, sensitiveOnly,
  activeTags, onDateChange, onSensitiveToggle,
  onTagToggle, onCsvDownload, tagCounts,
}: Props) {
  const [maxDate, setMaxDate] = useState('');
  useEffect(() => {
    const local = new Date();
    local.setHours(local.getHours() + 11);
    setMaxDate(local.toISOString().slice(0, 10));
  }, []);

  return (
    <aside className="w-[300px] min-w-[300px] bg-slate-50 dark:bg-[#080c18] border-r border-slate-200 dark:border-white/5
      flex flex-col h-screen sticky top-0 overflow-y-auto overflow-x-hidden pb-8
      [scrollbar-width:none] relative transition-colors duration-300">

      {/* Top accent glow */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 opacity-100 dark:opacity-90 shadow-[0_0_12px_rgba(99,102,241,0.3)] dark:shadow-[0_0_20px_rgba(99,102,241,0.6)]" />

      {/* Logo Area */}
      <div className="px-7 pt-9 pb-7 border-b border-slate-200 dark:border-white/5 relative overflow-hidden transition-colors flex-shrink-0">
        {/* Decorative background glow */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[50px] pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0
            bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400
            shadow-[0_4px_12px_rgba(99,102,241,0.2),inset_0_2px_4px_rgba(255,255,255,0.3)] dark:shadow-[0_4px_24px_rgba(99,102,241,0.4),inset_0_2px_4px_rgba(255,255,255,0.3)]
            border border-indigo-400/30">
            <svg viewBox="0 0 16 16" fill="none" className="w-6 h-6">
              <rect x="2" y="9" width="3" height="5" rx="1" fill="white" opacity="0.8"/>
              <rect x="6.5" y="5" width="3" height="9" rx="1" fill="white"/>
              <rect x="11" y="2" width="3" height="12" rx="1" fill="white" opacity="0.95"/>
            </svg>
          </div>
          <div>
            <div className="text-[1.3rem] font-bold tracking-tight text-slate-800 dark:text-white drop-shadow-sm transition-colors">
              Vitti<em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400">ASX</em>
            </div>
            <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-indigo-500 dark:text-indigo-200/60 mt-0.5 transition-colors">
              Intelligence
            </div>
          </div>
        </div>
      </div>

      {/* Date picker */}
      <div className="px-7 py-6 border-b border-slate-200 dark:border-white/5 transition-colors flex-shrink-0">
        <label className="block text-[0.65rem] font-bold uppercase tracking-[0.18em] text-slate-500 mb-2.5">
          Trading Date
        </label>
        <div className="relative group">
          <input
            type="date"
            value={date}
            max={maxDate || undefined}
            onChange={e => onDateChange(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0d1022] border border-slate-200 dark:border-white/10 rounded-xl
              text-slate-800 dark:text-slate-100 font-mono text-[0.9rem] outline-none shadow-inner
              focus:border-indigo-400 dark:focus:border-indigo-500/70 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/15
              hover:border-slate-300 dark:group-hover:border-white/20
              [color-scheme:light] dark:[color-scheme:dark]
              transition-all duration-200 cursor-pointer"
          />
        </div>
        {log && (
          <p className="text-[0.72rem] font-medium text-slate-500 dark:text-slate-400 mt-3 flex items-center gap-1.5 transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)] dark:shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            {formatDateLabel(log.date)}
          </p>
        )}
      </div>

      {/* Daily Stats */}
      <div className="px-7 py-6 border-b border-slate-200 dark:border-white/5 transition-colors flex-shrink-0">
        <label className="block text-[0.65rem] font-bold uppercase tracking-[0.18em] text-slate-500 mb-4">
          Market Overview
        </label>
        <div className="grid grid-cols-2 gap-3.5">
          {[
            { label: 'Total News', value: log?.total ?? '–', color: 'text-slate-800 dark:text-white', danger: false },
            { label: 'Sensitive', value: log?.market_sensitive_count ?? '–', color: 'text-rose-600 dark:text-rose-400', danger: true },
            { label: 'Tickers', value: log ? new Set(log.announcements.map(a => a.ticker)).size : '–', color: 'text-slate-800 dark:text-white', danger: false },
            { label: 'Showing', value: filtered, color: 'text-indigo-600 dark:text-indigo-300', danger: false },
          ].map(({ label, value, color, danger }) => (
            <div key={label}
              className={`rounded-[14px] p-4 border transition-all duration-300 relative overflow-hidden group
                ${danger
                  ? 'bg-rose-50 dark:bg-rose-500/5 border-rose-200 dark:border-rose-500/20 hover:border-rose-300 dark:hover:border-rose-500/40 hover:bg-rose-100 dark:hover:bg-rose-500/10'
                  : 'bg-white dark:bg-[#0d1022] border-slate-200 dark:border-white/10 hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:bg-indigo-50 dark:hover:bg-indigo-500/5'
                } hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]`}>
              
              {/* Bottom decorative bar */}
              <div className={`absolute bottom-0 left-0 right-0 h-[2px] opacity-40 group-hover:opacity-100 transition-opacity duration-300
                ${danger ? 'bg-rose-500' : 'bg-gradient-to-r from-indigo-500 to-cyan-400'}`} />
              
              <div className={`font-mono text-[1.7rem] font-bold leading-none tracking-tight mb-1.5 ${color} drop-shadow-sm transition-colors`}>
                {value}
              </div>
              <div className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toggles & Export */}
      <div className="px-7 py-6 border-b border-slate-200 dark:border-white/5 flex flex-col gap-6 transition-colors flex-shrink-0">
        <div>
          <label className="block text-[0.65rem] font-bold uppercase tracking-[0.18em] text-slate-500 mb-3">
            Focus Mode
          </label>
          <label className="flex items-center justify-between cursor-pointer group p-3 rounded-xl bg-white dark:bg-[#0d1022] border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-colors shadow-sm dark:shadow-none">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                ${sensitiveOnly ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-[0.88rem] font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                Market Sensitive
              </span>
            </div>
            
            <div className="relative w-11 h-6 flex-shrink-0">
              <input
                type="checkbox"
                checked={sensitiveOnly}
                onChange={e => onSensitiveToggle(e.target.checked)}
                className="sr-only"
              />
              <div className={`absolute inset-0 rounded-full transition-all duration-300 shadow-inner
                ${sensitiveOnly ? 'bg-rose-500' : 'bg-slate-300 dark:bg-slate-700'}`}
              />
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300
                ${sensitiveOnly ? 'translate-x-[22px]' : 'translate-x-1'}`}
              />
            </div>
          </label>
        </div>

        <button
          onClick={onCsvDownload}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl
            bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400
            text-white text-[0.85rem] font-bold tracking-wide
            shadow-[0_4px_12px_rgba(99,102,241,0.2),inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[0_4px_20px_rgba(99,102,241,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)]
            hover:shadow-[0_8px_20px_rgba(99,102,241,0.3)] dark:hover:shadow-[0_8px_32px_rgba(99,102,241,0.4)]
            hover:-translate-y-0.5 active:translate-y-0
            transition-all duration-200">
          <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 drop-shadow-sm">
            <path d="M2.5 5.5v7a1 1 0 001 1h9a1 1 0 001-1v-7m-10-3h8m-6.5 3h5M8 4v6m0 0l2-2m-2 2L6 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Export CSV Data
        </button>
      </div>

      {/* Tags */}
      <div className="px-7 py-6 flex-shrink-0">
        <label className="block text-[0.65rem] font-bold uppercase tracking-[0.18em] text-slate-500 mb-3.5 flex items-center justify-between">
          <span>Active Topics</span>
          {activeTags.size > 0 && (
            <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-full text-[0.55rem] transition-colors">
              {activeTags.size} Selected
            </span>
          )}
        </label>
        <div className="flex flex-col gap-1.5">
          {Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([tag, count]) => {
              const active = activeTags.has(tag);
              return (
                <button
                  key={tag}
                  onClick={() => onTagToggle(tag)}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-[0.82rem] font-medium
                    transition-all duration-200 border
                    ${active
                      ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                      : 'bg-transparent text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-200/50 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full transition-colors ${active ? 'bg-indigo-500 dark:bg-indigo-400' : 'bg-transparent group-hover:bg-slate-400 dark:group-hover:bg-slate-600'}`} />
                    {tag}
                  </span>
                  <span className={`font-mono text-[0.68rem] px-2 py-0.5 rounded-lg border transition-colors
                    ${active
                      ? 'bg-white dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-200 border-indigo-200 dark:border-indigo-500/30 shadow-sm'
                      : 'bg-white dark:bg-[#0d1022] text-slate-500 border-slate-200 dark:border-white/[0.08] group-hover:border-slate-300 dark:group-hover:border-white/[0.15] shadow-sm dark:shadow-none'}`}>
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
