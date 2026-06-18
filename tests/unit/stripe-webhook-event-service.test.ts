import { describe, expect, it } from 'vitest';
import { createStripeWebhookProcessingDraft, assertStripeWebhookCanGrantAccess } from '@/server/services/stripe-webhook-event-service';

describe('stripe webhook event processing draft', () => {
  it('allows access only for verified paid events', () => {
    const draft = createStripeWebhookProcessingDraft({ id: 'evt_paid', type: 'checkout.session.completed', data: { object: {} } }, true);
    expect(assertStripeWebhookCanGrantAccess(draft).ok).toBe(true);
  });

  it('blocks failed payment events', () => {
    const draft = createStripeWebhookProcessingDraft({ id: 'evt_failed', type: 'invoice.payment_failed', data: { object: {} } }, true);
    expect(draft.shouldDenyAccess).toBe(true);
    expect(assertStripeWebhookCanGrantAccess(draft).ok).toBe(false);
  });
});
