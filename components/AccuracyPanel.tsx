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

type Direction = 'all' | 'bullish' | 'bearish';

const DIRECTION_FILTERS: { key: Direction; label: string }[] = [
  { key: 'all', label: 'Both' },
  { key: 'bullish', label: '▲ Bullish' },
  { key: 'bearish', label: '▼ Bearish' },
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
    // One continuous track, rounded at the two outer ends only. The segments
    // used to be separate pills with a 2px gap between them, which read as a
    // bar that had failed to render rather than as a split of one total.
    <div className="flex h-2 rounded-full overflow-hidden"
      style={{ background: 'var(--border-subtle)' }}>
      {segments.map(s => (
        <div key={s.label}
          title={`${s.n} ${s.label}`}
          style={{
            width: `${(s.n / total) * 100}%`,
            background: s.color,
            opacity: s.label === 'no real move' ? 0.55 : 1,
          }} />
      ))}
    </div>
  );
}

/** One sentiment on one line: rate, split, counts, average. The three-line
 *  stacked version of this said the same thing over triple the height, which is
 *  where most of the tab's empty space was coming from. */
function SentimentRow({ label, glyph, stat }: {
  label: string; glyph: string; stat: SentimentStat;
}) {
  const decided = stat.correct + stat.wrong;
  return (
    <div className="flex items-center gap-3">
      <span className="text-[0.7rem] font-bold w-[4.7rem] flex-shrink-0" style={{ color: 'var(--text-primary)' }}>
        {glyph} {label}
      </span>
      <span className="font-mono text-[0.85rem] font-bold w-[3.2rem] flex-shrink-0 tabular-nums"
        style={{ color: decided ? rateColor(stat.hit_rate) : NEUTRAL }}>
        {decided ? rate(stat.hit_rate) : '—'}
      </span>
      <div className="flex-1 min-w-[60px]">
        <BreakdownBar stat={stat} />
      </div>
      <span className="font-mono text-[0.65rem] whitespace-nowrap tabular-nums" style={{ color: 'var(--text-dim)' }}>
        <b style={{ color: OK }}>{stat.correct}</b>
        {' / '}
        <b style={{ color: BAD }}>{stat.wrong}</b>
        {' / '}
        {stat.flat}
      </span>
      <span className="font-mono text-[0.65rem] w-[4.4rem] text-right flex-shrink-0 tabular-nums"
        title="Average move net of the index across every call with this label"
        style={{ color: moveColor(stat.avg_abnormal_pct) }}>
        {pct(stat.avg_abnormal_pct, 2)}
      </span>
    </div>
  );
}

/** A number with its name under it. Used wherever a figure is self-explanatory
 *  once labelled — the sentence that used to sit beside each one is a `title`
 *  now, so the panel reads as a terminal rather than an article. */
