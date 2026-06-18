export function QaSummaryCards({ summary }: { summary: { commandCount: number; coverageItems: number; criticalJourneys: number; smokeRoutes: number; blockerCount: number; productionReady: boolean } }) {
  const cards = [
    { label: 'QA commands', value: summary.commandCount, detail: 'Codex must run and attach evidence' },
    { label: 'Coverage items', value: summary.coverageItems, detail: 'Roadmap unit/integration/E2E map' },
    { label: 'Critical journeys', value: summary.criticalJourneys, detail: 'End-to-end fulfillment flows' },
    { label: 'Smoke routes', value: summary.smokeRoutes, detail: 'Browser-render targets' },
    { label: 'Blockers', value: summary.blockerCount, detail: 'Cannot release until cleared' },
    { label: 'Production ready', value: summary.productionReady ? 'Yes' : 'No', detail: 'Scaffold-only until Codex evidence exists' },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <section key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">{card.label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{card.value}</p>
          <p className="mt-2 text-sm text-slate-600">{card.detail}</p>
        </section>
      ))}
    </div>
  );
}
