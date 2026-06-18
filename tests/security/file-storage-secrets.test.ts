import { describe, expect, it } from 'vitest';
import { FILE_STORAGE_PROVIDERS } from '@/domain/file-storage';

describe('file-storage secrets', () => {
  it('documents secret fields without storing values', () => {
    const google = FILE_STORAGE_PROVIDERS.find((provider) => provider.key === 'google_drive');
    expect(google?.secretFields).toContain('GOOGLE_DRIVE_REFRESH_TOKEN');
    expect(JSON.stringify(FILE_STORAGE_PROVIDERS)).not.toContain('sk_');
    expect(JSON.stringify(FILE_STORAGE_PROVIDERS)).not.toContain('refresh_token_value');
  });
});
