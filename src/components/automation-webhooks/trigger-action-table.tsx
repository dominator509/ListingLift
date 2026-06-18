import { AUTOMATION_TRIGGERS } from '@/domain/automation-webhooks';

export function AutomationTriggerActionTable() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">Trigger and action map</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-slate-500"><tr><th className="py-2">Trigger</th><th>Default actions</th><th>Client visible</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {AUTOMATION_TRIGGERS.map((trigger) => (
              <tr key={trigger.key}><td className="py-3 font-medium text-slate-900">{trigger.label}<p className="font-normal text-slate-500">{trigger.description}</p></td><td>{trigger.defaultActions.join(', ')}</td><td>{trigger.clientVisible ? 'Yes' : 'No'}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
