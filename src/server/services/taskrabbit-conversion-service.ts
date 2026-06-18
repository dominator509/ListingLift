import { buildTaskrabbitDirectFollowUpPrompt } from '@/domain/taskrabbit';
import { taskrabbitConversionUpdateSchema, taskrabbitFollowUpPromptInputSchema, type TaskrabbitConversionUpdateInput, type TaskrabbitFollowUpPromptInput } from '@/schemas/taskrabbit';

export function createTaskrabbitConversionUpdatePlan(input: TaskrabbitConversionUpdateInput) {
  const parsed = taskrabbitConversionUpdateSchema.parse(input);
  return {
    mode: parsed.dryRun ? 'DRY_RUN' : 'PERSISTENCE_REQUIRED',
    taskId: parsed.taskId,
    jobId: parsed.jobId,
    conversionStatus: parsed.conversionStatus,
    followUpNotes: parsed.followUpNotes,
    monthlyImageEstimate: parsed.monthlyImageEstimate,
    shouldAudit: true,
    requiresConsentBeforeDirectOutreach: parsed.conversionStatus === 'FOLLOW_UP_SENT' || parsed.conversionStatus === 'INTERESTED',
  };
}

export function createTaskrabbitFollowUpPrompt(input: TaskrabbitFollowUpPromptInput) {
  const parsed = taskrabbitFollowUpPromptInputSchema.parse(input);
  return {
    prompt: buildTaskrabbitDirectFollowUpPrompt(parsed),
    safety: {
      requiresCustomerConsent: true,
      obeyPlatformRules: true,
      noOffPlatformPressure: true,
      manualOperatorReviewRequired: true,
    },
  };
}
