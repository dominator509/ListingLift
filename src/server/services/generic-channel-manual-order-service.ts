import { buildGenericSalesChannelDedupeKey, redactGenericSalesChannelContact } from '@/domain/generic-sales-channels';
import { genericManualOrderInputSchema, type GenericManualOrderInput } from '@/schemas/generic-sales-channels';
import { normalizeGenericMarketplaceOrder } from '@/server/services/sales-channel-normalizer';
import { getOtherSalesChannelDefinitionOrThrow } from './generic-sales-channel-catalog-service';

export function createGenericSalesChannelManualOrderPlan(input: GenericManualOrderInput) {
  const parsed = genericManualOrderInputSchema.parse(input);
  const definition = getOtherSalesChannelDefinitionOrThrow(parsed.channelKey);
  const packageKey = parsed.packageKey ?? definition.defaultPackageKey;
  const orderAmountCents = parsed.orderAmountCents ?? parsed.orderAmount ?? 0;
  const dedupeKey = buildGenericSalesChannelDedupeKey({ organizationId: parsed.organizationId, channelKey: definition.key, externalReference: parsed.externalReference });
  const normalized = normalizeGenericMarketplaceOrder(definition.key, {
    externalOrderId: parsed.externalReference,
    buyerName: parsed.buyerName ?? parsed.businessName,
    buyerEmailOrUsername: parsed.buyerEmailOrUsername,
    packageKey,
    packagePurchased: parsed.packagePurchased ?? definition.label,
    orderAmountCents,
    currency: parsed.currency,
    deadline: parsed.deadline,
    revisionAllowance: parsed.revisionAllowance ?? 1,
    sourceUrl: parsed.sourceUrl || undefined,
    paymentStatus: 'PENDING',
    uploadStatus: parsed.uploadStatus,
    fulfillmentStatus: 'NOT_STARTED',
  });

  return {
    mode: parsed.dryRun ? 'DRY_RUN' : 'PERSISTENCE_REQUIRED',
    channel: definition,
    externalOrderDraft: {
      channelKey: definition.key,
      sourceLabel: parsed.sourceLabel ?? definition.label,
      externalReference: parsed.externalReference,
      dedupeKey,
      buyerNameRedacted: redactGenericSalesChannelContact(parsed.buyerName),
      buyerEmailOrUsernameRedacted: redactGenericSalesChannelContact(parsed.buyerEmailOrUsername),
      packageKey,
      orderAmountCents,
      currency: parsed.currency,
      sourceUrl: parsed.sourceUrl || undefined,
      normalized,
    },
    clientDraft: {
      existingClientId: parsed.existingClientId,
      displayName: parsed.businessName ?? parsed.buyerName ?? `${definition.label} lead`,
      buyerEmailOrUsername: parsed.buyerEmailOrUsername,
      source: definition.label,
    },
    jobDraft: {
      title: `${definition.label} — ${parsed.leadTitle}`,
      packageKey,
      imageQuantity: parsed.imageQuantity ?? 25,
      status: parsed.uploadStatus === 'RECEIVED' ? 'UPLOAD_RECEIVED' : 'WAITING_FOR_UPLOAD',
      targetPlatform: definition.label,
      deadline: parsed.deadline,
      sourceChannel: definition.key,
      adminNotes: parsed.notes,
    },
    uploadLinkPlan: definition.createsUploadLink
      ? { shouldCreateUploadToken: true, reason: 'Phase 23 manual sales channel intake requires source files before fulfillment.', fileLimit: parsed.imageQuantity ?? 25 }
      : { shouldCreateUploadToken: false, reason: 'Selected generic channel does not create upload links by default.' },
    workflowEventDraft: {
      workflowStatus: parsed.workflowStatus,
      leadIntent: parsed.leadIntent,
      externalLinkAllowed: parsed.externalLinkAllowed,
      notes: parsed.notes,
    },
    revenueAttribution: {
      sourceChannel: definition.key,
      sourceLabel: definition.label,
      category: definition.category,
      amountCents: orderAmountCents,
      currency: parsed.currency,
      revenueAttributionRequired: definition.revenueAttributionRequired,
    },
    safety: {
      manualOnly: definition.manualOnly,
      noScraping: true,
      noPasswordStorage: true,
      noUnauthorizedMessaging: true,
      externalLinkAllowed: parsed.externalLinkAllowed,
    },
  };
}
