import type { ReactNode } from 'react';
import clsx from 'clsx';

export type ToastTone = 'info' | 'success' | 'warning' | 'error';

const toneStyles: Record<ToastTone, string> = {
  info: 'border-blue-200 bg-blue-50 text-blue-900',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
  error: 'border-rose-200 bg-rose-50 text-rose-900',
};

export function Toast({ title, children, tone = 'info', className }: { title: ReactNode; children?: ReactNode; tone?: ToastTone; className?: string }) {
  return (
    <aside className={clsx('rounded-2xl border p-4 shadow-sm', toneStyles[tone], className)} role={tone === 'error' ? 'alert' : 'status'}>
      <p className="text-sm font-semibold">{title}</p>
      {children ? <div className="mt-1 text-sm leading-6 opacity-90">{children}</div> : null}
    </aside>
  );
}
