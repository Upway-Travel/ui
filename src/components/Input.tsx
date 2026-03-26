import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-1.5 text-[var(--text-2)]">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={[
              'w-full h-10 px-3 py-2 rounded-lg text-sm',
              'bg-[var(--surface)] border border-[var(--border)] shadow-[0_1px_2px_rgba(0,0,0,0.05)]',
              'text-[var(--text)] placeholder:text-[var(--text-muted)]',
              'transition-[border-color,box-shadow] duration-150',
              'focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-muted)] focus:shadow-[0_0_0_3px_rgba(143,191,160,0.15)]',
              error ? 'border-red-500' : '',
              icon ? 'pl-10' : '',
              className,
            ].filter(Boolean).join(' ')}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
