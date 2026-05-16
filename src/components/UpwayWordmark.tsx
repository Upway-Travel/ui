/**
 * UpwayWordmark — the editorial Upway wordmark.
 *
 * Two variants:
 *   • "straight"  — set in Fraunces italic, all letters on baseline
 *   • "slanted"   — the "upway·plane" treatment: "way" rises at -6°,
 *                   small paper-plane mark sits on the rising baseline
 *
 * Both pull color from `--color-text` and `--color-brand` so they
 * automatically retune to public vs lab scope (see tokens.css contract).
 *
 * Reduced-motion respected via `animate` prop default.
 */

import { motion, useReducedMotion } from 'framer-motion';

export type UpwayWordmarkVariant = 'straight' | 'slanted';

export interface UpwayWordmarkProps {
  /** Pixel height; letters scale from this. Default 56. */
  size?: number;
  variant?: UpwayWordmarkVariant;
  className?: string;
  /** Animate entrance (rise + fade). Auto-disabled for prefers-reduced-motion. */
  animate?: boolean;
  /** Optional aria-label; defaults to "Upway". */
  ariaLabel?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function UpwayWordmark({
  size = 56,
  variant = 'slanted',
  className = '',
  animate = true,
  ariaLabel = 'Upway',
}: UpwayWordmarkProps) {
  const prefersReduced = useReducedMotion();
  const shouldAnimate = animate && !prefersReduced;

  const rise = shouldAnimate
    ? { initial: { y: 12, opacity: 0 }, animate: { y: 0, opacity: 1 } }
    : { initial: { y: 0, opacity: 1 }, animate: { y: 0, opacity: 1 } };

  const isSlanted = variant === 'slanted';

  return (
    <div
      className={`inline-flex items-end gap-[0.04em] leading-none select-none ${className}`}
      style={{
        fontFamily: 'var(--font-display, Fraunces, serif)',
        fontSize: size,
      }}
      aria-label={ariaLabel}
    >
      <motion.span
        {...rise}
        transition={{ duration: 0.7, ease: EASE, delay: 0.0 }}
        className="font-medium tracking-tight"
        style={{
          color: 'var(--color-text, #0A0E14)',
          fontStyle: 'italic',
        }}
      >
        up
      </motion.span>

      <motion.span
        {...rise}
        transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
        className="font-medium tracking-tight"
        style={{
          color: 'var(--color-brand, #1A4D32)',
          fontStyle: 'italic',
          transform: isSlanted
            ? 'translateY(-0.18em) rotate(-6deg)'
            : 'none',
          transformOrigin: 'bottom left',
        }}
      >
        way
      </motion.span>

      {isSlanted && (
        <motion.svg
          {...rise}
          transition={{ duration: 0.7, ease: EASE, delay: 0.18 }}
          viewBox="0 0 14 14"
          aria-hidden
          style={{
            width: size * 0.32,
            height: size * 0.32,
            marginLeft: size * 0.06,
            marginBottom: size * 0.1,
            transform: 'rotate(-6deg)',
          }}
        >
          <path
            d="M1 7 L13 1.5 L8 7 L13 12.5 Z"
            fill="var(--color-brand, #1A4D32)"
            stroke="var(--color-brand, #1A4D32)"
            strokeLinejoin="round"
            strokeWidth="0.4"
          />
        </motion.svg>
      )}
    </div>
  );
}
