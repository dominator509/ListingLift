import { DEFAULT_TASKRABBIT_SERVICE_MAPPINGS, TASKRABBIT_MARKETPLACE_SAFETY_RULES } from '@/domain/taskrabbit';

export function TaskrabbitWorkflowBoard() {
  const stages = ['Task captured', 'Files needed', 'Processing', 'Review', 'Delivery ready', 'Direct follow-up'];
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">Taskrabbit workflow board</h2>
          <p className="mt-2 text-sm text-slate-600">Manual-first local service intake, upload links, delivery tracking, and direct-retainer conversion planning.</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{DEFAULT_TASKRABBIT_SERVICE_MAPPINGS.length} service mappings</span>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {stages.map((stage) => (
          <div key={stage} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-medium text-slate-950">{stage}</h3>
            <p className="mt-2 text-sm text-slate-600">Seed stage for Taskrabbit local-service fulfillment.</p>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <h3 className="font-medium text-amber-950">Marketplace safety</h3>
        <ul className="mt-3 grid gap-2 text-sm text-amber-900 md:grid-cols-2">
          {TASKRABBIT_MARKETPLACE_SAFETY_RULES.slice(0, 6).map((rule) => <li key={rule}>• {rule}</li>)}
        </ul>
      </div>
    </section>
  );
}
