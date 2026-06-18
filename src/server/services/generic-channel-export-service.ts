import { DEFAULT_OTHER_SALES_CHANNELS } from '@/domain/generic-sales-channels';

export function createGenericSalesChannelExportPlan(input: { channelKey?: string; includeRevenue?: boolean; includeFollowUps?: boolean }) {
  const channels = input.channelKey ? DEFAULT_OTHER_SALES_CHANNELS.filter((channel) => channel.key === input.channelKey) : DEFAULT_OTHER_SALES_CHANNELS;
  return {
    exportType: 'OTHER_SALES_CHANNELS_CSV',
    columns: ['channelKey', 'label', 'category', 'externalReference', 'clientName', 'jobId', 'packageKey', 'workflowStatus', 'amountCents', 'currency', 'deadline', 'followUpStatus'],
    channels: channels.map((channel) => ({ channelKey: channel.key, label: channel.label, category: channel.category })),
    includeRevenue: input.includeRevenue ?? true,
    includeFollowUps: input.includeFollowUps ?? true,
    neutralizeCsvFormulas: true,
    note: 'Seed export plan only. Codex must stream real tenant-scoped CSV data and neutralize formulas before download.',
  };
}
