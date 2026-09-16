'use client';

import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Announcement, MarketContext } from '@/types';
import { formatTime, getSentiment, SECTION_LABEL } from '@/lib/utils';
import PriceContext from './PriceContext';

/**
 * The list view as a screener table.
 *
 * The row view answers "what was announced". This answers "what is this
 * company, and where is the price" — the same feed, with the numbers already
 * attached to each announcement (market_context) laid into columns you can
 * scan down, instead of chips you have to read across.
 *
 * Two rules it is built around.
 *
 * 1. NOTHING IS INVENTED. Every figure comes from market_context, computed in
 *    market_context.py from bars that closed BEFORE the announcement. A stock
 *    whose context is missing — too little history, Yahoo down, or a log
 *    written before a column existed — shows a dash. Never a zero, which would
 *    sort and read as a real measurement.
 *
 * 2. THE DATE IS THE LOG'S, NOT TODAY'S. These are not live prices. The
 *    `as_of` date rides in the Close column's tooltip for exactly that reason.
 */

interface Props {
  anns: Announcement[];
}

type Align = 'left' | 'right';

interface Column {
  key: string;
  label: string;
  /** Second header line — units, so the labels themselves stay short. */
  unit?: string;
  align: Align;
  /** Absent on the text columns: a header that does not move is better than a
   *  sort nobody wants on a truncated headline. */
  value?: (a: Announcement) => number | null;
  render: (a: Announcement) => React.ReactNode;
  className?: string;
}

const DASH = <span style={{ color: 'var(--text-dim)' }}>—</span>;

const ctx = (a: Announcement): MarketContext | undefined => a.market_context;

/** The monthly columns are the same two lines six times over, so they are
 *  generated — and a generated accessor needs the key as a string. */
function ctxNum(a: Announcement, key: keyof MarketContext): number | null {
  const v = ctx(a)?.[key];
  return typeof v === 'number' && isFinite(v) ? v : null;
}

/** A price at the precision that price needs. 0.008 and 53.27 are both ASX
 *  prices; a fixed 2dp would round the first one away to nothing. */
function price(v: number | null | undefined): React.ReactNode {
  if (v === null || v === undefined || !isFinite(v)) return DASH;
  const dp = Math.abs(v) >= 100 ? 2 : Math.abs(v) >= 1 ? 3 : 4;
  const s = v.toFixed(dp);
  return s.includes('.') ? s.replace(/0+$/, '').replace(/\.$/, '') : s;
}

function num(v: number | null | undefined, dp = 2): React.ReactNode {
  if (v === null || v === undefined || !isFinite(v)) return DASH;
  return v.toFixed(dp);
}

/** Scaled to millions, because each of these is read as "how many million". */
function millions(v: number | null | undefined, dp = 2): React.ReactNode {
  if (v === null || v === undefined || !isFinite(v)) return DASH;
  return (v / 1e6).toFixed(dp);
}

const SENTIMENT_RANK = { bullish: 2, neutral: 1, bearish: 0 } as const;

// ── Signals ────────────────────────────────────────────────────────────────
// The handful of conditions worth pulling a row out of 300 for. Each one is a
// fact already in market_context, not a judgement: an RSI reading and a
// distance from a window's extreme. What they MEAN is left to the reader —
// nothing here is labelled a buy or a sell.

/** RSI thresholds. 80 rather than the conventional 70 puts the flag on the
 *  genuinely stretched names; at 70 roughly a fifth of a busy day qualifies and
 *  a highlight that fires that often stops being one. */
const RSI_HIGH = 80;
const RSI_LOW = 30;

type SignalKey = 'rsi_high' | 'rsi_low' | 'near_high' | 'near_low';

interface Signal {
  key: SignalKey;
  /** Badge text. Short — several can sit on one row. */
  label: string;
  color: string;
}

/** Windows checked for "near its high/low", nearest first. `at_*` is computed
 *  in market_context.py as within 1% of that window's extreme, so the rule
 *  lives in one place and the table cannot drift from the prompt. */
const WINDOWS = [
  { months: '3M', high: 'at_3m_high', low: 'at_3m_low' },
  { months: '6M', high: 'at_6m_high', low: 'at_6m_low' },
  { months: '12M', high: 'at_52w_high', low: 'at_52w_low' },
] as const;

