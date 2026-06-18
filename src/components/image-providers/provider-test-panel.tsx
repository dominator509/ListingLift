export function ImageProviderTestPanel() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">Dry-run test contract</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        The Phase 10 seed exposes <code>POST /api/image-providers/test</code>. Non-mock providers must remain dry-run only until Codex implements real API calls, encrypted-secret lookup, timeout/retry behavior, and adapter-contract tests.
      </p>
      <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
        Real provider calls must never be required for baseline tests.
      </div>
    </section>
  );
}
