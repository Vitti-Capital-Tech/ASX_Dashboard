'use client';

import { useMemo, useState } from 'react';
import type { Scorecard, ScorecardSummary, ScoredCall, Verdict } from '@/types';

const VERDICT_FILTERS: { key: Verdict | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'correct', label: 'Correct' },
  { key: 'wrong', label: 'Wrong' },
  { key: 'flat', label: 'No real move' },
  { key: 'no_data', label: 'No price' },
];

function pct(v: number | null | undefined, digits = 1): string {
  return v === null || v === undefined ? '—' : `${v > 0 ? '+' : ''}${v.toFixed(digits)}%`;
}

function rate(v: number | null | undefined): string {
  return v === null || v === undefined ? '—' : `${v.toFixed(1)}%`;
}

/** Green above 50% (better than a coin flip), amber below. */
function rateColor(v: number | null | undefined): string {
  if (v === null || v === undefined) return 'var(--text-dim)';
  return v >= 50 ? 'var(--success)' : 'var(--danger)';
}

function moveColor(v: number | null | undefined): string {
  if (v === null || v === undefined) return 'var(--text-dim)';
  if (v > 0) return 'var(--success)';
  if (v < 0) return 'var(--danger)';
  return 'var(--text-dim)';
}

function Stat({ label, value, color, hint }: {
  label: string; value: string; color?: string; hint?: string;
}) {
  return (
    <div className="rounded-2xl p-4 flex flex-col gap-1"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}>
      <span className="text-[0.65rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
        {label}
      </span>
      <span className="font-mono text-[1.6rem] font-bold leading-tight" style={{ color: color ?? 'var(--text-primary)' }}>
        {value}
      </span>
      {hint && (
        <span className="text-[0.68rem] leading-snug" style={{ color: 'var(--text-dim)' }}>{hint}</span>
      )}
    </div>
  );
}

function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const map: Record<Verdict, { text: string; color: string }> = {
    correct: { text: '✓ Correct', color: 'var(--success)' },
    wrong:   { text: '✗ Wrong',   color: 'var(--danger)' },
    flat:    { text: '~ No move', color: 'var(--text-dim)' },
    pending: { text: '⋯ Pending', color: 'var(--accent)' },
    no_data: { text: '— No price', color: 'var(--text-dim)' },
  };
  const { text, color } = map[verdict];
  return (
    <span className="font-mono text-[0.65rem] font-bold px-2 py-1 rounded-lg whitespace-nowrap"
      style={{
        color,
        background: `color-mix(in srgb, ${color}, transparent 90%)`,
        border: `1px solid color-mix(in srgb, ${color}, transparent 75%)`,
      }}>
      {text}
    </span>
  );
}

/** Plain-English blurb for a social post — no chart, no jargon, ready to paste. */
function linkedInBlurb(card: Scorecard, summary: ScorecardSummary | null): string {
  const s = card.stats;
  const best = card.highlights.best_calls[0];
  const lines = [
    `Vitti ASX Intelligence — sentiment scorecard for ${card.date}`,
    '',
    `Our AI read every ASX announcement that day and called each one bullish, bearish or neutral. Here is how those calls actually landed, measured against the ${card.benchmark} close:`,
    '',
    `• ${s.directional_scored} directional calls scored`,
    `• ${rate(s.directional_hit_rate)} of them were right`,
    `• Bullish calls: ${rate(s.by_sentiment.bullish.hit_rate)} accurate, averaging ${pct(s.by_sentiment.bullish.avg_abnormal_pct, 2)} vs the index`,
    `• Bearish calls: ${rate(s.by_sentiment.bearish.hit_rate)} accurate, averaging ${pct(s.by_sentiment.bearish.avg_abnormal_pct, 2)} vs the index`,
  ];
  if (best) {
    lines.push('', `Best call of the day: ${best.ticker} — "${best.headline}" flagged ${best.sentiment}, closed ${pct(best.abnormal_pct, 1)} against the market.`);
  }
  if (summary && summary.directional_scored > 0) {
    lines.push('', `Running total: ${rate(summary.directional_hit_rate)} across ${summary.directional_scored} calls over ${summary.days_scored} trading ${summary.days_scored === 1 ? 'day' : 'days'}.`);
  }
  lines.push('', `Every call is scored net of the index, and moves under ${card.threshold_pct}% are treated as noise rather than a hit.`);
  return lines.join('\n');
}

