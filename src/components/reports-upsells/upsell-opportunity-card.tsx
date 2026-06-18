export function UpsellOpportunityCard({ title, reason, score }: { title: string; reason: string; score: number }) {
  return (
    <article className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-slate-950">{title}</h3>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">Score {score}</span>
      </div>
      <p className="mt-2 text-sm text-slate-600">{reason}</p>
      <p className="mt-3 text-xs text-slate-500">Manual review required before sending.</p>
    </article>
  );
}
