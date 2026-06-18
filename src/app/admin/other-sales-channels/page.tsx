import { GenericChannelRevenueSummaryCard, GenericFollowUpStatusPanel, GenericProposalTemplatePanel, GenericSalesChannelSafetyPanel, OtherSalesChannelCatalogTable, OtherSalesChannelWorkflowBoard } from '@/components/other-sales-channels';

export default function AdminOtherSalesChannelsPage() {
  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Other sales channels</h1>
        <p className="mt-3 max-w-3xl text-slate-600">Manual-first source tracking for Freelancer, PeoplePerHour, Guru, Contra, Thumbtack, Bark, Houzz, social profiles, directories, launch platforms, and communities.</p>
      </div>
      <OtherSalesChannelWorkflowBoard />
      <GenericChannelRevenueSummaryCard />
      <OtherSalesChannelCatalogTable />
      <GenericProposalTemplatePanel />
      <GenericFollowUpStatusPanel />
      <GenericSalesChannelSafetyPanel />
    </main>
  );
}
