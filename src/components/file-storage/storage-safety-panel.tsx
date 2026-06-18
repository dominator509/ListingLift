import { FILE_STORAGE_SECURITY_RULES } from '@/domain/file-storage';

export function StorageSafetyPanel() {
  return (
    <section className="rounded-xl border bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold">Storage safety rules</h3>
      <ul className="mt-4 space-y-2 text-sm text-slate-700">
        {FILE_STORAGE_SECURITY_RULES.map((rule) => <li key={rule}>• {rule}</li>)}
      </ul>
    </section>
  );
}
