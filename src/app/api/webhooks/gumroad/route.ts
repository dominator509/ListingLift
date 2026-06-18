import { getEnv } from '@/lib/env';
import { jsonFail, jsonOk } from '@/lib/api-response';
import { verifyGumroadWebhookSignature } from '@/server/services/gumroad-webhook-signature-service';
import { recordWebhookEvent, markWebhookProcessed } from '@/server/services/webhook-idempotency-service';
import { createGumroadWebhookProcessingPlan } from '@/server/services/gumroad-fulfillment-orchestrator';

export async function POST(request: Request) {
  // Read raw body before any parsing (P3: raw body access)
  const payload = await request.text();
  const signatureHeader = request.headers.get('gumroad-signature') ?? request.headers.get('x-gumroad-webhook-signature') ?? '';
  const env = getEnv();

  // P3: Verify HMAC-SHA256 signature
  const verification = verifyGumroadWebhookSignature({
    payload,
    signatureHeader: signatureHeader || null,
    webhookSecret: env.GUMROAD_WEBHOOK_SECRET || null,
  });
  if (!verification.ok) {
    return jsonFail('signature_invalid', verification.message, 400);
  }

  // Parse payload — Gumroad sends form-encoded or JSON
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(payload) as Record<string, unknown>;
  } catch {
    // Form-encoded
    const params = new URLSearchParams(payload);
    parsed = Object.fromEntries(params.entries()) as unknown as Record<string, unknown>;
  }

  // Extract event ID for idempotency
  const eventId = (parsed.sale_id as string) ?? (parsed.id as string) ?? `gumroad_${Date.now()}`;
  const eventType = (parsed.event_type as string) ?? 'sale';

  // P4: Idempotency — deduplicate by provider + eventId
  const idempotency = await recordWebhookEvent(
    'gumroad',
    String(eventId),
    eventType,
    parsed,
    verification.ok,
  );
  if (idempotency.duplicate) {
    return jsonOk({ handled: 'duplicate', event_id: eventId });
  }

  try {
    const plan = createGumroadWebhookProcessingPlan({
      payloadText: payload,
      signatureHeader: signatureHeader || null,
      dryRun: !verification.ok,
    });
    await markWebhookProcessed(idempotency.webhookEventId, 'PROCESSED');
    return jsonOk({ verification, plan, event_id: eventId, event_type: eventType });
  } catch (err) {
    await markWebhookProcessed(idempotency.webhookEventId, 'FAILED', String(err));
    throw err;
  }
}
