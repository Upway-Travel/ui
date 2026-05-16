/**
 * ActionChip — the seeded-prompt / action-chip control that sits beneath
 * an adviser response or alongside a flight-result card.
 *
 * Graduates the inlined `ActionChip` from
 * `~/Upway/frontend/src/components/ui/ActionChip.tsx` (PR #106) — but with
 * the locked 2026 two-scope contract applied. In `public` mode the primary
 * chip fills with Forest; in `lab` mode it fills with the cockpit cyan.
 * Secondary chips are always a Bone surface with a thin Ink hairline.
 *
 * Two visual modes:
 *   • `public` — Forest primary, Bone/Ink secondary (default, editorial)
 *   • `lab`    — Cyan primary, Bone/Ink secondary (cockpit)
 *
 * Reduced-motion respected — press-scale + hover-lift suppressed when
 * prefers-reduced-motion is set.
 *
 * Pulls color from `--color-brand`, `--color-surface`, `--color-text`,
 * and font from `--font-ui` / `--font-mono`. The `lab` mode references
 * the cockpit cyan primitive directly (`--upway-cyan-400`) since the
 * brand contract reserves `--color-brand` in public scope for Forest.
 */

import { useReducedMotion } from 'framer-motion';
import type { MouseEventHandler } from 'react';

const UI_FAMILY = 'var(--font-ui, "Geist Sans"), system-ui, sans-serif';
const MONO_FAMILY = 'var(--font-mono, "Geist Mono"), ui-monospace, monospace';
const INK_HAIRLINE = 'rgba(10,14,20,0.18)';

export type ActionChipVariant = 'primary' | 'secondary';
export type ActionChipMode = 'public' | 'lab';

export interface ActionChipProps {
  /** The chip label (Geist Sans 13.5px). */
  label: string;
  /** Optional trailing mono fragment, e.g. "60K · 4.2¢". Set in `--font-mono`. */
  mono?: string;
  /** Visual weight. Default `primary`. */
  variant?: ActionChipVariant;
  /** Click handler. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** Brand scope. Default `public`. */
  mode?: ActionChipMode;
  /** Optional className applied to the button. */
  className?: string;
  /** Optional aria-label override (falls back to `label`). */
  ariaLabel?: string;
  /** Disables interaction + dims the chip. */
  disabled?: boolean;
}

export default function ActionChip({
  label,
  mono,
  variant = 'primary',
  onClick,
  mode = 'public',
  className = '',
  ariaLabel,
  disabled = false,
}: ActionChipProps) {
  const prefersReduced = useReducedMotion();
  const motionClasses = prefersReduced
    ? ''
    : 'transition-[transform,box-shadow,background-color] duration-200 ease-out hover:-translate-y-px active:scale-[0.98]';

  // In public mode the primary fill is `--color-brand` (Forest).
  // In lab mode we reach for the cockpit cyan primitive directly because
  // `--color-brand` resolves to Forest there too, and the spec calls for
  // cyan in the lab cockpit.
  const isPrimary = variant === 'primary';
  const primaryBg =
    mode === 'lab' ? 'var(--upway-cyan-400, #22d3ee)' : 'var(--color-brand, #1A4D32)';
  const primaryText =
    mode === 'lab' ? 'var(--upway-ink, #0A0E14)' : 'var(--color-bg, #FAF9F5)';

  const baseStyle = {
    fontFamily: UI_FAMILY,
    fontSize: 13.5,
    fontWeight: 600,
    letterSpacing: '-0.005em',
    padding: '9px 16px',
    borderRadius: 9999,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
  } as const;

  const primaryStyle = {
    ...baseStyle,
    background: primaryBg,
    color: primaryText,
    border: '1px solid transparent',
  } as const;

  const secondaryStyle = {
    ...baseStyle,
    background: 'var(--color-surface, #F4F1EA)',
    color: 'var(--color-text, #0A0E14)',
    border: `1px solid ${INK_HAIRLINE}`,
  } as const;

  const monoColor = isPrimary
    ? mode === 'lab'
      ? 'rgba(10,14,20,0.72)'
      : 'rgba(244,241,234,0.78)'
    : 'rgba(10,14,20,0.55)';

  return (
    <button
      type="button"
      data-variant={variant}
      data-mode={mode}
      aria-label={ariaLabel ?? label}
      disabled={disabled}
      onClick={onClick}
      className={`${motionClasses} ${className}`.trim()}
      style={isPrimary ? primaryStyle : secondaryStyle}
    >
      <span>{label}</span>
      {mono && (
        <span
          className="tabular-nums"
          style={{
            fontFamily: MONO_FAMILY,
            fontSize: 12,
            letterSpacing: '0.02em',
            color: monoColor,
          }}
        >
          {mono}
        </span>
      )}
    </button>
  );
}
