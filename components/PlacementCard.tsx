'use client';

import { useState } from 'react';
import { PlacementSummary } from '@/types';

interface Props {
  placement: PlacementSummary;
}

export default function PlacementCard({ placement }: Props) {
  const [copied, setCopied] = useState(false);

  // Replace standard tilde (~) with Unicode Tilde Operator (∼, U+223C)
  // WhatsApp aggressively strips invisible characters and will still trigger strikethrough
  // if standard tildes are present. Using a different character prevents this completely.
  const safeSummary = placement.summary.replace(/~/g, '∼');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(safeSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = safeSummary;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const timeStr = placement.received_at
    ? new Date(placement.received_at).toLocaleTimeString('en-AU', {
        hour: '2-digit', minute: '2-digit', hour12: true,
        timeZone: 'Australia/Sydney',
      })
    : '';

  const isPO = placement.deal_type === 'IPO';

  const parseSummary = (text: string) => {
    if (!text) return { metadata: [], narrative: '' };
    
    const parts = text.trim().split(/\n\s*\n/);
    if (parts.length < 2) return { metadata: [], narrative: text };

    const firstBlock = parts[0];
    const lines = firstBlock.split('\n');
    
    const metadata: { key: string; value: string }[] = [];
    let isMetadataBlock = true;
    for (const line of lines) {
      const match = line.match(/^([^:]+):\s*(.+)$/);
      if (match) {
        metadata.push({ key: match[1].trim(), value: match[2].trim() });
      } else {
        isMetadataBlock = false;
        break;
      }
    }

    if (isMetadataBlock && metadata.length > 0) {
      return {
        metadata,
        narrative: parts.slice(1).join('\n\n')
      };
    }

    return { metadata: [], narrative: text };
  };

  const { metadata, narrative } = parseSummary(safeSummary);

  return (
    <div
      className="relative rounded-[16px] p-5 transition-all duration-200 hover:-translate-y-0.5 group"
      style={{
        background: 'var(--bg-card, rgba(255,255,255,0.03))',
        border: '1px solid var(--border-med, rgba(255,255,255,0.08))',
        boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Ticker badge */}
          <span
            className="flex-shrink-0 font-mono text-[0.75rem] font-black px-2.5 py-1 rounded-lg tracking-wide"
            style={{
              background: isPO
                ? 'rgba(168,85,247,0.12)'
                : 'rgba(99,102,241,0.12)',
              color: isPO ? '#c084fc' : '#a5b4fc',
              border: isPO
                ? '1px solid rgba(168,85,247,0.25)'
                : '1px solid rgba(99,102,241,0.25)',
            }}
          >
            {placement.ticker}
          </span>

          {/* Deal type pill */}
          <span
            className="flex-shrink-0 text-[0.6rem] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-full"
            style={{
              background: isPO
                ? 'rgba(168,85,247,0.1)'
                : 'rgba(16,185,129,0.1)',
              color: isPO ? '#c084fc' : '#6ee7b7',
              border: isPO
                ? '1px solid rgba(168,85,247,0.2)'
                : '1px solid rgba(16,185,129,0.2)',
            }}
          >
            {placement.deal_type}
          </span>

          {/* Company name */}
          <span
            className="text-[0.78rem] font-semibold truncate"
            style={{ color: 'var(--text-secondary, rgba(148,163,184,0.8))' }}
          >
            {placement.company}
          </span>
        </div>

        {/* Time */}
        {timeStr && (
          <span
            className="flex-shrink-0 font-mono text-[0.65rem] font-medium"
            style={{ color: 'var(--text-dim, rgba(100,116,139,0.6))' }}
          >
            {timeStr}
          </span>
        )}
      </div>

      {/* Subject */}
      <h3
        className="text-[0.85rem] font-bold mb-3 leading-snug"
        style={{ color: 'var(--text-primary, #e2e8f0)' }}
      >
        {placement.subject}
      </h3>

      {/* Summary - the copy-pastable block */}
      <div className="relative">
        <div
          className="rounded-xl p-4"
          style={{
            background: 'var(--bg-summary, rgba(0,0,0,0.2))',
            border: '1px solid var(--border-subtle, rgba(255,255,255,0.05))',
            color: 'var(--text-primary, #e2e8f0)',
          }}
        >
          {metadata.length > 0 && (
            <div className="mb-4 pb-4 border-b overflow-x-auto" style={{ borderColor: 'var(--border-subtle, rgba(255,255,255,0.1))' }}>
              <table className="w-full text-left border-collapse min-w-max">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    {metadata.map((item, idx) => (
                      <th key={idx} className="pb-2 pr-6 text-[0.65rem] font-bold uppercase tracking-wider whitespace-nowrap align-bottom" style={{ color: 'var(--text-dim, rgba(148,163,184,0.8))' }}>
                        {item.key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {metadata.map((item, idx) => (
                      <td key={idx} className="pt-2 pr-6 text-[0.8rem] font-medium leading-snug align-top">
                        {item.value}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          <div className="text-[0.8rem] leading-[1.7] whitespace-pre-wrap font-sans select-all cursor-text">
            {narrative}
          </div>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[0.68rem] font-bold uppercase tracking-[0.1em] transition-all duration-150 opacity-0 group-hover:opacity-100 focus:opacity-100"
          style={{
            background: copied
              ? 'rgba(16,185,129,0.2)'
              : 'rgba(99,102,241,0.15)',
            color: copied ? '#6ee7b7' : '#a5b4fc',
            border: copied
              ? '1px solid rgba(16,185,129,0.3)'
              : '1px solid rgba(99,102,241,0.3)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {copied ? (
            <>
              <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
                <path
                  d="M3 8.5l3 3 7-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
                <rect
                  x="5"
                  y="5"
                  width="9"
                  height="9"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <path
                  d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
}
