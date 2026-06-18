import { createHmac, timingSafeEqual } from 'node:crypto';

export type GumroadSignatureVerificationResult = {
  ok: boolean;
  mode: 'verified' | 'missing_secret' | 'missing_signature' | 'unsupported_header' | 'mismatch';
  message: string;
};

function safeCompareHex(a: string, b: string) {
  const aBuffer = Buffer.from(a, 'hex');
  const bBuffer = Buffer.from(b, 'hex');
  if (aBuffer.length !== bBuffer.length) return false;
  return timingSafeEqual(aBuffer, bBuffer);
}

export function computeGumroadWebhookSignature(payload: string, secret: string) {
  return createHmac('sha256', secret).update(payload, 'utf8').digest('hex');
}

export function verifyGumroadWebhookSignature(input: { payload: string; signatureHeader?: string | null; webhookSecret?: string | null }): GumroadSignatureVerificationResult {
  if (!input.webhookSecret) {
    return { ok: false, mode: 'missing_secret', message: 'Gumroad webhook secret is not configured. Process only in dry-run/manual-review mode.' };
  }
  if (!input.signatureHeader) {
    return { ok: false, mode: 'missing_signature', message: 'Gumroad signature header is missing. Do not grant access or create paid fulfillment automatically.' };
  }
  const normalized = input.signatureHeader.replace(/^sha256=/i, '').trim();
  if (!/^[a-f0-9]{64}$/i.test(normalized)) {
    return { ok: false, mode: 'unsupported_header', message: 'Gumroad signature header format is unsupported. Codex must align this with the configured Gumroad webhook mechanism.' };
  }
  const expected = computeGumroadWebhookSignature(input.payload, input.webhookSecret);
  const ok = safeCompareHex(expected, normalized.toLowerCase());
  return ok
    ? { ok: true, mode: 'verified', message: 'Gumroad webhook signature verified.' }
    : { ok: false, mode: 'mismatch', message: 'Gumroad webhook signature mismatch. Do not process automatically.' };
}
