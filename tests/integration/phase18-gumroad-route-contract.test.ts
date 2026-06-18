import { describe, expect, it } from 'vitest';
import { parseGumroadPayloadFromBody } from '@/server/services/gumroad-fulfillment-orchestrator';

describe('Phase 18 Gumroad route contract', () => {
  it('parses Gumroad form-encoded sale payloads', () => {
    const payload = parseGumroadPayloadFromBody('sale_id=sale_123&product_name=10-image+cleanup+pack&email=buyer%40example.com&price_cents=2500');
    expect(payload.sale_id).toBe('sale_123');
    expect(payload.email).toBe('buyer@example.com');
  });

  it('parses JSON payloads for tests and manual replay', () => {
    const payload = parseGumroadPayloadFromBody(JSON.stringify({ sale_id: 'sale_456', product_name: 'Product launch image kit', email: 'buyer@example.com' }));
    expect(payload.sale_id).toBe('sale_456');
  });
});
