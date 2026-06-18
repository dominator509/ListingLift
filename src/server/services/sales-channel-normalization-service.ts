import { adapterKeyForSalesChannel, safeMarketplaceAutomationNote } from '@/domain/sales-channel-normalization';
import { salesChannelNormalizationRequestSchema, type NormalizedExternalOrder, type SalesChannelNormalizationRequest } from '@/schemas/sales-channel';
import { getSalesChannelAdapter, listSalesChannelRegistry } from '@/server/adapters/sales-channel/registry';
import { buildClientMatchDraft, type ExistingClientCandidate } from './order-client-matching-service';
import { buildExternalOrderPersistedDraft, assertExternalOrderIsNotDuplicate } from './external-order-service';
import { buildNormalizedJobDraft } from './order-job-factory-service';
import { buildRevenueAttributionDraft, summarizeRevenueAttribution } from './revenue-attribution-service';
import { buildUploadLinkTriggerPlan } from './sales-channel-upload-trigger-service';

export type SalesChannelNormalizationPlan = {
  normalizedOrder: NormalizedExternalOrder;
  externalOrderDraft: ReturnType<typeof buildExternalOrderPersistedDraft>;
  clientMatch: ReturnType<typeof buildClientMatchDraft>;
  jobDraft: ReturnType<typeof buildNormalizedJobDraft>;
  revenueAttribution: ReturnType<typeof buildRevenueAttributionDraft>;
  revenueSummary: ReturnType<typeof summarizeRevenueAttribution>;
  uploadTriggerPlan: ReturnType<typeof buildUploadLinkTriggerPlan>;
  marketplaceSafetyNote: string;
  adapterKey: string;
  duplicateCheckKey: string;
};

export async function normalizeSalesChannelOrder(request: SalesChannelNormalizationRequest) {
  const parsed = salesChannelNormalizationRequestSchema.parse(request);
  const adapter = getSalesChannelAdapter(parsed.channelKey);
  return adapter.normalize(parsed.payload);
}

export async function buildSalesChannelNormalizationPlan(input: {
  request: SalesChannelNormalizationRequest;
  organizationId: string;
  existingExternalOrderDedupeKeys?: string[];
  clientCandidates?: ExistingClientCandidate[];
}): Promise<SalesChannelNormalizationPlan> {
  const request = salesChannelNormalizationRequestSchema.parse({ ...input.request, organizationId: input.organizationId });
  const normalizedOrder = await normalizeSalesChannelOrder(request);
  const duplicateCheckKey = assertExternalOrderIsNotDuplicate(input.existingExternalOrderDedupeKeys ?? [], normalizedOrder, input.organizationId);
  const clientMatch = buildClientMatchDraft(normalizedOrder, input.organizationId, input.clientCandidates ?? []);
  const externalOrderDraft = buildExternalOrderPersistedDraft({ organizationId: input.organizationId, order: normalizedOrder, clientId: clientMatch.existingClientId });
  const revenueAttribution = buildRevenueAttributionDraft(normalizedOrder, request.mode);
  const jobDraft = buildNormalizedJobDraft({ organizationId: input.organizationId, order: normalizedOrder, clientMatch, revenueAttribution });
  const uploadTriggerPlan = buildUploadLinkTriggerPlan(normalizedOrder);

  return {
    normalizedOrder,
    externalOrderDraft,
    clientMatch,
    jobDraft,
    revenueAttribution,
    revenueSummary: summarizeRevenueAttribution(revenueAttribution),
    uploadTriggerPlan,
    marketplaceSafetyNote: safeMarketplaceAutomationNote(normalizedOrder.channelName),
    adapterKey: adapterKeyForSalesChannel(normalizedOrder.channelName),
    duplicateCheckKey,
  };
}

export function buildSalesChannelRegistrySummary() {
  const registry = listSalesChannelRegistry();
  return {
    adapters: registry,
    count: registry.length,
    safetyRule: 'Use official APIs/webhooks where available; otherwise use manual import. Do not scrape private marketplace pages.',
  };
}
