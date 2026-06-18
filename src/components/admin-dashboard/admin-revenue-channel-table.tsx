import { Card } from '@/components/ui/card';

type RevenueChannelRow = {
  channelKey: string;
  channelName: string;
  channelType: string;
  orderCount: number;
  jobCount: number;
  completedJobCount: number;
  formattedNetRevenue: string;
  formattedAverageOrderValue?: string;
  conversionRatePercent?: number;
  directConversionCount: number;
  retainerCandidateCount: number;
};

export function AdminRevenueChannelTable({ channels }: { channels: RevenueChannelRow[] }) {
  return (
    <Card title="Revenue by sales channel" description="Channel rows must be derived from verified payment, invoice, external-order, and job records before production use.">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="py-2 pr-4">Source</th>
              <th className="py-2 pr-4">Orders</th>
              <th className="py-2 pr-4">Jobs</th>
              <th className="py-2 pr-4">Completed</th>
              <th className="py-2 pr-4">Net revenue</th>
              <th className="py-2 pr-4">Direct conversions</th>
              <th className="py-2 pr-4">Retainer alerts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {channels.map((channel) => (
              <tr key={channel.channelKey}>
                <td className="py-3 pr-4"><span className="font-medium text-slate-950">{channel.channelName}</span><br /><span className="text-xs text-slate-500">{channel.channelType}</span></td>
                <td className="py-3 pr-4 text-slate-700">{channel.orderCount}</td>
                <td className="py-3 pr-4 text-slate-700">{channel.jobCount}</td>
                <td className="py-3 pr-4 text-slate-700">{channel.completedJobCount}</td>
                <td className="py-3 pr-4 font-semibold text-slate-950">{channel.formattedNetRevenue}</td>
                <td className="py-3 pr-4 text-slate-700">{channel.directConversionCount}</td>
                <td className="py-3 pr-4 text-slate-700">{channel.retainerCandidateCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
