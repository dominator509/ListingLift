export function MarketplaceDeliveryTemplatePanel() {
  return (
    <section className="rounded-2xl border bg-card p-5">
      <h2 className="text-lg font-semibold">Delivery copy templates</h2>
      <p className="mt-2 text-sm text-muted-foreground">Delivery messages must be generated only after archive approval and must use seller-review-required, non-guarantee language.</p>
      <div className="mt-4 rounded-xl bg-muted p-4 text-sm whitespace-pre-wrap">Your marketplace image pack draft is ready for seller review. Please review all files against current platform, category, store, brand, and product rules before publishing.</div>
    </section>
  );
}
