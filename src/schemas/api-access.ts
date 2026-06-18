import { z } from 'zod';
import { API_ACCESS_SCOPES, API_PLAN_KEYS, API_TOKEN_EVENT_TYPES, ADVANCED_INTEGRATION_PROVIDERS, ADVANCED_INTEGRATION_STATUSES, SHARED_UPLOAD_PORTAL_STATUSES } from '@/domain/api-access';

export const apiAccessScopeSchema = z.enum(API_ACCESS_SCOPES);
export const apiPlanKeySchema = z.enum(API_PLAN_KEYS);
export const apiTokenEventTypeSchema = z.enum(API_TOKEN_EVENT_TYPES);
export const advancedIntegrationProviderSchema = z.enum(ADVANCED_INTEGRATION_PROVIDERS);
export const advancedIntegrationStatusSchema = z.enum(ADVANCED_INTEGRATION_STATUSES);
export const sharedUploadPortalStatusSchema = z.enum(SHARED_UPLOAD_PORTAL_STATUSES);

export const apiTokenCreateSchema = z.object({
  label: z.string().trim().min(3).max(120),
  scopes: z.array(apiAccessScopeSchema).min(1).max(API_ACCESS_SCOPES.length),
  clientId: z.string().min(1).optional(),
  agencyWorkspaceId: z.string().min(1).optional(),
  expiresAt: z.coerce.date().optional(),
  planKey: apiPlanKeySchema.default('AGENCY'),
  showOnceAcknowledged: z.boolean().default(false),
});

export const apiTokenQuerySchema = z.object({
  organizationId: z.string().min(1).optional(),
  clientId: z.string().min(1).optional(),
  agencyWorkspaceId: z.string().min(1).optional(),
  status: z.enum(['ACTIVE', 'REVOKED', 'EXPIRED', 'ROTATED']).optional(),
  scope: apiAccessScopeSchema.optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});

export const apiTokenRevokeSchema = z.object({
  tokenId: z.string().min(1),
  reason: z.string().trim().min(3).max(240).default('manual_revocation'),
});

export const apiPlanGateRequestSchema = z.object({
  planKey: apiPlanKeySchema.default('AGENCY'),
  requestedScopes: z.array(apiAccessScopeSchema).min(1).max(API_ACCESS_SCOPES.length),
  tokenStatus: z.enum(['ACTIVE', 'REVOKED', 'EXPIRED', 'ROTATED']).default('ACTIVE'),
  subscriptionStatus: z.enum(['ACTIVE', 'PAST_DUE', 'CANCELLED', 'INACTIVE']).default('ACTIVE'),
  paymentStatus: z.enum(['PAID', 'PENDING', 'FAILED', 'REFUNDED', 'UNPAID', 'MANUAL_CONFIRMED']).default('PAID'),
});

export const apiScopeCheckSchema = z.object({
  tokenScopes: z.array(apiAccessScopeSchema).default([]),
  requiredScope: apiAccessScopeSchema,
  planKey: apiPlanKeySchema.default('AGENCY'),
});

export const advancedIntegrationConnectionDraftSchema = z.object({
  provider: advancedIntegrationProviderSchema,
  label: z.string().trim().min(3).max(120),
  scopes: z.array(apiAccessScopeSchema).min(1).max(API_ACCESS_SCOPES.length),
  callbackUrl: z.string().url().optional(),
  encryptedSecretRef: z.string().min(1).max(240).optional(),
  featureFlagKey: z.string().min(1).max(120).default('ENABLE_ADVANCED_INTEGRATIONS'),
  disabledByDefault: z.boolean().default(true),
  status: advancedIntegrationStatusSchema.default('DRAFT'),
});

export const apiWebhookSubscriptionDraftSchema = z.object({
  targetUrl: z.string().url(),
  eventTypes: z.array(z.string().trim().min(3).max(120)).min(1).max(50),
  tokenId: z.string().min(1).optional(),
  provider: advancedIntegrationProviderSchema.default('WEBHOOK'),
  signingSecretRef: z.string().min(1).max(240).optional(),
  enabled: z.boolean().default(false),
});

export const sharedUploadPortalDraftSchema = z.object({
  clientId: z.string().min(1).optional(),
  jobId: z.string().min(1).optional(),
  agencyWorkspaceId: z.string().min(1).optional(),
  label: z.string().trim().min(3).max(120),
  allowedUploadKinds: z.array(z.enum(['DIRECT_UPLOAD', 'ZIP_UPLOAD', 'DRIVE_IMPORT', 'DROPBOX_IMPORT'])).min(1).default(['DIRECT_UPLOAD']),
  expiresAt: z.coerce.date(),
  maxFiles: z.coerce.number().int().min(1).max(500),
  manualReviewRequired: z.boolean().default(true),
});

export const apiAccessEventSchema = z.object({
  tokenId: z.string().min(1).optional(),
  scope: apiAccessScopeSchema.optional(),
  eventType: apiTokenEventTypeSchema,
  route: z.string().trim().min(1).max(240).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const apiV1JobCreateSchema = z.object({
  externalId: z.string().trim().min(1).max(120).optional(),
  clientId: z.string().min(1).optional(),
  title: z.string().trim().min(3).max(160),
  packageKey: z.string().trim().min(1).max(80),
  sourceChannel: z.string().trim().min(1).max(80).default('api'),
  imageCount: z.coerce.number().int().min(1).max(500),
  deadline: z.coerce.date().optional(),
  uploadSessionRequested: z.boolean().default(true),
  manualReviewRequired: z.boolean().default(true),
});

export const apiV1UploadSessionCreateSchema = z.object({
  jobId: z.string().min(1),
  clientId: z.string().min(1).optional(),
  maxFiles: z.coerce.number().int().min(1).max(500).default(100),
  allowedUploadKinds: z.array(z.enum(['DIRECT_UPLOAD', 'ZIP_UPLOAD'])).min(1).default(['DIRECT_UPLOAD']),
  expiresInMinutes: z.coerce.number().int().min(15).max(10080).default(1440),
});

export const apiV1WebhookManageSchema = z.object({
  action: z.enum(['CREATE', 'UPDATE', 'DISABLE', 'TEST']),
  targetUrl: z.string().url().optional(),
  eventTypes: z.array(z.string().trim().min(3).max(120)).max(50).default([]),
});

export type ApiTokenCreateInput = z.infer<typeof apiTokenCreateSchema>;
export type ApiTokenQuery = z.infer<typeof apiTokenQuerySchema>;
export type ApiTokenRevokeInput = z.infer<typeof apiTokenRevokeSchema>;
export type ApiPlanGateRequest = z.infer<typeof apiPlanGateRequestSchema>;
export type ApiScopeCheckInput = z.infer<typeof apiScopeCheckSchema>;
export type AdvancedIntegrationConnectionDraftInput = z.infer<typeof advancedIntegrationConnectionDraftSchema>;
export type ApiWebhookSubscriptionDraftInput = z.infer<typeof apiWebhookSubscriptionDraftSchema>;
export type SharedUploadPortalDraftInput = z.infer<typeof sharedUploadPortalDraftSchema>;
export type ApiAccessEventInput = z.infer<typeof apiAccessEventSchema>;
export type ApiV1JobCreateInput = z.infer<typeof apiV1JobCreateSchema>;
export type ApiV1UploadSessionCreateInput = z.infer<typeof apiV1UploadSessionCreateSchema>;
export type ApiV1WebhookManageInput = z.infer<typeof apiV1WebhookManageSchema>;
