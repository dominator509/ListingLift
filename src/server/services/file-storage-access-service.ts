import { buildTenantStorageKey } from '@/domain/file-storage';
import { fileStorageAccessPlanSchema, type FileStorageAccessPlanInput } from '@/schemas/file-storage';
import { getFileStorageAdapter } from '@/server/adapters/file-storage/registry';
import type { FileStorageAdapterConfig } from '@/server/adapters/file-storage/types';

export async function buildStorageReadAccessPlan(input: FileStorageAccessPlanInput & { connectionId?: string; encryptedSecretId?: string }) {
  const parsed = fileStorageAccessPlanSchema.parse(input);
  const adapter = getFileStorageAdapter(parsed.providerKey);
  const config: FileStorageAdapterConfig = { providerKey: parsed.providerKey, organizationId: parsed.organizationId, connectionId: input.connectionId, encryptedSecretId: input.encryptedSecretId };
  return adapter.createReadAccess({ config, storageKey: parsed.storageKey, expiresInSeconds: parsed.expiresInSeconds });
}

export async function buildStorageWriteAccessPlan(input: FileStorageAccessPlanInput & { connectionId?: string; encryptedSecretId?: string }) {
  const parsed = fileStorageAccessPlanSchema.parse(input);
  const adapter = getFileStorageAdapter(parsed.providerKey);
  const config: FileStorageAdapterConfig = { providerKey: parsed.providerKey, organizationId: parsed.organizationId, connectionId: input.connectionId, encryptedSecretId: input.encryptedSecretId };
  return adapter.createWriteAccess({ config, storageKey: parsed.storageKey, expiresInSeconds: parsed.expiresInSeconds });
}

export function planTenantStorageKey(input: { organizationId: string; jobId?: string; objectKind: Parameters<typeof buildTenantStorageKey>[0]['objectKind']; fileName: string }) {
  return buildTenantStorageKey(input);
}
