export type AdvancedOutputPlanRow = {
  imageId: string;
  operationKey: string;
  outputFolder: string;
  outputFilename: string;
  status: string;
};

export function AdvancedOutputPlanTable({ rows }: { rows: AdvancedOutputPlanRow[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr><th className="p-3">Image</th><th className="p-3">Operation</th><th className="p-3">Folder</th><th className="p-3">Filename</th><th className="p-3">Status</th></tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.imageId}-${row.operationKey}-${row.outputFilename}`} className="border-t">
              <td className="p-3 font-mono text-xs">{row.imageId}</td>
              <td className="p-3">{row.operationKey}</td>
              <td className="p-3 text-slate-600">{row.outputFolder}</td>
              <td className="p-3 font-mono text-xs">{row.outputFilename}</td>
              <td className="p-3">{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
