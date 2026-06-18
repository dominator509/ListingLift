import { describe, expect, it } from 'vitest';
import { resolveFiverrGigMapping } from '@/server/services/fiverr-package-mapping-service';

const cases = [
  ['Basic product photo background cleanup — 10 images', 'QuickCleanup10'],
  ['Standard marketplace product image pack — 25 images', 'MarketplaceListing25'],
  ['Premium marketplace product image pack — 50 images', 'MarketplaceListing50'],
  ['Product launch image kit with hero images', 'ProductLaunch50'],
];

describe('Fiverr package mapping', () => {
  it.each(cases)('maps %s to %s', (gigTitle, packageKey) => {
    expect(resolveFiverrGigMapping({ gigTitle }).packageKey).toBe(packageKey);
  });

  it('falls back to MarketplaceListing25 for unknown gigs', () => {
    expect(resolveFiverrGigMapping({ gigTitle: 'custom product photos' }).packageKey).toBe('MarketplaceListing25');
  });
});
