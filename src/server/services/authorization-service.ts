/**
 * Authorization service — RBAC enforcement for ListingLift.
 * Supports session-level permission checks and per-resource authorization.
 */
import { prisma } from '@/lib/prisma';
import { evaluatePermission } from './rbac-policy-service';
import type { PermissionKey } from '@/domain/permissions';

type Session = { userId: string; organizationId: string; role: string };

/**
 * Assert a session has a given permission. Throws on failure.
 */
export function assertPermission(session: Session, permission: string): void {
  if (!can(session, permission)) {
    const err = new Error(`Permission denied: ${permission}`);
    (err as { code?: string }).code = 'FORBIDDEN';
    throw err;
  }
}

/**
 * Check if a session has a given permission.
 * Wired to RBAC policy service — evaluates against the permission registry.
 */
export function can(session: Session, permission: string): boolean {
  return evaluatePermission(
    { organizationId: session.organizationId, role: session.role },
    permission as PermissionKey,
  ).allowed;
}

/**
 * Per-item authorization check — verifies that a list of resource IDs belong
 * to the requesting session's organization. Fails the entire batch if any
 * item fails the check.
 *
 * @param session - The authenticated session
 * @param resourceIds - Array of resource IDs to check (e.g., processedFileIds)
 * @param resourceModel - Prisma model name (used for the query)
 * @param details - Human-readable description for error messages
 * @returns The verified resource records if all pass
 * @throws {Error} with code FORBIDDEN if any item fails authorization
 */
export async function assertPerItemAuthorization<T extends { id: string; organizationId: string }>(
  session: { organizationId: string },
  resourceIds: string[],
  findMany: (ids: string[]) => Promise<T[]>,
  details: string,
): Promise<T[]> {
  if (resourceIds.length === 0) {
    throw Object.assign(new Error(`No items provided for ${details}.`), { code: 'VALIDATION_ERROR' });
  }

  const records = await findMany(resourceIds);

  const foundIds = new Set(records.map((r) => r.id));
  const missingIds = resourceIds.filter((id) => !foundIds.has(id));

  if (missingIds.length > 0) {
    throw Object.assign(
      new Error(`${details}: ${missingIds.length} item(s) not found: ${missingIds.slice(0, 5).join(', ')}${missingIds.length > 5 ? `... and ${missingIds.length - 5} more` : ''}`),
      { code: 'NOT_FOUND' },
    );
  }

  const unauthorizedIds = records
    .filter((r) => r.organizationId !== session.organizationId)
    .map((r) => r.id);

  if (unauthorizedIds.length > 0) {
    throw Object.assign(
      new Error(`${details}: ${unauthorizedIds.length} item(s) failed authorization check — cross-organization access denied.`),
      { code: 'FORBIDDEN' },
    );
  }

  return records;
}

/**
 * Convenience wrapper: checks processed file IDs belong to the session's org.
 */
export async function assertProcessedFilesAuthorization(
  session: { organizationId: string },
  processedFileIds: string[],
): Promise<void> {
  await assertPerItemAuthorization(
    session,
    processedFileIds,
    (ids) =>
      prisma.processedFile.findMany({
        where: { id: { in: ids } },
        select: { id: true, organizationId: true },
      }) as Promise<{ id: string; organizationId: string }[]>,
    'Processed file authorization',
  );
}
