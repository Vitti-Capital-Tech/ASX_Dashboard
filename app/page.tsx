'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Announcement, DayLog, PlacementDayLog, Scorecard, ScorecardSummary, ViewKey, ViewMode,
} from '@/types';
import { formatDateLabel, getSentiment, sentimentRank } from '@/lib/utils';
import { ALL_CATEGORIES, VIEW_REGION, type SentimentFilter } from '@/lib/views';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import ViewHeader from '@/components/ViewHeader';
import FilterBar from '@/components/FilterBar';
import FeedControls from '@/components/FeedControls';
import AnnouncementCard from '@/components/AnnouncementCard';
import AnnouncementRow from '@/components/AnnouncementRow';
import PlacementCard from '@/components/PlacementCard';
import AccuracyPanel from '@/components/AccuracyPanel';

const REFRESH_MS = 5 * 60 * 1000;

function Spinner({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[52vh] gap-5 animate-fade-in-up">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full"
          style={{ border: '2px solid var(--border-accent)', borderTopColor: 'var(--accent)', animation: 'spin 0.8s linear infinite' }} />
        <div className="absolute inset-2.5 rounded-full"
          style={{ border: '2px solid var(--border-accent)', borderTopColor: 'var(--accent-light)', animation: 'spin 0.5s linear infinite reverse' }} />
      </div>
      <div className="text-center">
        <h3 className="text-[1rem] font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
        <p className="text-[0.8rem] mt-1" style={{ color: 'var(--text-dim)' }}>{message}</p>
      </div>
    </div>
  );
}

