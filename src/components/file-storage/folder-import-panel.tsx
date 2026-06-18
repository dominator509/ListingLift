export function FolderImportPanel() {
  return (
    <section className="rounded-xl border bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold">Folder import planner</h3>
      <p className="mt-2 text-sm text-slate-600">Plan Google Drive, Dropbox, local, or mock folder intake into a ListingLift job. Codex must wire real folder enumeration through official APIs only.</p>
      <div className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Do not scrape private folders or store third-party passwords. Use approved OAuth/API scopes only.</div>
    </section>
  );
}
