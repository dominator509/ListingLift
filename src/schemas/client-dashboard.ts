import { z } from 'zod';

export const clientDashboardSectionSchema = z.enum([
  'OVERVIEW',
  'UPLOADS',
  'ACTIVE_JOBS',
  'COMPLETED_JOBS',
  'PREVIEWS',
  'DOWNLOADS',
  'REVISIONS',
  'BILLING',
  'UPGRADE',
]);

export const clientDashboardSummaryRequestSchema = z.object({
  clientId: z.string().min(1).optional(),
  includeBilling: z.boolean().default(true),
  includeUpsells: z.boolean().default(true),
  includeReports: z.boolean().default(true),
});

export const clientDashboardJobListRequestSchema = z.object({
  clientId: z.string().min(1).optional(),
  group: z.enum(['active', 'completed', 'blocked', 'all']).default('active'),
  status: z.string().optional(),
  search: z.string().max(120).optional(),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().min(1).max(100).default(25),
});

export const clientDashboardUploadPlanRequestSchema = z.object({
  clientId: z.string().min(1).optional(),
  jobId: z.string().min(1),
  requestedFileCount: z.number().int().min(1).max(500).default(1),
  requestedZipUpload: z.boolean().default(false),
  sourceNote: z.string().max(500).optional(),
});

export const clientDashboardDownloadRequestSchema = z.object({
  clientId: z.string().min(1).optional(),
  jobId: z.string().min(1).optional(),
  token: z.string().min(10).optional(),
});

export const clientDashboardRevisionRequestSchema = z.object({
  clientId: z.string().min(1).optional(),
  jobId: z.string().min(1),
  notes: z.string().min(5).max(2000),
  requestedOutputIds: z.array(z.string().min(1)).default([]),
});

export const clientDashboardEventSchema = z.object({
  clientId: z.string().min(1).optional(),
  section: clientDashboardSectionSchema,
  eventType: z.enum(['VIEW', 'OPEN_JOB', 'OPEN_UPLOAD', 'OPEN_PREVIEW', 'OPEN_DOWNLOAD', 'OPEN_REVISION', 'OPEN_BILLING', 'OPEN_UPGRADE', 'REQUEST_HELP']),
  jobId: z.string().min(1).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type ClientDashboardSummaryRequest = z.infer<typeof clientDashboardSummaryRequestSchema>;
export type ClientDashboardJobListRequest = z.infer<typeof clientDashboardJobListRequestSchema>;
export type ClientDashboardUploadPlanRequest = z.infer<typeof clientDashboardUploadPlanRequestSchema>;
export type ClientDashboardDownloadRequest = z.infer<typeof clientDashboardDownloadRequestSchema>;
export type ClientDashboardRevisionRequest = z.infer<typeof clientDashboardRevisionRequestSchema>;
export type ClientDashboardEventInput = z.infer<typeof clientDashboardEventSchema>;
