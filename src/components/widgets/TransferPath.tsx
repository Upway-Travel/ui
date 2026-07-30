import { useState } from 'react';
import { ArrowRight, TriangleAlert, Clock } from 'lucide-react';
import { formatPoints } from '../../lib/formatters';
import type { TransferPathData } from '../../schemas/transferPath';
import type { WidgetState } from '../../schemas/sourceReceipt';
import SourceReceipt from './SourceReceipt';
import { MONO, DISPLAY, UI, INK, INK_MID, INK_DIM, LINE, CELL, ACCENT, LIFT, AMBER, formatCash } from './_shared';

/**
 * TransferPath — how points become a booking (§4.2), designed like a wire
 * transfer, not a shopping cart (§3.3).
 *
 * The commit state shows, WITHOUT expansion: what leaves and what arrives,
 * the ratio and bonus, that it is not instant, that it cannot be reversed,
 * and what the points are worth if the booking disappears mid-transfer.
 * Confirming requires a deliberate acknowledgement — the irreversibility
 * checkbox gates the confirm button. This is a legal architecture as much as
 * a UX one (§3.4, Moffatt).
 *
 * Four states (§4.3). The loaded state IS the commit state.
 */

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
  gap: 14,
};

export interface TransferPathProps {
  data?: TransferPathData;
  state?: WidgetState;
  reason?: string;
  /** Fired only after the user has acknowledged irreversibility. */
  onConfirm?: (data: TransferPathData) => void;
  onCancel?: () => void;
  onReverify?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function TransferPath({
  data,
  state = 'loaded',
  reason,
  onConfirm,
  onCancel,
  onReverify,
  className,
  style,
}: TransferPathProps) {
  const [acknowledged, setAcknowledged] = useState(false);

  if (state === 'loading') {
    return (
      <div className={className} style={{ ...shell, ...style }} aria-busy="true" aria-label="Working out the transfer">
        <Bar w={180} h={12} />
        <Bar w={undefined} h={54} />
        <Bar w={220} h={14} />
      </div>
    );
  }

  if (state === 'failed') {
    return (
      <div className={className} style={{ ...shell, ...style }} role="status">
        <span style={{ fontFamily: DISPLAY, fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em' }}>
          Couldn&rsquo;t work out this transfer
        </span>
        <span style={{ fontSize: 13.5, color: INK_MID }}>{reason || 'This could not be checked just now. No points have moved.'}</span>
        {onReverify && (
          <div>
            <button type="button" onClick={onReverify} style={quietBtn}>Try again</button>
          </div>
        )}
      </div>
    );
  }

  if (!data) return null;

  const irreversible = data.irreversible !== false;
  const isInstant = data.instant === true;
  const isPartial = state === 'partial';

  return (
    <div className={className} style={{ ...shell, ...style }}>
      {/* Header — this is a commitment, not a purchase */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: AMBER }}>
          Transfer points
        </span>
        {data.forBooking && (
          <span style={{ fontFamily: DISPLAY, fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            For {data.forBooking}
          </span>
        )}
      </div>

      {/* What leaves → what arrives, laid out like a transfer slip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 16px',
          borderRadius: 12,
          border: `1px solid ${LINE}`,
          background: 'var(--cell-2, #F1F0F6)',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: INK_DIM }}>Leaves</span>
          <span style={{ fontFamily: MONO, fontSize: 18, fontWeight: 500, color: INK }}>{formatPoints(data.from.points)}</span>
          <span style={{ fontFamily: UI, fontSize: 12, color: INK_MID }}>{data.from.program}</span>
        </div>
        <ArrowRight size={18} aria-hidden style={{ color: INK_DIM, flexShrink: 0 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: INK_DIM }}>Arrives</span>
          <span style={{ fontFamily: MONO, fontSize: 18, fontWeight: 500, color: INK }}>{formatPoints(data.to.points)}</span>
          <span style={{ fontFamily: UI, fontSize: 12, color: INK_MID }}>{data.to.program}</span>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <span style={{ fontFamily: MONO, fontSize: 12, color: INK_MID }}>ratio {data.ratio}</span>
          {data.bonus && (
            <div style={{ fontFamily: MONO, fontSize: 11, color: ACCENT }}>
              +{data.bonus.percent}% bonus{data.bonus.validTo ? ` · ends ${data.bonus.validTo}` : ''}
            </div>
          )}
        </div>
      </div>

      {/* The three facts that must always be visible (§3.3) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Fact
          icon={<Clock size={14} aria-hidden style={{ color: isInstant ? INK_DIM : AMBER }} />}
          text={isInstant ? `Transfer is usually instant (${data.transferTime}).` : `This is not instant. Expect ${data.transferTime}.`}
          tone={isInstant ? 'quiet' : 'warn'}
        />
        {irreversible && (
          <Fact
            icon={<TriangleAlert size={14} aria-hidden style={{ color: AMBER }} />}
            text="This cannot be reversed. Once the points leave, they cannot come back."
            tone="warn"
          />
        )}
        {data.fallbackValue && (
          <Fact
            icon={<TriangleAlert size={14} aria-hidden style={{ color: AMBER }} />}
            text={`If this booking is gone when your points arrive, they would be worth about ${formatCash(
              data.fallbackValue.low,
              data.fallbackValue.currency,
            )} to ${formatCash(data.fallbackValue.high, data.fallbackValue.currency)} in ${data.to.program}.`}
            tone="warn"
          />
        )}
      </div>

      {data.receipt && <SourceReceipt data={data.receipt} state={isPartial ? 'partial' : 'loaded'} onReverify={onReverify} />}

      {/* Deliberate confirmation — the acknowledgement gates the confirm (§3.1 Commit) */}
      {onConfirm && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {irreversible && (
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer', fontFamily: UI, fontSize: 13, color: INK }}>
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                style={{ marginTop: 2, accentColor: 'var(--color-brand, #6C3DE8)' }}
              />
              I understand this moves my points and cannot be undone.
            </label>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              disabled={irreversible && !acknowledged}
              onClick={() => onConfirm(data)}
              style={{
                background: irreversible && !acknowledged ? 'var(--cell-2, #F1F0F6)' : ACCENT,
                color: irreversible && !acknowledged ? INK_DIM : '#FFFFFF',
                border: 'none',
                borderRadius: 9999,
                padding: '10px 20px',
                fontFamily: UI,
                fontSize: 14,
                fontWeight: 600,
                cursor: irreversible && !acknowledged ? 'not-allowed' : 'pointer',
                boxShadow: irreversible && !acknowledged ? 'none' : 'var(--lift-hot, 0 10px 28px -10px rgba(108,61,232,0.38))',
              }}
            >
              Confirm transfer
            </button>
            {onCancel && (
              <button type="button" onClick={onCancel} style={quietBtn}>
                Not yet
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Fact({ icon, text, tone }: { icon: React.ReactNode; text: string; tone: 'quiet' | 'warn' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
      <span style={{ flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <span style={{ fontFamily: UI, fontSize: 13, color: tone === 'warn' ? INK : INK_MID, fontWeight: tone === 'warn' ? 500 : 400 }}>
        {text}
      </span>
    </div>
  );
}

const quietBtn: React.CSSProperties = {
  background: 'transparent',
  color: INK,
  border: `1px solid ${LINE}`,
  borderRadius: 9999,
  padding: '10px 18px',
  fontFamily: UI,
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
};

function Bar({ w, h }: { w?: number; h: number }) {
  return (
    <span aria-hidden style={{ display: 'block', width: w ?? '100%', height: h, borderRadius: 8, background: `linear-gradient(90deg, ${LINE}, transparent)` }} />
  );
}
