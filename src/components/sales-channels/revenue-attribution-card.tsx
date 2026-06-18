import { Card } from '@/components/ui/card';

export function RevenueAttributionCard() {
  return (
    <Card title="Revenue attribution" description="Source attribution must stay connected from external order to job, report, dashboard, upsells, and billing analytics.">
      <div className="grid gap-4 text-sm md:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-4"><p className="font-medium text-slate-950">Source channel</p><p className="mt-1 text-slate-600">Canonical sales channel key and adapter key.</p></div>
        <div className="rounded-xl bg-slate-50 p-4"><p className="font-medium text-slate-950">Order amount</p><p className="mt-1 text-slate-600">Server-side cents, currency, and package mapping.</p></div>
        <div className="rounded-xl bg-slate-50 p-4"><p className="font-medium text-slate-950">Job linkage</p><p className="mt-1 text-slate-600">Internal client, external order, and job IDs.</p></div>
      </div>
    </Card>
  );
}
