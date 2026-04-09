import { useEffect, useRef } from 'react';
import { useSpring, useTransform, motion, useMotionValue } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  format?: 'number' | 'currency' | 'points';
  className?: string;
  duration?: number;
}

export default function AnimatedCounter({
  value,
  format = 'number',
  className = '',
  duration = 0.8,
}: AnimatedCounterProps) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    mass: 0.8,
    stiffness: 75,
    damping: 15,
  });
  const display = useTransform(spring, (v: number) => {
    const rounded = Math.round(v);
    switch (format) {
      case 'currency':
        return `$${rounded.toLocaleString()}`;
      case 'points':
        return rounded.toLocaleString();
      default:
        return rounded.toLocaleString();
    }
  });

  const prevValue = useRef(0);

  useEffect(() => {
    if (value !== prevValue.current) {
      motionValue.set(value);
      prevValue.current = value;
    }
  }, [value, motionValue]);

  return (
    <motion.span className={`font-mono tabular-nums ${className}`}>
      {display}
    </motion.span>
  );
}
