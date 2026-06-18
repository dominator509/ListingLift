import { ClientRevisionPanel } from '@/components/client-dashboard';
import { PageHeader } from '@/components/ui/page-header';

export default function ClientRevisionsPage() {
  return (
    <main>
      <PageHeader title="Revisions" description="Request revisions for approved previews or delivered files within the project/package allowance." />
      <ClientRevisionPanel />
    </main>
  );
}
