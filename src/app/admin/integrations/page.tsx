import Link from 'next/link';

const integrationAreas = [
  { label: 'Image providers', href: '/admin/integrations/image-providers', description: 'Mock provider, Remove.bg, Cloudinary, Replicate, Clipdrop-style, open-source, and local worker scaffolds.' },
  { label: 'File storage', href: '/admin/integrations/file-storage', description: 'Google Drive, Dropbox, local storage, and future storage adapters.' },
  { label: 'Automation', href: '/admin/integrations/automation', description: 'Zapier, Make, n8n, Slack, email, Sheets, Airtable, and task tools.' },
];

export default function AdminIntegrationsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold text-slate-950">Integrations</h1>
      <p className="mt-4 max-w-3xl text-slate-600">Integration areas are adapter-driven, feature-flagged, and mock/manual-first. Real providers must stay disabled until secrets, tests, and health checks are verified.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {integrationAreas.map((area) => (
          <Link key={area.href} href={area.href} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
            <h2 className="text-lg font-semibold text-slate-950">{area.label}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{area.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
