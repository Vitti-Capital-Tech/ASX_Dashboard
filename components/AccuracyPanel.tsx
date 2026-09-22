'use client';

import { useMemo, useState } from 'react';
import type {
  Announcement, Scorecard, ScorecardSummary, ScoredCall, Verdict,
} from '@/types';
import { formatDateLabel, formatTime, getSentiment } from '@/lib/utils';
import ViewHeader from './ViewHeader';

const VERDICT_FILTERS: { key: Verdict | 'all'; label: string }[] = [
  { key: 'all', label: 'All calls' },
  { key: 'correct', label: 'Correct' },
  { key: 'wrong', label: 'Wrong' },
  { key: 'flat', label: 'No real move' },
  { key: 'no_data', label: 'No price' },
];

type Direction = 'all' | 'bullish' | 'bearish';

/**
 * Which move settles a call.
 *
 * `gap` is the original measure: previous close to close, net of the index. It
 * grades the AI's forecast — did the news move the stock at all.
 *
 * `intraday` grades the move from the OPEN, raw. It answers a different
 * question: of that move, how much could someone who read the news pre-market
 * actually have taken? They cannot act until the open, so the overnight gap is
 * observable but not capturable.
 *
 * On this data the two disagree sharply, which is the point of being able to
 * switch: across 502 directional calls the gap-inclusive average was +1.22%
 * and the intraday average −0.08%. Nearly all of the measured edge is gone
 * before the bell.
 */
type Basis = 'gap' | 'intraday';

/** Which table the tab is showing. One at a time — see the control's comment. */
type PanelView = 'calls' | 'today' | 'breakdowns';

const BASIS: Record<Basis, {
  label: string; blurb: string;
  verdictOf: (r: ScoredCall) => Verdict | undefined;
  moveOf: (r: ScoredCall) => number | null | undefined;
  moveLabel: string;
}> = {
  gap: {
    label: 'Gap-inclusive',
    blurb: 'Previous close → close, net of the index. Grades whether the call was right.',
    verdictOf: r => r.verdict,
    moveOf: r => r.abnormal_pct,
    moveLabel: 'Net of index',
  },
  intraday: {
    label: 'Intraday',
    blurb: 'Open → close, raw. Grades what was left to trade once the market opened.',
    verdictOf: r => r.intraday_verdict,
    moveOf: r => r.open_close_pct,
    moveLabel: 'Open→Close',
  },
};

/** Below this a one-tick move is a double-digit percentage and the spread is
 *  the whole trade. Excluded by default — these are not tradeable results,
 *  they are quantisation noise sitting in the averages. */
const MIN_PRICE = 0.01;

/** ASX large-cap line. Above it an announcement rarely moves the stock enough
 *  to trade, and the sample is dominated by small caps, so the average is
 *  flattered or dragged by names nobody here is trading intraday. */
const LARGE_CAP_AUD = 2e9;

/** Recompute every published figure from whatever rows are on screen.
 *
 *  Deliberately not the precomputed `stats` block: the filters below change
 *  which calls count, and a headline hit rate that ignores the filter under it
 *  is worse than no headline at all. */
/** Gap buckets, signed by whether the gap went the way the call did.
 *
 *  Unsigned buckets would put a bullish call that gapped +6% and a bearish one
 *  that gapped −6% in different rows while they are the same event: the market
 *  agreed, hard, before the open. "As called" makes the question askable —
 *  when the market has already moved your way at the open, does it keep going
 *  or give it back? */
const GAP_BUCKETS: { key: string; label: string; test: (g: number) => boolean }[] = [
  { key: 'against', label: 'Gapped against the call', test: g => g < -1 },
  { key: 'flat', label: 'Opened flat (±1%)', test: g => g >= -1 && g <= 1 },
  { key: 'with_small', label: 'Gapped with it, 1–5%', test: g => g > 1 && g <= 5 },
  { key: 'with_big', label: 'Gapped with it, 5–15%', test: g => g > 5 && g <= 15 },
  { key: 'with_huge', label: 'Gapped with it, 15%+', test: g => g > 15 },
];

