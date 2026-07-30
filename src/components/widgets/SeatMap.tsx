import { useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import ScoreRing from '../ScoreRing';
import type { SeatMapData, Seat, SeatStatus } from '../../schemas/seatMap';
import type { WidgetState } from '../../schemas/sourceReceipt';
import SourceReceipt from './SourceReceipt';
import { MONO, DISPLAY, UI, INK, INK_MID, INK_DIM, LINE, CELL, ACCENT, LIFT, CABIN_LABEL } from './_shared';

/**
 * SeatMap — cabin and hard product (§4.2). The novice view is the summary:
 * aircraft, variant, configuration and a seat-quality score (composing the
 * kernel ScoreRing). The expert depth is the selectable seat grid, revealed
 * on zoom. Seat status is encoded in shape/label as well as fill so it is
 * never colour-only (§15.3). Actions: zoom, select. Four states (§4.3).
 */

function seatFill(s: Seat): { bg: string; border: string; color: string } {
  switch (s.status) {
    case 'selected':
      return { bg: ACCENT, border: ACCENT, color: '#FFFFFF' };
    case 'occupied':
      return { bg: 'var(--cell-2, #F1F0F6)', border: LINE, color: INK_DIM };
    case 'blocked':
      return { bg: 'transparent', border: LINE, color: INK_DIM };
    default:
      return { bg: CELL, border: 'color-mix(in srgb, var(--color-brand, #6C3DE8) 35%, transparent)', color: INK };
  }
}

/** Parse "1-2-1" into group sizes for aisle spacing. */
function groupsFrom(config?: string): number[] | null {
  if (!config) return null;
  const parts = config.split('-').map((n) => parseInt(n, 10));
  return parts.every((n) => Number.isFinite(n) && n > 0) ? parts : null;
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

export interface SeatMapProps {
  data?: SeatMapData;
  state?: WidgetState;
  reason?: string;
  onSelectSeat?: (seat: Seat) => void;
  defaultZoomed?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function SeatMap({ data, state = 'loaded', reason, onSelectSeat, defaultZoomed = false, className, style }: SeatMapProps) {
  const [zoomed, setZoomed] = useState(defaultZoomed);

  if (state === 'loading') {
    return (
      <div className={className} style={{ ...shell, ...style }} aria-busy="true" aria-label="Loading seat map">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Bar w={56} h={56} radius={9999} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Bar w={180} h={14} />
            <Bar w={120} h={12} />
          </div>
        </div>
      </div>
    );
  }

  if (state === 'failed') {
    return (
      <div className={className} style={{ ...shell, ...style }} role="status">
        <span style={{ fontSize: 13.5, color: INK_MID }}>{reason || 'The seat map could not be loaded just now.'}</span>
      </div>
    );
  }

  if (!data) return null;

  const groups = groupsFrom(data.configuration);
  const hasGrid = data.rows && data.rows.length > 0;
  const isPartial = state === 'partial';

  return (
    <div className={className} style={{ ...shell, ...style }}>
      {/* Summary — the novice view */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {data.hardProductScore !== undefined && <ScoreRing score={data.hardProductScore} size={54} showLabel />}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1, minWidth: 0 }}>
          <span style={{ fontFamily: DISPLAY, fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            {data.aircraft}
          </span>
          <span style={{ fontFamily: MONO, fontSize: 11, color: INK_MID }}>
            {[data.cabin ? CABIN_LABEL[data.cabin] : null, data.configuration, data.variant].filter(Boolean).join('  ·  ')}
          </span>
          {data.hardProductNote && <span style={{ fontFamily: UI, fontSize: 12.5, color: INK_MID }}>{data.hardProductNote}</span>}
        </div>
        {hasGrid && (
          <button
            type="button"
            onClick={() => setZoomed((v) => !v)}
            aria-expanded={zoomed}
            aria-label={zoomed ? 'Collapse seat map' : 'Zoom into seat map'}
            style={{ background: 'transparent', border: `1px solid ${LINE}`, borderRadius: 9999, padding: 7, cursor: 'pointer', color: INK_MID, flexShrink: 0 }}
          >
            {zoomed ? <Minimize2 size={14} aria-hidden /> : <Maximize2 size={14} aria-hidden />}
          </button>
        )}
      </div>

      {/* Expert depth — the selectable grid */}
      {hasGrid && zoomed && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, borderTop: `1px solid ${LINE}`, paddingTop: 12, overflowX: 'auto' }}>
          {data.rows!.map((r) => (
            <div key={r.row} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontFamily: MONO, fontSize: 10, color: INK_DIM, width: 20, textAlign: 'right', flexShrink: 0 }}>{r.row}</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {r.seats.map((s, si) => {
                  const fill = seatFill(s);
                  const clickable = s.status === 'available' && !!onSelectSeat;
                  // Aisle gap after each configuration group.
                  let gapAfter = false;
                  if (groups) {
                    let acc = 0;
                    for (const g of groups) {
                      acc += g;
                      if (si + 1 === acc && si + 1 < r.seats.length) gapAfter = true;
                    }
                  }
                  return (
                    <span key={s.id} style={{ display: 'inline-flex', marginRight: gapAfter ? 12 : 0 }}>
                      <button
                        type="button"
                        disabled={!clickable}
                        onClick={clickable ? () => onSelectSeat!(s) : undefined}
                        title={[s.id, s.note, s.status].filter(Boolean).join(' · ')}
                        aria-label={`Seat ${s.id}, ${s.status}${s.note ? ', ' + s.note : ''}`}
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 5,
                          background: fill.bg,
                          border: `1px solid ${fill.border}`,
                          color: fill.color,
                          fontFamily: MONO,
                          fontSize: 8,
                          cursor: clickable ? 'pointer' : 'default',
                          padding: 0,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {s.id.replace(/^\d+/, '')}
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
          <Legend />
        </div>
      )}

      {data.receipt && <SourceReceipt data={data.receipt} state={isPartial ? 'partial' : 'loaded'} />}
    </div>
  );
}

function Legend() {
  const items: { label: string; status: SeatStatus }[] = [
    { label: 'Open', status: 'available' },
    { label: 'Taken', status: 'occupied' },
    { label: 'Yours', status: 'selected' },
  ];
  return (
    <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
      {items.map(({ label, status }) => {
        const fill = seatFill({ id: '', status });
        return (
          <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: MONO, fontSize: 10, color: INK_DIM }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: fill.bg, border: `1px solid ${fill.border}` }} aria-hidden />
            {label}
          </span>
        );
      })}
    </div>
  );
}

function Bar({ w, h, radius = 8 }: { w?: number; h: number; radius?: number }) {
  return <span aria-hidden style={{ display: 'block', width: w ?? '100%', height: h, borderRadius: radius, background: `linear-gradient(90deg, ${LINE}, transparent)` }} />;
}
