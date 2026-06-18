import { Button } from '@/components/ui/button';
import { Card, CardText, CardTitle } from '@/components/ui/card';

export function CustomPresetForm() {
  return (
    <Card>
      <CardTitle>Custom preset draft</CardTitle>
      <CardText>Create a client-specific preset. Codex must connect this form to the audited API route during runtime integration.</CardText>
      <form className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">
          Preset name
          <input className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2" name="name" placeholder="Wholesale catalog square" />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Platform
          <input className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2" name="platform" placeholder="Custom marketplace" />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Width
          <input className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2" name="width" type="number" placeholder="2000" />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Height
          <input className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2" name="height" type="number" placeholder="2000" />
        </label>
        <label className="text-sm font-medium text-slate-700 md:col-span-2">
          Folder path
          <input className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2" name="folderPath" placeholder="Custom/client-gallery" />
        </label>
        <div className="md:col-span-2">
          <Button type="button" variant="secondary">Draft custom preset</Button>
          <p className="mt-2 text-xs text-slate-500">Requires manage:presets and audit logging before persistence.</p>
        </div>
      </form>
    </Card>
  );
}
