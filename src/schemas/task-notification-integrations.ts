import { z } from 'zod';

export const taskNotificationProviderKeySchema = z.enum([
  'internal_email',
  'slack',
  'smtp_email',
  'google_sheets',
  'airtable',
  'trello',
  'clickup',
  'asana',
  'notion',
]);

export const taskNotificationActionKeySchema = z.enum([
  'SEND_SLACK_ALERT',
  'SEND_EMAIL',
  'EXPORT_GOOGLE_SHEET_ROW',
  'EXPORT_AIRTABLE_RECORD',
  'CREATE_TRELLO_CARD',
  'CREATE_CLICKUP_TASK',
  'CREATE_ASANA_TASK',
  'CREATE_NOTION_PAGE',
  'EXPORT_REPORT_DATA',
]);

export const taskNotificationEventKeySchema = z.enum([
  'NEW_PAID_ORDER',
  'UPLOAD_RECEIVED',
  'WAITING_FOR_REVIEW',
  'FLAGGED_OUTPUTS',
  'REVISION_REQUESTED',
  'READY_FOR_DELIVERY',
  'DELIVERED',
  'COMPLETED',
  'CREDITS_LOW',
  'UPSELL_READY',
]);

export const taskNotificationConnectionInputSchema = z.object({
  providerKey: taskNotificationProviderKeySchema,
  displayName: z.string().min(2).max(120),
  encryptedSecretId: z.string().optional(),
  config: z.record(z.string(), z.unknown()).default({}),
  enabled: z.boolean().default(false),
});

export const taskNotificationAlertInputSchema = z.object({
  organizationId: z.string().min(1),
  providerKey: taskNotificationProviderKeySchema,
  eventKey: taskNotificationEventKeySchema,
  title: z.string().min(1).max(160),
  message: z.string().min(1).max(4000),
  jobId: z.string().optional(),
  clientId: z.string().optional(),
  payload: z.record(z.string(), z.unknown()).default({}),
  dryRun: z.boolean().default(true),
});

export const taskDataExportInputSchema = z.object({
  organizationId: z.string().min(1),
  providerKey: z.enum(['google_sheets', 'airtable', 'notion']),
  actionKey: z.enum(['EXPORT_GOOGLE_SHEET_ROW', 'EXPORT_AIRTABLE_RECORD', 'CREATE_NOTION_PAGE', 'EXPORT_REPORT_DATA']),
  exportKind: z.enum(['JOB', 'CLIENT', 'REVENUE', 'REPORT', 'DELIVERY', 'UPSELL']),
  records: z.array(z.record(z.string(), z.unknown())).min(1).max(500),
  dryRun: z.boolean().default(true),
});

export const taskCreationInputSchema = z.object({
  organizationId: z.string().min(1),
  providerKey: z.enum(['trello', 'clickup', 'asana', 'notion']),
  actionKey: z.enum(['CREATE_TRELLO_CARD', 'CREATE_CLICKUP_TASK', 'CREATE_ASANA_TASK', 'CREATE_NOTION_PAGE']),
  title: z.string().min(1).max(200),
  description: z.string().max(8000).default(''),
  jobId: z.string().optional(),
  dueAt: z.string().datetime().optional(),
  labels: z.array(z.string()).default([]),
  dryRun: z.boolean().default(true),
});

export const taskNotificationTestInputSchema = z.object({
  providerKey: taskNotificationProviderKeySchema,
  actionKey: taskNotificationActionKeySchema,
  dryRun: z.boolean().default(true),
});

export type TaskNotificationConnectionInput = z.infer<typeof taskNotificationConnectionInputSchema>;
export type TaskNotificationAlertInput = z.infer<typeof taskNotificationAlertInputSchema>;
export type TaskDataExportInput = z.infer<typeof taskDataExportInputSchema>;
export type TaskCreationInput = z.infer<typeof taskCreationInputSchema>;
