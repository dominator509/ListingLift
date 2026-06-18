export function QaSmokeTargetPanel({ smokeTargets }: { smokeTargets: { group: string; routes: readonly string[]; routeCount: number; status: string }[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">Browser smoke route targets</h2>
      <p className="mt-1 text-sm text-slate-600">Codex must verify these route groups in a real browser and retain screenshots or traces where useful.</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {smokeTargets.map((target) => (
          <article key={target.group} className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold text-slate-950">{target.group}</h3>
              <span className="text-xs font-semibold text-amber-700">{target.status}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">{target.routeCount} routes</p>
            <p className="mt-3 font-mono text-xs leading-5 text-slate-700">{target.routes.join('\n')}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
