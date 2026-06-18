import { buildExternalOrderDedupeKey } from '@/domain/sales-channel-normalization';
import type { ClientMatchDraft, NormalizedExternalOrder, NormalizedJobDraft, RevenueAttributionDraft } from '@/schemas/sales-channel';

export function buildJobTitleFromExternalOrder(order: NormalizedExternalOrder) {
  const buyer = order.buyerName ?? order.buyerEmailOrUsername ?? 'Imported buyer';
  return `${order.packageKey ?? order.packagePurchased} for ${buyer}`;
}

export function initialJobStatusForOrder(order: NormalizedExternalOrder): NormalizedJobDraft['status'] {
  // Phase 7 job creation stops before upload handling; the upload phase advances this later.
  return 'WAITING_FOR_UPLOAD';
}

export function buildNormalizedJobDraft(input: {
  organizationId: string;
  order: NormalizedExternalOrder;
  clientMatch: ClientMatchDraft;
  revenueAttribution: RevenueAttributionDraft;
}): NormalizedJobDraft {
  const clientId = input.clientMatch.existingClientId ?? input.order.internalClientId;
  return {
    organizationId: input.organizationId,
    clientId,
    salesChannelKey: input.order.channelName,
    externalOrderDedupeKey: buildExternalOrderDedupeKey({ organizationId: input.organizationId, channelName: input.order.channelName, externalOrderId: input.order.externalOrderId }),
    packageKey: input.order.packageKey,
    title: buildJobTitleFromExternalOrder(input.order),
    status: initialJobStatusForOrder(input.order),
    paymentStatus: input.order.paymentStatus,
    uploadStatus: input.order.uploadStatus === 'COMPLETE' ? 'COMPLETE' : 'NOT_STARTED',
    fulfillmentStatus: input.order.fulfillmentStatus,
    deadline: input.order.deadline,
    revisionAllowance: input.order.revisionAllowance,
    sourceUrl: input.order.sourceUrl,
    revenueAttribution: input.revenueAttribution,
  };
}
