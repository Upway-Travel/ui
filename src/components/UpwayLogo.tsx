/**
 * Upway brand marks — Design Kernel v2.0, locked 2026-05-27.
 *
 *   UpwayMark  — the glyph (paper plane pointing up). Inline, nav, chrome.
 *   UpwayIcon  — squircle app-icon lockup (forest-deep + ambient sage glow + plane).
 *                Use for app icons, PWA/favicon-with-background, hero moments.
 *   UpwayLogo  — default export, wraps UpwayMark for back-compat.
 *
 * Volt rule preserved: the plane's NOSE is Volt (a sharp tip facet); the rest is
 * forest/sage by surface. One event per icon. Two-tone fill by `tone` prop.
 */

import { useId } from 'react';

interface MarkProps {
  size?: number;
  /** "light" for cream/bone surfaces, "dark" for forest-deep surfaces. */
  tone?: 'light' | 'dark';
  className?: string;
}

interface IconProps {
  size?: number;
  className?: string;
}

export function UpwayMark({ size = 20, tone = 'light', className = '' }: MarkProps) {
  const id = `um-${useId().replace(/:/g, '')}`;
  const lit = tone === 'dark' ? ['#2D6B47', '#A7D9B6'] : ['#1A4D32', '#8FBFA0'];
  const sh  = tone === 'dark' ? ['#1A4D32', '#3A7A53'] : ['#0D2E1D', '#1A4D32'];
  const sheenOp = tone === 'dark' ? 0.22 : 0.12;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-lit`} x1="0" y1="1" x2="0.3" y2="0">
          <stop offset="0%" stopColor={lit[0]} />
          <stop offset="100%" stopColor={lit[1]} />
        </linearGradient>
        <linearGradient id={`${id}-sh`} x1="0" y1="1" x2="0.3" y2="0">
          <stop offset="0%" stopColor={sh[0]} />
          <stop offset="100%" stopColor={sh[1]} />
        </linearGradient>
      </defs>
      {/* Left (lit) facet */}
      <path d="M12 2.5 L3.5 19 L12 15.5 Z" fill={`url(#${id}-lit)`} />
      {/* Right (shadow) facet */}
      <path d="M12 2.5 L20.5 19 L12 15.5 Z" fill={`url(#${id}-sh)`} />
      {/* Specular sheen on lit facet */}
      <path d="M12 3.4 L7.6 12.8 L11.1 12.4 Z" fill="#ffffff" opacity={sheenOp} />
      {/* Volt tip — the nose catches the light. Single event. */}
      <path d="M12 2.5 L9.8 6 L14.2 6 Z" fill="#C6FF3D" />
    </svg>
  );
}

export function UpwayIcon({ size = 48, className = '' }: IconProps) {
  const id = `ui-${useId().replace(/:/g, '')}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Upway"
    >
      <defs>
        <radialGradient id={`${id}-bg`} cx="0.5" cy="0.42" r="0.78">
          <stop offset="0%" stopColor="#205A3A" />
          <stop offset="100%" stopColor="#08200F" />
        </radialGradient>
        <radialGradient id={`${id}-glow`} cx="0.3" cy="0.25" r="0.85">
          <stop offset="0%" stopColor="rgba(143,191,160,0.55)" />
          <stop offset="100%" stopColor="rgba(143,191,160,0)" />
        </radialGradient>
        <linearGradient id={`${id}-lit`} x1="0" y1="1" x2="0.3" y2="0">
          <stop offset="0%" stopColor="#2D6B47" />
          <stop offset="100%" stopColor="#A7D9B6" />
        </linearGradient>
        <linearGradient id={`${id}-sh`} x1="0" y1="1" x2="0.3" y2="0">
          <stop offset="0%" stopColor="#1A4D32" />
          <stop offset="100%" stopColor="#3A7A53" />
        </linearGradient>
      </defs>
      {/* Squircle: forest-deep radial depth + sage ambient glow */}
      <rect x="2" y="2" width="44" height="44" rx="11" fill={`url(#${id}-bg)`} />
      <rect x="2" y="2" width="44" height="44" rx="11" fill={`url(#${id}-glow)`} />
      {/* Contact shadow */}
      <ellipse cx="24" cy="34" rx="11" ry="2.4" fill="#000" opacity="0.22" />
      {/* Plane, scaled into the squircle */}
      <g transform="translate(12, 12)">
        <path d="M12 2.5 L3.5 19 L12 15.5 Z" fill={`url(#${id}-lit)`} />
        <path d="M12 2.5 L20.5 19 L12 15.5 Z" fill={`url(#${id}-sh)`} />
        <path d="M12 3.4 L7.6 12.8 L11.1 12.4 Z" fill="#ffffff" opacity="0.22" />
        <path d="M12 2.5 L9.8 6 L14.2 6 Z" fill="#C6FF3D" />
      </g>
      {/* Glass rim highlight */}
      <rect x="2.5" y="2.5" width="43" height="43" rx="10.5" fill="none" stroke="rgba(255,255,255,0.10)" />
    </svg>
  );
}

export default function UpwayLogo({ size = 36, tone = 'light', className = '' }: MarkProps) {
  return <UpwayMark size={size} tone={tone} className={className} />;
}
