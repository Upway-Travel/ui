import { useState } from 'react';
import { Plane, TriangleAlert, ChevronDown, Clock } from 'lucide-react';
import type { ItineraryData, ItinerarySegment } from '../../schemas/itinerary';
import type { WidgetState } from '../../schemas/sourceReceipt';
import SourceReceipt from './SourceReceipt';
import { MONO, DISPLAY, UI, INK, INK_MID, INK_DIM, LINE, CELL, ACCENT, AMBER, LIFT, CABIN_LABEL, safeDuration } from './_shared';

/**
 * Itinerary — a multi-segment trip (§4.2). A segment-by-segment view with the
 * layovers laid out between legs, each carrying its own warning (short
 * connection, terminal change, overnight). Expanding a segment reveals its
 * detail; trip-level warnings sit up top where they cannot be missed.
 * Actions: modify, save. Four states (§4.3).
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
  gap: 12,
};

function timeOf(iso?: string): string | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return iso;
  return new Date(t).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export interface ItineraryProps {
  data?: ItineraryData;
  state?: WidgetState;
  reason?: string;
  onModify?: (data: ItineraryData) => void;
  onSave?: (data: ItineraryData) => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function Itinerary({ data, state = 'loaded', reason, onModify, onSave, className, style }: ItineraryProps) {
  const [open, setOpen] = useState<number | null>(null);

  if (state === 'loading') {
    return (
      <div className={className} style={{ ...shell, ...style }} aria-busy="true" aria-label="Loading itinerary">
        <Bar w={200} h={16} />
        {[0, 1].map((i) => (
          <Bar key={i} w={undefined} h={40} />
        ))}
      </div>
    );
  }

  if (state === 'failed') {
    return (
      <div className={className} style={{ ...shell, ...style }} role="status">
        <span style={{ fontFamily: DISPLAY, fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em' }}>
          Couldn&rsquo;t load this trip
        </span>
        <span style={{ fontSize: 13.5, color: INK_MID }}>{reason || 'This itinerary could not be loaded just now.'}</span>
      </div>
    );
  }

  if (!data) return null;

  const total = safeDuration(data.totalDuration);
  const isPartial = state === 'partial';

  return (
    <div className={className} style={{ ...shell, ...style }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: DISPLAY, fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em' }}>
          {data.title || `${data.segments[0].from} → ${data.segments[data.segments.length - 1].to}`}
        </span>
        {total && (
          <span style={{ fontFamily: MONO, fontSize: 11, color: INK_MID }}>
            {total} total
          </span>
        )}
      </div>

      {/* Trip-level warnings, up top */}
      {data.warnings && data.warnings.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {data.warnings.map((w, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <TriangleAlert size={14} aria-hidden style={{ color: AMBER, flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontFamily: UI, fontSize: 13, color: INK, fontWeight: 500 }}>{w}</span>
            </div>
          ))}
        </div>
      )}

      {/* Segments with layovers between */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {data.segments.map((s, i) => {
          const layover = data.layovers?.[i];
          const isOpen = open === i;
          return (
            <div key={i}>
              <Segment s={s} open={isOpen} onToggle={() => setOpen(isOpen ? null : i)} />
              {layover && i < data.segments.length - 1 && <LayoverRow at={layover.at} duration={layover.duration} warning={layover.warning} />}
            </div>
          );
        })}
      </div>

      {data.receipt && <SourceReceipt data={data.receipt} state={isPartial ? 'partial' : 'loaded'} />}

      {(onModify || onSave) && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {onSave && (
            <button type="button" onClick={() => onSave(data)} style={primaryBtn}>
              Save
            </button>
          )}
          {onModify && (
            <button type="button" onClick={() => onModify(data)} style={quietBtn}>
              Modify
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Segment({ s, open, onToggle }: { s: ItinerarySegment; open: boolean; onToggle: () => void }) {
  const dep = timeOf(s.departAt);
  const arr = timeOf(s.arriveAt);
  const dur = safeDuration(s.duration);
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 0',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: UI,
        }}
      >
        <Plane size={15} aria-hidden style={{ color: ACCENT, flexShrink: 0 }} />
        <span style={{ fontFamily: MONO, fontSize: 13, color: INK, minWidth: 96 }}>
          {s.from} → {s.to}
        </span>
        {(dep || arr) && (
          <span style={{ fontFamily: MONO, fontSize: 12, color: INK_MID }}>
            {dep}
            {dep && arr ? ' – ' : ''}
            {arr}
          </span>
        )}
        {dur && <span style={{ fontFamily: MONO, fontSize: 11, color: INK_DIM, marginLeft: 'auto' }}>{dur}</span>}
        <ChevronDown size={14} aria-hidden style={{ color: INK_DIM, transition: 'transform 160ms ease', transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>
      {open && (
        <div style={{ paddingLeft: 27, paddingBottom: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontFamily: MONO, fontSize: 11.5, color: INK_MID }}>
            {[s.carrier && s.flightNumber ? `${s.carrier}${s.flightNumber}` : s.carrier, s.cabin ? CABIN_LABEL[s.cabin] : null, s.aircraft]
              .filter(Boolean)
              .join('  ·  ') || 'No further detail'}
          </span>
        </div>
      )}
    </div>
  );
}

function LayoverRow({ at, duration, warning }: { at: string; duration?: string; warning?: string }) {
  const dur = safeDuration(duration);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 27, paddingBottom: 6 }}>
      <span aria-hidden style={{ width: 1, height: 14, background: LINE, marginLeft: -20 }} />
      <Clock size={12} aria-hidden style={{ color: warning ? AMBER : INK_DIM, flexShrink: 0 }} />
      <span style={{ fontFamily: MONO, fontSize: 11, color: warning ? AMBER : INK_DIM }}>
        {dur ? `${dur} in ${at}` : `Connect in ${at}`}
        {warning ? ` · ${warning}` : ''}
      </span>
    </div>
  );
}

const primaryBtn: React.CSSProperties = {
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
};

const quietBtn: React.CSSProperties = {
  background: 'transparent',
  color: INK,
  border: `1px solid ${LINE}`,
  borderRadius: 9999,
  padding: '8px 16px',
  fontFamily: UI,
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
};

function Bar({ w, h }: { w?: number; h: number }) {
  return <span aria-hidden style={{ display: 'block', width: w ?? '100%', height: h, borderRadius: 8, background: `linear-gradient(90deg, ${LINE}, transparent)` }} />;
}