/** The gap in the direction of the call, so bullish and bearish are comparable. */
function gapAsCalled(r: ScoredCall): number | null {
  const g = r.gap_pct;
  if (g === null || g === undefined) return null;
  return r.sentiment === 'bearish' ? -g : g;
}

function statsFor(rows: ScoredCall[], basis: Basis) {
  const b = BASIS[basis];
  const graded = rows.filter(r => {
    const v = b.verdictOf(r);
    return !r.conflict && v !== undefined && v !== 'no_data' && v !== 'pending'
      && b.moveOf(r) !== null && b.moveOf(r) !== undefined;
  });

  const dir = graded.filter(r => r.sentiment !== 'neutral');
  const correct = dir.filter(r => b.verdictOf(r) === 'correct').length;
  const wrong = dir.filter(r => b.verdictOf(r) === 'wrong').length;
  const flat = dir.filter(r => b.verdictOf(r) === 'flat').length;
  const decided = correct + wrong;

  const moves = dir.map(r => b.moveOf(r) as number);
  // Signed by whether the call was right, so a bearish call that came good
  // counts as a win rather than a negative number dragging the average down.
  const asCalled = dir.map(r =>
    r.sentiment === 'bearish' ? -(b.moveOf(r) as number) : b.moveOf(r) as number);
  const mean = (xs: number[]) => xs.length ? xs.reduce((t, x) => t + x, 0) / xs.length : null;

  return {
    graded: graded.length,
    directional: dir.length,
    correct, wrong, flat, decided,
    hitRate: decided ? (correct / decided) * 100 : null,
    avgMove: mean(moves),
    avgAsCalled: mean(asCalled),
    // What a flat-sized position in every call would have returned, gross.
    totalAsCalled: asCalled.reduce((t, x) => t + x, 0),
  };
}

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
function price(v: number | null | undefined): string {
  // `undefined`, not just null: scorecards written before a column existed
  // simply lack the key, and `undefined.toFixed()` would take the panel down.
  if (v === null || v === undefined) return '—';
  if (v < 0.1) return `$${v.toFixed(4)}`;
  if (v < 10) return `$${v.toFixed(3)}`;
  return `$${v.toFixed(2)}`;
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

/** One breakdown table: rows of a segment, each graded on the chosen basis. */
function Breakdown({ title, blurb, groups, basis, moveLabel }: {
  title: string;
  blurb: string;
  groups: { label: string; rows: ScoredCall[] }[];
  basis: Basis;
  moveLabel: string;
}) {
  const scored = groups
    .map(g => ({ label: g.label, s: statsFor(g.rows, basis) }))
    // A segment with one or two calls in it is an anecdote. Shown, but the
    // count sits beside every figure so nobody reads 100% off a sample of 1.
    .filter(g => g.s.directional > 0);

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
      <div className="px-5 pt-4 pb-3">
        <h3 className="text-[0.82rem] font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
        <p className="text-[0.68rem] mt-1 leading-relaxed" style={{ color: 'var(--text-dim)' }}>{blurb}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left border-collapse">
          <thead>
            <tr style={{ background: 'var(--border-subtle)' }}>
              {['', 'Calls', 'Hit rate', `Avg ${moveLabel.toLowerCase()} as called`].map((h, i) => (
                <th key={h + i}
                  className={`px-4 py-2.5 text-[0.6rem] font-bold uppercase tracking-[0.1em] whitespace-nowrap ${i ? 'text-right' : ''}`}
                  style={{ color: 'var(--text-dim)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scored.map(g => (
              <tr key={g.label} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <td className="px-4 py-2.5 text-[0.76rem]" style={{ color: 'var(--text-primary)' }}>
                  {g.label}
                </td>
                <td className="px-4 py-2.5 text-right font-mono text-[0.74rem] tabular-nums"
                  style={{ color: 'var(--text-dim)' }}>
                  {g.s.decided}
                </td>
                <td className="px-4 py-2.5 text-right font-mono text-[0.76rem] font-bold tabular-nums"
                  style={{ color: g.s.decided >= 5 ? rateColor(g.s.hitRate) : 'var(--text-dim)' }}
                  title={g.s.decided < 5 ? 'Fewer than 5 settled calls — treat as anecdote' : undefined}>
                  {rate(g.s.hitRate)}
                </td>
                <td className="px-4 py-2.5 text-right font-mono text-[0.76rem] font-bold tabular-nums"
                  style={{ color: moveColor(g.s.avgAsCalled) }}>
                  {pct(g.s.avgAsCalled, 2)}
                </td>
              </tr>
            ))}
            {scored.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[0.76rem]"
                  style={{ color: 'var(--text-dim)' }}>
                  Nothing to group — no settled calls in view.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * The morning list: today's directional calls, ranked by how the same KIND of
 * announcement has historically behaved after the open.
 *
 * Distinct from every other section here, which grades what already happened.
 * This is the only part of the tab that looks forward, and it is careful about
 * what that means: the history is the only evidence, the sample size sits
 * beside every rate, and nothing on the row is a recommendation. A type that
 * has kept running 8 times out of 11 is a fact about 11 filings, not a signal.
 *
 * Ordered by the historical intraday hit rate because that is the question
 * being asked — of the news that landed today, which kinds still had something
 * left once the market opened.
 */
function Candidates({ rows: anns, summary, date }: {
  /** Already filtered by the caller — same price, size and direction filters
   *  the rest of the tab is under, so the chips above this table apply to it. */
  rows: Announcement[];
  summary: ScorecardSummary | null;
  date: string;
}) {
  const byType = useMemo(() => {
    const m = new Map<string, NonNullable<ScorecardSummary['by_document_type']>[number]>();
    for (const t of summary?.by_document_type ?? []) m.set(t.document_type, t);
    return m;
  }, [summary]);

  const rows = useMemo(() => {
    return anns
      .map(a => ({ ann: a, hist: byType.get((a.document_type || 'Other').trim()) }))
      // Types with no history sink to the bottom rather than being dropped:
      // "we have never scored this kind of filing" is itself worth seeing.
      .sort((x, y) =>
        (y.hist?.intraday_hit_rate ?? -1) - (x.hist?.intraday_hit_rate ?? -1))
      .slice(0, 40);
  }, [anns, byType]);

  return (
    <div className="rounded-2xl overflow-hidden mb-4"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
      <div className="px-5 pt-4 pb-3">
        <h3 className="text-[0.82rem] font-bold" style={{ color: 'var(--text-primary)' }}>
          Today&apos;s candidates — {formatDateLabel(date)}
        </h3>
        <p className="text-[0.68rem] mt-1 leading-relaxed" style={{ color: 'var(--text-dim)' }}>
          Directional calls filed today, ranked by how that <i>kind</i> of announcement has
          behaved after the open historically. The history is evidence, not a signal — the
          sample size sits beside every rate, and none of these has a price outcome yet.
        </p>
      </div>
      {rows.length === 0 && (
        <p className="px-5 pb-5 text-[0.78rem]" style={{ color: 'var(--text-dim)' }}>
          No directional calls on {formatDateLabel(date)} match the current filters.
        </p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left border-collapse">
          <thead>
            <tr style={{ background: 'var(--border-subtle)' }}>
              {['Ticker', 'Call', 'Type', 'Released', 'Intraday hit rate', 'Avg as called',
                'RSI', 'Vol vs 20d', 'Turnover'].map((h, i) => (
                <th key={h}
                  className={`px-3 py-2.5 text-[0.6rem] font-bold uppercase tracking-[0.1em] whitespace-nowrap ${i >= 4 ? 'text-right' : ''}`}
                  style={{ color: 'var(--text-dim)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ ann: a, hist }, i) => {
              const sent = getSentiment(a);
              const c = a.market_context;
              return (
                <tr key={a.url + i} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <td className="px-3 py-2.5 font-mono text-[0.78rem] font-bold"
                    style={{ color: 'var(--text-primary)' }}>{a.ticker}</td>
                  <td className="px-3 py-2.5 font-mono text-[0.68rem] font-bold whitespace-nowrap"
                    style={{ color: sent === 'bullish' ? OK : BAD }}>
                    {sent === 'bullish' ? '▲ BULL' : '▼ BEAR'}
                  </td>
                  <td className="px-3 py-2.5 text-[0.73rem] max-w-[200px] truncate"
                    style={{ color: 'var(--text-secondary)' }} title={a.headline}>
                    {a.document_type || '—'}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[0.7rem]"
                    style={{ color: 'var(--text-dim)' }}>{formatTime(a.time)}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-[0.76rem] font-bold tabular-nums"
                    style={{ color: hist ? rateColor(hist.intraday_hit_rate) : 'var(--text-dim)' }}
                    title={hist ? `${hist.intraday_scored} settled calls of this type` : 'No scored history for this type'}>
                    {hist ? `${rate(hist.intraday_hit_rate)}` : '—'}
                    {hist && (
                      <span className="block text-[0.6rem] font-normal" style={{ color: 'var(--text-dim)' }}>
                        n={hist.intraday_scored}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-[0.74rem] tabular-nums"
                    style={{ color: moveColor(hist?.intraday_avg_as_called) }}>
                    {pct(hist?.intraday_avg_as_called, 2)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-[0.74rem] tabular-nums"
                    style={{ color: 'var(--text-secondary)' }}>
                    {c?.rsi_14 === null || c?.rsi_14 === undefined ? '—' : c.rsi_14.toFixed(0)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-[0.74rem] tabular-nums"
                    style={{ color: moveColor(c?.volume_change_pct) }}>
                    {pct(c?.volume_change_pct, 0)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-[0.74rem] tabular-nums"
                    style={{ color: c?.liquid === false ? BAD : 'var(--text-dim)' }}
                    title={c?.liquid === false ? 'Too thin for the ratios to mean much' : undefined}>
                    {c?.avg_turnover_aud === null || c?.avg_turnover_aud === undefined
                      ? '—' : `$${Math.round(c.avg_turnover_aud / 1000)}k`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AccuracyPanel({
  card, summary, loading, error, date, requestedDate, todaysAnnouncements, onRetry,
}: {
  card: Scorecard | null;
  summary: ScorecardSummary | null;
  loading: boolean;
  error: string | null;
  date: string;
  /** Set when `card` is an EARLIER session than the one picked, because that
   *  day has not been scored yet. Carries the date that was asked for. */
  requestedDate?: string | null;
  /** The selected day's live feed. Distinct from `card`, which is scored and
   *  therefore always at least a session behind. */
  todaysAnnouncements?: Announcement[];
  onRetry: () => void;
}) {
  const [filter, setFilter] = useState<Verdict | 'all'>('all');
  const [direction, setDirection] = useState<Direction>('all');
  const [basis, setBasis] = useState<Basis>('intraday');
  // Both on by default, because both remove rows that are in the averages
  // without being tradeable. Switchable, so the effect of each is visible
  // rather than being a silent adjustment to every number on the tab.
  const [excludeSubCent, setExcludeSubCent] = useState(true);
  const [excludeLargeCaps, setExcludeLargeCaps] = useState(true);
  const [view, setView] = useState<PanelView>('calls');

  const B = BASIS[basis];

  /** Everything the tab counts, before the verdict/direction filters. The
   *  price and size filters belong here so the headline figures, the
   *  breakdowns and the table all describe the same universe. */
  const universe = useMemo<ScoredCall[]>(() => {
    if (!card) return [];
    return card.results.filter(r => {
      if (excludeSubCent) {
        // Judged on the entry price, not the close: a stock that started the
        // session at 0.008 was untradeable when the decision was made, however
        // it finished.
        const p = r.open ?? r.prev_close;
        if (p !== null && p !== undefined && p < MIN_PRICE) return false;
      }
      if (excludeLargeCaps && (r.market_cap_aud ?? 0) > LARGE_CAP_AUD) return false;
      return true;
    });
  }, [card, excludeSubCent, excludeLargeCaps]);

  const rows = useMemo<ScoredCall[]>(() => {
    let picked = universe.filter(r => r.sentiment !== 'neutral');
    if (direction !== 'all') picked = picked.filter(r => r.sentiment === direction);
    if (filter !== 'all') picked = picked.filter(r => B.verdictOf(r) === filter);
    // Biggest moves first — those are the calls worth arguing about.
    return [...picked].sort(
      (a, b) => Math.abs(B.moveOf(b) ?? 0) - Math.abs(B.moveOf(a) ?? 0));
  }, [universe, filter, direction, B]);

  /** The headline card: every figure on the chosen basis, over the filtered
   *  universe, ignoring the verdict/direction filters so it stays a summary of
   *  the day rather than of the current view. */
  const dayStats = useMemo(() => statsFor(universe, basis), [universe, basis]);

  const directional = useMemo(
    () => universe.filter(r => r.sentiment !== 'neutral'), [universe]);

  /** Today's live feed, under the same price/size filters as everything else
   *  and under the direction filter, so the chips above the table apply to
   *  whichever table is showing rather than only to the call-by-call one. */
  const candidateRows = useMemo(() => {
    const feed = todaysAnnouncements ?? [];
    return feed.filter(a => {
      const sent = getSentiment(a);
      if (sent === 'neutral') return false;
      if (direction !== 'all' && sent !== direction) return false;
      const c = a.market_context;
      if (excludeSubCent && c?.last_close !== undefined && c.last_close < MIN_PRICE) return false;
      if (excludeLargeCaps && (c?.market_cap_aud ?? 0) > LARGE_CAP_AUD) return false;
      return true;
    });
  }, [todaysAnnouncements, direction, excludeSubCent, excludeLargeCaps]);

  const todaysDirectional = candidateRows.length;

  const gapGroups = useMemo(() => GAP_BUCKETS.map(b => ({
    label: b.label,
    rows: directional.filter(r => {
      const g = gapAsCalled(r);
      return g !== null && b.test(g);
    }),
  })), [directional]);

  const typeGroups = useMemo(() => {
    const by = new Map<string, ScoredCall[]>();
    for (const r of directional) {
      const k = r.document_type?.trim() || 'Other';
      (by.get(k) ?? by.set(k, []).get(k)!).push(r);
    }
    return Array.from(by.entries())
      .map(([label, rows]) => ({ label, rows }))
      // Most-traded kinds first; a long tail of one-offs is not a finding.
      .sort((a, b) => b.rows.length - a.rows.length)
      .slice(0, 12);
  }, [directional]);

  const directionGroups = useMemo(() => ([
    { label: '▲ Bullish', rows: universe.filter(r => r.sentiment === 'bullish') },
    { label: '▼ Bearish', rows: universe.filter(r => r.sentiment === 'bearish') },
  ]), [universe]);

  const liquidityGroups = useMemo(() => {
    const band = (r: ScoredCall): string => {
      const t = r.avg_turnover_aud;
      if (t === null || t === undefined) return 'Turnover unknown';
      if (t < 50_000) return 'Under A$50k a day';
      if (t < 250_000) return 'A$50k – 250k';
      if (t < 1_000_000) return 'A$250k – 1m';
      return 'Over A$1m a day';
    };
    const order = ['Over A$1m a day', 'A$250k – 1m', 'A$50k – 250k',
      'Under A$50k a day', 'Turnover unknown'];
    return order.map(label => ({ label, rows: directional.filter(r => band(r) === label) }));
  }, [directional]);

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
    const priced = rows.filter(r => B.moveOf(r) !== null && B.moveOf(r) !== undefined);
    const sum = priced.reduce((t, r) => t + (B.moveOf(r) as number), 0);
    const asCalled = priced.reduce(
      (t, r) => t + (r.sentiment === 'bearish' ? -(B.moveOf(r) as number) : B.moveOf(r) as number), 0);
    return {
      sum,
      asCalled,
      n: priced.length,
      avg: priced.length ? sum / priced.length : null,
      unpriced: rows.length - priced.length,
    };
  }, [rows, B]);

  function downloadCsv() {
    if (!card) return;
    const headers = ['Ticker', 'Company', 'Headline', 'Filings', 'Our Call',
      'Prev Close', 'Open', 'VWAP', 'Close', 'Open-Close %',
      'Gap %', 'Move %', 'Index %', 'Net of Index %', 'Verdict', 'Intraday Verdict',
      'Turnover AUD', 'Mkt Cap AUD', 'Session', 'Released', 'URL'];
    const body = card.results.map(r => [
      r.ticker, `"${r.company.replace(/"/g, '""')}"`, `"${r.headline.replace(/"/g, '""')}"`,
      r.announcements ?? 1,
      r.sentiment, r.prev_close ?? '', r.open ?? '', r.vwap ?? '', r.close ?? '',
      r.open_close_pct ?? '', r.gap_pct ?? '', r.return_pct ?? '',
      r.index_return_pct ?? '', r.abnormal_pct ?? '', r.verdict, r.intraday_verdict ?? '',
      r.avg_turnover_aud ?? '', r.market_cap_aud ?? '', r.bucket, r.time, r.url,
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

  // Only `conflicts` and `pending` are still read off the precomputed block;
  // every published figure is recomputed by statsFor() so it follows the basis
  // and the filters. The per-direction locals that used to live here went with
  // the band they fed — that detail is a Breakdown now.
  const s = card.stats;

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

      {requestedDate && (
        // Said plainly, and above everything it qualifies. A reader who picked
        // today and is shown yesterday's numbers without being told will take
        // them for today's, which is a worse failure than an empty tab.
        <div className="rounded-2xl px-5 py-3.5 mb-3 flex items-start gap-3"
          style={{ background: 'var(--accent-dim)', border: '1px solid var(--border-accent)' }}>
          <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 mt-0.5 flex-shrink-0"
            style={{ color: 'var(--text-accent)' }}>
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M8 5v3.5M8 11h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <p className="text-[0.76rem] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <b style={{ color: 'var(--text-primary)' }}>
              {formatDateLabel(requestedDate)} has not been scored yet.
            </b>{' '}
            Showing the last completed session, <b style={{ color: 'var(--text-primary)' }}>
              {formatDateLabel(card.date)}</b>. A day is scored after the ASX close, so
            today&apos;s numbers appear that evening.
          </p>
        </div>
      )}

      {/* ── Basis switch ──
          The single most consequential control on the tab: it decides whether
          every number below describes the call or the trade. Placed above the
          figures rather than beside the table, because it changes all of them. */}
      <div className="rounded-2xl px-5 py-4 mb-3"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-1.5 p-1 rounded-xl"
            style={{ background: 'var(--border-subtle)' }}>
            {(['intraday', 'gap'] as Basis[]).map(k => (
              <button key={k} onClick={() => setBasis(k)}
                title={BASIS[k].blurb}
                className="px-3.5 py-2 rounded-lg text-[0.75rem] font-bold transition-all duration-150"
                style={basis === k
                  ? { background: 'var(--bg-card)', color: 'var(--text-primary)', boxShadow: 'var(--shadow-card)' }
                  : { color: 'var(--text-dim)' }}>
                {BASIS[k].label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {([
              ['Exclude under 1c', excludeSubCent, () => setExcludeSubCent(v => !v),
               'Below a cent one tick is a double-digit move and the spread is the whole trade. Noise, not results.'],
              ['Exclude large caps', excludeLargeCaps, () => setExcludeLargeCaps(v => !v),
               'Over A$2bn. An announcement rarely moves one enough to trade, and they drag the averages.'],
            ] as [string, boolean, () => void, string][]).map(([label, on, toggle, hint]) => (
              <button key={label} onClick={toggle} title={hint}
                className="px-3 py-2 rounded-lg text-[0.7rem] font-semibold transition-all duration-150"
                style={on
                  ? { background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', color: 'var(--text-accent)' }
                  : { background: 'var(--border-subtle)', border: '1px solid var(--border-med)', color: 'var(--text-dim)' }}>
                {on ? '✓ ' : ''}{label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-[0.72rem] mb-3.5 leading-relaxed" style={{ color: 'var(--text-dim)' }}>
          {B.blurb}
        </p>

        {/* ── Totals, on the chosen basis, over the filtered universe ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-5 gap-y-4">
          <Stat label="hit rate" value={rate(dayStats.hitRate)} color={rateColor(dayStats.hitRate)}
            hint={`${dayStats.correct} right, ${dayStats.wrong} wrong, out of ${dayStats.decided} calls that cleared the ${card.threshold_pct}% dead band.`} />
          <Stat label="calls graded" value={String(dayStats.decided)}
            hint={`${dayStats.directional} directional calls in view; ${dayStats.flat} did not move enough to settle either way.`} />
          <Stat label="avg move" value={pct(dayStats.avgMove, 2)} color={moveColor(dayStats.avgMove)}
            hint="Average of the raw moves, whichever way they went." />
          <Stat label="avg as called" value={pct(dayStats.avgAsCalled, 2)} color={moveColor(dayStats.avgAsCalled)}
            hint="Sign flipped on bearish calls, so a bearish call that came good counts as a win. This is the number that says whether the direction was worth anything." />
          <Stat label="total as called" value={pct(dayStats.totalAsCalled, 1)} color={moveColor(dayStats.totalAsCalled)}
            hint="Every call summed at equal notional, gross. No sizing, no costs — and with no slippage or spread subtracted, so a real book would land below this." />
          <Stat label="no real move" value={String(dayStats.flat)}
            hint={`Moved less than ${card.threshold_pct}%. Counted as neither right nor wrong.`} />
        </div>
      </div>

      {/* ── What to look at ──
          A segmented control rather than five stacked tables. Each answers a
          different question and only one is being asked at a time; scrolling
          past four to reach the fifth is not a layout, it is a list. */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {([
          ['calls', `Calls (${rows.length})`],
          ['today', `Today (${todaysDirectional})`],
          ['breakdowns', 'Where the edge is'],
        ] as [PanelView, string][]).map(([k, label]) => (
          <button key={k} onClick={() => setView(k)}
            className="px-4 py-2.5 rounded-xl text-[0.76rem] font-bold transition-all duration-150"
            style={view === k
              ? { background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', color: 'var(--text-accent)' }
              : { background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-dim)' }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── Filters. Verdict is meaningless on Today (no outcome yet), so it
           only shows where it applies; direction applies to both. ── */}
      {view !== 'breakdowns' && (
      <div className="flex flex-wrap items-center gap-2 mb-2.5">
        {view === 'calls' && VERDICT_FILTERS.map(f => {
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
        {view === 'calls' && (
          <span className="mx-1 self-stretch w-px" style={{ background: 'var(--border-med)' }} />
        )}
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
        {view === 'calls' && (
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
        )}
      </div>
      )}

      {view === 'today' && (
        <Candidates rows={candidateRows} summary={summary} date={date} />
      )}

      {view === 'breakdowns' && (
      <>
      {/* ── Where the edge is, if anywhere ──
          Three cuts of the same calls. The averages above say whether there
          was an edge overall; these say where it sat, which is the only form
          the answer can take if it is going to be traded. */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 mb-4">
        <Breakdown
          title="Gap at the open, and what followed"
          blurb="Bucketed by how far the stock had already moved the call's way before the bell. The intraday question: when the market has agreed overnight, does it keep going or give it back?"
          groups={gapGroups} basis={basis} moveLabel={B.moveLabel} />
        <Breakdown
          title="By liquidity"
          blurb="Median daily turnover going into the filing. A 4% move on a stock trading A$8k a day is not a fill — this separates results you could have taken size in."
          groups={liquidityGroups} basis={basis} moveLabel={B.moveLabel} />
        <div className="xl:col-span-2">
          <Breakdown
            title="By announcement type"
            blurb="Which kinds of news are still worth trading after the open, and which are finished by then. Twelve most common types in view."
            groups={typeGroups} basis={basis} moveLabel={B.moveLabel} />
        </div>
        <div className="xl:col-span-2">
          {/* Recomputed like every other figure here, so it moves with the
              basis and the filters. It used to be read off the precomputed
              stats block, which meant it silently ignored both. */}
          <Breakdown
            title="By direction"
            blurb="Whether the calls are better at spotting good news or bad. Neutral is the control — a bullish call has to beat it, not zero, to mean anything."
            groups={directionGroups} basis={basis} moveLabel={B.moveLabel} />
        </div>
      </div>
      </>
      )}

      {view === 'calls' && (
      <>
      {/* ── Call-by-call ── */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1320px] text-left border-collapse">
            <thead>
              <tr style={{ background: 'var(--border-subtle)' }}>
                <th className="px-4 py-3 text-[0.62rem] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--text-dim)' }}>Ticker</th>
                <th className="px-4 py-3 text-[0.62rem] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--text-dim)' }}>Announcement</th>
                <th className="px-4 py-3 text-[0.62rem] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--text-dim)' }}>Our call</th>
                {/* Every step of the verdict, left to right, so the arithmetic
                    can be checked against Yahoo without opening the CSV. */}
                {['Prev close', 'Open', 'VWAP', 'Close', 'Open→Close', 'Stock', 'Market', 'Net'].map(h => (
                  <th key={h} className="px-4 py-3 text-right text-[0.62rem] font-bold uppercase tracking-[0.1em] whitespace-nowrap"
                    style={{ color: 'var(--text-dim)' }}>{h}</th>
                ))}
                <th className="px-4 py-3 text-[0.62rem] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--text-dim)' }}>Verdict</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                // One row per ticker per session now — the scorer merges them,
                // because several filings resolving to the same close were
                // several votes on one price move. `announcements` says how
                // many were folded in; `also` lists the ones not shown.
                const merged = (r.announcements ?? 1) > 1;
                return (
                  <tr key={r.url + i}
                    className="transition-colors duration-100 hover:bg-[var(--bg-card-hover)]"
                    style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <td className="px-4 py-3 align-top">
                      <span className="font-mono text-[0.8rem] font-bold" style={{ color: 'var(--text-primary)' }}>
                        {r.ticker}
                      </span>
                      {r.conflict && (
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
                      {merged && (
                        // Named, not just counted: "+6 more" invites the
                        // question of what was dropped, and the answer is on
                        // hover rather than in another view.
                        <span className="block text-[0.6rem] mt-1 font-semibold cursor-help"
                          style={{ color: 'var(--text-accent)' }}
                          title={(r.also ?? []).join('\n')}>
                          +{(r.announcements ?? 1) - 1} more filing{(r.announcements ?? 1) - 1 === 1 ? '' : 's'} this session
                        </span>
                      )}
                      <span className="block text-[0.6rem] mt-1 truncate" style={{ color: 'var(--text-dim)' }}>
                        {r.company}
                      </span>
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
                      style={{ color: 'var(--text-dim)' }}>
                      {price(r.open)}
                    </td>
                    {/* Absent beyond Yahoo's ~30-day intraday window. A dash,
                        never a (high+low+close)/3 stand-in, which is not
                        volume weighted and would mean something else here. */}
                    <td className="px-4 py-3 align-top text-right font-mono text-[0.74rem] tabular-nums"
                      style={{ color: 'var(--text-dim)' }}>
                      {price(r.vwap)}
                    </td>
                    <td className="px-4 py-3 align-top text-right font-mono text-[0.74rem] tabular-nums"
                      style={{ color: 'var(--text-secondary)' }}>
                      {price(r.close)}
                    </td>
                    {/* The session's own move. Not what the verdict is judged
                        on: most of these filings land before the open, and for
                        those the reaction is the gap this column excludes. */}
                    <td className="px-4 py-3 align-top text-right font-mono text-[0.74rem] tabular-nums"
                      style={{ color: moveColor(r.open_close_pct) }}>
                      {pct(r.open_close_pct, 2)}
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
                      <VerdictBadge verdict={B.verdictOf(r) ?? 'no_data'} />
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={12} className="px-4 py-12 text-center text-[0.8rem]" style={{ color: 'var(--text-dim)' }}>
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
        or costs in it.{' '}
        <b style={{ color: 'var(--text-secondary)' }}>On the intraday basis</b> the verdict is the raw
        open-to-close move instead, with no index subtracted — what a position opened at the bell and
        closed at it would have made, before slippage and spread.
      </p>
      </>
      )}
    </div>
  );
}
