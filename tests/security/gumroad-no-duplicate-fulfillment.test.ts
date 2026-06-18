import { describe, expect, it } from 'vitest';
import { buildGumroadDedupeKey } from '@/domain/gumroad';

describe('Gumroad duplicate fulfillment guard', () => {
  it('uses sale ID and product ID in the dedupe key', () => {
    expect(buildGumroadDedupeKey('sale_123', 'prod_456')).toBe('gumroad:prod_456:sale_123');
  });

  it('sanitizes unsafe sale IDs and product IDs', () => {
    expect(buildGumroadDedupeKey('../sale_123', 'prod/456')).not.toContain('..');
    expect(buildGumroadDedupeKey('../sale_123', 'prod/456')).not.toContain('/');
  });
});
