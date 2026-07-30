import { useState } from 'react';
import { ChevronDown, Plane } from 'lucide-react';
import { formatPoints, formatDuration } from '../../lib/formatters';
import type { OptionData, Cabin } from '../../schemas/option';
import type { WidgetState } from '../../schemas/sourceReceipt';
import SourceReceipt from './SourceReceipt';

/**
 * Option — a single bookable choice (design §4.2), the render contract's
 * workhorse.
 *
 * Collapsed = the novice answer: route, cabin, one-line verdict, the price
 * pair (points prominent, cash right beside it — never gated), and one
 * primary action. Expanded = the expert depth in the SAME object (§4.6):
 * leg-by-leg segments, constraints, and the embedded SourceReceipt evidence.
 *
 * Rules in code: points and cash always shown together (no paywall);
 * estimated value is a range, never a point figure (§11); one accent-filled
 * CTA, everything else quiet; sentence case, no dashes, claim verbs (§13).
 * Four states (§4.3): loading / loaded / partial / failed.
 */

const MONO = 'var(--font-mono, "Geist Mono", ui-monospace, monospace)';
const DISPLAY = 'var(--font-display, "Clash Display", system-ui, sans-serif)';
const UI = 'var(--font-ui, "Satoshi", system-ui, sans-serif)';
const INK = 'var(--ink, var(--text, #12121A))';
const INK_MID = 'var(--ink-mid, rgba(18,18,26,0.62))';
const INK_DIM = 'var(--ink-dim, rgba(18,18,26,0.40))';
const LINE = 'var(--line, rgba(18,18,26,0.08))';
const CELL = 'var(--cell, var(--surface, #FFFFFF))';
const ACCENT = 'var(--color-brand, var(--violet, #6C3DE8))';
const LIFT = 'var(--lift, 0 1px 2px rgba(18,18,26,0.04), 0 8px 28px -14px rgba(18,18,26,0.10))';

const CABIN_LABEL: Record<Cabin, string> = {
  economy: 'Economy',
  premium_economy: 'Premium economy',
  business: 'Business',
  first: 'First',
};

function formatCash(amount: number, currency = 'USD'): string {
  const symbol = currency === 'USD' ? '$' : currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '';
  const digits = amount < 1000 ? 2 : 0;
  const n = amount.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
  return symbol ? `${symbol}${n}` : `${n} ${currency}`;
}

function safeDuration(iso?: string): string | null {
  if (!iso) return null;
  try {
    return formatDuration(iso);
  } catch {
    return null;
  }
}

export interface OptionProps {
  data?: OptionData;
  state?: WidgetState;
  /** Partial: what is still being checked, named honestly. */
  pending?: string[];
  /** Failed: a one-line honest reason. No fabricated price is shown. */
  reason?: string;
  onBook?: (data: OptionData) => void;
  onSave?: (data: OptionData) => void;
  onCompare?: (data: OptionData) => void;
  onReverify?: () => void;
  defaultExpanded?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const cellStyle: React.CSSProperties = {
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

function RouteEyebrow({ data }: { data: OptionData }) {
  const dur = safeDuration(data.duration);
  const bits = [
    data.cabin ? CABIN_LABEL[data.cabin] : null,
    dur,
    data.stops === 0 ? 'Nonstop' : data.stops ? `${data.stops} stop${data.stops > 1 ? 's' : ''}` : null,
  ].filter(Boolean);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <span
        style={{
          fontFamily: MONO,
          fontSize: 11,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: INK,
          fontWeight: 500,
        }}
      >
        {data.from} → {data.to}
      </span>
      {bits.length > 0 && (
        <span style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.08em', color: INK_DIM }}>
          {bits.join('  ·  ')}
        </span>
      )}
    </div>
  );
}

function PricePair({ data }: { data: OptionData }) {
  const best = data.points && data.points.length > 0 ? data.points[0] : undefined;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {best ? (
          <>
            <span style={{ fontFamily: MONO, fontSize: 26, fontWeight: 500, letterSpacing: '-0.02em', color: INK }}>
              {formatPoints(best.points)} points
            </span>
            <span style={{ fontFamily: MONO, fontSize: 12, color: INK_MID }}>
              {best.program}
              {best.fees ? ` · ${formatCash(best.fees.amount, best.fees.currency)} in fees` : ''}
            </span>
          </>
        ) : data.cash ? (
          <span style={{ fontFamily: MONO, fontSize: 26, fontWeight: 500, letterSpacing: '-0.02em', color: INK }}>
            {formatCash(data.cash.amount, data.cash.currency)}
          </span>
        ) : null}
      </div>
      {/* The alternative, always shown beside — never gated. */}
      {best && data.cash && (
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontFamily: MONO, fontSize: 15, color: INK_MID }}>{formatCash(data.cash.amount, data.cash.currency)}</span>
          <span style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: INK_DIM }}>
            in cash
          </span>
        </div>
      )}
    </div>
  );
}

