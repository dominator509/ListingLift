import type { QaCriticalJourney } from '@/domain/full-testing-qa';

export function QaCriticalJourneyPanel({ journeys }: { journeys: QaCriticalJourney[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">Critical end-to-end journeys</h2>
      <div className="mt-5 space-y-4">
        {journeys.map((journey) => (
          <article key={journey.key} className="rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-950">{journey.title}</h3>
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">Routes</p>
            <p className="mt-1 font-mono text-xs text-slate-700">{journey.routeTargets.join(' · ')}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
              {journey.assertions.map((assertion) => <li key={assertion}>{assertion}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
