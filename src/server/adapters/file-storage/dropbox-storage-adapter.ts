import { FILE_STORAGE_PROVIDERS } from '@/domain/file-storage';
import type { FileStorageAdapter } from './types';

const definition = FILE_STORAGE_PROVIDERS.find((provider) => provider.key === 'dropbox')!;
const enabled = () => process.env.DROPBOX_ENABLED === 'true' && process.env.REAL_INTEGRATIONS_ENABLED === 'true';

export const dropboxStorageAdapter: FileStorageAdapter = {
  key: 'dropbox',
  label: definition.label,
  capabilities: definition.capabilities,
  isEnabled: enabled,
  async healthCheck(config) {
    const ok = enabled() && Boolean(config.encryptedSecretId);
    return { providerKey: 'dropbox', ok, status: ok ? 'HEALTHY' : 'NEEDS_AUTH', message: ok ? 'Dropbox scaffold is configured.' : 'Dropbox requires feature flags and encrypted OAuth secret references.', checkedAt: new Date().toISOString() };
  },
  async createReadAccess({ storageKey }) {
    return { providerKey: 'dropbox', storageKey, serverMediated: true, decision: 'DRY_RUN', warnings: ['Dropbox read access requires Codex to wire official API calls and encrypted OAuth credentials.'] };
  },
  async createWriteAccess({ storageKey }) {
    return { providerKey: 'dropbox', storageKey, serverMediated: true, decision: 'DRY_RUN', warnings: ['Dropbox write access requires Codex to wire official API calls and encrypted OAuth credentials.'] };
  },
  async planFolderImport({ sourceFolderId, sourceFolderUrl, jobId }) {
    return { dryRun: true, providerKey: 'dropbox', plannedFiles: [], warnings: [`Plan import for Dropbox folder ${sourceFolderId ?? sourceFolderUrl} into job ${jobId}. Codex must enumerate files through official APIs only.`] };
  },
  async planFolderExport({ destinationFolderId, destinationFolderPath, archiveStorageKey }) {
    return { dryRun: true, providerKey: 'dropbox', destination: destinationFolderId ?? destinationFolderPath ?? 'dropbox-destination', plannedOperations: [`Upload ${archiveStorageKey ?? 'delivery.zip'} to Dropbox destination`], warnings: ['Dropbox export must remain feature-flagged and audited.'] };
  },
};
