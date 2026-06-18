import { describe, expect, it } from 'vitest';
import { validateTaskNotificationSecretReference } from '@/server/services/task-notification-secret-service';

describe('task notification secret safety', () => {
  it('rejects plaintext secret fields', () => {
    const result = validateTaskNotificationSecretReference({ providerKey: 'slack', encryptedSecretId: 'secret_ref', plaintextConfig: { SLACK_BOT_TOKEN: 'xoxb-secret' } });
    expect(result.ok).toBe(false);
    expect(result.plaintextSecretKeysRejected).toContain('SLACK_BOT_TOKEN');
  });
});
