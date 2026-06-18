import { API_ACCESS_SAFE_COPY, type AdvancedIntegrationProvider } from '@/domain/api-access';
import { advancedIntegrationConnectionDraftSchema, apiWebhookSubscriptionDraftSchema, sharedUploadPortalDraftSchema, type AdvancedIntegrationConnectionDraftInput, type ApiWebhookSubscriptionDraftInput, type SharedUploadPortalDraftInput } from '@/schemas/api-access';
import { createRawApiToken, hashApiToken } from './api-access-token-service';

export const advancedIntegrationCatalog: Array<{
  provider: AdvancedIntegrationProvider;
  label: string;
  defaultScopes: string[];
  triggers: string[];
  actions: string[];
  featureFlagKey: string;
  disabledByDefault: boolean;
}> = [
  {
    provider: 'ZAPIER',
    label: 'Zapier app scaffold',
    defaultScopes: ['jobs:create', 'jobs:read', 'uploads:create', 'deliveries:read', 'presets:read'],
    triggers: ['job.created', 'upload.received', 'delivery.ready', 'revision.requested'],
    actions: ['create_job', 'create_upload_session', 'read_delivery_status'],
    featureFlagKey: 'ENABLE_ZAPIER_APP',
    disabledByDefault: true,
  },
  {
    provider: 'MAKE',
    label: 'Make scenario scaffold',
    defaultScopes: ['jobs:create', 'jobs:read', 'uploads:create', 'images:read', 'deliveries:read'],
    triggers: ['job.waiting_for_review', 'job.completed', 'credits.low'],
    actions: ['create_job', 'create_shared_upload_portal', 'read_image_status'],
    featureFlagKey: 'ENABLE_MAKE_APP',
    disabledByDefault: true,
  },
  {
    provider: 'N8N',
    label: 'n8n workflow scaffold',
    defaultScopes: ['jobs:create', 'jobs:read', 'webhooks:manage', 'presets:read'],
    triggers: ['new_paid_order', 'download.ready', 'upsell.detected'],
    actions: ['create_job', 'manage_webhook', 'read_preset_catalog'],
    featureFlagKey: 'ENABLE_N8N_APP',
    disabledByDefault: true,
  },
  {
    provider: 'CUSTOM_API',
    label: 'Custom agency API client',
    defaultScopes: ['jobs:create', 'jobs:read', 'uploads:create', 'images:read', 'deliveries:read', 'webhooks:manage', 'presets:read'],
    triggers: ['api.request.received'],
    actions: ['create_job', 'create_upload_session', 'read_delivery_status', 'register_webhook'],
    featureFlagKey: 'ENABLE_CUSTOM_API_CLIENTS',
    disabledByDefault: true,
  },
];

export function listAdvancedIntegrationCatalog() {
  return advancedIntegrationCatalog.map((item) => ({ ...item, safeCopy: API_ACCESS_SAFE_COPY.integrationNotice }));
}

export function buildAdvancedIntegrationConnectionDraft(input: AdvancedIntegrationConnectionDraftInput & { organizationId: string; createdByUserId?: string | null }) {
  const parsed = advancedIntegrationConnectionDraftSchema.parse(input);
  return {
    organizationId: input.organizationId,
    provider: parsed.provider,
    label: parsed.label,
    scopes: parsed.scopes,
    callbackUrl: parsed.callbackUrl ?? null,
    encryptedSecretRef: parsed.encryptedSecretRef ?? null,
    featureFlagKey: parsed.featureFlagKey,
    disabledByDefault: parsed.disabledByDefault,
    status: parsed.status,
    createdByUserId: input.createdByUserId ?? null,
    metadata: { realProviderDisabled: true, codexProviderVerificationRequired: true },
  };
}

export function buildApiWebhookSubscriptionDraft(input: ApiWebhookSubscriptionDraftInput & { organizationId: string; createdByUserId?: string | null }) {
  const parsed = apiWebhookSubscriptionDraftSchema.parse(input);
  return {
    organizationId: input.organizationId,
    targetUrl: parsed.targetUrl,
    provider: parsed.provider,
    tokenId: parsed.tokenId ?? null,
    eventTypes: parsed.eventTypes,
    signingSecretRef: parsed.signingSecretRef ?? null,
    status: parsed.enabled ? 'ENABLED' : 'DRAFT',
    createdByUserId: input.createdByUserId ?? null,
    safety: {
      signingSecretRequired: true,
      rawSecretStored: false,
      retriesRequired: true,
      deadLetterRequired: true,
      rateLimitRequired: true,
    },
  };
}

export function buildSharedUploadPortalDraft(input: SharedUploadPortalDraftInput & { organizationId: string; createdByUserId?: string | null }) {
  const parsed = sharedUploadPortalDraftSchema.parse(input);
  const rawToken = createRawApiToken().replace('ll_api_', 'll_portal_');
  return {
    portalToken: rawToken,
    portalTokenMasked: `${rawToken.slice(0, 12)}…${rawToken.slice(-6)}`,
    portalRecord: {
      organizationId: input.organizationId,
      clientId: parsed.clientId ?? null,
      jobId: parsed.jobId ?? null,
      agencyWorkspaceId: parsed.agencyWorkspaceId ?? null,
      label: parsed.label,
      tokenHash: hashApiToken(rawToken),
      tokenPrefix: rawToken.slice(0, 16),
      status: 'DRAFT' as const,
      allowedUploadKinds: parsed.allowedUploadKinds,
      expiresAt: parsed.expiresAt,
      maxFiles: parsed.maxFiles,
      usedFileCount: 0,
      createdByUserId: input.createdByUserId ?? null,
      manualReviewRequired: parsed.manualReviewRequired,
      metadata: { tokenShownOnce: true, rawTokenStored: false, originalUploadsPreserved: true },
    },
    showOnceWarning: 'Copy this portal URL/token now. Store only the hash and scope uploads server-side.',
  };
}
