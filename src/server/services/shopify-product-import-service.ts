import { buildShopifyProductFolderPath, normalizeShopifyStoreDomain, normalizeShopifySku } from '@/domain/shopify';
import { shopifyProductCsvImportInputSchema, type ShopifyProductCsvImportInput } from '@/schemas/shopify';

export function createShopifyProductCsvImportPlan(input: ShopifyProductCsvImportInput) {
  const parsed = shopifyProductCsvImportInputSchema.parse(input);
  const storeDomain = normalizeShopifyStoreDomain(parsed.storeDomain);
  const rows = parsed.productRows.map((row, index) => {
    const sku = normalizeShopifySku(row.sku);
    return {
      rowNumber: index + 1,
      storeDomain,
      productId: row.productId,
      variantId: row.variantId,
      handle: row.handle,
      title: row.title,
      sku,
      productType: row.productType,
      vendor: row.vendor,
      imageCount: row.imageCount ?? 0,
      sourceUrl: row.sourceUrl || undefined,
      folderPath: buildShopifyProductFolderPath({ sku, productId: row.productId, title: row.title }),
      recommendedPresetKeys: ['ShopifyProductImage', 'WebsiteProductGallery'],
      sellerReviewRequired: true,
    };
  });
  return {
    mode: parsed.dryRun ? 'DRY_RUN' : 'PERSISTENCE_REQUIRED',
    storeDomain,
    storeName: parsed.storeName,
    importMode: parsed.importMode,
    productCount: rows.length,
    rows,
    notes: [
      'Manual CSV import is the default baseline.',
      'Codex must persist product rows with tenant scope and never scrape private Shopify admin pages.',
      'ZIP delivery should group files by product/SKU folder path.',
    ],
  };
}
