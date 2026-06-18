import { AUTOMATION_PROVIDERS, AUTOMATION_TRIGGERS, AUTOMATION_WEBHOOK_SECURITY_RULES, getAutomationProvider, type AutomationActionKey, type AutomationTriggerKey, type AutomationWebhookProviderKey } from '@/domain/automation-webhooks';

export function listAutomationWebhookPolicies() {
  return { providers: AUTOMATION_PROVIDERS, triggers: AUTOMATION_TRIGGERS, rules: AUTOMATION_WEBHOOK_SECURITY_RULES };
}

export function evaluateAutomationProviderReadiness(input: { providerKey: AutomationWebhookProviderKey; encryptedSecretId?: string; realIntegrationsEnabled?: boolean; providerEnabled?: boolean }) {
  const provider = getAutomationProvider(input.providerKey);
  const warnings: string[] = [];
  if (provider.key !== 'internal_mock' && !input.providerEnabled) warnings.push(`${provider.enabledEnvVar} must be enabled before this provider can dispatch.`);
  if (provider.realCallsEnvVar && !input.realIntegrationsEnabled) warnings.push(`${provider.realCallsEnvVar} must be enabled before real webhook calls.`);
  if (provider.secretFields.length > 0 && !input.encryptedSecretId) warnings.push('Encrypted secret reference is required before real webhook dispatch.');
  return { provider, ready: provider.key === 'internal_mock' || warnings.length === 0, warnings };
}

export function ensureActionSupported(input: { providerKey: AutomationWebhookProviderKey; actionKey: AutomationActionKey }) {
  const provider = getAutomationProvider(input.providerKey);
  if (!provider.supportedActions.includes(input.actionKey)) {
    return { allowed: false, reason: `${provider.label} does not support action ${input.actionKey}.` };
  }
  return { allowed: true, reason: 'Action supported by provider.' };
}

export function shouldTriggerBeClientVisible(triggerKey: AutomationTriggerKey) {
  return AUTOMATION_TRIGGERS.find((trigger) => trigger.key === triggerKey)?.clientVisible ?? false;
}
