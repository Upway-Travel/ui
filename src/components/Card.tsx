import { motion } from 'framer-motion';
import { staggerItem } from '../lib/animations';
import type { ReactNode, HTMLAttributes } from 'react';

type CardVariant =
  | 'default'
  | 'subtle'
  | 'elevated'
  | 'premium'
  // Legacy glass variants — all map to the same solid surface
  | 'glass'
  | 'glass-subtle'
  | 'glass-thin'
  | 'glass-elevated'
  | 'glass-thick'
  | 'glass-accent'
  | 'glass-frosted'
  | 'glass-interactive';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  interactive?: boolean;
  animate?: boolean;
  children: ReactNode;
}

const base = 'bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-depth-2 transition-[transform,box-shadow] duration-200 ease-out';

const variantClasses: Record<string, string> = {
  elevated: 'shadow-depth-3',
  premium: 'border-t-2 border-amber-500 shadow-depth-2 hover:shadow-premium',
};

const interactiveClasses = 'cursor-pointer hover:bg-[var(--hover-bg)] hover:border-[var(--border2)] hover:-translate-y-1 hover:shadow-depth-3';

export default function Card({
  variant = 'default',
  interactive = false,
  animate = false,
  children,
  className = '',
  onClick,
  ...props
}: CardProps) {
  const Component = animate ? motion.div : 'div';
  const animateProps = animate
    ? {
        variants: staggerItem,
        initial: 'initial',
        animate: 'animate',
      }
    : {};

  return (
    <Component
      className={`${base} p-5 ${variantClasses[variant] ?? ''} ${interactive ? interactiveClasses : ''} ${className}`.trim()}
      onClick={onClick}
      {...(animateProps as any)}
      {...(props as any)}
    >
      {children}
    </Component>
  );
}
