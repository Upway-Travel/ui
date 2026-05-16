/**
 * AppMockupFrame — generic SVG-grade chrome frame for an app screenshot
 * or mocked UI surface.
 *
 * Graduates the inlined chrome from
 * `~/upway-landing/src/components/AppMockup.tsx`. The frame renders a
 * "product photography" container (cream surface, hairline border,
 * layered shadow) with an optional macOS-style dot row + mono caption
 * across the chrome bar. Children render inside.
 *
 * Pulls color from `--color-bg` / `--color-surface` / `--color-text` and
 * font from `--font-ui` / `--font-mono` so it auto-retunes per public/lab
 * scope (see tokens.css contract).
 *
 * Stateless / motionless — no reduced-motion handling needed.
 */

import type { ReactNode } from 'react';

const MONO_FAMILY = 'var(--font-mono, "Geist Mono"), ui-monospace, monospace';
const UI_FAMILY = 'var(--font-ui, "Geist Sans"), system-ui, sans-serif';

export interface AppMockupFrameProps {
  /** Inner mockup content — typically a conversation, result card, or panel. */
  children: ReactNode;
  /** Optional caption shown in the chrome bar (mono small-caps).
   *  Default "UPWAY · ADVISER". Pass null/empty to hide. */
  title?: string;
  /** Optional caption rendered below the frame (mono small-caps). */
  caption?: string;
  /** If true, the chrome bar's dot row is omitted — useful for tighter
   *  embeds where the OS chrome would feel redundant. */
  mono?: boolean;
  /** Optional className applied to the outer container. */
  className?: string;
  /** ARIA label override. Default uses `title`. */
  ariaLabel?: string;
}

export default function AppMockupFrame({
  children,
  title = 'UPWAY · ADVISER',
  caption,
  mono = false,
  className = '',
  ariaLabel,
}: AppMockupFrameProps) {
  const showChrome = title !== '' || !mono;

  return (
    <div className={className}>
      <div
        className="relative"
        style={{
          background: 'var(--color-bg, #FAF9F5)',
          border: '1px solid rgba(10,14,20,0.08)',
          borderRadius: 14,
          boxShadow:
            '0 1px 0 rgba(255,255,255,0.9) inset, 0 24px 48px -16px rgba(10,14,20,0.12), 0 8px 16px -8px rgba(10,14,20,0.08)',
          overflow: 'hidden',
          fontFamily: UI_FAMILY,
        }}
        aria-label={ariaLabel ?? title ?? 'Upway app mockup'}
      >
        {showChrome && (
          <div
            className="flex items-center gap-2 px-4 py-2.5"
            style={{
              background: 'var(--color-surface, #F4F1EA)',
              borderBottom: '1px solid rgba(10,14,20,0.06)',
            }}
          >
            {!mono && (
              <div className="flex gap-1.5">
                <Dot />
                <Dot />
                <Dot />
              </div>
            )}
            {title && (
              <div
                className="ml-auto font-mono"
                style={{
                  fontSize: 10,
                  letterSpacing: '0.2em',
                  color: 'rgba(10,14,20,0.42)',
                  fontFamily: MONO_FAMILY,
                }}
              >
                {title}
              </div>
            )}
          </div>
        )}

        {children}
      </div>

      {caption && (
        <p
          className="uppercase mt-3 text-center"
          style={{
            fontFamily: MONO_FAMILY,
            fontSize: 10,
            letterSpacing: '0.22em',
            color: 'rgba(10,14,20,0.45)',
          }}
        >
          {caption}
        </p>
      )}
    </div>
  );
}

function Dot() {
  return (
    <span
      style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: 'rgba(10,14,20,0.18)',
        display: 'inline-block',
      }}
    />
  );
}
