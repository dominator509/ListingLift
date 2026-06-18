import { BillingLicenseGatePanel, SubscriptionEntitlementPanel, SubscriptionStatusCard } from '@/components/billing';

export default function AdminSubscriptionsPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Phase 19</p>
        <h1 className="text-3xl font-bold text-slate-950">Subscriptions and entitlements</h1>
        <p className="mt-3 max-w-3xl text-slate-600">Track monthly seller retainers, agency white-label seats, entitlement status, allowance usage, and billing-gated access.</p>
      </div>
      <SubscriptionStatusCard status="ACTIVE" />
      <SubscriptionEntitlementPanel />
      <BillingLicenseGatePanel />
    </main>
  );
}
