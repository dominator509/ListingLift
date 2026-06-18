export function ReportMetricCard({ label, value, trend }: { label: string; value: string; trend?: string }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
      {trend ? <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">Trend: {trend}</p> : null}
    </div>
  );
}
