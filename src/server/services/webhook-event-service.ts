import { createHmac } from 'node:crypto';
import { safeCompare } from '@/lib/hash';
import { webhookEventCreateSchema, type WebhookEventCreateInput } from '@/schemas/webhook';

export function createWebhookEventDraft(input: WebhookEventCreateInput) {
  return webhookEventCreateSchema.parse(input);
}

export function verifyHmacSha256(payload: string, signature: string, secret: string) {
  const expected = createHmac('sha256', secret).update(payload).digest('hex');
  return safeCompare(expected, signature.replace(/^sha256=/, ''));
}
