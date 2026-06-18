export function QaNoFakeResultsPanel() {
  const rules = [
    'Do not mark any command PASS without command output or artifact evidence.',
    'Do not claim install, Prisma validation, migration, seed, typecheck, lint, Vitest, Playwright, build, browser rendering, provider call, storage check, webhook verification, or deployment unless actually run.',
    'Keep real integrations disabled by default and use mock/test-mode flows for QA unless feature flags and encrypted secret references are explicitly wired.',
    'Update CODEX_GAPS.md and PHASE_38_VERIFICATION_MATRIX.md with both passing evidence and unresolved blockers.',
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
      <h2 className="text-lg font-semibold">No fake QA results</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-200">
        {rules.map((rule) => <li key={rule}>{rule}</li>)}
      </ul>
    </section>
  );
}
