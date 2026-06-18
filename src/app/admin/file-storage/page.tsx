import { FILE_STORAGE_PROVIDERS } from '@/domain/file-storage';
import { StorageProviderCard, StorageConnectionTable, StorageSafetyPanel } from '@/components/file-storage';

export default function AdminFileStoragePage() {
  return (
    <main className="space-y-6 p-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-blue-700">Phase 28</p>
        <h1 className="text-3xl font-bold text-slate-950">File storage integrations</h1>
        <p className="mt-2 max-w-3xl text-slate-600">Configure local, mock, Google Drive, and Dropbox storage scaffolds. Real integrations stay disabled by default and require encrypted secret references.</p>
      </div>
      <section className="grid gap-4 md:grid-cols-2">{FILE_STORAGE_PROVIDERS.map((provider) => <StorageProviderCard key={provider.key} provider={provider} />)}</section>
      <StorageConnectionTable />
      <StorageSafetyPanel />
    </main>
  );
}
