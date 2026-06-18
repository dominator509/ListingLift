import { Card } from '@/components/ui/card';
import { ProgressBar } from './progress-bar';

export function CreditBalanceCard({ remaining, total, label = 'Image credits' }: { remaining: number; total: number; label?: string }) {
  const used = Math.max(0, total - remaining);
  const percentUsed = total > 0 ? Math.round((used / total) * 100) : 0;
  return (
    <Card title={label} description="Credits are enforced server-side during the billing and fulfillment phases.">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-3xl font-bold text-slate-950">{remaining}</p>
          <p className="text-sm text-slate-500">remaining of {total}</p>
        </div>
        <p className="text-sm font-medium text-slate-600">{used} used</p>
      </div>
      <ProgressBar className="mt-5" value={percentUsed} label="Allowance used" />
    </Card>
  );
}
