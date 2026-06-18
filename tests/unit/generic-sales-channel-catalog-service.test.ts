import { describe, expect, it } from 'vitest';
import { DEFAULT_OTHER_SALES_CHANNELS, PHASE_23_REQUIRED_OTHER_SALES_CHANNEL_KEYS } from '@/domain/generic-sales-channels';
import { validateOtherSalesChannelCoverage } from '@/server/services/generic-sales-channel-catalog-service';

describe('generic sales channel catalog', () => {
  it('covers every Phase 23 source as a selectable channel', () => {
    const coverage = validateOtherSalesChannelCoverage();
    expect(coverage.missing).toEqual([]);
    expect(DEFAULT_OTHER_SALES_CHANNELS.map((channel) => channel.key)).toEqual(PHASE_23_REQUIRED_OTHER_SALES_CHANNEL_KEYS);
  });

  it('keeps every Phase 23 channel manual-first', () => {
    expect(DEFAULT_OTHER_SALES_CHANNELS.every((channel) => channel.manualOnly)).toBe(true);
  });
});
