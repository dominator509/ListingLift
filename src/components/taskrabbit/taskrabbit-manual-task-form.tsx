import { DEFAULT_TASKRABBIT_SERVICE_MAPPINGS } from '@/domain/taskrabbit';

export function TaskrabbitManualTaskForm() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-950">Manual Taskrabbit task intake</h2>
      <p className="mt-2 text-sm text-slate-600">Codex must wire this form to /api/taskrabbit/manual-task with server-side RBAC, dedupe, tenant isolation, and audit logs.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {['Task ID', 'Customer name', 'Task category', 'Appointment/deadline', 'Task value', 'Conversion status'].map((field) => (
          <label key={field} className="grid gap-1 text-sm font-medium text-slate-700">
            {field}
            <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder={field} />
          </label>
        ))}
      </div>
      <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
        Default mapping options: {DEFAULT_TASKRABBIT_SERVICE_MAPPINGS.map((mapping) => mapping.title).join(', ')}.
      </div>
    </section>
  );
}
