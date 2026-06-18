import { Card } from '@/components/ui/card';

export function FiverrRevenueSummaryCard() {
  return (
    <Card title="Revenue by gig" description="Tracks Fiverr source attribution without depending on private page scraping.">
      <dl className="grid gap-4 text-sm md:grid-cols-3">
        <div><dt className="text-slate-500">Attribution</dt><dd className="font-semibold text-slate-950">ExternalOrder + Job</dd></div>
        <div><dt className="text-slate-500">Dedupe</dt><dd className="font-semibold text-slate-950">Fiverr order ID</dd></div>
        <div><dt className="text-slate-500">Delivery</dt><dd className="font-semibold text-slate-950">Manual Fiverr completion</dd></div>
      </dl>
    </Card>
  );
}
