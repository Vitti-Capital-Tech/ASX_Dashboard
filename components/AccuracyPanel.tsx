'use client';

import { useMemo, useState } from 'react';
import type {
  Scorecard, ScorecardSummary, ScoredCall, SentimentStat, Verdict,
} from '@/types';
import { formatDateLabel } from '@/lib/utils';
import ViewHeader from './ViewHeader';

const VERDICT_FILTERS: { key: Verdict | 'all'; label: string }[] = [
  { key: 'all', label: 'All calls' },
  { key: 'correct', label: 'Correct' },
  { key: 'wrong', label: 'Wrong' },
  { key: 'flat', label: 'No real move' },
  { key: 'no_data', label: 'No price' },
];

// Status colours, not a categorical palette — they mean right / wrong / neither.
// Green and red sit only 5.6 ΔE apart under deuteranopia, so every use below is
// paired with a label or a ✓/✗ glyph and never carries meaning on its own.
const OK = 'var(--success)';
const BAD = 'var(--danger)';
const NEUTRAL = 'var(--text-dim)';

function pct(v: number | null | undefined, digits = 1): string {
  return v === null || v === undefined ? '—' : `${v > 0 ? '+' : ''}${v.toFixed(digits)}%`;
}

function rate(v: number | null | undefined): string {
  return v === null || v === undefined ? '—' : `${v.toFixed(1)}%`;
}

function rateColor(v: number | null | undefined): string {
  if (v === null || v === undefined) return NEUTRAL;
  return v >= 50 ? OK : BAD;
}

function moveColor(v: number | null | undefined): string {
  if (v === null || v === undefined) return NEUTRAL;
  if (v > 0) return OK;
  if (v < 0) return BAD;
  return NEUTRAL;
}

/** Sub-cent ASX stocks need more decimals than blue chips to say anything. */
function price(v: number | null): string {
  if (v === null) return '—';
  if (v < 0.1) return `$${v.toFixed(4)}`;
  if (v < 10) return `$${v.toFixed(3)}`;
  return `$${v.toFixed(2)}`;
}

/** Horizontal stacked bar: correct | wrong | no move, as a share of all scored.
 *  Segments carry their own counts, so the split survives a colourblind reader. */
function BreakdownBar({ stat }: { stat: SentimentStat }) {
  const total = stat.correct + stat.wrong + stat.flat;
  const segments = [
    { n: stat.correct, color: OK, label: 'correct' },
    { n: stat.wrong, color: BAD, label: 'wrong' },
    { n: stat.flat, color: NEUTRAL, label: 'no real move' },
  ].filter(s => s.n > 0);

  if (!total) {
    return <div className="h-2 rounded-full" style={{ background: 'var(--border-subtle)' }} />;
  }

  return (
    // gap-[2px] is the surface showing through — segments are separated by a gap,
    // never by a drawn border.
    <div className="flex gap-[2px] h-2">
      {segments.map(s => (
        <div key={s.label}
          title={`${s.n} ${s.label}`}
          style={{
            width: `${(s.n / total) * 100}%`,
            background: s.color,
            borderRadius: 4,
            opacity: s.label === 'no real move' ? 0.55 : 1,
          }} />
      ))}
    </div>
  );
}

function SentimentBlock({ label, glyph, stat }: {
  label: string; glyph: string; stat: SentimentStat;
}) {
  const decided = stat.correct + stat.wrong;
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[0.72rem] font-bold tracking-wide" style={{ color: 'var(--text-primary)' }}>
          {glyph} {label}
        </span>
        <span className="font-mono text-[0.95rem] font-bold" style={{ color: rateColor(stat.hit_rate) }}>
          {rate(stat.hit_rate)}
        </span>
      </div>

      <BreakdownBar stat={stat} />

      <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[0.66rem]" style={{ color: 'var(--text-dim)' }}>
        <span style={{ color: OK }}>✓ {stat.correct} correct</span>
        <span style={{ color: BAD }}>✗ {stat.wrong} wrong</span>
        <span>~ {stat.flat} no move</span>
        <span className="ml-auto">
          avg{' '}
          <b style={{ color: moveColor(stat.avg_abnormal_pct) }}>{pct(stat.avg_abnormal_pct, 2)}</b>
          {' '}vs index
        </span>
      </div>

      {decided === 0 && (
        <span className="text-[0.66rem]" style={{ color: 'var(--text-dim)' }}>
          Nothing moved far enough to score.
        </span>
      )}
    </div>
  );
}

