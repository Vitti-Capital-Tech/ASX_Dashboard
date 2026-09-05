'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  /** Optional right-aligned detail, e.g. a count. */
  hint?: string;
}

interface Props {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  ariaLabel: string;
  /** Render in the accent colour to show a non-default choice is in effect. */
  highlighted?: boolean;
  className?: string;
  /** Match the trigger width, for a full-width control like the date picker. */
  block?: boolean;
}

/**
 * A themed dropdown.
 *
 * A native <select> renders its popup as an OS window, so no CSS reaches the
 * open list — `color-scheme` buys a generic grey menu and nothing more. On a
 * dark indigo dashboard that reads as a foreign control. This renders the list
 * ourselves so it uses the same tokens as everything else, at the cost of
 * having to implement the keyboard behaviour the native element gave us free.
 */
export default function Select({
  value, options, onChange, ariaLabel, highlighted = false, className = '', block = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const selectedIndex = Math.max(0, options.findIndex(o => o.value === value));
  const selected = options[selectedIndex];

  const close = useCallback(() => setOpen(false), []);

  // Pointer down rather than click: a click that starts inside the list and
  // ends outside should not count as an outside dismissal.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open, close]);

  // Open onto the current choice, not the top of a 100-date list.
  useEffect(() => {
    if (open) setActive(selectedIndex);
  }, [open, selectedIndex]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>('[data-active="true"]')
      ?.scrollIntoView({ block: 'nearest' });
  }, [open, active]);

  function commit(index: number) {
    const opt = options[index];
    if (opt) onChange(opt.value);
    close();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!open) { setOpen(true); return; }
        setActive(i => Math.min(i + 1, options.length - 1));
        return;
      case 'ArrowUp':
        e.preventDefault();
        if (!open) { setOpen(true); return; }
        setActive(i => Math.max(i - 1, 0));
        return;
      case 'Home':
        if (open) { e.preventDefault(); setActive(0); }
        return;
      case 'End':
        if (open) { e.preventDefault(); setActive(options.length - 1); }
        return;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (open) commit(active); else setOpen(true);
        return;
      case 'Escape':
        if (open) { e.preventDefault(); close(); }
        return;
      case 'Tab':
        close();
    }
  }

  const accent = highlighted || open;

  return (
    <div ref={rootRef} className={`relative ${block ? 'w-full' : ''} ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen(o => !o)}
        onKeyDown={onKeyDown}
        className={`flex items-center gap-2 ${block ? 'w-full' : ''} pl-3.5 pr-2.5 py-2 rounded-xl
                    text-[0.74rem] font-semibold transition-all duration-150 outline-none`}
        style={{
          background: accent ? 'var(--accent-dim)' : 'var(--border-subtle)',
          border: `1px solid ${accent ? 'var(--border-accent)' : 'var(--border-med)'}`,
          color: accent ? 'var(--accent-light)' : 'var(--text-secondary)',
        }}>
        <span className="truncate flex-1 text-left">{selected?.label ?? ''}</span>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"
          className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          tabIndex={-1}
          onKeyDown={onKeyDown}
          className="absolute z-50 mt-1.5 min-w-full max-h-[280px] overflow-y-auto p-1 rounded-xl
                     animate-fade-in-up [scrollbar-width:thin]"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-med)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.35), 0 0 0 1px var(--border-subtle)',
          }}>
          {options.map((opt, i) => {
            const isSelected = opt.value === value;
            const isActive = i === active;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                data-active={isActive}
                onMouseEnter={() => setActive(i)}
                onClick={() => commit(i)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-[0.75rem] font-medium whitespace-nowrap"
                style={{
                  background: isActive ? 'var(--accent-dim)' : 'transparent',
                  color: isSelected ? 'var(--accent-light)' : 'var(--text-secondary)',
                }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: isSelected ? 'var(--accent)' : 'transparent' }} />
                <span className="flex-1">{opt.label}</span>
                {opt.hint && (
                  <span className="font-mono text-[0.68rem] tabular-nums" style={{ color: 'var(--text-dim)' }}>
                    {opt.hint}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
