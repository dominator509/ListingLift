import { getTaskNotificationProvider, type TaskNotificationProviderKey } from '@/domain/task-notification-integrations';

export function validateTaskNotificationSecretReference(input: { providerKey: TaskNotificationProviderKey; encryptedSecretId?: string; plaintextConfig?: Record<string, unknown> }) {
  const provider = getTaskNotificationProvider(input.providerKey);
  const plaintextKeys = Object.keys(input.plaintextConfig ?? {}).filter((key) => provider.secretFields.includes(key) || /token|secret|password|private/i.test(key));
  return {
    providerKey: input.providerKey,
    encryptedSecretRequired: provider.secretFields.length > 0,
    encryptedSecretProvided: Boolean(input.encryptedSecretId),
    plaintextSecretKeysRejected: plaintextKeys,
    ok: plaintextKeys.length === 0 && (provider.secretFields.length === 0 || Boolean(input.encryptedSecretId)),
  };
}
