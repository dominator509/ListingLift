export function MarketplaceDeliveryMessagePanel() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">Marketplace delivery message</h2>
      <p className="mt-2 text-sm text-slate-600">Copyable delivery messages must respect each platform workflow. Deliver inside the marketplace when required.</p>
      <textarea className="mt-4 h-44 w-full rounded-xl border border-slate-200 p-3 text-sm" defaultValue={'Hi there,\n\nYour ListingLift image pack is ready for review and download. The files are platform-ready drafts with seller review recommended before publishing.\n\nThanks for using ListingLift.'} />
    </section>
  );
}
