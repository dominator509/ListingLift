import { sellerReviewDisclaimer } from '@/domain/amazon-ebay-woocommerce';
import { type MarketplaceDeliveryTemplateInput } from '@/schemas/amazon-ebay-woocommerce';

export function createMarketplaceDeliveryTemplate(input: MarketplaceDeliveryTemplateInput) {
  const allowLink = input.includeExternalLink && input.externalLinkAllowed;
  const channelName = input.channelKey === 'amazon_manual' ? 'Amazon Seller' : input.channelKey === 'ebay_manual' ? 'eBay' : 'WooCommerce';
  return {
    subject: `Your ListingLift ${channelName} image pack draft is ready`,
    body: [
      `Hi${input.sellerName ? ` ${input.sellerName}` : ''},`,
      '',
      `Your ${channelName} product image pack draft is ready for seller review.`,
      input.archiveName ? `Archive: ${input.archiveName}` : 'Archive: available in your ListingLift dashboard or approved delivery channel.',
      allowLink ? 'Download link: [insert approved expiring link]' : 'Delivery link omitted. Use the approved platform or dashboard delivery method for this order.',
      '',
      sellerReviewDisclaimer(input.channelKey),
      '',
      'Please review the files, dimensions, naming, and marketplace/store guidelines before publishing.',
    ].join('\n'),
    externalLinkAllowed: allowLink,
    safeCopyRequired: true,
  };
}
