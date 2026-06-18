export function DeliveryEmailPreview() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">Delivery email preview</h2>
      <p className="mt-2 text-sm text-slate-600">Mock email mode is enabled by default. SMTP must remain disabled until Codex verifies environment variables, adapter tests, and redaction.</p>
      <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700 whitespace-pre-line">Hi,\n\nYour ListingLift image pack is ready for secure download.\n\nFiles are provided as platform-ready drafts. Please review them before publishing.</div>
    </section>
  );
}
