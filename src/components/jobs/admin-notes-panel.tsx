import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function AdminNotesPanel() {
  return (
    <Card title="Admin notes" description="Internal notes are audited. Client-visible notes must not include secrets, unsupported compliance claims, or marketplace login details.">
      <textarea className="min-h-32 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Add fulfillment context, manual fallback steps, or source-channel notes" />
      <div className="mt-4 flex gap-3"><Button type="button">Save internal note</Button><Button type="button" variant="ghost">Save client-visible note</Button></div>
    </Card>
  );
}
