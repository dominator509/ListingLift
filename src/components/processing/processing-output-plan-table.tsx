import { Card } from '@/components/ui/card';
import type { ProcessingOutputDraft } from '@/domain/image-processing';

export function ProcessingOutputPlanTable({ outputs }: { outputs: ProcessingOutputDraft[] }) {
  return (
    <Card title="Output plan" description="Preset-driven files that will become ProcessedFile rows and review-ready outputs.">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-slate-500">
            <tr><th className="py-2">Output</th><th>Preset</th><th>Dimensions</th><th>Folder</th><th>Review</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {outputs.map((output) => (
              <tr key={output.storageKey}>
                <td className="py-3 font-medium text-slate-900">{output.fileName}</td>
                <td>{output.presetKey}</td>
                <td>{output.width ?? 'auto'} × {output.height ?? 'auto'}</td>
                <td>{output.folderPath}</td>
                <td>{output.sellerReviewRequired ? 'Seller review required' : 'Optional'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
