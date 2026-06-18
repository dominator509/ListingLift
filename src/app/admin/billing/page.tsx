import { StripeBillingSummaryCards, StripeCheckoutMappingTable, StripeWebhookHealthPanel, AdminStripeRiskPanel } from '@/components/billing';
import { LinkButton } from '@/components/ui/button';

export default function AdminBillingPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Phase 17</p>
          <h1 className="text-3xl font-bold text-slate-950">Stripe Checkout and Billing</h1>
          <p className="mt-3 max-w-3xl text-slate-600">Manage package checkout, subscriptions, retainers, agency plans, and credit purchases through feature-flagged Stripe scaffolds with manual fallback.</p>
        </div>
        <div className="flex gap-2"><LinkButton href="/admin/billing/stripe" variant="secondary">Stripe setup</LinkButton><LinkButton href="/admin/billing/manual-invoices" variant="secondary">Manual invoices</LinkButton></div>
      </div>
      <StripeBillingSummaryCards />
      <StripeCheckoutMappingTable />
      <StripeWebhookHealthPanel />
      <AdminStripeRiskPanel />
    </main>
  );
}
