import { DEFAULT_OTHER_SALES_CHANNELS } from '@/domain/generic-sales-channels';

export function GenericManualOrderForm() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-950">Manual lead/order intake</h2>
      <p className="mt-2 text-sm text-slate-600">Seed form shell. Codex must wire this to tenant-scoped Prisma transactions and audit logs.</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-slate-700">Source<select className="rounded-xl border border-slate-300 px-3 py-2 text-slate-900"><option>Select source</option>{DEFAULT_OTHER_SALES_CHANNELS.map((channel) => <option key={channel.key}>{channel.label}</option>)}</select></label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">External reference<input className="rounded-xl border border-slate-300 px-3 py-2" placeholder="Lead/order/project ID" /></label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">Buyer or business<input className="rounded-xl border border-slate-300 px-3 py-2" placeholder="Minimal customer identifier" /></label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">Deadline<input className="rounded-xl border border-slate-300 px-3 py-2" type="date" /></label>
      </div>
      <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Manual fallback is mandatory. Do not scrape or automate platform messaging.</div>
    </section>
  );
}
