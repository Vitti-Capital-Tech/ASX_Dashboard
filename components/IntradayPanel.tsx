'use client';

import {
  DEFAULT_INTRADAY, MAX_PICK_OPTIONS, PRICE_OPTIONS, TURNOVER_OPTIONS,
  type IntradayParams,
} from '@/lib/intraday';
import { SECTION_LABEL } from '@/lib/utils';
import Select from './Select';

interface Props {
  params: IntradayParams;
  shown: number;
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
export default function IntradayPanel({ params, shown, qualified, onChange }: Props) {
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
          title="Drop trading halts, dividends, AGMs, director notices, quarterly and annual reports"
          onClick={() => set({ excludeRoutine: !params.excludeRoutine })} />
      </div>

      <p className="text-[0.74rem] leading-relaxed mt-3" style={{ color: 'var(--text-dim)' }}>
        Screens for <b style={{ color: 'var(--text-secondary)' }}>movement you can trade</b>, not direction.
        Over 32 scored sessions these filters doubled the typical open→close range (median 1.3% → 2.8%),
        but the AI sentiment label called the intraday direction only ~49% of the time — and bullish
        calls after a 5%+ gap up held just 39%. Take direction from the open, not the label.
        One row per ticker, smallest market cap first.
      </p>
    </div>
  );
}
