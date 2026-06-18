import { z } from 'zod';
import { normalizeManualOrder } from '@/server/services/sales-channel-normalizer';
import type { SalesChannelAdapter } from './types';

const configSchema = z.object({ enabled: z.boolean().default(true) });

export const manualSalesChannelAdapter: SalesChannelAdapter<typeof configSchema> = {
  key: 'manual',
  canonicalChannelKey: 'Direct',
  label: 'Manual Order Entry',
  featureFlag: 'MOCK_INTEGRATIONS_ENABLED',
  secretFields: [],
  supportedModes: ['MANUAL', 'CSV_IMPORT', 'EMAIL_PARSER'],
  marketplaceSafetyRules: ['Manual entry is the safe fallback for every channel.', 'Do not store marketplace passwords.'],
  configSchema,
  async healthCheck() {
    return { ok: true, provider: 'manual', mode: 'manual', message: 'Manual order entry available.' };
  },
  async normalize(input) {
    return normalizeManualOrder((input ?? {}) as Record<string, unknown>);
  },
};
