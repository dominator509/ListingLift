import { z } from 'zod';
import { normalizeUpworkOrder } from '@/server/services/sales-channel-normalizer';
import type { SalesChannelAdapter } from './types';

const configSchema = z.object({ enabled: z.boolean().default(false) });

export const upworkSalesChannelAdapter: SalesChannelAdapter<typeof configSchema> = {
  key: 'upwork',
  canonicalChannelKey: 'Upwork',
  label: 'Upwork Manual Workflow',
  featureFlag: 'UPWORK_ENABLED',
  secretFields: [],
  supportedModes: ['MANUAL', 'EMAIL_PARSER', 'CSV_IMPORT'],
  marketplaceSafetyRules: ['Respect Upwork contract and communication rules.', 'Manual workflow unless approved integration exists.'],
  configSchema,
  async healthCheck() {
    return { ok: true, provider: 'upwork', mode: 'manual', message: 'Manual Upwork workflow available. No scraping.' };
  },
  async normalize(input) {
    return normalizeUpworkOrder((input ?? {}) as Record<string, unknown>);
  },
};
