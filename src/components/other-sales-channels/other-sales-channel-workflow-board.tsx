import { DEFAULT_OTHER_SALES_CHANNELS, OTHER_SALES_CHANNEL_SAFETY_RULES } from '@/domain/generic-sales-channels';

export function OtherSalesChannelWorkflowBoard() {
  const stages = ['Lead captured', 'Proposal drafted', 'Order confirmed', 'Upload link sent', 'Fulfillment', 'Delivery/follow-up'];
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">Other sales channel workflow</h2>
          <p className="mt-2 text-sm text-slate-600">Manual-first intake for freelance marketplaces, directories, social profiles, communities, launch platforms, and local lead sources.</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{DEFAULT_OTHER_SALES_CHANNELS.length} selectable sources</span>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {stages.map((stage) => (
          <div key={stage} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-medium text-slate-950">{stage}</h3>
            <p className="mt-2 text-sm text-slate-600">Seed stage for Phase 23 source-to-job normalization.</p>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <h3 className="font-medium text-amber-950">Marketplace and community safety</h3>
        <ul className="mt-3 grid gap-2 text-sm text-amber-900 md:grid-cols-2">
          {OTHER_SALES_CHANNEL_SAFETY_RULES.slice(0, 6).map((rule) => <li key={rule}>• {rule}</li>)}
        </ul>
      </div>
    </section>
  );
}
