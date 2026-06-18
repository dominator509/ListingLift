import { buildUpworkProposalTemplate } from '@/domain/upwork';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function UpworkProposalTemplatePanel() {
  const copy = buildUpworkProposalTemplate({ packageLabel: 'marketplace product image cleanup pack', imageAllowance: 50, turnaroundDays: 5 });
  return <Card><CardHeader><CardTitle>Proposal template</CardTitle></CardHeader><CardContent><pre className="whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm text-slate-700">{copy}</pre></CardContent></Card>;
}
