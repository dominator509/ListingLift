export function DownloadSecurityPanel() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">Download security gates</h2>
      <ul className="mt-4 space-y-2 text-sm text-slate-700">
        <li>• Delivery token is stored as a hash only.</li>
        <li>• Link must be active, unexpired, under the download limit, and unrevoked.</li>
        <li>• Job must be approved and ready for delivery.</li>
        <li>• Delivery archive must be approved.</li>
        <li>• Every access and denial must be audited.</li>
      </ul>
    </section>
  );
}
