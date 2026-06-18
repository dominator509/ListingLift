import { AutomationWebhookTestPanel, AutomationSafetyPanel } from '@/components/automation-webhooks';

export default function AutomationTestPage() {
  return <main className="space-y-6 p-6"><div><p className="text-sm font-medium uppercase tracking-wide text-blue-700">Phase 29</p><h1 className="text-3xl font-bold text-slate-950">Automation webhook test</h1><p className="mt-2 max-w-3xl text-slate-600">Send dry-run automation payloads before enabling any real provider calls.</p></div><AutomationWebhookTestPanel /><AutomationSafetyPanel /></main>;
}
