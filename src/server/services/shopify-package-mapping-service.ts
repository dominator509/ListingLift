import { DEFAULT_SHOPIFY_IMAGE_PACKS } from '@/domain/shopify';

export function getShopifyImagePackOrDefault(packKey?: string) {
  return DEFAULT_SHOPIFY_IMAGE_PACKS.find((pack) => pack.key === packKey) ?? DEFAULT_SHOPIFY_IMAGE_PACKS[0];
}

export function buildShopifyPackageMappingTable() {
  return DEFAULT_SHOPIFY_IMAGE_PACKS.map((pack) => ({
    shopifyPackKey: pack.key,
    title: pack.title,
    packageKey: pack.packageKey,
    imageAllowance: pack.imageAllowance,
    revisionAllowance: pack.revisionAllowance,
    defaultPresetKeys: pack.defaultPresetKeys,
    defaultDeliveryMode: pack.defaultDeliveryMode,
    supportsCsvImport: pack.supportsCsvImport,
    supportsOauthScaffold: pack.supportsOauthScaffold,
    includesStorefrontAudit: pack.includesStorefrontAudit,
    includesReplacementApproval: pack.includesReplacementApproval,
    safeDescription: pack.safeDescription,
  }));
}
