import { describe, expect, it } from 'vitest';
import { inspectUpsellCopy } from '../../src/server/services/report-upsell-safety-service';

describe('report and upsell safe copy', () => {
  it('rejects guarantee language', () => {
    const result = inspectUpsellCopy('This will guarantee sales and ranking.');
    expect(result.safe).toBe(false);
  });
});
