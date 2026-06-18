import { describe, expect, it } from 'vitest';
import { signAutomationWebhookPayload, verifyAutomationWebhookSignature } from '@/server/services/automation-webhook-signature-service';

describe('automation webhook signatures', () => {
  it('verifies HMAC signatures using timestamped payloads', () => {
    const signed = signAutomationWebhookPayload({ body: '{"ok":true}', secret: 'test-secret', timestamp: '2026-01-01T00:00:00.000Z' });
    expect(verifyAutomationWebhookSignature({ body: '{"ok":true}', secret: 'test-secret', timestamp: signed.timestamp, signature: signed.signature })).toBe(true);
    expect(verifyAutomationWebhookSignature({ body: '{"ok":false}', secret: 'test-secret', timestamp: signed.timestamp, signature: signed.signature })).toBe(false);
  });
});
