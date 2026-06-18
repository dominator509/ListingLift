import { isUnsafeSocialCommerceAction, SOCIAL_COMMERCE_SAFETY_RULES } from '@/domain/social-commerce';
import { socialCommerceSafetyCheckInputSchema } from '@/schemas/social-commerce';

export function evaluateSocialCommerceSafety(input: unknown) {
  const parsed = socialCommerceSafetyCheckInputSchema.parse(input);
  const unsafe = isUnsafeSocialCommerceAction(parsed.action);
  return {
    allowed: !unsafe,
    blocked: unsafe,
    channelKey: parsed.channelKey,
    rules: SOCIAL_COMMERCE_SAFETY_RULES,
    requiredFallback: unsafe ? 'Use manual, platform-safe workflow. Do not scrape, store passwords, or automate private/social actions.' : undefined,
  };
}
