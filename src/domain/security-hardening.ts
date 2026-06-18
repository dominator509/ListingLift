export const SECURITY_HARDENING_PHASE = 37 as const;

export const SECURITY_CONTROL_AREAS = [
  'SECRET_STORAGE',
  'UPLOAD_VALIDATION',
  'ZIP_SAFETY',
  'TOKEN_LIFECYCLE',
  'RATE_LIMITS',
  'SECURITY_HEADERS',
  'CSRF',
  'XSS_OUTPUT',
  'WEBHOOK_SIGNATURES',
  'AUDIT_COMPLETENESS',
  'TENANT_RBAC',
] as const;

export const SECURITY_CONTROL_STATUSES = ['NOT_STARTED', 'SCAFFOLDED', 'CODEX_REQUIRED', 'VERIFIED', 'BLOCKED'] as const;

export const SECURITY_SECRET_CLASSES = [
  'PAYMENT_PROVIDER_KEY',
  'PAYMENT_WEBHOOK_SECRET',
  'GUMROAD_WEBHOOK_SECRET',
  'IMAGE_PROVIDER_KEY',
  'STORAGE_OAUTH_TOKEN',
  'TASK_TOOL_TOKEN',
  'EMAIL_SMTP_SECRET',
  'AUTOMATION_WEBHOOK_SECRET',
  'API_ACCESS_TOKEN_HASH',
  'UPLOAD_TOKEN_HASH',
  'DELIVERY_TOKEN_HASH',
  'INVITE_TOKEN_HASH',
  'PORTAL_TOKEN_HASH',
] as const;

export const SECURITY_RATE_LIMIT_ACTIONS = [
  'auth.login',
  'checkout.create',
  'upload.create_session',
  'upload.submit_batch',
  'webhook.receive',
  'processing.start',
  'delivery.download',
  'api.request',
  'api.token.create',
  'api.token.revoke',
  'shared_portal.upload',
  'admin.manual_override',
] as const;

export const SECURITY_WEBHOOK_PROVIDERS = [
  'STRIPE',
  'GUMROAD',
  'SHOPIFY',
  'ETSY',
  'API_ACCESS_WEBHOOK',
  'AUTOMATION_WEBHOOK',
  'CUSTOM',
] as const;

export type SecurityControlArea = (typeof SECURITY_CONTROL_AREAS)[number];
export type SecurityControlStatus = (typeof SECURITY_CONTROL_STATUSES)[number];
export type SecuritySecretClass = (typeof SECURITY_SECRET_CLASSES)[number];
export type SecurityRateLimitAction = (typeof SECURITY_RATE_LIMIT_ACTIONS)[number];
export type SecurityWebhookProvider = (typeof SECURITY_WEBHOOK_PROVIDERS)[number];

export type SecurityControlChecklistItem = {
  key: string;
  area: SecurityControlArea;
  title: string;
  status: SecurityControlStatus;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  codexRequired: boolean;
  surface: string;
  acceptance: string;
};

export const SENSITIVE_METADATA_KEY_PATTERN = /secret|token|password|authorization|cookie|apikey|api_key|bearer|signature|credential|smtp|oauth|webhook|private_key|rawPayload|raw_payload|signedUrl|signed_url/i;

export const MARKETPLACE_UNSAFE_CLAIM_PATTERN = /(guarantee|guaranteed|approved by amazon|amazon compliant|etsy compliant|tiktok shop compliant|rank higher|ranking boost|conversion increase|sales increase|ad performance|listing approval|marketplace approval)/i;

