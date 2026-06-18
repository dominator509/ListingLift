import { etsyListingImportInputSchema, type EtsyListingImportInput } from '@/schemas/etsy';

export function createEtsyListingImportPlan(input: EtsyListingImportInput) {
  const parsed = etsyListingImportInputSchema.parse(input);
  const listingCount = parsed.listingRows.length;
  const totalImageEstimate = parsed.listingRows.reduce((sum, row) => sum + (row.imageCount ?? 5), 0);
  return {
    mode: parsed.dryRun ? 'DRY_RUN' : 'PERSISTENCE_REQUIRED',
    importMode: parsed.importMode,
    shopId: parsed.shopId,
    shopName: parsed.shopName,
    listingCount,
    totalImageEstimate,
    rows: parsed.listingRows.map((row) => ({
      ...row,
      recommendedPresetKeys: ['EtsyListingSquare'],
      folderHint: `Etsy/listings/${row.sku ?? row.listingId}`,
      sellerReviewRequired: true,
    })),
    warnings: [
      'CSV/API imports are source attribution aids only until Codex wires persistence.',
      'Do not scrape private Etsy listing/order pages.',
      'Seller review is required before publishing any ListingLift-generated files.',
    ],
  };
}
