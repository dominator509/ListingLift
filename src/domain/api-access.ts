export const API_ACCESS_PHASE = 'phase-36-api-access-advanced-integrations-scaffold' as const;

export const API_ACCESS_SCOPES = [
  'jobs:create',
  'jobs:read',
  'uploads:create',
  'images:read',
  'deliveries:read',
  'webhooks:manage',
  'presets:read',
  'presets:write',
] as const;

export type ApiAccessScope = (typeof API_ACCESS_SCOPES)[number];

export const API_TOKEN_STATUSES = ['ACTIVE', 'REVOKED', 'EXPIRED', 'ROTATED'] as const;
export type ApiTokenStatus = (typeof API_TOKEN_STATUSES)[number];

export const API_PLAN_KEYS = ['FREE', 'STARTER', 'SELLER', 'AGENCY', 'AGENCY_SCALE', 'ENTERPRISE'] as const;
export type ApiPlanKey = (typeof API_PLAN_KEYS)[number];

export const API_TOKEN_EVENT_TYPES = [
  'CREATED',
  'TOKEN_SHOWN_ONCE',
  'SCOPE_CHECKED',
  'TOKEN_REVOKED',
  'TOKEN_ROTATED',
  'PLAN_GATE_EVALUATED',
  'WEBHOOK_MANAGED',
  'SHARED_UPLOAD_PORTAL_CREATED',
  'API_REQUEST_RECEIVED',
  'RATE_LIMITED',
] as const;

export type ApiTokenEventType = (typeof API_TOKEN_EVENT_TYPES)[number];

export const ADVANCED_INTEGRATION_PROVIDERS = ['ZAPIER', 'MAKE', 'N8N', 'CUSTOM_API', 'WEBHOOK'] as const;
export type AdvancedIntegrationProvider = (typeof ADVANCED_INTEGRATION_PROVIDERS)[number];

export const ADVANCED_INTEGRATION_STATUSES = ['DRAFT', 'READY', 'DISABLED', 'ERROR'] as const;
export type AdvancedIntegrationStatus = (typeof ADVANCED_INTEGRATION_STATUSES)[number];

export const SHARED_UPLOAD_PORTAL_STATUSES = ['DRAFT', 'ACTIVE', 'EXPIRED', 'REVOKED'] as const;
export type SharedUploadPortalStatus = (typeof SHARED_UPLOAD_PORTAL_STATUSES)[number];

export const API_SCOPE_DESCRIPTIONS: Record<ApiAccessScope, { label: string; description: string; risk: 'low' | 'medium' | 'high'; planRequired: ApiPlanKey }> = {
  'jobs:create': {
    label: 'Create jobs',
    description: 'Create ListingLift jobs from approved agency API, Zapier, Make, n8n, custom app, or shared portal workflows.',
    risk: 'high',
    planRequired: 'AGENCY',
  },
  'jobs:read': {
    label: 'Read jobs',
    description: 'Read tenant-scoped job status, package, source-channel, deadline, and fulfillment state without exposing private admin notes.',
    risk: 'medium',
    planRequired: 'AGENCY',
  },
  'uploads:create': {
    label: 'Create upload sessions',
    description: 'Create scoped upload sessions and shared upload portal links while preserving originals and rejecting unsafe files.',
    risk: 'high',
    planRequired: 'AGENCY',
  },
  'images:read': {
    label: 'Read image metadata',
    description: 'Read approved image metadata and non-sensitive processing status without raw signed URLs or provider payloads.',
    risk: 'medium',
    planRequired: 'AGENCY',
  },
  'deliveries:read': {
    label: 'Read deliveries',
    description: 'Read approved delivery status and approved archive metadata without exposing final downloads before approval.',
    risk: 'medium',
    planRequired: 'AGENCY',
  },
  'webhooks:manage': {
    label: 'Manage webhooks',
    description: 'Register outbound webhooks for approved event types with signing-secret references, retries, and dead-letter handling.',
    risk: 'high',
    planRequired: 'AGENCY_SCALE',
  },
  'presets:read': {
    label: 'Read presets',
    description: 'Read marketplace and platform preset definitions for output planning.',
    risk: 'low',
    planRequired: 'AGENCY',
  },
  'presets:write': {
    label: 'Write presets',
    description: 'Draft custom agency presets for manual review before production use.',
    risk: 'high',
    planRequired: 'AGENCY_SCALE',
  },
};

