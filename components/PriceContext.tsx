'use client';

import type { MarketContext } from '@/types';

/**
 * What the price was doing before the announcement landed.
 *
 * Renders the measurements from market_context.py verbatim. The model is handed
 * the same numbers so its summary can reference them, but nothing here comes
 * from the model — the scorecard puts its directional calls at 58%, and a
 * figure a reader cannot check is worse than no figure when they are making a
 * decision off it.
 *
 * Presentation, not judgement: "closed above its 60-day high on 2.6x volume" is
 * checkable against any chart; "breakout forming" is a recommendation wearing a
 * fact's clothes. The chips state what happened and stop.
 */
export default function PriceContext({ ctx }: { ctx: MarketContext }) {
  if (!ctx.notes?.length) return null;

  // A thin stock's ratios describe two people trading, so the whole block is
  // muted rather than dropped — the reader still learns the stock is illiquid,
  // which is itself the useful fact.
  const thin = !ctx.liquid;

  const chips: { label: string; tone: 'up' | 'down' | 'flat' }[] = [];

  if (ctx.broke_out) {
    chips.push({
      label: `above 60-day high · ${ctx.volume_last_ratio}× volume`,
      tone: 'up',
    });
  }

  const trend = ctx.volume_trend_ratio;
  if (trend !== null && trend >= 1.5) {
    chips.push({ label: `volume ${trend}× avg for 5 sessions`, tone: 'up' });
  } else if (trend !== null && trend <= 0.6) {
    chips.push({ label: `volume ${trend}× avg — quiet`, tone: 'flat' });
  }

  if (ctx.at_52w_high) chips.push({ label: '12-month high', tone: 'up' });
  else if (ctx.at_3m_high && !ctx.broke_out) chips.push({ label: '3-month high', tone: 'up' });
  else if (ctx.at_52w_low) chips.push({ label: '12-month low', tone: 'down' });
  else if (ctx.at_3m_low) chips.push({ label: '3-month low', tone: 'down' });
  else if (ctx.pct_from_3m_high !== null && ctx.pct_from_3m_high >= -5) {
    chips.push({ label: `${Math.abs(ctx.pct_from_3m_high)}% off 3-month high`, tone: 'flat' });
  }

  if (!chips.length) return null;

  const token = (tone: 'up' | 'down' | 'flat') =>
    tone === 'up' ? 'success' : tone === 'down' ? 'danger' : 'text-dim';

  return (
    <div className="rounded-xl p-3 min-w-0"
      style={{ background: 'var(--border-subtle)', border: '1px solid var(--border-med)' }}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[0.6rem] font-semibold uppercase tracking-[0.1em]"
          style={{ color: 'var(--text-dim)' }}>
          Price going in
        </span>
        {/* The date is not decoration: these are pre-announcement figures, and a
            reader who assumes they are live would draw the wrong conclusion. */}
        <span className="font-mono text-[0.6rem] tabular-nums" style={{ color: 'var(--text-dim)' }}>
          to {ctx.as_of}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {chips.map(c => {
          const t = token(c.tone);
          return (
            <span key={c.label}
              className="text-[0.66rem] font-medium px-2 py-[0.15rem] rounded-md whitespace-nowrap"
              style={{
                background: `color-mix(in srgb, var(--${t}), transparent ${thin ? 94 : 90}%)`,
                border: `1px solid color-mix(in srgb, var(--${t}), transparent ${thin ? 84 : 76}%)`,
                color: thin ? 'var(--text-dim)' : `var(--${t})`,
              }}>
              {c.label}
            </span>
          );
        })}
      </div>

      {/* Authored upstream so every surface words it identically, and so the
          wording is not duplicated in two dashboards that will drift. */}
      {thin && ctx.caveat && (
        <p className="text-[0.62rem] leading-snug mt-2 first-letter:uppercase"
          style={{ color: 'var(--text-dim)' }}>
          {ctx.caveat} — treat the ratios above as close to meaningless.
        </p>
      )}
    </div>
  );
}
