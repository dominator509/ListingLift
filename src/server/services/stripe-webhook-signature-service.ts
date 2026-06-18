import crypto from 'node:crypto';

export type StripeSignatureVerificationInput = {
  payload: string;
  signatureHeader: string;
  webhookSecret: string;
  toleranceSeconds?: number;
  nowSeconds?: number;
};

export function parseStripeSignatureHeader(header: string) {
  const parts = header.split(',').map((part) => part.trim());
  const timestamp = parts.find((part) => part.startsWith('t='))?.slice(2);
  const signatures = parts.filter((part) => part.startsWith('v1=')).map((part) => part.slice(3));
  return { timestamp: timestamp ? Number(timestamp) : NaN, signatures };
}

export function computeStripeSignature(payload: string, timestamp: number, webhookSecret: string) {
  return crypto.createHmac('sha256', webhookSecret).update(`${timestamp}.${payload}`).digest('hex');
}

function safeEqualHex(a: string, b: string) {
  const aBuffer = Buffer.from(a, 'hex');
  const bBuffer = Buffer.from(b, 'hex');
  if (aBuffer.length !== bBuffer.length) return false;
  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

export function verifyStripeWebhookSignature(input: StripeSignatureVerificationInput) {
  const toleranceSeconds = input.toleranceSeconds ?? 300;
  const nowSeconds = input.nowSeconds ?? Math.floor(Date.now() / 1000);
  const parsed = parseStripeSignatureHeader(input.signatureHeader);
  if (!Number.isFinite(parsed.timestamp) || parsed.signatures.length === 0) {
    return { ok: false, error: 'Invalid Stripe signature header.' };
  }
  if (Math.abs(nowSeconds - parsed.timestamp) > toleranceSeconds) {
    return { ok: false, error: 'Stripe signature timestamp outside tolerance.' };
  }
  const expected = computeStripeSignature(input.payload, parsed.timestamp, input.webhookSecret);
  const matched = parsed.signatures.some((signature) => safeEqualHex(signature, expected));
  if (!matched) return { ok: false, error: 'Stripe signature mismatch.' };

  try {
    const event = JSON.parse(input.payload) as { id?: string; type?: string };
    return { ok: true, eventId: event.id, eventType: event.type };
  } catch (e) {
    console.error('[stripe-webhook] signature valid but payload parse failed', e);
    return { ok: true };
  }
}
