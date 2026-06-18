import { GenericFollowUpStatusPanel, GenericProposalTemplatePanel } from '@/components/other-sales-channels';

export default function OtherSalesChannelsTemplatesPage() {
  return (
    <main className="mx-auto grid max-w-5xl gap-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Proposal and follow-up templates</h1>
        <p className="mt-3 text-slate-600">Manual operator copy for generic sales sources. No automated platform messaging.</p>
      </div>
      <GenericProposalTemplatePanel />
      <GenericFollowUpStatusPanel />
    </main>
  );
}
