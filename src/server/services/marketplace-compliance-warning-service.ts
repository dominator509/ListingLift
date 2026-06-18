import { sellerReviewDisclaimer } from '@/domain/amazon-ebay-woocommerce';
import { type MarketplaceComplianceWarningInput } from '@/schemas/amazon-ebay-woocommerce';

export function createMarketplaceComplianceWarnings(input: MarketplaceComplianceWarningInput) {
  const warnings = [sellerReviewDisclaimer(input.channelKey)];
  if (input.channelKey === 'amazon_manual') {
    warnings.push('Amazon main image drafts should be reviewed against current category, product, background, image-quality, and seller-account requirements.');
    warnings.push('Amazon secondary image drafts may need additional review for text, props, overlays, lifestyle context, and category rules.');
  }
  if (input.channelKey === 'ebay_manual') {
    warnings.push('eBay image drafts should be reviewed for listing category, item condition, watermarks, overlays, and multi-angle requirements.');
  }
  if (input.channelKey === 'woocommerce_manual') {
    warnings.push('WooCommerce image drafts should be reviewed against the active theme, product-gallery plugin, compression settings, and store branding.');
  }
  if (input.categoryNotes) warnings.push(`Operator category note: ${input.categoryNotes}`);
  return {
    channelKey: input.channelKey,
    imageRoles: input.imageRoles,
    presetKeys: input.presetKeys,
    sellerReviewRequired: true,
    warnings,
    blockedGuaranteePhrases: ['guaranteed compliant', 'guaranteed approval', 'guaranteed ranking', 'guaranteed sales', 'guaranteed conversion'],
  };
}
