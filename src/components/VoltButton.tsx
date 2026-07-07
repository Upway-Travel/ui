/**
 * VoltButton — the canonical Volt CTA.
 *
 * Pill shape, Volt `#C6FF3D` fill, forest-deep text (dark-on-volt, never
 * white), optional trailing → arrow. Canonicalized from the locked landing
 * reference (2026-05-28): this is the "Get early access →" button.
 *
 * VOLT RULE v2 (locked 2026-07-07) — confident and frequent. Volt carries
 * badges, underlines, CTA fills, and key numbers. Still one hue, still
 * disciplined: never a background wash, never body text, and text on Volt
 * is always Ink.
 *
 * Reduced-motion respected — hover-lift suppressed when
 * prefers-reduced-motion is set. Focus ring is forest, visible on cream.
 */

import { useReducedMotion } from 'framer-motion';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

const UI_FAMILY = 'var(--font-ui, "Geist Sans"), system-ui, sans-serif';

export interface VoltButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  /** Show the trailing → arrow. Default true. */
  arrow?: boolean;
  /** Control size. Default `md`. */
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = {
  sm: { minHeight: 34, padding: '0 16px', fontSize: 13 },
  md: { minHeight: 42, padding: '0 20px', fontSize: 14 },
  lg: { minHeight: 50, padding: '0 26px', fontSize: 15.5 },
} as const;

export default function VoltButton({
  children,
  arrow = true,
  size = 'md',
  className = '',
  style,
  disabled,
  ...rest
}: VoltButtonProps) {
  const reduced = useReducedMotion();
  const s = SIZES[size];

  return (
    <button
      type="button"
      disabled={disabled}
      className={`upway-volt-btn ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        minHeight: s.minHeight,
        padding: s.padding,
        borderRadius: 9999,
        border: 'none',
        background: 'var(--upway-volt, #C6FF3D)',
        color: 'var(--upway-ink, #0A0E14)',
        fontFamily: UI_FAMILY,
        fontSize: s.fontSize,
        fontWeight: 600,
        letterSpacing: '-0.01em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        transition: reduced
          ? 'opacity 160ms ease'
          : 'transform 160ms ease, box-shadow 160ms ease, opacity 160ms ease',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!reduced && !disabled) {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow =
            '0 6px 18px -6px color-mix(in srgb, var(--upway-volt, #C6FF3D) 65%, transparent)';
        }
        rest.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'none';
        rest.onMouseLeave?.(e);
      }}
      {...rest}
    >
      {children}
      {arrow && <span aria-hidden>→</span>}
      <style>{`
        .upway-volt-btn:focus-visible {
          outline: 2px solid var(--upway-forest, #1A4D32);
          outline-offset: 2px;
        }
        .upway-volt-btn:active {
          transform: translateY(0) scale(0.985) !important;
        }
      `}</style>
    </button>
  );
}
