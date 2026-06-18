import { AUTOMATION_WEBHOOK_SECURITY_RULES } from '@/domain/automation-webhooks';

export function AutomationSafetyPanel() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <h2 className="text-lg font-semibold text-slate-950">Automation safety rules</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">{AUTOMATION_WEBHOOK_SECURITY_RULES.map((rule) => <li key={rule}>{rule}</li>)}</ul>
    </section>
  );
}