export const API_PLAN_SCOPE_ALLOWLIST: Record<ApiPlanKey, ApiAccessScope[]> = {
  FREE: [],
  STARTER: ['presets:read'],
  SELLER: ['jobs:read', 'images:read', 'deliveries:read', 'presets:read'],
  AGENCY: ['jobs:create', 'jobs:read', 'uploads:create', 'images:read', 'deliveries:read', 'presets:read'],
  AGENCY_SCALE: [...API_ACCESS_SCOPES],
  ENTERPRISE: [...API_ACCESS_SCOPES],
};

export const API_ACCESS_SAFE_COPY = {
  scopeNotice: 'API access supports agency API clients, shared upload portals, Zapier/Make/n8n workflows, custom apps, and outbound webhooks.',
  tokenNotice: 'API tokens must be generated server-side, stored only as hashes, and shown exactly once to the authorized operator.',
  planNotice: 'API access is gated by subscription/agency plan and must be evaluated server-side for every token and scope.',
  isolationNotice: 'Every API request must be scoped to organization, agency workspace, client, job, and approved resource boundaries before returning data.',
  uploadNotice: 'External upload flows must use scoped, expiring upload sessions, reject unsafe files, prevent ZIP slip, and never overwrite originals.',
  deliveryNotice: 'API delivery reads must never expose final downloads, signed URLs, or delivery archives before approval, QC gates, and token checks.',
  webhookNotice: 'Webhooks must use verified signing secrets, retry/dead-letter tracking, rate limits, and no raw secret leakage.',
  integrationNotice: 'Real integrations stay disabled by default until feature flags, encrypted secret references, and provider verification are wired.',
  guaranteeNotice: 'Do not guarantee marketplace approval, ranking, sales, conversion, listing approval, product approval, or ad performance.',
} as const;

export type ApiTokenDraftInput = {
  label: string;
  scopes: string[];
  planKey?: string | null;
  expiresAt?: string | Date | null;
};

export type ApiPlanGateInput = {
  planKey?: string | null;
  requestedScopes: string[];
  tokenStatus?: string | null;
  subscriptionStatus?: string | null;
  paymentStatus?: string | null;
};

export function normalizeApiPlanKey(planKey?: string | null): ApiPlanKey {
  const normalized = (planKey ?? 'FREE').trim().toUpperCase().replaceAll('-', '_').replaceAll(' ', '_');
  if ((API_PLAN_KEYS as readonly string[]).includes(normalized)) return normalized as ApiPlanKey;
  return 'FREE';
}

export function normalizeApiScope(scope?: string | null): ApiAccessScope | null {
  if (!scope) return null;
  const normalized = scope.trim().toLowerCase();
  return (API_ACCESS_SCOPES as readonly string[]).includes(normalized) ? (normalized as ApiAccessScope) : null;
}

export function normalizeApiScopes(scopes: readonly string[] = []): ApiAccessScope[] {
  return Array.from(new Set(scopes.map((scope) => normalizeApiScope(scope)).filter(Boolean) as ApiAccessScope[]));
}

export function getScopeTone(scope: ApiAccessScope) {
  const risk = API_SCOPE_DESCRIPTIONS[scope].risk;
  if (risk === 'high') return 'red' as const;
  if (risk === 'medium') return 'amber' as const;
  return 'green' as const;
}

export function getApiTokenStatusTone(status?: string | null) {
  const normalized = (status ?? 'ACTIVE').toString().toUpperCase();
  if (normalized === 'ACTIVE') return 'green' as const;
  if (normalized === 'REVOKED' || normalized === 'EXPIRED') return 'red' as const;
  return 'amber' as const;
}

export function getIntegrationStatusTone(status?: string | null) {
  const normalized = (status ?? 'DRAFT').toString().toUpperCase();
  if (normalized === 'READY') return 'green' as const;
  if (normalized === 'ERROR') return 'red' as const;
  if (normalized === 'DISABLED') return 'slate' as const;
  return 'amber' as const;
}

