'use client';

import { ViewMode } from '@/types';
import { useState } from 'react';

interface Props {
  dateLabel: string;
  viewMode: ViewMode;
  search: string;
  theme: 'dark' | 'light';
  onViewChange: (v: ViewMode) => void;
  onSearchChange: (s: string) => void;
  onThemeToggle: () => void;
  onMenuToggle: () => void;
  onRefresh: () => void;
  lastUpdated: Date | null;
}

export default function Topbar({
  dateLabel, viewMode, search, theme,
  onViewChange, onSearchChange, onThemeToggle, onMenuToggle, onRefresh,
  lastUpdated,
}: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-4 px-8 h-20
      bg-white/90 dark:bg-[#060912]/80 border-b border-slate-200 dark:border-white/[0.04]
      backdrop-blur-2xl relative shadow-[0_4px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_32px_rgba(0,0,0,0.3)] transition-colors duration-300">

      {/* Subtle bottom gradient glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px]
        dark:bg-gradient-to-r dark:from-transparent dark:via-indigo-500/30 dark:to-transparent" />

      {/* Left Area */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl
            bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-300 shadow-inner
            hover:bg-slate-200 dark:hover:bg-white/10 dark:hover:border-indigo-500/40 transition-all">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="4" y1="18" x2="20" y2="18"/>
          </svg>
        </button>

        <div className="flex items-center gap-3.5 min-w-0">
          <h1 className="text-[1.1rem] font-bold text-slate-800 dark:text-white tracking-tight whitespace-nowrap drop-shadow-sm transition-colors">
            ASX Intelligence Center
          </h1>
          
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-white/20" />
            
            {/* Live Indicator */}
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-full shadow-sm dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 dark:bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600 dark:bg-emerald-500" />
              </span>
              <span className="font-mono text-[0.62rem] font-black uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400 mt-px">
                Live Feed
              </span>
            </div>
            
            {dateLabel && (
              <span className="font-mono text-[0.75rem] font-medium text-indigo-700 dark:text-indigo-300
                bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 px-3 py-1 rounded-full whitespace-nowrap transition-colors">
                {dateLabel}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Area Controls */}
      <div className="flex items-center gap-3 flex-shrink-0">
        
        {/* Auto-refresh indicator text and button */}
        <div className="flex items-center gap-1.5 mr-2">
          {lastUpdated && (
            <div className="hidden md:flex flex-col items-end mr-1">
              <span className="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
                Last Updated
              </span>
              <span className="font-mono text-[0.75rem] text-slate-600 dark:text-slate-300 font-medium">
                {lastUpdated.toLocaleTimeString('en-AU', { timeZone: 'Australia/Sydney', hour: '2-digit', minute: '2-digit', hour12: true, timeZoneName: 'short' })}
              </span>
            </div>
          )}
          
          <button
            onClick={onRefresh}
            title="Refresh Data"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-indigo-500/10 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[1.1rem] h-[1.1rem]">
              <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
          </button>
        </div>

        {/* Global Search */}
        <div className="relative flex items-center">
          <svg className={`absolute left-4 w-4 h-4 transition-colors duration-200 pointer-events-none
            ${focused ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}
            viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.6"/>
            <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          <input
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search tickers & companies..."
            className={`bg-slate-50 dark:bg-[#0d1022] border rounded-xl text-slate-800 dark:text-slate-100 text-[0.88rem] font-medium
              pl-11 pr-4 py-2.5 outline-none transition-all duration-300 shadow-inner
              placeholder:text-slate-400 dark:placeholder:text-slate-500
              ${focused
                ? 'border-indigo-400 dark:border-indigo-500/60 ring-4 ring-indigo-500/10 w-72 bg-white dark:bg-[#090b16]'
                : 'border-slate-200 dark:border-white/[0.08] w-56 hover:border-slate-300 dark:hover:border-white/20'}`}
          />
          {search && (
            <button onClick={() => onSearchChange('')}
              className="absolute right-3.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-white transition-colors bg-slate-100 dark:bg-[#0d1022] p-0.5 rounded-full">
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                <path d="M4 12L12 4M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>



        {/* Layout View Toggle */}
        <div className={`flex border rounded-xl p-1 gap-1 shadow-inner
          ${theme === 'dark' ? 'bg-[#0d1022] border-white/[0.08]' : 'bg-slate-50 border-slate-200'}`}>
          <button
            onClick={() => onViewChange('grid')}
            title="Grid View"
            className={`w-9 h-8 flex items-center justify-center rounded-[8px] transition-all duration-200
              ${viewMode === 'grid'
                ? theme === 'dark'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                  : 'bg-white text-indigo-600 border border-slate-200 shadow-sm'
                : theme === 'dark'
                  ? 'text-slate-500 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 border border-transparent'}`}>
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
              <path d="M2.5 2.5h4v4h-4zM9.5 2.5h4v4h-4zM2.5 9.5h4v4h-4zM9.5 9.5h4v4h-4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            onClick={() => onViewChange('list')}
            title="List View"
            className={`w-9 h-8 flex items-center justify-center rounded-[8px] transition-all duration-200
              ${viewMode === 'list'
                ? theme === 'dark'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                  : 'bg-white text-indigo-600 border border-slate-200 shadow-sm'
                : theme === 'dark'
                  ? 'text-slate-500 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 border border-transparent'}`}>
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
              <path d="M2 3.5h12M2 8h12M2 12.5h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

      </div>
    </header>
  );
}
