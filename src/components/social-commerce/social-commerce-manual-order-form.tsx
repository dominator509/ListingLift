import { Card } from '@/components/ui/card';
import { DEFAULT_SOCIAL_COMMERCE_CHANNELS } from '@/domain/social-commerce';

export function SocialCommerceManualOrderForm() {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold">Manual social-commerce order intake</h2>
      <p className="mt-2 text-sm text-muted-foreground">Seed UI shell for collecting source channel, buyer handle, product names, creative formats, delivery context, and safe manual workflow notes.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="text-sm">Channel<select className="mt-1 w-full rounded-md border p-2">{DEFAULT_SOCIAL_COMMERCE_CHANNELS.map((channel) => <option key={channel.key}>{channel.label}</option>)}</select></label>
        <label className="text-sm">External reference<input className="mt-1 w-full rounded-md border p-2" placeholder="Order, DM, post, or source reference" /></label>
        <label className="text-sm">Buyer handle/email<input className="mt-1 w-full rounded-md border p-2" placeholder="@buyer or email" /></label>
        <label className="text-sm">Product names<input className="mt-1 w-full rounded-md border p-2" placeholder="Comma-separated products" /></label>
      </div>
    </Card>
  );
}
