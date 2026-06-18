import { buildSocialCommerceDeliveryMessage } from '@/domain/social-commerce';
import { socialCommerceDeliveryTemplateInputSchema } from '@/schemas/social-commerce';

export function createSocialCommerceDeliveryTemplate(input: unknown) {
  const parsed = socialCommerceDeliveryTemplateInputSchema.parse(input);
  return {
    message: buildSocialCommerceDeliveryMessage(parsed),
    operatorInstruction: 'Paste this copy manually only where the social-commerce platform and customer context allow it. Do not automate DMs, comments, posts, marketplace messages, or uploads unless an approved integration permits it.',
    safeClaims: true,
  };
}
