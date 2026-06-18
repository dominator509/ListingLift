import { FILE_STORAGE_PROVIDERS, type FileStorageProviderKey } from '@/domain/file-storage';
import { getFileStorageAdapter } from '@/server/adapters/file-storage/registry';

export async function checkFileStorageHealth(input?: { providerKey?: FileStorageProviderKey; organizationId?: string; encryptedSecretId?: string }) {
  const providers = input?.providerKey ? [input.providerKey] : FILE_STORAGE_PROVIDERS.map((provider) => provider.key);
  const results = [];
  for (const providerKey of providers) {
    const adapter = getFileStorageAdapter(providerKey);
    results.push(await adapter.healthCheck({ providerKey, organizationId: input?.organizationId ?? 'demo-org', encryptedSecretId: input?.encryptedSecretId }));
  }
  return { checkedAt: new Date().toISOString(), results };
}
