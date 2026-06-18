import { DEFAULT_MARKETPLACE_EXPORT_CHANNELS, type MarketplaceExportChannelKey } from '@/domain/amazon-ebay-woocommerce';

export function listMarketplaceExportMappings() {
  return DEFAULT_MARKETPLACE_EXPORT_CHANNELS.map((mapping) => ({
    ...mapping,
    sellerReviewRequired: true,
    note: 'Seed mapping. Codex must persist organization-scoped mapping rows and audit changes.',
  }));
}

export function getMarketplaceExportMapping(channelKey: MarketplaceExportChannelKey) {
  const mapping = DEFAULT_MARKETPLACE_EXPORT_CHANNELS.find((item) => item.key === channelKey);
  if (!mapping) throw new Error(`Missing marketplace export mapping for ${channelKey}`);
  return mapping;
}

export function createMarketplaceExportMappingDraft(input: {
  channelKey: MarketplaceExportChannelKey;
  packageKey: string;
  defaultPresetKeys?: string[];
  defaultImageRoles?: string[];
  defaultDeliveryMode?: string;
  sellerReviewRequired?: boolean;
}) {
  return {
    ...input,
    sellerReviewRequired: input.sellerReviewRequired ?? true,
    manualFallbackOnly: true,
    active: true,
    auditRequired: true,
  };
}
