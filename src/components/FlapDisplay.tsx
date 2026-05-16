/**
 * FlapDisplay — a single Solari split-flap value cell.
 *
 * Renders a value (string or number) that flips on change with the
 * mechanical clack motion of an airport departures board. The visible
 * styling matches Upway's locked 2026 system — Ink board, Cream text,
 * Geist Mono / Söhne Mono numerals.
 *
 * For multi-row departure boards, see <DepartureTicker>.
 *
 * Use the `size` prop to scale the cell. The cell width auto-fits the
 * value; for fixed-width columns wrap in a `width:` container.
 *
 * Reduced-motion respected — falls back to instant value swap.
 */

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

export interface FlapDisplayProps {
  /** The current value to display. Change to trigger a flap. */
  value: string | number;
  /** Caption label rendered above the value (e.g. "Route", "Points"). */
  label?: string;
  /** Cell font size in px. Default 16. */
  size?: number;
  /** Caption font size in px. Default 9. */
  labelSize?: number;
  /** className applied to the outer column. */
  className?: string;
}

export default function FlapDisplay({
  value,
  label,
  size = 16,
  labelSize = 9,
  className = '',
}: FlapDisplayProps) {
  const prefersReduced = useReducedMotion();

  return (
    <div className={className}>
      {label && (
        <div
          className="font-mono uppercase mb-1"
          style={{
            fontSize: labelSize,
            letterSpacing: '0.22em',
            color: 'rgba(244,241,234,0.38)',
            fontFamily: 'var(--font-mono, "Geist Mono"), ui-monospace, monospace',
          }}
        >
          {label}
        </div>
      )}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={String(value)}
          initial={prefersReduced ? { opacity: 1 } : { rotateX: -90, opacity: 0 }}
          animate={prefersReduced ? { opacity: 1 } : { rotateX: 0, opacity: 1 }}
          exit={prefersReduced ? { opacity: 0 } : { rotateX: 90, opacity: 0 }}
          transition={{ duration: prefersReduced ? 0.15 : 0.42, ease: [0.4, 0, 0.2, 1] }}
          className="font-mono tabular-nums"
          style={{
            fontSize: size,
            color: 'var(--color-bg, #FAF9F5)',
            fontFamily: 'var(--font-mono, "Geist Mono"), ui-monospace, monospace',
            transformOrigin: 'top center',
          }}
        >
          {value}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
