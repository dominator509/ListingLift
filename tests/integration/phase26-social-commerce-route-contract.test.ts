import { describe, expect, it, vi } from 'vitest';
import { POST as manualOrder } from '@/app/api/social-commerce/manual-order/route';

// Mock Prisma so the route handler can load without a real database
vi.mock('@/lib/prisma', () => ({ prisma: {} }));

describe('Phase 26 social-commerce route contracts', () => {
  it('manual order route returns a dry-run plan', async () => {
    const response = await manualOrder(new Request('http://test.local/api/social-commerce/manual-order', {
      method: 'POST',
      body: JSON.stringify({ channelKey: 'tiktok_shop', buyerHandleOrEmail: '@seller', productNames: ['Lamp'] }),
    }));
    expect(response.status).toBe(202);
    const json = await response.json();
    expect(json.ok).toBe(true);
    expect(json.data.plan.safety.noScraping).toBe(true);
  });
});
