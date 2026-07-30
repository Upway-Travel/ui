import { TrendingUp, TrendingDown, Minus, Bell } from 'lucide-react';
import { formatPoints } from '../../lib/formatters';
import type { PriceHistoryData } from '../../schemas/priceHistory';
import type { WidgetState } from '../../schemas/sourceReceipt';
import SourceReceipt from './SourceReceipt';
import { MONO, DISPLAY, UI, INK, INK_MID, INK_DIM, LINE, CELL, ACCENT, AMBER, LIFT, formatCash } from './_shared';

/**
 * PriceHistory — price or value movement (§4.2). A sparkline given the same
 * care as type: a faint area fill, the typical-range band it is judged
 * against, and an emphasized current endpoint. States the current figure vs
 * typical in words (below/around/above), never colour-only (§15.3). One
 * action: set an alert. Four states (§4.3).
 */

const W = 320;
const H = 72;
const PAD = 4;
const DANGER = '#C0362C';

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

export interface PriceHistoryProps {
  data?: PriceHistoryData;
  state?: WidgetState;
  reason?: string;
  onSetAlert?: (data: PriceHistoryData) => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function PriceHistory({ data, state = 'loaded', reason, onSetAlert, className, style }: PriceHistoryProps) {
  if (state === 'loading') {
    return (
      <div className={className} style={{ ...shell, ...style }} aria-busy="true" aria-label="Loading price history">
        <Bar w={180} h={14} />
        <Bar w={undefined} h={H} />
      </div>
    );
  }

  if (state === 'failed') {
    return (
      <div className={className} style={{ ...shell, ...style }} role="status">
        <span style={{ fontSize: 13.5, color: INK_MID }}>{reason || 'Price history could not be loaded just now.'}</span>
      </div>
    );
  }

  if (!data) return null;

  const fmt = (v: number) => (data.unit === 'cash' ? formatCash(v, data.currency) : `${formatPoints(v)} pts`);

  const values = data.series.map((p) => p.value);
  const lo = Math.min(...values, data.typical?.low ?? Infinity);
  const hi = Math.max(...values, data.typical?.high ?? -Infinity);
  const span = hi - lo || 1;
  const x = (i: number) => PAD + (i / (data.series.length - 1)) * (W - PAD * 2);
  const y = (v: number) => PAD + (1 - (v - lo) / span) * (H - PAD * 2);

  const line = data.series.map((p, i) => `${x(i)},${y(p.value)}`).join(' ');
  const area = `${PAD},${H - PAD} ${line} ${W - PAD},${H - PAD}`;

  // Current vs typical, stated in words.
  let vsTypical: { text: string; color: string } | null = null;
  if (data.typical) {
    if (data.current < data.typical.low) vsTypical = { text: 'below typical — a good time', color: ACCENT };
    else if (data.current > data.typical.high) vsTypical = { text: 'above typical — worth waiting', color: AMBER };
    else vsTypical = { text: 'around typical', color: INK_MID };
  }

  const TrendIcon = data.trend === 'up' ? TrendingUp : data.trend === 'down' ? TrendingDown : Minus;
  const bandTop = data.typical ? y(data.typical.high) : 0;
  const bandH = data.typical ? Math.max(0, y(data.typical.low) - y(data.typical.high)) : 0;
  const isPartial = state === 'partial';

  return (
    <div className={className} style={{ ...shell, ...style }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {data.label && (
            <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: INK_DIM }}>
              {data.label}
            </span>
          )}
          <span style={{ fontFamily: MONO, fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em', color: INK }}>{fmt(data.current)}</span>
        </div>
        {data.trend && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: MONO, fontSize: 12, color: INK_MID }}>
            <TrendIcon size={14} aria-hidden />
            {data.trend}
          </span>
        )}
      </div>

      {/* Sparkline */}
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label={`Price trend, currently ${fmt(data.current)}${vsTypical ? ', ' + vsTypical.text : ''}`} style={{ display: 'block' }}>
        {data.typical && (
          <rect x={0} y={bandTop} width={W} height={bandH} fill="var(--color-brand, #6C3DE8)" opacity={0.06} />
        )}
        <polygon points={area} fill="var(--color-brand, #6C3DE8)" opacity={0.08} />
        <polyline points={line} fill="none" stroke="var(--color-brand, #6C3DE8)" strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={x(data.series.length - 1)} cy={y(data.series[data.series.length - 1].value)} r={3.5} fill="var(--color-brand, #6C3DE8)" />
      </svg>

      {vsTypical && (
        <span style={{ fontFamily: UI, fontSize: 13, color: vsTypical.color, fontWeight: 500 }}>
          {data.typical && `Typical ${fmt(data.typical.low)} to ${fmt(data.typical.high)} · `}
          {vsTypical.text}
        </span>
      )}

      {data.receipt && <SourceReceipt data={data.receipt} state={isPartial ? 'partial' : 'loaded'} />}

      {onSetAlert && (
        <div>
          <button
            type="button"
            onClick={() => onSetAlert(data)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
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
            <Bell size={14} aria-hidden />
            Set an alert
          </button>
        </div>
      )}
    </div>
  );
}

function Bar({ w, h }: { w?: number; h: number }) {
  return <span aria-hidden style={{ display: 'block', width: w ?? '100%', height: h, borderRadius: 8, background: `linear-gradient(90deg, ${LINE}, transparent)` }} />;
}
