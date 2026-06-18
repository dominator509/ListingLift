import { DEFAULT_MARKETPLACE_EXPORT_CHANNELS, MARKETPLACE_EXPORT_SAFE_COPY } from '@/domain/amazon-ebay-woocommerce';

export function MarketplaceExportBoard() {
  return (
    <section className="space-y-4">
      <div className="rounded-2xl border bg-card p-5">
        <h2 className="text-xl font-semibold">Amazon, eBay, WooCommerce workflows</h2>
        <p className="mt-2 text-sm text-muted-foreground">{MARKETPLACE_EXPORT_SAFE_COPY}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {DEFAULT_MARKETPLACE_EXPORT_CHANNELS.map((channel) => (
          <article key={channel.key} className="rounded-2xl border bg-card p-4 shadow-sm">
            <div className="text-sm font-semibold">{channel.label}</div>
            <div className="mt-2 text-xs text-muted-foreground">Package: {channel.packageKey}</div>
            <div className="mt-2 text-xs text-muted-foreground">Presets: {channel.defaultPresetKeys.join(', ')}</div>
            <div className="mt-3 rounded-lg bg-muted p-3 text-xs">Seller review required before publishing.</div>
          </article>
        ))}
      </div>
    </section>
  );
}
