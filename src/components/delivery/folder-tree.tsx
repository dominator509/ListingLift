import { Card } from '@/components/ui/card';

export function DeliveryFolderTree({ rootFolder, folders }: { rootFolder: string; folders: string[] }) {
  return (
    <Card title="Delivery folder tree" description="Generated from selected platform presets. Paths must remain ZIP-safe and predictable.">
      <div className="rounded-xl bg-slate-950 p-4 font-mono text-xs text-slate-100">
        <div>{rootFolder}/</div>
        {folders.map((folder) => (
          <div key={folder} className="pl-4">{folder}/</div>
        ))}
        <div className="pl-4">Manifest.csv</div>
        <div className="pl-4">ReadMe.txt</div>
      </div>
    </Card>
  );
}
