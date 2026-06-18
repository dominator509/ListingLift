import { TASK_NOTIFICATION_PROVIDERS, getTaskNotificationProvider, providerSupportsAction, type TaskNotificationActionKey, type TaskNotificationProviderKey } from '@/domain/task-notification-integrations';
import { listTaskNotificationAdapters } from '@/server/adapters/task-notification/registry';

export function listTaskNotificationProviders() {
  const adapters = listTaskNotificationAdapters();
  return TASK_NOTIFICATION_PROVIDERS.map((provider) => ({
    ...provider,
    adapterRegistered: adapters.some((adapter) => adapter.key === provider.key),
  }));
}

export function buildTaskNotificationProviderReadiness(input: { providerKey: TaskNotificationProviderKey; actionKey?: TaskNotificationActionKey; env?: Record<string, string | undefined> }) {
  const provider = getTaskNotificationProvider(input.providerKey);
  const env = input.env ?? process.env;
  const providerFlag = env[provider.enabledEnvVar] === 'true';
  const realFlag = provider.realCallsEnvVar ? env[provider.realCallsEnvVar] === 'true' : true;
  const supportsAction = input.actionKey ? providerSupportsAction(input.providerKey, input.actionKey) : true;
  const missingSecrets = provider.secretFields.filter((field) => !env[field]);
  const realCallsAllowed = providerFlag && realFlag && missingSecrets.length === 0 && supportsAction;
  return {
    providerKey: input.providerKey,
    label: provider.label,
    providerFlag,
    realFlag,
    supportsAction,
    missingSecrets,
    realCallsAllowed,
    manualFallbackAvailable: provider.manualFallbackAvailable,
    message: realCallsAllowed ? 'Provider is ready for real calls.' : 'Provider is dry-run/manual-fallback only until Codex verifies flags and secrets.',
  };
}
