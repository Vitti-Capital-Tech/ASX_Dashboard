'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Announcement, DayLog, ViewMode } from '@/types';
import { isBullish } from '@/lib/utils';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import AnnouncementCard from '@/components/AnnouncementCard';
import AnnouncementRow from '@/components/AnnouncementRow';

const CATEGORIES = [
  'All Activity', 'Quarterly', 'Results', 'Dividend',
  'Capital Raise', 'AGM', 'Merger & Acquisition',
  'Trading Halt', 'Board Change',
];

const REFRESH_MS = 5 * 60 * 1000; // 5 minutes

export default function Dashboard() {
  const [date, setDate] = useState<string>(''); // Let useEffect init date to avoid hydration error
  const [log, setLog] = useState<DayLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [search, setSearch] = useState('');
  const [sensitiveOnly, setSensitiveOnly] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All Activity');
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Init local date + load preferences from localStorage
  useEffect(() => {
    setIsClient(true);
    // Current local date in YYYY-MM-DD
    const local = new Date();
    local.setHours(local.getHours() + 11); // Offset to AEST roughly
    setDate(local.toISOString().slice(0, 10));

    const savedView = localStorage.getItem('vitti-view') as ViewMode;
    const savedTheme = localStorage.getItem('vitti-theme') as 'dark' | 'light';
    if (savedView) setViewMode(savedView);
    if (savedTheme) setTheme(savedTheme);
  }, []);

  // Apply theme class (Note: the app design is mostly dark-centric right now)
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('vitti-theme', theme);
  }, [theme]);

  const fetchLog = useCallback(async (d: string) => {
    if (!d) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/logs/${d}`);
      if (!res.ok) {
        if (res.status === 404) setError(`No market data found for ${d}. Ensure data fetcher is running.`);
        else setError('Failed to load market data.');
        setLog(null);
      } else {
        const data: DayLog = await res.json();
        setLog(data);
        setLastUpdated(data.generated_at ? new Date(data.generated_at) : new Date());
      }
    } catch {
      setError('Connection refused. Please ensure the local server is running properly.');
      setLog(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch when date changes
  useEffect(() => {
    if (!isClient) return;
    fetchLog(date);
  }, [date, fetchLog, isClient]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!date || !isClient) return;
    const interval = setInterval(() => fetchLog(date), REFRESH_MS);
    return () => clearInterval(interval);
  }, [date, fetchLog, isClient]);

  // Filter logic
  const filtered = useMemo<Announcement[]>(() => {
    if (!log) return [];
    return log.announcements.filter(ann => {
      // 1. Sensitivity
      if (sensitiveOnly && !ann.market_sensitive) return false;
      
      // 2. Category Tab
      if (activeCategory !== 'All Activity') {
        const cleanCat = activeCategory.toLowerCase();
        const tagMatch = ann.tags?.some(t => t.toLowerCase().includes(cleanCat));
        const typeMatch = ann.document_type?.toLowerCase().includes(cleanCat);
        if (!tagMatch && !typeMatch) return false;
      }

      // 3. Sidebar Tags
      if (activeTags.size > 0) {
        const hasTag = ann.tags?.some(t => activeTags.has(t));
        if (!hasTag) return false;
      }

      // 4. Searching
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches =
          ann.ticker.toLowerCase().includes(q) ||
          ann.company.toLowerCase().includes(q) ||
          ann.headline.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [log, sensitiveOnly, activeCategory, activeTags, search]);

  // Extract tag distribution
  const tagCounts = useMemo<Record<string, number>>(() => {
    if (!log) return {};
    const counts: Record<string, number> = {};
    log.announcements.forEach(ann => {
      ann.tags?.forEach(tag => {
        counts[tag] = (counts[tag] ?? 0) + 1;
      });
    });
    return counts;
  }, [log]);

  // Prioritize sensitive > bullish > time
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (a.market_sensitive && !b.market_sensitive) return -1;
      if (!a.market_sensitive && b.market_sensitive) return 1;
      
      const aBull = isBullish(a);
      const bBull = isBullish(b);
      if (aBull && !bBull) return -1;
      if (!aBull && bBull) return 1;
      
      return new Date(b.time).getTime() - new Date(a.time).getTime(); // newest first
    });
  }, [filtered]);

  // Memoize the heavy rendering of 100+ cards so Theme toggles (which trigger a page re-render) 
  // don't force React to reconcile the entire tree, keeping css transitions buttery smooth.
  const renderedGrid = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {sorted.map((ann, i) => (
        <div key={ann.url + i + ann.time} style={{ animationDelay: `${Math.min(i * 0.05, 0.5)}s` }} className="animate-fade-in-up">
          <AnnouncementCard ann={ann} />
        </div>
      ))}
    </div>
  ), [sorted]);

  const renderedList = useMemo(() => (
    <div className="flex flex-col gap-3">
      {sorted.map((ann, i) => (
        <div key={ann.url + i + ann.time} style={{ animationDelay: `${Math.min(i * 0.03, 0.3)}s` }} className="animate-fade-in-up">
          <AnnouncementRow ann={ann} />
        </div>
      ))}
    </div>
  ), [sorted]);

  function handleTagToggle(tag: string) {
    setActiveTags(prev => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }

  function handleViewChange(v: ViewMode) {
    setViewMode(v);
    localStorage.setItem('vitti-view', v);
  }

  function handleCsvDownload() {
    if (!sorted.length) return;
    const headers = ['Ticker', 'Company', 'Headline', 'Time', 'Market Sensitive', 'Summary', 'Tags', 'URL'];
    const rows = sorted.map(a => [
      a.ticker, a.company, `"${a.headline.replace(/"/g, '""')}"`,
      a.time, a.market_sensitive ? 'Yes' : 'No',
      `"${(a.summary || []).join(' | ').replace(/"/g, '""')}"`,
      (a.tags || []).join(', '), a.url,
    ].join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `Vitti_ASX_Export_${date}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  const dateLabel = date
    ? new Date(date + 'T00:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  // Prevent hydration mismatch by rendering empty div until client mounts
  if (!isClient) {
    return <div className="min-h-screen bg-[#060912] dark:bg-[#060912]" />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#060912] text-slate-900 dark:text-slate-100 selection:bg-indigo-500/30 transition-colors duration-300">
      {/* Immersive background texture - Midnight Intelligence */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20 dark:opacity-100"
        style={{
          backgroundImage: `
            radial-gradient(circle at 100% 0%, rgba(99,102,241,0.08) 0%, transparent 40%),
            radial-gradient(circle at 15% 100%, rgba(167,139,250,0.06) 0%, transparent 40%),
            radial-gradient(rgba(255,255,255,0.015) 1px, transparent 1px)`,
          backgroundSize: '100% 100%, 100% 100%, 32px 32px',
        }}
      />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 dark:bg-black/80 backdrop-blur-md z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <div className={`fixed top-0 bottom-0 left-0 z-50 lg:relative lg:z-auto lg:block transition-transform duration-300 shadow-2xl lg:shadow-none
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar
          date={date}
          log={log}
          filtered={sorted.length}
          sensitiveOnly={sensitiveOnly}
          activeTags={activeTags}
          onDateChange={d => { setDate(d); setActiveCategory('All Activity'); setActiveTags(new Set()); setSearch(''); }}
          onSensitiveToggle={setSensitiveOnly}
          onTagToggle={handleTagToggle}
          onCsvDownload={handleCsvDownload}
          tagCounts={tagCounts}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10 transition-all">
        <Topbar
          dateLabel={dateLabel}
          viewMode={viewMode}
          search={search}
          theme={theme}
          onViewChange={handleViewChange}
          onSearchChange={setSearch}
          onThemeToggle={() => {
            if (!document.startViewTransition) {
              setTheme(t => t === 'dark' ? 'light' : 'dark');
              return;
            }
            document.startViewTransition(() => {
              setTheme(t => t === 'dark' ? 'light' : 'dark');
            });
          }}
          onMenuToggle={() => setSidebarOpen(o => !o)}
          onRefresh={() => fetchLog(date)}
          lastUpdated={lastUpdated}
        />

        {/* Categories / Navigation Pill Bar */}
        <nav className="flex gap-2.5 px-8 pt-6 pb-4 bg-slate-50/80 dark:bg-[#060912]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.04] overflow-x-auto [scrollbar-width:none] sticky top-20 z-30 transition-colors duration-300">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-[0.85rem] font-semibold whitespace-nowrap transition-all duration-200
                border flex-shrink-0
                ${activeCategory === cat
                  ? 'bg-indigo-100 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                  : 'bg-white dark:bg-white/[0.02] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/[0.05] hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:border-slate-300 dark:hover:border-white/10 shadow-sm dark:shadow-none'}`}
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* Scrollable Feed */}
        <div className="flex-1 overflow-auto pb-16 px-4 sm:px-8 pt-8">
          
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-6 animate-fade-in-up">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
                <div className="absolute inset-2 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin-fast reverse" />
              </div>
              <div className="text-center">
                <h3 className="text-[1.1rem] font-bold text-slate-100">Fetching Market Data</h3>
                <p className="text-[0.85rem] text-slate-500 mt-1">Analyzing ASX announcements for {dateLabel}...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="mx-auto max-w-2xl mt-8">
              <div className="relative overflow-hidden rounded-[20px] p-[1px] bg-gradient-to-b from-rose-500/40 to-rose-500/5">
                <div className="bg-[#0b0c16] rounded-[19px] p-8 flex items-start gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0 shadow-[0_0_30px_rgba(244,63,94,0.15)]">
                    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-rose-400">
                      <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="pt-1">
                    <h3 className="text-[1.1rem] font-bold text-rose-300 mb-2">No data available for this date</h3>
                    <p className="text-[0.9rem] text-slate-400 leading-relaxed mb-5 max-w-md">{error}</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => fetchLog(date)}
                        className="px-5 py-2.5 rounded-xl bg-rose-500 text-white text-[0.85rem] font-bold tracking-wide
                          shadow-[0_4px_16px_rgba(244,63,94,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)]
                          hover:shadow-[0_4px_24px_rgba(244,63,94,0.4)]
                          hover:-translate-y-0.5 active:translate-y-0 transition-all">
                        Retry Connection
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty State (0 results but valid log) */}
          {!loading && !error && sorted.length === 0 && log && (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-5 text-center px-8 animate-fade-in-up">
              <div className="w-20 h-20 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.05)]">
                <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-indigo-400/60">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 className="text-[1.15rem] font-bold text-slate-200">No announcements match filters</h3>
                <p className="text-[0.9rem] text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed">
                  Refine your search parameters, adjust the category, or select a different trading date.
                </p>
              </div>
              <button 
                onClick={() => { setSearch(''); setActiveCategory('All Activity'); setActiveTags(new Set()); setSensitiveOnly(false); }}
                className="mt-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-[0.85rem] font-semibold hover:bg-white/10 hover:text-white transition-all">
                Clear Filters
              </button>
            </div>
          )}

          {/* Data Feed Grid/List */}
          {!loading && !error && sorted.length > 0 && (
            <div className="max-w-[1600px] mx-auto">
              
              {/* Dynamic summary label above cards */}
              <div className="flex items-center justify-between mb-5 px-1 animate-fade-in-up">
                <h2 className="text-[1.15rem] font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3 transition-colors">
                  Market Activity 
                  <span className="font-mono text-[0.75rem] font-medium text-slate-500 dark:text-slate-500 bg-white dark:bg-[#0d1022] px-3 py-1 rounded-full border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                    {sorted.length} results
                  </span>
                </h2>
              </div>

              {viewMode === 'grid' ? renderedGrid : renderedList}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
