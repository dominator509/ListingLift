import { describe, expect, it } from 'vitest';
import { buildAutomationEventPayload, stripUnsafeAutomationPayloadKeys } from '@/server/services/automation-event-payload-service';

describe('automation event payload service', () => {
  it('builds deterministic dedupe keys', () => {
    const event = buildAutomationEventPayload({ organizationId: 'org_1', triggerKey: 'NEW_PAID_ORDER', actionKey: 'NOTIFY_ADMIN', jobId: 'job_1', payload: { email: 'buyer@example.com' } });
    expect(event.dedupeKey).toContain('org_1:new_paid_order:job_1');
    expect((event.payload as Record<string, unknown>).email).toBe('bu***@example.com');
  });

  it('strips unsafe payload keys', () => {
    const safe = stripUnsafeAutomationPayloadKeys({ token: 'secret', signedUrl: 'https://example.test', jobId: 'job_1' });
    expect(safe).toEqual({ jobId: 'job_1' });
  });
});
