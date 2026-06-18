import { Card } from '@/components/ui/card';

export function ClientBillingPanel({ creditsRemaining = 0, subscriptionStatus = 'manual-or-unconfigured' }: { creditsRemaining?: number; subscriptionStatus?: string }) {
  return (
    <Card title="Billing and allowance" description="Credits, retainers, and subscriptions are derived server-side from verified billing records.">
      <dl className="grid gap-4 text-sm sm:grid-cols-2">
        <div><dt className="text-slate-500">Credits remaining</dt><dd className="mt-1 text-2xl font-bold text-slate-950">{creditsRemaining}</dd></div>
        <div><dt className="text-slate-500">Subscription</dt><dd className="mt-1 font-semibold text-slate-950">{subscriptionStatus}</dd></div>
      </dl>
    </Card>
  );
}
