import type { FileStorageCapability, FileStorageObjectKind, FileStorageProviderKey } from '@/domain/file-storage';

export type FileStorageAdapterConfig = {
  providerKey: FileStorageProviderKey;
  organizationId: string;
  connectionId?: string;
  encryptedSecretId?: string;
  rootFolderId?: string;
  rootFolderPath?: string;
  config?: Record<string, unknown>;
};

export type StorageObjectMetadata = {
  storageKey: string;
  fileName: string;
  contentType?: string;
  sizeBytes?: number;
  checksumSha256?: string;
  objectKind: FileStorageObjectKind;
};

export type FileStorageAccessPlan = {
  providerKey: FileStorageProviderKey;
  storageKey: string;
  accessUrl?: string;
  expiresAt?: string;
  serverMediated: boolean;
  decision: 'ALLOW' | 'DRY_RUN' | 'DENY';
  warnings: string[];
};

export type FileStorageAdapterHealth = {
  providerKey: FileStorageProviderKey;
  ok: boolean;
  status: 'MOCK' | 'HEALTHY' | 'DISABLED' | 'NEEDS_AUTH' | 'FAILED';
  message: string;
  checkedAt: string;
};

export interface FileStorageAdapter {
  key: FileStorageProviderKey;
  label: string;
  capabilities: FileStorageCapability[];
  isEnabled(): boolean;
  healthCheck(config: FileStorageAdapterConfig): Promise<FileStorageAdapterHealth>;
  createReadAccess(input: { config: FileStorageAdapterConfig; storageKey: string; expiresInSeconds: number }): Promise<FileStorageAccessPlan>;
  createWriteAccess(input: { config: FileStorageAdapterConfig; storageKey: string; expiresInSeconds: number; metadata?: StorageObjectMetadata }): Promise<FileStorageAccessPlan>;
  planFolderImport(input: { config: FileStorageAdapterConfig; sourceFolderId?: string; sourceFolderUrl?: string; jobId: string }): Promise<{ dryRun: boolean; providerKey: FileStorageProviderKey; plannedFiles: StorageObjectMetadata[]; warnings: string[] }>;
  planFolderExport(input: { config: FileStorageAdapterConfig; destinationFolderId?: string; destinationFolderPath?: string; archiveStorageKey?: string }): Promise<{ dryRun: boolean; providerKey: FileStorageProviderKey; destination: string; plannedOperations: string[]; warnings: string[] }>;
}
