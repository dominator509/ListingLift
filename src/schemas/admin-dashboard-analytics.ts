import { z } from 'zod';
import { ADMIN_DASHBOARD_EVENT_TYPES, ADMIN_DASHBOARD_SECTIONS } from '@/domain/admin-dashboard-analytics';

export const adminDashboardSectionSchema = z.enum(ADMIN_DASHBOARD_SECTIONS);
export const adminDashboardEventTypeSchema = z.enum(ADMIN_DASHBOARD_EVENT_TYPES);

export const adminDashboardSummaryRequestSchema = z.object({
  organizationId: z.string().min(1).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  includeRevenue: z.boolean().default(true),
  includeConversions: z.boolean().default(true),
  includeRetainerAlerts: z.boolean().default(true),
});

export const adminJobQueueQuerySchema = z.object({
  organizationId: z.string().min(1).optional(),
  group: z.enum(['active', 'completed', 'flagged', 'dueSoon', 'blocked', 'all']).default('active'),
  sourceChannel: z.string().max(80).optional(),
  status: z.string().max(80).optional(),
  search: z.string().max(120).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});

export const adminRevenueChannelInputSchema = z.object({
  channelKey: z.string().min(1).max(80),
  channelName: z.string().min(1).max(120),
  channelType: z.string().max(80).optional(),
  orderCount: z.number().int().nonnegative().default(0),
  jobCount: z.number().int().nonnegative().default(0),
  completedJobCount: z.number().int().nonnegative().default(0),
  grossRevenueCents: z.number().int().nonnegative().default(0),
  refundCents: z.number().int().nonnegative().default(0),
  currency: z.string().length(3).default('USD'),
  directConversionCount: z.number().int().nonnegative().default(0),
  retainerCandidateCount: z.number().int().nonnegative().default(0),
});

export const adminRevenueAnalyticsRequestSchema = z.object({
  organizationId: z.string().min(1).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  currency: z.string().length(3).default('USD'),
  channelKey: z.string().max(80).optional(),
  includeManualDrafts: z.boolean().default(true),
});

export const adminConversionCandidateSchema = z.object({
  clientId: z.string().optional(),
  clientName: z.string().min(1),
  marketplaceSource: z.string().min(1),
  directSource: z.string().optional(),
  marketplaceOrderCount: z.number().int().nonnegative().default(0),
  directOrderCount: z.number().int().nonnegative().default(0),
  grossRevenueCents: z.number().int().nonnegative().default(0),
  lastOrderAt: z.string().datetime().optional(),
});

export const adminConversionRequestSchema = z.object({
  organizationId: z.string().min(1).optional(),
  minimumMarketplaceOrders: z.coerce.number().int().nonnegative().default(1),
  requireDirectOrder: z.coerce.boolean().default(false),
});

export const retainerOpportunitySignalSchema = z.object({
  clientId: z.string().optional(),
  clientName: z.string().min(1),
  sourceChannel: z.string().optional(),
  completedJobs: z.number().int().nonnegative().default(0),
  deliveredImages: z.number().int().nonnegative().default(0),
  lastDeliveryAt: z.string().datetime().optional(),
  daysSinceLastDelivery: z.number().int().nonnegative().default(0),
  hasActiveSubscription: z.boolean().default(false),
  creditBalance: z.number().int().default(0),
  grossRevenueCents: z.number().int().nonnegative().default(0),
});

export const adminRetainerAlertRequestSchema = z.object({
  organizationId: z.string().min(1).optional(),
  minimumScore: z.coerce.number().int().min(0).max(100).default(50),
  includeSubscribedClients: z.coerce.boolean().default(false),
});

export const adminDashboardEventSchema = z.object({
  organizationId: z.string().min(1).optional(),
  section: adminDashboardSectionSchema,
  eventType: adminDashboardEventTypeSchema,
  jobId: z.string().min(1).optional(),
  clientId: z.string().min(1).optional(),
  sourceChannel: z.string().max(80).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type AdminDashboardSummaryRequest = z.infer<typeof adminDashboardSummaryRequestSchema>;
export type AdminJobQueueQuery = z.infer<typeof adminJobQueueQuerySchema>;
export type AdminRevenueAnalyticsRequest = z.infer<typeof adminRevenueAnalyticsRequestSchema>;
export type AdminConversionRequest = z.infer<typeof adminConversionRequestSchema>;
export type AdminRetainerAlertRequest = z.infer<typeof adminRetainerAlertRequestSchema>;
export type AdminDashboardEventInput = z.infer<typeof adminDashboardEventSchema>;
