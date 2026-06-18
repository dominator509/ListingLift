import { buildMarketplaceDeliveryMessage } from '@/domain/delivery-notifications';
import { marketplaceDeliveryMessageSchema, type MarketplaceDeliveryMessageInput } from '@/schemas/delivery-notification';

export function buildMarketplaceMessagePreview(input: MarketplaceDeliveryMessageInput) {
  const data = marketplaceDeliveryMessageSchema.parse(input);
  const message = buildMarketplaceDeliveryMessage(data);
  return {
    templateKey: data.templateKey,
    message,
    copyable: true,
    warning: 'Use this message only where the marketplace/order workflow allows external links. Deliver inside the platform when required.',
    compliance: 'Do not automate private marketplace messaging or scrape marketplace pages. Keep platform source attribution for revenue tracking.',
  };
}
