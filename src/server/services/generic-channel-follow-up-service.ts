import { buildGenericSalesChannelDedupeKey } from '@/domain/generic-sales-channels';
import { genericFollowUpStatusInputSchema, type GenericFollowUpStatusInput } from '@/schemas/generic-sales-channels';
import { getOtherSalesChannelDefinitionOrThrow } from './generic-sales-channel-catalog-service';

export function createGenericFollowUpStatusPlan(input: GenericFollowUpStatusInput) {
  const parsed = genericFollowUpStatusInputSchema.parse(input);
  const definition = getOtherSalesChannelDefinitionOrThrow(parsed.channelKey);
  return {
    mode: parsed.dryRun ? 'DRY_RUN' : 'PERSISTENCE_REQUIRED',
    channelKey: definition.key,
    externalReference: parsed.externalReference,
    dedupeKey: buildGenericSalesChannelDedupeKey({ channelKey: definition.key, externalReference: parsed.externalReference }),
    workflowStatus: parsed.workflowStatus,
    nextFollowUpAt: parsed.nextFollowUpAt,
    followUpNotes: parsed.followUpNotes,
    allowedAutomation: false,
    operatorMustSendManually: true,
  };
}
