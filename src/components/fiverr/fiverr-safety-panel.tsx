import { Card } from '@/components/ui/card';
import { FIVERR_MARKETPLACE_SAFETY_RULES } from '@/domain/fiverr';

export function FiverrSafetyPanel() {
  return (
    <Card title="Fiverr marketplace safety" description="Non-negotiable compliance guardrails for the Fiverr workflow.">
      <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
        {FIVERR_MARKETPLACE_SAFETY_RULES.map((rule) => <li key={rule}>{rule}</li>)}
      </ul>
    </Card>
  );
}
