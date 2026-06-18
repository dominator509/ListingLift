import { getDeadlineWarningLevel, normalizeJobPriority, safeAdminQueueNote } from '@/domain/job-queue';
import type { ManualJobCreateInput } from '@/schemas/job';
import { buildNextJobNumber } from '@/server/services/job-number-service';

export type ManualJobDraft = {
  organizationId?: string;
  clientId?: string;
  jobNumber: string;
  title: string;
  status: 'WAITING_FOR_UPLOAD';
  uploadStatus: 'NOT_STARTED';
  fulfillmentStatus: 'NOT_STARTED';
  paymentStatus: string;
  sourceChannelName: string;
  sourceUrl?: string;
  externalOrderId?: string;
  packageKey: string;
  targetPlatform: string;
  selectedPresetKeys: string[];
  imageQuantity: number;
  deadline?: string;
  priority: ReturnType<typeof normalizeJobPriority>;
  deadlineWarningLevel: ReturnType<typeof getDeadlineWarningLevel>;
  adminNotes: string | null;
  clientIntakeNotes: string | null;
  revenueAttribution: {
    sourceChannelName: string;
    orderAmount?: number;
    currency: string;
    paymentStatus: string;
    attributionMode: 'MANUAL_ADMIN_ENTRY';
  };
  auditEvent: {
    action: 'manual_job_created';
    summary: string;
  };
};

export function buildManualJobDraft(input: ManualJobCreateInput, context: { organizationSlug?: string | null; existingJobCount?: number; now?: Date | string } = {}): ManualJobDraft {
  const priority = normalizeJobPriority(input.priority);
  const now = context.now ?? new Date();
  const deadlineWarningLevel = getDeadlineWarningLevel({ deadline: input.deadline, now, status: 'WAITING_FOR_UPLOAD' });
  const jobNumber = buildNextJobNumber({ organizationSlug: context.organizationSlug, existingCount: context.existingJobCount ?? 0, createdAt: now });

  return {
    organizationId: input.organizationId,
    clientId: input.clientId,
    jobNumber,
    title: input.title,
    status: 'WAITING_FOR_UPLOAD',
    uploadStatus: 'NOT_STARTED',
    fulfillmentStatus: 'NOT_STARTED',
    paymentStatus: input.paymentStatus,
    sourceChannelName: input.sourceChannelName,
    sourceUrl: input.sourceUrl,
    externalOrderId: input.externalOrderId,
    packageKey: input.packageKey,
    targetPlatform: input.targetPlatform,
    selectedPresetKeys: input.selectedPresetKeys,
    imageQuantity: input.imageQuantity,
    deadline: input.deadline,
    priority,
    deadlineWarningLevel,
    adminNotes: safeAdminQueueNote(input.adminNotes),
    clientIntakeNotes: safeAdminQueueNote(input.clientIntakeNotes),
    revenueAttribution: {
      sourceChannelName: input.sourceChannelName,
      orderAmount: input.orderAmount,
      currency: input.currency,
      paymentStatus: input.paymentStatus,
      attributionMode: 'MANUAL_ADMIN_ENTRY',
    },
    auditEvent: {
      action: 'manual_job_created',
      summary: `Manual job ${jobNumber} created for ${input.clientName}.`,
    },
  };
}

export function assertManualJobCreationSafe(input: ManualJobCreateInput): void {
  if (input.sourceUrl && /password|session|token/i.test(input.sourceUrl)) {
    throw new Error('Source URL must not contain passwords, session IDs, or tokens.');
  }
  if (input.orderAmount !== undefined && input.orderAmount < 0) {
    throw new Error('Order amount cannot be negative.');
  }
  if (input.imageQuantity <= 0) {
    throw new Error('Manual jobs must include a positive image quantity.');
  }
}
