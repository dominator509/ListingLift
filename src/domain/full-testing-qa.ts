export const FULL_TESTING_QA_PHASE = 38 as const;

export const QA_TEST_LAYERS = [
  'ENVIRONMENT',
  'PRISMA',
  'SEED',
  'TYPECHECK',
  'LINT',
  'UNIT',
  'SECURITY',
  'INTEGRATION',
  'ADAPTER_CONTRACT',
  'E2E',
  'BUILD',
  'SMOKE',
  'BROWSER',
] as const;

export const QA_CHECK_STATUSES = ['NOT_RUN', 'SCAFFOLDED', 'CODEX_REQUIRED', 'PASS', 'FAIL', 'BLOCKED'] as const;
export const QA_EVIDENCE_TYPES = ['COMMAND_OUTPUT', 'SCREENSHOT', 'TRACE', 'LOG', 'DATABASE_RECORD', 'MANUAL_REVIEW_NOTE', 'ARTIFACT'] as const;
export const QA_SEVERITIES = ['BLOCKER', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const;

export type QaTestLayer = (typeof QA_TEST_LAYERS)[number];
export type QaCheckStatus = (typeof QA_CHECK_STATUSES)[number];
export type QaEvidenceType = (typeof QA_EVIDENCE_TYPES)[number];
export type QaSeverity = (typeof QA_SEVERITIES)[number];

export type QaCommandContract = {
  key: string;
  layer: QaTestLayer;
  command: string;
  purpose: string;
  blocksProduction: boolean;
  requiresRuntime: boolean;
  evidenceRequired: QaEvidenceType[];
  codexRequired: boolean;
};

export type QaCoverageItem = {
  key: string;
  layer: QaTestLayer;
  title: string;
  requiredSurface: string;
  productionRisk: QaSeverity;
  commandKeys: string[];
  codexRequired: boolean;
};

export type QaCriticalJourney = {
  key: string;
  title: string;
  routeTargets: string[];
  assertions: string[];
  blocksProduction: boolean;
};

export type QaRiskItem = {
  key: string;
  severity: QaSeverity;
  area: string;
  risk: string;
  requiredCodexAction: string;
};

export const QA_COMMAND_PLAN: QaCommandContract[] = [
  {
    key: 'verify-env',
    layer: 'ENVIRONMENT',
    command: 'npm run verify-env',
    purpose: 'Validate required environment keys, fake placeholders, and disabled-by-default integration flags.',
    blocksProduction: true,
    requiresRuntime: true,
    evidenceRequired: ['COMMAND_OUTPUT', 'LOG'],
    codexRequired: true,
  },
  {
    key: 'db-validate',
    layer: 'PRISMA',
    command: 'npm run db:validate',
    purpose: 'Validate Prisma schema after all Phase 0-38 schema scaffolds are reconciled.',
    blocksProduction: true,
    requiresRuntime: true,
    evidenceRequired: ['COMMAND_OUTPUT'],
    codexRequired: true,
  },
  {
    key: 'db-generate',
    layer: 'PRISMA',
    command: 'npm run db:generate',
    purpose: 'Generate Prisma client from the validated schema.',
    blocksProduction: true,
    requiresRuntime: true,
    evidenceRequired: ['COMMAND_OUTPUT', 'ARTIFACT'],
    codexRequired: true,
  },
  {
    key: 'db-migrate',
    layer: 'PRISMA',
    command: 'npm run db:migrate',
    purpose: 'Apply repaired migrations in order against a real development database.',
    blocksProduction: true,
    requiresRuntime: true,
    evidenceRequired: ['COMMAND_OUTPUT', 'DATABASE_RECORD'],
    codexRequired: true,
  },
  {
    key: 'seed-once',
    layer: 'SEED',
    command: 'npm run db:seed',
    purpose: 'Seed baseline packages, presets, roles, tenant defaults, integrations, and phase scaffolds.',
    blocksProduction: true,
    requiresRuntime: true,
    evidenceRequired: ['COMMAND_OUTPUT', 'DATABASE_RECORD'],
    codexRequired: true,
  },
  {
    key: 'seed-twice',
    layer: 'SEED',
    command: 'npm run db:seed',
    purpose: 'Run seed a second time to verify idempotency and no duplicate fulfillment/billing/security records.',
    blocksProduction: true,
    requiresRuntime: true,
    evidenceRequired: ['COMMAND_OUTPUT', 'DATABASE_RECORD'],
    codexRequired: true,
  },
  {
    key: 'typecheck',
    layer: 'TYPECHECK',
    command: 'npm run typecheck',
    purpose: 'Verify TypeScript contracts across app, services, tests, routes, schemas, and scripts.',
    blocksProduction: true,
    requiresRuntime: true,
    evidenceRequired: ['COMMAND_OUTPUT'],
    codexRequired: true,
  },
  {
    key: 'lint',
    layer: 'LINT',
    command: 'npm run lint',
    purpose: 'Run ESLint against the full repository.',
    blocksProduction: true,
    requiresRuntime: true,
    evidenceRequired: ['COMMAND_OUTPUT'],
    codexRequired: true,
  },
  {
    key: 'unit',
    layer: 'UNIT',
    command: 'npm run test:unit',
    purpose: 'Run unit tests for packages, presets, naming, manifests, processing helpers, credits, RBAC, tokens, security, QA, and workflow services.',
    blocksProduction: true,
    requiresRuntime: true,
    evidenceRequired: ['COMMAND_OUTPUT'],
    codexRequired: true,
  },
  {
    key: 'security',
    layer: 'SECURITY',
    command: 'npm run test:security',
    purpose: 'Run no-secret, upload rejection, ZIP slip, RBAC, tenant isolation, token, webhook, delivery gate, API access, agency, CSRF/header, and safe-copy tests.',
    blocksProduction: true,
    requiresRuntime: true,
    evidenceRequired: ['COMMAND_OUTPUT'],
    codexRequired: true,
  },
  {
    key: 'integration',
    layer: 'INTEGRATION',
    command: 'npm run test:integration',
    purpose: 'Run route/service integration contracts for auth, jobs, uploads, checkout/webhooks, processing, ZIP, preview, approval, delivery, reports, integrations, and dashboards.',
    blocksProduction: true,
    requiresRuntime: true,
    evidenceRequired: ['COMMAND_OUTPUT'],
    codexRequired: true,
  },
  {
    key: 'adapter-contract',
    layer: 'ADAPTER_CONTRACT',
    command: 'npm run test:adapter-contract',
    purpose: 'Verify mock/disabled-by-default provider adapters, sales-channel adapters, and integration adapter contracts.',
    blocksProduction: true,
    requiresRuntime: true,
    evidenceRequired: ['COMMAND_OUTPUT'],
    codexRequired: true,
  },
  {
    key: 'e2e',
    layer: 'E2E',
    command: 'npm run test:e2e',
    purpose: 'Run Playwright flows for signup/login, package selection, upload, mock processing, review, approval, ZIP delivery, revision, marketplaces, revenue dashboard, agency, API access, and security admin shells.',
    blocksProduction: true,
    requiresRuntime: true,
    evidenceRequired: ['COMMAND_OUTPUT', 'TRACE', 'SCREENSHOT'],
    codexRequired: true,
  },
  {
    key: 'security-check',
    layer: 'SECURITY',
    command: 'npm run security-check',
    purpose: 'Run security test suite plus dependency audit at configured severity.',
    blocksProduction: true,
    requiresRuntime: true,
    evidenceRequired: ['COMMAND_OUTPUT', 'LOG'],
    codexRequired: true,
  },
  {
    key: 'build',
    layer: 'BUILD',
    command: 'npm run build',
    purpose: 'Verify Next production build compiles after Prisma/client/runtime wiring.',
    blocksProduction: true,
    requiresRuntime: true,
    evidenceRequired: ['COMMAND_OUTPUT', 'ARTIFACT'],
    codexRequired: true,
  },
  {
    key: 'smoke',
    layer: 'SMOKE',
    command: 'npm run smoke',
    purpose: 'Run smoke checks for baseline domain defaults and app health surfaces.',
    blocksProduction: true,
    requiresRuntime: true,
    evidenceRequired: ['COMMAND_OUTPUT'],
    codexRequired: true,
  },
  {
    key: 'browser-smoke',
    layer: 'BROWSER',
    command: 'npm run test:e2e -- --grep @smoke',
    purpose: 'Browser-render critical public, admin, client, agency, delivery, upload, QA, and security pages with safe demo headers.',
    blocksProduction: true,
    requiresRuntime: true,
    evidenceRequired: ['COMMAND_OUTPUT', 'SCREENSHOT', 'TRACE'],
    codexRequired: true,
  },
];

export const QA_ROADMAP_COVERAGE: QaCoverageItem[] = [
  { key: 'package-mapping', layer: 'UNIT', title: 'Package mapping', requiredSurface: 'service packages, checkout package keys, marketplace package mappings', productionRisk: 'HIGH', commandKeys: ['unit'], codexRequired: true },
  { key: 'preset-validation', layer: 'UNIT', title: 'Platform preset validation', requiredSurface: 'ecommerce, social, marketplace, agency, delivery folders', productionRisk: 'HIGH', commandKeys: ['unit'], codexRequired: true },
  { key: 'sales-channel-normalization', layer: 'UNIT', title: 'Sales channel normalization', requiredSurface: 'Fiverr, Upwork, Taskrabbit, Gumroad, Etsy, Shopify, Amazon, eBay, WooCommerce, social channels', productionRisk: 'HIGH', commandKeys: ['unit', 'integration'], codexRequired: true },
  { key: 'file-naming-manifest-zip', layer: 'UNIT', title: 'File naming, manifest, folder generation, and ZIP', requiredSurface: 'delivery archive generation and safe client downloads', productionRisk: 'CRITICAL', commandKeys: ['unit', 'security'], codexRequired: true },
  { key: 'image-processing-helpers', layer: 'UNIT', title: 'Image processing helpers', requiredSurface: 'mock/local/provider processing, preservation of originals, QC outputs', productionRisk: 'CRITICAL', commandKeys: ['unit', 'adapter-contract', 'security'], codexRequired: true },
  { key: 'credit-ledger-rbac-tokens', layer: 'UNIT', title: 'Credit ledger, RBAC, upload tokens, and download tokens', requiredSurface: 'billing, subscriptions, entitlements, upload/delivery/API/shared portal access', productionRisk: 'CRITICAL', commandKeys: ['unit', 'security'], codexRequired: true },
  { key: 'auth-client-job-crud', layer: 'INTEGRATION', title: 'Auth and client/job CRUD', requiredSurface: 'session auth, tenant isolation, client dashboard, admin queue', productionRisk: 'CRITICAL', commandKeys: ['integration', 'security'], codexRequired: true },
  { key: 'manual-order-creation', layer: 'INTEGRATION', title: 'Manual order creation', requiredSurface: 'Fiverr, Upwork, Taskrabbit, other channels, agency bulk intake', productionRisk: 'HIGH', commandKeys: ['integration', 'e2e'], codexRequired: true },
  { key: 'stripe-gumroad-webhooks', layer: 'INTEGRATION', title: 'Stripe and Gumroad webhooks', requiredSurface: 'paid fulfillment, idempotency, signature verification, credits/subscriptions', productionRisk: 'CRITICAL', commandKeys: ['integration', 'security'], codexRequired: true },
  { key: 'upload-processing-preview', layer: 'INTEGRATION', title: 'Upload, mock processing, ZIP, preview gallery, approval, revision, delivery', requiredSurface: 'core ListingLift fulfillment workflow', productionRisk: 'CRITICAL', commandKeys: ['integration', 'e2e', 'security'], codexRequired: true },
  { key: 'reports-upsells-retainers', layer: 'INTEGRATION', title: 'Reports, upsells, retainers, and client dashboard', requiredSurface: 'safe copy, manual review, no-guarantee messaging, revenue upsell loops', productionRisk: 'HIGH', commandKeys: ['integration', 'security', 'e2e'], codexRequired: true },
  { key: 'storage-automation-integrations', layer: 'INTEGRATION', title: 'Storage adapters and automation webhooks', requiredSurface: 'Google Drive/Dropbox, Zapier/Make/n8n/custom webhooks, task tools, notifications', productionRisk: 'CRITICAL', commandKeys: ['integration', 'adapter-contract', 'security'], codexRequired: true },
  { key: 'signup-login-checkout', layer: 'E2E', title: 'Signup/login and package checkout journey', requiredSurface: 'public sales flow, package selection, Stripe test mode, Gumroad webhook intake', productionRisk: 'CRITICAL', commandKeys: ['e2e'], codexRequired: true },
  { key: 'upload-10-images-to-delivery', layer: 'E2E', title: 'Upload 10 images through delivery ZIP journey', requiredSurface: 'upload token, mock provider, review previews, approval, ZIP, client download, revision', productionRisk: 'CRITICAL', commandKeys: ['e2e', 'security'], codexRequired: true },
  { key: 'marketplace-revenue-dashboards', layer: 'E2E', title: 'Marketplace workflows and revenue source dashboard', requiredSurface: 'manual Fiverr/Upwork/Taskrabbit jobs, revenue dashboard, conversions, retainer alerts', productionRisk: 'HIGH', commandKeys: ['e2e', 'security'], codexRequired: true },
  { key: 'browser-rendering-all-pages', layer: 'BROWSER', title: 'Browser rendering for all UI shells', requiredSurface: 'public, admin, client, agency, upload, delivery, QA, security pages', productionRisk: 'CRITICAL', commandKeys: ['browser-smoke', 'e2e'], codexRequired: true },
];

export const QA_CRITICAL_JOURNEYS: QaCriticalJourney[] = [
  {
    key: 'service-package-to-upload',
    title: 'Buyer selects a product image package and reaches a scoped upload flow',
    routeTargets: ['/pricing', '/packages', '/checkout/marketplace-listing-pack', '/upload/demo-token'],
    assertions: ['package copy avoids guarantees', 'checkout remains test/mock-safe by default', 'upload token is scoped and expiring', 'unsafe files are rejected'],
    blocksProduction: true,
  },
  {
    key: 'operator-fulfillment-loop',
    title: 'Operator processes a job through QC, approval, ZIP generation, delivery, and revision',
    routeTargets: ['/admin/jobs', '/admin/processing', '/admin/previews', '/admin/quality-control', '/admin/approvals', '/admin/reports'],
    assertions: ['original uploads preserved', 'mock provider enabled by default', 'flagged outputs hidden from clients', 'approval required before final delivery'],
    blocksProduction: true,
  },
  {
    key: 'client-dashboard-loop',
    title: 'Client sees only approved tenant-scoped jobs, downloads, reports, billing, and revisions',
    routeTargets: ['/client', '/client/jobs', '/client/downloads', '/client/reports', '/client/revisions', '/client/billing'],
    assertions: ['tenant isolation enforced server-side', 'no unapproved outputs visible', 'delivery tokens hashed/expiring', 'revision requests are scoped'],
    blocksProduction: true,
  },
  {
    key: 'sales-channel-operator-loop',
    title: 'Marketplace/manual sales workflows normalize into jobs without unsafe automation claims',
    routeTargets: ['/admin/fiverr', '/admin/upwork', '/admin/taskrabbit', '/admin/etsy', '/admin/shopify', '/admin/marketplace-exports', '/admin/revenue'],
    assertions: ['source attribution is preserved', 'manual fallback exists', 'no marketplace password storage', 'no approval/ranking/sales guarantees'],
    blocksProduction: true,
  },
  {
    key: 'agency-api-security-loop',
    title: 'Agency white-label, API access, shared upload portal, and security hardening remain gated',
    routeTargets: ['/agency', '/agency/white-label-settings', '/admin/api-access', '/admin/security', '/admin/qa'],
    assertions: ['agency workspaces isolated', 'API tokens never persisted raw', 'shared portal tokens hashed', 'security dashboard does not claim compliance without evidence'],
    blocksProduction: true,
  },
];

export const QA_PRODUCTION_BLOCKERS: QaRiskItem[] = [
  { key: 'not-installed', severity: 'BLOCKER', area: 'runtime', risk: 'Dependencies have not been installed in ChatGPT Project Mode.', requiredCodexAction: 'Run npm install and document command output before any runtime verification claim.' },
  { key: 'prisma-unvalidated', severity: 'BLOCKER', area: 'database', risk: 'Prisma schema and migrations through Phase 38 are scaffold-only.', requiredCodexAction: 'Run Prisma validate/generate/migrate, repair SQL, and update CODEX_GAPS.md with results.' },
  { key: 'seed-unverified', severity: 'CRITICAL', area: 'database', risk: 'Seed idempotency has not been verified.', requiredCodexAction: 'Run seed twice and verify no duplicate packages, presets, roles, webhooks, credits, QA rows, or security rows.' },
  { key: 'dry-run-routes', severity: 'BLOCKER', area: 'routes', risk: 'Many route contracts return dry-run payloads instead of Prisma-backed transactions.', requiredCodexAction: 'Wire routes to real auth/session/RBAC/tenant-scoped persistence or keep blocked from production.' },
  { key: 'browser-unverified', severity: 'BLOCKER', area: 'ui', risk: 'No page has been browser-rendered in this chat environment.', requiredCodexAction: 'Run Playwright/browser smoke checks for all public/admin/client/agency/upload/delivery/QA/security surfaces.' },
  { key: 'security-unverified', severity: 'BLOCKER', area: 'security', risk: 'Security controls are scaffolded but not runtime-enforced across all routes.', requiredCodexAction: 'Run security tests and verify RBAC, tenant isolation, upload rejection, ZIP slip prevention, tokens, webhooks, rate limits, headers, CSRF, XSS, and no-secret leakage.' },
  { key: 'provider-calls-disabled', severity: 'HIGH', area: 'integrations', risk: 'Real integrations are intentionally disabled and untested.', requiredCodexAction: 'Keep disabled by default; only wire behind explicit feature flags, encrypted secret references, and provider-specific tests.' },
  { key: 'no-fake-results', severity: 'BLOCKER', area: 'governance', risk: 'A package cannot claim installed/compiled/tested/built/deployed status unless commands were actually run.', requiredCodexAction: 'Attach command outputs or keep status as NOT_RUN/CODEX_REQUIRED in roadmap, gaps, and verification matrix.' },
];

export const QA_SMOKE_ROUTE_TARGETS = [
  { group: 'public', routes: ['/', '/pricing', '/packages', '/examples', '/marketplace-sellers', '/agency-white-label'] },
  { group: 'admin-core', routes: ['/admin', '/admin/jobs', '/admin/uploads', '/admin/processing', '/admin/previews', '/admin/quality-control', '/admin/approvals', '/admin/revenue', '/admin/security', '/admin/qa'] },
  { group: 'admin-sales-channels', routes: ['/admin/gumroad', '/admin/fiverr', '/admin/upwork', '/admin/taskrabbit', '/admin/etsy', '/admin/shopify', '/admin/social-commerce', '/admin/other-sales-channels', '/admin/marketplace-exports'] },
  { group: 'admin-integrations', routes: ['/admin/file-storage', '/admin/automation-webhooks', '/admin/task-notification-integrations', '/admin/api-access', '/admin/integrations'] },
  { group: 'client', routes: ['/client', '/client/jobs', '/client/downloads', '/client/reports', '/client/revisions', '/client/billing', '/client/upgrade'] },
  { group: 'agency', routes: ['/agency', '/agency/workspaces', '/agency/queue', '/agency/white-label-settings', '/agency/delivery', '/agency/reports', '/agency/billing', '/agency/team'] },
  { group: 'tokenized', routes: ['/upload/demo-token', '/delivery/demo-token'] },
] as const;

export const RUNTIME_CLAIM_WORD_PATTERN = /(installed|compiled|typechecked|linted|built|migrated|seeded|browser-tested|runtime-tested|playwright passed|vitest passed|npm install passed|production-ready)/i;

export function summarizeQaCommands(commands: QaCommandContract[] = QA_COMMAND_PLAN) {
  const productionBlockers = commands.filter((command) => command.blocksProduction).length;
  const codexRequired = commands.filter((command) => command.codexRequired).length;
  const runtimeRequired = commands.filter((command) => command.requiresRuntime).length;
  return {
    phase: FULL_TESTING_QA_PHASE,
    commandCount: commands.length,
    productionBlockers,
    codexRequired,
    runtimeRequired,
    canClaimProductionReady: false,
  };
}

export function groupQaCoverageByLayer(items: QaCoverageItem[] = QA_ROADMAP_COVERAGE) {
  return QA_TEST_LAYERS.map((layer) => ({
    layer,
    items: items.filter((item) => item.layer === layer),
    count: items.filter((item) => item.layer === layer).length,
  })).filter((group) => group.count > 0);
}

export function hasRuntimeEvidence(status: QaCheckStatus, evidence: readonly unknown[] = []) {
  if (status !== 'PASS') return true;
  return evidence.length > 0;
}

export function rejectRuntimeClaimWithoutEvidence(note: string, evidence: readonly unknown[] = []) {
  if (RUNTIME_CLAIM_WORD_PATTERN.test(note) && evidence.length === 0) {
    return {
      ok: false,
      reason: 'Runtime/install/test/build/deploy claims require actual command output, trace, screenshot, log, database record, or artifact evidence.',
    };
  }
  return { ok: true, reason: 'No unsupported runtime claim detected.' };
}
