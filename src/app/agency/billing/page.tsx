import { AgencyBillingVolumePanel, AgencyGuardrailPanel } from '@/components/agency-white-label';
import { StripeCheckoutPlanCard, SubscriptionStatusCard } from '@/components/billing';
import { PageHeader } from '@/components/ui/page-header';
import { buildAgencyVolumePricingQuote } from '@/server/services/agency-billing-service';

export default function AgencyBillingPage() {
  const quote = buildAgencyVolumePricingQuote({ monthlyImageVolume: 596, workspaceCount: 3, rushQueueEnabled: true, brandedReportsEnabled: true, apiAccessRequested: false, currency: 'USD' });
  return (
    <main>
      <PageHeader
        eyebrow="Agency billing"
        title="Subscriptions and volume pricing"
        description="Agency plan, volume estimate, credits/subscription status, and manual-review billing gates. Codex must derive billing from verified records before production use."
      />
      <div className="space-y-6">
        <SubscriptionStatusCard />
        <StripeCheckoutPlanCard title="Agency White-Label Image Fulfillment" description="Subscription checkout scaffold for agency plans and volume pricing." price="$1,000–$3,000/mo" href="/agency/billing" mode="subscription" />
        <AgencyBillingVolumePanel quote={quote} />
        <AgencyGuardrailPanel />
      </div>
    </main>
  );
}
