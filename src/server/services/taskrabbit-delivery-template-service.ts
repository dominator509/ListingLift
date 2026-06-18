import { buildTaskrabbitDeliveryMessage } from '@/domain/taskrabbit';
import { taskrabbitDeliveryMessageInputSchema, type TaskrabbitDeliveryMessageInput } from '@/schemas/taskrabbit';

export function createTaskrabbitDeliveryMessage(input: TaskrabbitDeliveryMessageInput) {
  const parsed = taskrabbitDeliveryMessageInputSchema.parse(input);
  return {
    deliveryMessage: buildTaskrabbitDeliveryMessage(parsed),
    externalLinkAllowed: parsed.externalLinkAllowed,
    warning: parsed.includeExternalLink && !parsed.externalLinkAllowed
      ? 'External delivery link was requested but is not allowed for this task context.'
      : undefined,
    compliance: {
      platformReadyDraftOnly: true,
      noMarketplaceApprovalGuarantee: true,
      noSalesPerformanceGuarantee: true,
      keepTaskHistoryClear: true,
    },
  };
}
