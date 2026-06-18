import { fileStorageConnectionCreateSchema, fileStorageConnectionUpdateSchema, type FileStorageConnectionCreateInput, type FileStorageConnectionUpdateInput } from '@/schemas/file-storage';
import { evaluateFileStorageProviderReadiness } from './file-storage-policy-service';

export function buildFileStorageConnectionDraft(input: FileStorageConnectionCreateInput & { organizationId: string; actorUserId: string }) {
  const parsed = fileStorageConnectionCreateSchema.parse(input);
  const readiness = evaluateFileStorageProviderReadiness({ providerKey: parsed.providerKey, encryptedSecretId: parsed.encryptedSecretId, realIntegrationsEnabled: process.env.REAL_INTEGRATIONS_ENABLED === 'true' });
  return {
    organizationId: input.organizationId,
    providerKey: parsed.providerKey,
    displayName: parsed.displayName,
    status: parsed.providerKey === 'mock' ? 'MOCK_ENABLED' : readiness.ready ? 'CONFIGURED' : 'NEEDS_AUTH',
    rootFolderId: parsed.rootFolderId,
    rootFolderPath: parsed.rootFolderPath,
    encryptedSecretId: parsed.encryptedSecretId,
    config: parsed.config,
    createdByUserId: input.actorUserId,
    warnings: readiness.warnings,
    audit: { action: 'FILE_STORAGE_CONNECTION_DRAFTED', actorUserId: input.actorUserId },
  };
}

export function buildFileStorageConnectionUpdateDraft(input: FileStorageConnectionUpdateInput & { actorUserId: string }) {
  const parsed = fileStorageConnectionUpdateSchema.parse(input);
  return {
    ...parsed,
    updatedByUserId: input.actorUserId,
    audit: { action: 'FILE_STORAGE_CONNECTION_UPDATE_DRAFTED', actorUserId: input.actorUserId, connectionId: parsed.connectionId },
  };
}
