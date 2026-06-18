export function AutomationDeadLetterPanel() {
  return (
    <section className="rounded-2xl border border-rose-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-rose-950">Dead-letter queue</h2>
      <p className="mt-1 text-sm text-slate-600">Failed automation dispatches must never block fulfillment. Codex must persist failures, show manual fallback tasks, and require operator replay confirmation.</p>
      <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-700"><li>Show failed provider/action/trigger.</li><li>Show redacted payload only.</li><li>Allow replay only with RBAC and audit logging.</li></ul>
    </section>
  );
}
