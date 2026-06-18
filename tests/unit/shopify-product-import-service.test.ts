import { describe, expect, it } from 'vitest';
import { createShopifyProductCsvImportPlan } from '@/server/services/shopify-product-import-service';

describe('createShopifyProductCsvImportPlan', () => {
  it('plans ZIP-safe product/SKU folders from Shopify CSV rows', () => {
    const plan = createShopifyProductCsvImportPlan({
      storeDomain: 'demo-store.myshopify.com',
      productRows: [{ title: 'Demo Mug', sku: 'mug 001', imageCount: 3 }],
      importMode: 'MANUAL_CSV',
      dryRun: true,
    });
    expect(plan.rows[0].folderPath).toBe('Shopify/product-gallery/MUG-001');
    expect(plan.rows[0].recommendedPresetKeys).toContain('ShopifyProductImage');
  });
});
