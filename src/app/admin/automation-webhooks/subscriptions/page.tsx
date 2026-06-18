import { AutomationSubscriptionForm, AutomationTriggerActionTable } from '@/components/automation-webhooks';

export default function AutomationSubscriptionsPage() {
  return <main className="space-y-6 p-6"><div><p className="text-sm font-medium uppercase tracking-wide text-blue-700">Phase 29</p><h1 className="text-3xl font-bold text-slate-950">Automation subscriptions</h1><p className="mt-2 max-w-3xl text-slate-600">Create dry-run subscriptions that Codex must later persist with RBAC, encrypted secret references, rate limits, and audit logs.</p></div><AutomationSubscriptionForm /><AutomationTriggerActionTable /></main>;
}
