import { useMemo, useState } from 'react';
import { ChevronDown, RotateCw } from 'lucide-react';
import type { SourceReceiptData, WidgetState } from '../../schemas/sourceReceipt';

/**
 * SourceReceipt — the signature provenance element (design §5.6, §6).
 *
 * A compact thermal-receipt strip: mono type, a perforated top rule, four
 * INDEPENDENT provenance signals (authority · freshness · completeness ·
 * confidence). It answers the one question a general chatbot cannot: "why
 * should I believe this, and how recently was it checked?"
 *
 * Rules it enforces in code:
 *  • Authority is the underlying authority, never the data vendor (§6.2).
 *  • Freshness decays — fresh / ageing / stale / unknown (§6.1) — and stale
 *    surfaces a re-verify affordance. Status is never colour-only: the label
 *    always carries the plain-text state too (§15.3).
 *  • It must expand to usable sourcing (§5.6) and never render over demo data.
 *  • Provenance is accessible: the strip has a summarising aria-label (§15.3).
 *
 * Four states per the render contract (§4.3): loading, loaded, partial, failed.
 */

const MONO = 'var(--font-mono, "Geist Mono", ui-monospace, monospace)';
const INK = 'var(--ink, var(--text, #12121A))';
const INK_MID = 'var(--ink-mid, rgba(18,18,26,0.62))';
const INK_DIM = 'var(--ink-dim, rgba(18,18,26,0.40))';
const LINE = 'var(--line, rgba(18,18,26,0.14))';
const ACCENT = 'var(--color-brand, var(--violet, #6C3DE8))';
// Departure-board amber for ageing/stale freshness. Semantic status colour,
// deliberately NOT the brand accent (§11) — paired with a text label so the
// signal is never colour-only (§15.3).
const AGE = '#B26B00';

type FreshnessTier = 'fresh' | 'ageing' | 'stale' | 'unknown';

function computeFreshness(verifiedAt?: string): { tier: FreshnessTier; label: string } {
  if (!verifiedAt) return { tier: 'unknown', label: 'freshness unknown' };
  const t = Date.parse(verifiedAt);
  if (Number.isNaN(t)) return { tier: 'unknown', label: 'freshness unknown' };
  const mins = (Date.now() - t) / 60000;
  if (mins < 1) return { tier: 'fresh', label: 'verified just now' };
  if (mins < 5) return { tier: 'fresh', label: `verified ${Math.round(mins)} min ago` };
  if (mins < 60) return { tier: 'ageing', label: `verified ${Math.round(mins)} min ago` };
  const hours = mins / 60;
  if (hours < 24) return { tier: 'stale', label: `checked ${Math.round(hours)}h ago` };
  return { tier: 'stale', label: `checked ${Math.round(hours / 24)}d ago` };
}

function freshnessColor(tier: FreshnessTier): string {
  return tier === 'ageing' || tier === 'stale' ? AGE : INK_DIM;
}

export interface SourceReceiptProps {
  /** Validated receipt data. Required for loaded/partial; ignored for loading/failed. */
  data?: SourceReceiptData;
  /** Render-contract state (§4.3). Default 'loaded'. */
  state?: WidgetState;
  /** Partial state: authorities that did not return, shown as still-pending. */
  missing?: string[];
  /** Failed state: a one-line, honest reason. No fabricated data is shown. */
  reason?: string;
  /** Re-verify handler. Shown when freshness is stale, or in the failed state. */
  onReverify?: () => void;
  /** Start with the full sourcing expanded. Default false. */
  defaultExpanded?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const shellStyle: React.CSSProperties = {
  fontFamily: MONO,
  fontSize: 11,
  lineHeight: 1.4,
  color: INK_MID,
  // Perforated top rule — the thermal-receipt tear edge (§5.6).
  borderTop: `1px dashed ${LINE}`,
  paddingTop: 6,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

function Dot() {
  return (
    <span aria-hidden style={{ color: INK_DIM, padding: '0 2px' }}>
      ·
    </span>
  );
}

export default function SourceReceipt({
  data,
  state = 'loaded',
  missing,
  reason,
  onReverify,
  defaultExpanded = false,
  className,
  style,
}: SourceReceiptProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const fresh = useMemo(() => computeFreshness(data?.verifiedAt), [data?.verifiedAt]);

  // ── Loading — a skeleton strip matching the final layout (§4.3), not a spinner.
  if (state === 'loading') {
    return (
      <div className={className} style={{ ...shellStyle, ...style }} aria-busy="true" aria-label="Checking sources">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              display: 'inline-block',
              height: 9,
              width: 130,
              borderRadius: 2,
              background: `linear-gradient(90deg, ${LINE}, transparent)`,
            }}
          />
          <span style={{ color: INK_DIM }}>checking sources…</span>
        </div>
      </div>
    );
  }

