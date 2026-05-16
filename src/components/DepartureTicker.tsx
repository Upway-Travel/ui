/**
 * DepartureTicker — multi-row Solari departures-board display.
 *
 * Cycles through a queue of rows like a real airport flap board. Each row
 * is a record with configurable columns. Columns layout is responsive via
 * the Tailwind grid classes you pass in `colSpan`.
 *
 * The board chrome (Ink background, "LIVE · DEPARTURES" caption, optional
 * "● sample" pulse) is part of the component so all surfaces render the
 * same identity.
 *
 * Used on landing for live-feel route examples; on blog for "latest Field
 * Notes" headlines; on app shell for "Adviser thinking…" status; on deck
 * for KPI counters.
 *
 * Reduced-motion respected via FlapDisplay.
 */

import { useEffect, useState } from 'react';
import FlapDisplay from './FlapDisplay';

export interface DepartureColumn<TRow> {
  /** Caption shown above the value */
  label: string;
  /** How to extract the value from a row */
  value: (row: TRow) => string | number;
  /** Tailwind col-span class, e.g. "col-span-3" */
  colSpan: string;
  /** Font size in px for the value cell */
  size?: number;
  /** Extra className for the column wrapper (e.g. "text-right") */
  className?: string;
}

export interface DepartureTickerProps<TRow> {
  /** Rows to cycle through */
  rows: TRow[];
  /** Column definitions — each one extracts + renders a field */
  columns: DepartureColumn<TRow>[];
  /** Caption shown in the top-strip. Default "Live · Departures". */
  caption?: string;
  /** Show a "● sample" pulse next to the caption. Default true. */
  sampleBadge?: boolean;
  /** Milliseconds between row changes. Default 3200. */
  intervalMs?: number;
  /** className for the outer board wrapper */
  className?: string;
  /** Optional aria-label; defaults to the caption. */
  ariaLabel?: string;
}

export default function DepartureTicker<TRow>({
  rows,
  columns,
  caption = 'Live · Departures',
  sampleBadge = true,
  intervalMs = 3200,
  className = '',
  ariaLabel,
}: DepartureTickerProps<TRow>) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (rows.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % rows.length), intervalMs);
    return () => clearInterval(t);
  }, [rows.length, intervalMs]);

  if (rows.length === 0) return null;
  const row = rows[idx];

  return (
    <div
      className={`w-full rounded-xl overflow-hidden ${className}`}
      style={{
        background: 'var(--color-text, #0A0E14)',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow:
          '0 1px 0 rgba(255,255,255,0.08) inset, 0 12px 32px rgba(0,0,0,0.18)',
      }}
      aria-label={ariaLabel ?? caption}
    >
      <div
        className="flex items-center justify-between px-4 py-2 font-mono uppercase"
        style={{
          fontSize: 10,
          letterSpacing: '0.28em',
          color: 'rgba(244,241,234,0.42)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          fontFamily: 'var(--font-mono, "Geist Mono"), ui-monospace, monospace',
        }}
      >
        <span>{caption}</span>
        {sampleBadge && (
          <span style={{ color: 'rgba(198,255,61,0.7)' }}>● sample</span>
        )}
      </div>

      <div className="grid grid-cols-12 gap-x-3 px-4 py-5 items-center">
        {columns.map((col) => (
          <FlapDisplay
            key={col.label}
            label={col.label}
            value={col.value(row)}
            size={col.size ?? 14}
            className={`${col.colSpan} ${col.className ?? ''}`}
          />
        ))}
      </div>
    </div>
  );
}
