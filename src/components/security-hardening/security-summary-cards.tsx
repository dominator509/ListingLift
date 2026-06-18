export function SecuritySummaryCards({ summary }: { summary: { totalControls: number; criticalControls: number; codexRequiredControls: number; scaffoldedControls: number; productionReady: boolean } }) {
  const cards = [
    { label: 'Security controls', value: summary.totalControls, detail: 'Phase 37 control map' },
    { label: 'Critical controls', value: summary.criticalControls, detail: 'Must pass before production' },
    { label: 'Codex-required', value: summary.codexRequiredControls, detail: 'Runtime/database/browser verification' },
    { label: 'Production ready', value: summary.productionReady ? 'Yes' : 'No', detail: 'Still scaffold-only' },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
