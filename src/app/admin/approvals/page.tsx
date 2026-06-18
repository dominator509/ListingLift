import { PageHeader } from '@/components/ui/page-header';
import { ApprovalSummaryCards, OutputApprovalTable } from '@/components/approval';

const demoOutputs = [
  { id: 'out-1', fileName: 'demo-product-001_white.jpg', status: 'READY_FOR_REVIEW', qc: 'Passed draft', approval: 'Pending' },
  { id: 'out-2', fileName: 'demo-product-002_square.jpg', status: 'FLAGGED', qc: 'Blocked', approval: 'Needs revision' },
];

export default function AdminApprovalsPage() {
  return <main className="mx-auto max-w-7xl space-y-8 px-6 py-10"><PageHeader eyebrow="Phase 15" title="Manual approvals" description="Approve outputs and jobs only after QC, replacement, and revision blockers are resolved. Delivery remains a separate gate." /><ApprovalSummaryCards ready={4} blocked={2} revisions={1} approved={3} /><OutputApprovalTable outputs={demoOutputs} /></main>;
}
