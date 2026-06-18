import { describe, expect, it } from 'vitest';
import { canShowClientDownload } from '@/server/services/delivery-visibility-service';

describe('delivery visibility', () => {
  it('hides downloads before approval', () => {
    expect(canShowClientDownload({ jobStatus: 'READY_FOR_DELIVERY', deliveryLinkStatus: 'ACTIVE', expiresAt: new Date(Date.now() + 10000), approvedAt: null })).toBe(false);
  });

  it('shows approved active delivery links', () => {
    expect(canShowClientDownload({ jobStatus: 'READY_FOR_DELIVERY', deliveryLinkStatus: 'ACTIVE', expiresAt: new Date(Date.now() + 10000), approvedAt: new Date() })).toBe(true);
  });

  it('hides expired delivery links', () => {
    expect(canShowClientDownload({ jobStatus: 'READY_FOR_DELIVERY', deliveryLinkStatus: 'ACTIVE', expiresAt: new Date(Date.now() - 10000), approvedAt: new Date() })).toBe(false);
  });
});
