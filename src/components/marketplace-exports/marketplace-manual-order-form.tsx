export function MarketplaceManualOrderForm() {
  return (
    <section className="rounded-2xl border bg-card p-5">
      <h2 className="text-lg font-semibold">Manual marketplace order intake</h2>
      <p className="mt-2 text-sm text-muted-foreground">Capture Amazon seller export, eBay order/export, or WooCommerce product-gallery work without scraping or storing marketplace passwords.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {['Channel', 'Store name', 'External reference', 'SKU', 'Package', 'Deadline'].map((label) => (
          <label key={label} className="text-sm font-medium">
            {label}
            <input className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" placeholder={label} />
          </label>
        ))}
      </div>
      <button className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Create dry-run plan</button>
    </section>
  );
}
