import { FILE_STORAGE_PROVIDERS } from '@/domain/file-storage';
import type { FileStorageAdapter, FileStorageAdapterConfig } from './types';

const definition = FILE_STORAGE_PROVIDERS.find((provider) => provider.key === 'mock')!;

export const mockFileStorageAdapter: FileStorageAdapter = {
  key: 'mock',
  label: definition.label,
  capabilities: definition.capabilities,
  isEnabled: () => true,
  async healthCheck() {
    return { providerKey: 'mock', ok: true, status: 'MOCK', message: 'Mock file storage is available without external credentials.', checkedAt: new Date().toISOString() };
  },
  async createReadAccess({ storageKey, expiresInSeconds }) {
    return { providerKey: 'mock', storageKey, accessUrl: `/mock-storage/read/${encodeURIComponent(storageKey)}`, expiresAt: new Date(Date.now() + expiresInSeconds * 1000).toISOString(), serverMediated: true, decision: 'DRY_RUN', warnings: ['Mock read access only. Codex must wire real storage before production.'] };
  },
  async createWriteAccess({ storageKey, expiresInSeconds }) {
    return { providerKey: 'mock', storageKey, accessUrl: `/mock-storage/write/${encodeURIComponent(storageKey)}`, expiresAt: new Date(Date.now() + expiresInSeconds * 1000).toISOString(), serverMediated: true, decision: 'DRY_RUN', warnings: ['Mock write access only. Codex must wire real storage before production.'] };
  },
  async planFolderImport({ sourceFolderId, sourceFolderUrl, jobId }) {
    return { dryRun: true, providerKey: 'mock', plannedFiles: [{ storageKey: `mock/imports/${jobId}/sample.jpg`, fileName: 'sample.jpg', contentType: 'image/jpeg', sizeBytes: 1024, objectKind: 'ORIGINAL_UPLOAD' }], warnings: [`Mock import plan from ${sourceFolderId ?? sourceFolderUrl}`] };
  },
  async planFolderExport({ destinationFolderId, destinationFolderPath, archiveStorageKey }) {
    return { dryRun: true, providerKey: 'mock', destination: destinationFolderId ?? destinationFolderPath ?? 'mock-destination', plannedOperations: [`Copy ${archiveStorageKey ?? 'delivery.zip'} to mock destination`], warnings: ['Mock export plan only.'] };
  },
};
