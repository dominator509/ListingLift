import { fileStorageFolderImportSchema, type FileStorageFolderImportInput } from '@/schemas/file-storage';
import { getFileStorageAdapter } from '@/server/adapters/file-storage/registry';

export async function planFileStorageFolderImport(input: FileStorageFolderImportInput & { organizationId: string; encryptedSecretId?: string }) {
  const parsed = fileStorageFolderImportSchema.parse(input);
  const adapter = getFileStorageAdapter(parsed.providerKey);
  return adapter.planFolderImport({
    config: { providerKey: parsed.providerKey, organizationId: input.organizationId, connectionId: parsed.connectionId, encryptedSecretId: input.encryptedSecretId },
    sourceFolderId: parsed.sourceFolderId,
    sourceFolderUrl: parsed.sourceFolderUrl,
    jobId: parsed.jobId,
  });
}
