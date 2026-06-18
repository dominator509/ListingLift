import { describe, expect, it } from 'vitest';
import { assertDeliveryVisibility, canTransitionJob } from '@/server/services/job-lifecycle-service';

describe('job lifecycle', () => {
  it('requires review before approval', () => {
    expect(canTransitionJob('WAITING_FOR_REVIEW', 'APPROVED')).toBe(true);
    expect(canTransitionJob('PROCESSING', 'APPROVED')).toBe(false);
  });

  it('blocks delivery visibility before approval', () => {
    expect(() => assertDeliveryVisibility('READY_FOR_DELIVERY', null)).toThrow();
  });
});
