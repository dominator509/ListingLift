import { FILE_STORAGE_PROVIDERS, FILE_STORAGE_SECURITY_RULES, getFileStorageProvider, isClientDownloadObjectKind, type FileStorageObjectKind, type FileStorageProviderKey } from '@/domain/file-storage';

export function listFileStorageProviderPolicies() {
  return { providers: FILE_STORAGE_PROVIDERS, rules: FILE_STORAGE_SECURITY_RULES };
}

export function evaluateFileStorageProviderReadiness(input: { providerKey: FileStorageProviderKey; encryptedSecretId?: string; realIntegrationsEnabled?: boolean }) {
  const provider = getFileStorageProvider(input.providerKey);
  const warnings: string[] = [];
  if (provider.requiresEncryptedSecretReference && !input.encryptedSecretId) warnings.push('Encrypted secret reference is required before real provider calls.');
  if (provider.realCallsEnvVar && !input.realIntegrationsEnabled && provider.key !== 'mock' && provider.key !== 'local') warnings.push(`${provider.realCallsEnvVar} must be enabled before real provider calls.`);
  return { provider, ready: warnings.length === 0 || provider.key === 'mock' || provider.key === 'local', warnings };
}

export function canExposeObjectToClient(kind: FileStorageObjectKind, approved: boolean) {
  if (!isClientDownloadObjectKind(kind)) return { allowed: false, reason: 'Object kind is not client-downloadable.' };
  if (!approved) return { allowed: false, reason: 'Delivery/report object is not approved for client access.' };
  return { allowed: true, reason: 'Object kind and approval state allow client access.' };
}
