import type { ReactNode } from 'react';
import clsx from 'clsx';

export function Modal({ open, title, description, children, footer, className }: { open: boolean; title: ReactNode; description?: ReactNode; children: ReactNode; footer?: ReactNode; className?: string }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <section className={clsx('w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl', className)}>
        <h2 id="modal-title" className="text-xl font-semibold text-slate-950">{title}</h2>
        {description ? <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p> : null}
        <div className="mt-6">{children}</div>
        {footer ? <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">{footer}</div> : null}
      </section>
    </div>
  );
}