function signalsFor(a: Announcement): Signal[] {
  const c = ctx(a);
  if (!c) return [];
  const out: Signal[] = [];

  const rsi = ctxNum(a, 'rsi_14');
  if (rsi !== null && rsi > RSI_HIGH) {
    out.push({ key: 'rsi_high', label: `RSI ${rsi.toFixed(0)}`, color: 'var(--danger)' });
  } else if (rsi !== null && rsi < RSI_LOW) {
    out.push({ key: 'rsi_low', label: `RSI ${rsi.toFixed(0)}`, color: 'var(--success)' });
  }

  // A window where the price is within 1% of BOTH its high and its low has a
  // total range under about 2% — a suspended or barely-traded stock sitting on
  // one price. "At its 12-month high" is true there and says nothing, so the
  // window is dropped rather than reported twice in opposite directions.
  const real = WINDOWS.filter(w => (c[w.high] === true) !== (c[w.low] === true));

  // Only the longest window that applies. A stock at its 12-month high is at
  // its 3- and 6-month high too, and three badges saying so is noise.
  const high = [...real].reverse().find(w => c[w.high] === true);
  if (high) out.push({ key: 'near_high', label: `▲ ${high.months} HIGH`, color: 'var(--accent-light)' });

  const low = [...real].reverse().find(w => c[w.low] === true);
  if (low) out.push({ key: 'near_low', label: `▼ ${low.months} LOW`, color: 'var(--warning)' });

  return out;
}

/** Which signal colours the row when several fire at once. The badges show all
 *  of them regardless, so this only decides the wash behind the numbers. */
const SIGNAL_PRECEDENCE: SignalKey[] = ['rsi_high', 'rsi_low', 'near_high', 'near_low'];

function dominant(sigs: Signal[]): SignalKey | undefined {
  return SIGNAL_PRECEDENCE.find(k => sigs.some(s => s.key === k));
}

/**
 * The drawer under an open row.
 *
 * Everything the grid view's card leads with and the table has no room for: the
 * AI's three points, its tags, and the price going into the filing. The chips
 * are the same PriceContext component the card uses rather than a table-shaped
 * copy of it, so the two views cannot drift into saying different things about
 * the same announcement.
 */
