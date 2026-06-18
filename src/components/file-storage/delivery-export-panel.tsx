export function DeliveryExportPanel() {
  return (
    <section className="rounded-xl border bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold">Delivery export planner</h3>
      <p className="mt-2 text-sm text-slate-600">Plan export of approved delivery archives to local, Google Drive, Dropbox, or manual download destinations.</p>
      <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">Exports must use approved delivery archives only and preserve audit logs for every client-facing action.</div>
    </section>
  );
}
