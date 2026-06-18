import type { QaCoverageItem } from '@/domain/full-testing-qa';

type CoverageRow = QaCoverageItem & { commandLabels?: string[]; status?: string };

export function QaCoverageMatrix({ coverage }: { coverage: CoverageRow[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">Roadmap coverage matrix</h2>
      <p className="mt-1 text-sm text-slate-600">Maps Phase 38 unit, integration, E2E, security, browser, and adapter coverage to ListingLift product surfaces.</p>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {coverage.map((item) => (
          <article key={item.key} className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{item.layer} · {item.productionRisk}</p>
              </div>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">{item.status ?? 'CODEX_REQUIRED'}</span>
            </div>
            <p className="mt-3 text-sm text-slate-600">{item.requiredSurface}</p>
            <p className="mt-3 text-xs text-slate-500">Commands: {(item.commandLabels ?? item.commandKeys).join(', ')}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
