import { assertTaskNotificationAction } from '@/server/adapters/task-notification/registry';
import { buildTaskNotificationProviderReadiness } from './task-notification-provider-service';
import type { TaskNotificationActionKey, TaskNotificationProviderKey } from '@/domain/task-notification-integrations';

export async function dispatchTaskNotification(input: { organizationId: string; providerKey: TaskNotificationProviderKey; actionKey: TaskNotificationActionKey; title?: string; message?: string; payload?: Record<string, unknown>; dryRun?: boolean }) {
  const adapter = assertTaskNotificationAction(input.providerKey, input.actionKey);
  const readiness = buildTaskNotificationProviderReadiness({ providerKey: input.providerKey, actionKey: input.actionKey });
  const dryRun = input.dryRun ?? !readiness.realCallsAllowed;
  const result = await adapter.execute({
    organizationId: input.organizationId,
    providerKey: input.providerKey,
    actionKey: input.actionKey,
    title: input.title,
    message: input.message,
    payload: input.payload ?? {},
    dryRun,
  });
  return { readiness, result, manualFallbackRequired: !result.ok || result.status === 'MANUAL_FALLBACK' || result.status === 'FAILED' };
}
