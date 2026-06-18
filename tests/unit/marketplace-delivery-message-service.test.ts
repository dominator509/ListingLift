import { describe, expect, it } from 'vitest';
import { buildMarketplaceMessagePreview } from '@/server/services/marketplace-delivery-message-service';

describe('marketplace delivery messages', () => {
  it('creates copyable platform-safe delivery text', () => {
    const preview = buildMarketplaceMessagePreview({ templateKey: 'FIVERR', buyerName: 'Buyer', packageName: 'Marketplace Listing Pack', downloadUrl: 'https://example.com/delivery/token', expiresAt: new Date('2030-01-01') });
    expect(preview.copyable).toBe(true);
    expect(preview.message).toContain('platform-ready drafts');
    expect(preview.warning).toContain('marketplace/order workflow');
  });
});
