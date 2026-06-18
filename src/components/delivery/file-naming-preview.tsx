import { Card } from '@/components/ui/card';
import { buildOutputFileName } from '@/server/services/naming-service';

export function FileNamingPreview() {
  const examples = [
    buildOutputFileName({ clientName: 'Demo Store', jobId: 'JOB-123', sku: 'Blue Mug 12oz', presetKey: 'AmazonMainImageDraft', outputType: 'WHITE_JPG', index: 1, extension: 'jpg' }),
    buildOutputFileName({ clientName: 'Demo Store', jobId: 'JOB-123', sku: 'Blue Mug 12oz', presetKey: 'TransparentPNG', outputType: 'TRANSPARENT_PNG', index: 1, extension: 'png' }),
    buildOutputFileName({ clientName: 'Demo Store', jobId: 'JOB-123', sku: 'Blue Mug 12oz', presetKey: 'InstagramStoryVertical', outputType: 'VERTICAL_SOCIAL', index: 1, extension: 'webp' }),
  ];
  return (
    <Card title="File naming preview" description="Safe, predictable names avoid special characters and keep SKU/job/preset context.">
      <ul className="space-y-2 font-mono text-xs text-slate-700">
        {examples.map((example) => <li key={example} className="rounded-lg bg-slate-50 p-2">{example}</li>)}
      </ul>
    </Card>
  );
}
