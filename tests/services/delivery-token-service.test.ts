import { describe, expect, it } from 'vitest';
import { createDeliveryToken, hashDeliveryToken } from '@/server/services/delivery-token-service';

describe('delivery token service', () => {
  it('creates a raw token and stores only a hash candidate', () => {
    const result = createDeliveryToken({ jobId: 'job_1', expiresInMinutes: 60, approvedOnly: true });
    expect(result.token).not.toEqual(result.tokenHash);
    expect(hashDeliveryToken(result.token)).toEqual(result.tokenHash);
  });
});
