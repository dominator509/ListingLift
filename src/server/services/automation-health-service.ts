import { listAutomationWebhookAdapters } from '@/server/adapters/automation-webhook/registry';
import { AUTOMATION_PROVIDERS } from '@/domain/automation-webhooks';

export async function buildAutomationHealthSummary() {
  return {
    providers: AUTOMATION_PROVIDERS.map((provider) => ({
      key: provider.key,
      label: provider.label,
      enabledEnvVar: provider.enabledEnvVar,
      realCallsEnvVar: provider.realCallsEnvVar,
      manualFallbackAvailable: provider.manualFallbackAvailable,
      safe: true,
    })),
    adapters: listAutomationWebhookAdapters(),
    message: 'Automation webhook health is scaffolded. Codex must add real dispatch checks in runtime.',
  };
}
