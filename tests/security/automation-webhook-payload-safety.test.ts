import { describe, expect, it } from 'vitest';
import { redactAutomationPayload } from '@/domain/automation-webhooks';

describe('automation payload safety', () => {
  it('redacts secrets and emails before payload leaves the app', () => {
    const payload = redactAutomationPayload({ webhookSecret: 'secret', apiToken: 'token', buyerEmail: 'buyer@example.com', jobId: 'job_1' });
    expect(payload.webhookSecret).toBe('[redacted]');
    expect(payload.apiToken).toBe('[redacted]');
    expect(payload.buyerEmail).toBe('bu***@example.com');
    expect(payload.jobId).toBe('job_1');
  });
});
