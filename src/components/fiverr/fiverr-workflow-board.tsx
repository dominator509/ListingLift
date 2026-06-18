import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const steps = [
  ['Capture order', 'Manually record Fiverr order ID, buyer username, gig tier, deadline, and package mapping.'],
  ['Collect files', 'Create secure upload token or admin-upload downloaded Fiverr ZIP without scraping.'],
  ['Fulfill in ListingLift', 'Process, review, flag, revise, and approve outputs inside ListingLift.'],
  ['Generate delivery', 'Create approved ZIP, manifest, ReadMe, and Fiverr-safe delivery copy.'],
  ['Deliver in Fiverr', 'Operator manually delivers inside Fiverr and records completion in ListingLift.'],
];

export function FiverrWorkflowBoard() {
  return (
    <Card title="Fiverr workflow" description="Manual-first flow that preserves Fiverr compliance and ListingLift fulfillment controls.">
      <div className="grid gap-3 md:grid-cols-5">
        {steps.map(([title, description], index) => (
          <div key={title} className="rounded-xl border border-slate-200 p-4">
            <Badge tone="purple">Step {index + 1}</Badge>
            <h3 className="mt-3 font-semibold text-slate-950">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
