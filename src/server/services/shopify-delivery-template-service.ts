import { buildShopifyDeliveryMessage, buildShopifyProductPageAudit } from '@/domain/shopify';
import { shopifyDeliveryTemplateInputSchema, shopifyProductAuditInputSchema, type ShopifyDeliveryTemplateInput, type ShopifyProductAuditInput } from '@/schemas/shopify';

export function createShopifyDeliveryTemplate(input: ShopifyDeliveryTemplateInput) {
  const parsed = shopifyDeliveryTemplateInputSchema.parse(input);
  return {
    channelKey: 'Shopify',
    subject: 'Your Shopify product image pack is ready for review',
    body: buildShopifyDeliveryMessage(parsed),
    manualOperatorCopyOnly: true,
    externalLinkAllowed: parsed.externalLinkAllowed,
    safeCopyRequired: true,
  };
}

export function createShopifyProductPageAudit(input: ShopifyProductAuditInput) {
  const parsed = shopifyProductAuditInputSchema.parse(input);
  return buildShopifyProductPageAudit(parsed);
}
