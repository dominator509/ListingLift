import { z } from 'zod';

export const automationProviderKeySchema = z.enum(['internal_mock', 'generic_webhook', 'zapier_webhook', 'make_webhook', 'n8n_webhook']);
export const automationTriggerKeySchema = z.enum([
  'NEW_PAID_ORDER',
  'NEW_IMAGE_UPLOAD',
  'JOB_PROCESSING_STARTED',
  'JOB_WAITING_FOR_REVIEW',
  'JOB_COMPLETED',
  'REVISION_REQUESTED',
  'DOWNLOAD_READY',
  'CREDITS_LOW',
  'SUBSCRIPTION_INACTIVE',
  'UPSELL_OPPORTUNITY_DETECTED',
]);
export const automationActionKeySchema = z.enum([
  'CREATE_JOB',
  'SEND_EMAIL',
  'CREATE_SLACK_MESSAGE',
  'CREATE_TRELLO_CARD',
  'CREATE_CLICKUP_TASK',
  'CREATE_GOOGLE_DRIVE_FOLDER',
  'EXPORT_ZIP',
  'UPDATE_CRM',
  'NOTIFY_ADMIN',
]);
export const automationSubscriptionStatusSchema = z.enum(['DRAFT', 'ENABLED', 'PAUSED', 'FAILED', 'DISABLED', 'REVOKED']);
export const automationDispatchStatusSchema = z.enum(['PLANNED', 'QUEUED', 'SENT', 'SKIPPED', 'FAILED', 'DEAD_LETTERED']);

export const automationSubscriptionInputSchema = z.object({
  organizationId: z.string().min(1),
  providerKey: automationProviderKeySchema,
  displayName: z.string().min(2).max(120),
  triggerKeys: z.array(automationTriggerKeySchema).min(1),
  actionKeys: z.array(automationActionKeySchema).min(1),
  endpointUrl: z.string().url().optional(),
  encryptedSecretId: z.string().min(1).optional(),
  enabled: z.boolean().default(false),
  maxRetries: z.number().int().min(0).max(10).default(3),
  config: z.record(z.string(), z.unknown()).default({}),
});

export const automationEventDraftSchema = z.object({
  organizationId: z.string().min(1),
  triggerKey: automationTriggerKeySchema,
  jobId: z.string().optional(),
  clientId: z.string().optional(),
  externalOrderId: z.string().optional(),
  sourceId: z.string().optional(),
  payload: z.record(z.string(), z.unknown()).default({}),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export const automationDispatchInputSchema = z.object({
  organizationId: z.string().min(1),
  subscriptionId: z.string().min(1).optional(),
  providerKey: automationProviderKeySchema,
  triggerKey: automationTriggerKeySchema,
  actionKey: automationActionKeySchema,
  payload: z.record(z.string(), z.unknown()).default({}),
  dryRun: z.boolean().default(true),
});

export const automationWebhookTestInputSchema = z.object({
  providerKey: automationProviderKeySchema,
  endpointUrl: z.string().url().optional(),
  encryptedSecretId: z.string().optional(),
  triggerKey: automationTriggerKeySchema.default('JOB_WAITING_FOR_REVIEW'),
  actionKey: automationActionKeySchema.default('NOTIFY_ADMIN'),
});

export type AutomationSubscriptionInput = z.infer<typeof automationSubscriptionInputSchema>;
export type AutomationEventDraft = z.infer<typeof automationEventDraftSchema>;
export type AutomationDispatchInput = z.infer<typeof automationDispatchInputSchema>;
export type AutomationWebhookTestInput = z.infer<typeof automationWebhookTestInputSchema>;
