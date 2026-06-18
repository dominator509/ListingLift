import { DEFAULT_OTHER_SALES_CHANNELS } from '@/domain/generic-sales-channels';

export function OtherSalesChannelCatalogTable() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-950">Selectable Phase 23 sources</h2>
      <p className="mt-2 text-sm text-slate-600">Every channel is manual-first by default and normalizes into ListingLift jobs.</p>
      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr><th className="px-4 py-3">Source</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Default package</th><th className="px-4 py-3">Workflow</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {DEFAULT_OTHER_SALES_CHANNELS.map((channel) => (
              <tr key={channel.key}>
                <td className="px-4 py-3 font-medium text-slate-950">{channel.label}</td>
                <td className="px-4 py-3 text-slate-600">{channel.category}</td>
                <td className="px-4 py-3 text-slate-600">{channel.defaultPackageKey}</td>
                <td className="px-4 py-3 text-slate-600">Manual-first</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
