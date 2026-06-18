import { z } from 'zod';
import { normalizeGumroadOrder } from '@/server/services/sales-channel-normalizer';
import type { SalesChannelAdapter } from './types';

const configSchema = z.object({ enabled: z.boolean().default(false) });

export const gumroadSalesChannelAdapter: SalesChannelAdapter<typeof configSchema> = {
  key: 'gumroad',
  canonicalChannelKey: 'Gumroad',
  label: 'Gumroad Webhook Workflow',
  featureFlag: 'GUMROAD_ENABLED',
  secretFields: ['GUMROAD_WEBHOOK_SECRET'],
  supportedModes: ['WEBHOOK', 'MANUAL', 'CSV_IMPORT'],
  marketplaceSafetyRules: ['Verify Gumroad webhook signatures where supported.', 'Normalize sales into ListingLift jobs before fulfillment.'],
  configSchema,
  async healthCheck() {
    return { ok: true, provider: 'gumroad', mode: 'manual', message: 'Gumroad webhook scaffold available. Real calls disabled by default.' };
  },
  async normalize(input) {
    return normalizeGumroadOrder((input ?? {}) as Record<string, unknown>);
  },
};
