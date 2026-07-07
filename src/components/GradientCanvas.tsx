/**
 * GradientCanvas — the cream canvas "lit from outside the frame".
 *
 * Cream base with faint sage radial gradients breathing in from the
 * corners — the Mercury-grade ambient treatment behind every section of
 * upway.travel (`.l26-halo`). Canonicalized so app surfaces sit on the
 * SAME light as the landing instead of flat cream.
 *
 * Two ways to use it:
 *   • As a wrapper:  <GradientCanvas>…</GradientCanvas>
 *   • As a shell backdrop:  <GradientCanvas fixed /> — renders a fixed,
 *     pointer-transparent background layer behind the whole app.
 *
 * Intensity: `soft` (default, app chrome) or `bold` (landing heroes).
 */

import type { CSSProperties, ReactNode } from 'react';

export interface GradientCanvasProps {
  children?: ReactNode;
  /** Corner glow strength. Default `soft`. */
  intensity?: 'soft' | 'bold';
  /** Render as a fixed full-viewport backdrop layer (no children needed). */
  fixed?: boolean;
  /** Include the cream base fill. Default true; set false to only add glow over an existing canvas. */
  base?: boolean;
  className?: string;
  style?: CSSProperties;
}

export default function GradientCanvas({
  children,
  intensity = 'soft',
  fixed = false,
  base = true,
  className = '',
  style,
}: GradientCanvasProps) {
  const a = intensity === 'bold' ? 0.2 : 0.12;
  const b = intensity === 'bold' ? 0.14 : 0.08;

  const glow = [
    `radial-gradient(ellipse 60% 50% at 0% 0%, color-mix(in srgb, var(--upway-sage, #8FBFA0) ${Math.round(
      a * 100,
    )}%, transparent), transparent 70%)`,
    `radial-gradient(ellipse 50% 40% at 100% 8%, color-mix(in srgb, var(--upway-sage, #8FBFA0) ${Math.round(
      b * 100,
    )}%, transparent), transparent 70%)`,
    `radial-gradient(ellipse 55% 45% at 85% 100%, color-mix(in srgb, var(--upway-sage, #8FBFA0) ${Math.round(
      b * 100,
    )}%, transparent), transparent 72%)`,
  ].join(', ');

  const background = base
    ? `${glow}, var(--color-bg, var(--upway-cream, #FAF9F5))`
    : glow;

  if (fixed) {
    return (
      <div
        aria-hidden
        className={className}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          pointerEvents: 'none',
          background,
          ...style,
        }}
      />
    );
  }

  return (
    <div className={className} style={{ position: 'relative', background, ...style }}>
      {children}
    </div>
  );
}
