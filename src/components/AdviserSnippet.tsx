/**
 * AdviserSnippet — "From the adviser" Q&A editorial card.
 *
 * Graduates the `AdviserSnippetCard` pattern from
 * `~/upway-blog/src/components/EditorialCards.tsx`. Renders an italic
 * Fraunces question, an italic Fraunces answer, and a mono attribution
 * footer. Used to interleave with Field Note cards on the blog homepage
 * so the page reads as a magazine spread rather than a grid.
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

export interface AdviserSnippetProps {
  /** The question being answered. Rendered in Fraunces italic, dimmed. */
  question: string;
  /** The adviser's answer. Rendered in Fraunces italic, full Ink. */
  answer: string;
  /** Mono attribution / freshness, e.g. "anon · sapphire reserve holder · 2 days ago". */
  attribution: string;
  /** Optional className applied to the root article. */
  className?: string;
}

export default function AdviserSnippet({
  question,
  answer,
  attribution,
  className = '',
}: AdviserSnippetProps) {
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
        From the adviser
      </p>
      <p
        className="mt-4 leading-snug"
        style={{
          fontFamily: DISPLAY_FAMILY,
          fontSize: 14,
          fontStyle: 'italic',
          fontWeight: 400,
          color: INK_MUTED,
        }}
      >
        &ldquo;{question}&rdquo;
      </p>
      <p
        className="mt-4 leading-snug flex-1"
        style={{
          fontFamily: DISPLAY_FAMILY,
          fontSize: 18,
          fontStyle: 'italic',
          fontWeight: 400,
          color: 'var(--color-text, #0A0E14)',
        }}
      >
        &ldquo;{answer}&rdquo;
      </p>
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
        {attribution}
      </p>
    </article>
  );
}
