import { DEFAULT_DELIVERY_SAFE_LANGUAGE } from '@/domain/delivery-packaging';
import { safeCsvCell } from '@/lib/csv';

export type DeliveryReadmeInput = {
  clientName: string;
  jobNumberOrId: string;
  fileCount: number;
  outputCount: number;
  folders: string[];
  generatedAt?: Date;
  notes?: string | null;
};

export function buildComplianceSafeDeliveryReadme(input: DeliveryReadmeInput) {
  const generatedAt = input.generatedAt ?? new Date();
  return [
    `ListingLift Delivery Pack`,
    `Client: ${safeCsvCell(input.clientName)}`,
    `Job: ${safeCsvCell(input.jobNumberOrId)}`,
    `Generated: ${generatedAt.toISOString()}`,
    '',
    'What is included',
    `- ${input.outputCount} output file draft(s)`,
    `- ${input.fileCount} total archive item(s), including Manifest.csv and ReadMe.txt where enabled`,
    `- Folder organization by selected platform preset(s)`,
    '',
    'Folders',
    ...input.folders.map((folder) => `- ${safeCsvCell(folder)}`),
    '',
    'Important seller review notes',
    ...DEFAULT_DELIVERY_SAFE_LANGUAGE.map((line) => `- ${line}`),
    input.notes ? '' : undefined,
    input.notes ? `Additional notes: ${safeCsvCell(input.notes)}` : undefined,
  ].filter(Boolean).join('\n');
}
