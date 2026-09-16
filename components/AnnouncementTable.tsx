'use client';

import { useMemo, useState } from 'react';
import { Announcement, MarketContext } from '@/types';
import { formatTime, getSentiment, SECTION_LABEL } from '@/lib/utils';

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

export default function AnnouncementTable({ anns }: Props) {
  // Null means the feed's own order — sensitive first, then sentiment, then
  // time. That ordering is the editorial one and is worth being able to get
  // back to, so a third click on a header returns to it rather than toggling
  // between two sorts forever.
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [dir, setDir] = useState<'asc' | 'desc'>('desc');

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
          <a href={a.url || '#'} target="_blank" rel="noopener noreferrer"
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
          // The two conventional thresholds, tinted rather than filled. A
          // column of forty solid cells turns the table into a heatmap of one
          // indicator, which is not what it is for.
          const over = v >= 70, under = v <= 30;
          return (
            <span className="px-1.5 py-0.5 rounded-md"
              title={over ? 'Overbought (RSI 70+)' : under ? 'Oversold (RSI 30 or less)' : undefined}
              style={{
                color: over ? 'var(--danger)' : under ? 'var(--accent-light)' : 'var(--text-primary)',
                background: over ? 'color-mix(in srgb, var(--danger), transparent 88%)'
                  : under ? 'color-mix(in srgb, var(--accent), transparent 88%)' : 'transparent',
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
    if (!col?.value) return anns;
    const get = col.value;
    return [...anns].sort((a, b) => {
      const va = get(a), vb = get(b);
      // Missing data sinks to the bottom in BOTH directions. Sorting by market
      // cap ascending should surface the smallest company that has one, not
      // the forty stubs Yahoo has never heard of.
      if (va === null && vb === null) return 0;
      if (va === null) return 1;
      if (vb === null) return -1;
      return dir === 'desc' ? vb - va : va - vb;
    });
  }, [anns, columns, sortKey, dir]);

  function toggleSort(col: Column) {
    if (!col.value) return;
    if (sortKey !== col.key) { setSortKey(col.key); setDir('desc'); return; }
    if (dir === 'desc') { setDir('asc'); return; }
    setSortKey(null);   // third click: back to the feed's own order
    setDir('desc');
  }

  const CELL = 'px-3 py-2 whitespace-nowrap';

  return (
    <div className="rounded-[14px] overflow-hidden"
      style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-card)' }}>
      {/* The only horizontally scrolling thing on the page. Twenty columns do
          not fit a laptop, and shrinking them to fit is how a screener becomes
          unreadable — so the ticker column is pinned and the rest scrolls. */}
      <div className="overflow-x-auto">
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
            {rows.map((a, i) => (
              <tr key={a.url + i + a.time} className="group">
                {columns.map((c, ci) => (
                  <td key={c.key}
                    className={[
                      CELL, c.className ?? '',
                      c.align === 'right' ? 'text-right font-mono tabular-nums' : 'text-left',
                      // The pinned cell needs its own opaque background or the
                      // scrolling columns show through it. As a class, not an
                      // inline style, so the row hover can still win.
                      ci === 0 ? 'sticky left-0 z-10 bg-[var(--bg-card)]' : '',
                      'transition-colors duration-100 group-hover:bg-[var(--bg-card-hover)]',
                    ].join(' ')}
                    style={{
                      color: 'var(--text-secondary)',
                      borderBottom: '1px solid var(--border-subtle)',
                    }}>
                    {c.render(a)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
