import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'premium';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#1a4d32] text-white shadow-depth-2 hover:bg-[#163f29] hover:shadow-depth-3 hover:-translate-y-[0.5px] dark:bg-[#8fbfa0] dark:text-[#0d2e1d] dark:hover:bg-[#a3ccb2]',
  secondary:
    'bg-transparent text-[var(--text)] border border-[var(--border)] hover:bg-[var(--hover-bg)] hover:border-[var(--text2)]',
  ghost:
    'text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--hover-bg)]',
  danger:
    'bg-red-600 text-white hover:bg-red-700',
  premium:
    'bg-[#e8d44d] text-[#0d2e1d] font-semibold hover:bg-[#d4c045] hover:-translate-y-[0.5px]',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
  md: 'h-9 px-4 text-sm rounded-lg gap-2',
  lg: 'h-10 px-5 text-sm rounded-lg gap-2',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading,
  fullWidth,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center font-medium transition-all duration-150
        focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#8fbfa0]
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        icon
      ) : null}
      {children}
      {iconRight}
    </button>
  );
}