  // ── Failed — honest. No source, no fabricated freshness (§4.3, §17).
  if (state === 'failed') {
    return (
      <div className={className} style={{ ...shellStyle, ...style }} role="status">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: AGE }}>
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.14em' }}>Not verified</span>
          <span style={{ color: INK_MID }}>{reason || 'This could not be checked just now.'}</span>
          {onReverify && <ReverifyButton onReverify={onReverify} />}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const isPartial = state === 'partial';
  const claim = data.claim?.toUpperCase();
  const ariaParts = [
    data.claim ? `${data.claim}.` : '',
    `Source ${data.authority}.`,
    fresh.label + '.',
    data.completeness
      ? `${data.completeness.checked} of ${data.completeness.total} ${data.completeness.unit} checked.`
      : '',
    data.confidence ? `Confidence ${data.confidence.level}, ${data.confidence.basis}.` : '',
    isPartial ? 'Result is partial.' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const canExpand = (data.sources?.length ?? 0) > 0;

  return (
    <div className={className} style={{ ...shellStyle, ...style }} aria-label={ariaParts}>
      {/* Headline strip */}
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        {claim && (
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.14em', color: INK, fontWeight: 500 }}>
            {claim}
          </span>
        )}
        {claim && <Dot />}
        <span style={{ color: INK }}>{data.authority}</span>
        <Dot />
        <span style={{ color: freshnessColor(fresh.tier) }}>{fresh.label}</span>
        {data.detail && (
          <>
            <Dot />
            <span style={{ color: INK_MID }}>{data.detail}</span>
          </>
        )}
        {isPartial && (
          <>
            <Dot />
            <span style={{ textTransform: 'uppercase', letterSpacing: '0.12em', color: AGE }}>partial</span>
          </>
        )}
        {canExpand && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label={expanded ? 'Hide full sourcing' : 'Show full sourcing'}
            style={{
              marginLeft: 4,
              display: 'inline-flex',
              alignItems: 'center',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: INK_DIM,
              padding: 2,
            }}
          >
            <ChevronDown
              size={12}
              style={{ transition: 'transform 160ms ease', transform: expanded ? 'rotate(180deg)' : 'none' }}
              aria-hidden
            />
          </button>
        )}
      </div>

      {/* Secondary strip — completeness + confidence, each independent (§6) */}
      {(data.completeness || data.confidence) && (
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, color: INK_MID }}>
          {data.completeness && (
            <span>
              {data.completeness.checked} of {data.completeness.total} {data.completeness.unit} checked
            </span>
          )}
          {data.completeness && data.confidence && <Dot />}
          {data.confidence && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span
                style={{
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: data.confidence.level === 'low' ? AGE : ACCENT,
                }}
              >
                {data.confidence.level} confidence
              </span>
              <span style={{ color: INK_DIM }}>{data.confidence.basis}</span>
            </span>
          )}
        </div>
      )}

      {/* Stale freshness earns an explicit re-verify affordance (§6.1) */}
      {fresh.tier === 'stale' && onReverify && (
        <div>
          <ReverifyButton onReverify={onReverify} />
        </div>
      )}

      {/* Partial: name the authorities that have not returned yet */}
      {isPartial && missing && missing.length > 0 && (
        <div style={{ color: INK_DIM }}>
          still waiting on: {missing.join(', ')}
        </div>
      )}

      {/* Expanded full sourcing (§5.6) */}
      {expanded && data.sources && data.sources.length > 0 && (
        <ul style={{ listStyle: 'none', margin: '2px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {data.sources.map((s, i) => {
            const sf = computeFreshness(s.verifiedAt);
            return (
              <li key={`${s.authority}-${i}`} style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span aria-hidden style={{ color: INK_DIM }}>–</span>
                <span style={{ color: INK }}>{s.authority}</span>
                {s.note && <span style={{ color: INK_MID }}>{s.note}</span>}
                <span style={{ color: freshnessColor(sf.tier) }}>{sf.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function ReverifyButton({ onReverify }: { onReverify: () => void }) {
  return (
    <button
      type="button"
      onClick={onReverify}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        background: 'transparent',
        border: `1px solid ${LINE}`,
        borderRadius: 6,
        padding: '2px 8px',
        cursor: 'pointer',
        fontFamily: MONO,
        fontSize: 10,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: ACCENT,
      }}
    >
      <RotateCw size={11} aria-hidden />
      Re-verify
    </button>
  );
}
