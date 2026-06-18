import type { QaCommandContract } from '@/domain/full-testing-qa';

type CommandRow = QaCommandContract & { step?: number; status?: string };

export function QaCommandSequenceTable({ commands }: { commands: CommandRow[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-950">Required QA command sequence</h2>
        <p className="mt-1 text-sm text-slate-600">Every command remains Codex-required until actually run with retained evidence.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="py-3 pr-4">Step</th>
              <th className="py-3 pr-4">Layer</th>
              <th className="py-3 pr-4">Command</th>
              <th className="py-3 pr-4">Purpose</th>
              <th className="py-3 pr-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {commands.map((command, index) => (
              <tr key={command.key}>
                <td className="py-3 pr-4 font-medium text-slate-900">{command.step ?? index + 1}</td>
                <td className="py-3 pr-4 text-slate-700">{command.layer}</td>
                <td className="py-3 pr-4 font-mono text-xs text-slate-900">{command.command}</td>
                <td className="max-w-xl py-3 pr-4 text-slate-600">{command.purpose}</td>
                <td className="py-3 pr-4 text-amber-700">{command.status ?? 'CODEX_REQUIRED'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
