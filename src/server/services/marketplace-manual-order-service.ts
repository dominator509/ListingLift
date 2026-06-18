import { createMarketplaceExportDedupeKey, redactMarketplaceBuyer, type MarketplaceExportChannelKey } from '@/domain/amazon-ebay-woocommerce';
import { getMarketplaceExportMapping } from './marketplace-export-mapping-service';
import { type MarketplaceManualOrderInput } from '@/schemas/amazon-ebay-woocommerce';

export type MarketplaceManualOrderPlan = {
  channelKey: MarketplaceExportChannelKey;
  channelLabel: string;
  dedupeKey: string;
  clientDraft: Record<string, unknown>;
  externalOrderDraft: Record<string, unknown>;
  jobDraft: Record<string, unknown>;
  uploadTokenPlan: Record<string, unknown>;
  workflowEventDraft: Record<string, unknown>;
  auditEvents: string[];
  warnings: string[];
};

export function createMarketplaceManualOrderPlan(input: MarketplaceManualOrderInput): MarketplaceManualOrderPlan {
  const mapping = getMarketplaceExportMapping(input.channelKey);
  const dedupeKey = createMarketplaceExportDedupeKey({
    organizationId: input.organizationId,
    channelKey: input.channelKey,
    storeName: input.storeName,
    externalReference: input.externalReference,
    sku: input.sku,
  });
  const buyerRedacted = redactMarketplaceBuyer(input.buyerEmailOrUsername || input.buyerName);
  const packageKey = input.packageKey || mapping.packageKey;
  const presetKeys = input.presetKeys.length ? input.presetKeys : mapping.defaultPresetKeys;
  const imageRoles = input.imageRoles.length ? input.imageRoles : mapping.defaultImageRoles;
  return {
    channelKey: input.channelKey,
    channelLabel: getSafeChannelLabel(input.channelKey),
    dedupeKey,
    clientDraft: {
      existingClientId: input.existingClientId,
      storeName: input.storeName,
      sellerName: input.sellerName,
      buyerRedacted,
      source: input.channelKey,
      minimalDataOnly: true,
    },
    externalOrderDraft: {
      channelName: getSafeChannelLabel(input.channelKey),
      externalOrderId: input.externalReference || dedupeKey,
      packagePurchased: packageKey,
      orderAmountCents: input.orderAmountCents,
      currency: input.currency,
      sourceUrl: input.sourceUrl || undefined,
      paymentStatus: 'manual_review_required',
      fulfillmentStatus: 'waiting_for_upload',
      normalizedPayload: {
        sku: input.sku,
        storeName: input.storeName,
        productNames: input.productNames,
        sellerReviewRequired: true,
      },
      dedupeKey,
    },
    jobDraft: {
      packageKey,
      status: 'WAITING_FOR_UPLOAD',
      targetPlatform: getSafeChannelLabel(input.channelKey),
      selectedPresetKeys: presetKeys,
      imageRoles,
      productNames: input.productNames,
      imageQuantity: input.imageQuantity,
      deadline: input.deadline,
      sellerReviewRequired: true,
      notes: input.notes,
    },
    uploadTokenPlan: {
      createUploadToken: true,
      tokenScope: 'job_upload',
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/zip'],
      uploadInstructions: `${getSafeChannelLabel(input.channelKey)} manual/export workflow upload link.`,
    },
    workflowEventDraft: {
      eventType: 'MANUAL_ORDER_CREATED',
      workflowStatus: 'SOURCE_CAPTURED',
      deliveryMode: input.deliveryMode,
      revisionStatus: input.revisionStatus,
      sellerReviewRequired: true,
      payload: { sku: input.sku, storeName: input.storeName, externalReference: input.externalReference },
    },
    auditEvents: ['marketplace_manual_order_planned', 'external_order_dedupe_required', 'job_creation_required', 'upload_token_required'],
    warnings: [
      'Codex must perform all writes transactionally with tenant scope and RBAC.',
      'Do not grant marketplace compliance, sales, ranking, conversion, or listing approval guarantees.',
      'Do not expose final delivery before approval and unresolved QC/revisions are cleared.',
    ],
  };
}

export function getSafeChannelLabel(channelKey: MarketplaceExportChannelKey) {
  if (channelKey === 'amazon_manual') return 'Amazon Seller Manual / Export';
  if (channelKey === 'ebay_manual') return 'eBay Manual / Export';
  return 'WooCommerce Manual / CSV Scaffold';
}
