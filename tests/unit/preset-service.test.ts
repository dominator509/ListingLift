import { describe, expect, it } from 'vitest';
import { buildPresetPlan, buildPresetSelector, listDefaultPresets, presetsForPlatforms, validatePresetCatalogForAdmin } from '@/server/services/preset-service';

const requiredPresetKeys = [
  'AmazonMainImageDraft',
  'AmazonSecondaryImageDraft',
  'EtsyListingSquare',
  'EbayListingSquare',
  'ShopifyProductImage',
  'TikTokShopVertical',
  'InstagramSquare',
  'InstagramStoryReelVertical',
  'FacebookMarketplaceSquare',
  'PinterestPin',
  'WebsiteProductGallery',
  'GumroadProductOfferImage',
  'RestaurantMenuItemImage',
  'RealEstateListingCleanup',
  'CustomClientPreset',
];

describe('preset service', () => {
  it('contains every required roadmap preset key', () => {
    const presets = listDefaultPresets();
    expect(requiredPresetKeys.every((key) => presets.some((preset) => preset.key === key))).toBe(true);
  });

  it('returns selected platform presets by platform name, key, or channel tag', () => {
    expect(presetsForPlatforms(['Amazon']).some((preset) => preset.platform === 'Amazon')).toBe(true);
    expect(presetsForPlatforms(['TikTokShop']).some((preset) => preset.key === 'TikTokShopVertical')).toBe(true);
  });

  it('validates preset catalog safety and folder constraints', () => {
    const result = validatePresetCatalogForAdmin();
    expect(result.valid).toBe(true);
    expect(result.coverage.missing).toHaveLength(0);
  });

  it('builds deterministic output plans from preset naming and folders', () => {
    const plan = buildPresetPlan({ presetKey: 'AmazonMainImageDraft', clientName: 'Demo Client', jobId: 'job_123', sku: 'SKU 123', index: 1 });
    expect(plan.relativePath).toContain('Amazon/white-background/');
    expect(plan.fileName).toMatch(/sku-123_amazon_main_01\.jpg/i);
    expect(plan.safeLanguage).toMatch(/seller-review/i);
  });

  it('resolves operator preset selections without duplicating selected keys', () => {
    const selection = buildPresetSelector({ targetPlatforms: ['Instagram'], selectedPresetKeys: ['InstagramSquare'], includeSocialCommerce: true });
    const keys = selection.selectedPresets.map((preset) => preset.key);
    expect(keys).toContain('InstagramSquare');
    expect(new Set(keys).size).toBe(keys.length);
  });
});
