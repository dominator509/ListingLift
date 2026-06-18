import { TASKRABBIT_MARKETPLACE_SAFETY_RULES } from '@/domain/taskrabbit';

export function TaskrabbitSafetyPanel() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-950">Taskrabbit safety checks</h2>
      <ul className="mt-4 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
        {TASKRABBIT_MARKETPLACE_SAFETY_RULES.map((rule) => <li key={rule}>• {rule}</li>)}
      </ul>
    </section>
  );
}
