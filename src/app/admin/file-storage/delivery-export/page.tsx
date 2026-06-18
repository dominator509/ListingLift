import { DeliveryExportPanel, StorageSafetyPanel } from '@/components/file-storage';

export default function FileStorageDeliveryExportPage() {
  return (
    <main className="space-y-6 p-6">
      <div><h1 className="text-3xl font-bold">Delivery export</h1><p className="mt-2 text-slate-600">Plan approved delivery archive exports to storage destinations while preserving manual fallback.</p></div>
      <DeliveryExportPanel />
      <StorageSafetyPanel />
    </main>
  );
}
