/**
 * Eyebrow — the signature editorial mono label.
 *
 * `YOUR POINTS · WORTH MORE THAN YOUR BANK THINKS`
 *
 * Canonicalized from the locked landing reference (2026-05-28): Geist Mono,
 * uppercase, tracked +0.08em, segments joined with a `·` separator, ink at
 * ~60% opacity on light surfaces. This is the recurring structural device
 * that opens every section on upway.travel — every surface should use THIS
 * component rather than re-rolling `['…'].join(' · ').toUpperCase()`.
 *
 * Tones:
 *   • `ink`    — default; ink @ 60% for cream/bone canvases
 *   • `forest` — forest fill, for hero moments that want brand weight
 *   • `light`  — cream @ 66%, for forest-deep / dark image surfaces
 */

import type { CSSProperties, ElementType, ReactNode } from 'react';

const MONO_FAMILY = 'var(--font-mono, "Geist Mono"), ui-monospace, monospace';

export type EyebrowTone = 'ink' | 'forest' | 'light';

export interface EyebrowProps {
  /** Label segments, joined with ` · `. Pass one segment for a plain label. */
  segments: string[];
  /** Color treatment. Default `ink`. */
  tone?: EyebrowTone;
  /** Rendered element. Default `p`. */
  as?: ElementType;
  /** Font size in px. Default 11.5. */
  size?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const TONE_COLOR: Record<EyebrowTone, string> = {
  ink: 'color-mix(in srgb, var(--upway-ink, #0A0E14) 60%, transparent)',
  forest: 'var(--upway-forest, #1A4D32)',
  light: 'color-mix(in srgb, var(--upway-cream, #FAF9F5) 66%, transparent)',
};

export default function Eyebrow({
  segments,
  tone = 'ink',
  as: Tag = 'p',
  size = 11.5,
  className = '',
  style,
  children,
}: EyebrowProps) {
  return (
    <Tag
      className={className}
      style={{
        margin: 0,
        fontFamily: MONO_FAMILY,
        fontSize: size,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: TONE_COLOR[tone],
        lineHeight: 1.4,
        ...style,
      }}
    >
      {segments.join(' · ')}
      {children}
    </Tag>
  );
}
