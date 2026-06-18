import { DEFAULT_MARKETPLACE_EXPORT_CHANNELS } from '@/domain/amazon-ebay-woocommerce';

export function MarketplaceExportPlanPanel() {
  return (
    <section className="rounded-2xl border bg-card p-5">
      <h2 className="text-lg font-semibold">Export plan templates</h2>
      <div className="mt-4 overflow-hidden rounded-xl border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted text-xs uppercase text-muted-foreground">
            <tr><th className="p-3">Channel</th><th className="p-3">Folders</th><th className="p-3">Roles</th></tr>
          </thead>
          <tbody>
            {DEFAULT_MARKETPLACE_EXPORT_CHANNELS.map((channel) => (
              <tr key={channel.key} className="border-t">
                <td className="p-3 font-medium">{channel.label}</td>
                <td className="p-3">By SKU, platform folder, manifest, ReadMe</td>
                <td className="p-3">{channel.defaultImageRoles.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
