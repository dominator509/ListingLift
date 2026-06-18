import { describe, expect, it } from 'vitest';
import { evaluateFileStorageProviderReadiness, canExposeObjectToClient } from '@/server/services/file-storage-policy-service';

describe('file-storage policy service', () => {
  it('requires encrypted secret refs for real Google Drive calls', () => {
    const result = evaluateFileStorageProviderReadiness({ providerKey: 'google_drive', realIntegrationsEnabled: true });
    expect(result.ready).toBe(false);
    expect(result.warnings.join(' ')).toContain('Encrypted secret');
  });

  it('allows client-visible delivery archive only after approval', () => {
    expect(canExposeObjectToClient('DELIVERY_ARCHIVE', false).allowed).toBe(false);
    expect(canExposeObjectToClient('DELIVERY_ARCHIVE', true).allowed).toBe(true);
    expect(canExposeObjectToClient('ORIGINAL_UPLOAD', true).allowed).toBe(false);
  });
});
