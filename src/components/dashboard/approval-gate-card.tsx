import { Card } from '@/components/ui/card';

export function ApprovalGateCard() {
  return (
    <Card title="Admin approval gate">
      <p className="text-sm text-slate-600">
        Final client downloads stay hidden until an authorized admin approves the job, generates the ZIP, and sends delivery.
      </p>
    </Card>
  );
}
