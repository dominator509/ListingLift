import type { ReactNode } from 'react';
import clsx from 'clsx';

export function PageHeader({ eyebrow, title, description, actions, className }: { eyebrow?: string; title: ReactNode; description?: ReactNode; actions?: ReactNode; className?: string }) {
  return (
    <header className={clsx('mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between', className)}>
      <div>
        {eyebrow ? <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-700">{eyebrow}</p> : null}
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">{title}</h1>
        {description ? <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </header>
  );
}
