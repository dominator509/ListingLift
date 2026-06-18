import { GenericChannelRevenueSummaryCard, GenericFollowUpStatusPanel } from '@/components/other-sales-channels';

export default function OtherSalesChannelsFollowUpsPage() {
  return (
    <main className="mx-auto grid max-w-5xl gap-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Generic channel follow-ups</h1>
        <p className="mt-3 text-slate-600">Track manual follow-up status and retainer conversion opportunities without automating platform messages.</p>
      </div>
      <GenericFollowUpStatusPanel />
      <GenericChannelRevenueSummaryCard />
    </main>
  );
}
