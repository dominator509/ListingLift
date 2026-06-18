import { sanitizeApiEventMetadata } from '@/domain/api-access';
import { apiAccessEventSchema, type ApiAccessEventInput } from '@/schemas/api-access';

export function buildApiAccessEventDraft(input: ApiAccessEventInput & { organizationId: string; actorUserId?: string | null }) {
  const parsed = apiAccessEventSchema.parse(input);
  return {
    organizationId: input.organizationId,
    userId: input.actorUserId ?? null,
    tokenId: parsed.tokenId ?? null,
    scope: parsed.scope ?? null,
    eventType: parsed.eventType,
    route: parsed.route ?? null,
    metadata: sanitizeApiEventMetadata(parsed.metadata ?? {}),
    createdAt: new Date(),
    codexPersistence: 'Codex must persist this event in an audit log/ApiAccessEvent table transactionally.',
  };
}
