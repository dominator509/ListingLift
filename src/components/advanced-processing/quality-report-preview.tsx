export function QualityReportPreview() {
  return (
    <section className="rounded-2xl border bg-white p-5">
      <h3 className="text-base font-semibold text-slate-950">Image quality report preview</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-4"><div className="text-2xl font-semibold">0</div><div className="text-xs text-slate-500">Delivery-blocking flags unresolved</div></div>
        <div className="rounded-xl bg-slate-50 p-4"><div className="text-2xl font-semibold">Seller</div><div className="text-xs text-slate-500">Review recommended before publishing</div></div>
        <div className="rounded-xl bg-slate-50 p-4"><div className="text-2xl font-semibold">Draft</div><div className="text-xs text-slate-500">No marketplace guarantees</div></div>
      </div>
    </section>
  );
}
