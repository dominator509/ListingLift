export function GenericFollowUpStatusPanel() {
  const statuses = ['QUALIFICATION_NEEDED', 'PROPOSAL_DRAFTED', 'WAITING_FOR_RESPONSE', 'ORDER_CONFIRMED', 'FOLLOW_UP_NEEDED', 'RETAINER_CONVERTED', 'CLOSED_LOST'];
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-950">Follow-up status</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {statuses.map((status) => <span key={status} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{status}</span>)}
      </div>
      <p className="mt-4 text-sm text-slate-600">Follow-ups are operator prompts, not automated platform messages.</p>
    </section>
  );
}
