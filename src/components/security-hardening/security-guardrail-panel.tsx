export function SecurityGuardrailPanel() {
  const rules = [
    'Never hardcode, log, or expose provider secrets, API keys, OAuth tokens, SMTP credentials, webhook secrets, signed URLs, marketplace credentials, or raw bearer tokens.',
    'Original uploads must be preserved; never overwrite originals during upload intake, background removal, bulk processing, agency workspaces, storage sync, or delivery generation.',
    'Every protected route must verify auth, RBAC, tenant scope, object ownership, and rate limits server-side; UI hiding is never sufficient.',
    'Final downloads stay hidden until approval; delivery links must be hashed, scoped, expiring, revocable, download-limited, and audited.',
    'No copy may guarantee marketplace approval, listing approval, ranking, sales, conversion, product approval, or ad performance.',
  ];
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
      <h2 className="text-lg font-semibold text-amber-950">Non-negotiable Phase 37 guardrails</h2>
      <ul className="mt-4 space-y-2 text-sm text-amber-900">
        {rules.map((rule) => <li key={rule}>• {rule}</li>)}
      </ul>
    </section>
  );
}
