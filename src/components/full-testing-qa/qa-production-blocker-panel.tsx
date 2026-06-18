import type { QaRiskItem } from '@/domain/full-testing-qa';

export function QaProductionBlockerPanel({ blockers }: { blockers: (QaRiskItem & { status?: string })[] }) {
  return (
    <section className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-red-950">Production blockers</h2>
      <p className="mt-1 text-sm text-red-800">These are intentionally unresolved until Codex performs real runtime, database, test, build, browser, and security verification.</p>
      <div className="mt-5 space-y-3">
        {blockers.map((blocker) => (
          <article key={blocker.key} className="rounded-xl border border-red-200 bg-white p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-800">{blocker.severity}</span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{blocker.area}</span>
              <span className="text-xs font-semibold text-amber-700">{blocker.status ?? 'CODEX_REQUIRED'}</span>
            </div>
            <p className="mt-3 font-medium text-slate-950">{blocker.risk}</p>
            <p className="mt-2 text-sm text-slate-600">{blocker.requiredCodexAction}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
