import { Info, Eye, TriangleAlert, X } from 'lucide-react';
import type { AlertData, AlertSeverity } from '../../schemas/alert';
import type { WidgetState } from '../../schemas/sourceReceipt';
import SourceReceipt from './SourceReceipt';
import { MONO, DISPLAY, UI, INK, INK_MID, INK_DIM, LINE, CELL, ACCENT, AMBER, LIFT } from './_shared';

/**
 * Alert — something changed (§4.2). Severity, the consequence for this
 * holder, and exactly one next action. A left severity stripe encodes state
 * in FORM as well as colour (§15.3, no colour-only) so what needs attention
 * reads at a glance. Four states (§4.3).
 */

const SEV: Record<AlertSeverity, { color: string; label: string; Icon: typeof Info }> = {
  info: { color: 'var(--color-brand, #6C3DE8)', label: 'Heads up', Icon: Info },
  watch: { color: AMBER, label: 'Worth watching', Icon: Eye },
  urgent: { color: '#C0362C', label: 'Act soon', Icon: TriangleAlert },
};

export interface AlertProps {
  data?: AlertData;
  state?: WidgetState;
  reason?: string;
  onAct?: (data: AlertData) => void;
  onDismiss?: (data: AlertData) => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function Alert({ data, state = 'loaded', reason, onAct, onDismiss, className, style }: AlertProps) {
  if (state === 'loading') {
    return (
      <div className={className} style={{ ...shell('var(--line, rgba(18,18,26,0.14))'), ...style }} aria-busy="true" aria-label="Loading alert">
        <Bar w={200} h={14} />
        <Bar w={undefined} h={12} />
      </div>
    );
  }

  if (state === 'failed') {
    return (
      <div className={className} style={{ ...shell('var(--line, rgba(18,18,26,0.14))'), ...style }} role="status">
        <span style={{ fontSize: 13.5, color: INK_MID }}>{reason || 'An alert could not be loaded.'}</span>
      </div>
    );
  }

  if (!data) return null;

  const sev = SEV[data.severity];
  const isPartial = state === 'partial';

  return (
    <div className={className} style={{ ...shell(sev.color), ...style }} role="status">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <sev.Icon size={16} aria-hidden style={{ color: sev.color, flexShrink: 0, marginTop: 2 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: sev.color }}>
              {sev.label}
            </span>
            {data.deadline && (
              <span style={{ fontFamily: MONO, fontSize: 10, color: INK_DIM }}>· {data.deadline}</span>
            )}
          </div>
          <span style={{ fontFamily: DISPLAY, fontSize: 16, fontWeight: 600, letterSpacing: '-0.015em', lineHeight: 1.2, color: INK }}>
            {data.title}
          </span>
          <span style={{ fontFamily: UI, fontSize: 13, color: INK_MID }}>{data.consequence}</span>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={() => onDismiss(data)}
            aria-label="Dismiss alert"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: INK_DIM, padding: 2, flexShrink: 0 }}
          >
            <X size={14} aria-hidden />
          </button>
        )}
      </div>

      {data.receipt && <SourceReceipt data={data.receipt} state={isPartial ? 'partial' : 'loaded'} />}

      {data.action && onAct && (
        <div>
          <button
            type="button"
            onClick={() => onAct(data)}
            style={{
              background: ACCENT,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 9999,
              padding: '8px 16px',
              fontFamily: UI,
              fontSize: 13.5,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: 'var(--lift-hot, 0 10px 28px -10px rgba(108,61,232,0.38))',
            }}
          >
            {data.action.label}
          </button>
        </div>
      )}
    </div>
  );
}

function shell(stripe: string): React.CSSProperties {
  return {
    background: CELL,
    border: `1px solid ${LINE}`,
    // Severity stripe — state encoded in form, not colour alone (§15.3).
    borderLeft: `3px solid ${stripe}`,
    borderRadius: 12,
    boxShadow: LIFT,
    padding: '12px 14px',
    fontFamily: UI,
    color: INK,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  };
}

function Bar({ w, h }: { w?: number; h: number }) {
  return <span aria-hidden style={{ display: 'block', width: w ?? '100%', height: h, borderRadius: 6, background: `linear-gradient(90deg, ${LINE}, transparent)` }} />;
}
