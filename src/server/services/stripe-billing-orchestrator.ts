import { trackCheckoutSession, markSessionCompleted, markSessionExpired, reconcileStripeSessions } from '@/server/services/stripe-session-reconciliation-service';

export function createStripeWebhookFulfillmentPlan(event: { id: string; type: string; data: { object: Record<string, unknown> } }, verified: boolean) {
  // P26: Update session tracking on webhook events
  const clientReferenceId = event.data?.object?.client_reference_id as string | undefined;

  if (verified && clientReferenceId) {
    if (event.type === 'checkout.session.completed') {
      markSessionCompleted(clientReferenceId);
    } else if (event.type === 'checkout.session.expired') {
      markSessionExpired(clientReferenceId);
    }
  }

  return {
    eventId: event.id,
    eventType: event.type,
    verified,
    action: event.type === 'checkout.session.completed' ? 'fulfill_order' : 'record_event',
    reconciled: verified && clientReferenceId ? true : false,
    note: 'Fulfillment plan with session reconciliation. Persist checkout session and wire Stripe SDK when flags are enabled.',
  };
}

export function createStripePaidJobIntakePlan(input: {
  packageKey: string;
  purpose: string;
  quantity: number;
  metadata: Record<string, unknown>;
}) {
  // P26: Track checkout session creation
  if (input.metadata?.clientReferenceId) {
    trackCheckoutSession({
      clientReferenceId: String(input.metadata.clientReferenceId),
      packageKey: input.packageKey,
      purpose: input.purpose,
      amountCents: typeof input.metadata.amountCents === 'number' ? input.metadata.amountCents : 0,
    });
  }

  return {
    packageKey: input.packageKey,
    purpose: input.purpose,
    quantity: input.quantity,
    metadata: input.metadata,
    grantsAccessBeforePayment: false,
    triggersUploadLinkAfterPayment: true,
    note: 'Stripe paid job intake with session reconciliation tracking.',
  };
}

/**
 * P26: Run full reconciliation. Can be called from a cron job or admin endpoint.
 */
export async function runStripeSessionReconciliation() {
  const result = await reconcileStripeSessions();
  return result;
}
