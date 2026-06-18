import { z } from 'zod';
import { DELIVERY_DOWNLOAD_EVENT_TYPES, DELIVERY_EMAIL_STATUSES, DELIVERY_NOTIFICATION_TYPES, MARKETPLACE_DELIVERY_TEMPLATE_KEYS } from '@/domain/delivery-notifications';

export const deliveryNotificationTypeSchema = z.enum(DELIVERY_NOTIFICATION_TYPES);
export const deliveryEmailStatusSchema = z.enum(DELIVERY_EMAIL_STATUSES);
export const deliveryDownloadEventTypeSchema = z.enum(DELIVERY_DOWNLOAD_EVENT_TYPES);
export const marketplaceDeliveryTemplateKeySchema = z.enum(MARKETPLACE_DELIVERY_TEMPLATE_KEYS);

export const deliveryLinkIssueSchema = z.object({
  jobId: z.string().min(1),
  deliveryArchiveId: z.string().min(1).optional().nullable(),
  recipientEmail: z.string().email(),
  recipientName: z.string().max(120).optional().nullable(),
  expiresInMinutes: z.number().int().positive().max(60 * 24 * 30).default(60 * 24 * 7),
  maxDownloads: z.number().int().positive().max(50).default(5),
  deliveryNotes: z.string().max(3000).optional().nullable(),
  sendEmail: z.boolean().default(true),
  marketplaceTemplateKey: marketplaceDeliveryTemplateKeySchema.default('DIRECT_WEBSITE'),
});

export const deliveryTokenResolveSchema = z.object({
  token: z.string().min(20),
  requestIp: z.string().max(100).optional().nullable(),
  userAgent: z.string().max(500).optional().nullable(),
});

export const deliveryDownloadTrackSchema = z.object({
  token: z.string().min(20),
  eventType: deliveryDownloadEventTypeSchema,
  deliveryLinkId: z.string().optional().nullable(),
  requestIp: z.string().max(100).optional().nullable(),
  userAgent: z.string().max(500).optional().nullable(),
});

export const deliveryEmailPreviewSchema = z.object({
  jobId: z.string().min(1),
  recipientEmail: z.string().email(),
  recipientName: z.string().max(120).optional().nullable(),
  packageName: z.string().max(120).optional().nullable(),
  downloadUrl: z.string().url(),
  expiresAt: z.coerce.date(),
  deliveryNotes: z.string().max(3000).optional().nullable(),
  notificationType: deliveryNotificationTypeSchema.default('DOWNLOAD_READY'),
});

export const marketplaceDeliveryMessageSchema = z.object({
  templateKey: marketplaceDeliveryTemplateKeySchema,
  buyerName: z.string().max(120).optional().nullable(),
  packageName: z.string().max(120).optional().nullable(),
  downloadUrl: z.string().url(),
  expiresAt: z.coerce.date(),
  revisionInstructions: z.string().max(1000).optional().nullable(),
});

export const notificationSendSchema = z.object({
  type: deliveryNotificationTypeSchema,
  to: z.string().email(),
  subject: z.string().min(1).max(200),
  bodyText: z.string().min(1).max(10000),
  jobId: z.string().optional().nullable(),
  clientId: z.string().optional().nullable(),
  dryRun: z.boolean().default(true),
});

export type DeliveryLinkIssueInput = z.infer<typeof deliveryLinkIssueSchema>;
export type DeliveryTokenResolveInput = z.infer<typeof deliveryTokenResolveSchema>;
export type DeliveryDownloadTrackInput = z.infer<typeof deliveryDownloadTrackSchema>;
export type DeliveryEmailPreviewInput = z.infer<typeof deliveryEmailPreviewSchema>;
export type MarketplaceDeliveryMessageInput = z.infer<typeof marketplaceDeliveryMessageSchema>;
export type NotificationSendInput = z.infer<typeof notificationSendSchema>;