export function evaluateApiPlanGate(input: ApiPlanGateInput) {
  const planKey = normalizeApiPlanKey(input.planKey);
  const requestedScopes = normalizeApiScopes(input.requestedScopes);
  const allowedScopes = API_PLAN_SCOPE_ALLOWLIST[planKey];
  const deniedScopes = requestedScopes.filter((scope) => !allowedScopes.includes(scope));
  const tokenStatus = (input.tokenStatus ?? 'ACTIVE').toString().toUpperCase();
  const subscriptionStatus = (input.subscriptionStatus ?? 'ACTIVE').toString().toUpperCase();
  const paymentStatus = (input.paymentStatus ?? 'PAID').toString().toUpperCase();
  const tokenActive = tokenStatus === 'ACTIVE';
  const subscriptionActive = subscriptionStatus === 'ACTIVE';
  const paymentOk = !['FAILED', 'REFUNDED', 'UNPAID'].includes(paymentStatus);
  return {
    planKey,
    requestedScopes,
    allowedScopes,
    deniedScopes,
    allowed: tokenActive && subscriptionActive && paymentOk && deniedScopes.length === 0 && requestedScopes.length > 0,
    reasons: [
      tokenActive ? null : 'API token is not active.',
      subscriptionActive ? null : 'Subscription or agency API entitlement is not active.',
      paymentOk ? null : 'Payment status does not allow API access.',
      deniedScopes.length > 0 ? `Plan ${planKey} does not allow scopes: ${deniedScopes.join(', ')}.` : null,
      requestedScopes.length === 0 ? 'At least one valid API scope is required.' : null,
    ].filter(Boolean) as string[],
  };
}

export function assertApiScopeAllowed(tokenScopes: readonly string[], requiredScope: ApiAccessScope) {
  const normalized = normalizeApiScopes(tokenScopes);
  if (!normalized.includes(requiredScope)) {
    throw new Error(`API scope denied: ${requiredScope}`);
  }
  return true;
}

export function maskApiToken(rawToken: string) {
  if (rawToken.length <= 12) return '[redacted]';
  return `${rawToken.slice(0, 10)}…${rawToken.slice(-6)}`;
}

export function getApiTokenPrefix(rawToken: string) {
  return rawToken.slice(0, 14);
}

export function summarizeApiTokens(tokens: Array<{ status?: string | null; scopes?: string[]; lastUsedAt?: string | Date | null }>) {
  return tokens.reduce(
    (summary, token) => {
      summary.totalTokens += 1;
      if ((token.status ?? 'ACTIVE').toString().toUpperCase() === 'ACTIVE') summary.activeTokens += 1;
      for (const scope of normalizeApiScopes(token.scopes ?? [])) summary.scopeCounts[scope] = (summary.scopeCounts[scope] ?? 0) + 1;
      if (token.lastUsedAt) summary.usedTokenCount += 1;
      return summary;
    },
    { totalTokens: 0, activeTokens: 0, usedTokenCount: 0, scopeCounts: {} as Partial<Record<ApiAccessScope, number>> },
  );
}

const unsafeSecretKeys = ['token', 'secret', 'password', 'apiKey', 'authorization', 'cookie', 'setCookie', 'signedUrl', 'webhookSecret'];

export function sanitizeApiEventMetadata(metadata: Record<string, unknown> = {}) {
  return Object.fromEntries(
    Object.entries(metadata).map(([key, value]) => [
      key,
      unsafeSecretKeys.some((unsafeKey) => key.toLowerCase().includes(unsafeKey.toLowerCase())) ? '[redacted]' : value,
    ]),
  );
}

export function apiCopyContainsUnsafeGuarantee(copy: string) {
  const normalized = copy.toLowerCase();
  const guaranteeTerms = ['guaranteed approval', 'guarantee approval', 'guaranteed sales', 'guaranteed conversion', 'guaranteed ranking', 'guaranteed ad performance', 'will rank'];
  const explicitDenial = normalized.includes('does not guarantee') || normalized.includes('no guarantee');
  return !explicitDenial && guaranteeTerms.some((term) => normalized.includes(term));
}
