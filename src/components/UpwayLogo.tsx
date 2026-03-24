/**
 * Upway brand mark — clean paper plane with Forest-to-Sage gradient.
 * Simple, works at every size from 16px to 120px.
 */

interface LogoProps {
  size?: number;
  className?: string;
}

/** The raw SVG logomark — paper plane + ascending trail */
export function UpwayMark({ size = 20, className = '' }: LogoProps) {
  const id = `um-${Math.random().toString(36).slice(2, 6)}`;
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
        <linearGradient id={id} x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1a4d32" />
          <stop offset="100%" stopColor="#8fbfa0" />
        </linearGradient>
      </defs>
      {/* Ascending trail */}
      <path
        d="M2 20c3-3 6-6 8-9"
        stroke={`url(#${id})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.45"
      />
      {/* Paper plane */}
      <path
        d="M22 2L8 13l4 5L22 2z"
        fill={`url(#${id})`}
      />
      <path
        d="M22 2L12 18l-4-5L22 2z"
        fill={`url(#${id})`}
        opacity="0.7"
      />
      <path
        d="M8 13L6 21l6-3-4-5z"
        fill={`url(#${id})`}
        opacity="0.5"
      />
    </svg>
  );
}

/** Badge version — glass container with brand mark */
export default function UpwayLogo({ size = 36, className = '' }: LogoProps) {
  return (
    <div
      className={`rounded-xl flex items-center justify-center shrink-0 backdrop-blur-md
        bg-[var(--glass-bg)] border border-[var(--glass-border)]
        ${className}`}
      style={{
        width: size,
        height: size,
        boxShadow: 'var(--glass-shadow), var(--glass-inner-light), 0 0 12px rgba(26,77,50,0.08)',
      }}
    >
      <UpwayMark size={size * 0.65} />
    </div>
  );
}
