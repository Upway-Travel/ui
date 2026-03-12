import type { ReactNode } from 'react';

type BadgeVariant = 'purple' | 'pink' | 'blue' | 'green' | 'amber' | 'red' | 'slate' | 'gold';
type BadgeSize = 'xs' | 'sm' | 'md';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: ReactNode;
  pulse?: boolean;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300',
  pink: 'bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
  green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  red: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
  slate: 'bg-slate-100 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400',
  gold: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

const sizeClasses: Record<BadgeSize, string> = {
  xs: 'px-1.5 py-0.5 text-[10px]',
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
};

const pulseDotColors: Record<BadgeVariant, string> = {
  purple: 'bg-purple-700 dark:bg-purple-300',
  pink: 'bg-pink-700 dark:bg-pink-300',
  blue: 'bg-blue-700 dark:bg-blue-300',
  green: 'bg-emerald-700 dark:bg-emerald-300',
  amber: 'bg-amber-700 dark:bg-amber-300',
  red: 'bg-red-700 dark:bg-red-300',
  slate: 'bg-slate-600 dark:bg-slate-400',
  gold: 'bg-amber-700 dark:bg-amber-400',
};

export default function Badge({
  variant = 'purple',
  size = 'sm',
  icon,
  pulse = false,
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-md ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {pulse && (
        <span
          className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full animate-pulse ${pulseDotColors[variant]}`}
        />
      )}
      {icon}
      {children}
    </span>
  );
}
