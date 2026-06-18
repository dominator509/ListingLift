import { PageHeader } from '@/components/ui/page-header';
import { ApprovalActionPanel, ApprovalReadinessPanel, DeliveryApprovalGateCard, OutputApprovalTable } from '@/components/approval';

const outputs = [{ id: 'out-1', fileName: 'demo-product-001_white.jpg', status: 'READY_FOR_REVIEW', qc: 'Passed draft', approval: 'Pending' }];

export default function AdminJobApprovalPage({ params }: { params: { jobId: string } }) {
  return <main className="mx-auto max-w-7xl space-y-8 px-6 py-10"><PageHeader eyebrow={`Job ${params.jobId}`} title="Manual approval workflow" description="Final admin decision point before delivery preparation. Approval never sends files automatically." /><ApprovalReadinessPanel jobId={params.jobId} blockers={['Resolve any open blocking QC flags before final approval.']} warnings={['Seller-review recommended language must remain in delivery notes.']} requiredActions={['Approve or reject each required output.']} canApprove={false} /><OutputApprovalTable outputs={outputs} /><ApprovalActionPanel /><DeliveryApprovalGateCard blockers={['Manual approval pending', 'Delivery archive approval pending']} /></main>;
}
