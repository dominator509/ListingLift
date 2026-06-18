import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const accepted = ['JPG', 'PNG', 'WEBP', 'HEIC later', 'ZIP'];

export function UploadDropzone({ title = 'Upload raw product photos', description = 'Drag-and-drop UI shell only. Real upload token verification and file persistence are implemented in the upload phase.' }: { title?: string; description?: string }) {
  return (
    <Card className="border-dashed bg-slate-50/70" title={title} description={description}>
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-2xl" aria-hidden="true">↥</div>
        <p className="mt-4 text-sm font-semibold text-slate-950">Drop files here or choose files</p>
        <p className="mt-2 text-xs leading-5 text-slate-500">Executables and unsafe ZIP paths must be rejected server-side. Originals must never be overwritten.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {accepted.map((item) => <Badge key={item}>{item}</Badge>)}
        </div>
      </div>
    </Card>
  );
}
