import { useEffect, useState } from 'react';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
  label?: string;
}

function getScoreColor(score: number): string {
  if (score >= 90) return '#c4961a';
  if (score >= 60) return 'var(--score-good)';
  if (score >= 40) return 'var(--score-fair)';
  return 'var(--score-poor)';
}

export default function ScoreRing({
  score,
  size = 64,
  strokeWidth = 2.5,
  className = '',
  showLabel = true,
  label,
}: ScoreRingProps) {
  const [animated, setAnimated] = useState(false);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);
  const isExcellent = score >= 90;
  const glowFilter = isExcellent ? 'drop-shadow(0 0 4px #d4a828) drop-shadow(0 0 8px rgba(212, 168, 40, 0.3))' : 'none';

  useEffect(() => {
    const frame = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className={`inline-flex flex-col items-center gap-1 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ filter: glowFilter }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--surface3)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={animated ? offset : circumference}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-bold font-mono tabular-nums"
            style={{ color, fontSize: Math.max(12, size * 0.24) }}
          >
            {score}
          </span>
        </div>
      </div>
      {showLabel && label && (
        <span className="text-xs font-medium" style={{ color: 'var(--text3)' }}>
          {label}
        </span>
      )}
    </div>
  );
}
