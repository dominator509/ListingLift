import { getTaskNotificationAdapter, listTaskNotificationAdapters } from '@/server/adapters/task-notification/registry';
import { buildTaskNotificationProviderReadiness } from './task-notification-provider-service';

export async function buildTaskNotificationHealthSummary() {
  const providers = await Promise.all(listTaskNotificationAdapters().map(async (adapterSummary) => {
    const adapter = getTaskNotificationAdapter(adapterSummary.key);
    const health = await adapter.healthCheck();
    const readiness = buildTaskNotificationProviderReadiness({ providerKey: adapterSummary.key });
    return { ...adapterSummary, health, readiness };
  }));
  return { ok: true, providers, note: 'Codex must replace dry-run health with real provider/API checks where enabled.' };
}
