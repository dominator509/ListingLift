import { buildSocialCommerceCreativePlan } from '@/domain/social-commerce';
import { socialCommerceCreativePlanInputSchema, type SocialCommerceCreativePlanInput } from '@/schemas/social-commerce';

export function createSocialCommerceCreativePlan(input: SocialCommerceCreativePlanInput) {
  const parsed = socialCommerceCreativePlanInputSchema.parse(input);
  return {
    ...buildSocialCommerceCreativePlan(parsed),
    outputPlan: {
      requireSellerReview: true,
      generateBeforeAfterSamples: true,
      keepClaimsSafe: true,
      note: 'Seed creative plan only. Codex must connect this to processed-file/preset records and delivery archive planning.',
    },
  };
}
