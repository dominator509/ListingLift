import { z } from 'zod';

export type AdapterHealth = {
  ok: boolean;
  provider: string;
  mode: 'mock' | 'manual' | 'real' | 'local' | 'test' | 'disabled';
  message?: string;
};

export type AdapterDefinition<TConfig extends z.ZodTypeAny> = {
  key: string;
  label: string;
  featureFlag: string;
  secretFields: string[];
  configSchema: TConfig;
  healthCheck: () => Promise<AdapterHealth>;
};
