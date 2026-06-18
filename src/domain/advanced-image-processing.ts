export type AdvancedImageOperationKey =
  | 'AUTO_ENHANCE'
  | 'LIGHTING_BALANCE'
  | 'WHITE_BALANCE'
  | 'SHARPEN'
  | 'DENOISE'
  | 'SOFT_SHADOW'
  | 'REFLECTION_SHADOW'
  | 'BRAND_BACKGROUND'
  | 'HERO_COMPOSITE'
  | 'SOCIAL_VARIATION'
  | 'THUMBNAIL_VARIATION'
  | 'SEQUENCE_RECOMMENDATION'
  | 'QUALITY_REPORT';

export type AdvancedImageRecipeKey =
  | 'marketplace-polish'
  | 'brand-background-set'
  | 'launch-hero-social-set'
  | 'thumbnail-variation-set'
  | 'quality-report-only';

export type AdvancedImageRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'BLOCKED';
export type AdvancedImagePlanStatus = 'DRAFT' | 'READY' | 'BLOCKED' | 'MANUAL_ONLY';

export type AdvancedImageOperationDefinition = {
  key: AdvancedImageOperationKey;
  label: string;
  category: 'enhancement' | 'background' | 'creative' | 'reporting' | 'recommendation';
  requiresOriginal: boolean;
  requiresProcessedInput: boolean;
  createsNewOutput: boolean;
  clientVisibleByDefault: boolean;
  requiresAdminApproval: boolean;
  riskLevel: AdvancedImageRiskLevel;
  safeDescription: string;
};

export type AdvancedImageRecipe = {
  key: AdvancedImageRecipeKey;
  label: string;
  description: string;
  recommendedPackages: string[];
  operations: AdvancedImageOperationKey[];
  defaultOutputFolder: string;
  sellerReviewRequired: boolean;
  requiresAdminApproval: boolean;
  safeClaim: string;
};

export const ADVANCED_IMAGE_SAFE_COPY =
  'Advanced outputs are platform-ready drafts for seller review. They do not guarantee marketplace approval, listing ranking, sales, conversion improvement, ad performance, or product approval.';

export const ADVANCED_IMAGE_SECURITY_RULES = [
  'Never overwrite original uploads.',
  'Advanced outputs must be stored as new ProcessedFile or report records.',
  'Do not expose advanced outputs to clients until approval and delivery gates allow access.',
  'Do not auto-publish advanced outputs to marketplaces or ecommerce stores.',
  'Do not guarantee marketplace approval, ranking, sales, conversion, ad performance, or product approval.',
  'Real AI/model/provider calls must remain feature-flagged and have mock/manual fallback.',
  'Every manually edited replacement or advanced output that affects client delivery must be audited.',
  'Hero, social, and background variants must preserve product identity and avoid misleading product modifications.',
] as const;

