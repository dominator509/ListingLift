import { describe, expect, it } from 'vitest';
import { assertSafeDeliveryRelativePath } from '@/domain/delivery-packaging';

describe('delivery zip path safety', () => {
  it('rejects zip slip and absolute paths', () => {
    expect(() => assertSafeDeliveryRelativePath('../secret.txt')).toThrow();
    expect(() => assertSafeDeliveryRelativePath('/secret.txt')).toThrow();
    expect(() => assertSafeDeliveryRelativePath('C:/secret.txt')).toThrow();
  });

  it('allows normalized delivery paths', () => {
    expect(() => assertSafeDeliveryRelativePath('ListingLift_Delivery_Client_JOB-1/Amazon/white-background/file.jpg')).not.toThrow();
  });
});
