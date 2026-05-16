/**
 * RouteEconomicsRow — the mono "route + cabin + points + tax + CPP + seats"
 * inline row.
 *
 * Graduates the result-card economics row flagged in PR #104 (5e). Used on
 * flight-result cards in the app, and reusable for landing's Product Proof
 * mockup section. Renders as a Söhne/Geist Mono tabular-nums grid with an
 * optional Volt-filled CPP badge when a CPP value is provided (Volt is
 * money/value-only per the brand contract).
 *
 * Pulls color from `--color-text` / `--color-surface` / `--color-accent`
 * and font from `--font-mono` so it auto-retunes per public/lab scope.
 *
 * Stateless / motionless.
 */

const MONO_FAMILY = 'var(--font-mono, "Geist Mono"), ui-monospace, monospace';
const INK_MUTED = 'rgba(10,14,20,0.7)';
const INK_QUIET = 'rgba(10,14,20,0.45)';

export interface RouteEconomicsRowProps {
  /** Route string, e.g. "ORD → HND". */
  route: string;
  /** Cabin label, e.g. "Business" or "First". */
  cabin: string;
  /** Points cost, pre-formatted (e.g. "60K"). */
  points: string;
  /** Optional tax/fees, pre-formatted (e.g. "$51"). */
  tax?: string;
  /** Optional seat-count signal (e.g. 2 or "2 left"). */
  seats?: number | string;
  /** Optional CPP value (e.g. "4.2¢ /pt"). When present, rendered in the
   *  Volt-filled value badge. */
  cpp?: string;
  /** Optional signal label rendered as a mono footer (e.g. "ANA Saver"). */
  signalLabel?: string;
  /** Optional className applied to the root. */
  className?: string;
}

export default function RouteEconomicsRow({
  route,
  cabin,
  points,
  tax,
  seats,
  cpp,
  signalLabel,
  className = '',
}: RouteEconomicsRowProps) {
  return (
    <div
      className={`rounded-lg overflow-hidden ${className}`}
      style={{
        background: 'var(--color-surface, #F4F1EA)',
        border: '1px solid rgba(10,14,20,0.06)',
      }}
    >
      <div className="flex items-center justify-between px-3.5 py-2.5">
        <div>
          <div
            className="uppercase"
            style={{
              fontFamily: MONO_FAMILY,
              fontSize: 9,
              letterSpacing: '0.22em',
              color: INK_QUIET,
            }}
          >
            Route · {cabin}
          </div>
          <div
            className="tabular-nums mt-0.5"
            style={{
              fontFamily: MONO_FAMILY,
              fontSize: 16,
              color: 'var(--color-text, #0A0E14)',
            }}
          >
            {route}
          </div>
        </div>
        {cpp && (
          <div
            className="tabular-nums px-2 py-1 rounded"
            style={{
              fontFamily: MONO_FAMILY,
              background: 'var(--color-accent, #C6FF3D)',
              color: 'var(--color-text, #0A0E14)',
              fontSize: 11,
              letterSpacing: '0.05em',
            }}
          >
            {cpp}
          </div>
        )}
      </div>

      <div
        className="px-3.5 py-2.5 grid grid-cols-3 gap-2 text-[11px]"
        style={{
          borderTop: '1px solid rgba(10,14,20,0.05)',
          color: INK_MUTED,
        }}
      >
        <Stat label="Points" value={points} />
        <Stat label="Tax" value={tax ?? '—'} />
        <Stat label="Seats" value={seats !== undefined ? String(seats) : '—'} />
      </div>

      {signalLabel && (
        <div
          className="px-3.5 py-2"
          style={{
            borderTop: '1px solid rgba(10,14,20,0.05)',
            color: 'rgba(10,14,20,0.55)',
            fontFamily: MONO_FAMILY,
            fontSize: 10,
            letterSpacing: '0.12em',
          }}
        >
          {signalLabel}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        className="uppercase"
        style={{
          fontFamily: MONO_FAMILY,
          fontSize: 8,
          letterSpacing: '0.22em',
          color: 'rgba(10,14,20,0.42)',
        }}
      >
        {label}
      </div>
      <div
        className="tabular-nums"
        style={{
          fontFamily: MONO_FAMILY,
          fontSize: 13,
          color: 'var(--color-text, #0A0E14)',
          marginTop: 1,
        }}
      >
        {value}
      </div>
    </div>
  );
}
