import { z } from 'zod';
import { normalizeFiverrOrder } from '@/server/services/sales-channel-normalizer';
import type { SalesChannelAdapter } from './types';

const configSchema = z.object({ enabled: z.boolean().default(false) });

export const fiverrSalesChannelAdapter: SalesChannelAdapter<typeof configSchema> = {
  key: 'fiverr',
  canonicalChannelKey: 'Fiverr',
  label: 'Fiverr Manual Workflow',
  featureFlag: 'FIVERR_ENABLED',
  secretFields: [],
  supportedModes: ['MANUAL', 'EMAIL_PARSER', 'CSV_IMPORT'],
  marketplaceSafetyRules: ['Do not scrape private Fiverr pages.', 'Keep final delivery inside Fiverr when required.', 'Do not automate buyer messaging outside Fiverr-approved methods.'],
  configSchema,
  async healthCheck() {
    return { ok: true, provider: 'fiverr', mode: 'manual', message: 'Manual Fiverr workflow available. No scraping.' };
  },
  async normalize(input) {
    return normalizeFiverrOrder((input ?? {}) as Record<string, unknown>);
  },
};
