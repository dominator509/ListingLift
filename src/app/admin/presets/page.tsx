import { AdminPresetTable, CustomPresetForm, PresetDetailPanel, PresetGrid, PresetSelector } from '@/components/presets';
import { PageHeader } from '@/components/ui/page-header';
import { getPresetManagerSummary, listDefaultPresets } from '@/server/services/preset-service';

export default function AdminPresetsPage() {
  const presets = listDefaultPresets();
  const summary = getPresetManagerSummary();
  const featuredPreset = presets[0];

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <PageHeader
        eyebrow="Phase 6 scaffold"
        title="Platform Presets"
        description="Data-driven output presets for marketplace, ecommerce, social-commerce, local listing, and custom delivery folders. Presets control dimensions, format, background, safe margin, naming, compression, folder destination, and review-safe language."
      />

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-3xl font-bold text-slate-950">{presets.length}</div>
          <div className="mt-1 text-sm text-slate-600">Seeded presets</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-3xl font-bold text-slate-950">{summary.coverage.required.length}</div>
          <div className="mt-1 text-sm text-slate-600">Required keys</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-3xl font-bold text-slate-950">{summary.validation.invalidPresets.length}</div>
          <div className="mt-1 text-sm text-slate-600">Validation issues</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-3xl font-bold text-slate-950">{Object.keys(summary.grouped).length}</div>
          <div className="mt-1 text-sm text-slate-600">Platform groups</div>
        </div>
      </section>

      <section className="mt-8">
        <AdminPresetTable presets={presets} />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <PresetSelector options={summary.selectorOptions} />
        <CustomPresetForm />
      </section>

      {featuredPreset ? (
        <section className="mt-8">
          <PresetDetailPanel preset={featuredPreset} />
        </section>
      ) : null}

      <section className="mt-8">
        <PresetGrid presets={presets} />
      </section>
    </main>
  );
}
