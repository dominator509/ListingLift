import { Card } from '@/components/ui/card';

export function FiverrManualOrderForm() {
  return (
    <Card title="Manual Fiverr order intake" description="Operator enters order details from Fiverr. Codex must wire this form to tenant-scoped Prisma mutations and audit logs.">
      <form className="grid gap-4 md:grid-cols-2">
        {[
          ['orderId', 'Fiverr order ID'],
          ['buyerUsername', 'Buyer username'],
          ['gigTitle', 'Gig title'],
          ['packagePurchased', 'Package purchased'],
          ['orderAmount', 'Order amount'],
          ['deadline', 'Deadline'],
        ].map(([name, label]) => (
          <label key={name} className="space-y-1 text-sm font-medium text-slate-700">
            <span>{label}</span>
            <input name={name} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder={label} />
          </label>
        ))}
        <label className="space-y-1 text-sm font-medium text-slate-700 md:col-span-2">
          <span>Order instructions / client notes</span>
          <textarea className="min-h-28 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Paste relevant Fiverr order instructions. Do not paste marketplace passwords or private data beyond fulfillment needs." />
        </label>
        <div className="md:col-span-2 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          Seed UI only. Manual order creation must be server-authorized, tenant-scoped, deduped by Fiverr order ID, and audited before production.
        </div>
      </form>
    </Card>
  );
}
