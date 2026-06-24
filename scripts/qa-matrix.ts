import {
  FULL_TESTING_QA_PHASE,
  QA_COMMAND_PLAN,
  QA_PRODUCTION_BLOCKERS,
  QA_ROADMAP_COVERAGE,
  QA_SMOKE_ROUTE_TARGETS,
  summarizeQaCommands,
} from '../src/domain/full-testing-qa';

const VERIFIED_LOCAL_COMMANDS: ReadonlyMap<string, { status: 'PASS'; evidence: string }> = new Map([
  ['verify-env', { status: 'PASS', evidence: 'Passed inside combined npm run test-all with safe local test env.' }],
  ['db-validate', { status: 'PASS', evidence: 'Passed inside combined npm run test-all.' }],
  ['db-generate', { status: 'PASS', evidence: 'Passed inside combined npm run test-all.' }],
  ['db-migrate', { status: 'PASS', evidence: 'Passed inside combined npm run test-all using prisma migrate deploy against Docker PostgreSQL.' }],
  ['seed-once', { status: 'PASS', evidence: 'Passed inside combined npm run test-all.' }],
  ['seed-twice', { status: 'PASS', evidence: 'Passed inside combined npm run test-all, verifying seed idempotency.' }],
  ['typecheck', { status: 'PASS', evidence: 'Passed inside combined npm run test-all with 0 TypeScript errors.' }],
  ['lint', { status: 'PASS', evidence: 'Passed inside combined npm run test-all with 12 warnings and 0 errors.' }],
  ['unit', { status: 'PASS', evidence: '101 files / 451 tests passed inside combined npm run test-all.' }],
  ['security', { status: 'PASS', evidence: '54 files passed / 1 skipped, 102 tests passed / 7 skipped inside combined npm run test-all.' }],
  ['integration', { status: 'PASS', evidence: '44 files / 114 tests passed inside combined npm run test-all.' }],
  ['adapter-contract', { status: 'PASS', evidence: '4 files / 7 tests passed inside combined npm run test-all.' }],
  ['e2e', { status: 'PASS', evidence: '34 tests passed / 32 intentional skips; a11y scanned 48 pages with 0 violations.' }],
  ['security-check', { status: 'PASS', evidence: 'High-severity audit gate passed; 5 moderate advisories remain.' }],
  ['build', { status: 'PASS', evidence: 'Build passed inside combined npm run test-all; 361 static pages generated.' }],
  ['smoke', { status: 'PASS', evidence: 'Local smoke passed inside combined npm run test-all.' }],
] as const);

const VERIFIED_COVERAGE: ReadonlySet<string> = new Set([
  'package-mapping',
  'preset-validation',
  'sales-channel-normalization',
  'file-naming-manifest-zip',
  'image-processing-helpers',
  'credit-ledger-rbac-tokens',
  'auth-client-job-crud',
  'stripe-gumroad-webhooks',
  'upload-processing-preview',
  'browser-rendering-all-pages',
]);

const PARTIAL_COVERAGE: ReadonlySet<string> = new Set([
  'manual-order-creation',
  'reports-upsells-retainers',
  'storage-automation-integrations',
  'signup-login-checkout',
  'upload-10-images-to-delivery',
  'marketplace-revenue-dashboards',
]);

const CURRENT_BLOCKER_STATUS: ReadonlyMap<string, 'LOCAL_RESOLVED' | 'REMAINS_FOR_PRODUCTION' | 'LOCAL_PARTIAL' | 'REMAINS_BY_DESIGN'> = new Map([
  ['not-installed', 'LOCAL_RESOLVED'],
  ['prisma-unvalidated', 'LOCAL_RESOLVED'],
  ['seed-unverified', 'LOCAL_RESOLVED'],
  ['dry-run-routes', 'REMAINS_FOR_PRODUCTION'],
  ['browser-unverified', 'LOCAL_RESOLVED'],
  ['security-unverified', 'LOCAL_PARTIAL'],
  ['provider-calls-disabled', 'REMAINS_BY_DESIGN'],
  ['no-fake-results', 'LOCAL_RESOLVED'],
] as const);

const commandSequence = QA_COMMAND_PLAN.map(({ key, layer, command, purpose }, index) => {
  const localEvidence = VERIFIED_LOCAL_COMMANDS.get(key);
  return {
    step: index + 1,
    key,
    layer,
    command,
    purpose,
    status: localEvidence?.status ?? 'CODEX_REQUIRED',
    evidence: localEvidence?.evidence ?? 'No current local evidence recorded in this matrix.',
  };
});

const coverage = QA_ROADMAP_COVERAGE.map(({ key, layer, title, commandKeys, productionRisk }) => ({
  key,
  layer,
  title,
  commandKeys,
  productionRisk,
  status: VERIFIED_COVERAGE.has(key) ? 'LOCAL_VERIFIED' : PARTIAL_COVERAGE.has(key) ? 'LOCAL_PARTIAL' : 'CODEX_REQUIRED',
}));

console.log(JSON.stringify({
  generatedBy: 'scripts/qa-matrix.ts',
  package: 'ListingLift Repo Seed v40',
  phase: FULL_TESTING_QA_PHASE,
  note: 'Evidence summary only. This script does not run tests; PASS rows reflect the latest documented local npm run test-all evidence.',
  summary: summarizeQaCommands(),
  commandSequence,
  coverage,
  smokeTargets: QA_SMOKE_ROUTE_TARGETS.map(({ group, routes }) => ({ group, routes, status: 'LOCAL_VERIFIED_BY_E2E_A11Y_SWEEP' })),
  blockers: QA_PRODUCTION_BLOCKERS.map(({ key, severity, area, risk, requiredCodexAction }) => ({
    key,
    severity,
    area,
    risk,
    requiredCodexAction,
    status: CURRENT_BLOCKER_STATUS.get(key) ?? 'CODEX_REQUIRED',
  })),
  productionDisposition: 'NOT_PRODUCTION_READY',
  remainingProductionWork: [
    'Production deployment is not verified.',
    'Real provider credentials and external integrations are not verified.',
    'Intentional scaffold E2E skips remain.',
    'Moderate dependency advisories remain pending non-breaking fixes.',
  ],
}, null, 2));
