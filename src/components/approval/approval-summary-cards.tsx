type Props = { ready: number; blocked: number; revisions: number; approved: number };
export function ApprovalSummaryCards({ ready, blocked, revisions, approved }: Props) {
  const cards = [
    { label: 'Ready for review', value: ready, help: 'Jobs with QC complete and pending manual decision.' },
    { label: 'Blocked', value: blocked, help: 'Jobs with flags, open revisions, or missing replacements.' },
    { label: 'Open revisions', value: revisions, help: 'Revision requests that must be resolved before delivery.' },
    { label: 'Approved', value: approved, help: 'Approved jobs still require delivery workflow before downloads.' },
  ];
  return <section className="grid gap-4 md:grid-cols-4">{cards.map((card) => <div key={card.label} className="rounded-2xl border bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{card.label}</p><p className="mt-2 text-3xl font-semibold text-slate-950">{card.value}</p><p className="mt-2 text-xs text-slate-500">{card.help}</p></div>)}</section>;
}
