import { buildOtherSalesChannelProposalTemplate } from '@/domain/generic-sales-channels';

export function GenericProposalTemplatePanel() {
  const template = buildOtherSalesChannelProposalTemplate({ channelLabel: 'selected source', packageLabel: 'Marketplace Listing Pack', imageCount: 25 });
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-950">Proposal template</h2>
      <p className="mt-2 text-sm text-slate-600">Copy is compliance-safe and avoids marketplace approval or sales guarantees.</p>
      <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-950 p-4 text-sm text-slate-100">{template}</pre>
    </section>
  );
}
