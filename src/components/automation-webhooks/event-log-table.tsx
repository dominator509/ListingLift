const rows = [
  { trigger: 'New paid order', action: 'Notify admin', status: 'Queued' },
  { trigger: 'Job waiting for review', action: 'Create ClickUp task', status: 'Dry-run' },
  { trigger: 'Download ready', action: 'Send email', status: 'Blocked until delivery approval' },
];

export function AutomationEventLogTable() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">Automation event log scaffold</h2>
      <table className="mt-4 w-full text-left text-sm"><thead className="text-xs uppercase text-slate-500"><tr><th className="py-2">Trigger</th><th>Action</th><th>Status</th></tr></thead><tbody className="divide-y divide-slate-100">{rows.map((row) => <tr key={`${row.trigger}-${row.action}`}><td className="py-3 font-medium text-slate-900">{row.trigger}</td><td>{row.action}</td><td>{row.status}</td></tr>)}</tbody></table>
    </section>
  );
}
