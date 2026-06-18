import { type MarketplaceExportChannelKey } from '@/domain/amazon-ebay-woocommerce';

export function createMarketplaceRevenueAttribution(input: {
  channelKey: MarketplaceExportChannelKey;
  externalReference?: string;
  orderAmountCents?: number;
  currency?: string;
  packageKey?: string;
  storeName?: string;
}) {
  return {
    sourceChannel: input.channelKey,
    externalReference: input.externalReference,
    orderAmountCents: input.orderAmountCents ?? 0,
    currency: input.currency ?? 'USD',
    packageKey: input.packageKey,
    storeName: input.storeName,
    attributionRequired: true,
    auditRequired: true,
  };
}
