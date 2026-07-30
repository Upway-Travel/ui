import { Check, X, Loader2, Circle, Minus } from 'lucide-react';
import type { TimelineData, TimelineStepStatus } from '../../schemas/timeline';
import type { WidgetState } from '../../schemas/sourceReceipt';
import { MONO, DISPLAY, UI, INK, INK_MID, INK_DIM, LINE, CELL, ACCENT, AMBER, LIFT } from './_shared';

/**
 * Timeline — a sequence of events (§4.2). A vertical stepper whose status is
 * encoded in the node ICON as well as colour (§15.3, no colour-only): done,
 * active (the visible thinking state, §7.1), pending, failed, skipped. Steps
 * can carry a detail and a changed-assumption note. Four states (§4.3).
 */

const DANGER = '#C0362C';

function StepNode({ status }: { status: TimelineStepStatus }) {
  const base = { flexShrink: 0 } as React.CSSProperties;
  switch (status) {
    case 'done':
      return <Check size={13} aria-label="Done" style={{ ...base, color: ACCENT }} />;
    case 'active':
      return <Loader2 size={13} aria-label="In progress" className="upway-tl-spin" style={{ ...base, color: ACCENT }} />;
    case 'failed':
      return <X size={13} aria-label="Failed" style={{ ...base, color: DANGER }} />;
    case 'skipped':
      return <Minus size={13} aria-label="Skipped" style={{ ...base, color: INK_DIM }} />;
    default:
      return <Circle size={11} aria-label="Pending" style={{ ...base, color: INK_DIM }} />;
  }
}

function statusColor(status: TimelineStepStatus): string {
  if (status === 'failed') return DANGER;
  if (status === 'pending' || status === 'skipped') return INK_MID;
  return INK;
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

export interface TimelineProps {
  data?: TimelineData;
  state?: WidgetState;
  reason?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function Timeline({ data, state = 'loaded', reason, className, style }: TimelineProps) {
  if (state === 'loading') {
    return (
      <div className={className} style={{ ...shell, ...style }} aria-busy="true" aria-label="Working">
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Bar w={13} h={13} radius={9999} />
            <Bar w={160 - i * 20} h={12} />
          </div>
        ))}
      </div>
    );
  }

  if (state === 'failed') {
    return (
      <div className={className} style={{ ...shell, ...style }} role="status">
        <span style={{ fontSize: 13.5, color: INK_MID }}>{reason || 'This sequence could not be loaded.'}</span>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className={className} style={{ ...shell, ...style }}>
      <style>{`@keyframes upway-tl-spin{to{transform:rotate(360deg)}}.upway-tl-spin{animation:upway-tl-spin 1s linear infinite}@media (prefers-reduced-motion: reduce){.upway-tl-spin{animation:none}}`}</style>
      {data.title && (
        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: INK_DIM }}>
          {data.title}
        </span>
      )}
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
        {data.steps.map((s, i) => {
          const last = i === data.steps.length - 1;
          return (
            <li key={i} style={{ display: 'flex', gap: 10 }}>
              {/* Node + connector rail */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 14 }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 20 }}>
                  <StepNode status={s.status} />
                </span>
                {!last && <span aria-hidden style={{ flex: 1, width: 1, background: LINE, minHeight: 14 }} />}
              </div>
              {/* Body */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: last ? 0 : 12, flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: UI, fontSize: 14, fontWeight: s.status === 'active' ? 600 : 500, color: statusColor(s.status) }}>
                    {s.label}
                  </span>
                  {s.at && <span style={{ fontFamily: MONO, fontSize: 10, color: INK_DIM }}>{s.at}</span>}
                </div>
                {s.detail && <span style={{ fontFamily: UI, fontSize: 12.5, color: INK_MID }}>{s.detail}</span>}
                {s.note && (
                  <span style={{ fontFamily: UI, fontSize: 12, color: AMBER }}>
                    Changed: {s.note}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Bar({ w, h, radius = 6 }: { w?: number; h: number; radius?: number }) {
  return <span aria-hidden style={{ display: 'block', width: w ?? '100%', height: h, borderRadius: radius, background: `linear-gradient(90deg, ${LINE}, transparent)` }} />;
}
