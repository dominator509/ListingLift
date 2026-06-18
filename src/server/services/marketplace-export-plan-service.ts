import { buildSkuFolderName, sellerReviewDisclaimer } from '@/domain/amazon-ebay-woocommerce';
import { type MarketplaceExportPlanInput } from '@/schemas/amazon-ebay-woocommerce';

export function createMarketplaceExportPlan(input: MarketplaceExportPlanInput) {
  const productNames = input.productNames.length ? input.productNames : ['Product'];
  const roles = input.imageRoles.length ? input.imageRoles : defaultRolesForChannel(input.channelKey);
  const presetKeys = input.presetKeys.length ? input.presetKeys : defaultPresetsForChannel(input.channelKey);
  const files = productNames.flatMap((productName, productIndex) => {
    const sku = input.sku || `SKU-${String(productIndex + 1).padStart(3, '0')}`;
    const root = buildSkuFolderName({ channelKey: input.channelKey, sku, productName });
    return roles.map((role, roleIndex) => ({
      sourceProduct: productName,
      sku,
      role,
      presetKey: presetKeys[roleIndex % presetKeys.length],
      folder: `${root}/${folderForRole(role)}`,
      fileName: `${safeName(sku)}_${safeName(productName)}_${role.toLowerCase()}_${String(roleIndex + 1).padStart(2, '0')}.jpg`,
      sellerReviewRequired: true,
      status: 'planned',
    }));
  });
  return {
    channelKey: input.channelKey,
    rootFolder: rootFolderForChannel(input.channelKey),
    includeCsvManifest: input.includeCsvManifest,
    includeReadme: input.includeReadme,
    files,
    readmeCopy: sellerReviewDisclaimer(input.channelKey),
    csvColumns: ['sourceProduct', 'sku', 'role', 'presetKey', 'folder', 'fileName', 'sellerReviewRequired', 'status'],
    warnings: [
      'Seller review required before publishing.',
      'This is a draft export plan; Codex must build it from approved ProcessedFile rows only.',
    ],
  };
}

export function defaultRolesForChannel(channelKey: string) {
  if (channelKey === 'amazon_manual') return ['AMAZON_MAIN_IMAGE_DRAFT', 'AMAZON_SECONDARY_IMAGE_DRAFT', 'WHITE_BACKGROUND_JPG', 'TRANSPARENT_CUTOUT'];
  if (channelKey === 'ebay_manual') return ['EBAY_LISTING_SQUARE', 'EBAY_MULTI_ANGLE', 'WHITE_BACKGROUND_JPG'];
  return ['WOOCOMMERCE_PRODUCT_GALLERY', 'WOOCOMMERCE_THUMBNAIL', 'WHITE_BACKGROUND_JPG'];
}

export function defaultPresetsForChannel(channelKey: string) {
  if (channelKey === 'amazon_manual') return ['AmazonMainImageDraft', 'AmazonSecondaryImageDraft'];
  if (channelKey === 'ebay_manual') return ['EbayListingSquare'];
  return ['WebsiteProductGallery'];
}

function rootFolderForChannel(channelKey: string) {
  if (channelKey === 'amazon_manual') return 'Amazon';
  if (channelKey === 'ebay_manual') return 'eBay';
  return 'WooCommerce';
}

function folderForRole(role: string) {
  if (role.includes('MAIN')) return 'main-image-drafts';
  if (role.includes('SECONDARY') || role.includes('MULTI')) return 'secondary-images';
  if (role.includes('THUMBNAIL')) return 'thumbnails';
  if (role.includes('TRANSPARENT')) return 'transparent-png';
  return 'product-gallery';
}

function safeName(value: string) {
  return value.trim().replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'file';
}
