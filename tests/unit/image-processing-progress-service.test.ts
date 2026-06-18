import { describe, expect, it } from 'vitest';
import { calculateProcessingProgress } from '@/server/services/image-processing-progress-service';

describe('calculateProcessingProgress', () => {
  it('calculates completion percent from created and failed outputs', () => {
    expect(calculateProcessingProgress({ totalImages: 2, totalRequestedOutputs: 4, totalCreatedOutputs: 2, totalFailedOutputs: 1, status: 'RUNNING' }).percent).toBe(75);
  });
});
