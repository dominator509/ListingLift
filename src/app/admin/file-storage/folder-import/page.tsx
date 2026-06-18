import { FolderImportPanel, StorageSafetyPanel } from '@/components/file-storage';

export default function FileStorageFolderImportPage() {
  return (
    <main className="space-y-6 p-6">
      <div><h1 className="text-3xl font-bold">Folder import</h1><p className="mt-2 text-slate-600">Plan Drive, Dropbox, local, or mock folder intake without requiring real APIs in baseline mode.</p></div>
      <FolderImportPanel />
      <StorageSafetyPanel />
    </main>
  );
}
