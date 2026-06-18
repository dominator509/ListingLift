import type { ReactNode, SelectHTMLAttributes } from 'react';
import clsx from 'clsx';

export type SelectOption = { label: string; value: string; disabled?: boolean };

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  helper?: ReactNode;
  error?: ReactNode;
  options: SelectOption[];
};

export function Select({ label, helper, error, id, className, options, ...props }: SelectProps) {
  const selectId = id ?? props.name;
  return (
    <label className="block space-y-2" htmlFor={selectId}>
      {label ? <span className="text-sm font-medium text-slate-800">{label}</span> : null}
      <select
        id={selectId}
        className={clsx(
          'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
          error && 'border-rose-300 focus:border-rose-500 focus:ring-rose-100',
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      {helper && !error ? <span className="block text-xs leading-5 text-slate-500">{helper}</span> : null}
      {error ? <span className="block text-xs leading-5 text-rose-600">{error}</span> : null}
    </label>
  );
}
