import { Card } from '@/components/ui/card';

export function GumroadPurchaseIntakeCard() {
  return (
    <Card title="Purchase intake flow" description="Verified Gumroad sales normalize into the same ListingLift order/job model as Stripe, Fiverr, Upwork, and manual orders.">
      <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
        <li>Verify webhook signature or hold for manual review.</li>
        <li>Dedupe by Gumroad sale ID and product ID.</li>
        <li>Map product/permalink to package, credit pack, or digital-only item.</li>
        <li>Create or update client and external order records.</li>
        <li>Create a job, apply credits, or grant dashboard/agency setup according to the mapping.</li>
        <li>Create an upload link and admin notification when fulfillment is required.</li>
      </ol>
    </Card>
  );
}
