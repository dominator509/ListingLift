import { buildEtsyDedupeKey, redactEtsyBuyer } from '@/domain/etsy';
import { etsyManualOrderInputSchema, type EtsyManualOrderInput } from '@/schemas/etsy';
import { normalizeGenericMarketplaceOrder } from '@/server/services/sales-channel-normalizer';
import { getEtsyListingPackOrDefault } from './etsy-package-mapping-service';

export function createEtsyManualOrderPlan(input: EtsyManualOrderInput) {
  const parsed = etsyManualOrderInputSchema.parse(input);
  const pack = getEtsyListingPackOrDefault(parsed.etsyPackKey);
  const packageKey = parsed.packageKey ?? pack.packageKey;
  const orderAmountCents = parsed.orderAmountCents ?? parsed.orderAmount ?? 0;
  const imageQuantity = parsed.imageQuantity ?? Math.min(pack.imageAllowance, Math.max(parsed.listingIds.length * 5, 10));
  const dedupeKey = buildEtsyDedupeKey({ organizationId: parsed.organizationId, orderId: parsed.orderId, shopId: parsed.shopId });
  const normalized = normalizeGenericMarketplaceOrder('Etsy', {
    externalOrderId: parsed.orderId,
    buyerName: parsed.buyerName ?? parsed.buyerUsername ?? parsed.shopName,
    buyerEmailOrUsername: parsed.buyerEmail ?? parsed.buyerUsername,
    packageKey,
    packagePurchased: parsed.packagePurchased ?? pack.title,
    orderAmountCents,
    currency: parsed.currency,
    deadline: parsed.deadline,
    revisionAllowance: parsed.revisionAllowance ?? pack.revisionAllowance,
    sourceUrl: parsed.sourceUrl || undefined,
    paymentStatus: 'PENDING',
    uploadStatus: parsed.uploadStatus,
    fulfillmentStatus: 'NOT_STARTED',
  });

  return {
    mode: parsed.dryRun ? 'DRY_RUN' : 'PERSISTENCE_REQUIRED',
    sourceMode: parsed.sourceMode,
    channelKey: 'Etsy',
    etsyPack: pack,
    externalOrderDraft: {
      channelKey: 'Etsy',
      externalOrderId: parsed.orderId,
      shopId: parsed.shopId,
      shopName: parsed.shopName,
      dedupeKey,
      buyerNameRedacted: redactEtsyBuyer(parsed.buyerName),
      buyerEmailOrUsernameRedacted: redactEtsyBuyer(parsed.buyerEmail ?? parsed.buyerUsername),
      listingIds: parsed.listingIds,
      listingTitles: parsed.listingTitles,
      packageKey,
      orderAmountCents,
      currency: parsed.currency,
      normalized,
    },
    clientDraft: {
      existingClientId: parsed.existingClientId,
      displayName: parsed.shopName ?? parsed.buyerName ?? parsed.buyerUsername ?? 'Etsy seller',
      buyerEmailOrUsername: parsed.buyerEmail ?? parsed.buyerUsername,
      source: 'Etsy',
      shopId: parsed.shopId,
      shopName: parsed.shopName,
    },
    jobDraft: {
      title: `Etsy order ${parsed.orderId} — ${parsed.shopName ?? parsed.buyerName ?? 'seller'}`,
      packageKey,
      imageQuantity,
      targetPlatform: 'Etsy',
      selectedPresetKeys: ['EtsyListingSquare', 'WebsiteProductGallery', 'PinterestPin'],
      status: parsed.uploadStatus === 'RECEIVED' ? 'UPLOAD_RECEIVED' : 'WAITING_FOR_UPLOAD',
      deadline: parsed.deadline,
      sourceChannel: 'Etsy',
      adminNotes: parsed.notes,
      clientIntakeNotes: `Etsy use cases: ${parsed.useCases.join(', ')}`,
    },
    uploadLinkPlan: {
      shouldCreateUploadToken: true,
      reason: 'Etsy workflow requires raw product photos or listing image exports before fulfillment.',
      fileLimit: imageQuantity,
    },
    workflowEventDraft: {
      workflowStatus: parsed.uploadStatus === 'RECEIVED' ? 'FILES_RECEIVED' : 'ORDER_CAPTURED',
      deliveryMode: parsed.deliveryMode,
      revisionStatus: 'NONE',
      useCases: parsed.useCases,
      sourceMode: parsed.sourceMode,
      externalLinkAllowed: parsed.externalLinkAllowed,
    },
    revenueAttribution: {
      sourceChannel: 'Etsy',
      sourceLabel: parsed.shopName ? `Etsy — ${parsed.shopName}` : 'Etsy',
      amountCents: orderAmountCents,
      currency: parsed.currency,
      listingCount: parsed.listingIds.length,
    },
    safety: {
      noScraping: true,
      noPasswordStorage: true,
      noUnauthorizedBuyerMessaging: true,
      sellerReviewRequired: true,
      externalLinkAllowed: parsed.externalLinkAllowed,
    },
  };
}
