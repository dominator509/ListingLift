import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { verifyHmacSha256 } from '@/server/services/webhook-event-service';

describe('webhook signatures', () => {
  it('verifies HMAC SHA256 signatures', () => {
    const payload = JSON.stringify({ id: 'evt_1' });
    const secret = 'fake_secret_for_tests';
    const signature = createHmac('sha256', secret).update(payload).digest('hex');
    expect(verifyHmacSha256(payload, signature, secret)).toBe(true);
  });

  it('rejects invalid signatures', () => {
    expect(verifyHmacSha256('{"id":"evt_1"}', 'bad', 'fake_secret_for_tests')).toBe(false);
  });
});
