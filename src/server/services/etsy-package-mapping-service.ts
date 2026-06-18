import { DEFAULT_ETSY_LISTING_PACKS } from '@/domain/etsy';

export function listEtsyListingPacks() {
  return DEFAULT_ETSY_LISTING_PACKS;
}

export function getEtsyListingPackOrDefault(key?: string) {
  if (!key) return DEFAULT_ETSY_LISTING_PACKS[1];
  return DEFAULT_ETSY_LISTING_PACKS.find((pack) => pack.key === key) ?? DEFAULT_ETSY_LISTING_PACKS[1];
}

export function buildEtsyPackageMappingTable() {
  return DEFAULT_ETSY_LISTING_PACKS.map((pack) => ({
    etsyPackKey: pack.key,
    title: pack.title,
    packageKey: pack.packageKey,
    imageAllowance: pack.imageAllowance,
    revisionAllowance: pack.revisionAllowance,
    includesShopVisualReport: pack.includesShopVisualReport,
    includesListingSequenceRecommendations: pack.includesListingSequenceRecommendations,
    defaultDeliveryMode: pack.defaultDeliveryMode,
    safeDescription: pack.safeDescription,
  }));
}
