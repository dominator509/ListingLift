export function buildImageSequenceRecommendations(input: { imageIds: string[]; productName?: string; targetPlatforms?: string[] }) {
  const roles = ['main listing draft', 'angle/detail draft', 'scale/context draft', 'transparent cutout draft', 'social/thumbnail draft'];
  return input.imageIds.map((imageId, index) => ({
    imageId,
    sequencePosition: index + 1,
    suggestedRole: roles[index % roles.length],
    note: `Seller-review recommended before publishing${input.productName ? ` for ${input.productName}` : ''}.`,
    targetPlatforms: input.targetPlatforms ?? [],
  }));
}
