export function NotificationHealthPanel() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">Notification adapter health</h2>
      <p className="mt-2 text-sm text-slate-600">Mock email is the baseline. SMTP must be feature-flagged and verified before production sends.</p>
      <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">Mock email adapter available without paid credentials.</div>
    </section>
  );
}
