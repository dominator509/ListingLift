import { ClientUpgradePanel } from '@/components/client-dashboard';
import { PageHeader } from '@/components/ui/page-header';

export default function ClientUpgradePage() {
  return (
    <main>
      <PageHeader title="Upgrade options" description="Optional package, retainer, and white-label recommendations. No marketplace approval, ranking, sales, conversion, or ad-performance guarantees." />
      <ClientUpgradePanel />
    </main>
  );
}
