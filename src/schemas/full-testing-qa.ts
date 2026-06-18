import { z } from 'zod';
import { QA_CHECK_STATUSES, QA_EVIDENCE_TYPES, QA_SEVERITIES, QA_TEST_LAYERS } from '@/domain/full-testing-qa';

export const qaTestLayerSchema = z.enum(QA_TEST_LAYERS);
export const qaCheckStatusSchema = z.enum(QA_CHECK_STATUSES);
export const qaEvidenceTypeSchema = z.enum(QA_EVIDENCE_TYPES);
export const qaSeveritySchema = z.enum(QA_SEVERITIES);

export const qaDashboardQuerySchema = z.object({
  layer: qaTestLayerSchema.optional(),
  status: qaCheckStatusSchema.optional(),
});

export const qaCommandResultDraftSchema = z.object({
  commandKey: z.string().trim().min(2).max(120),
  layer: qaTestLayerSchema,
  status: qaCheckStatusSchema,
  startedAtIso: z.string().datetime().optional(),
  completedAtIso: z.string().datetime().optional(),
  exitCode: z.number().int().optional().nullable(),
  evidenceType: qaEvidenceTypeSchema.optional(),
  evidenceRef: z.string().trim().max(500).optional().nullable(),
  summary: z.string().trim().max(2000).optional().default(''),
  blocker: z.boolean().default(false),
}).strict();

export const qaVerificationLedgerDraftSchema = z.object({
  organizationId: z.string().min(1),
  userId: z.string().optional().nullable(),
  packageVersion: z.string().trim().min(2).max(80).default('v40'),
  phase: z.number().int().default(38),
  checkKey: z.string().trim().min(2).max(160),
  layer: qaTestLayerSchema,
  status: qaCheckStatusSchema,
  severity: qaSeveritySchema.default('HIGH'),
  command: z.string().trim().max(400).optional().nullable(),
  evidence: z.array(z.object({
    type: qaEvidenceTypeSchema,
    ref: z.string().trim().min(1).max(500),
    note: z.string().trim().max(1000).optional(),
  })).default([]),
  notes: z.string().trim().max(4000).default(''),
}).strict();

export const qaSmokeTargetQuerySchema = z.object({
  group: z.string().trim().max(80).optional(),
});

export type QaDashboardQueryInput = z.infer<typeof qaDashboardQuerySchema>;
export type QaCommandResultDraftInput = z.infer<typeof qaCommandResultDraftSchema>;
export type QaVerificationLedgerDraftInput = z.infer<typeof qaVerificationLedgerDraftSchema>;
export type QaSmokeTargetQueryInput = z.infer<typeof qaSmokeTargetQuerySchema>;
