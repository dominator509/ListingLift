import { describe, expect, it } from 'vitest';
import { createSocialCommerceDeliveryTemplate } from '@/server/services/social-commerce-delivery-template-service';

describe('social-commerce delivery template service', () => {
  it('generates manual operator copy without guarantees', () => {
    const template = createSocialCommerceDeliveryTemplate({ channelKey: 'pinterest', buyerName: 'Seller', includeExternalLink: true, externalLinkAllowed: true });
    expect(template.message).toContain('not guaranteed');
    expect(template.operatorInstruction).toContain('Do not automate');
  });
});
