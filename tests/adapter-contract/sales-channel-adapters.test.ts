import { describe, expect, it } from 'vitest';
import { salesChannelAdapters } from '@/server/adapters/sales-channel/registry';

describe('sales channel adapter contracts', () => {
  it('has unique adapter keys', () => {
    const keys = salesChannelAdapters.map((adapter) => adapter.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('normalizes minimal payloads without scraping private pages', async () => {
    for (const adapter of salesChannelAdapters) {
      const order = await adapter.normalize({ externalOrderId: `${adapter.key}_1`, packagePurchased: 'Quick Cleanup Pack' });
      expect(order.channelName).toBe(adapter.canonicalChannelKey);
      expect(order.externalOrderId).toBeTruthy();
    }
  });
});
