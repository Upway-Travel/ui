/**
 * Upway brand mark — 2026 passport stamp.
 *
 * The mark: a circular passport stamp with dashed outer ring, solid inner ring,
 * "UPWAY" bold across the center, and a small plane silhouette above.
 * Slightly rotated for a hand-stamped feel. Uses feTurbulence for rough edges
 * and wobbly bezier paths for authentic rubber-stamp imperfection.
 */

interface LogoProps {
  size?: number;
  className?: string;
}

/** The raw SVG logomark — passport stamp */
export function UpwayMark({ size = 20, className = '' }: LogoProps) {
  const id = `um-${Math.random().toString(36).slice(2, 6)}`;
  const isSimplified = size < 24;
  const forest = '#1a4d32';

  if (isSimplified) {
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
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          opacity="0.85"
        />
        <text
          x="12"
          y="16.5"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="800"
          fontSize="14"
          fill="currentColor"
          letterSpacing="0.5"
        >
          U
        </text>
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      style={{ color: forest }}
    >
      <defs>
        {/* Rough-edge filter for authentic rubber stamp feel */}
        <filter id={`${id}-rough`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.04"
            numOctaves="4"
            seed="3"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="1.8"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        {/* Slightly heavier distortion for the circles */}
        <filter id={`${id}-wobble`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.035"
            numOctaves="3"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2.2"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>

      <g transform="rotate(-2.5, 50, 50)">
        {/* Outer dashed circle — wobbly bezier path for imperfection */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeDasharray="8 5"
          fill="none"
          opacity="0.8"
          filter={`url(#${id}-wobble)`}
        />

        {/* Inner solid circle */}
        <circle
          cx="50"
          cy="50"
          r="38"
          stroke="currentColor"
          strokeWidth="1.8"
          fill="none"
          opacity="0.75"
          filter={`url(#${id}-wobble)`}
        />

        {/* Small plane silhouette above text */}
        <g
          transform="translate(50, 33) scale(0.55)"
          filter={`url(#${id}-rough)`}
        >
          <path
            d="M0 -6 L-3 0 L-12 4 L-3 2 L-3 6 L-6 8 L-2 7.5 L0 9 L2 7.5 L6 8 L3 6 L3 2 L12 4 L3 0 Z"
            fill="currentColor"
            opacity="0.85"
          />
        </g>

        {/* "UPWAY" bold across center */}
        <text
          x="50"
          y="56"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, 'Helvetica Neue', sans-serif"
          fontWeight="900"
          fontSize="18"
          letterSpacing="4"
          fill="currentColor"
          opacity="0.9"
          filter={`url(#${id}-rough)`}
        >
          UPWAY
        </text>

        {/* Thin decorative lines flanking the text */}
        <line
          x1="18"
          y1="44"
          x2="38"
          y2="44"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.5"
          filter={`url(#${id}-rough)`}
        />
        <line
          x1="62"
          y1="44"
          x2="82"
          y2="44"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.5"
          filter={`url(#${id}-rough)`}
        />

        {/* Bottom curved text area — small tagline arc */}
        <path
          id={`${id}-arc`}
          d="M 25 65 Q 50 80 75 65"
          fill="none"
          stroke="none"
        />
        <text
          fontFamily="system-ui, -apple-system, 'Helvetica Neue', sans-serif"
          fontWeight="600"
          fontSize="6.5"
          letterSpacing="2.5"
          fill="currentColor"
          opacity="0.6"
          filter={`url(#${id}-rough)`}
        >
          <textPath href={`#${id}-arc`} startOffset="50%" textAnchor="middle">
            TRAVEL CO
          </textPath>
        </text>

        {/* Star accents for passport-stamp authenticity */}
        <circle cx="22" cy="55" r="1.2" fill="currentColor" opacity="0.45" />
        <circle cx="78" cy="55" r="1.2" fill="currentColor" opacity="0.45" />
      </g>
    </svg>
  );
}

/** Badge version — glass container with passport stamp mark */
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
      <UpwayMark size={size * 0.75} />
    </div>
  );
}
