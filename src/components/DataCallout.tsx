/**
 * DataCallout — magazine-pacing stat card.
 *
 * Graduates the `DataCalloutCard` pattern from
 * `~/upway-blog/src/components/EditorialCards.tsx`. Renders a mono stat
 * (e.g. "$1,800 saved"), a Fraunces caption, and an optional mono source
 * footer. Used to break up rows of Field Note cards on the blog homepage
 * with an editorial proof-point.
 *
 * Stateless / motionless. Pulls color from `--color-bg` / `--color-text`
 * and font from `--font-display` / `--font-mono` so it auto-retunes per
 * public/lab scope (see tokens.css contract).
 */

const MONO_FAMILY = 'var(--font-mono, "Geist Mono"), ui-monospace, monospace';
const DISPLAY_FAMILY = 'var(--font-display, Fraunces), serif';
const INK_MUTED = 'rgba(10,14,20,0.62)';
const INK_QUIET = 'rgba(10,14,20,0.42)';
const INK_BORDER_SOFT = 'rgba(10,14,20,0.08)';

export interface DataCalloutProps {
  /** The headline stat, pre-formatted (e.g. "$1,800 saved", "10.4¢ /pt"). */
  stat: string;
  /** Fraunces caption line, e.g. "ORD → HND business class, paid with 75K Aeroplan points." */
  caption: string;
  /** Optional mono source footer, e.g. "Sample route win · Q1 2026". */
  source?: string;
  /** Optional className applied to the root article. */
  className?: string;
}

export default function DataCallout({
  stat,
  caption,
  source,
  className = '',
}: DataCalloutProps) {
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
        Data callout
      </p>
      <div
        className="mt-4 tabular-nums leading-none tracking-tight"
        style={{
          fontFamily: MONO_FAMILY,
          fontSize: 36,
          fontWeight: 500,
          color: 'var(--color-text, #0A0E14)',
        }}
      >
        {stat}
      </div>
      <p
        className="mt-5 leading-snug flex-1"
        style={{
          fontFamily: DISPLAY_FAMILY,
          fontSize: 18,
          fontWeight: 400,
          color: INK_MUTED,
        }}
      >
        {caption}
      </p>
      {source && (
        <p
          className="mt-5 pt-4 uppercase"
          style={{
            fontFamily: MONO_FAMILY,
            fontSize: 10,
            letterSpacing: '0.22em',
            color: INK_QUIET,
            borderTop: `1px solid ${INK_BORDER_SOFT}`,
          }}
        >
          {source}
        </p>
      )}
    </article>
  );
}
