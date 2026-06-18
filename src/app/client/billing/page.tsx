import { ClientBillingPanel } from '@/components/client-dashboard';
import { PageHeader } from '@/components/ui/page-header';

export default function ClientBillingPage() {
  return (
    <main>
      <PageHeader title="Billing" description="Credits, subscriptions, retainers, manual invoices, and verified payments are summarized here." />
      <ClientBillingPanel />
    </main>
  );
}
