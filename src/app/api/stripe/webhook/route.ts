import { getEnv } from '@/lib/env';
import { jsonFail, jsonOk } from '@/lib/api-response';
import { verifyStripeWebhookSignature } from '@/server/services/stripe-webhook-signature-service';
import { createStripeWebhookFulfillmentPlan } from '@/server/services/stripe-billing-orchestrator';
import { stripeWebhookEventSchema } from '@/schemas/stripe-billing';
import { recordWebhookEvent, markWebhookProcessed } from '@/server/services/webhook-idempotency-service';

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature') ?? '';
  const env = getEnv();

  // P3: Verify signature — reject with 400 if invalid or missing
  if (!env.STRIPE_WEBHOOK_SECRET) {
    return jsonFail('webhook_not_configured', 'Stripe webhook secret is not configured.', 400);
  }
  const verification = verifyStripeWebhookSignature({
    payload,
    signatureHeader: signature,
    webhookSecret: env.STRIPE_WEBHOOK_SECRET,
    toleranceSeconds: 300,
  });
  if (!verification.ok) {
    return jsonFail('signature_invalid', verification.error ?? 'Stripe signature verification failed.', 400);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(payload);
  } catch {
    return jsonFail('invalid_json', 'Stripe webhook payload must be valid JSON.', 400);
  }
  const event = stripeWebhookEventSchema.parse(parsed);

  // P4: Idempotency — deduplicate by event ID + provider
  const idempotency = await recordWebhookEvent(
    'stripe',
    event.id,
    event.type,
    event as unknown as Record<string, unknown>,
    verification.ok,
  );
  if (idempotency.duplicate) {
    return jsonOk({ handled: 'duplicate', event_id: event.id });
  }

  try {
    const plan = createStripeWebhookFulfillmentPlan(event, verification.ok);
    await markWebhookProcessed(idempotency.webhookEventId, 'PROCESSED');
    return jsonOk({ verification, plan, event_id: event.id, event_type: event.type });
  } catch (err) {
    await markWebhookProcessed(idempotency.webhookEventId, 'FAILED', String(err));
    throw err;
  }
}

export async function GET() {
  return jsonOk({ provider: 'stripe', status: 'active', note: 'Use POST with Stripe-Signature header for webhook delivery.' });
}
