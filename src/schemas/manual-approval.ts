import { z } from 'zod';
import { APPROVAL_GATE_STATUSES, MANUAL_APPROVAL_DECISIONS, OUTPUT_APPROVAL_DECISIONS, REVISION_WORKFLOW_STATUSES } from '@/domain/manual-approval';

export const outputApprovalDecisionSchema = z.enum(OUTPUT_APPROVAL_DECISIONS);
export const manualApprovalDecisionSchema = z.enum(MANUAL_APPROVAL_DECISIONS);
export const approvalGateStatusSchema = z.enum(APPROVAL_GATE_STATUSES);
export const revisionWorkflowStatusSchema = z.enum(REVISION_WORKFLOW_STATUSES);

export const approvalOutputSchema = z.object({
  id: z.string().min(1),
  fileName: z.string().min(1),
  status: z.string().optional().nullable(),
  approvalStatus: z.string().optional().nullable(),
  qualityStatus: z.string().optional().nullable(),
  unresolvedBlockingFlags: z.number().int().min(0).default(0),
  manualReplacementRequired: z.boolean().default(false),
  clientVisible: z.boolean().default(false),
});

export const approvalReadinessSchema = z.object({
  jobId: z.string().min(1),
  jobStatus: z.string().optional().nullable(),
  outputCount: z.number().int().min(0),
  approvedOutputCount: z.number().int().min(0),
  rejectedOutputCount: z.number().int().min(0).default(0),
  unresolvedBlockingFlags: z.number().int().min(0).default(0),
  openRevisionCount: z.number().int().min(0).default(0),
  manualReplacementRequiredCount: z.number().int().min(0).default(0),
  outputs: z.array(approvalOutputSchema).default([]),
});

export const outputApprovalSchema = z.object({
  processedFileId: z.string().min(1),
  decision: outputApprovalDecisionSchema,
  notes: z.string().max(2000).optional().nullable(),
  replacementRequired: z.boolean().default(false),
  reprocessRequested: z.boolean().default(false),
});

export const manualJobApprovalSchema = z.object({
  jobId: z.string().min(1),
  decision: manualApprovalDecisionSchema,
  notes: z.string().max(3000).optional().nullable(),
  deliveryNotes: z.string().max(3000).optional().nullable(),
  requireAllOutputsDecisioned: z.boolean().default(true),
  readiness: approvalReadinessSchema.optional(),
});

export const createRevisionRequestSchema = z.object({
  jobId: z.string().min(1),
  clientId: z.string().optional().nullable(),
  imageId: z.string().optional().nullable(),
  processedFileId: z.string().optional().nullable(),
  requestText: z.string().min(1).max(4000),
  requestedBy: z.enum(['CLIENT', 'ADMIN', 'OPERATOR']).default('CLIENT'),
  clientVisible: z.boolean().default(true),
});

export const updateRevisionStatusSchema = z.object({
  revisionId: z.string().min(1),
  status: revisionWorkflowStatusSchema,
  adminNotes: z.string().max(3000).optional().nullable(),
  clientMessage: z.string().max(3000).optional().nullable(),
  reprocessRequested: z.boolean().default(false),
  manualReplacementUploaded: z.boolean().default(false),
});

export const manualReplacementMarkerSchema = z.object({
  jobId: z.string().min(1),
  imageId: z.string().optional().nullable(),
  processedFileId: z.string().optional().nullable(),
  replacementFileName: z.string().min(1),
  replacementStorageKey: z.string().min(1).optional().nullable(),
  notes: z.string().max(3000).optional().nullable(),
  sourceTool: z.enum(['PHOTOSHOP', 'CANVA', 'OTHER_MANUAL_EDIT']).default('OTHER_MANUAL_EDIT'),
});

export type ApprovalReadinessInput = z.infer<typeof approvalReadinessSchema>;
export type OutputApprovalInput = z.infer<typeof outputApprovalSchema>;
export type ManualJobApprovalInput = z.infer<typeof manualJobApprovalSchema>;
export type CreateRevisionRequestInput = z.infer<typeof createRevisionRequestSchema>;
export type UpdateRevisionStatusInput = z.infer<typeof updateRevisionStatusSchema>;
export type ManualReplacementMarkerInput = z.infer<typeof manualReplacementMarkerSchema>;
