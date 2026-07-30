import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { formatPoints } from '../../lib/formatters';
import type { ComparisonData } from '../../schemas/comparison';
import type { OptionData } from '../../schemas/option';
import type { WidgetState } from '../../schemas/sourceReceipt';
import Option from './Option';
import {
  MONO, DISPLAY, UI, INK, INK_MID, INK_DIM, LINE, CELL, ACCENT, LIFT,
  formatCash, safeDuration, stopsLabel,
} from './_shared';

/**
 * Comparison — a decision across 2 to 4 choices (design §4.2), composing
 * Option.
 *
 * Recommendation-first (§3.2): a stamped "best for you" banner with the
 * reason, then the choices as ALIGNED rows so the trade-off reads at a
 * glance (§4.2). Expanding a row reveals that choice's full Option card —
 * novice→expert progressive disclosure across the same objects (§2.4, §4.6).
 *
 * Actions (§4.2): sort, dismiss, select. Four states (§4.3).
 */

type SortKey = 'recommended' | 'points' | 'cash' | 'duration';

function bestPoints(o: OptionData): number | undefined {
  if (!o.points || o.points.length === 0) return undefined;
  return Math.min(...o.points.map((p) => p.points));
}

function durationMinutes(iso?: string): number | undefined {
  if (!iso) return undefined;
  const m = /P(?:([\d.]+)D)?T?(?:([\d.]+)H)?(?:([\d.]+)M)?/.exec(iso);
  if (!m) return undefined;
  const [, d, h, min] = m;
  return (Number(d || 0) * 24 + Number(h || 0)) * 60 + Number(min || 0);
}

