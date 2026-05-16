/**
 * FieldNoteCard — editorial article preview card.
 *
 * Graduates the inlined `FieldNoteCardInline` from
 * `~/upway-landing/src/pages/landing/JournalBridge.tsx` and the editorial
 * "Field Note" patterns from `~/upway-blog/src/components/PostCard.tsx`.
 *
 * Two variants:
 *   • standard  — 16/9 hero, 20px Fraunces title, 13px snippet
 *   • featured  — 16/10 hero, 28px Fraunces title, 15px snippet
 *
 * Pulls color from `--color-bg`, `--color-text`, `--color-brand` and font
 * from `--font-display` / `--font-ui` / `--font-mono` so it automatically
 * retunes per public/lab scope (see tokens.css contract).
 *
 * Reduced-motion respected — hover lift suppressed when prefers-reduced-motion.
 */

import { useReducedMotion } from 'framer-motion';

const MONO_FAMILY = 'var(--font-mono, "Geist Mono"), ui-monospace, monospace';
const DISPLAY_FAMILY = 'var(--font-display, Fraunces), serif';
const UI_FAMILY = 'var(--font-ui, "Geist Sans"), system-ui, sans-serif';
const INK_MUTED = 'rgba(10,14,20,0.62)';
const INK_QUIET = 'rgba(10,14,20,0.42)';
const INK_BORDER_SOFT = 'rgba(10,14,20,0.08)';

export interface FieldNoteCardProps {
  /** Article title — rendered in Fraunces. */
  title: string;
  /** One-line preview / dek. */
  snippet: string;
  /** Optional hero image URL. */
  image?: string;
  /** Pre-formatted filed label, e.g. "FILED 3 DAYS AGO". Caller controls phrasing. */
  filed: string;
  /** Category label, e.g. "Route dossier". Will be uppercased visually. */
  category: string;
  /** Destination URL — full or path. */
  href: string;
  /** Featured variant: bigger hero + larger title. */
  featured?: boolean;
  /** Open in new tab. Default true (assumes cross-surface link to blog). */
  external?: boolean;
  /** Optional className applied to the outer anchor. */
  className?: string;
}

export default function FieldNoteCard({
  title,
  snippet,
  image,
  filed,
  category,
  href,
  featured = false,
  external = true,
  className = '',
}: FieldNoteCardProps) {
  const prefersReduced = useReducedMotion();
  const hoverLift = prefersReduced ? '' : 'hover:-translate-y-0.5';

  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener' } : {})}
      className={`group block h-full transition-transform ${hoverLift} ${className}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <article
        className="h-full overflow-hidden flex flex-col"
        style={{
          background: 'var(--color-bg, #FAF9F5)',
          border: `1px solid ${INK_BORDER_SOFT}`,
          borderRadius: 18,
        }}
      >
        {image && (
          <div
            className="overflow-hidden"
            style={{
              aspectRatio: featured ? '16 / 10' : '16 / 9',
              background: 'rgba(10,14,20,0.04)',
            }}
          >
            <img
              src={image}
              alt=""
              loading="lazy"
              className={`w-full h-full object-cover ${prefersReduced ? '' : 'transition-transform duration-700 ease-out group-hover:scale-[1.02]'}`}
            />
          </div>
        )}
        <div
          className={
            featured
              ? 'p-8 lg:p-10 flex flex-col flex-1'
              : 'p-6 lg:p-7 flex flex-col flex-1'
          }
        >
          <p
            className="uppercase mb-4"
            style={{
              fontFamily: MONO_FAMILY,
              fontSize: 10,
              letterSpacing: '0.24em',
              color: INK_QUIET,
            }}
          >
            {filed} <span aria-hidden>·</span> {category}
          </p>
          <h3
            className="leading-[1.15] tracking-[-0.01em] transition-colors group-hover:text-[var(--color-brand,#1A4D32)]"
            style={{
              fontFamily: DISPLAY_FAMILY,
              fontSize: featured ? 28 : 20,
              fontWeight: 400,
              color: 'var(--color-text, #0A0E14)',
            }}
          >
            {title}
          </h3>
          <p
            className="mt-3 leading-[1.55]"
            style={{
              color: INK_MUTED,
              fontFamily: UI_FAMILY,
              fontSize: featured ? 15 : 13,
            }}
          >
            {snippet}
          </p>
        </div>
      </article>
    </a>
  );
}
