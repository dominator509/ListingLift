import { REPORT_SAFE_CLAIMS } from '@/domain/reports-upsells';

export function ReportBuilderPanel() {
  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Report builder</h2>
      <p className="mt-2 text-sm text-slate-600">
        Build delivery summaries, image quality reports, monthly cleanup reports, and white-label reports from approved job data.
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
        {REPORT_SAFE_CLAIMS.map((claim) => (
          <li key={claim}>{claim}</li>
        ))}
      </ul>
    </section>
  );
}
