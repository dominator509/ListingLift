import { describe, expect, it } from 'vitest';
import { ensureManualUpsellDelivery } from '../../src/server/services/report-upsell-safety-service';

describe('upsell delivery safety', () => {
  it('blocks automated marketplace messages', () => {
    expect(ensureManualUpsellDelivery('AUTO_DM').allowed).toBe(false);
    expect(ensureManualUpsellDelivery('MANUAL_PLATFORM_MESSAGE').manualReviewRequired).toBe(true);
  });
});
