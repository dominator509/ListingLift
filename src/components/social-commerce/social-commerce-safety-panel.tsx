import { Card } from '@/components/ui/card';
import { SOCIAL_COMMERCE_SAFETY_RULES } from '@/domain/social-commerce';

export function SocialCommerceSafetyPanel() {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold">Social-commerce safety rules</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
        {SOCIAL_COMMERCE_SAFETY_RULES.map((rule) => <li key={rule}>{rule}</li>)}
      </ul>
    </Card>
  );
}
