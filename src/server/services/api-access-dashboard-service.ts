import { summarizeApiTokens } from '@/domain/api-access';

export const demoApiTokenRows = [
  {
    id: 'api-token-demo-agency-1',
    label: 'Agency portal automation',
    tokenPrefix: 'll_api_demoA1',
    status: 'ACTIVE',
    scopes: ['jobs:create', 'jobs:read', 'uploads:create', 'images:read', 'deliveries:read', 'presets:read'],
    planKey: 'AGENCY',
    lastUsedAt: '2026-06-07T18:30:00.000Z',
    createdAt: '2026-06-06T12:00:00.000Z',
  },
  {
    id: 'api-token-demo-webhooks-1',
    label: 'Webhook manager draft',
    tokenPrefix: 'll_api_demoW1',
    status: 'ACTIVE',
    scopes: ['webhooks:manage', 'jobs:read', 'deliveries:read'],
    planKey: 'AGENCY_SCALE',
    lastUsedAt: null,
    createdAt: '2026-06-07T09:00:00.000Z',
  },
  {
    id: 'api-token-demo-revoked-1',
    label: 'Legacy integration revoked',
    tokenPrefix: 'll_api_old001',
    status: 'REVOKED',
    scopes: ['jobs:read'],
    planKey: 'AGENCY',
    lastUsedAt: '2026-06-01T15:00:00.000Z',
    createdAt: '2026-05-21T12:00:00.000Z',
  },
];

export const demoWebhookRows = [
  { id: 'wh-zapier-job-created', provider: 'ZAPIER', targetUrl: 'https://hooks.zapier.example/listinglift', eventTypes: ['job.created', 'upload.received'], status: 'DRAFT', signingSecret: '[secret-reference-required]' },
  { id: 'wh-make-delivery-ready', provider: 'MAKE', targetUrl: 'https://hook.make.example/listinglift', eventTypes: ['delivery.ready', 'revision.requested'], status: 'DISABLED', signingSecret: '[secret-reference-required]' },
];

export const demoSharedPortalRows = [
  { id: 'portal-demo-aster', label: 'Aster Handmade uploads', status: 'DRAFT', clientName: 'Aster Handmade', maxFiles: 100, allowedUploadKinds: ['DIRECT_UPLOAD', 'ZIP_UPLOAD'], expiresAt: '2026-06-15T12:00:00.000Z' },
  { id: 'portal-demo-agency-bulk', label: 'Agency June bulk intake', status: 'DRAFT', clientName: 'Agency workspace', maxFiles: 500, allowedUploadKinds: ['DIRECT_UPLOAD'], expiresAt: '2026-06-30T12:00:00.000Z' },
];

export function buildApiAccessDashboardSummary() {
  const tokenSummary = summarizeApiTokens(demoApiTokenRows);
  return {
    tokens: tokenSummary,
    activeWebhookDrafts: demoWebhookRows.filter((row) => row.status === 'DRAFT').length,
    sharedPortalDrafts: demoSharedPortalRows.length,
    highRiskScopeCount: Object.entries(tokenSummary.scopeCounts).filter(([scope]) => ['jobs:create', 'uploads:create', 'webhooks:manage', 'presets:write'].includes(scope)).reduce((sum, [, count]) => sum + (count ?? 0), 0),
    codexNote: 'Dry-run API access summary. Codex must replace with tenant-scoped Prisma queries and plan entitlement checks.',
  };
}

export function buildApiTokenRows() {
  return demoApiTokenRows;
}

export function buildApiWebhookRows() {
  return demoWebhookRows;
}

export function buildSharedUploadPortalRows() {
  return demoSharedPortalRows;
}