function Stat({ label, value, color, hint }: {
  label: string; value: string; color?: string; hint?: string;
}) {
  return (
    <div title={hint}>
      <div className="font-mono text-[1.15rem] font-bold leading-none tabular-nums"
        style={{ color: color ?? 'var(--text-secondary)' }}>
        {value}
      </div>
      <div className="text-[0.6rem] mt-1.5 uppercase tracking-[0.08em]" style={{ color: 'var(--text-dim)' }}>
        {label}
      </div>
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
  const [direction, setDirection] = useState<Direction>('all');

  const rows = useMemo<ScoredCall[]>(() => {
    if (!card) return [];
    let picked = card.results.filter(r => r.sentiment !== 'neutral');
    if (direction !== 'all') picked = picked.filter(r => r.sentiment === direction);
    if (filter !== 'all') picked = picked.filter(r => r.verdict === filter);
    // Biggest moves first — those are the calls worth arguing about.
    return [...picked].sort((a, b) => Math.abs(b.abnormal_pct ?? 0) - Math.abs(a.abnormal_pct ?? 0));
  }, [card, filter, direction]);

  /**
   * The Net column, added up over whatever is on screen.
   *
   * Two things it is deliberately NOT. It is not a return: these are one-day
   * moves on notional equal positions, with no sizing, no entry price and no
   * costs in them. And it is not signed by whether the call was right — a
   * bearish call that came good contributes a negative number, which is why the
   * "as called" figure below flips the sign on bearish rows and is the only one
   * of the two worth reading when both directions are shown at once.
   */
  const totals = useMemo(() => {
    const priced = rows.filter(r => r.abnormal_pct !== null);
    const sum = priced.reduce((t, r) => t + (r.abnormal_pct as number), 0);
    const asCalled = priced.reduce(
      (t, r) => t + (r.sentiment === 'bearish' ? -(r.abnormal_pct as number) : r.abnormal_pct as number), 0);
    return {
      sum,
      asCalled,
      n: priced.length,
      avg: priced.length ? sum / priced.length : null,
      unpriced: rows.length - priced.length,
    };
  }, [rows]);

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
          Every bullish and bearish call from {formatDateLabel(card.date)}, against that day&apos;s
          close and net of the {card.benchmark}. Moves under {card.threshold_pct}% are noise, not a result.
        </>}
        actions={
          <button onClick={downloadCsv}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[0.75rem] font-semibold transition-all duration-150 hover:-translate-y-0.5"
            style={{ background: 'var(--border-subtle)', border: '1px solid var(--border-med)', color: 'var(--text-secondary)' }}>
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
              <path d="M8 2v8M5 7l3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Export CSV
          </button>
        }
      />

      {/* ── One band: this session on the left, the running record on the right ──
          Four cards of prose became two columns of figures. Every sentence that
          used to sit under a number is a tooltip on it now; the numbers are what
          this tab is for, and they were the smallest thing on it. */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.45fr_1fr] gap-3 mb-4">

        <div className="rounded-2xl px-5 py-4"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}>
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="text-[0.6rem] font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--text-dim)' }}>
              This session
            </span>
            <span className="font-mono text-[0.63rem]" style={{ color: 'var(--text-dim)' }}
              title={`The rest of the day never moved past the ${card.threshold_pct}% threshold, or had no tradable price.`}>
              {called} directional calls
            </span>
          </div>

          <div className="flex items-center gap-5 mb-4">
            <div className="flex items-baseline gap-2.5">
              <span className="font-mono text-[2.5rem] font-bold leading-none tabular-nums"
                style={{ color: rateColor(s.directional_hit_rate) }}>
                {rate(s.directional_hit_rate)}
              </span>
              <span className="font-mono text-[0.68rem] whitespace-nowrap" style={{ color: 'var(--text-dim)' }}>
                <b style={{ color: OK }}>✓{correct}</b> <b style={{ color: BAD }}>✗{wrong}</b>
              </span>
            </div>
            <div className="flex-1 flex h-2 rounded-full overflow-hidden"
              style={{ background: 'var(--border-subtle)' }}>
              {correct > 0 && (
                <div title={`${correct} correct`}
                  style={{ width: `${(correct / (correct + wrong)) * 100}%`, background: OK }} />
              )}
              {wrong > 0 && (
                <div title={`${wrong} wrong`}
                  style={{ width: `${(wrong / (correct + wrong)) * 100}%`, background: BAD }} />
              )}
            </div>
            <Stat label="Bull − bear" value={pct(s.spread_pct, 2)} color={moveColor(s.spread_pct)}
              hint="How far bullish picks beat bearish ones. Negative means the labels are the wrong way round." />
          </div>

          <div className="flex flex-col gap-2.5 pt-3.5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <SentimentRow label="Bullish" glyph="▲" stat={bull} />
            <SentimentRow label="Bearish" glyph="▼" stat={bear} />
            <span className="font-mono text-[0.58rem] text-right" style={{ color: 'var(--text-dim)' }}>
              right / wrong / no move &nbsp;·&nbsp; avg vs index
            </span>
          </div>
        </div>

        <div className="rounded-2xl px-5 py-4 flex flex-col"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}>
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="text-[0.6rem] font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--text-dim)' }}>
              Track record
            </span>
            {summary && summary.days_scored > 0 && (
              <span className="font-mono text-[0.63rem]" style={{ color: 'var(--text-dim)' }}>
                {summary.days_scored} trading {summary.days_scored === 1 ? 'day' : 'days'}
              </span>
            )}
          </div>

          {summary && summary.directional_scored > 0 ? (
            <div className="grid grid-cols-2 gap-x-5 gap-y-4 flex-1 content-center">
              <Stat label={`across ${summary.directional_scored} calls`}
                value={rate(summary.directional_hit_rate)}
                color={rateColor(summary.directional_hit_rate)} />
              <Stat label="spread" value={pct(summary.spread_pct, 2)}
                color={moveColor(summary.spread_pct)}
                hint="Bullish picks minus bearish ones, all time. The real test — a high hit rate with no spread is not an edge." />
              <Stat label="neutral control"
                value={pct(summary.by_sentiment.neutral.avg_abnormal_pct, 2)}
                hint="Average move of the announcements called neutral. Bullish picks have to beat this, not zero, to mean anything." />
              <Stat label="bullish all time" value={rate(summary.by_sentiment.bullish.hit_rate)}
                color={rateColor(summary.by_sentiment.bullish.hit_rate)} />
            </div>
          ) : (
            <span className="text-[0.75rem] my-auto" style={{ color: 'var(--text-dim)' }}>
              Builds up one trading day at a time.
            </span>
          )}
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap items-center gap-2 mb-2.5">
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

        {/* Direction sits in its own group, tinted to the sentiment it picks,
            because it stacks WITH the verdict filters rather than replacing
            them — "bullish" and "wrong" together is the useful combination. */}
        <span className="mx-1 self-stretch w-px" style={{ background: 'var(--border-med)' }} />
        {DIRECTION_FILTERS.map(f => {
          const active = direction === f.key;
          const tint = f.key === 'bullish' ? OK : f.key === 'bearish' ? BAD : 'var(--accent)';
          return (
            <button key={f.key} onClick={() => setDirection(f.key)}
              className="px-3.5 py-1.5 rounded-xl text-[0.72rem] font-semibold transition-all duration-150"
              style={{
                background: active ? `color-mix(in srgb, ${tint}, transparent 88%)` : 'var(--border-subtle)',
                border: `1px solid ${active ? `color-mix(in srgb, ${tint}, transparent 70%)` : 'var(--border-med)'}`,
                color: active ? tint : 'var(--text-dim)',
              }}>
              {f.label}
            </button>
          );
        })}

        {/* The totals ride on the filter row rather than in a band of their own:
            they describe the selection, and a separate strip put a whole card's
            worth of chrome around two numbers. The "not a return" caveat moved
            to the method note at the foot, where the other caveats already live. */}
        <span className="ml-auto flex items-baseline gap-x-4 font-mono text-[0.68rem] whitespace-nowrap"
          style={{ color: 'var(--text-dim)' }}>
          <span>
            {rows.length} shown
            {s.conflicts > 0 && ` · ${s.conflicts} excluded`}
            {s.pending > 0 && ` · ${s.pending} pending`}
          </span>
          <span title={`Sum of the Net column over the ${totals.n} shown calls that have a price.`
            + (totals.unpriced > 0 ? ` ${totals.unpriced} without one are left out.` : '')}>
            Σ net{' '}
            <b className="text-[0.82rem] tabular-nums" style={{ color: moveColor(totals.n ? totals.sum : null) }}>
              {totals.n ? pct(totals.sum, 2) : '—'}
            </b>
          </span>
          <span title="That sum divided by the number of calls behind it.">
            avg{' '}
            <b className="tabular-nums" style={{ color: moveColor(totals.avg) }}>
              {totals.n ? pct(totals.avg, 2) : '—'}
            </b>
          </span>
          {/* Only when both directions are on screen. Filtered to one of them the
              sign already means the same thing for every row, and a second
              near-identical number would just invite the wrong one to be read. */}
          {direction === 'all' && (
            <span title="Bearish rows sign-flipped, so a correct call of either kind adds to the total.">
              as called{' '}
              <b className="tabular-nums" style={{ color: moveColor(totals.n ? totals.asCalled : null) }}>
                {totals.n ? pct(totals.asCalled, 2) : '—'}
              </b>
            </span>
          )}
        </span>
      </div>

      {/* ── Call-by-call ── */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] text-left border-collapse">
            <thead>
              <tr style={{ background: 'var(--border-subtle)' }}>
                <th className="px-4 py-3 text-[0.62rem] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--text-dim)' }}>Ticker</th>
                <th className="px-4 py-3 text-[0.62rem] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--text-dim)' }}>Announcement</th>
                <th className="px-4 py-3 text-[0.62rem] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--text-dim)' }}>Our call</th>
                {/* Every step of the verdict, left to right, so the arithmetic
                    can be checked against Yahoo without opening the CSV. */}
                {['Prev close', 'Close', 'Stock', 'Market', 'Net'].map(h => (
                  <th key={h} className="px-4 py-3 text-right text-[0.62rem] font-bold uppercase tracking-[0.1em] whitespace-nowrap"
                    style={{ color: 'var(--text-dim)' }}>{h}</th>
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
                    <td className="px-4 py-3 align-top max-w-[340px]">
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
                      style={{ color: 'var(--text-dim)' }}>
                      {price(r.prev_close)}
                    </td>
                    <td className="px-4 py-3 align-top text-right font-mono text-[0.74rem] tabular-nums"
                      style={{ color: 'var(--text-secondary)' }}>
                      {price(r.close)}
                    </td>
                    <td className="px-4 py-3 align-top text-right font-mono text-[0.76rem] tabular-nums"
                      style={{ color: 'var(--text-secondary)' }}>
                      {pct(r.return_pct, 2)}
                    </td>
                    {/* The index is identical for every row of a session, but
                        repeated so each row can be verified on its own. */}
                    <td className="px-4 py-3 align-top text-right font-mono text-[0.74rem] tabular-nums"
                      style={{ color: 'var(--text-dim)' }}>
                      {pct(r.index_return_pct, 2)}
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
                  <td colSpan={9} className="px-4 py-12 text-center text-[0.8rem]" style={{ color: 'var(--text-dim)' }}>
                    No calls in this bucket for {formatDateLabel(card.date)}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[0.63rem] mt-3 leading-relaxed max-w-[104ch]" style={{ color: 'var(--text-dim)' }}>
        <b style={{ color: 'var(--text-secondary)' }}>Net = Stock − Market</b>, and the verdict is that
        figure: past ±{card.threshold_pct}% the way we called it is correct, past it the other way is
        wrong, inside it scores neither. Yahoo Finance end-of-day prices; news after the 4pm close is
        judged on the next session; a ticker carrying both a bullish and a bearish call the same day is
        excluded rather than guessed at. <b style={{ color: 'var(--text-secondary)' }}>Σ net is not a
        return</b> — percentage points added up across notional equal positions, with no sizing, entry
        or costs in it.
      </p>
    </div>
  );
}
