import { buildShopifyDedupeKey, normalizeShopifyStoreDomain, normalizeShopifySku, redactShopifyMerchant } from '@/domain/shopify';
import { shopifyManualOrderInputSchema, type ShopifyManualOrderInput } from '@/schemas/shopify';
import { normalizeGenericMarketplaceOrder } from '@/server/services/sales-channel-normalizer';
import { getShopifyImagePackOrDefault } from './shopify-package-mapping-service';

export function createShopifyManualOrderPlan(input: ShopifyManualOrderInput) {
  const parsed = shopifyManualOrderInputSchema.parse(input);
  const pack = getShopifyImagePackOrDefault(parsed.shopifyPackKey);
  const packageKey = parsed.packageKey ?? pack.packageKey;
  const orderAmountCents = parsed.orderAmountCents ?? parsed.orderAmount ?? 0;
  const primaryProductId = parsed.productIds[0];
  const primarySku = parsed.skus[0];
  const imageQuantity = parsed.imageQuantity ?? Math.min(pack.imageAllowance, Math.max((parsed.productIds.length || parsed.skus.length || 1) * 5, 10));
  const storeDomain = normalizeShopifyStoreDomain(parsed.storeDomain);
  const dedupeKey = buildShopifyDedupeKey({ organizationId: parsed.organizationId, storeDomain, productId: primaryProductId, sku: primarySku, externalOrderId: parsed.sourceUrl || undefined });
  const normalized = normalizeGenericMarketplaceOrder('Shopify', {
    externalOrderId: dedupeKey,
    buyerName: parsed.merchantName ?? parsed.storeName ?? storeDomain,
    buyerEmailOrUsername: parsed.merchantEmail ?? storeDomain,
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
    channelKey: 'Shopify',
    shopifyPack: pack,
    externalOrderDraft: {
      channelKey: 'Shopify',
      externalOrderId: dedupeKey,
      storeDomain,
      storeName: parsed.storeName,
      dedupeKey,
      merchantNameRedacted: redactShopifyMerchant(parsed.merchantName),
      merchantEmailRedacted: redactShopifyMerchant(parsed.merchantEmail),
      productIds: parsed.productIds,
      skus: parsed.skus.map((sku) => normalizeShopifySku(sku) ?? sku),
      productTitles: parsed.productTitles,
      packageKey,
      orderAmountCents,
      currency: parsed.currency,
      normalized,
    },
    clientDraft: {
      existingClientId: parsed.existingClientId,
      displayName: parsed.storeName ?? parsed.merchantName ?? storeDomain,
      buyerEmailOrUsername: parsed.merchantEmail ?? storeDomain,
      source: 'Shopify',
      storeDomain,
      storeName: parsed.storeName,
    },
    jobDraft: {
      title: `Shopify image pack — ${parsed.storeName ?? storeDomain}`,
      packageKey,
      imageQuantity,
      targetPlatform: 'Shopify',
      selectedPresetKeys: pack.defaultPresetKeys,
      status: parsed.uploadStatus === 'RECEIVED' ? 'UPLOAD_RECEIVED' : 'WAITING_FOR_UPLOAD',
      deadline: parsed.deadline,
      sourceChannel: 'Shopify',
      adminNotes: parsed.notes,
      clientIntakeNotes: `Shopify products: ${(parsed.productTitles.length ? parsed.productTitles : parsed.skus).join(', ') || 'manual product batch'}`,
    },
    uploadLinkPlan: {
      shouldCreateUploadToken: true,
      reason: 'Shopify workflow requires raw product photos, product/SKU CSV exports, or current storefront images before fulfillment.',
      fileLimit: imageQuantity,
    },
    workflowEventDraft: {
      workflowStatus: parsed.uploadStatus === 'RECEIVED' ? 'FILES_RECEIVED' : 'STORE_CAPTURED',
      deliveryMode: parsed.deliveryMode,
      replacementApprovalStatus: parsed.replacementApprovalStatus,
      sourceMode: parsed.sourceMode,
      externalLinkAllowed: parsed.externalLinkAllowed,
    },
    revenueAttribution: {
      sourceChannel: 'Shopify',
      sourceLabel: parsed.storeName ? `Shopify — ${parsed.storeName}` : `Shopify — ${storeDomain}`,
      amountCents: orderAmountCents,
      currency: parsed.currency,
      productCount: Math.max(parsed.productIds.length, parsed.skus.length, parsed.productTitles.length),
    },
    safety: {
      noScraping: true,
      noPasswordStorage: true,
      noAutoReplacementWithoutApproval: true,
      merchantReviewRequired: true,
      externalLinkAllowed: parsed.externalLinkAllowed,
    },
  };
}
