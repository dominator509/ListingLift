import { AUTOMATION_PROVIDERS } from '@/domain/automation-webhooks';
import { AutomationProviderCard, AutomationSafetyPanel, AutomationTriggerActionTable, AutomationWebhookTestPanel } from '@/components/automation-webhooks';

export default function AdminAutomationWebhooksPage() {
  return (
    <main className="space-y-6 p-6">
      <div><p className="text-sm font-medium uppercase tracking-wide text-blue-700">Phase 29</p><h1 className="text-3xl font-bold text-slate-950">Automation webhooks</h1><p className="mt-2 max-w-3xl text-slate-600">Configure optional, feature-flagged automation providers for redacted outbound workflow notifications. Manual fallback remains required for every fulfillment path.</p></div>
      <section className="grid gap-4 md:grid-cols-2">{AUTOMATION_PROVIDERS.map((provider) => <AutomationProviderCard key={provider.key} provider={provider} />)}</section>
      <AutomationTriggerActionTable />
      <AutomationWebhookTestPanel />
      <AutomationSafetyPanel />
    </main>
  );
}
