import type { InputHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helper?: ReactNode;
  error?: ReactNode;
};

export function Input({ label, helper, error, id, className, ...props }: InputProps) {
  const inputId = id ?? props.name;
  return (
    <label className="block space-y-2" htmlFor={inputId}>
      {label ? <span className="text-sm font-medium text-slate-800">{label}</span> : null}
      <input
        id={inputId}
        className={clsx(
          'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
          error && 'border-rose-300 focus:border-rose-500 focus:ring-rose-100',
          className,
        )}
        {...props}
      />
      {helper && !error ? <span className="block text-xs leading-5 text-slate-500">{helper}</span> : null}
      {error ? <span className="block text-xs leading-5 text-rose-600">{error}</span> : null}
    </label>
  );
}
