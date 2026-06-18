import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { NormalizedExternalOrder } from '@/schemas/sales-channel';

export function NormalizedOrderCard({ order }: { order: NormalizedExternalOrder }) {
  return (
    <Card title="Normalized order preview" description="This is the canonical order shape every channel must produce before ListingLift creates client and job records.">
      <dl className="grid gap-4 text-sm md:grid-cols-2">
        <div><dt className="font-medium text-slate-500">Channel</dt><dd className="mt-1"><Badge tone="purple">{order.channelName}</Badge></dd></div>
        <div><dt className="font-medium text-slate-500">External order ID</dt><dd className="mt-1 font-mono text-slate-900">{order.externalOrderId}</dd></div>
        <div><dt className="font-medium text-slate-500">Buyer</dt><dd className="mt-1 text-slate-900">{order.buyerName ?? order.buyerEmailOrUsername ?? 'Not provided'}</dd></div>
        <div><dt className="font-medium text-slate-500">Package</dt><dd className="mt-1 text-slate-900">{order.packageKey ?? order.packagePurchased}</dd></div>
        <div><dt className="font-medium text-slate-500">Payment</dt><dd className="mt-1"><Badge tone={order.paymentStatus === 'PAID' || order.paymentStatus === 'MANUAL_CONFIRMED' ? 'green' : 'amber'}>{order.paymentStatus}</Badge></dd></div>
        <div><dt className="font-medium text-slate-500">Fulfillment</dt><dd className="mt-1"><Badge tone="slate">{order.fulfillmentStatus}</Badge></dd></div>
      </dl>
    </Card>
  );
}
