export type FileStorageProviderKey = 'local' | 'mock' | 'google_drive' | 'dropbox' | 'onedrive_later' | 'box_later';
export type FileStorageConnectionStatus = 'DISABLED' | 'MOCK_ENABLED' | 'CONFIGURED' | 'NEEDS_AUTH' | 'HEALTHY' | 'DEGRADED' | 'FAILED' | 'REVOKED';
export type FileStorageCapability =
  | 'DIRECT_UPLOAD'
  | 'DIRECT_DOWNLOAD'
  | 'SIGNED_READ_URL'
  | 'SIGNED_WRITE_URL'
  | 'FOLDER_IMPORT'
  | 'FOLDER_EXPORT'
  | 'ZIP_UPLOAD'
  | 'ZIP_DOWNLOAD'
  | 'OAUTH'
  | 'WEBHOOKS_LATER'
  | 'CREATE_FOLDER';
export type FileStorageObjectKind =
  | 'ORIGINAL_UPLOAD'
  | 'PROCESSED_OUTPUT'
  | 'PREVIEW_IMAGE'
  | 'DELIVERY_ARCHIVE'
  | 'MANIFEST'
  | 'README'
  | 'MANUAL_REPLACEMENT'
  | 'REPORT'
  | 'TEMPORARY_EXPORT';
export type FileStorageOperation = 'UPLOAD' | 'DOWNLOAD' | 'COPY' | 'MOVE' | 'DELETE' | 'LIST' | 'SYNC_IN' | 'SYNC_OUT' | 'HEALTH_CHECK' | 'CREATE_FOLDER';
export type FileStorageAccessDecision = 'ALLOW' | 'DENY_EXPIRED' | 'DENY_REVOKED' | 'DENY_SCOPE' | 'DENY_STATUS' | 'DENY_TENANT' | 'DENY_UNSUPPORTED';

export type FileStorageProviderDefinition = {
  key: FileStorageProviderKey;
  label: string;
  enabledEnvVar?: string;
  realCallsEnvVar?: string;
  capabilities: FileStorageCapability[];
  secretFields: string[];
  manualFallbackAvailable: boolean;
  requiresEncryptedSecretReference: boolean;
  safeDescription: string;
};

export const FILE_STORAGE_SAFE_COPY =
  'ListingLift file-storage integrations preserve original uploads, keep client downloads permission-controlled, and use expiring access where possible. Real integrations must be feature-flagged and credentials must be stored only through encrypted secret references.';

export const FILE_STORAGE_SECURITY_RULES = [
  'Never overwrite original uploads.',
  'Never expose provider credentials, OAuth refresh tokens, API keys, access tokens, or signed URL secrets to the frontend.',
  'Store provider credentials only in encrypted secret records or environment variables.',
  'Use mock/local storage as the baseline so the app works without paid or third-party APIs.',
  'Validate provider, object kind, tenant scope, client scope, job scope, and permission before every read or write.',
  'Use expiring access URLs or server-mediated downloads for client-facing files.',
  'Do not generate public permanent delivery links.',
  'Do not sync or delete files from third-party providers unless the operator explicitly requested the action.',
  'Audit upload, import, export, sync, download, provider health, connection, disconnection, and manual override actions.',
] as const;

