import { GenericManualOrderForm, GenericSalesChannelSafetyPanel } from '@/components/other-sales-channels';

export default function OtherSalesChannelsManualOrderPage() {
  return (
    <main className="mx-auto grid max-w-5xl gap-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Manual source order</h1>
        <p className="mt-3 text-slate-600">Create a normalized ListingLift lead/order/job draft from any Phase 23 source.</p>
      </div>
      <GenericManualOrderForm />
      <GenericSalesChannelSafetyPanel />
    </main>
  );
}
