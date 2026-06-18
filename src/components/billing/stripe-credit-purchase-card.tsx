import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function StripeCreditPurchaseCard() {
  return (
    <Card title="Image credit purchase" description="Credit purchases become ledger entries only after a verified paid Stripe event.">
      <div className="grid gap-3 sm:grid-cols-3">
        {[25, 50, 100].map((amount) => (
          <button key={amount} type="button" className="rounded-xl border border-slate-200 p-4 text-left hover:bg-slate-50">
            <span className="block text-lg font-semibold text-slate-950">{amount} credits</span>
            <span className="text-sm text-slate-500">${amount}</span>
          </button>
        ))}
      </div>
      <Button type="button" className="mt-5">Create server-side checkout draft</Button>
    </Card>
  );
}
