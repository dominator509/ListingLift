import { shopifyReplacementApprovalInputSchema, type ShopifyReplacementApprovalInput } from '@/schemas/shopify';
import { buildShopifyDedupeKey, normalizeShopifyStoreDomain } from '@/domain/shopify';

export function createShopifyImageReplacementApprovalPlan(input: ShopifyReplacementApprovalInput) {
  const parsed = shopifyReplacementApprovalInputSchema.parse(input);
  const storeDomain = normalizeShopifyStoreDomain(parsed.storeDomain);
  return {
    mode: parsed.dryRun ? 'DRY_RUN' : 'PERSISTENCE_REQUIRED',
    channelKey: 'Shopify',
    storeDomain,
    dedupeKey: buildShopifyDedupeKey({ storeDomain, productId: parsed.productId, sku: parsed.sku }),
    productId: parsed.productId,
    sku: parsed.sku,
    processedFileIds: parsed.processedFileIds,
    approvalStatus: parsed.approvalStatus,
    merchantNotes: parsed.merchantNotes,
    blocksAutomaticReplacement: parsed.approvalStatus !== 'APPROVED_FOR_MANUAL_UPLOAD' && parsed.approvalStatus !== 'REPLACED_MANUALLY',
    requiresAuditLog: true,
    notes: [
      'Product-level replacement approval must be explicit before any replacement workflow.',
      'Baseline behavior remains manual Shopify admin upload by the merchant/operator.',
      'Codex must never expose unapproved, flagged, failed, rejected, pending, or admin-only files.',
    ],
  };
}
