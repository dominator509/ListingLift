import { describe, expect, it } from 'vitest';
import { createMarketplaceExportPlan } from '@/server/services/marketplace-export-plan-service';

describe('marketplace export plan service', () => {
  it('creates Amazon seller-review export plans by SKU', () => {
    const plan = createMarketplaceExportPlan({ channelKey: 'amazon_manual', sku: 'ABC-123', productNames: ['Bottle'], presetKeys: [], imageRoles: [], includeCsvManifest: true, includeReadme: true });
    expect(plan.rootFolder).toBe('Amazon');
    expect(plan.files.some((file) => file.role === 'AMAZON_MAIN_IMAGE_DRAFT')).toBe(true);
    expect(plan.readmeCopy).toContain('not a guarantee');
  });

  it('creates WooCommerce product-gallery scaffold output', () => {
    const plan = createMarketplaceExportPlan({ channelKey: 'woocommerce_manual', productNames: ['Hat'], presetKeys: [], imageRoles: [], includeCsvManifest: true, includeReadme: true });
    expect(plan.rootFolder).toBe('WooCommerce');
    expect(plan.files.some((file) => file.role === 'WOOCOMMERCE_PRODUCT_GALLERY')).toBe(true);
  });
});
