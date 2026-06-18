export function DeliveryApprovalGateCard({ blockers }: { blockers: string[] }) {
  const clear = blockers.length === 0;
  return <section className="rounded-2xl border bg-white p-6 shadow-sm"><h2 className="text-xl font-semibold text-slate-950">Delivery approval gate</h2><p className="mt-2 text-sm text-slate-600">Final downloads remain hidden until every approval, archive, delivery-link, and permission gate passes.</p><div className={`mt-4 rounded-xl p-4 text-sm ${clear ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>{clear ? 'No delivery blockers in this draft.' : blockers.join(' · ')}</div></section>;
}
