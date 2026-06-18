import { z } from 'zod';
import { REQUIRED_PACKAGE_KEYS, REQUIRED_SALES_CHANNEL_KEYS } from '@/domain/database-keys';

export const genericSalesChannelCategorySchema = z.enum(['FREELANCE_MARKETPLACE', 'LOCAL_LEAD_DIRECTORY', 'SOCIAL_PROFILE', 'COMMUNITY_PLATFORM', 'LAUNCH_DIRECTORY', 'BUSINESS_DIRECTORY']);
export const genericSalesChannelWorkflowStatusSchema = z.enum(['LEAD_CAPTURED', 'QUALIFICATION_NEEDED', 'PROPOSAL_DRAFTED', 'WAITING_FOR_RESPONSE', 'ORDER_CONFIRMED', 'UPLOAD_LINK_SENT', 'FILES_RECEIVED', 'JOB_CREATED', 'IN_FULFILLMENT', 'DELIVERY_READY', 'DELIVERED_ON_SOURCE', 'FOLLOW_UP_NEEDED', 'RETAINER_CONVERTED', 'CLOSED_WON', 'CLOSED_LOST', 'DO_NOT_CONTACT']);
export const genericSalesChannelTemplateTypeSchema = z.enum(['PROPOSAL', 'FOLLOW_UP', 'DELIVERY', 'RETAINER_UPSELL', 'CASE_STUDY_REQUEST']);
export const genericSalesChannelLeadIntentSchema = z.enum(['IMAGE_CLEANUP', 'MARKETPLACE_PACK', 'LOCAL_LISTING', 'AGENCY_WHITE_LABEL', 'RETAINER', 'CUSTOM']);
export const genericSalesChannelDeliveryModeSchema = z.enum(['SOURCE_PLATFORM_MESSAGE', 'SOURCE_PLATFORM_WITH_ALLOWED_LINK', 'EMAIL_WITH_ALLOWED_LINK', 'MANUAL_EXTERNAL_DELIVERY_RECORDED']);

const amountToCents = z.union([z.number(), z.string()]).optional().transform((value) => {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'number') return Math.round(value * 100);
  const parsed = Number(value.replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) ? Math.round(parsed * 100) : undefined;
});

export const genericManualOrderInputSchema = z.object({
  organizationId: z.string().optional(),
  existingClientId: z.string().optional(),
  channelKey: z.enum(REQUIRED_SALES_CHANNEL_KEYS),
  sourceLabel: z.string().trim().optional(),
  externalReference: z.string().trim().min(1),
  buyerName: z.string().trim().optional(),
  buyerEmailOrUsername: z.string().trim().optional(),
  businessName: z.string().trim().optional(),
  sourceUrl: z.string().url().optional().or(z.literal('')),
  leadTitle: z.string().trim().min(1),
  leadIntent: genericSalesChannelLeadIntentSchema.default('IMAGE_CLEANUP'),
  packagePurchased: z.string().trim().optional(),
  packageKey: z.enum(REQUIRED_PACKAGE_KEYS).optional(),
  imageQuantity: z.number().int().positive().optional(),
  orderAmount: amountToCents,
  orderAmountCents: z.number().int().nonnegative().optional(),
  currency: z.string().length(3).default('USD'),
  deadline: z.string().datetime().optional(),
  revisionAllowance: z.number().int().nonnegative().optional(),
  notes: z.string().max(5000).optional(),
  externalLinkAllowed: z.boolean().default(false),
  uploadStatus: z.enum(['NOT_STARTED', 'WAITING_FOR_UPLOAD', 'RECEIVED', 'PARTIAL', 'FAILED']).default('WAITING_FOR_UPLOAD'),
  workflowStatus: genericSalesChannelWorkflowStatusSchema.default('LEAD_CAPTURED'),
  dryRun: z.boolean().default(true),
});

export const genericProposalTemplateInputSchema = z.object({
  channelKey: z.enum(REQUIRED_SALES_CHANNEL_KEYS).optional(),
  channelLabel: z.string().optional(),
  buyerName: z.string().optional(),
  packageLabel: z.string().optional(),
  imageCount: z.number().int().positive().optional(),
  intent: genericSalesChannelLeadIntentSchema.optional(),
});

export const genericFollowUpStatusInputSchema = z.object({
  channelKey: z.enum(REQUIRED_SALES_CHANNEL_KEYS),
  externalReference: z.string().trim().min(1),
  workflowStatus: genericSalesChannelWorkflowStatusSchema,
  followUpNotes: z.string().max(5000).optional(),
  nextFollowUpAt: z.string().datetime().optional(),
  dryRun: z.boolean().default(true),
});

export const genericChannelSafetyCheckSchema = z.object({
  channelKey: z.enum(REQUIRED_SALES_CHANNEL_KEYS).optional(),
  intendedActions: z.array(z.string()).default([]),
  deliveryMode: genericSalesChannelDeliveryModeSchema.optional(),
  externalLinkAllowed: z.boolean().default(false),
  automatesMessages: z.boolean().default(false),
  storesPassword: z.boolean().default(false),
  scrapesPrivatePages: z.boolean().default(false),
});

export type GenericManualOrderInput = z.infer<typeof genericManualOrderInputSchema>;
export type GenericProposalTemplateInput = z.infer<typeof genericProposalTemplateInputSchema>;
export type GenericFollowUpStatusInput = z.infer<typeof genericFollowUpStatusInputSchema>;
export type GenericChannelSafetyCheckInput = z.infer<typeof genericChannelSafetyCheckSchema>;
