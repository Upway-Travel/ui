/**
 * EditorialCaption — the hung mono small-caps label + Fraunces italic
 * caption that appears in the landing rethink "Product Proof" section.
 *
 * Renders an optional mono index (e.g. "01 / ADVISER") set in tracked-out
 * small-caps, followed by a Fraunces-italic title in the brand forest
 * color, and an optional muted body line beneath. Use to caption product
 * mockups, sections, or anywhere editorial pacing is needed.
 *
 * Pulls color from `--color-text` / `--color-brand` and font from
 * `--font-display` / `--font-ui` / `--font-mono` so it automatically
 * retunes per public/lab scope (see tokens.css contract).
 *
 * Reduced-motion respected — entrance fade suppressed when
 * prefers-reduced-motion is set.
 */

import { motion, useReducedMotion } from 'framer-motion';

const MONO_FAMILY = 'var(--font-mono, "Geist Mono"), ui-monospace, monospace';
const DISPLAY_FAMILY = 'var(--font-display, Fraunces), serif';
const UI_FAMILY = 'var(--font-ui, "Geist Sans"), system-ui, sans-serif';
const INK_MUTED = 'rgba(10,14,20,0.62)';

const EASE = [0.22, 1, 0.36, 1] as const;

export interface EditorialCaptionProps {
  /** Optional mono small-caps prefix, e.g. "01 / ADVISER". */
  index?: string;
  /** The editorial title — rendered in Fraunces italic. */
  title: string;
  /** Optional muted body paragraph beneath the title. */
  body?: string;
  /** Visual size:
   *  - "sm" — caption for a mockup (24px title)
   *  - "md" — section sub-heading (32px title)  (default)
   *  - "lg" — section heading (44px title)
   */
  size?: 'sm' | 'md' | 'lg';
  /** Layout: stacked (default) or inline (index hangs to the left of title). */
  layout?: 'stacked' | 'inline';
  /** Animate entrance (rise + fade). Auto-disabled for prefers-reduced-motion. */
  animate?: boolean;
  /** Optional className applied to the root. */
  className?: string;
}

const SIZE_MAP: Record<NonNullable<EditorialCaptionProps['size']>, { title: number; index: number; body: number }> = {
  sm: { title: 24, index: 10, body: 13 },
  md: { title: 32, index: 11, body: 15 },
  lg: { title: 44, index: 12, body: 16 },
};

export default function EditorialCaption({
  index,
  title,
  body,
  size = 'md',
  layout = 'stacked',
  animate = true,
  className = '',
}: EditorialCaptionProps) {
  const prefersReduced = useReducedMotion();
  const shouldAnimate = animate && !prefersReduced;
  const sizes = SIZE_MAP[size];

  const rise = shouldAnimate
    ? { initial: { y: 10, opacity: 0 }, animate: { y: 0, opacity: 1 } }
    : { initial: { y: 0, opacity: 1 }, animate: { y: 0, opacity: 1 } };

  const isInline = layout === 'inline';

  const indexEl = index && (
    <motion.span
      {...rise}
      transition={{ duration: 0.6, ease: EASE, delay: 0 }}
      className="uppercase block"
      style={{
        fontFamily: MONO_FAMILY,
        fontSize: sizes.index,
        letterSpacing: '0.28em',
        color: 'var(--color-brand, #1A4D32)',
        marginBottom: isInline ? 0 : sizes.index * 0.6,
        marginRight: isInline ? '1.25em' : 0,
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      {index}
    </motion.span>
  );

  const titleEl = (
    <motion.h3
      {...rise}
      transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
      className="leading-[1.15] tracking-[-0.01em]"
      style={{
        fontFamily: DISPLAY_FAMILY,
        fontSize: sizes.title,
        fontStyle: 'italic',
        fontWeight: 400,
        color: 'var(--color-brand, #1A4D32)',
        margin: 0,
      }}
    >
      {title}
    </motion.h3>
  );

  return (
    <div
      className={className}
      style={{
        display: isInline ? 'flex' : 'block',
        alignItems: isInline ? 'baseline' : undefined,
      }}
    >
      {isInline ? (
        <>
          {indexEl}
          <div style={{ flex: 1 }}>
            {titleEl}
            {body && (
              <motion.p
                {...rise}
                transition={{ duration: 0.7, ease: EASE, delay: 0.16 }}
                className="leading-[1.55]"
                style={{
                  fontFamily: UI_FAMILY,
                  fontSize: sizes.body,
                  color: INK_MUTED,
                  marginTop: 12,
                }}
              >
                {body}
              </motion.p>
            )}
          </div>
        </>
      ) : (
        <>
          {indexEl}
          {titleEl}
          {body && (
            <motion.p
              {...rise}
              transition={{ duration: 0.7, ease: EASE, delay: 0.16 }}
              className="leading-[1.55]"
              style={{
                fontFamily: UI_FAMILY,
                fontSize: sizes.body,
                color: INK_MUTED,
                marginTop: 12,
              }}
            >
              {body}
            </motion.p>
          )}
        </>
      )}
    </div>
  );
}