function DetailRow({ ann, span, signal }: {
  ann: Announcement; span: number; signal?: SignalKey;
}) {
  const c = ctx(ann);
  const summary = ann.summary ?? [];

  return (
    <tr className="screener-detail" data-signal={signal} data-open="true">
      <td colSpan={span} className="px-4 pb-4 pt-0"
        style={{ borderBottom: '1px solid var(--border-med)' }}>
        {/* Sticks to the left edge instead of scrolling away with the numeric
            columns: this is prose, and prose you have to scroll sideways to
            read is not readable. --drawer-w is the scroll container's visible
            width, so the drawer fills exactly what the reader can see and
            nothing lands off the right edge. */}
        <div
          style={{
            position: 'sticky',
            left: 0,
            // Less the td's own px-4 on both sides, or the right edge lands
            // just outside the visible area.
            width: 'calc(var(--drawer-w, 100%) - 2rem)',
          }}
          onClick={e => e.stopPropagation()}>
          {/* Two columns on a wide screen: the AI's read on the left, the
              measured stuff on the right. Stacked, the drawer was one long
              column of text with the table's whole width beside it empty. */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] gap-x-5 gap-y-3 items-start">

            <div className="rounded-xl p-3.5 min-w-0"
              style={{ background: 'var(--border-subtle)', border: '1px solid var(--border-med)' }}>
              <div className="flex items-center gap-1.5 mb-2.5">
                <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--accent)' }}>
                  <path d="M8 1l1.2 4.8L14 8l-4.8 1.2L8 15l-1.2-4.8L2 8l4.8-1.2z" fill="currentColor" opacity="0.9" />
                </svg>
                <span className={SECTION_LABEL} style={{ color: 'var(--accent)' }}>AI Summary</span>
              </div>

              {summary.length > 0 ? (
                // Identical to the card's bullets, down to the marker. The
                // drawer is the card's text in a table; the same sentence
                // should not be set differently in one place than the other.
                <ul className="flex flex-col gap-2 min-w-0">
                  {summary.map((point, i) => (
                    <li key={i} className="flex gap-2.5 text-[0.8rem] leading-[1.62] text-pretty break-words min-w-0"
                      style={{ color: 'var(--text-secondary)' }}>
                      <span className="mt-[0.55em] w-1 h-1 rounded-full flex-shrink-0"
                        style={{ background: 'var(--accent)' }} />
                      <span className="min-w-0 flex-1">{point.replace(/^[\s\-*•\d.]+\s*/, '')}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-[0.76rem]" style={{ color: 'var(--text-dim)' }}>
                  No AI summary was written for this announcement.
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3 min-w-0">
              {c && <PriceContext ctx={c} />}

              <div className="flex flex-wrap items-center gap-1.5">
                {ann.tags?.map(t => (
                  <span key={t} className="text-[0.68rem] font-medium px-2 py-[0.15rem] rounded-md"
                    style={{
                      color: 'var(--text-dim)',
                      background: 'var(--border-subtle)',
                      border: '1px solid var(--border-med)',
                    }}>
                    {t}
                  </span>
                ))}
                <a href={ann.url || '#'} target="_blank" rel="noopener noreferrer"
                  className="ml-auto inline-flex items-center gap-1 text-[0.65rem] font-bold hover:underline whitespace-nowrap"
                  style={{ color: 'var(--accent)' }}>
                  View on ASX
                  <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5">
                    <path d="M1.5 8.5L8.5 1.5M8.5 1.5H4M8.5 1.5V6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

const SIGNAL_FILTERS: { key: SignalKey | 'all' | 'any'; label: string; title: string }[] = [
  { key: 'all', label: 'All rows', title: 'Every announcement for the day' },
  { key: 'any', label: '⚑ Flagged', title: 'Any of the signals below' },
  { key: 'rsi_high', label: `RSI ${RSI_HIGH}+`, title: `14-day RSI above ${RSI_HIGH}` },
  { key: 'rsi_low', label: `RSI ${RSI_LOW}−`, title: `14-day RSI below ${RSI_LOW}` },
  { key: 'near_high', label: 'Near high', title: 'Within 1% of its 3, 6 or 12-month high' },
  { key: 'near_low', label: 'Near low', title: 'Within 1% of its 3, 6 or 12-month low' },
];

export default function AnnouncementTable({ anns }: Props) {
  // Null means the feed's own order — sensitive first, then sentiment, then
  // time. That ordering is the editorial one and is worth being able to get
  // back to, so a third click on a header returns to it rather than toggling
  // between two sorts forever.
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [dir, setDir] = useState<'asc' | 'desc'>('desc');

  // Click a row to open it. The table has no room for three bullet points and a
  // row of price chips across twenty numeric columns, so the AI's read of the
  // announcement — the thing the grid view leads with — lives in a drawer
  // underneath. Opening also pins the highlight, which is what you want while
  // dragging the table sideways through the later columns.
  const [openRow, setOpenRow] = useState<string | null>(null);

  const [signalFilter, setSignalFilter] = useState<SignalKey | 'all' | 'any'>('all');

  // The drawer is sticky to the left of a table far wider than the screen, so
  // its containing block is the full table width and `width: 100%` would run
  // most of its content off the right edge. What it actually wants is the
  // VISIBLE width of the scroll container, which only JS can report — published
  // as a custom property that the drawer inherits.
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const publish = () => el.style.setProperty('--drawer-w', `${el.clientWidth}px`);
    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Computed once per announcement rather than in render, sort and filter
  // separately — signalsFor walks the context object and this runs 300 times.
  const signalsByRow = useMemo(() => {
    const m = new Map<Announcement, Signal[]>();
    anns.forEach(a => m.set(a, signalsFor(a)));
    return m;
  }, [anns]);

  const filtered = useMemo(() => {
    if (signalFilter === 'all') return anns;
    return anns.filter(a => {
      const sigs = signalsByRow.get(a) ?? [];
      return signalFilter === 'any' ? sigs.length > 0 : sigs.some(s => s.key === signalFilter);
    });
  }, [anns, signalFilter, signalsByRow]);

  const flaggedCount = useMemo(
    () => anns.reduce((n, a) => n + ((signalsByRow.get(a)?.length ?? 0) > 0 ? 1 : 0), 0),
    [anns, signalsByRow],
  );

  const columns: Column[] = useMemo(() => {
    const monthly = ([1, 2, 3] as const).flatMap<Column>(m => {
      const hi = `month${m}_high` as keyof MarketContext;
      const lo = `month${m}_low` as keyof MarketContext;
      return [
        {
          key: hi, label: `M${m} High`,
          unit: m === 1 ? 'last 21d' : undefined,
          align: 'right',
          value: a => ctxNum(a, hi),
          render: a => price(ctxNum(a, hi)),
        },
        {
          key: lo, label: `M${m} Low`, align: 'right',
          value: a => ctxNum(a, lo),
          render: a => price(ctxNum(a, lo)),
        },
      ];
    });

    return [
      {
        key: 'ticker', label: 'ASX Code', align: 'left',
        render: a => (
          <span className="flex items-center gap-1.5">
            {a.market_sensitive && (
              <span className="inline-flex rounded-full h-1.5 w-1.5 flex-shrink-0"
                title="Market sensitive" style={{ background: 'var(--danger)' }} />
            )}
            <span className="font-mono font-black tracking-[0.04em]" style={{ color: 'var(--text-primary)' }}>
              {a.ticker}
            </span>
          </span>
        ),
      },
      {
        key: 'company', label: 'Company', align: 'left',
        render: a => (
          <span className="block truncate max-w-[170px]" title={a.company}
            style={{ color: 'var(--text-primary)' }}>
            {a.company}
          </span>
        ),
      },
      {
        key: 'headline', label: 'Announcement', align: 'left',
        render: a => (
          // Opening the document is not a request to pin the row it sits on.
          <a href={a.url || '#'} target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="block truncate max-w-[300px] hover:underline"
            title={a.headline} style={{ color: 'var(--text-primary)' }}>
            {a.headline}
          </a>
        ),
      },
      {
        key: 'time', label: 'Time', align: 'left',
        value: a => new Date(a.time).getTime() || null,
        render: a => <span style={{ color: 'var(--text-secondary)' }}>{formatTime(a.time)}</span>,
        className: 'font-mono',
      },
      {
        key: 'type', label: 'Type', align: 'left',
        render: a => (
          <span className="block truncate max-w-[120px]" title={a.document_type}
            style={{ color: 'var(--text-secondary)' }}>
            {a.document_type || DASH}
          </span>
        ),
      },
      {
        key: 'sentiment', label: 'Sentiment', align: 'left',
        // Bullish first when descending, the direction every other column
        // reads in: strongest at the top.
        value: a => SENTIMENT_RANK[getSentiment(a)],
        render: a => {
          const s = getSentiment(a);
          const color = s === 'bullish' ? 'var(--success)'
            : s === 'bearish' ? 'var(--danger)' : 'var(--text-dim)';
          return <span className="font-semibold capitalize" style={{ color }}>{s}</span>;
        },
      },
      {
        key: 'signals', label: 'Signals', align: 'left',
        // Sorts by how many fired, so the busiest rows lead when you click it.
        value: a => signalsFor(a).length || null,
        render: a => {
          const sigs = signalsFor(a);
          if (!sigs.length) return DASH;
          return (
            <span className="flex items-center gap-1">
              {sigs.map(s => (
                <span key={s.key}
                  className="font-mono text-[0.6rem] font-bold px-1.5 py-0.5 rounded-md whitespace-nowrap"
                  style={{
                    color: s.color,
                    background: `color-mix(in srgb, ${s.color}, transparent 88%)`,
                    border: `1px solid color-mix(in srgb, ${s.color}, transparent 76%)`,
                  }}>
                  {s.label}
                </span>
              ))}
            </span>
          );
        },
      },
      {
        key: 'market_cap_aud', label: 'Mkt Cap', unit: 'A$M', align: 'right',
        value: a => ctxNum(a, 'market_cap_aud'),
        render: a => millions(ctxNum(a, 'market_cap_aud'), 1),
      },
      {
        key: 'beta', label: 'Beta', unit: 'vs XJO', align: 'right',
        value: a => ctxNum(a, 'beta'),
        render: a => num(ctxNum(a, 'beta'), 2),
      },
      {
        key: 'avg_volume_20', label: 'Avg Vol', unit: '20d, M', align: 'right',
        value: a => ctxNum(a, 'avg_volume_20'),
        render: a => millions(ctxNum(a, 'avg_volume_20'), 3),
      },
      {
        key: 'volume_change_pct', label: 'Vol Chg', unit: '% vs 20d avg', align: 'right',
        value: a => ctxNum(a, 'volume_change_pct'),
        render: a => {
          const v = ctxNum(a, 'volume_change_pct');
          if (v === null) return DASH;
          const color = v > 0 ? 'var(--success)' : v < 0 ? 'var(--danger)' : 'var(--text-secondary)';
          return <span style={{ color }}>{v > 0 ? '+' : ''}{v.toFixed(1)}</span>;
        },
      },
      {
        key: 'rsi_14', label: 'RSI', unit: '14d', align: 'right',
        value: a => ctxNum(a, 'rsi_14'),
        render: a => {
          const v = ctxNum(a, 'rsi_14');
          if (v === null) return DASH;
          // The same thresholds the row flag uses, so the cell and the row can
          // never disagree about whether this reading is notable.
          const over = v > RSI_HIGH, under = v < RSI_LOW;
          const tone = over ? 'var(--danger)' : under ? 'var(--success)' : null;
          return (
            <span className="px-1.5 py-0.5 rounded-md"
              title={over ? `Overbought (RSI above ${RSI_HIGH})`
                : under ? `Oversold (RSI below ${RSI_LOW})` : undefined}
              style={{
                color: tone ?? 'var(--text-primary)',
                background: tone ? `color-mix(in srgb, ${tone}, transparent 86%)` : 'transparent',
              }}>
              {v.toFixed(1)}
            </span>
          );
        },
      },
      {
        key: 'high_52w', label: '52W High', align: 'right',
        value: a => ctxNum(a, 'high_52w'),
        render: a => price(ctxNum(a, 'high_52w')),
      },
      {
        key: 'low_52w', label: '52W Low', align: 'right',
        value: a => ctxNum(a, 'low_52w'),
        render: a => price(ctxNum(a, 'low_52w')),
      },
      {
        key: 'last_close', label: 'Latest Close', align: 'right',
        value: a => ctxNum(a, 'last_close'),
        render: a => {
          const c = ctx(a);
          if (!c) return DASH;
          return (
            <span className="font-bold"
              title={`Close of ${c.as_of} — the last bar before this announcement`}
              style={{ color: 'var(--text-primary)' }}>
              {price(c.last_close)}
            </span>
          );
        },
      },
      ...monthly,
    ];
  }, []);

  const rows = useMemo(() => {
    const col = sortKey ? columns.find(c => c.key === sortKey) : undefined;

    // No column sort: the feed's own order, in three tiers on top of it —
    // rows carrying a signal, then rows that at least have price context to
    // show, then everything else. Sort is stable, so inside each tier the feed
    // order (sensitive first, then bullish, then newest) is untouched.
    //
    // Explicitly sorting a column hands the order over to that column
    // completely. A sort by market cap that quietly kept some rows pinned
    // above it would not be a sort by market cap.
    if (!col?.value) {
      const tier = (a: Announcement) => {
        if ((signalsByRow.get(a)?.length ?? 0) > 0) return 0;
        if (ctx(a)?.notes?.length) return 1;
        return 2;
      };
      return [...filtered].sort((a, b) => tier(a) - tier(b));
    }

    const get = col.value;
    return [...filtered].sort((a, b) => {
      const va = get(a), vb = get(b);
      // Missing data sinks to the bottom in BOTH directions. Sorting by market
      // cap ascending should surface the smallest company that has one, not
      // the forty stubs Yahoo has never heard of.
      if (va === null && vb === null) return 0;
      if (va === null) return 1;
      if (vb === null) return -1;
      return dir === 'desc' ? vb - va : va - vb;
    });
  }, [filtered, signalsByRow, columns, sortKey, dir]);

  function toggleSort(col: Column) {
    if (!col.value) return;
    if (sortKey !== col.key) { setSortKey(col.key); setDir('desc'); return; }
    if (dir === 'desc') { setDir('asc'); return; }
    setSortKey(null);   // third click: back to the feed's own order
    setDir('desc');
  }

  const CELL = 'px-3 py-2 whitespace-nowrap';

  return (
    <>
      {/* ── Signal filters ──
          Single-select rather than a set of checkboxes: these are ways of
          asking one question — "show me the stretched ones" — not facets to
          combine, and four independent toggles produce fifteen states nobody
          asked for. */}
      <div className="flex flex-wrap items-center gap-2 mb-2.5">
        {SIGNAL_FILTERS.map(f => {
          const active = signalFilter === f.key;
          const n = f.key === 'all' ? anns.length
            : f.key === 'any' ? flaggedCount
              : anns.reduce((t, a) =>
                t + ((signalsByRow.get(a) ?? []).some(s => s.key === f.key) ? 1 : 0), 0);
          return (
            <button key={f.key} onClick={() => setSignalFilter(f.key)} title={f.title}
              disabled={n === 0 && f.key !== 'all'}
              className="px-3 py-1.5 rounded-xl text-[0.72rem] font-semibold transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: active ? 'var(--accent-dim)' : 'var(--border-subtle)',
                border: `1px solid ${active ? 'var(--border-accent)' : 'var(--border-med)'}`,
                color: active ? 'var(--accent-light)' : 'var(--text-dim)',
              }}>
              {f.label}
              <span className="ml-1.5 font-mono text-[0.66rem] opacity-70">{n}</span>
            </button>
          );
        })}
        <span className="ml-auto font-mono text-[0.66rem]" style={{ color: 'var(--text-dim)' }}
          title={sortKey ? undefined
            : 'Flagged rows, then rows with price context, then the rest. Click any column heading to sort instead.'}>
          {sortKey
            ? `sorted by ${columns.find(c => c.key === sortKey)?.label ?? sortKey}`
            : 'flagged first · click a row for detail'}
        </span>
      </div>

    <div className="rounded-[14px] overflow-hidden"
      style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-card)' }}>
      {/* The only horizontally scrolling thing on the page. Twenty columns do
          not fit a laptop, and shrinking them to fit is how a screener becomes
          unreadable — so the ticker column is pinned and the rest scrolls. */}
      <div className="overflow-x-auto" ref={scrollRef}>
        <table className="w-full text-[0.78rem] border-collapse">
          <thead>
            <tr>
              {columns.map((c, i) => (
                <th key={c.key}
                  onClick={() => toggleSort(c)}
                  className={[
                    CELL, SECTION_LABEL, 'align-bottom select-none',
                    c.align === 'right' ? 'text-right' : 'text-left',
                    c.value ? 'cursor-pointer hover:text-[var(--text-accent)]' : '',
                    i === 0 ? 'sticky left-0 z-20' : '',
                  ].join(' ')}
                  title={c.value ? 'Click to sort' : undefined}
                  style={{
                    color: sortKey === c.key ? 'var(--text-accent)' : 'var(--text-secondary)',
                    background: 'var(--bg-card-hover)',
                    borderBottom: '1px solid var(--border-med)',
                  }}>
                  <span className="inline-flex items-center gap-1">
                    {c.label}
                    {sortKey === c.key && <span aria-hidden>{dir === 'desc' ? '▼' : '▲'}</span>}
                  </span>
                  {c.unit && (
                    <span className="block font-normal normal-case tracking-normal text-[0.63rem]"
                      style={{ color: 'var(--text-dim)' }}>
                      {c.unit}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((a, i) => {
              const id = a.url + i + a.time;
              const isOpen = openRow === id;
              const sigs = signalsByRow.get(a) ?? [];
              return (
                <Fragment key={id}>
                  <tr
                    className="screener-row cursor-pointer"
                    data-open={isOpen}
                    data-stripe={i % 2 === 1}
                    data-signal={dominant(sigs)}
                    aria-expanded={isOpen}
                    onClick={() => setOpenRow(isOpen ? null : id)}
                    title={isOpen ? 'Click to close' : 'Click for the AI read and the price going in'}>
                    {columns.map((c, ci) => (
                      <td key={c.key}
                        className={[
                          CELL, c.className ?? '',
                          c.align === 'right' ? 'text-right font-mono tabular-nums' : 'text-left',
                          // Backgrounds for every state live in globals.css
                          // under .screener-row, so the pinned cell and the
                          // scrolling ones cannot disagree about which row they
                          // belong to.
                          ci === 0 ? 'sticky left-0 z-10' : '',
                          'transition-colors duration-100',
                        ].join(' ')}
                        style={{
                          color: 'var(--text-secondary)',
                          borderBottom: isOpen ? 'none' : '1px solid var(--border-subtle)',
                        }}>
                        {ci === 0 ? (
                          <span className="flex items-center gap-1">
                            <span className="inline-block w-2 text-[0.6rem] transition-transform duration-150"
                              style={{
                                color: 'var(--text-dim)',
                                transform: isOpen ? 'rotate(90deg)' : 'none',
                              }}
                              aria-hidden>▶</span>
                            {c.render(a)}
                          </span>
                        ) : c.render(a)}
                      </td>
                    ))}
                  </tr>
                  {isOpen && <DetailRow ann={a} span={columns.length} signal={dominant(sigs)} />}
                </Fragment>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-[0.8rem]"
                  style={{ color: 'var(--text-dim)' }}>
                  No announcement matches that signal today.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}
