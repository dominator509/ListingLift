import { FILE_STORAGE_PROVIDERS } from '@/domain/file-storage';
import type { FileStorageAdapter } from './types';

const definition = FILE_STORAGE_PROVIDERS.find((provider) => provider.key === 'google_drive')!;
const enabled = () => process.env.GOOGLE_DRIVE_ENABLED === 'true' && process.env.REAL_INTEGRATIONS_ENABLED === 'true';

export const googleDriveStorageAdapter: FileStorageAdapter = {
  key: 'google_drive',
  label: definition.label,
  capabilities: definition.capabilities,
  isEnabled: enabled,
  async healthCheck(config) {
    const ok = enabled() && Boolean(config.encryptedSecretId);
    return { providerKey: 'google_drive', ok, status: ok ? 'HEALTHY' : 'NEEDS_AUTH', message: ok ? 'Google Drive scaffold is configured.' : 'Google Drive requires feature flags and encrypted OAuth secret references.', checkedAt: new Date().toISOString() };
  },
  async createReadAccess({ storageKey }) {
    return { providerKey: 'google_drive', storageKey, serverMediated: true, decision: 'DRY_RUN', warnings: ['Google Drive read access requires Codex to wire official API calls and encrypted OAuth credentials.'] };
  },
  async createWriteAccess({ storageKey }) {
    return { providerKey: 'google_drive', storageKey, serverMediated: true, decision: 'DRY_RUN', warnings: ['Google Drive write access requires Codex to wire official API calls and encrypted OAuth credentials.'] };
  },
  async planFolderImport({ sourceFolderId, sourceFolderUrl, jobId }) {
    return { dryRun: true, providerKey: 'google_drive', plannedFiles: [], warnings: [`Plan import for Google Drive folder ${sourceFolderId ?? sourceFolderUrl} into job ${jobId}. Codex must enumerate files through official APIs only.`] };
  },
  async planFolderExport({ destinationFolderId, destinationFolderPath, archiveStorageKey }) {
    return { dryRun: true, providerKey: 'google_drive', destination: destinationFolderId ?? destinationFolderPath ?? 'google-drive-destination', plannedOperations: [`Upload ${archiveStorageKey ?? 'delivery.zip'} to Google Drive destination`], warnings: ['Google Drive export must remain feature-flagged and audited.'] };
  },
};
