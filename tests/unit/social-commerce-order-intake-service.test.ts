import { describe, expect, it } from 'vitest';
import { createSocialCommerceManualOrderPlan } from '@/server/services/social-commerce-order-intake-service';

describe('social-commerce order intake service', () => {
  it('creates a normalized manual order/job/upload-link plan', () => {
    const plan = createSocialCommerceManualOrderPlan({
      channelKey: 'instagram_shop',
      buyerHandleOrEmail: '@demo_seller',
      productNames: ['Travel mug'],
      externalReference: 'ig-dm-123',
      currency: 'USD',
      uploadStatus: 'WAITING_FOR_UPLOAD',
      deliveryMode: 'DASHBOARD_DOWNLOAD',
      revisionStatus: 'NONE',
      dryRun: true,
      brandColors: [],
      creativeFormats: [],
      externalLinkAllowed: true,
    });
    expect(plan.channelKey).toBe('instagram_shop');
    expect(plan.jobDraft.targetPlatform).toBe('Instagram Shop');
    expect(plan.uploadLinkPlan.shouldCreateUploadToken).toBe(true);
    expect(plan.safety.noAutomatedDmCommentPostUpload).toBe(true);
  });
});