export const SECURITY_CONTROL_CHECKLIST: SecurityControlChecklistItem[] = [
  {
    key: 'secret-storage-encrypted-references',
    area: 'SECRET_STORAGE',
    title: 'Provider secrets stored as encrypted references only',
    status: 'SCAFFOLDED',
    riskLevel: 'critical',
    codexRequired: true,
    surface: 'payments, Gumroad, image providers, storage OAuth, Slack/email/task tools, API/webhooks',
    acceptance: 'No plaintext provider secret is persisted, returned to the frontend, or logged; database stores encryptedSecretRef or token hashes only.',
  },
  {
    key: 'upload-type-size-rejection',
    area: 'UPLOAD_VALIDATION',
    title: 'Unsafe upload type and size rejection',
    status: 'SCAFFOLDED',
    riskLevel: 'critical',
    codexRequired: true,
    surface: 'public upload links, client dashboard, admin upload, agency bulk queue, shared upload portal, API uploads',
    acceptance: 'Every upload route validates MIME, extension, size, parseability, token scope, tenant scope, and package allowance before storage or processing.',
  },
  {
    key: 'zip-slip-and-nested-archive-blocking',
    area: 'ZIP_SAFETY',
    title: 'ZIP slip prevention and nested archive rejection',
    status: 'SCAFFOLDED',
    riskLevel: 'critical',
    codexRequired: true,
    surface: 'ZIP intake, drive/dropbox import, agency bulk uploads, delivery archives',
    acceptance: 'Extraction rejects absolute paths, drive-letter paths, parent traversal, nested archives, executable/script-like entries, excessive depth, and excessive entry counts.',
  },
  {
    key: 'hashed-expiring-tokens',
    area: 'TOKEN_LIFECYCLE',
    title: 'Hashed and expiring upload, delivery, API, invite, and portal tokens',
    status: 'SCAFFOLDED',
    riskLevel: 'critical',
    codexRequired: true,
    surface: 'upload links, delivery links, API tokens, agency invites, shared portals, webhook secrets',
    acceptance: 'Raw tokens are shown only when appropriate, never persisted, stored as hashes, scoped to org/client/job/workspace, expiring, revocable, and audited.',
  },
  {
    key: 'sensitive-route-rate-limits',
    area: 'RATE_LIMITS',
    title: 'Rate limits for sensitive routes',
    status: 'SCAFFOLDED',
    riskLevel: 'high',
    codexRequired: true,
    surface: 'login, upload, checkout, webhooks, processing, downloads, API, token creation/revocation',
    acceptance: 'Every sensitive route has per-tenant/per-token/per-IP policy, durable/distributed counters where required, sanitized audit events, and safe retry headers.',
  },
  {
    key: 'security-headers',
    area: 'SECURITY_HEADERS',
    title: 'Security headers applied to app responses',
    status: 'SCAFFOLDED',
    riskLevel: 'high',
    codexRequired: true,
    surface: 'Next middleware and route responses',
    acceptance: 'CSP, X-Content-Type-Options, Referrer-Policy, frame protection, Permissions-Policy, and production HSTS are present and validated in browser smoke checks.',
  },
  {
    key: 'csrf-for-state-changing-routes',
    area: 'CSRF',
    title: 'CSRF protection for browser state-changing mutations',
    status: 'SCAFFOLDED',
    riskLevel: 'high',
    codexRequired: true,
    surface: 'admin/client/agency/browser mutations, checkout/session-sensitive actions',
    acceptance: 'State-changing browser requests require a session-bound CSRF token or explicitly documented non-browser bearer-token exception.',
  },
  {
    key: 'xss-and-safe-output-copy',
    area: 'XSS_OUTPUT',
    title: 'XSS protection and safe client-facing copy',
    status: 'SCAFFOLDED',
    riskLevel: 'high',
    codexRequired: true,
    surface: 'reports, delivery notes, listing copy, upsells, CSV/data exports, webhook templates, integration templates',
    acceptance: 'Rendered text is escaped/sanitized, CSV formula injection is neutralized, and no guaranteed-result marketplace claims are emitted.',
  },
  {
    key: 'webhook-signature-verification',
    area: 'WEBHOOK_SIGNATURES',
    title: 'Webhook signature verification before paid/client-facing state changes',
    status: 'SCAFFOLDED',
    riskLevel: 'critical',
    codexRequired: true,
    surface: 'Stripe, Gumroad, Shopify/Etsy later, API/webhook integrations, automation webhooks',
    acceptance: 'Unsigned, unsupported, mismatched, stale, duplicate, or disabled-provider events cannot create paid fulfillment, credits, deliveries, or trusted jobs automatically.',
  },
  {
    key: 'audit-completeness-map',
    area: 'AUDIT_COMPLETENESS',
    title: 'Audit completeness map for sensitive actions',
    status: 'SCAFFOLDED',
    riskLevel: 'high',
    codexRequired: true,
    surface: 'paid actions, client-facing delivery, manual override, admin analytics, agency white-label, API access, secret changes, permission changes',
    acceptance: 'Every sensitive action maps to a sanitized audit event and Codex verifies no secret-bearing metadata is logged.',
  },
  {
    key: 'server-side-tenant-rbac',
    area: 'TENANT_RBAC',
    title: 'Server-side tenant isolation and RBAC enforcement',
    status: 'SCAFFOLDED',
    riskLevel: 'critical',
    codexRequired: true,
    surface: 'all admin, client, agency, delivery, upload, API, webhook, storage, billing, marketplace workflow routes',
    acceptance: 'UI hiding is never trusted; each service/route verifies session, role, permission, tenant scope, and object ownership before read/write.',
  },
];

