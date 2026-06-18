import { Card } from '@/components/ui/card';

export function ClientDownloadPanel() {
  return (
    <Card title="Downloads" description="Final ZIP downloads stay hidden until approval, delivery release, token validity, and client scope checks pass.">
      <p className="text-sm text-slate-600">Files are platform-ready drafts. Seller review against current marketplace guidelines is recommended before publishing.</p>
    </Card>
  );
}
