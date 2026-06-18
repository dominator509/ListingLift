import { buildTaskrabbitDedupeKey, normalizeTaskrabbitTaskId, redactTaskrabbitCustomer } from '@/domain/taskrabbit';
import { taskrabbitManualTaskInputSchema, type TaskrabbitManualTaskInput } from '@/schemas/taskrabbit';
import { normalizeTaskrabbitOrder } from '@/server/services/sales-channel-normalizer';
import { resolveTaskrabbitServiceMapping } from './taskrabbit-service-mapping-service';

export function createTaskrabbitManualTaskPlan(input: TaskrabbitManualTaskInput) {
  const parsed = taskrabbitManualTaskInputSchema.parse(input);
  const mapping = resolveTaskrabbitServiceMapping(parsed);
  const externalOrderId = normalizeTaskrabbitTaskId(parsed.taskId);
  const taskValueCents = parsed.taskValueCents ?? parsed.taskValue ?? 0;
  const normalized = normalizeTaskrabbitOrder({
    task_id: externalOrderId,
    buyer_name: parsed.customerName,
    buyer_username: parsed.customerUsername,
    task_title: parsed.taskTitle,
    task_category: parsed.taskCategory,
    packagePurchased: parsed.packagePurchased ?? mapping.mapping.title,
    package_key: mapping.packageKey,
    amount: taskValueCents / 100,
    currency: parsed.currency,
    deadline: parsed.deadline ?? parsed.appointmentAt,
    revisionAllowance: mapping.revisionAllowance,
    source_url: parsed.sourceUrl || undefined,
    paymentStatus: 'MANUAL_CONFIRMED',
  });

  return {
    mode: parsed.dryRun ? 'DRY_RUN' : 'PERSISTENCE_REQUIRED',
    externalOrderDraft: {
      provider: 'taskrabbit',
      externalOrderId,
      dedupeKey: buildTaskrabbitDedupeKey(externalOrderId),
      customerNameRedacted: redactTaskrabbitCustomer(parsed.customerName),
      businessName: parsed.businessName,
      customerUsername: parsed.customerUsername,
      taskTitle: parsed.taskTitle,
      taskCategory: parsed.taskCategory,
      appointmentStatus: parsed.appointmentStatus,
      appointmentAt: parsed.appointmentAt,
      deadline: parsed.deadline,
      cityOrArea: parsed.cityOrArea,
      packageKey: mapping.packageKey,
      taskValueCents,
      currency: parsed.currency,
      sourceUrl: parsed.sourceUrl || undefined,
      normalized,
    },
    clientDraft: {
      existingClientId: parsed.existingClientId,
      displayName: parsed.businessName ?? parsed.customerName,
      marketplaceUsername: parsed.customerUsername,
      source: 'Taskrabbit',
      cityOrArea: parsed.cityOrArea,
    },
    jobDraft: {
      title: `Taskrabbit ${parsed.taskTitle} — ${externalOrderId}`,
      packageKey: mapping.packageKey,
      imageQuantity: mapping.imageAllowance,
      status: parsed.uploadStatus === 'RECEIVED' ? 'UPLOAD_RECEIVED' : 'WAITING_FOR_UPLOAD',
      targetPlatform: 'Local service / marketplace sellers',
      deadline: parsed.deadline ?? parsed.appointmentAt,
      sourceChannel: 'Taskrabbit',
      adminNotes: parsed.taskNotes,
    },
    uploadLinkPlan: mapping.mapping.createsUploadLink
      ? { shouldCreateUploadToken: true, reason: 'Taskrabbit local task requires source files before processing.', fileLimit: mapping.imageAllowance }
      : { shouldCreateUploadToken: false, reason: 'Selected Taskrabbit service mapping does not require an upload link.' },
    conversionPlan: {
      conversionStatus: parsed.conversionStatus,
      shouldPromptDirectFollowUp: mapping.mapping.conversionFollowUpRecommended && parsed.conversionStatus !== 'DO_NOT_CONTACT',
      followUpOpportunity: parsed.followUpOpportunity,
      reason: mapping.mapping.conversionFollowUpRecommended
        ? 'Taskrabbit local-service customers may become direct recurring ecommerce/listing-image clients when platform rules and consent allow follow-up.'
        : 'This task mapping does not require default direct-retainer follow-up.',
    },
    safety: {
      manualFirst: true,
      noScraping: true,
      noPasswordStorage: true,
      noUnauthorizedMessaging: true,
      noUnnecessaryAddressStorage: true,
      deliveryShouldOccurInsideTaskrabbitWhenRequired: true,
      externalLinkAllowed: parsed.externalLinkAllowed,
    },
  };
}
