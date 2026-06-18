export function TaskrabbitRevenueSummaryCard() {
  const metrics = [
    ['Manual tasks', 'Track task count by category'],
    ['Task value', 'Attribute revenue to Taskrabbit'],
    ['Direct conversion', 'Measure follow-up and retainer wins'],
  ];
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {metrics.map(([label, description]) => (
        <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-slate-950">{label}</h3>
          <p className="mt-2 text-sm text-slate-600">{description}</p>
        </div>
      ))}
    </section>
  );
}
