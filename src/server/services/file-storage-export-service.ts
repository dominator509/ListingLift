import { fileStorageExportPlanSchema, type FileStorageExportPlanInput } from '@/schemas/file-storage';
import { getFileStorageAdapter } from '@/server/adapters/file-storage/registry';

export async function planFileStorageDeliveryExport(input: FileStorageExportPlanInput & { organizationId: string; encryptedSecretId?: string; archiveStorageKey?: string }) {
  const parsed = fileStorageExportPlanSchema.parse(input);
  const adapter = getFileStorageAdapter(parsed.providerKey);
  return adapter.planFolderExport({
    config: { providerKey: parsed.providerKey, organizationId: input.organizationId, connectionId: parsed.connectionId, encryptedSecretId: input.encryptedSecretId },
    destinationFolderId: parsed.destinationFolderId,
    destinationFolderPath: parsed.destinationFolderPath,
    archiveStorageKey: input.archiveStorageKey ?? parsed.deliveryArchiveId,
  });
}
