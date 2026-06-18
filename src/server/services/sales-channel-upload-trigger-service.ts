import type { NormalizedExternalOrder } from '@/schemas/sales-channel';
import { buildExternalOrderLifecycleSummary } from './external-order-service';

export function buildUploadLinkTriggerPlan(order: NormalizedExternalOrder) {
  const lifecycle = buildExternalOrderLifecycleSummary(order);
  return {
    shouldTriggerUploadLink: lifecycle.shouldTriggerUploadLink,
    uploadStatusAfterTrigger: lifecycle.shouldTriggerUploadLink ? 'TOKEN_SENT' : order.uploadStatus,
    reason: lifecycle.shouldTriggerUploadLink
      ? 'Payment is confirmed and no upload has started. Generate an expiring upload token in Phase 8.'
      : 'Upload trigger deferred because payment is not confirmed or upload already started.',
  };
}
