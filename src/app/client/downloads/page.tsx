import { ClientDownloadPanel } from '@/components/client-dashboard';
import { PageHeader } from '@/components/ui/page-header';

export default function ClientDownloadsPage() {
  return (
    <main>
      <PageHeader title="Downloads" description="Approved final ZIP archives and reports appear here only after delivery gates pass." />
      <ClientDownloadPanel />
    </main>
  );
}
