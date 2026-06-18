export function buildAdvancedImageQualityReport(input: {
  jobId: string;
  imageCount: number;
  flaggedCount?: number;
  failedCount?: number;
  approvedCount?: number;
  targetPlatforms?: string[];
}) {
  const flaggedCount = input.flaggedCount ?? 0;
  const failedCount = input.failedCount ?? 0;
  const approvedCount = input.approvedCount ?? 0;
  const warnings = [];
  if (flaggedCount > 0) warnings.push(`${flaggedCount} outputs need manual review before delivery.`);
  if (failedCount > 0) warnings.push(`${failedCount} outputs failed and require reprocessing or manual replacement.`);
  if (approvedCount < input.imageCount) warnings.push('Not all outputs are approved. Delivery must remain gated.');

  return {
    jobId: input.jobId,
    imageCount: input.imageCount,
    approvedCount,
    flaggedCount,
    failedCount,
    targetPlatforms: input.targetPlatforms ?? [],
    warnings,
    recommendations: [
      'Review all advanced variants against current marketplace/platform guidelines before publishing.',
      'Use hero and social variations as seller-review drafts, not guaranteed performance assets.',
      'Keep original uploads archived and separate from edited outputs.',
    ],
    safeClaim: 'This report provides image quality observations and seller-review recommendations. It is not a guarantee of marketplace approval, ranking, sales, conversion, ad performance, or product approval.',
  };
}