export const FILE_STORAGE_PROVIDERS: FileStorageProviderDefinition[] = [
  {
    key: 'local',
    label: 'Local Replit-compatible storage',
    enabledEnvVar: 'LOCAL_FILE_STORAGE_ENABLED',
    realCallsEnvVar: 'LOCAL_FILE_STORAGE_ENABLED',
    capabilities: ['DIRECT_UPLOAD', 'DIRECT_DOWNLOAD', 'FOLDER_IMPORT', 'FOLDER_EXPORT', 'ZIP_UPLOAD', 'ZIP_DOWNLOAD', 'CREATE_FOLDER'],
    secretFields: [],
    manualFallbackAvailable: true,
    requiresEncryptedSecretReference: false,
    safeDescription: 'Local storage is the baseline development and Replit-compatible storage adapter. Codex must replace paths with durable storage where production requires it.',
  },
  {
    key: 'mock',
    label: 'Mock file storage',
    enabledEnvVar: 'MOCK_INTEGRATIONS_ENABLED',
    realCallsEnvVar: 'MOCK_INTEGRATIONS_ENABLED',
    capabilities: ['DIRECT_UPLOAD', 'DIRECT_DOWNLOAD', 'SIGNED_READ_URL', 'SIGNED_WRITE_URL', 'FOLDER_IMPORT', 'FOLDER_EXPORT', 'ZIP_UPLOAD', 'ZIP_DOWNLOAD'],
    secretFields: [],
    manualFallbackAvailable: true,
    requiresEncryptedSecretReference: false,
    safeDescription: 'Mock storage lets tests exercise storage flows without external APIs or paid services.',
  },
  {
    key: 'google_drive',
    label: 'Google Drive',
    enabledEnvVar: 'GOOGLE_DRIVE_ENABLED',
    realCallsEnvVar: 'REAL_INTEGRATIONS_ENABLED',
    capabilities: ['FOLDER_IMPORT', 'FOLDER_EXPORT', 'OAUTH', 'SIGNED_READ_URL', 'WEBHOOKS_LATER'],
    secretFields: ['GOOGLE_DRIVE_CLIENT_ID', 'GOOGLE_DRIVE_CLIENT_SECRET', 'GOOGLE_DRIVE_REFRESH_TOKEN'],
    manualFallbackAvailable: true,
    requiresEncryptedSecretReference: true,
    safeDescription: 'Google Drive integration is a feature-flagged scaffold for client folder intake and delivery export. Manual upload/download must remain available.',
  },
  {
    key: 'dropbox',
    label: 'Dropbox',
    enabledEnvVar: 'DROPBOX_ENABLED',
    realCallsEnvVar: 'REAL_INTEGRATIONS_ENABLED',
    capabilities: ['FOLDER_IMPORT', 'FOLDER_EXPORT', 'OAUTH', 'SIGNED_READ_URL', 'WEBHOOKS_LATER'],
    secretFields: ['DROPBOX_APP_KEY', 'DROPBOX_APP_SECRET', 'DROPBOX_REFRESH_TOKEN'],
    manualFallbackAvailable: true,
    requiresEncryptedSecretReference: true,
    safeDescription: 'Dropbox integration is a feature-flagged scaffold for folder-based intake and export. Manual fallback remains required.',
  },
  {
    key: 'onedrive_later',
    label: 'OneDrive later',
    capabilities: ['FOLDER_IMPORT', 'FOLDER_EXPORT', 'OAUTH'],
    secretFields: [],
    manualFallbackAvailable: true,
    requiresEncryptedSecretReference: true,
    safeDescription: 'OneDrive is a later scaffold and must remain disabled until a real adapter is implemented.',
  },
  {
    key: 'box_later',
    label: 'Box later',
    capabilities: ['FOLDER_IMPORT', 'FOLDER_EXPORT', 'OAUTH'],
    secretFields: [],
    manualFallbackAvailable: true,
    requiresEncryptedSecretReference: true,
    safeDescription: 'Box is a later scaffold and must remain disabled until a real adapter is implemented.',
  },
];

export function getFileStorageProvider(key: FileStorageProviderKey) {
  const provider = FILE_STORAGE_PROVIDERS.find((candidate) => candidate.key === key);
  if (!provider) throw new Error(`Unsupported file storage provider: ${key}`);
  return provider;
}

export function normalizeStoragePath(path: string) {
  if (path.startsWith('/') || path.includes('..') || path.includes('\\0')) {
    throw new Error('Unsafe storage path');
  }
  const normalized = path.replace(/\\\\/g, '/').split('/').filter(Boolean).join('/');
  if (!normalized) {
    throw new Error('Unsafe storage path');
  }
  return normalized;
}

export function buildTenantStorageKey(input: { organizationId: string; jobId?: string; objectKind: FileStorageObjectKind; fileName: string }) {
  const safeName = input.fileName.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-|-$/g, '') || 'file.bin';
  const parts = ['org', input.organizationId, input.jobId ? `job-${input.jobId}` : 'shared', input.objectKind.toLowerCase(), safeName];
  return normalizeStoragePath(parts.join('/'));
}

export function isClientDownloadObjectKind(kind: FileStorageObjectKind) {
  return kind === 'DELIVERY_ARCHIVE' || kind === 'MANIFEST' || kind === 'README' || kind === 'REPORT';
}
