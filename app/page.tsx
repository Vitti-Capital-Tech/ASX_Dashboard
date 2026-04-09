'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Announcement, DayLog, ViewMode } from '@/types';
import { getSentiment, sentimentRank } from '@/lib/utils';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import AnnouncementCard from '@/components/AnnouncementCard';
import AnnouncementRow from '@/components/AnnouncementRow';

const CATEGORIES = [
  'All Activity', 'Bullish', 'Bearish', 'Neutral', 'Quarterly', 'Results', 'Dividend',
  'Capital Raise', 'AGM', 'Merger & Acquisition',
  'Trading Halt', 'Board Change', 'Substantial Holding',
];

const REFRESH_MS = 5 * 60 * 1000;

export default function Dashboard() {
  const [date, setDate] = useState<string>('');
  const [log, setLog] = useState<DayLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Activity');
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [marketSensitiveOnly, setMarketSensitiveOnly] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Get current date in Sydney
    const sydneyTime = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Australia/Sydney',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      hour12: false
    }).formatToParts(new Date());

    const parts = Object.fromEntries(sydneyTime.map(p => [p.type, p.value]));
    let year = parseInt(parts.year);
    let month = parseInt(parts.month);
    let day = parseInt(parts.day);
    let hour = parseInt(parts.hour);

    // If it's before 8 AM in Sydney, show yesterday's announcements by default
    if (hour < 8) {
      const d = new Date(year, month - 1, day);
      d.setDate(d.getDate() - 1);
      year = d.getFullYear();
      month = d.getMonth() + 1;
      day = d.getDate();
    }

    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setDate(dateStr);

    const savedView = localStorage.getItem('vitti-view') as ViewMode;
    const savedTheme = localStorage.getItem('vitti-theme') as 'dark' | 'light';
    
    if (savedView) setViewMode(savedView);
    if (savedTheme) setTheme(savedTheme);

    fetch('/api/logs')
      .then(r => r.json())
      .then(d => setAvailableDates(d))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
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
        if (res.status === 404) setError(`No market data found for ${d}.`);
        else setError('Failed to load market data.');
        setLog(null);
      } else {
        const data: DayLog = await res.json();
        setLog(data);
        setLastUpdated(data.generated_at ? new Date(data.generated_at) : new Date());
      }
    } catch {
      setError('Connection refused. Please ensure the local server is running.');
      setLog(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (!isClient) return; fetchLog(date); }, [date, fetchLog, isClient]);
  useEffect(() => {
    if (!date || !isClient) return;
    const interval = setInterval(() => fetchLog(date), REFRESH_MS);
    return () => clearInterval(interval);
  }, [date, fetchLog, isClient]);

  const filtered = useMemo<Announcement[]>(() => {
    if (!log) return [];
    return log.announcements.filter(ann => {
      if (marketSensitiveOnly && !ann.market_sensitive) return false;
      if (activeCategory !== 'All Activity') {
        const cleanCat = activeCategory.toLowerCase();
        if (cleanCat === 'bullish' || cleanCat === 'bearish' || cleanCat === 'neutral') {
          if (getSentiment(ann) !== cleanCat) return false;
        } else {
          const searchTerms = cleanCat === 'substantial holding' ? ['substantial hold'] : [cleanCat];
          const tagMatch = ann.tags?.some(tag => searchTerms.some(term => tag.toLowerCase().includes(term)));
          const typeMatch = searchTerms.some(term => ann.document_type?.toLowerCase().includes(term));
          if (!tagMatch && !typeMatch) return false;
        }
      }
      if (activeTags.size > 0) {
        if (!ann.tags?.some(t => activeTags.has(t))) return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!(ann.ticker.toLowerCase().includes(q) || ann.company.toLowerCase().includes(q) || ann.headline.toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }, [log, activeCategory, activeTags, search, marketSensitiveOnly]);

  const tagCounts = useMemo<Record<string, number>>(() => {
    if (!log) return {};
    const counts: Record<string, number> = {};
    log.announcements.forEach(ann => ann.tags?.forEach(tag => { counts[tag] = (counts[tag] ?? 0) + 1; }));
    return counts;
  }, [log]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (a.market_sensitive && !b.market_sensitive) return -1;
      if (!a.market_sensitive && b.market_sensitive) return 1;
      const sa = getSentiment(a); const sb = getSentiment(b);
      const ra = sentimentRank(sa); const rb = sentimentRank(sb);
      if (ra !== rb) return ra - rb;
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    });
  }, [filtered]);

  const renderedGrid = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {sorted.map((ann, i) => (
        <div key={ann.url + i + ann.time} style={{ animationDelay: `${Math.min(i * 0.04, 0.5)}s` }} className="animate-fade-in-up">
          <AnnouncementCard ann={ann} />
        </div>
      ))}
    </div>
  ), [sorted]);

  const renderedList = useMemo(() => (
    <div className="flex flex-col gap-2">
      {sorted.map((ann, i) => (
        <div key={ann.url + i + ann.time} style={{ animationDelay: `${Math.min(i * 0.03, 0.3)}s` }} className="animate-fade-in-up">
          <AnnouncementRow ann={ann} />
        </div>
      ))}
    </div>
  ), [sorted]);

  function handleTagToggle(tag: string) {
    setActiveTags(prev => { const next = new Set(prev); if (next.has(tag)) next.delete(tag); else next.add(tag); return next; });
  }
  function handleViewChange(v: ViewMode) { setViewMode(v); localStorage.setItem('vitti-view', v); }
  const handleCsvDownload = useCallback(() => {
    if (!sorted.length) return;
    const headers = ['Ticker', 'Company', 'Headline', 'Time', 'Market Sensitive', 'Sentiment', 'Summary', 'Tags', 'URL'];
    const rows = sorted.map(a => [
      a.ticker, a.company, `"${a.headline.replace(/"/g, '""')}"`,
      a.time, a.market_sensitive ? 'Yes' : 'No',
      getSentiment(a),
      `"${(a.summary || []).join(' | ').replace(/"/g, '""')}"`,
      (a.tags || []).join(', '), a.url,
    ].join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    // Build a descriptive filename that reflects active filters
    const filterSlug = activeCategory !== 'All Activity'
      ? `_${activeCategory.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`
      : activeTags.size > 0
        ? `_tagged-${[...activeTags].slice(0, 2).join('-').replace(/[^a-z0-9]/gi, '-').toLowerCase()}`
        : search.trim()
          ? `_search-${search.trim().replace(/[^a-z0-9]/gi, '-').toLowerCase()}`
          : '';
    a.href = url;
    a.download = `Vitti_ASX_Export_${date}${filterSlug}_${sorted.length}rows.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [sorted, date, activeCategory, activeTags, search]);

  const dateLabel = date
    ? new Date(date + 'T00:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  if (!isClient) return <div className="min-h-screen bg-[#04060f]" />;

  return (
    <div className="flex min-h-screen transition-colors duration-500" style={{ background: 'var(--bg-app)', color: 'var(--text-primary)' }}>

      {/* ── Background decoration ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Radial glows */}
        <div className="absolute inset-0"
          style={{
            background: theme === 'dark' ? `
              radial-gradient(ellipse 80% 50% at 80% -10%, rgba(99,102,241,0.04) 0%, transparent 60%),
              radial-gradient(ellipse 60% 50% at -10% 80%, rgba(139,92,246,0.03) 0%, transparent 60%)
            ` : `
              radial-gradient(ellipse 80% 50% at 80% -10%, rgba(99,102,241,0.02) 0%, transparent 60%)
            `,
          }} />
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage: theme === 'dark' 
              ? 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)' 
              : 'radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }} />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: theme === 'dark' ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 bottom-0 left-0 z-50 lg:relative lg:z-auto lg:block transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar
          date={date}
          availableDates={availableDates}
          log={log}
          filtered={sorted.length}
          activeTags={activeTags}
          activeCategory={activeCategory}
          marketSensitiveOnly={marketSensitiveOnly}
          onMarketSensitiveToggle={() => setMarketSensitiveOnly(v => !v)}
          onCategoryChange={setActiveCategory}
          onDateChange={d => { setDate(d); setActiveCategory('All Activity'); setActiveTags(new Set()); setSearch(''); setMarketSensitiveOnly(false); }}
          onTagToggle={handleTagToggle}
          onCsvDownload={handleCsvDownload}
          tagCounts={tagCounts}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        <Topbar
          dateLabel={dateLabel}
          viewMode={viewMode}
          search={search}
          theme={theme}
          onViewChange={handleViewChange}
          onSearchChange={setSearch}
          onThemeToggle={() => {
            if (!document.startViewTransition) { setTheme(t => t === 'dark' ? 'light' : 'dark'); return; }
            document.startViewTransition(() => { setTheme(t => t === 'dark' ? 'light' : 'dark'); });
          }}
          onMenuToggle={() => setSidebarOpen(o => !o)}
          onRefresh={() => fetchLog(date)}
          lastUpdated={lastUpdated}
        />

        {/* ── Category Tab Bar ── */}
        <nav className="flex gap-0 px-6 pt-0 overflow-x-auto [scrollbar-width:none] sticky top-[60px] z-30 flex-shrink-0 transition-colors duration-300"
          style={{
            background: 'var(--bg-nav)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border-subtle)',
          }}>
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="relative px-4 py-3.5 text-[0.8rem] font-semibold whitespace-nowrap flex-shrink-0 transition-colors duration-150"
                style={{
                  color: isActive ? 'rgba(165,180,252,1)' : 'rgba(100,116,139,0.75)',
                }}
              >
                {cat}
                {/* Active underline */}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full"
                    style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', boxShadow: '0 0 8px rgba(99,102,241,0.6)' }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* ── Scrollable Feed ── */}
        <div className="flex-1 overflow-auto pb-16 px-5 sm:px-7 pt-6">

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center h-[52vh] gap-5 animate-fade-in-up">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full"
                  style={{ border: '2px solid var(--border-accent)', borderTopColor: 'var(--accent)', animation: 'spin 0.8s linear infinite' }} />
                <div className="absolute inset-2.5 rounded-full"
                  style={{ border: '2px solid var(--border-accent)', borderTopColor: 'var(--text-accent)', animation: 'spin 0.5s linear infinite reverse' }} />
              </div>
              <div className="text-center">
                <h3 className="text-[1rem] font-bold text-slate-200">Fetching Market Data</h3>
                <p className="text-[0.8rem] mt-1" style={{ color: 'rgba(100,116,139,0.7)' }}>
                  Analyzing ASX announcements for {dateLabel}…
                </p>
              </div>
            </div>
          )}

          {/* Error / Pending state */}
          {error && !loading && (
            <div className="mx-auto max-w-xl mt-10 animate-fade-in-up">
              <div className="rounded-[20px] p-7 flex items-start gap-5"
                style={{
                  background: error.includes('No market data')
                    ? 'rgba(99,102,241,0.06)'
                    : 'rgba(244,63,94,0.06)',
                  border: error.includes('No market data')
                    ? '1px solid rgba(99,102,241,0.18)'
                    : '1px solid rgba(244,63,94,0.18)',
                }}>
                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: error.includes('No market data') ? 'rgba(99,102,241,0.12)' : 'rgba(244,63,94,0.12)',
                    border: error.includes('No market data') ? '1px solid rgba(99,102,241,0.2)' : '1px solid rgba(244,63,94,0.2)',
                    boxShadow: error.includes('No market data') ? '0 0 30px rgba(99,102,241,0.15)' : '0 0 30px rgba(244,63,94,0.15)',
                  }}>
                  {error.includes('No market data') ? (
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={{ color: '#818cf8' }}>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={{ color: '#fb7185' }}>
                      <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  )}
                </div>

                <div className="pt-0.5">
                  <h3 className="text-[1rem] font-bold mb-2"
                    style={{ color: error.includes('No market data') ? '#a5b4fc' : '#fda4af' }}>
                    {error.includes('No market data') ? 'No Market Activity' : 'Connection Error'}
                  </h3>
                  <p className="text-[0.85rem] leading-relaxed mb-5" style={{ color: 'rgba(148,163,184,0.75)' }}>
                    {error.includes('No market data')
                      ? "No announcements found for this date. This usually means the market hasn't opened yet, or it is a weekend or public holiday."
                      : error}
                  </p>
                  <button
                    onClick={() => fetchLog(date)}
                    className="px-5 py-2.5 rounded-xl text-white text-[0.8rem] font-bold tracking-wide transition-all duration-150 hover:-translate-y-0.5"
                    style={{
                      background: error.includes('No market data') ? '#6366f1' : '#f43f5e',
                      boxShadow: error.includes('No market data')
                        ? '0 4px 20px rgba(99,102,241,0.35)'
                        : '0 4px 20px rgba(244,63,94,0.35)',
                    }}>
                    Check Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && sorted.length === 0 && log && (
            <div className="flex flex-col items-center justify-center h-[52vh] gap-5 text-center px-8 animate-fade-in-up">
              <div className="w-16 h-16 rounded-3xl flex items-center justify-center animate-float"
                style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.12)', boxShadow: '0 0 40px rgba(99,102,241,0.08)' }}>
                <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" style={{ color: 'rgba(129,140,248,0.5)' }}>
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 className="text-[1.05rem] font-bold text-slate-200">No announcements match</h3>
                <p className="text-[0.82rem] mt-1.5 max-w-xs mx-auto leading-relaxed" style={{ color: 'rgba(100,116,139,0.7)' }}>
                  Refine your search, adjust the category filter, or select a different trading date.
                </p>
              </div>
              <button
                onClick={() => { setSearch(''); setActiveCategory('All Activity'); setActiveTags(new Set()); }}
                className="mt-1 px-5 py-2.5 rounded-xl text-[0.8rem] font-semibold transition-all duration-150 hover:-translate-y-0.5"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(148,163,184,0.8)' }}>
                Clear Filters
              </button>
            </div>
          )}

          {/* Feed */}
          {!loading && !error && sorted.length > 0 && (
            <div className="max-w-[1600px] mx-auto">
              {/* Results label */}
              <div className="flex items-center justify-between mb-5 px-1 animate-fade-in-up">
                <h2 className="text-[1rem] font-bold text-slate-200 flex items-center gap-3">
                  Market Activity
                  <span className="font-mono text-[0.7rem] font-semibold px-2.5 py-1 rounded-full"
                    style={{ color: 'rgba(148,163,184,0.6)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
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
