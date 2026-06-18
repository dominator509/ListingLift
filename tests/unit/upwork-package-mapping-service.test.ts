import { describe, expect, it } from 'vitest';
import { listDefaultUpworkOfferMappings, resolveUpworkOfferMapping } from '@/server/services/upwork-package-mapping-service';

describe('upwork package mapping service', () => {
  it('contains fixed, hourly, retainer, agency, and bulk mappings', () => {
    const mappings = listDefaultUpworkOfferMappings();
    expect(mappings.map((m) => m.contractType)).toEqual(expect.arrayContaining(['FIXED_PRICE', 'HOURLY', 'RETAINER', 'AGENCY_SUBCONTRACT']));
  });

  it('resolves bulk marketplace contracts to a marketplace package', () => {
    const result = resolveUpworkOfferMapping({ contractTitle: 'Bulk Shopify marketplace image cleanup' });
    expect(result.packageKey).toContain('Marketplace');
    expect(result.imageAllowance).toBeGreaterThan(10);
  });
});
