import { describe, expect, it } from 'vitest';
import { decideAutomationRetry } from '@/server/services/automation-retry-service';

describe('automation retry service', () => {
  it('moves exhausted failed dispatches to dead letter', () => {
    expect(decideAutomationRetry({ status: 'FAILED', attemptCount: 3, maxRetries: 3 })).toBe('MOVE_TO_DEAD_LETTER');
  });

  it('retries provider rate limits with backoff', () => {
    expect(decideAutomationRetry({ status: 'FAILED', attemptCount: 1, maxRetries: 3, statusCode: 429 })).toBe('RETRY_WITH_BACKOFF');
  });
});