export default function Option({
  data,
  state = 'loaded',
  pending,
  reason,
  onBook,
  onSave,
  onCompare,
  onReverify,
  defaultExpanded = false,
  className,
  style,
}: OptionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (state === 'loading') {
    return (
      <div className={className} style={{ ...cellStyle, ...style }} aria-busy="true" aria-label="Lining up an option">
        <SkeletonLine w={140} h={10} />
        <SkeletonLine w={220} h={20} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <SkeletonLine w={150} h={26} />
          <SkeletonLine w={70} h={16} />
        </div>
        <SkeletonLine w={110} h={34} radius={9999} />
      </div>
    );
  }

  if (state === 'failed') {
    return (
      <div className={className} style={{ ...cellStyle, ...style }} role="status">
        <span style={{ fontFamily: DISPLAY, fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em' }}>
          Couldn&rsquo;t line up this option
        </span>
        <span style={{ fontSize: 13.5, color: INK_MID }}>
          {reason || 'This could not be checked just now. Try again in a moment.'}
        </span>
        {onReverify && (
          <div>
            <QuietButton onClick={onReverify}>Try again</QuietButton>
          </div>
        )}
      </div>
    );
  }

  if (!data) return null;

  const est = data.estValue;
  const isPartial = state === 'partial';

  return (
    <div className={className} style={{ ...cellStyle, ...style }}>
      <RouteEyebrow data={data} />

      {data.verdict && (
        <span style={{ fontFamily: DISPLAY, fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          {data.verdict}
        </span>
      )}

      <PricePair data={data} />

      {est && (
        <span style={{ fontFamily: UI, fontSize: 13, color: INK_MID }}>
          Best-use value {formatCash(est.low, est.currency)} to {formatCash(est.high, est.currency)}
          {est.method ? ` · ${est.method}` : ''}
        </span>
      )}

      {isPartial && pending && pending.length > 0 && (
        <span style={{ fontFamily: MONO, fontSize: 11, color: INK_DIM }}>still checking: {pending.join(', ')}</span>
      )}

      {/* Actions — exactly one accent-filled CTA (§ visual kernel). */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {onBook && (
          <button
            type="button"
            onClick={() => onBook(data)}
            style={{
              background: ACCENT,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 9999,
              padding: '9px 18px',
              fontFamily: UI,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: 'var(--lift-hot, 0 10px 28px -10px rgba(108,61,232,0.38))',
            }}
          >
            Book
          </button>
        )}
        {onSave && <QuietButton onClick={() => onSave(data)}>Save</QuietButton>}
        {onCompare && <QuietButton onClick={() => onCompare(data)}>Compare</QuietButton>}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          style={{
            marginLeft: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontFamily: UI,
            fontSize: 13,
            color: INK_MID,
            padding: 4,
          }}
        >
          {expanded ? 'Hide details' : 'See why'}
          <ChevronDown size={14} style={{ transition: 'transform 160ms ease', transform: expanded ? 'rotate(180deg)' : 'none' }} aria-hidden />
        </button>
      </div>

      {/* Expert depth — same object, revealed on demand (§4.6) */}
      {expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderTop: `1px solid ${LINE}`, paddingTop: 12 }}>
          {data.segments && data.segments.length > 0 && (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data.segments.map((s, i) => {
                const sd = safeDuration(s.duration);
                return (
                  <li key={`${s.from}-${s.to}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Plane size={14} aria-hidden style={{ color: INK_DIM, flexShrink: 0 }} />
                    <span style={{ fontFamily: MONO, fontSize: 12.5, color: INK }}>
                      {s.from} → {s.to}
                    </span>
                    <span style={{ fontFamily: MONO, fontSize: 11, color: INK_MID }}>
                      {[s.carrier && s.flightNumber ? `${s.carrier}${s.flightNumber}` : s.carrier, s.aircraft, sd]
                        .filter(Boolean)
                        .join('  ·  ')}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          {data.constraints && data.constraints.length > 0 && (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {data.constraints.map((c, i) => (
                <li key={i} style={{ fontFamily: UI, fontSize: 12.5, color: INK_MID, display: 'flex', gap: 6 }}>
                  <span aria-hidden style={{ color: INK_DIM }}>–</span>
                  {c}
                </li>
              ))}
            </ul>
          )}

          {/* Every points option, side by side — no paywall on the alternatives */}
          {data.points && data.points.length > 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {data.points.slice(1).map((p, i) => (
                <span key={i} style={{ fontFamily: MONO, fontSize: 12, color: INK_MID }}>
                  {formatPoints(p.points)} points · {p.program}
                  {p.ratio ? ` · transfer ${p.ratio}` : ''}
                </span>
              ))}
            </div>
          )}

          {/* Evidence (§4.6.2) */}
          {data.receipt && (
            <SourceReceipt data={data.receipt} state={isPartial ? 'partial' : 'loaded'} onReverify={onReverify} />
          )}
        </div>
      )}
    </div>
  );
}

function QuietButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: 'transparent',
        color: INK,
        border: `1px solid ${LINE}`,
        borderRadius: 9999,
        padding: '8px 16px',
        fontFamily: UI,
        fontSize: 14,
        fontWeight: 500,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}

function SkeletonLine({ w, h, radius = 4 }: { w: number; h: number; radius?: number }) {
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-block',
        width: w,
        height: h,
        borderRadius: radius,
        background: `linear-gradient(90deg, ${LINE}, transparent)`,
      }}
    />
  );
}
