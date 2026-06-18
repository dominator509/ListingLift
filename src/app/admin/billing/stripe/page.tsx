import { AdminStripeRiskPanel, StripeWebhookHealthPanel, StripeCreditPurchaseCard, SubscriptionStatusCard } from '@/components/billing';
import { Card } from '@/components/ui/card';

export default function AdminStripeBillingPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Stripe setup</p>
      <h1 className="text-3xl font-bold text-slate-950">Stripe billing control room</h1>
      <Card title="Feature flags" description="Stripe must remain disabled unless environment variables and tests are verified.">
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="font-semibold text-slate-900">STRIPE_ENABLED</dt><dd className="text-slate-600">false by default</dd></div>
          <div><dt className="font-semibold text-slate-900">REAL_INTEGRATIONS_ENABLED</dt><dd className="text-slate-600">false by default</dd></div>
          <div><dt className="font-semibold text-slate-900">STRIPE_SECRET_KEY</dt><dd className="text-slate-600">server-side only</dd></div>
          <div><dt className="font-semibold text-slate-900">STRIPE_WEBHOOK_SECRET</dt><dd className="text-slate-600">server-side only</dd></div>
        </dl>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <SubscriptionStatusCard />
        <StripeCreditPurchaseCard />
      </div>
      <StripeWebhookHealthPanel />
      <AdminStripeRiskPanel />
    </main>
  );
}
