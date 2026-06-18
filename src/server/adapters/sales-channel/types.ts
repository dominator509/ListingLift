import type { RequiredSalesChannelKey } from '@/domain/database-keys';
import type { IntegrationMode } from '@/domain/sales-channels';
import type { NormalizedExternalOrder } from '@/schemas/sales-channel';
import type { AdapterDefinition } from '../adapter-types';
import type { z } from 'zod';

export type SalesChannelAdapter<TConfig extends z.ZodTypeAny = z.ZodTypeAny> = AdapterDefinition<TConfig> & {
  canonicalChannelKey: RequiredSalesChannelKey;
  supportedModes: IntegrationMode[];
  marketplaceSafetyRules: string[];
  normalize: (input: unknown) => Promise<NormalizedExternalOrder>;
  importOrders?: () => Promise<NormalizedExternalOrder[]>;
};

export type SalesChannelAdapterRegistryEntry = {
  adapterKey: string;
  canonicalChannelKey: RequiredSalesChannelKey;
  label: string;
  supportedModes: IntegrationMode[];
  featureFlag: string;
  secretFields: string[];
  marketplaceSafetyRules: string[];
};