export default function AccuracyPanel({
  card, summary, loading, error, date, onRetry,
}: {
  card: Scorecard | null;
  summary: ScorecardSummary | null;
  loading: boolean;
  error: string | null;
  date: string;
  onRetry: () => void;
}) {
  const [filter, setFilter] = useState<Verdict | 'all'>('all');
  const [copied, setCopied] = useState(false);

  const rows = useMemo<ScoredCall[]>(() => {
    if (!card) return [];
    const all = card.results.filter(r => r.sentiment !== 'neutral');
    const picked = filter === 'all' ? all : all.filter(r => r.verdict === filter);
    // Biggest moves first — those are the calls worth arguing about.
    return [...picked].sort((a, b) => Math.abs(b.abnormal_pct ?? 0) - Math.abs(a.abnormal_pct ?? 0));
  }, [card, filter]);

  async function copyBlurb() {
    if (!card) return;
    await navigator.clipboard.writeText(linkedInBlurb(card, summary));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadCsv() {
    if (!card) return;
    const headers = ['Ticker', 'Company', 'Headline', 'Our Call', 'Prev Close', 'Close',
      'Move %', 'Index %', 'Net of Index %', 'Verdict', 'Session', 'Released', 'URL'];
    const body = card.results.map(r => [
      r.ticker, `"${r.company.replace(/"/g, '""')}"`, `"${r.headline.replace(/"/g, '""')}"`,
      r.sentiment, r.prev_close ?? '', r.close ?? '', r.return_pct ?? '',
      r.index_return_pct ?? '', r.abnormal_pct ?? '', r.verdict, r.bucket, r.time, r.url,
    ].join(','));
    const blob = new Blob([[headers.join(','), ...body].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Vitti_ASX_Scorecard_${card.date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[52vh] gap-5 animate-fade-in-up">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full"
            style={{ border: '2px solid var(--border-accent)', borderTopColor: 'var(--accent)', animation: 'spin 0.8s linear infinite' }} />
        </div>
        <div className="text-center">
          <h3 className="text-[1rem] font-bold text-slate-200">Loading Scorecard</h3>
          <p className="text-[0.8rem] mt-1" style={{ color: 'rgba(100,116,139,0.7)' }}>
            Checking our calls against the closing prices…
          </p>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="mx-auto max-w-xl mt-10 animate-fade-in-up">
        <div className="rounded-[20px] p-7"
          style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.18)' }}>
          <h3 className="text-[1rem] font-bold mb-2" style={{ color: '#a5b4fc' }}>No Scorecard Yet</h3>
          <p className="text-[0.85rem] leading-relaxed mb-5" style={{ color: 'rgba(148,163,184,0.75)' }}>
            {error ?? `Nothing scored for ${date}.`} The scorecard is written after the ASX
            close, so today&apos;s calls stay unscored until the closing prices are in.
          </p>
          <button onClick={onRetry}
            className="px-5 py-2.5 rounded-xl text-white text-[0.8rem] font-bold tracking-wide transition-all duration-150 hover:-translate-y-0.5"
            style={{ background: '#6366f1', boxShadow: '0 4px 20px rgba(99,102,241,0.35)' }}>
            Check Again
          </button>
        </div>
      </div>
    );
  }

  const s = card.stats;

  return (
    <div className="max-w-[1400px] mx-auto animate-fade-in-up">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 px-1">
        <div>
          <h2 className="text-[1rem] font-bold text-slate-200">Were We Right?</h2>
          <p className="text-[0.72rem] mt-1" style={{ color: 'var(--text-dim)' }}>
            Every bullish and bearish call for {card.date}, checked against the closing price
            and measured net of the {card.benchmark}. Moves under {card.threshold_pct}% count as noise.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={copyBlurb}
            className="px-4 py-2 rounded-xl text-[0.75rem] font-semibold transition-all duration-150 hover:-translate-y-0.5"
            style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#a5b4fc' }}>
            {copied ? '✓ Copied' : 'Copy post summary'}
          </button>
          <button onClick={downloadCsv}
            className="px-4 py-2 rounded-xl text-[0.75rem] font-semibold transition-all duration-150 hover:-translate-y-0.5"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(148,163,184,0.85)' }}>
            Export CSV
          </button>
        </div>
      </div>

      {/* ── Headline stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Stat label="Hit rate today" value={rate(s.directional_hit_rate)}
          color={rateColor(s.directional_hit_rate)}
          hint={`${s.directional_scored} calls that actually moved`} />
        <Stat label="Bullish calls" value={rate(s.by_sentiment.bullish.hit_rate)}
          color={rateColor(s.by_sentiment.bullish.hit_rate)}
          hint={`${s.by_sentiment.bullish.correct}/${s.by_sentiment.bullish.correct + s.by_sentiment.bullish.wrong} right · avg ${pct(s.by_sentiment.bullish.avg_abnormal_pct, 2)}`} />
        <Stat label="Bearish calls" value={rate(s.by_sentiment.bearish.hit_rate)}
          color={rateColor(s.by_sentiment.bearish.hit_rate)}
          hint={`${s.by_sentiment.bearish.correct}/${s.by_sentiment.bearish.correct + s.by_sentiment.bearish.wrong} right · avg ${pct(s.by_sentiment.bearish.avg_abnormal_pct, 2)}`} />
        <Stat label="Bull − Bear spread" value={pct(s.spread_pct, 2)}
          color={moveColor(s.spread_pct)}
          hint="How far bullish picks beat bearish ones" />
      </div>

      {/* ── Running total ── */}
      {summary && summary.directional_scored > 0 && (
        <div className="rounded-2xl px-5 py-3.5 mb-6 flex flex-wrap items-center gap-x-7 gap-y-2"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
          <span className="text-[0.65rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
            All time
          </span>
          <span className="text-[0.8rem]" style={{ color: 'var(--text-primary)' }}>
            <b className="font-mono" style={{ color: rateColor(summary.directional_hit_rate) }}>
              {rate(summary.directional_hit_rate)}
            </b>{' '}
            across <b className="font-mono">{summary.directional_scored}</b> calls
            over <b className="font-mono">{summary.days_scored}</b>{' '}
            trading {summary.days_scored === 1 ? 'day' : 'days'}
          </span>
          <span className="text-[0.8rem]" style={{ color: 'var(--text-primary)' }}>
            Spread{' '}
            <b className="font-mono" style={{ color: moveColor(summary.spread_pct) }}>
              {pct(summary.spread_pct, 2)}
            </b>
          </span>
          <span className="text-[0.8rem]" style={{ color: 'var(--text-primary)' }}>
            Neutral control{' '}
            <b className="font-mono" style={{ color: 'var(--text-dim)' }}>
              {pct(summary.by_sentiment.neutral.avg_abnormal_pct, 2)}
            </b>
          </span>
        </div>
      )}

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-2 mb-4">
        {VERDICT_FILTERS.map(f => {
          const active = filter === f.key;
          return (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className="px-3.5 py-1.5 rounded-xl text-[0.72rem] font-semibold transition-all duration-150"
              style={{
                background: active ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
                border: active ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.07)',
                color: active ? '#a5b4fc' : 'rgba(148,163,184,0.7)',
              }}>
              {f.label}
            </button>
          );
        })}
        <span className="ml-auto self-center font-mono text-[0.7rem]" style={{ color: 'var(--text-dim)' }}>
          {rows.length} shown
          {s.conflicts > 0 && ` · ${s.conflicts} excluded (mixed calls same day)`}
          {s.pending > 0 && ` · ${s.pending} awaiting next close`}
        </span>
      </div>

      {/* ── Call-by-call table ── */}
      <div className="rounded-2xl overflow-x-auto"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
        <table className="w-full min-w-[820px] text-left border-collapse">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              {['Ticker', 'Announcement', 'Our call', 'Close', 'Move', 'Net of index', 'Verdict'].map(h => (
                <th key={h} className="px-4 py-3 text-[0.65rem] font-bold uppercase tracking-wider"
                  style={{ color: 'var(--text-dim)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.url + i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td className="px-4 py-3 align-top">
                  <span className="font-mono text-[0.78rem] font-bold" style={{ color: 'var(--text-primary)' }}>
                    {r.ticker}
                  </span>
                  {r.conflict && (
                    <span className="block text-[0.6rem] mt-0.5" style={{ color: 'var(--text-dim)' }}>
                      mixed calls
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 align-top max-w-[420px]">
                  <a href={r.url} target="_blank" rel="noopener noreferrer"
                    className="text-[0.78rem] leading-snug hover:underline"
                    style={{ color: 'var(--text-primary)' }}>
                    {r.headline}
                  </a>
                  <span className="block text-[0.62rem] mt-0.5" style={{ color: 'var(--text-dim)' }}>
                    {r.company}
                  </span>
                </td>
                <td className="px-4 py-3 align-top">
                  <span className="font-mono text-[0.7rem] font-bold uppercase"
                    style={{ color: r.sentiment === 'bullish' ? 'var(--success)' : 'var(--danger)' }}>
                    {r.sentiment === 'bullish' ? '▲ Bull' : '▼ Bear'}
                  </span>
                </td>
                <td className="px-4 py-3 align-top font-mono text-[0.75rem]" style={{ color: 'var(--text-dim)' }}>
                  {r.close === null ? '—' : `$${r.close.toFixed(3)}`}
                </td>
                <td className="px-4 py-3 align-top font-mono text-[0.78rem] font-semibold"
                  style={{ color: moveColor(r.return_pct) }}>
                  {pct(r.return_pct, 2)}
                </td>
                <td className="px-4 py-3 align-top font-mono text-[0.78rem] font-bold"
                  style={{ color: moveColor(r.abnormal_pct) }}>
                  {pct(r.abnormal_pct, 2)}
                </td>
                <td className="px-4 py-3 align-top">
                  <VerdictBadge verdict={r.verdict} />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-[0.8rem]" style={{ color: 'var(--text-dim)' }}>
                  No calls in this bucket for {card.date}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-[0.65rem] mt-3 px-1 leading-relaxed" style={{ color: 'var(--text-dim)' }}>
        Prices from Yahoo Finance end-of-day. News released after the 4pm close is judged on the
        next session. Tickers with both a bullish and a bearish call on the same day cannot be
        settled by one closing price, so they are excluded from the hit rate.
      </p>
    </div>
  );
}
