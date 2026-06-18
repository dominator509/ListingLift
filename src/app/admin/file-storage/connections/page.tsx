import { StorageConnectionTable, StorageSafetyPanel } from '@/components/file-storage';

export default function FileStorageConnectionsPage() {
  return (
    <main className="space-y-6 p-6">
      <div><h1 className="text-3xl font-bold">Storage connections</h1><p className="mt-2 text-slate-600">Manage provider connection drafts. Codex must wire RBAC, encrypted secrets, and Prisma persistence.</p></div>
      <StorageConnectionTable />
      <StorageSafetyPanel />
    </main>
  );
}
