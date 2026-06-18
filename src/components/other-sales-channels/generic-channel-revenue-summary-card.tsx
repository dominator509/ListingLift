import { DEFAULT_OTHER_SALES_CHANNELS } from '@/domain/generic-sales-channels';

export function GenericChannelRevenueSummaryCard() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-950">Revenue attribution</h2>
      <p className="mt-2 text-sm text-slate-600">Every Phase 23 lead/order must preserve source attribution and avoid duplicate job creation.</p>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs uppercase text-slate-500">Sources</p><p className="text-2xl font-bold text-slate-950">{DEFAULT_OTHER_SALES_CHANNELS.length}</p></div>
        <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs uppercase text-slate-500">Mode</p><p className="text-2xl font-bold text-slate-950">Manual</p></div>
        <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs uppercase text-slate-500">Tracking</p><p className="text-2xl font-bold text-slate-950">Required</p></div>
      </div>
    </section>
  );
}
