/**
 * AskUpway — seeded-prompt CTA card.
 *
 * Graduates the `AskUpway` pattern from
 * `~/upway-blog/src/components/Dossier.tsx`. Renders a card with the
 * seeded prompt visible (Fraunces italic, dimmed) and a mono "Ask Upway →"
 * CTA. Used at the bottom of a Field Note to invite the reader into the
 * adviser with the article's seed pre-loaded as a query param.
 *
 * If no `href` is provided, defaults to `https://upway.travel/?ask=<prompt>`.
 *
 * Stateless / motionless. Pulls color from `--color-bg` / `--color-text` /
 * `--color-accent` and font from `--font-display` / `--font-mono` so it
 * auto-retunes per public/lab scope (see tokens.css contract).
 */

const MONO_FAMILY = 'var(--font-mono, "Geist Mono"), ui-monospace, monospace';
const DISPLAY_FAMILY = 'var(--font-display, Fraunces), serif';
const INK_QUIET = 'rgba(10,14,20,0.42)';
const INK_BORDER_SOFT = 'rgba(10,14,20,0.08)';

export interface AskUpwayProps {
  /** The seeded prompt to pre-load, e.g. "Tell me more about: ANA awards from SEA". */
  prompt: string;
  /** Optional destination URL. Defaults to `https://upway.travel/?ask=<encoded prompt>`. */
  href?: string;
  /** Optional className applied to the root aside. */
  className?: string;
}

export default function AskUpway({
  prompt,
  href,
  className = '',
}: AskUpwayProps) {
  const resolvedHref =
    href ?? `https://upway.travel/?ask=${encodeURIComponent(prompt)}`;

  return (
    <aside
      aria-label="Ask Upway"
      className={`flex flex-col md:flex-row md:items-center md:justify-between gap-5 ${className}`}
      style={{
        background: 'var(--color-bg, #FAF9F5)',
        border: `1px solid ${INK_BORDER_SOFT}`,
        borderRadius: 18,
        padding: '1.75rem',
      }}
    >
      <div className="flex-1">
        <p
          className="uppercase mb-2"
          style={{
            fontFamily: MONO_FAMILY,
            fontSize: 10,
            letterSpacing: '0.28em',
            color: INK_QUIET,
          }}
        >
          Ask Upway
        </p>
        <p
          className="leading-snug"
          style={{
            fontFamily: DISPLAY_FAMILY,
            fontSize: 19,
            fontStyle: 'italic',
            fontWeight: 400,
            color: 'var(--color-text, #0A0E14)',
            margin: 0,
          }}
        >
          &ldquo;{prompt}&rdquo;
        </p>
      </div>
      <a
        href={resolvedHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center self-start md:self-auto whitespace-nowrap transition-opacity hover:opacity-90"
        style={{
          fontFamily: MONO_FAMILY,
          fontSize: 11,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          background: 'var(--color-accent, #C6FF3D)',
          color: 'var(--color-text, #0A0E14)',
          padding: '11px 22px',
          borderRadius: 9999,
          textDecoration: 'none',
        }}
      >
        Ask Upway →
      </a>
    </aside>
  );
}
