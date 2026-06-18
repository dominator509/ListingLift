import { Card } from '@/components/ui/card';

export function SocialCommerceRevisionStatusPanel() {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold">Revision tracker</h2>
      <p className="mt-2 text-sm text-muted-foreground">Track social-commerce revisions manually and block completion while revisions are requested, in progress, or ready for review.</p>
    </Card>
  );
}
