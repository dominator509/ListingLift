import { Card } from '@/components/ui/card';

export function SocialCommerceRevenueSummaryCard() {
  return (
    <Card className="p-4">
      <div className="text-sm text-muted-foreground">Revenue attribution</div>
      <div className="mt-1 text-2xl font-semibold">Manual/social source</div>
      <p className="mt-2 text-sm text-muted-foreground">Revenue is attributed to the originating social-commerce source but never grants fulfillment access without verified billing state.</p>
    </Card>
  );
}
