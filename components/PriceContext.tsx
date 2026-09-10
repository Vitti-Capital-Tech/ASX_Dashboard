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
 *
 * Every chip carries its own plain-English explanation, because the measurement
 * alone assumes the reader already knows why a 20-day average or a 60-day high
 * is the interesting comparison — and most don't. The label is the fact, the
 * tooltip is what it means, and the (i) explains the block.
 */

/** Why these figures are dated, and what they are and are not. */
const BLOCK_HELP = [
  'What the share price was doing in the days BEFORE this announcement came out.',
  'Most ASX news lands before the market opens, so there is no price for today yet — these are measured up to the previous close, which is the date shown.',
  'They are calculated from exchange data, not written by the AI. You can check any of them against a chart.',
  'They describe what the market was already doing. They are not a prediction and not advice.',
];

export default function PriceContext({ ctx }: { ctx: MarketContext }) {
  if (!ctx.notes?.length) return null;

  // A thin stock's ratios describe two people trading, so the whole block is
  // muted rather than dropped — the reader still learns the stock is illiquid,
  // which is itself the useful fact.
  const thin = !ctx.liquid;

  const chips: { label: string; tone: 'up' | 'down' | 'flat'; explain: string }[] = [];

  if (ctx.broke_out) {
    chips.push({
      label: `above 60-day high · ${ctx.volume_last_ratio}× volume`,
      tone: 'up',
      explain:
        `It closed higher than at any point in the previous 60 trading days, and did it on `
        + `${ctx.volume_last_ratio}× the shares it normally trades. Both halves matter: a price `
        + `can drift to a new high on almost no trading, which means little. Heavy volume with `
        + `it means buyers were actively competing — before this news was public.`,
    });
  }

  const trend = ctx.volume_trend_ratio;
  if (trend !== null && trend >= 1.5) {
    chips.push({
      label: `volume ${trend}× avg for 5 sessions`,
      tone: 'up',
      explain:
        `Over the last 5 trading days the stock traded ${trend} times its usual daily volume `
        + `(measured against its 20-day average). Sustained heavy trading before an announcement `
        + `often means the market was anticipating something. It does not tell you which way.`,
    });
  } else if (trend !== null && trend <= 0.6) {
    chips.push({
      label: `volume ${trend}× avg — quiet`,
      tone: 'flat',
      explain:
        `Trading was unusually light — ${trend} times its normal daily volume over the last 5 `
        + `days. Nobody was positioning beforehand, so this news is more likely to be a genuine `
        + `surprise than something already leaking into the price.`,
    });
  }

  if (ctx.at_52w_high) {
    chips.push({
      label: '12-month high',
      tone: 'up',
      explain:
        'The share price is at its highest in a year. Good news arriving here may already be '
        + 'partly priced in, since the market has been bidding it up regardless.',
    });
  } else if (ctx.at_3m_high && !ctx.broke_out) {
    chips.push({
      label: '3-month high',
      tone: 'up',
      explain:
        'Highest close in about three months. The stock was already running into this '
        + 'announcement rather than reacting to it.',
    });
  } else if (ctx.at_52w_low) {
    chips.push({
      label: '12-month low',
      tone: 'down',
      explain:
        'The share price is at its lowest in a year. Bad news arriving here may already be '
        + 'expected; good news arriving here is landing on a market that had given up on it.',
    });
  } else if (ctx.at_3m_low) {
    chips.push({
      label: '3-month low',
      tone: 'down',
      explain: 'Lowest close in about three months — it was already falling into this news.',
    });
  } else if (ctx.pct_from_3m_high !== null && ctx.pct_from_3m_high >= -5) {
    chips.push({
      label: `${Math.abs(ctx.pct_from_3m_high)}% off 3-month high`,
      tone: 'flat',
      explain:
        `Trading within ${Math.abs(ctx.pct_from_3m_high)}% of its best close of the last three `
        + `months, so near the top of its recent range without having broken out of it.`,
    });
  }

  if (!chips.length) return null;

  const token = (tone: 'up' | 'down' | 'flat') =>
    tone === 'up' ? 'success' : tone === 'down' ? 'danger' : 'text-dim';

  return (
    <div className="rounded-xl p-3 min-w-0"
      style={{ background: 'var(--border-subtle)', border: '1px solid var(--border-med)' }}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="flex items-center gap-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em]"
          style={{ color: 'var(--text-dim)' }}>
          Price going in

          {/* Hover and focus, not hover alone — a keyboard user gets to the
              same explanation, and on touch a tap focuses the button. */}
          <span className="relative inline-flex group/info">
            <button type="button" aria-label="What is this?"
              className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[0.55rem]
                         font-bold leading-none cursor-help outline-none"
              style={{
                background: 'var(--border-med)',
                color: 'var(--text-secondary)',
              }}>
              i
            </button>

            <span role="tooltip"
              className="pointer-events-none absolute left-0 top-5 z-50 w-[min(20rem,70vw)] p-3 rounded-xl
                         opacity-0 invisible transition-opacity duration-150
                         group-hover/info:opacity-100 group-hover/info:visible
                         group-focus-within/info:opacity-100 group-focus-within/info:visible"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-med)',
                boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
              }}>
              <span className="block text-[0.6rem] font-bold uppercase tracking-[0.1em] mb-1.5"
                style={{ color: 'var(--accent)' }}>
                Price going in
              </span>
              {BLOCK_HELP.map(line => (
                <span key={line} className="block text-[0.68rem] leading-relaxed mb-1.5 normal-case tracking-normal font-normal"
                  style={{ color: 'var(--text-secondary)' }}>
                  {line}
                </span>
              ))}
              <span className="block text-[0.62rem] leading-relaxed normal-case tracking-normal font-normal"
                style={{ color: 'var(--text-dim)' }}>
                Hover any measurement below for what it means.
              </span>
            </span>
          </span>
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
            // `title` rather than a styled tooltip per chip: it survives a card
            // grid with no positioning or clipping problems, and it is the one
            // hover explanation a browser gives for free on every platform.
            <span key={c.label}
              title={thin && ctx.caveat ? `${c.explain}\n\nNote: ${ctx.caveat} — so treat this figure as close to meaningless.` : c.explain}
              className="text-[0.66rem] font-medium px-2 py-[0.15rem] rounded-md whitespace-nowrap cursor-help"
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
        <p className="text-[0.62rem] leading-snug mt-2 first-letter:uppercase cursor-help"
          style={{ color: 'var(--text-dim)' }}
          title="Turnover is the dollar value traded per day. When it is this small, a 'volume spike' can be one or two people, so the ratios above describe noise rather than genuine interest.">
          {ctx.caveat} — treat the ratios above as close to meaningless.
        </p>
      )}
    </div>
  );
}
