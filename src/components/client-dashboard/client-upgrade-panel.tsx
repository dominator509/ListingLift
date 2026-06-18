import { Card } from '@/components/ui/card';

export function ClientUpgradePanel() {
  return (
    <Card title="Recommended next steps" description="Upgrade recommendations are manual-review drafts and do not guarantee marketplace or sales outcomes.">
      <ul className="space-y-2 text-sm text-slate-600">
        <li>Monthly seller image retainer for recurring batches.</li>
        <li>Product launch pack for hero, thumbnail, and social-commerce variations.</li>
        <li>Agency white-label workflow for multi-client fulfillment.</li>
      </ul>
    </Card>
  );
}
