import { describe, expect, it } from 'vitest';
import { listTaskrabbitServiceMappings, resolveTaskrabbitServiceMapping } from '@/server/services/taskrabbit-service-mapping-service';

describe('taskrabbit service mapping service', () => {
  it('includes the local-service mappings required by phase 22', () => {
    const mappings = listTaskrabbitServiceMappings();
    expect(mappings.length).toBeGreaterThanOrEqual(6);
    expect(mappings.map((mapping) => mapping.category)).toContain('RESTAURANT_MENU_CLEANUP');
    expect(mappings.map((mapping) => mapping.category)).toContain('REAL_ESTATE_LISTING_VISUALS');
  });

  it('maps marketplace listing help to a marketplace package', () => {
    const result = resolveTaskrabbitServiceMapping({ taskCategory: 'MARKETPLACE_LISTING_HELP', taskTitle: 'Facebook Marketplace listing photos' });
    expect(result.packageKey).toBe('MarketplaceListing50');
    expect(result.imageAllowance).toBeGreaterThan(10);
  });
});
