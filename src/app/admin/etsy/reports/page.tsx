import { EtsyVisualReportPanel, EtsySafetyPanel } from '@/components/etsy';

export default function AdminEtsyReportsPage() {
  return (
    <main className="mx-auto grid max-w-5xl gap-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Etsy reports</h1>
        <p className="mt-3 text-slate-600">Prepare shop visual consistency notes and listing sequence recommendations with marketplace-safe language.</p>
      </div>
      <EtsyVisualReportPanel />
      <EtsySafetyPanel />
    </main>
  );
}
