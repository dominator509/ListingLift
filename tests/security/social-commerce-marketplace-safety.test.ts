import { describe, expect, it } from 'vitest';
import { evaluateSocialCommerceSafety } from '@/server/services/social-commerce-workflow-safety-service';

describe('social-commerce marketplace safety', () => {
  it('blocks unsafe scraping/password/automation requests', () => {
    expect(evaluateSocialCommerceSafety({ action: 'scrape private inbox and auto DM buyers', channelKey: 'instagram_profile' }).blocked).toBe(true);
    expect(evaluateSocialCommerceSafety({ action: 'prepare manual delivery copy', channelKey: 'instagram_profile' }).allowed).toBe(true);
  });
});
