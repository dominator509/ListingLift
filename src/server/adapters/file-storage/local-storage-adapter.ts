import { FILE_STORAGE_PROVIDERS } from '@/domain/file-storage';
import type { FileStorageAdapter } from './types';

const definition = FILE_STORAGE_PROVIDERS.find((provider) => provider.key === 'local')!;

export const localFileStorageAdapter: FileStorageAdapter = {
  key: 'local',
  label: definition.label,
  capabilities: definition.capabilities,
  isEnabled: () => process.env.LOCAL_FILE_STORAGE_ENABLED !== 'false',
  async healthCheck() {
    return { providerKey: 'local', ok: process.env.LOCAL_FILE_STORAGE_ENABLED !== 'false', status: process.env.LOCAL_FILE_STORAGE_ENABLED === 'false' ? 'DISABLED' : 'HEALTHY', message: 'Local storage scaffold is available. Codex must verify persistence path in runtime.', checkedAt: new Date().toISOString() };
  },
  async createReadAccess({ storageKey, expiresInSeconds }) {
    return { providerKey: 'local', storageKey, accessUrl: `/api/storage/local/read?key=${encodeURIComponent(storageKey)}`, expiresAt: new Date(Date.now() + expiresInSeconds * 1000).toISOString(), serverMediated: true, decision: 'DRY_RUN', warnings: ['Server-mediated local read scaffold. Codex must implement streaming and auth checks.'] };
  },
  async createWriteAccess({ storageKey, expiresInSeconds }) {
    return { providerKey: 'local', storageKey, accessUrl: `/api/storage/local/write?key=${encodeURIComponent(storageKey)}`, expiresAt: new Date(Date.now() + expiresInSeconds * 1000).toISOString(), serverMediated: true, decision: 'DRY_RUN', warnings: ['Server-mediated local write scaffold. Codex must implement multipart/stream upload.'] };
  },
  async planFolderImport({ sourceFolderId, sourceFolderUrl, jobId }) {
    return { dryRun: true, providerKey: 'local', plannedFiles: [], warnings: [`Local folder import requires Codex runtime filesystem implementation for ${sourceFolderId ?? sourceFolderUrl ?? jobId}.`] };
  },
  async planFolderExport({ destinationFolderId, destinationFolderPath, archiveStorageKey }) {
    return { dryRun: true, providerKey: 'local', destination: destinationFolderId ?? destinationFolderPath ?? 'local-delivery-export', plannedOperations: [`Copy ${archiveStorageKey ?? 'delivery.zip'} to local export folder`], warnings: ['Local export is a scaffold until storage writes are implemented.'] };
  },
};
