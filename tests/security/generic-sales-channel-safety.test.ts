import { describe, expect, it } from 'vitest';
import { checkGenericSalesChannelSafety } from '@/server/services/generic-channel-safety-service';

describe('generic sales channel safety', () => {
  it('blocks scraping, password storage, and unauthorized automation', () => {
    const result = checkGenericSalesChannelSafety({
      externalLinkAllowed: false,
      intendedActions: ['scrape lead inbox', 'auto DM prospects'],
      storesPassword: true,
      automatesMessages: true,
      scrapesPrivatePages: true,
    });
    expect(result.ok).toBe(false);
    expect(result.blockers.length).toBeGreaterThan(2);
  });
});