export const ADVANCED_IMAGE_OPERATIONS: AdvancedImageOperationDefinition[] = [
  {
    key: 'AUTO_ENHANCE',
    label: 'Auto enhance',
    category: 'enhancement',
    requiresOriginal: false,
    requiresProcessedInput: true,
    createsNewOutput: true,
    clientVisibleByDefault: false,
    requiresAdminApproval: true,
    riskLevel: 'LOW',
    safeDescription: 'Creates a lightly enhanced draft with balanced clarity and contrast.',
  },
  {
    key: 'LIGHTING_BALANCE',
    label: 'Lighting balance',
    category: 'enhancement',
    requiresOriginal: false,
    requiresProcessedInput: true,
    createsNewOutput: true,
    clientVisibleByDefault: false,
    requiresAdminApproval: true,
    riskLevel: 'LOW',
    safeDescription: 'Plans lighting and exposure correction without changing the product itself.',
  },
  {
    key: 'WHITE_BALANCE',
    label: 'White balance',
    category: 'enhancement',
    requiresOriginal: false,
    requiresProcessedInput: true,
    createsNewOutput: true,
    clientVisibleByDefault: false,
    requiresAdminApproval: true,
    riskLevel: 'LOW',
    safeDescription: 'Plans color cast correction while preserving product identity.',
  },
  {
    key: 'SHARPEN',
    label: 'Sharpen',
    category: 'enhancement',
    requiresOriginal: false,
    requiresProcessedInput: true,
    createsNewOutput: true,
    clientVisibleByDefault: false,
    requiresAdminApproval: true,
    riskLevel: 'MEDIUM',
    safeDescription: 'Plans conservative sharpening; blurry source images remain flagged for seller review.',
  },
  {
    key: 'DENOISE',
    label: 'Denoise',
    category: 'enhancement',
    requiresOriginal: false,
    requiresProcessedInput: true,
    createsNewOutput: true,
    clientVisibleByDefault: false,
    requiresAdminApproval: true,
    riskLevel: 'MEDIUM',
    safeDescription: 'Plans noise reduction without inventing product details.',
  },
  {
    key: 'SOFT_SHADOW',
    label: 'Soft shadow',
    category: 'background',
    requiresOriginal: false,
    requiresProcessedInput: true,
    createsNewOutput: true,
    clientVisibleByDefault: false,
    requiresAdminApproval: true,
    riskLevel: 'LOW',
    safeDescription: 'Creates subtle ecommerce-style shadow drafts.',
  },
  {
    key: 'REFLECTION_SHADOW',
    label: 'Reflection shadow',
    category: 'background',
    requiresOriginal: false,
    requiresProcessedInput: true,
    createsNewOutput: true,
    clientVisibleByDefault: false,
    requiresAdminApproval: true,
    riskLevel: 'MEDIUM',
    safeDescription: 'Creates reflection-style product drafts for seller review.',
  },
  {
    key: 'BRAND_BACKGROUND',
    label: 'Brand background',
    category: 'background',
    requiresOriginal: false,
    requiresProcessedInput: true,
    createsNewOutput: true,
    clientVisibleByDefault: false,
    requiresAdminApproval: true,
    riskLevel: 'LOW',
    safeDescription: 'Creates brand-color background variations from approved brand settings.',
  },
  {
    key: 'HERO_COMPOSITE',
    label: 'Hero composite',
    category: 'creative',
    requiresOriginal: false,
    requiresProcessedInput: true,
    createsNewOutput: true,
    clientVisibleByDefault: false,
    requiresAdminApproval: true,
    riskLevel: 'HIGH',
    safeDescription: 'Plans hero image drafts without misleading edits or false performance claims.',
  },
  {
    key: 'SOCIAL_VARIATION',
    label: 'Social variation',
    category: 'creative',
    requiresOriginal: false,
    requiresProcessedInput: true,
    createsNewOutput: true,
    clientVisibleByDefault: false,
    requiresAdminApproval: true,
    riskLevel: 'MEDIUM',
    safeDescription: 'Creates social commerce format variations for seller review.',
  },
  {
    key: 'THUMBNAIL_VARIATION',
    label: 'Thumbnail variation',
    category: 'creative',
    requiresOriginal: false,
    requiresProcessedInput: true,
    createsNewOutput: true,
    clientVisibleByDefault: false,
    requiresAdminApproval: true,
    riskLevel: 'LOW',
    safeDescription: 'Creates thumbnail draft options using approved product cutouts.',
  },
  {
    key: 'SEQUENCE_RECOMMENDATION',
    label: 'Image sequence recommendation',
    category: 'recommendation',
    requiresOriginal: false,
    requiresProcessedInput: true,
    createsNewOutput: false,
    clientVisibleByDefault: false,
    requiresAdminApproval: true,
    riskLevel: 'LOW',
    safeDescription: 'Plans suggested listing image order for seller review.',
  },
  {
    key: 'QUALITY_REPORT',
    label: 'Image quality report',
    category: 'reporting',
    requiresOriginal: true,
    requiresProcessedInput: true,
    createsNewOutput: false,
    clientVisibleByDefault: false,
    requiresAdminApproval: true,
    riskLevel: 'LOW',
    safeDescription: 'Generates a quality report with review recommendations and non-guarantee language.',
  },
];

