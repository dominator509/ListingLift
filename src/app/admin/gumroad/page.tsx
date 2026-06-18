import { GumroadAdminNotificationPanel, GumroadOfferMappingTable, GumroadPurchaseIntakeCard, GumroadUploadLinkPlan, GumroadWebhookHealthPanel } from '@/components/gumroad';

export default function AdminGumroadPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Sales channel</p>
      <h1 className="text-3xl font-bold text-slate-950">Gumroad checkout and webhook intake</h1>
      <p className="max-w-3xl text-slate-600">
        Gumroad purchases normalize into ListingLift jobs, credit ledger entries, dashboard access actions, or digital-only records. All automated fulfillment must be gated by verified webhook signatures, dedupe checks, and server-side package mapping.
      </p>
      <GumroadWebhookHealthPanel />
      <GumroadOfferMappingTable />
      <div className="grid gap-6 lg:grid-cols-2">
        <GumroadPurchaseIntakeCard />
        <GumroadUploadLinkPlan />
      </div>
      <GumroadAdminNotificationPanel />
    </main>
  );
}