export interface ComparisonProps {
  data?: ComparisonData;
  state?: WidgetState;
  pending?: string[];
  reason?: string;
  onSelect?: (option: OptionData, index: number) => void;
  onDismiss?: (option: OptionData, index: number) => void;
  onBook?: (option: OptionData, index: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

const shell: React.CSSProperties = {
  background: CELL,
  border: `1px solid ${LINE}`,
  borderRadius: 18,
  boxShadow: LIFT,
  padding: 16,
  fontFamily: UI,
  color: INK,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

export default function Comparison({
  data,
  state = 'loaded',
  pending,
  reason,
  onSelect,
  onDismiss,
  onBook,
  className,
  style,
}: ComparisonProps) {
  const [sort, setSort] = useState<SortKey>('recommended');
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());
  const [openRow, setOpenRow] = useState<number | null>(null);

  if (state === 'loading') {
    return (
      <div className={className} style={{ ...shell, ...style }} aria-busy="true" aria-label="Comparing options">
        <Bar w={180} h={12} />
        {[0, 1, 2].map((i) => (
          <Bar key={i} w={undefined} h={40} />
        ))}
      </div>
    );
  }

  if (state === 'failed') {
    return (
      <div className={className} style={{ ...shell, ...style }} role="status">
        <span style={{ fontFamily: DISPLAY, fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em' }}>
          Couldn&rsquo;t compare these
        </span>
        <span style={{ fontSize: 13.5, color: INK_MID }}>{reason || 'This could not be worked out just now.'}</span>
      </div>
    );
  }

  if (!data) return null;

  const recIdx = data.recommendedIndex;
  // Keep original indices so recommendation + callbacks stay correct through sort/dismiss.
  const rows = data.options
    .map((o, i) => ({ o, i }))
    .filter(({ i }) => !dismissed.has(i))
    .sort((a, b) => {
      if (sort === 'recommended') {
        if (a.i === recIdx) return -1;
        if (b.i === recIdx) return 1;
        return a.i - b.i;
      }
      if (sort === 'points') return (bestPoints(a.o) ?? Infinity) - (bestPoints(b.o) ?? Infinity);
      if (sort === 'cash') return (a.o.cash?.amount ?? Infinity) - (b.o.cash?.amount ?? Infinity);
      return (durationMinutes(a.o.duration) ?? Infinity) - (durationMinutes(b.o.duration) ?? Infinity);
    });

  const rec = recIdx !== undefined ? data.options[recIdx] : undefined;

  return (
    <div className={className} style={{ ...shell, ...style }}>
      {/* Recommendation-first (§3.2) */}
      {rec && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span
            style={{
              alignSelf: 'flex-start',
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              background: ACCENT,
              borderRadius: 4,
              padding: '2px 7px',
            }}
          >
            Best for you
          </span>
          <span style={{ fontFamily: DISPLAY, fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            {rec.verdict || `${rec.from} → ${rec.to}`}
          </span>
          {(data.reason || reason) && (
            <span style={{ fontFamily: UI, fontSize: 13, color: INK_MID }}>{data.reason || reason}</span>
          )}
        </div>
      )}

      {/* Sort control */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: INK_DIM }}>
          Sort
        </span>
        {(['recommended', 'points', 'cash', 'duration'] as SortKey[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setSort(k)}
            aria-pressed={sort === k}
            style={{
              background: sort === k ? 'color-mix(in srgb, var(--color-brand, #6C3DE8) 10%, transparent)' : 'transparent',
              color: sort === k ? ACCENT : INK_MID,
              border: `1px solid ${sort === k ? 'color-mix(in srgb, var(--color-brand, #6C3DE8) 30%, transparent)' : LINE}`,
              borderRadius: 9999,
              padding: '3px 10px',
              fontFamily: UI,
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            {k === 'duration' ? 'Fastest' : k === 'recommended' ? 'Pick' : k === 'points' ? 'Fewest points' : 'Cheapest cash'}
          </button>
        ))}
      </div>

      {isPartialNote(state, pending)}

      {/* Aligned rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rows.map(({ o, i }) => {
          const isRec = i === recIdx;
          const isOpen = openRow === i;
          const bp = bestPoints(o);
          const dur = safeDuration(o.duration);
          return (
            <div
              key={i}
              style={{
                border: `1px solid ${isRec ? 'color-mix(in srgb, var(--color-brand, #6C3DE8) 40%, transparent)' : LINE}`,
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  flexWrap: 'wrap',
                  background: isRec ? 'color-mix(in srgb, var(--color-brand, #6C3DE8) 4%, transparent)' : 'transparent',
                }}
              >
                {isRec && <Check size={14} aria-label="Recommended" style={{ color: ACCENT, flexShrink: 0 }} />}
                <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.08em', color: INK, minWidth: 92 }}>
                  {o.from} → {o.to}
                </span>
                <span style={{ fontFamily: MONO, fontSize: 13, color: INK, fontWeight: 500, marginLeft: 'auto' }}>
                  {bp !== undefined ? `${formatPoints(bp)} pts` : o.cash ? formatCash(o.cash.amount, o.cash.currency) : '—'}
                </span>
                {bp !== undefined && o.cash && (
                  <span style={{ fontFamily: MONO, fontSize: 12, color: INK_MID }}>{formatCash(o.cash.amount, o.cash.currency)}</span>
                )}
                <span style={{ fontFamily: MONO, fontSize: 11, color: INK_DIM }}>
                  {[dur, stopsLabel(o.stops)].filter(Boolean).join(' · ') || ''}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {onSelect && (
                    <button
                      type="button"
                      onClick={() => onSelect(o, i)}
                      style={{
                        background: isRec ? ACCENT : 'transparent',
                        color: isRec ? '#FFFFFF' : INK,
                        border: isRec ? 'none' : `1px solid ${LINE}`,
                        borderRadius: 9999,
                        padding: '5px 14px',
                        fontFamily: UI,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Select
                    </button>
                  )}
                  {onDismiss && (
                    <button
                      type="button"
                      onClick={() => {
                        setDismissed((s) => new Set(s).add(i));
                        onDismiss(o, i);
                      }}
                      aria-label="Dismiss this option"
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: INK_DIM, fontFamily: UI, fontSize: 12 }}
                    >
                      Dismiss
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setOpenRow(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-label={isOpen ? 'Hide detail' : 'Show detail'}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: INK_DIM, padding: 2 }}
                  >
                    <ChevronDown size={14} style={{ transition: 'transform 160ms ease', transform: isOpen ? 'rotate(180deg)' : 'none' }} aria-hidden />
                  </button>
                </div>
              </div>
              {isOpen && (
                <div style={{ borderTop: `1px solid ${LINE}`, padding: 0 }}>
                  <Option
                    data={o}
                    defaultExpanded
                    onBook={onBook ? () => onBook(o, i) : undefined}
                    style={{ border: 'none', boxShadow: 'none', borderRadius: 0 }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function isPartialNote(state: WidgetState, pending?: string[]) {
  if (state !== 'partial' || !pending || pending.length === 0) return null;
  return (
    <span style={{ fontFamily: MONO, fontSize: 11, color: INK_DIM }}>
      still checking: {pending.join(', ')}
    </span>
  );
}

function Bar({ w, h }: { w?: number; h: number }) {
  return (
    <span
      aria-hidden
      style={{
        display: 'block',
        width: w ?? '100%',
        height: h,
        borderRadius: 8,
        background: `linear-gradient(90deg, ${LINE}, transparent)`,
      }}
    />
  );
}