function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const map: Record<Verdict, { text: string; color: string }> = {
    correct: { text: '✓ Correct', color: OK },
    wrong: { text: '✗ Wrong', color: BAD },
    flat: { text: '~ No move', color: NEUTRAL },
    pending: { text: '⋯ Pending', color: 'var(--accent)' },
    no_data: { text: '– No price', color: NEUTRAL },
  };
  const { text, color } = map[verdict];
  return (
    <span className="font-mono text-[0.64rem] font-bold px-2 py-1 rounded-lg whitespace-nowrap inline-block"
      style={{
        color,
        background: `color-mix(in srgb, ${color}, transparent 90%)`,
        border: `1px solid color-mix(in srgb, ${color}, transparent 78%)`,
      }}>
      {text}
    </span>
  );
}

/** Plain-English recap for a social post — no chart, no jargon, ready to paste. */
function postSummary(card: Scorecard, summary: ScorecardSummary | null): string {
  const s = card.stats;
  const best = card.highlights.best_calls[0];
  const lines = [
    `Vitti ASX Intelligence — prediction scorecard for ${card.date}`,
    '',
    `Our AI read every ASX announcement that day and called each one bullish, bearish or neutral. Here is how those calls actually landed against the closing price, measured net of the ${card.benchmark}:`,
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
    const d = summary.days_scored;
    lines.push('', `Running total: ${rate(summary.directional_hit_rate)} across ${summary.directional_scored} calls over ${d} trading ${d === 1 ? 'day' : 'days'}.`);
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
    const directional = card.results.filter(r => r.sentiment !== 'neutral');
    const picked = filter === 'all' ? directional : directional.filter(r => r.verdict === filter);
    // Biggest moves first — those are the calls worth arguing about.
    return [...picked].sort((a, b) => Math.abs(b.abnormal_pct ?? 0) - Math.abs(a.abnormal_pct ?? 0));
  }, [card, filter]);

  async function copySummary() {
    if (!card) return;
    await navigator.clipboard.writeText(postSummary(card, summary));
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
          <h3 className="text-[1rem] font-bold" style={{ color: 'var(--text-primary)' }}>Loading Scorecard</h3>
          <p className="text-[0.8rem] mt-1" style={{ color: 'var(--text-dim)' }}>
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
          style={{ background: 'var(--accent-dim)', border: '1px solid var(--border-accent)' }}>
          <h3 className="text-[1rem] font-bold mb-2" style={{ color: 'var(--accent-light)' }}>
            No Scorecard Yet
          </h3>
          <p className="text-[0.85rem] leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
            {error ?? `Nothing scored for ${date}.`} The scorecard is written after the ASX
            close, so a day&apos;s calls stay unscored until the closing prices are in.
          </p>
          <button onClick={onRetry}
            className="px-5 py-2.5 rounded-xl text-white text-[0.8rem] font-bold tracking-wide transition-all duration-150 hover:-translate-y-0.5"
            style={{ background: 'var(--accent)', boxShadow: '0 4px 20px rgba(99,102,241,0.35)' }}>
            Check Again
          </button>
        </div>
      </div>
    );
  }

  const s = card.stats;
  const bull = s.by_sentiment.bullish;
  const bear = s.by_sentiment.bearish;
  const correct = bull.correct + bear.correct;
  const wrong = bull.wrong + bear.wrong;
  // Every directional call of the day, including the ones that never moved enough
  // to grade. Counted off the rows rather than the stat blocks, because those
  // count neutral announcements in `no_data` and `conflicts` too.
  const called = card.results.filter(r => r.sentiment !== 'neutral').length;

  return (
    <div className="max-w-[1400px] mx-auto animate-fade-in-up pb-4">

      <ViewHeader
        title="Prediction Accuracy"
        subtitle={<>
          Every bullish and bearish call from {formatDateLabel(card.date)}, checked against that
          day&apos;s closing price and measured net of the {card.benchmark}. Moves under{' '}
          {card.threshold_pct}% are treated as market noise, not a result.
        </>}
        actions={<>
          <button onClick={copySummary}
            className="px-4 py-2.5 rounded-xl text-[0.75rem] font-semibold transition-all duration-150 hover:-translate-y-0.5"
            style={{ background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', color: 'var(--accent-light)' }}>
            {copied ? '✓ Copied' : 'Copy post summary'}
          </button>
          <button onClick={downloadCsv}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[0.75rem] font-semibold transition-all duration-150 hover:-translate-y-0.5"
            style={{ background: 'var(--border-subtle)', border: '1px solid var(--border-med)', color: 'var(--text-secondary)' }}>
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
              <path d="M8 2v8M5 7l3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Export CSV
          </button>
        </>}
      />

      {/* ── Hero + breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(240px,0.85fr)_1.6fr] gap-4 mb-4">

        {/* The one number the tab exists to answer. */}
        <div className="rounded-2xl p-6 flex flex-col justify-center"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}>
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--text-dim)' }}>
            Hit rate
          </span>
          <span className="font-mono text-[3.2rem] font-bold leading-[1.05] mt-1 mb-3"
            style={{ color: rateColor(s.directional_hit_rate) }}>
            {rate(s.directional_hit_rate)}
          </span>
          <div className="flex gap-[2px] h-2 mb-3">
            {correct > 0 && (
              <div title={`${correct} correct`}
                style={{ width: `${(correct / (correct + wrong)) * 100}%`, background: OK, borderRadius: 4 }} />
            )}
            {wrong > 0 && (
              <div title={`${wrong} wrong`}
                style={{ width: `${(wrong / (correct + wrong)) * 100}%`, background: BAD, borderRadius: 4 }} />
            )}
          </div>
          <span className="font-mono text-[0.7rem]" style={{ color: 'var(--text-dim)' }}>
            <b style={{ color: OK }}>✓ {correct} right</b>
            {'  ·  '}
            <b style={{ color: BAD }}>✗ {wrong} wrong</b>
          </span>
          <span className="text-[0.66rem] mt-2 leading-snug" style={{ color: 'var(--text-dim)' }}>
            From {called} directional calls that day — the rest never moved past the{' '}
            {card.threshold_pct}% threshold, or had no tradable price.
          </span>
        </div>

        {/* Where the accuracy actually comes from. */}
        <div className="rounded-2xl p-6 flex flex-col gap-6"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}>
          <SentimentBlock label="BULLISH CALLS" glyph="▲" stat={bull} />
          <div style={{ height: 1, background: 'var(--border-subtle)' }} />
          <SentimentBlock label="BEARISH CALLS" glyph="▼" stat={bear} />
        </div>
      </div>

      {/* ── Spread + running total ── */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-4 mb-6">
        <div className="rounded-2xl p-5"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--text-dim)' }}>
            Bull − Bear spread
          </span>
          <div className="font-mono text-[1.7rem] font-bold leading-tight mt-1"
            style={{ color: moveColor(s.spread_pct) }}>
            {pct(s.spread_pct, 2)}
          </div>
          <p className="text-[0.66rem] mt-1.5 leading-snug" style={{ color: 'var(--text-dim)' }}>
            How far bullish picks beat bearish ones. A negative number means the
            labels are the wrong way round.
          </p>
        </div>

        <div className="rounded-2xl p-5 flex flex-col justify-center"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] mb-2.5" style={{ color: 'var(--text-dim)' }}>
            Track record
          </span>
          {summary && summary.directional_scored > 0 ? (
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <div>
                <div className="font-mono text-[1.25rem] font-bold leading-none"
                  style={{ color: rateColor(summary.directional_hit_rate) }}>
                  {rate(summary.directional_hit_rate)}
                </div>
                <div className="text-[0.63rem] mt-1.5" style={{ color: 'var(--text-dim)' }}>
                  across {summary.directional_scored} calls
                </div>
              </div>
              <div>
                <div className="font-mono text-[1.25rem] font-bold leading-none"
                  style={{ color: moveColor(summary.spread_pct) }}>
                  {pct(summary.spread_pct, 2)}
                </div>
                <div className="text-[0.63rem] mt-1.5" style={{ color: 'var(--text-dim)' }}>spread</div>
              </div>
              <div>
                <div className="font-mono text-[1.25rem] font-bold leading-none" style={{ color: 'var(--text-secondary)' }}>
                  {pct(summary.by_sentiment.neutral.avg_abnormal_pct, 2)}
                </div>
                <div className="text-[0.63rem] mt-1.5" style={{ color: 'var(--text-dim)' }}>
                  neutral control
                </div>
              </div>
              <div>
                <div className="font-mono text-[1.25rem] font-bold leading-none" style={{ color: 'var(--text-secondary)' }}>
                  {summary.days_scored}
                </div>
                <div className="text-[0.63rem] mt-1.5" style={{ color: 'var(--text-dim)' }}>
                  trading {summary.days_scored === 1 ? 'day' : 'days'}
                </div>
              </div>
            </div>
          ) : (
            <span className="text-[0.75rem]" style={{ color: 'var(--text-dim)' }}>
              Builds up one trading day at a time.
            </span>
          )}
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {VERDICT_FILTERS.map(f => {
          const active = filter === f.key;
          return (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className="px-3.5 py-1.5 rounded-xl text-[0.72rem] font-semibold transition-all duration-150"
              style={{
                background: active ? 'var(--accent-dim)' : 'var(--border-subtle)',
                border: `1px solid ${active ? 'var(--border-accent)' : 'var(--border-med)'}`,
                color: active ? 'var(--accent-light)' : 'var(--text-dim)',
              }}>
              {f.label}
            </button>
          );
        })}
        <span className="ml-auto font-mono text-[0.68rem]" style={{ color: 'var(--text-dim)' }}>
          {rows.length} shown
          {s.conflicts > 0 && ` · ${s.conflicts} excluded`}
          {s.pending > 0 && ` · ${s.pending} pending`}
        </span>
      </div>

      {/* ── Call-by-call ── */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left border-collapse">
            <thead>
              <tr style={{ background: 'var(--border-subtle)' }}>
                <th className="px-4 py-3 text-[0.62rem] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--text-dim)' }}>Ticker</th>
                <th className="px-4 py-3 text-[0.62rem] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--text-dim)' }}>Announcement</th>
                <th className="px-4 py-3 text-[0.62rem] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--text-dim)' }}>Our call</th>
                {['Close', 'Move', 'Net of index'].map(h => (
                  <th key={h} className="px-4 py-3 text-right text-[0.62rem] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--text-dim)' }}>{h}</th>
                ))}
                <th className="px-4 py-3 text-[0.62rem] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--text-dim)' }}>Verdict</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                // A ticker can lodge several announcements in a day; they all
                // resolve to the same close, so repeating the code down the
                // column just reads like duplicated rows.
                const repeat = i > 0 && rows[i - 1].ticker === r.ticker;
                return (
                  <tr key={r.url + i}
                    className="transition-colors duration-100 hover:bg-[var(--bg-card-hover)]"
                    style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <td className="px-4 py-3 align-top">
                      {!repeat && (
                        <span className="font-mono text-[0.8rem] font-bold" style={{ color: 'var(--text-primary)' }}>
                          {r.ticker}
                        </span>
                      )}
                      {r.conflict && !repeat && (
                        <span className="block text-[0.58rem] mt-1" style={{ color: 'var(--text-dim)' }}>
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
                      {!repeat && (
                        <span className="block text-[0.6rem] mt-1 truncate" style={{ color: 'var(--text-dim)' }}>
                          {r.company}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span className="font-mono text-[0.68rem] font-bold whitespace-nowrap"
                        style={{ color: r.sentiment === 'bullish' ? OK : BAD }}>
                        {r.sentiment === 'bullish' ? '▲ BULL' : '▼ BEAR'}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top text-right font-mono text-[0.74rem] tabular-nums"
                      style={{ color: 'var(--text-secondary)' }}>
                      {price(r.close)}
                    </td>
                    <td className="px-4 py-3 align-top text-right font-mono text-[0.76rem] tabular-nums"
                      style={{ color: 'var(--text-secondary)' }}>
                      {pct(r.return_pct, 2)}
                    </td>
                    <td className="px-4 py-3 align-top text-right font-mono text-[0.78rem] font-bold tabular-nums"
                      style={{ color: moveColor(r.abnormal_pct) }}>
                      {pct(r.abnormal_pct, 2)}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <VerdictBadge verdict={r.verdict} />
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-[0.8rem]" style={{ color: 'var(--text-dim)' }}>
                    No calls in this bucket for {formatDateLabel(card.date)}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[0.65rem] mt-3.5 leading-relaxed max-w-[92ch]" style={{ color: 'var(--text-dim)' }}>
        Prices from Yahoo Finance end-of-day. News released after the 4pm close is judged on the
        next session. A ticker carrying both a bullish and a bearish call on the same day cannot
        be settled by one closing price, so it is excluded from the hit rate rather than guessed at.
      </p>
    </div>
  );
}
