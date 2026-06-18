import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LinkButton } from '@/components/ui/button';

export function StripeCheckoutPlanCard({ title, description, price, href, mode }: { title: string; description: string; price: string; href: string; mode: 'payment' | 'subscription' }) {
  return (
    <Card title={title} description={description} footer={<LinkButton href={href}>Review checkout</LinkButton>}>
      <div className="flex items-center justify-between gap-4">
        <p className="text-3xl font-bold text-slate-950">{price}</p>
        <Badge tone={mode === 'subscription' ? 'purple' : 'blue'}>{mode}</Badge>
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-500">Stripe calls are feature-flagged. Manual fallback must remain available for every paid fulfillment path.</p>
    </Card>
  );
}
