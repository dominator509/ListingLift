import { describe, expect, it } from 'vitest';
import { requiresManualMarketplaceWorkflow, safeMarketplaceAutomationNote } from '@/domain/sales-channel-normalization';
import { listSalesChannelRegistry } from '@/server/adapters/sales-channel/registry';


describe('sales channel marketplace safety contract', () => {
  it('keeps restricted marketplace workflows manual or approved-integration only', () => {
    expect(requiresManualMarketplaceWorkflow('Fiverr')).toBe(true);
    expect(requiresManualMarketplaceWorkflow('AmazonManual')).toBe(true);
    expect(safeMarketplaceAutomationNote('Fiverr')).toMatch(/Do not scrape|Manual|approved/i);
  });

  it('documents safety rules for every sales-channel adapter', () => {
    for (const entry of listSalesChannelRegistry()) {
      expect(entry.marketplaceSafetyRules.length).toBeGreaterThan(0);
      expect(entry.marketplaceSafetyRules.join(' ')).not.toMatch(/scrape private marketplace pages allowed/i);
    }
  });
});
