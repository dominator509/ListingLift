export function buildBrandBackgroundVariants(input: { brandColors: string[]; imageIds: string[]; defaultColor?: string }) {
  const colors = input.brandColors.length ? input.brandColors : [input.defaultColor ?? '#FFFFFF'];
  return input.imageIds.flatMap((imageId) =>
    colors.map((color, index) => ({
      imageId,
      color,
      variantKey: `brand-background-${index + 1}`,
      outputFolder: 'Advanced/Brand-Backgrounds',
      requiresAdminApproval: true,
      sellerReviewRequired: true,
    })),
  );
}
