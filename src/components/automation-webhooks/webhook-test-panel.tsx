export function AutomationWebhookTestPanel() {
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
      <h2 className="text-lg font-semibold text-amber-950">Webhook test mode</h2>
      <p className="mt-1 text-sm text-amber-800">Tests must default to dry-run and mock adapters. Real webhook dispatch requires explicit feature flags, encrypted secret references, rate limits, and audit logging.</p>
      <button className="mt-4 rounded-xl border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-950" type="button">Send dry-run test</button>
    </section>
  );
}
