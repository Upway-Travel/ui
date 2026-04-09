import { forwardRef } from 'react';
import type { SelectHTMLAttributes, ReactNode } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  icon?: ReactNode;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, icon, error, options, className = '', ...props }, ref) => {
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
          <select
            ref={ref}
            className={[
              'w-full h-10 px-3 py-2 rounded-lg text-sm appearance-none',
              'bg-[var(--surface)] border border-[var(--border)] shadow-[0_1px_2px_rgba(0,0,0,0.05)]',
              'text-[var(--text)] placeholder:text-[var(--text-muted)]',
              'transition-[border-color,box-shadow] duration-150',
              'focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-muted)] focus:shadow-[0_0_0_3px_rgba(var(--primary-rgb,99,102,241),0.15)]',
              error ? 'border-red-500' : '',
              icon ? 'pl-10' : '',
              'pr-10',
              className,
            ].filter(Boolean).join(' ')}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        {error && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
