import { CheckCircle2, CalendarPlus, ExternalLink, Share2, LifeBuoy } from 'lucide-react';
import type { ConfirmationData, ConfirmationStatus } from '../../schemas/confirmation';
import type { WidgetState } from '../../schemas/sourceReceipt';
import SourceReceipt from './SourceReceipt';
import { MONO, DISPLAY, UI, INK, INK_MID, INK_DIM, LINE, CELL, ACCENT, LIFT } from './_shared';

/**
 * Confirmation — a completed commitment (§4.2), the payoff artifact.
 *
 * Leads with the real booking reference — the proof the thing happened; no
 * hollow success styling over an uncertain result (§4.3). Shows ownership
 * (B2B §10), the next step, and a recovery contact for when something goes
 * wrong. Actions: add to calendar, view, share. Four states (§4.3).
 */

const STATUS_LABEL: Record<ConfirmationStatus, string> = {
  confirmed: 'Confirmed',
  ticketed: 'Ticketed',
  pending: 'Pending',
};

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

export interface ConfirmationProps {
  data?: ConfirmationData;
  state?: WidgetState;
  reason?: string;
  onAddToCalendar?: (data: ConfirmationData) => void;
  onView?: (data: ConfirmationData) => void;
  onShare?: (data: ConfirmationData) => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function Confirmation({
  data,
  state = 'loaded',
  reason,
  onAddToCalendar,
  onView,
  onShare,
  className,
  style,
}: ConfirmationProps) {
  if (state === 'loading') {
    return (
      <div className={className} style={{ ...shell, ...style }} aria-busy="true" aria-label="Confirming">
        <Bar w={60} h={60} radius={9999} />
        <Bar w={220} h={18} />
        <Bar w={140} h={14} />
      </div>
    );
  }

  if (state === 'failed') {
    return (
      <div className={className} style={{ ...shell, ...style }} role="status">
        <span style={{ fontFamily: DISPLAY, fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em' }}>
          This didn&rsquo;t go through
        </span>
        <span style={{ fontSize: 13.5, color: INK_MID }}>
          {reason || 'The booking did not complete. Nothing was charged. Your points are untouched.'}
        </span>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className={className} style={{ ...shell, ...style }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <CheckCircle2 size={28} aria-hidden style={{ color: ACCENT, flexShrink: 0 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {data.status && (
              <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: ACCENT }}>
                {STATUS_LABEL[data.status]}
              </span>
            )}
            {data.owner && <span style={{ fontFamily: MONO, fontSize: 10, color: INK_DIM }}>· {data.owner}</span>}
          </div>
          <span style={{ fontFamily: DISPLAY, fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            {data.title}
          </span>
          {data.detail && <span style={{ fontFamily: UI, fontSize: 13, color: INK_MID }}>{data.detail}</span>}
        </div>
      </div>

      {/* The reference — the proof. Boarding-pass mono, prominent. */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          padding: '10px 14px',
          borderRadius: 12,
          border: `1px dashed ${LINE}`,
          background: 'var(--cell-2, #F1F0F6)',
        }}
      >
        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: INK_DIM }}>
          Reference
        </span>
        <span style={{ fontFamily: MONO, fontSize: 17, fontWeight: 500, letterSpacing: '0.08em', color: INK }}>
          {data.reference}
        </span>
      </div>

      {data.nextStep && (
        <span style={{ fontFamily: UI, fontSize: 13, color: INK_MID }}>Next: {data.nextStep}</span>
      )}

      {data.receipt && <SourceReceipt data={data.receipt} />}

      {/* Actions */}
      {(onAddToCalendar || onView || onShare) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {onAddToCalendar && (
            <ActionButton onClick={() => onAddToCalendar(data)} icon={<CalendarPlus size={14} aria-hidden />} primary>
              Add to calendar
            </ActionButton>
          )}
          {onView && (
            <ActionButton onClick={() => onView(data)} icon={<ExternalLink size={14} aria-hidden />}>
              View
            </ActionButton>
          )}
          {onShare && (
            <ActionButton onClick={() => onShare(data)} icon={<Share2 size={14} aria-hidden />}>
              Share
            </ActionButton>
          )}
        </div>
      )}

      {data.recoveryContact && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: UI, fontSize: 12, color: INK_DIM, borderTop: `1px solid ${LINE}`, paddingTop: 10 }}>
          <LifeBuoy size={13} aria-hidden />
          If something changes: {data.recoveryContact}
        </div>
      )}
    </div>
  );
}

function ActionButton({
  onClick,
  icon,
  primary,
  children,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  primary?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: primary ? ACCENT : 'transparent',
        color: primary ? '#FFFFFF' : INK,
        border: primary ? 'none' : `1px solid ${LINE}`,
        borderRadius: 9999,
        padding: primary ? '9px 16px' : '8px 14px',
        fontFamily: UI,
        fontSize: 13.5,
        fontWeight: primary ? 600 : 500,
        cursor: 'pointer',
        boxShadow: primary ? 'var(--lift-hot, 0 10px 28px -10px rgba(108,61,232,0.38))' : 'none',
      }}
    >
      {icon}
      {children}
    </button>
  );
}

function Bar({ w, h, radius = 8 }: { w?: number; h: number; radius?: number }) {
  return <span aria-hidden style={{ display: 'block', width: w ?? '100%', height: h, borderRadius: radius, background: `linear-gradient(90deg, ${LINE}, transparent)` }} />;
}