function Notice({ tone, title, body, actionLabel, onAction }: {
  tone: 'info' | 'error'; title: string; body: string;
  actionLabel: string; onAction: () => void;
}) {
  const color = tone === 'info' ? 'var(--accent)' : 'var(--danger)';
  return (
    <div className="mx-auto max-w-xl mt-10 animate-fade-in-up">
      <div className="rounded-[20px] p-7 flex items-start gap-5"
        style={{
          background: `color-mix(in srgb, ${color}, transparent 94%)`,
          border: `1px solid color-mix(in srgb, ${color}, transparent 82%)`,
        }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{
            background: `color-mix(in srgb, ${color}, transparent 88%)`,
            border: `1px solid color-mix(in srgb, ${color}, transparent 80%)`,
          }}>
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={{ color }}>
            {tone === 'info' ? (
              <>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </>
            ) : (
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </div>
        <div className="pt-0.5">
          <h3 className="text-[1rem] font-bold mb-2" style={{ color }}>{title}</h3>
          <p className="text-[0.85rem] leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>{body}</p>
          <button onClick={onAction}
            className="px-5 py-2.5 rounded-xl text-white text-[0.8rem] font-bold tracking-wide transition-all duration-150 hover:-translate-y-0.5"
            style={{ background: color }}>
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [date, setDate] = useState<string>('');
  const [log, setLog] = useState<DayLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [search, setSearch] = useState('');
  const [activeView, setActiveView] = useState<ViewKey>('announcements');
  const [sentiment, setSentiment] = useState<SentimentFilter>('all');
  const [category, setCategory] = useState<string>(ALL_CATEGORIES);
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [marketSensitiveOnly, setMarketSensitiveOnly] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [placementLog, setPlacementLog] = useState<PlacementDayLog | null>(null);
  const [placementLoading, setPlacementLoading] = useState(false);
  const [scorecard, setScorecard] = useState<Scorecard | null>(null);
  const [scoreSummary, setScoreSummary] = useState<ScorecardSummary | null>(null);
  const [scoreLoading, setScoreLoading] = useState(false);
  const [scoreError, setScoreError] = useState<string | null>(null);

  const region = VIEW_REGION[activeView];
  const isPlacementView = region !== undefined;
  const isAccuracyView = activeView === 'accuracy';
  const isFeedView = activeView === 'announcements';

  useEffect(() => {
    setIsClient(true);

    const parts = Object.fromEntries(
      new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Australia/Sydney',
        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false,
      }).formatToParts(new Date()).map(p => [p.type, p.value])
    );

    let year = parseInt(parts.year);
    let month = parseInt(parts.month);
    let day = parseInt(parts.day);

    // Before 8 AM Sydney the day has no announcements yet, so open on yesterday.
    if (parseInt(parts.hour) < 8) {
      const d = new Date(year, month - 1, day);
      d.setDate(d.getDate() - 1);
      year = d.getFullYear(); month = d.getMonth() + 1; day = d.getDate();
    }

    setDate(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);

    const savedView = localStorage.getItem('vitti-view') as ViewMode;
    const savedTheme = localStorage.getItem('vitti-theme') as 'dark' | 'light';
    if (savedView) setViewMode(savedView);
    if (savedTheme) setTheme(savedTheme);

    fetch('/api/logs').then(r => r.json()).then(setAvailableDates).catch(console.error);
  }, []);

  // Class only. Persisting here raced the restore above: both effects run on
  // the first commit, so this one wrote the default 'dark' back to storage
  // before setTheme had applied the saved value, and a chosen theme did not
  // survive a reload. The toggle writes it instead — a preference is saved when
  // the user changes it, not on every render.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('light', theme === 'light');
    root.classList.toggle('dark', theme !== 'light');
  }, [theme]);

  const toggleTheme = useCallback(() => {
    // Applied directly rather than through document.startViewTransition. With a
    // few hundred animating cards on screen the transition would queue its
    // snapshot and never invoke the callback, so the theme button did nothing
    // at all — clicks landed, state never changed. globals.css already
    // transitions colour and background on every element for 200ms, which is
    // the same effect for a palette swap and cannot wedge.
    //
    // Next value computed up front: a state updater must stay pure, and React
    // double-invokes it in development.
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('vitti-theme', next);
  }, [theme]);

  const fetchLog = useCallback(async (d: string) => {
    if (!d) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/logs/${d}`);
      if (!res.ok) {
        setError(res.status === 404 ? `No market data found for ${d}.` : 'Failed to load market data.');
        setLog(null);
      } else {
        setLog(await res.json());
        setLastUpdated(new Date());
      }
    } catch {
      setError('Failed to load market data.');
      setLog(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPlacements = useCallback(async (d: string, r: string) => {
    if (!d) return;
    setPlacementLoading(true);
    try {
      const res = await fetch(`/api/placements/${d}?region=${r}`);
      setPlacementLog(res.ok ? await res.json() : null);
    } catch {
      setPlacementLog(null);
    } finally {
      setPlacementLoading(false);
    }
  }, []);

  const fetchScorecard = useCallback(async (d: string) => {
    if (!d) return;
    setScoreLoading(true);
    setScoreError(null);
    try {
      // The rolling summary is cheap and rarely changes, so it rides along.
      const [dayRes, sumRes] = await Promise.all([
        fetch(`/api/scorecard/${d}`),
        fetch('/api/scorecard/summary'),
      ]);
      if (dayRes.ok) {
        setScorecard(await dayRes.json());
      } else {
        setScorecard(null);
        setScoreError(dayRes.status === 404 ? `No scorecard for ${d} yet.` : 'Failed to load the scorecard.');
      }
      setScoreSummary(sumRes.ok ? await sumRes.json() : null);
    } catch {
      setScorecard(null);
      setScoreError('Failed to load the scorecard.');
    } finally {
      setScoreLoading(false);
    }
  }, []);

  useEffect(() => { if (isClient) fetchLog(date); }, [date, fetchLog, isClient]);

  useEffect(() => {
    if (!isClient || !region) return; // narrows region to string
    setPlacementLog(null);
    fetchPlacements(date, region);
  }, [date, region, fetchPlacements, isClient]);

  useEffect(() => {
    if (!isClient || !isAccuracyView) return;
    fetchScorecard(date);
  }, [date, isAccuracyView, fetchScorecard, isClient]);

  useEffect(() => {
    if (!date || !isClient) return;
    const interval = setInterval(() => fetchLog(date), REFRESH_MS);
    return () => clearInterval(interval);
  }, [date, fetchLog, isClient]);

  const filtered = useMemo<Announcement[]>(() => {
    if (!log) return [];
    return log.announcements.filter(ann => {
      if (marketSensitiveOnly && !ann.market_sensitive) return false;
      if (sentiment !== 'all' && getSentiment(ann) !== sentiment) return false;

      if (category !== ALL_CATEGORIES) {
        // "Substantial Holding" is filed under headings like "Substantial holder",
        // so match the stem rather than the whole label.
        const term = category === 'Substantial Holding' ? 'substantial hold' : category.toLowerCase();
        const tagMatch = ann.tags?.some(t => t.toLowerCase().includes(term));
        const typeMatch = ann.document_type?.toLowerCase().includes(term);
        if (!tagMatch && !typeMatch) return false;
      }

      if (activeTags.size > 0 && !ann.tags?.some(t => activeTags.has(t))) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        if (!(ann.ticker.toLowerCase().includes(q)
          || ann.company.toLowerCase().includes(q)
          || ann.headline.toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }, [log, sentiment, category, activeTags, search, marketSensitiveOnly]);

  const tagCounts = useMemo<Record<string, number>>(() => {
    if (!log) return {};
    const counts: Record<string, number> = {};
    log.announcements.forEach(ann => ann.tags?.forEach(t => { counts[t] = (counts[t] ?? 0) + 1; }));
    return counts;
  }, [log]);

  const sorted = useMemo(() => [...filtered].sort((a, b) => {
    if (a.market_sensitive !== b.market_sensitive) return a.market_sensitive ? -1 : 1;
    const ra = sentimentRank(getSentiment(a));
    const rb = sentimentRank(getSentiment(b));
    if (ra !== rb) return ra - rb;
    return new Date(b.time).getTime() - new Date(a.time).getTime();
  }), [filtered]);

  const renderedGrid = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {sorted.map((ann, i) => (
        <div key={ann.url + i + ann.time} style={{ animationDelay: `${Math.min(i * 0.04, 0.5)}s` }} className="animate-fade-in-up h-full">
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
    setActiveTags(prev => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag); else next.add(tag);
      return next;
    });
  }

  function handleViewMode(v: ViewMode) {
    setViewMode(v);
    localStorage.setItem('vitti-view', v);
  }

  const clearFilters = useCallback(() => {
    setSentiment('all');
    setCategory(ALL_CATEGORIES);
    setActiveTags(new Set());
    setMarketSensitiveOnly(false);
    setSearch('');
  }, []);

  const handleCsvDownload = useCallback(() => {
    if (!sorted.length) return;
    const headers = ['Ticker', 'Company', 'Headline', 'Time', 'Market Sensitive', 'Sentiment', 'Summary', 'Tags', 'URL'];
    const rows = sorted.map(a => [
      a.ticker, a.company, `"${a.headline.replace(/"/g, '""')}"`,
      a.time, a.market_sensitive ? 'Yes' : 'No', getSentiment(a),
      `"${(a.summary || []).join(' | ').replace(/"/g, '""')}"`,
      (a.tags || []).join(', '), a.url,
    ].join(','));
    const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    // Name the file after whatever narrowed it, so exports stay tellable apart.
    const slug = sentiment !== 'all' ? `_${sentiment}`
      : category !== ALL_CATEGORIES ? `_${category.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`
        : activeTags.size > 0 ? `_tagged-${Array.from(activeTags).slice(0, 2).join('-').replace(/[^a-z0-9]/gi, '-').toLowerCase()}`
          : search.trim() ? `_search-${search.trim().replace(/[^a-z0-9]/gi, '-').toLowerCase()}`
            : '';
    a.href = url;
    a.download = `Vitti_ASX_Export_${date}${slug}_${sorted.length}rows.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [sorted, date, sentiment, category, activeTags, search]);

  const dateLabel = date ? formatDateLabel(date) : '';
  const sensitiveCount = log?.announcements.filter(a => a.market_sensitive).length ?? 0;
  const isNarrowed = !!log && sorted.length !== log.announcements.length;

  if (!isClient) return <div className="min-h-screen" style={{ background: 'var(--bg-app)' }} />;

  return (
    <div className="flex min-h-screen transition-colors duration-500"
      style={{ background: 'var(--bg-app)', color: 'var(--text-primary)' }}>

      {/* ── Background decoration ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0"
          style={{
            background: theme === 'dark'
              ? `radial-gradient(ellipse 80% 50% at 80% -10%, rgba(99,102,241,0.04) 0%, transparent 60%),
                 radial-gradient(ellipse 60% 50% at -10% 80%, rgba(139,92,246,0.03) 0%, transparent 60%)`
              : 'radial-gradient(ellipse 80% 50% at 80% -10%, rgba(99,102,241,0.02) 0%, transparent 60%)',
          }} />
        <div className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage: theme === 'dark'
              ? 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)'
              : 'radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }} />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={() => setSidebarOpen(false)} />
      )}

      <div className={`fixed top-0 bottom-0 left-0 z-50 lg:relative lg:z-auto lg:block transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar
          date={date}
          availableDates={availableDates}
          log={log}
          activeTags={activeTags}
          sentiment={sentiment}
          category={category}
          marketSensitiveOnly={marketSensitiveOnly}
          filtersApply={isFeedView}
          loading={loading}
          onSentimentChange={s => { setActiveView('announcements'); setSentiment(s); }}
          onCategoryChange={c => { setActiveView('announcements'); setCategory(c); }}
          onSensitiveToggle={() => { setActiveView('announcements'); setMarketSensitiveOnly(v => !v); }}
          onResetFilters={() => { setActiveView('announcements'); clearFilters(); }}
          onDateChange={d => {
            // Clear the day's data, not just refetch it. The feed itself is
            // gated on `loading`, but the header counts and the sidebar totals
            // read straight off `log` — so the previous day's 400 announcements
            // sat on screen under the newly chosen date until the fetch landed.
            // Only on an explicit date change: the 5-minute background refresh
            // calls fetchLog too, and clearing there would blink the feed out.
            setDate(d);
            setLog(null);
            setScorecard(null);
            setPlacementLog(null);
            clearFilters();
          }}
          onTagToggle={handleTagToggle}
          tagCounts={tagCounts}
        />
      </div>

      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        <Topbar
          activeView={activeView}
          theme={theme}
          onViewChange={setActiveView}
          onThemeToggle={toggleTheme}
          onMenuToggle={() => setSidebarOpen(o => !o)}
          onRefresh={() => fetchLog(date)}
          lastUpdated={lastUpdated}
        />

        <div className="flex-1 overflow-auto pb-16 px-5 sm:px-7 pt-6">

          {/* ── Announcements ── */}
          {isFeedView && (
            <div className="max-w-[1600px] mx-auto">
              <ViewHeader
                title="Market Activity"
                meta={dateLabel}
                stats={log ? [
                  // Showing "48 of 400" only while a filter is on: an
                  // unfiltered feed does not need to say it is unfiltered.
                  {
                    value: isNarrowed ? `${sorted.length} / ${log.announcements.length}` : log.announcements.length,
                    label: isNarrowed ? 'shown' : 'announcements',
                  },
                  { value: sensitiveCount, label: 'market sensitive' },
                ] : undefined}
                actions={
                  <FeedControls
                    search={search}
                    viewMode={viewMode}
                    onSearchChange={setSearch}
                    onViewChange={handleViewMode}
                    onCsvDownload={handleCsvDownload}
                    canExport={sorted.length > 0}
                  />
                }
              />

              <FilterBar
                sentiment={sentiment}
                category={category}
                marketSensitiveOnly={marketSensitiveOnly}
                activeTagCount={activeTags.size}
                sensitiveCount={sensitiveCount}
                onSentimentChange={setSentiment}
                onCategoryChange={setCategory}
                onSensitiveToggle={() => setMarketSensitiveOnly(v => !v)}
                onClear={clearFilters}
              />

              {loading && (
                <Spinner title="Fetching Market Data" message={`Analysing ASX announcements for ${dateLabel}…`} />
              )}

              {error && !loading && (
                <Notice
                  tone={error.includes('No market data') ? 'info' : 'error'}
                  title={error.includes('No market data') ? 'No Market Activity' : 'Connection Error'}
                  body={error.includes('No market data')
                    ? 'No announcements found for this date. This usually means the market has not opened yet, or it is a weekend or public holiday.'
                    : error}
                  actionLabel="Check Again"
                  onAction={() => fetchLog(date)}
                />
              )}

              {!loading && !error && log && sorted.length === 0 && (
                <div className="flex flex-col items-center justify-center h-[46vh] gap-5 text-center px-8 animate-fade-in-up">
                  <div className="w-16 h-16 rounded-3xl flex items-center justify-center animate-float"
                    style={{ background: 'var(--accent-dim)', border: '1px solid var(--border-accent)' }}>
                    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" style={{ color: 'var(--accent-light)', opacity: 0.6 }}>
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[1.05rem] font-bold" style={{ color: 'var(--text-primary)' }}>
                      No announcements match
                    </h3>
                    <p className="text-[0.82rem] mt-1.5 max-w-xs mx-auto leading-relaxed" style={{ color: 'var(--text-dim)' }}>
                      Refine your search, loosen the filters, or pick a different trading date.
                    </p>
                  </div>
                  <button onClick={clearFilters}
                    className="mt-1 px-5 py-2.5 rounded-xl text-[0.8rem] font-semibold transition-all duration-150 hover:-translate-y-0.5"
                    style={{ background: 'var(--border-subtle)', border: '1px solid var(--border-med)', color: 'var(--text-secondary)' }}>
                    Clear Filters
                  </button>
                </div>
              )}

              {!loading && !error && sorted.length > 0 && (viewMode === 'grid' ? renderedGrid : renderedList)}
            </div>
          )}

          {/* ── Accuracy ── */}
          {isAccuracyView && (
            <AccuracyPanel
              card={scorecard}
              summary={scoreSummary}
              loading={scoreLoading}
              error={scoreError}
              date={date}
              onRetry={() => fetchScorecard(date)}
            />
          )}

          {/* ── Placement & IPO summaries (AU / US-Canada) ── */}
          {isPlacementView && (
            <div className="max-w-[1000px] mx-auto">
              <ViewHeader
                title="Placement & IPO Summaries"
                subtitle={placementLog && placementLog.placements.length > 0
                  ? `${placementLog.placements.length} ${placementLog.placements.length === 1 ? 'deal' : 'deals'} · ${dateLabel} · hover a card to copy its summary`
                  : dateLabel}
              />

              {placementLoading && (
                <Spinner title="Fetching Placement Data" message={`Analysing placements for ${dateLabel}…`} />
              )}

              {!placementLoading && (!placementLog || placementLog.placements.length === 0) && (
                <Notice
                  tone="info"
                  title="No Placement Activity"
                  body="No placement summaries found for this date."
                  actionLabel="Check Again"
                  onAction={() => region && fetchPlacements(date, region)}
                />
              )}

              {!placementLoading && placementLog && placementLog.placements.length > 0 && (
                <div className="flex flex-col gap-4">
                  {placementLog.placements.map((p, i) => (
                    <div key={p.ticker + p.received_at + i}
                      style={{ animationDelay: `${Math.min(i * 0.06, 0.3)}s` }} className="animate-fade-in-up">
                      <PlacementCard placement={p} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
