import { describe, expect, it } from 'vitest';
import { buildClientMatchDraft, shouldCreateClient } from '@/server/services/order-client-matching-service';
import { normalizeManualOrder } from '@/server/services/sales-channel-normalizer';


describe('order client matching service', () => {
  it('uses internal client id when the channel payload already has one', () => {
    const order = normalizeManualOrder({ externalOrderId: 'ORDER-1', internalClientId: 'client_1', buyerName: 'Demo' });
    const match = buildClientMatchDraft(order, 'org_1');
    expect(match.existingClientId).toBe('client_1');
    expect(match.confidence).toBe(1);
  });

  it('matches existing clients by email before creating a new client', () => {
    const order = normalizeManualOrder({ externalOrderId: 'ORDER-2', buyerEmailOrUsername: 'Seller@Example.com' });
    const match = buildClientMatchDraft(order, 'org_1', [{ id: 'client_2', name: 'Seller', email: 'seller@example.com' }]);
    expect(match.matchStrategy).toBe('email');
    expect(shouldCreateClient(match)).toBe(false);
  });

  it('returns a new-client draft when no safe match exists', () => {
    const order = normalizeManualOrder({ externalOrderId: 'ORDER-3', buyerName: 'New Buyer' });
    const match = buildClientMatchDraft(order, 'org_1');
    expect(match.matchStrategy).toBe('new_client');
    expect(shouldCreateClient(match)).toBe(true);
  });
});
