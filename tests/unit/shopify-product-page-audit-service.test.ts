import { describe, expect, it } from 'vitest';
import { createShopifyProductPageAudit } from '@/server/services/shopify-delivery-template-service';

describe('createShopifyProductPageAudit', () => {
  it('uses safe non-guarantee copy and bounded consistency scores', () => {
    const audit = createShopifyProductPageAudit({ productTitles: ['A'], flaggedIssues: ['Check crop'], recommendedSequence: ['Main image', 'Gallery'], consistencyScore: 110 });
    expect(audit.score).toBe(100);
    expect(audit.safeCopy).toContain('not guaranteed');
  });
});
