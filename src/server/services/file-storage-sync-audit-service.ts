import type { FileStorageOperation, FileStorageProviderKey } from '@/domain/file-storage';

export function buildFileStorageAuditEvent(input: { organizationId: string; actorUserId?: string; providerKey: FileStorageProviderKey; operation: FileStorageOperation; jobId?: string; storageKey?: string; metadata?: Record<string, unknown> }) {
  return {
    organizationId: input.organizationId,
    actorUserId: input.actorUserId,
    entityType: 'FileStorage',
    action: `FILE_STORAGE_${input.operation}`,
    metadata: {
      providerKey: input.providerKey,
      jobId: input.jobId,
      storageKey: input.storageKey,
      ...(input.metadata ?? {}),
    },
  };
}