export const ADVANCED_IMAGE_RECIPES: AdvancedImageRecipe[] = [
  {
    key: 'marketplace-polish',
    label: 'Marketplace Polish',
    description: 'Balanced ecommerce cleanup with enhancement, soft shadow, and quality notes.',
    recommendedPackages: ['marketplace-listing-pack', 'monthly-seller-image-retainer', 'agency-white-label-fulfillment'],
    operations: ['AUTO_ENHANCE', 'LIGHTING_BALANCE', 'WHITE_BALANCE', 'SOFT_SHADOW', 'QUALITY_REPORT'],
    defaultOutputFolder: 'Advanced/Marketplace-Polish',
    sellerReviewRequired: true,
    requiresAdminApproval: true,
    safeClaim: ADVANCED_IMAGE_SAFE_COPY,
  },
  {
    key: 'brand-background-set',
    label: 'Brand Background Set',
    description: 'Brand-color ecommerce backgrounds for launch and social commerce assets.',
    recommendedPackages: ['product-launch-image-pack', 'monthly-seller-image-retainer', 'agency-white-label-fulfillment'],
    operations: ['BRAND_BACKGROUND', 'LIGHTING_BALANCE', 'THUMBNAIL_VARIATION', 'QUALITY_REPORT'],
    defaultOutputFolder: 'Advanced/Brand-Backgrounds',
    sellerReviewRequired: true,
    requiresAdminApproval: true,
    safeClaim: ADVANCED_IMAGE_SAFE_COPY,
  },
  {
    key: 'launch-hero-social-set',
    label: 'Launch Hero and Social Set',
    description: 'Hero, social, thumbnail, and sequence recommendation drafts for product launches.',
    recommendedPackages: ['product-launch-image-pack', 'agency-white-label-fulfillment'],
    operations: ['HERO_COMPOSITE', 'SOCIAL_VARIATION', 'THUMBNAIL_VARIATION', 'SEQUENCE_RECOMMENDATION', 'QUALITY_REPORT'],
    defaultOutputFolder: 'Advanced/Hero-Social',
    sellerReviewRequired: true,
    requiresAdminApproval: true,
    safeClaim: ADVANCED_IMAGE_SAFE_COPY,
  },
  {
    key: 'thumbnail-variation-set',
    label: 'Thumbnail Variation Set',
    description: 'Thumbnail drafts for marketplace and social commerce testing by the seller.',
    recommendedPackages: ['product-launch-image-pack', 'monthly-seller-image-retainer'],
    operations: ['THUMBNAIL_VARIATION', 'AUTO_ENHANCE', 'QUALITY_REPORT'],
    defaultOutputFolder: 'Advanced/Thumbnails',
    sellerReviewRequired: true,
    requiresAdminApproval: true,
    safeClaim: ADVANCED_IMAGE_SAFE_COPY,
  },
  {
    key: 'quality-report-only',
    label: 'Quality Report Only',
    description: 'Image quality, sequence, and listing-readiness notes without new image outputs.',
    recommendedPackages: ['product-launch-image-pack', 'monthly-seller-image-retainer', 'agency-white-label-fulfillment'],
    operations: ['SEQUENCE_RECOMMENDATION', 'QUALITY_REPORT'],
    defaultOutputFolder: 'Advanced/Reports',
    sellerReviewRequired: true,
    requiresAdminApproval: true,
    safeClaim: ADVANCED_IMAGE_SAFE_COPY,
  },
];

export function getAdvancedImageRecipe(recipeKey: AdvancedImageRecipeKey) {
  return ADVANCED_IMAGE_RECIPES.find((recipe) => recipe.key === recipeKey);
}

export function getAdvancedImageOperation(operationKey: AdvancedImageOperationKey) {
  return ADVANCED_IMAGE_OPERATIONS.find((operation) => operation.key === operationKey);
}

export function requiresManualFallback(operationKeys: AdvancedImageOperationKey[]) {
  return operationKeys.some((operationKey) => {
    const operation = getAdvancedImageOperation(operationKey);
    return operation?.riskLevel === 'HIGH' || operation?.riskLevel === 'BLOCKED';
  });
}

export function isAdvancedImageSafeClaim(copy: string) {
  const blocked = ['guaranteed approval', 'guaranteed sales', 'rank higher', 'conversion guaranteed', 'ad performance guaranteed'];
  return !blocked.some((phrase) => copy.toLowerCase().includes(phrase));
}