export const SECURITY_HEADER_POLICY_DRAFT = [
  { header: 'X-Content-Type-Options', value: 'nosniff', reason: 'Prevent MIME sniffing for uploads, downloads, and route responses.' },
  { header: 'Referrer-Policy', value: 'strict-origin-when-cross-origin', reason: 'Reduce leakage of upload, checkout, and delivery paths.' },
  { header: 'X-Frame-Options', value: 'DENY', reason: 'Block clickjacking around admin, client, and agency dashboards.' },
  { header: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()', reason: 'Disable browser features ListingLift does not need by default.' },
  { header: 'Cross-Origin-Opener-Policy', value: 'same-origin', reason: 'Reduce cross-origin window reference risk.' },
  { header: 'Cross-Origin-Resource-Policy', value: 'same-origin', reason: 'Keep private app responses same-origin by default.' },
  { header: 'Content-Security-Policy', value: "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; img-src 'self' data: blob:; connect-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; form-action 'self'", reason: 'Baseline CSP scaffold; Codex must tune for Next runtime, image/CDN/storage providers, and checkout redirects.' },
] as const;

export const SECURITY_RATE_LIMIT_POLICY_DRAFT: Record<SecurityRateLimitAction, { limit: number; windowSeconds: number; subject: string; codexRequired: boolean }> = {
  'auth.login': { limit: 5, windowSeconds: 15 * 60, subject: 'email+ip', codexRequired: true },
  'checkout.create': { limit: 20, windowSeconds: 60, subject: 'organization+ip', codexRequired: true },
  'upload.create_session': { limit: 30, windowSeconds: 60, subject: 'organization+client+ip', codexRequired: true },
  'upload.submit_batch': { limit: 10, windowSeconds: 60, subject: 'upload_token+ip', codexRequired: true },
  'webhook.receive': { limit: 120, windowSeconds: 60, subject: 'provider+ip+tenant', codexRequired: true },
  'processing.start': { limit: 10, windowSeconds: 60, subject: 'organization+actor', codexRequired: true },
  'delivery.download': { limit: 20, windowSeconds: 60, subject: 'delivery_token+ip', codexRequired: true },
  'api.request': { limit: 300, windowSeconds: 60, subject: 'api_token+organization', codexRequired: true },
  'api.token.create': { limit: 5, windowSeconds: 60 * 60, subject: 'organization+actor', codexRequired: true },
  'api.token.revoke': { limit: 20, windowSeconds: 60 * 60, subject: 'organization+actor', codexRequired: true },
  'shared_portal.upload': { limit: 20, windowSeconds: 60, subject: 'portal_token+ip', codexRequired: true },
  'admin.manual_override': { limit: 15, windowSeconds: 60 * 60, subject: 'organization+actor', codexRequired: true },
};

export const AUDIT_COMPLETENESS_MAP_DRAFT = [
  { action: 'secret.reference.create', surface: 'admin integrations/security settings', eventType: 'SECRET_REFERENCE_CREATED', requiredMetadata: ['secretClass', 'provider', 'encryptedSecretRef'], forbiddenMetadata: ['rawSecret', 'token', 'password', 'apiKey'] },
  { action: 'upload.file.reject', surface: 'upload/client/agency/API/shared portal', eventType: 'UPLOAD_REJECTED', requiredMetadata: ['reason', 'mimeType', 'extension', 'sizeBytes'], forbiddenMetadata: ['rawFileBytes', 'signedUrl'] },
  { action: 'zip.entry.reject', surface: 'ZIP intake/import', eventType: 'ZIP_ENTRY_REJECTED', requiredMetadata: ['pathReason', 'entrySizeBytes'], forbiddenMetadata: ['rawArchiveBytes'] },
  { action: 'token.issue', surface: 'upload/delivery/API/invite/shared portal', eventType: 'TOKEN_ISSUED', requiredMetadata: ['tokenKind', 'tokenPrefix', 'expiresAt'], forbiddenMetadata: ['rawToken', 'tokenHash'] },
  { action: 'token.revoke', surface: 'upload/delivery/API/invite/shared portal', eventType: 'TOKEN_REVOKED', requiredMetadata: ['tokenKind', 'reason'], forbiddenMetadata: ['rawToken', 'tokenHash'] },
  { action: 'rate_limit.block', surface: 'all sensitive routes', eventType: 'RATE_LIMITED', requiredMetadata: ['policyKey', 'subjectHash', 'windowSeconds'], forbiddenMetadata: ['ipAddress', 'userAgent', 'cookie'] },
  { action: 'webhook.reject', surface: 'Stripe/Gumroad/API/webhooks/automation', eventType: 'WEBHOOK_REJECTED', requiredMetadata: ['provider', 'reason'], forbiddenMetadata: ['rawPayload', 'signatureHeader', 'webhookSecret'] },
  { action: 'rbac.denied', surface: 'admin/client/agency/API routes', eventType: 'RBAC_DENIED', requiredMetadata: ['permission', 'resourceType', 'reason'], forbiddenMetadata: ['cookie', 'authorization'] },
  { action: 'delivery.download', surface: 'delivery links and client downloads', eventType: 'DELIVERY_DOWNLOAD_ATTEMPTED', requiredMetadata: ['deliveryId', 'approvedOnly', 'downloadNumber'], forbiddenMetadata: ['rawToken', 'signedUrl'] },
  { action: 'manual.override', surface: 'admin approval/revision/processing/billing', eventType: 'MANUAL_OVERRIDE', requiredMetadata: ['overrideType', 'reason'], forbiddenMetadata: ['providerSecret', 'privateNoteRaw'] },
] as const;

export function isSensitiveMetadataKey(key: string) {
  return SENSITIVE_METADATA_KEY_PATTERN.test(key);
}

export function redactSecurityMetadata(metadata: Record<string, unknown> = {}) {
  return Object.fromEntries(
    Object.entries(metadata).map(([key, value]) => [key, isSensitiveMetadataKey(key) ? '[redacted]' : value]),
  );
}

export function assertNoRawSecretValue(input: Record<string, unknown>) {
  const offenders = Object.keys(input).filter((key) => isSensitiveMetadataKey(key) && typeof input[key] === 'string' && String(input[key]).trim().length > 0);
  if (offenders.length > 0) {
    throw new Error(`Raw secret-bearing fields are not allowed in security drafts: ${offenders.join(', ')}`);
  }
}

export function normalizeSecurityControlStatus(status: string): SecurityControlStatus {
  const upper = status.trim().toUpperCase();
  return (SECURITY_CONTROL_STATUSES as readonly string[]).includes(upper) ? (upper as SecurityControlStatus) : 'CODEX_REQUIRED';
}

export function isSafeSecurityCopy(text: string) {
  return !MARKETPLACE_UNSAFE_CLAIM_PATTERN.test(text);
}
