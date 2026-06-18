export function buildAutomationDeadLetterDraft(input: { organizationId: string; deliveryId?: string; subscriptionId?: string; reason: string; payload?: Record<string, unknown> }) {
  return {
    organizationId: input.organizationId,
    deliveryId: input.deliveryId,
    subscriptionId: input.subscriptionId,
    reason: input.reason.slice(0, 500),
    payload: input.payload ?? {},
    status: 'DEAD_LETTERED',
    manualFallbackRequired: true,
    auditAction: 'automation.dead_letter.create',
  };
}

export function planAutomationDeadLetterReplay(input: { deadLetterId: string; actorUserId?: string }) {
  return { deadLetterId: input.deadLetterId, actorUserId: input.actorUserId, status: 'QUEUED', auditAction: 'automation.dead_letter.replay', requiresAuditLog: true };
}
