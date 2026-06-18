import type { FileStorageProviderKey } from '@/domain/file-storage';
import type { FileStorageAdapter } from './types';
import { mockFileStorageAdapter } from './mock-storage-adapter';
import { localFileStorageAdapter } from './local-storage-adapter';
import { googleDriveStorageAdapter } from './google-drive-storage-adapter';
import { dropboxStorageAdapter } from './dropbox-storage-adapter';

export const fileStorageAdapterRegistry: Record<FileStorageProviderKey, FileStorageAdapter> = {
  mock: mockFileStorageAdapter,
  local: localFileStorageAdapter,
  google_drive: googleDriveStorageAdapter,
  dropbox: dropboxStorageAdapter,
  onedrive_later: mockFileStorageAdapter,
  box_later: mockFileStorageAdapter,
};

export function getFileStorageAdapter(providerKey: FileStorageProviderKey) {
  const adapter = fileStorageAdapterRegistry[providerKey];
  if (!adapter) throw new Error(`Unsupported file storage adapter: ${providerKey}`);
  return adapter;
}

export function listFileStorageAdapters() {
  return Object.values(fileStorageAdapterRegistry).map((adapter) => ({
    key: adapter.key,
    label: adapter.label,
    capabilities: adapter.capabilities,
    enabled: adapter.isEnabled(),
  }));
}
