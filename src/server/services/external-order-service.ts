import { buildExternalOrderDedupeKey } from '@/domain/sales-channel-normalization';
import {
  externalOrderPersistedDraftSchema,
  normalizedExternalOrderSchema,
  type ExternalOrderPersistedDraft,
  type NormalizedExternalOrder,
} from '@/schemas/sales-channel';

export function normalizeAndValidateExternalOrder(input: NormalizedExternalOrder) {
  return normalizedExternalOrderSchema.parse(input);
}

export function externalOrderDedupeKey(order: Pick<NormalizedExternalOrder, 'channelName' | 'externalOrderId'>, organizationId?: string) {
  return buildExternalOrderDedupeKey({ organizationId, channelName: order.channelName, externalOrderId: order.externalOrderId });
}

export function buildExternalOrderPersistedDraft(input: { organizationId: string; order: NormalizedExternalOrder; clientId?: string }): ExternalOrderPersistedDraft {
  const order = normalizeAndValidateExternalOrder(input.order);
  return externalOrderPersistedDraftSchema.parse({
    organizationId: input.organizationId,
    salesChannelKey: order.channelName,
    dedupeKey: externalOrderDedupeKey(order, input.organizationId),
    externalOrderId: order.externalOrderId,
    externalCustomerId: order.externalCustomerId,
    clientId: input.clientId ?? order.internalClientId,
    packageKey: order.packageKey,
    buyerName: order.buyerName,
    buyerEmailOrUsername: order.buyerEmailOrUsername,
    orderAmountCents: order.orderAmountCents,
    currency: order.currency,
    deadline: order.deadline,
    revisionAllowance: order.revisionAllowance,
    sourceUrl: order.sourceUrl,
    paymentStatus: order.paymentStatus,
    uploadStatus: order.uploadStatus,
    fulfillmentStatus: order.fulfillmentStatus,
    normalizedPayload: order,
  });
}

export function assertExternalOrderIsNotDuplicate(existingDedupeKeys: Iterable<string>, order: NormalizedExternalOrder, organizationId?: string) {
  const key = externalOrderDedupeKey(order, organizationId);
  const existing = new Set(Array.from(existingDedupeKeys).map((item) => item.toLowerCase()));
  if (existing.has(key)) {
    throw new Error(`Duplicate external order prevented: ${key}`);
  }
  return key;
}

export function buildExternalOrderLifecycleSummary(order: NormalizedExternalOrder) {
  return {
    paymentStatus: order.paymentStatus,
    uploadStatus: order.uploadStatus,
    fulfillmentStatus: order.fulfillmentStatus,
    shouldTriggerUploadLink: order.uploadStatus === 'NOT_STARTED' && ['PAID', 'MANUAL_CONFIRMED'].includes(order.paymentStatus),
    shouldEnterAdminQueue: ['PAID', 'MANUAL_CONFIRMED', 'PENDING'].includes(order.paymentStatus),
  };
}
