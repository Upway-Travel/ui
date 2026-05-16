/**
 * DossierZone — the labeled zone primitive used by the Field Note dossier.
 *
 * Graduates the shared Summary / Best for / Route math / Availability note
 * zone pattern from `~/upway-blog/src/components/Dossier.tsx`. Each zone
 * renders a mono small-caps label above its children. Pass `mono` to
 * render the body in monospace (e.g. for the Availability note).
 *
 * Stateless / motionless. Pulls color from `--color-text` and font from
 * `--font-mono` / `--font-ui` so it auto-retunes per public/lab scope.
 */

import type { ReactNode } from 'react';

const MONO_FAMILY = 'var(--font-mono, "Geist Mono"), ui-monospace, monospace';
const UI_FAMILY = 'var(--font-ui, "Geist Sans"), system-ui, sans-serif';
const INK_QUIET = 'rgba(10,14,20,0.42)';
const INK_MUTED = 'rgba(10,14,20,0.62)';

export interface DossierZoneProps {
  /** Mono small-caps label, e.g. "Summary", "Best for", "Route math". */
  label: string;
  /** Zone content. */
  children: ReactNode;
  /** If true, render body content in monospace (e.g. Availability note). */
  mono?: boolean;
  /** Optional className applied to the root section. */
  className?: string;
}

export default function DossierZone({
  label,
  children,
  mono = false,
  className = '',
}: DossierZoneProps) {
  return (
    <section className={className}>
      <h2
        className="uppercase mb-3"
        style={{
          fontFamily: MONO_FAMILY,
          fontSize: 10,
          letterSpacing: '0.22em',
          color: INK_QUIET,
          margin: 0,
          marginBottom: 12,
        }}
      >
        {label}
      </h2>
      <div
        style={{
          fontFamily: mono ? MONO_FAMILY : UI_FAMILY,
          fontSize: mono ? 12 : 15,
          lineHeight: mono ? 1.6 : 1.55,
          color: mono ? INK_MUTED : 'var(--color-text, #0A0E14)',
        }}
      >
        {children}
      </div>
    </section>
  );
}
