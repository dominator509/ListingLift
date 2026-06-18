import { z } from 'zod';
import {
  AGENCY_BRANDING_REVIEW_STATUSES,
  AGENCY_QUEUE_STATUSES,
  AGENCY_TEAM_ROLES,
  AGENCY_WHITE_LABEL_EVENT_TYPES,
  AGENCY_WHITE_LABEL_SECTIONS,
  AGENCY_WORKSPACE_STATUSES,
} from '@/domain/agency-white-label';

export const agencyWhiteLabelSectionSchema = z.enum(AGENCY_WHITE_LABEL_SECTIONS);
export const agencyWhiteLabelEventTypeSchema = z.enum(AGENCY_WHITE_LABEL_EVENT_TYPES);
export const agencyWorkspaceStatusSchema = z.enum(AGENCY_WORKSPACE_STATUSES);
export const agencyQueueStatusSchema = z.enum(AGENCY_QUEUE_STATUSES);
export const agencyTeamRoleSchema = z.enum(AGENCY_TEAM_ROLES);
export const agencyBrandingReviewStatusSchema = z.enum(AGENCY_BRANDING_REVIEW_STATUSES);

export const agencyDashboardRequestSchema = z.object({
  organizationId: z.string().min(1).optional(),
  includeQueue: z.coerce.boolean().default(true),
  includeBilling: z.coerce.boolean().default(true),
  includeBranding: z.coerce.boolean().default(true),
});

export const agencyWorkspaceQuerySchema = z.object({
  organizationId: z.string().min(1).optional(),
  status: agencyWorkspaceStatusSchema.optional(),
  search: z.string().trim().max(120).optional(),
  whiteLabelOnly: z.coerce.boolean().default(false),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});

export const agencyWorkspaceDraftSchema = z.object({
  clientId: z.string().min(1).optional(),
  clientName: z.string().trim().min(2).max(120),
  workspaceName: z.string().trim().min(2).max(120),
  status: agencyWorkspaceStatusSchema.default('LEAD'),
  sourceChannels: z.array(z.string().trim().min(1).max(80)).max(20).default([]),
  whiteLabelEnabled: z.boolean().default(true),
  brandedReportsEnabled: z.boolean().default(true),
  monthlyImageVolume: z.number().int().nonnegative().default(0),
});

export const agencyWhiteLabelSettingsDraftSchema = z.object({
  portalName: z.string().trim().min(2).max(80).optional(),
  logoUrl: z.string().url().optional(),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  secondaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  supportEmail: z.string().email().optional(),
  customDomain: z.string().trim().min(3).max(120).optional(),
  hideListingLiftBranding: z.boolean().default(false),
  deliveryFooter: z.string().trim().max(1000).optional(),
  reviewStatus: agencyBrandingReviewStatusSchema.default('DRAFT'),
});

export const agencyBrandedDeliveryTemplateSchema = z.object({
  workspaceId: z.string().min(1).optional(),
  clientName: z.string().trim().min(2).max(120),
  packageName: z.string().trim().min(2).max(120),
  approvedFileCount: z.number().int().nonnegative().default(0),
  expiresInDays: z.number().int().min(1).max(30).default(7),
  includeReportLink: z.boolean().default(true),
  footerOverride: z.string().trim().max(1000).optional(),
});

export const agencyBrandedReportDraftSchema = z.object({
  workspaceId: z.string().min(1).optional(),
  clientName: z.string().trim().min(2).max(120),
  reportType: z.enum(['DELIVERY_SUMMARY', 'MONTHLY_RETAINER', 'QUALITY_REVIEW', 'LAUNCH_PACK']).default('DELIVERY_SUMMARY'),
  approvedImageCount: z.number().int().nonnegative().default(0),
  includeUpsellDrafts: z.boolean().default(false),
});

export const agencyTeamInviteDraftSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  name: z.string().trim().min(2).max(120),
  role: agencyTeamRoleSchema,
  clientWorkspaceIds: z.array(z.string().min(1)).max(100).default([]),
});

export const agencyQueueQuerySchema = z.object({
  organizationId: z.string().min(1).optional(),
  workspaceId: z.string().min(1).optional(),
  status: agencyQueueStatusSchema.optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional(),
  requiresManualReview: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});

export const agencyBulkQueuePlanSchema = z.object({
  workspaceId: z.string().min(1),
  jobIds: z.array(z.string().min(1)).min(1).max(100),
  targetPresetKeys: z.array(z.string().min(1).max(80)).min(1).max(25),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL'),
  manualReviewRequired: z.boolean().default(true),
});

export const agencyVolumePricingRequestSchema = z.object({
  monthlyImageVolume: z.coerce.number().int().nonnegative().default(250),
  workspaceCount: z.coerce.number().int().nonnegative().default(1),
  rushQueueEnabled: z.coerce.boolean().default(false),
  brandedReportsEnabled: z.coerce.boolean().default(true),
  apiAccessRequested: z.coerce.boolean().default(false),
  currency: z.string().length(3).default('USD'),
});

export const agencyWhiteLabelEventSchema = z.object({
  organizationId: z.string().min(1).optional(),
  section: agencyWhiteLabelSectionSchema,
  eventType: agencyWhiteLabelEventTypeSchema,
  clientId: z.string().min(1).optional(),
  workspaceId: z.string().min(1).optional(),
  jobId: z.string().min(1).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type AgencyDashboardRequest = z.infer<typeof agencyDashboardRequestSchema>;
export type AgencyWorkspaceQuery = z.infer<typeof agencyWorkspaceQuerySchema>;
export type AgencyWorkspaceDraftInput = z.infer<typeof agencyWorkspaceDraftSchema>;
export type AgencyWhiteLabelSettingsDraftInput = z.infer<typeof agencyWhiteLabelSettingsDraftSchema>;
export type AgencyBrandedDeliveryTemplateInput = z.infer<typeof agencyBrandedDeliveryTemplateSchema>;
export type AgencyBrandedReportDraftInput = z.infer<typeof agencyBrandedReportDraftSchema>;
export type AgencyTeamInviteDraftInput = z.infer<typeof agencyTeamInviteDraftSchema>;
export type AgencyQueueQuery = z.infer<typeof agencyQueueQuerySchema>;
export type AgencyBulkQueuePlanInput = z.infer<typeof agencyBulkQueuePlanSchema>;
export type AgencyVolumePricingRequest = z.infer<typeof agencyVolumePricingRequestSchema>;
export type AgencyWhiteLabelEventInput = z.infer<typeof agencyWhiteLabelEventSchema>;
