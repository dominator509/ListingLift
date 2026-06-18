export function DeliveryLinkManager() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">Delivery link manager</h2>
      <p className="mt-2 text-sm text-slate-600">Issue expiring, hashed-token delivery links only after manual approval and approved ZIP archive readiness.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Default TTL</p><p className="font-semibold">7 days</p></div>
        <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Default max downloads</p><p className="font-semibold">5</p></div>
        <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Token storage</p><p className="font-semibold">Hash only</p></div>
      </div>
    </section>
  );
}
