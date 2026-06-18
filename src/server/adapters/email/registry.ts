import { mockEmailAdapter } from './mock-email-adapter';
import { smtpEmailAdapter } from './smtp-email-adapter';
import type { EmailAdapter } from './types';

export const EMAIL_ADAPTERS: EmailAdapter[] = [mockEmailAdapter, smtpEmailAdapter];

export function getEmailAdapter(key = process.env.EMAIL_PROVIDER ?? 'mock-email') {
  const selected = EMAIL_ADAPTERS.find((adapter) => adapter.key === key);
  if (!selected) return mockEmailAdapter;
  if (selected.key !== 'mock-email' && process.env.EMAIL_ENABLED !== 'true') return mockEmailAdapter;
  return selected;
}

export async function listEmailAdapterHealth() {
  return Promise.all(
    EMAIL_ADAPTERS.map(async (adapter) => ({
      key: adapter.key,
      displayName: adapter.displayName,
      enabledByDefault: adapter.enabledByDefault,
      secretFields: adapter.secretFields,
      health: await adapter.healthCheck(),
    })),
  );
}
