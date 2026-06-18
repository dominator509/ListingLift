import { describe, expect, it } from 'vitest';
import { runMarketplaceWorkflowSafetyCheck } from '@/server/services/marketplace-workflow-safety-service';

describe('marketplace export safety', () => {
  it('blocks scraping and auto publish requests', () => {
    const result = runMarketplaceWorkflowSafetyCheck({ channelKey: 'amazon_manual', action: 'scrape Seller Central and auto-publish images' });
    expect(result.allowed).toBe(false);
    expect(result.manualFallbackRequired).toBe(true);
  });

  it('allows manual export planning', () => {
    const result = runMarketplaceWorkflowSafetyCheck({ channelKey: 'woocommerce_manual', action: 'prepare manual WooCommerce product gallery export plan' });
    expect(result.allowed).toBe(true);
  });
});
