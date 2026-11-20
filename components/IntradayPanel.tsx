'use client';

import {
  DEFAULT_INTRADAY, MAX_PICK_OPTIONS, PRICE_OPTIONS, TURNOVER_OPTIONS,
  type IntradayParams, type IntradayPick,
} from '@/lib/intraday';
import { SECTION_LABEL } from '@/lib/utils';
import Select from './Select';

interface Props {
  params: IntradayParams;
  picks: IntradayPick[];
  qualified: number;
  onChange: (p: IntradayParams) => void;
}

function Toggle({ on, label, title, onClick }: {
  on: boolean; label: string; title: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      title={title}
      className="px-3 py-1.5 rounded-lg text-[0.72rem] font-semibold whitespace-nowrap transition-all duration-150"
      style={{
        background: on ? 'var(--accent-dim)' : 'transparent',
        border: `1px solid ${on ? 'var(--border-accent)' : 'var(--border-med)'}`,
        color: on ? 'var(--accent-light)' : 'var(--text-dim)',
      }}>
      {on ? '✓ ' : ''}{label}
    </button>
  );
}

/**
 * The screen's parameters, shown only while the intraday shortlist is on.
 * Defaults are the values the backtest in lib/intraday.ts was run with.
 */
export default function IntradayPanel({ params, picks, qualified, onChange }: Props) {
  const shown = picks.length;
  const set = (patch: Partial<IntradayParams>) => onChange({ ...params, ...patch });
  const isDefault = (Object.keys(DEFAULT_INTRADAY) as (keyof IntradayParams)[])
    .every(k => params[k] === DEFAULT_INTRADAY[k]);

  return (
    <div className="rounded-2xl px-4 py-3.5 mb-5 -mt-2"
      style={{ background: 'var(--border-subtle)', border: '1px solid var(--border-accent)' }}>

      <div className="flex flex-wrap items-center gap-2 mb-2.5">
        <span className={SECTION_LABEL} style={{ color: 'var(--accent-light)' }}>Intraday shortlist</span>
        <span className="font-mono text-[0.72rem]" style={{ color: 'var(--text-dim)' }}>
          {shown} shown{qualified > shown ? ` · ${qualified} qualified` : ''}
        </span>
        {!isDefault && (
          <button onClick={() => onChange(DEFAULT_INTRADAY)}
            className="ml-auto text-[0.7rem] font-semibold"
            style={{ color: 'var(--text-dim)' }}>
            Reset parameters
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={String(params.minTurnover)}
          options={TURNOVER_OPTIONS.map(o => ({ value: String(o.value), label: o.label }))}
          onChange={v => set({ minTurnover: Number(v) })}
          ariaLabel="Minimum daily turnover"
          highlighted={params.minTurnover !== DEFAULT_INTRADAY.minTurnover}
        />
        <Select
          value={String(params.minPrice)}
          options={PRICE_OPTIONS.map(o => ({ value: String(o.value), label: o.label }))}
          onChange={v => set({ minPrice: Number(v) })}
          ariaLabel="Minimum share price"
          highlighted={params.minPrice !== DEFAULT_INTRADAY.minPrice}
        />
        <Select
          value={String(params.maxPicks)}
          options={MAX_PICK_OPTIONS.map(n => ({ value: String(n), label: `Top ${n}` }))}
          onChange={v => set({ maxPicks: Number(v) })}
          ariaLabel="Number of picks"
          highlighted={params.maxPicks !== DEFAULT_INTRADAY.maxPicks}
        />
        <Toggle on={params.preOpenOnly} label="Before 10:00 open"
          title="Only filings released before the 10:00 AM Sydney open"
          onClick={() => set({ preOpenOnly: !params.preOpenOnly })} />
        <Toggle on={params.sensitiveOnly} label="Price sensitive"
          title="Only filings ASX flagged as price sensitive"
          onClick={() => set({ sensitiveOnly: !params.sensitiveOnly })} />
        <Toggle on={params.excludeRoutine} label="Skip routine"
          title="Drop trading halts, dividends, AGMs, director notices, quarterly and annual reports, and placement or takeover headlines"
          onClick={() => set({ excludeRoutine: !params.excludeRoutine })} />
      </div>

      {picks.length > 0 && (
        // Why each pick ranked where it did. The table below shows the same
        // names in the same order; this is the one place the reasons live.
        <ol className="flex flex-col gap-1.5 mt-3.5">
          {picks.map((p, i) => (
            <li key={p.ann.ticker} className="flex flex-wrap items-center gap-1.5 text-[0.72rem]">
              <span className="font-mono w-5 text-right" style={{ color: 'var(--text-dim)' }}>{i + 1}.</span>
              <span className="font-mono font-bold w-12" style={{ color: 'var(--text-primary)' }}>{p.ann.ticker}</span>
              <span className="font-mono w-7" style={{ color: p.points > 0 ? 'var(--accent-light)' : 'var(--text-dim)' }}>
                {p.points > 0 ? `+${p.points}` : p.points}
              </span>
              {p.reasons.length === 0 && <span style={{ color: 'var(--text-dim)' }}>passed filters</span>}
              {p.reasons.map(r => (
                <span key={r.label} className="px-2 py-0.5 rounded-md"
                  style={{
                    border: `1px solid ${r.good ? 'var(--border-accent)' : 'var(--border-med)'}`,
                    color: r.good ? 'var(--accent-light)' : 'var(--text-dim)',
                  }}>
                  {r.good ? '' : '− '}{r.label}
                </span>
              ))}
            </li>
          ))}
        </ol>
      )}

      <p className="text-[0.74rem] leading-relaxed mt-3" style={{ color: 'var(--text-dim)' }}>
        Screens for <b style={{ color: 'var(--text-secondary)' }}>movement you can trade</b>, not direction.
        Over 74 scored sessions these filters doubled the typical open→close range (median 1.2% → 2.6%),
        and the points ranking lifted the daily top 10 to ~2.9%. But the AI sentiment label called the
        intraday direction only ~49% of the time, and bullish calls after a 5%+ gap up held just 36%.
        Take direction from the open, not the label. Points: +1 deep below 52w high, +1 two or more
        sensitive filings, +1 results / contract headline; −1 near 52w high, −1 drilling / assay.
      </p>
    </div>
  );
}
