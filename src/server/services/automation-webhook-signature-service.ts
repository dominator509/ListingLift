import crypto from 'node:crypto';

export function signAutomationWebhookPayload(input: { body: string; secret: string; timestamp?: string }) {
  const timestamp = input.timestamp ?? new Date().toISOString();
  const base = `${timestamp}.${input.body}`;
  const signature = crypto.createHmac('sha256', input.secret).update(base).digest('hex');
  return { timestamp, signature: `sha256=${signature}` };
}

export function verifyAutomationWebhookSignature(input: { body: string; secret: string; timestamp: string; signature: string }) {
  const expected = signAutomationWebhookPayload({ body: input.body, secret: input.secret, timestamp: input.timestamp }).signature;
  const left = Buffer.from(expected);
  const right = Buffer.from(input.signature);
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}
