import { PERMISSIONS } from '@/domain/permissions';
import { SECURITY_RATE_LIMIT_ACTIONS } from '@/domain/security-hardening';
import { parseJson, guardedSession } from '@/server/routes/route-helpers';
import { assertPermission } from '@/server/services/authorization-service';
import { evaluateSecurityRateLimit } from '@/server/services/security-rate-limit-policy-service';
import { securityRateLimitEvaluationSchema } from '@/schemas/security-hardening';

export async function GET(request: Request) {
  return guardedSession(request, (session) => {
    assertPermission(session, PERMISSIONS.manageSecurity);
    return {
      policies: SECURITY_RATE_LIMIT_ACTIONS.map((action) => evaluateSecurityRateLimit({ action, subjectParts: { organizationId: session.organizationId }, observedCount: 0 })),
      codexNote: 'Codex must wire distributed counters and route-level enforcement for every policy before production.',
    };
  });
}

export async function POST(request: Request) {
  return guardedSession(request, async (session) => {
    assertPermission(session, PERMISSIONS.manageSecurity);
    const body = securityRateLimitEvaluationSchema.parse(await parseJson(request, {}));
    return evaluateSecurityRateLimit({ ...body, subjectParts: { organizationId: session.organizationId, ...body.subjectParts } });
  });
}
