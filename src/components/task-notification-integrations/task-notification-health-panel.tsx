type Props = { title?: string; items?: Array<Record<string, unknown>> };

export function TaskNotificationHealthPanel({ title = 'Task notification health', items = [] }: Props) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        <p className="text-sm text-slate-600">Phase 30 seed UI. Codex must connect this panel to tenant-scoped provider state, audit logs, and real runtime checks.</p>
      </div>
      <div className="space-y-2">
        {items.length === 0 ? <p className="text-sm text-slate-500">No records loaded in the seed scaffold.</p> : items.map((item, index) => <pre key={index} className="overflow-auto rounded bg-slate-50 p-3 text-xs">{JSON.stringify(item, null, 2)}</pre>)}
      </div>
    </section>
  );
}
