import { z } from 'zod';
import { normalizeTaskrabbitOrder } from '@/server/services/sales-channel-normalizer';
import type { SalesChannelAdapter } from './types';

const configSchema = z.object({ enabled: z.boolean().default(false) });

export const taskrabbitSalesChannelAdapter: SalesChannelAdapter<typeof configSchema> = {
  key: 'taskrabbit',
  canonicalChannelKey: 'Taskrabbit',
  label: 'Taskrabbit Manual Workflow',
  featureFlag: 'TASKRABBIT_ENABLED',
  secretFields: [],
  supportedModes: ['MANUAL', 'EMAIL_PARSER', 'CSV_IMPORT'],
  marketplaceSafetyRules: ['Manual workflow unless approved integration exists.', 'Do not automate messaging outside approved platform rules.'],
  configSchema,
  async healthCheck() {
    return { ok: true, provider: 'taskrabbit', mode: 'manual', message: 'Manual Taskrabbit workflow available.' };
  },
  async normalize(input) {
    return normalizeTaskrabbitOrder((input ?? {}) as Record<string, unknown>);
  },
};
