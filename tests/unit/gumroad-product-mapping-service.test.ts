import { describe, expect, it } from 'vitest';
import { resolveGumroadOfferMapping } from '@/server/services/gumroad-product-mapping-service';

const basePayload = { sale_id: 'sale_123', email: 'buyer@example.com', currency: 'USD' };

describe('Gumroad product mapping service', () => {
  it('maps a quick cleanup product by permalink hint', () => {
    const result = resolveGumroadOfferMapping({ ...basePayload, permalink: 'quick-cleanup-10', product_name: 'Unknown' });
    expect(result.matched).toBe(true);
    expect(result.offer?.packageKey).toBe('QuickCleanup10');
    expect(result.offer?.sendsUploadLink).toBe(true);
  });

  it('maps digital products without creating jobs', () => {
    const result = resolveGumroadOfferMapping({ ...basePayload, product_name: 'Canva Product Image Templates' });
    expect(result.offer?.fulfillmentKind).toBe('DIGITAL_DOWNLOAD');
    expect(result.offer?.createsJob).toBe(false);
  });

  it('requires manual review when no mapping matches', () => {
    const result = resolveGumroadOfferMapping({ ...basePayload, product_name: 'Mystery Offer' });
    expect(result.matched).toBe(false);
    expect(result.offer).toBeNull();
  });
});
