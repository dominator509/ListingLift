import type { ReactNode } from 'react';

export function ErrorState({ title = 'Something needs attention', description = 'The request could not be completed. Try again or use a manual fallback.', action }: { title?: string; description?: string; action?: ReactNode }) {
  return (
    <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6" role="alert">
      <p className="text-base font-semibold text-rose-900">{title}</p>
      <p className="mt-2 text-sm leading-6 text-rose-800">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </section>
  );
}
