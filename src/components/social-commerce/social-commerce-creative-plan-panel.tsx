import { Card } from '@/components/ui/card';
import { buildSocialCommerceCreativePlan } from '@/domain/social-commerce';

export function SocialCommerceCreativePlanPanel() {
  const plan = buildSocialCommerceCreativePlan({ channelKey: 'instagram_shop', productNames: ['Demo product'], campaignGoal: 'Refresh product visuals for social commerce.' });
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold">Creative plan preview</h2>
      <p className="mt-2 text-sm text-muted-foreground">{plan.safeCopy}</p>
      <div className="mt-3 text-sm">Formats: {plan.formats.join(', ')}</div>
      <div className="mt-2 text-sm">Presets: {plan.presetKeys.join(', ')}</div>
    </Card>
  );
}
