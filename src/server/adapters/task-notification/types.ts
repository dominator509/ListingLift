import type { TaskNotificationActionKey, TaskNotificationProviderKey } from '@/domain/task-notification-integrations';

export type TaskNotificationAdapterRequest = {
  organizationId: string;
  providerKey: TaskNotificationProviderKey;
  actionKey: TaskNotificationActionKey;
  title?: string;
  message?: string;
  payload: Record<string, unknown>;
  dryRun: boolean;
};

export type TaskNotificationAdapterResult = {
  ok: boolean;
  providerKey: TaskNotificationProviderKey;
  actionKey: TaskNotificationActionKey;
  externalId?: string;
  status: 'DRY_RUN' | 'SENT' | 'SKIPPED' | 'FAILED' | 'MANUAL_FALLBACK';
  message: string;
  redactedPayload?: Record<string, unknown>;
};

export type TaskNotificationAdapter = {
  key: TaskNotificationProviderKey;
  label: string;
  actions: TaskNotificationActionKey[];
  healthCheck: () => Promise<{ ok: boolean; message: string }>;
  execute: (request: TaskNotificationAdapterRequest) => Promise<TaskNotificationAdapterResult>;
};
