import { AUTOMATION_PROVIDERS, AUTOMATION_TRIGGERS } from '@/domain/automation-webhooks';

export function AutomationSubscriptionForm() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">Subscription draft</h2>
      <p className="mt-1 text-sm text-slate-600">Codex must wire this form to tenant-scoped Prisma writes, encrypted secret references, RBAC, audit logs, and rate limits.</p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">Provider<select className="mt-1 w-full rounded-xl border border-slate-300 p-2">{AUTOMATION_PROVIDERS.map((provider) => <option key={provider.key}>{provider.label}</option>)}</select></label>
        <label className="text-sm font-medium text-slate-700">Trigger<select className="mt-1 w-full rounded-xl border border-slate-300 p-2">{AUTOMATION_TRIGGERS.map((trigger) => <option key={trigger.key}>{trigger.label}</option>)}</select></label>
      </div>
      <button className="mt-4 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white" type="button">Create dry-run subscription</button>
    </section>
  );
}
