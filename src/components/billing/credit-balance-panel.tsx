import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function CreditBalancePanel({ balance = 40, used = 10, added = 50 }: { balance?: number; used?: number; added?: number }) {
  return (
    <Card title="Credit balance" description="Credits are internal fulfillment allowance. They do not guarantee marketplace approval, sales, ranking, conversion, or ad performance.">
      <div className="grid gap-4 sm:grid-cols-3">
        <div><p className="text-sm text-slate-500">Available</p><p className="text-3xl font-bold text-slate-950">{balance}</p></div>
        <div><p className="text-sm text-slate-500">Added</p><p className="text-2xl font-semibold text-slate-900">{added}</p></div>
        <div><p className="text-sm text-slate-500">Used</p><p className="text-2xl font-semibold text-slate-900">{used}</p></div>
      </div>
      <Badge tone="amber">Audit every manual adjustment</Badge>
    </Card>
  );
}
