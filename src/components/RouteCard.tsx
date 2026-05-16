/**
 * RouteCard — static, single-route summary card.
 *
 * Graduates the `RouteCard` pattern from
 * `~/upway-blog/src/components/EditorialCards.tsx`. Mini-DepartureTicker
 * entry — a single mono route, cabin, points cost, and optional CPP. Used
 * on the blog homepage to break up rows of Field Note cards.
 *
 * Unlike `<RouteEconomicsRow>` (which is a live result-card row), this is
 * an editorial static card with a paper surface, intended to live in a
 * magazine-pacing grid.
 *
 * Stateless / motionless. Pulls color from `--color-bg` / `--color-text`
 * and font from `--font-mono` so it auto-retunes per public/lab scope.
 */

const MONO_FAMILY = 'var(--font-mono, "Geist Mono"), ui-monospace, monospace';
const INK_QUIET = 'rgba(10,14,20,0.42)';
const INK_BORDER_SOFT = 'rgba(10,14,20,0.08)';

export interface RouteCardProps {
  /** Route string, e.g. "SEA → HND" or just "ORD → HND". */
  route: string;
  /** Cabin label, e.g. "Business", "Premium Economy". */
  cabin: string;
  /** Points cost, pre-formatted (e.g. "55,000" or "60K"). */
  points: string;
  /** Optional CPP value, pre-formatted (e.g. "11.2¢ /pt"). */
  cpp?: string;
  /** Optional program / source footer (e.g. "Alaska Mileage Plan · JAL"). */
  program?: string;
  /** Optional className applied to the root article. */
  className?: string;
}

export default function RouteCard({
  route,
  cabin,
  points,
  cpp,
  program,
  className = '',
}: RouteCardProps) {
  return (
    <article
      className={`h-full flex flex-col ${className}`}
      style={{
        background: 'var(--color-bg, #FAF9F5)',
        border: `1px solid ${INK_BORDER_SOFT}`,
        borderRadius: 18,
        padding: '1.5rem',
      }}
    >
      <p
        className="uppercase"
        style={{
          fontFamily: MONO_FAMILY,
          fontSize: 10,
          letterSpacing: '0.22em',
          color: INK_QUIET,
        }}
      >
        Route card
      </p>
      <div
        className="mt-4 tabular-nums tracking-tight"
        style={{
          fontFamily: MONO_FAMILY,
          fontSize: 24,
          color: 'var(--color-text, #0A0E14)',
        }}
      >
        {route}
      </div>
      <p
        className="mt-2 uppercase"
        style={{
          fontFamily: MONO_FAMILY,
          fontSize: 11,
          letterSpacing: '0.22em',
          color: 'rgba(10,14,20,0.55)',
        }}
      >
        {cabin}
      </p>
      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 flex-1">
        <div>
          <div
            className="uppercase"
            style={{
              fontFamily: MONO_FAMILY,
              fontSize: 10,
              letterSpacing: '0.22em',
              color: INK_QUIET,
            }}
          >
            Points
          </div>
          <div
            className="mt-0.5 tabular-nums"
            style={{
              fontFamily: MONO_FAMILY,
              fontSize: 16,
              color: 'var(--color-text, #0A0E14)',
            }}
          >
            {points}
          </div>
        </div>
        <div>
          <div
            className="uppercase"
            style={{
              fontFamily: MONO_FAMILY,
              fontSize: 10,
              letterSpacing: '0.22em',
              color: INK_QUIET,
            }}
          >
            CPP
          </div>
          <div
            className="mt-0.5 tabular-nums"
            style={{
              fontFamily: MONO_FAMILY,
              fontSize: 16,
              color: 'var(--color-text, #0A0E14)',
            }}
          >
            {cpp ?? '—'}
          </div>
        </div>
      </div>
      {program && (
        <p
          className="mt-4 pt-4 uppercase"
          style={{
            fontFamily: MONO_FAMILY,
            fontSize: 10,
            letterSpacing: '0.22em',
            color: INK_QUIET,
            borderTop: `1px solid ${INK_BORDER_SOFT}`,
          }}
        >
          {program}
        </p>
      )}
    </article>
  );
}
