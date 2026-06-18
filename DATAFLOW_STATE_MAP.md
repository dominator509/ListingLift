# DATA FLOW & STATE TRACKING — Phase 2 Analysis

## Scope
Data flow traces, state mutation paths, stale reference analysis, and taint propagation chains for the top-10 cyclomatic complexity modules identified in Phase 1.

---

## 1. filterPreviewItems → Preview Gallery Render Chain

### Source: `src/domain/preview-gallery.ts` (C=50)

### Data Flow Diagram
```
PreviewProcessedFileInput[]
         │
         ▼
filterPreviewItems(items, filters)                            // filter closure captures `filters` at call time
         │
         ├─ outputTypes[] filter  ──► items.outputType match
         ├─ presetKeys[] filter   ──► items.presetKey match
         ├─ platforms[] filter    ──► items.platform match
         ├─ reviewStatuses[] filter──► items.reviewStatus (lowercased)
         ├─ approvedOnly filter   ──► reviewStatus === 'APPROVED'
         ├─ includeFlagged filter ──► reviewStatus !== 'FLAGGED'
         ├─ includeFailed filter  ──► reviewStatus !== 'FAILED'
         └─ search string filter  ──► concatenated-field haystack includes check
         │
         ▼
PreviewGalleryItem[]                                          // filtered subset
         │
         ├─ groupBeforeAfterPairs()  ──► Map<imageId, PreviewGalleryItem[]>
         │                               └─ bestOutput = approved ?? ready ?? outputs[0]
         │
         ├─ summarizePreviewGallery() ──► PreviewGallerySummary
         │
         └─ buildBulkPreviewApprovalDraft() ──► { approvableIds[], skipped[] }
```

### State Mutations
| Field | Origin | Mutated By | Persisted? |
|-------|--------|-----------|------------|
| `reviewStatus` | Derived from `file.status`, `file.approvedStatus`, `file.qualityFlags` | `derivePreviewReviewStatus()` | No (computed) |
| `visibility` | Derived from `clientVisible` | `buildPreviewGalleryItem()` | No (computed) |
| `flags` | Copied from `qualityFlags`, then appended | `buildPreviewGalleryItem()` | Yes (appended `processing_failed`, `needs_quality_review`) |
| `safeClaim` | Constant | `buildPreviewGalleryItem()` | No (computed) |

### Taint Propagation
```
User input → filter.search (string) → RegEx-free includes check → filtered array
                                                                    └─ Only affects which items pass through
                                                                    └─ No DB write path from filter alone
User input → buildBulkPreviewApprovalDraft.selectedIds → auditEvent 'preview.bulk_approval_requested'
                                                                    └─ Taint: selectedIds passed through to audit log
```

### Stale Reference Analysis
- **RISK**: `filterPreviewItems` closure captures `filters` at call time. If `items` array is mutated between calls by an external mutation (e.g., approval status change), the closure operates on stale `filters` — but this is correct behavior (snapshot-based filtering).
- **NO stale closure over mutable state**: All checks are synchronous, single-pass, and read-only on `items`.

---

## 2. evaluateDeliveryAccess → 8-Blocker Verdict

### Source: `src/domain/delivery-notifications.ts` (C=21)

### Data Flow Diagram
```
DeliveryAccessInput
├─ jobId: string
├─ jobStatus: string | null
├─ deliveryLinkStatus: string | null
├─ deliveryArchiveStatus: string | null
├─ tokenExpiresAt: Date
├─ tokenRevokedAt: Date | null
├─ approvedAt: Date | null
├─ deliveryArchiveApprovedAt: Date | null
├─ downloadCount: number | null
├─ maxDownloads: number | null
└─ now: Date
         │
         ▼
evaluateDeliveryAccess(input)
         │
         ├─ Check 1: deliveryLinkStatus === 'ACTIVE'         ? BLOCKER : pass
         ├─ Check 2: tokenRevokedAt                           ? BLOCKER : pass
         ├─ Check 3: tokenExpiresAt <= now                    ? BLOCKER : pass
         ├─ Check 4: isDeliveryReadyJobStatus(jobStatus)      ? BLOCKER : pass
         ├─ Check 5: approvedAt                               ? BLOCKER : pass
         ├─ Check 6: deliveryArchiveStatus === 'APPROVED'     ? BLOCKER : pass
         ├─ Check 7: deliveryArchiveApprovedAt                ? BLOCKER : pass
         ├─ Check 8: downloadCount < maxDownloads             ? BLOCKER : pass
         └─ Warning: maxDownloads - downloadCount <= 1       ? WARNING : pass
         │
         ▼
DeliveryAccessDecision
├─ allowed: blockers.length === 0
├─ publicStatus: REVOKED | EXPIRED | LIMIT_REACHED | NOT_READY | AVAILABLE
├─ blockers: string[]
├─ warnings: string[]
└─ safeLanguage: string (constant)
```

### State Mutations
| Variable | Origin | Mutated By | Persisted? |
|----------|--------|-----------|------------|
| `blockers[]` | Empty array | 8 sequential `.push()` calls | No (local) |
| `warnings[]` | Empty array | 1 conditional `.push()` call | No (local) |
| `publicStatus` | Ternary chain on computed state | Single assignment | No (local) |

### Taint Propagation
- All inputs are from database fields (not user-supplied). No taint path from user input.
- `now` defaults to `new Date()` if not provided — safe.

### Stale Reference Analysis
- **None**: Pure function. No mutable external state captured. All inputs passed as value parameters.

---

## 3. stripe-billing-orchestrator → Checkout → Webhook → Fulfillment

### Source: `src/server/services/stripe-billing-orchestrator.ts` (C=2)

### Data Flow Diagram
```
Stripe Event (checkout.session.completed)
         │
         ▼
createStripeWebhookFulfillmentPlan(event, verified)
         │
         ├─ event.type === 'checkout.session.completed' ? 'fulfill_order' : 'record_event'
         ├─ note: 'Placeholder — fulfillment logic not yet wired.'
         │
         ▼
{ eventId, eventType, verified, action, note }

Stripe Paid Job Input
         │
         ▼
createStripePaidJobIntakePlan(input)
         │
         ├─ grantsAccessBeforePayment: false
         ├─ triggersUploadLinkAfterPayment: true
         └─ note: 'Placeholder — Stripe paid job intake scaffold.'
         │
         ▼
{ packageKey, purpose, quantity, metadata, grantsAccessBeforePayment, triggersUploadLinkAfterPayment, note }
```

### State Mutations
- **None**: Both functions are pure. No DB writes. No side effects.

### Taint Propagation
- `event.data.object` (Record<string, unknown>) passed through directly. No schema validation. Metadata could carry untrusted payload.
- `input.metadata` (Record<string, unknown>) passed through unchanged.

### Stale Reference Analysis
- **Not applicable**: No mutable state captured.

### Findings
- Both functions are placeholders. No fulfillment logic wired.
- `input.metadata` passes through without sanitization. If wired later, untrusted metadata could flow to DB writes.

---

## 4. gumroad-fulfillment-orchestrator → License Key → Verification → Delivery

### Source: `src/server/services/gumroad-fulfillment-orchestrator.ts` (C=5)

### Data Flow Diagram
```
Gumroad Webhook Payload (payloadText, signatureHeader)
         │
         ▼
createGumroadWebhookProcessingPlan(input)
         │
         ├─ JSON.parse(payloadText)         // empty catch → silently uses {}
         ├─ parsed.sale_id || 'unknown'
         ├─ parsed.product_name || 'unknown'
         └─ note: 'Placeholder — Gumroad fulfillment not yet wired.'
         │
         ▼
{ ok: true, saleId, productName, dryRun, note }

HTTP Body (form-encoded or JSON)
         │
         ▼
parseGumroadPayloadFromBody(body)
         │
         ├─ try JSON.parse → sale_id, product_name, email, price_cents
         ├─ catch → new URLSearchParams(body) → same fields
         ▼
{ sale_id, product_name, email, price_cents }
```

### State Mutations
- **None**: Both functions are pure.

### Taint Propagation
- `payloadText` (user-supplied webhook body) → `JSON.parse` → `parsed.sale_id`, `parsed.product_name` → output.
- **CRITICAL FINDING**: Empty catch on line 9-10 means malformed JSON silently falls through to `parsed = {}`. The function returns `ok: true` even when the payload was unparseable.

### Stale Reference Analysis
- **Not applicable**: No captured state.

### Findings
- Empty catch block (lines 9-10) swallows JSON parse errors. `ok: true` is returned even for invalid payloads.
- `parseGumroadPayloadFromBody` has the same pattern — empty catch, falls through to form-encoded parse. This is intentional (dual format), but the first `try` block failing silently is acceptable here because it tries the second parse path.

---

## 5. auth-service → Session Creation → Token Binding → Validation → Expiry

### Source: `src/server/auth/auth-service.ts` (C=18)

### Data Flow Diagram
```
signup(input: {email, password, name, organizationName})
         │
         ├─ normalize email → prisma.user.findUnique({email})
         ├─ if (existingUser) throw CONFLICT
         ├─ hashPassword(input.password)
         ├─ createSessionToken() → {token, tokenHash}
         │
         ├─ Prisma $transaction:
         │     ├─ tx.organization.create({name, slug})
         │     ├─ tx.user.create({email, passwordHash, name})
         │     ├─ tx.membership.create({organizationId, userId, roleId})
         │     └─ tx.session.create({userId, organizationId, sessionTokenHash, expiresAt, lastSeenAt})
         │
         ▼
{ sessionToken, session: {userId, organizationId, role}, user: {id, email, name} }

login(input: {email, password})
         │
         ├─ normalize email → prisma.user.findUnique({email})
         ├─ if (!user || deletedAt) throw
         ├─ if (SUSPENDED | DISABLED) throw
         ├─ verifyPassword(input.password, user.passwordHash)
         ├─ prisma.membership.findFirst({userId}) → role
         ├─ createSessionToken() → {token, tokenHash}
         ├─ prisma.session.create({sessionTokenHash, expiresAt, lastSeenAt})
         ├─ prisma.user.update({lastLoginAt})
         │
         ▼
{ sessionToken, session: {userId, organizationId, role}, user: {id, email, name} }

resolveSessionFromRequest(request)
         │
         ├─ parse cookie header → match ll_session=([^;]+)
         ├─ hashToken(token) → prisma.session.findUnique({sessionTokenHash})
         ├─ if (!session || !active || revokedAt || expired || user.deletedAt) → return null
         ├─ prisma.membership.findFirst({userId, organizationId}) → roleKey
         │
         ▼
{ userId, organizationId, role } | null

logout(request)
         │
         ├─ parse cookie → hashToken → prisma.session.findUnique
         ├─ prisma.$transaction([session.update({active:false, revokedAt}), auditLog.create])
         │
         ▼
void (silent on no session)
```

### State Mutations
| Table | Write | Read After Write? |
|-------|-------|-------------------|
| `organization` | Created in `signup` transaction | No same-transaction read |
| `user` | Created in `signup`, updated `lastLoginAt` in `login` | `findUnique` before write (check for duplicate) |
| `membership` | Created in `signup` | No |
| `session` | Created in `signup`/`login`, updated (active=false, revokedAt) in `logout` | `findUnique` before update in `logout` |
| `auditLog` | Created in `logout` | No |

### Taint Propagation
```
User input (email, password, name) ─► Prisma writes
  ├─ email: .toLowerCase().trim()                          // Sanitized
  ├─ password: hashPassword() before write                // One-way hash
  ├─ name: passed directly to user.create({name})         // Unvalidated string
  └─ organizationName: used for slug (alphanumeric+hyphen) // Partially sanitized
```

### Stale Reference Analysis
- `resolveSessionFromRequest` reads `session.active`, `session.revokedAt`, `session.expiresAt` from DB on every call — no stale cache.
- `login` updates `lastLoginAt` AFTER session creation — if a subsequent call reads `lastLoginAt` in the same microsecond, it's stale, but this is functionally benign.
- **RISK**: `resolveSessionFromRequest` returns `null` for both "no session" and "expired/revoked session." Callers cannot distinguish a prompt-less user from an expired session. This is a known missing branch (flagged in Phase 1).

---

## 6. sales-channel-normalizer → Normalized Order Pipeline

### Source: `src/server/services/sales-channel-normalizer.ts` (C=49)

### Data Flow Diagram
```
RawExternalOrder (Record<string, unknown>)
         │
         ├─ normalizeManualOrder(input)
         ├─ normalizeFiverrOrder(input)
         ├─ normalizeGumroadOrder(input)
         ├─ normalizeStripeCheckoutOrder(input)
         ├─ normalizeUpworkOrder(input)
         ├─ normalizeTaskrabbitOrder(input)
         ├─ normalizeShopifyOrder(input)
         └─ normalizeGenericMarketplaceOrder(channelName, input)
                  │
                  │  (All 8 follow identical pattern:)
                  ▼
         normalizeOrderPayload({channelName, externalOrderId, ...})
                  │
                  ├─ toCanonicalSalesChannelKey(channelName)
                  ├─ stringValue(field1, field2, ...)          // first-truthy fallback chain
                  ├─ centsAlready(field) ?? centsValue(field)   // dual cents strategy
                  ├─ intValue(revisionAllowance, 0)
                  ├─ urlValue(sourceUrl)                        // empty catch block
                  ├─ paymentStatusValue(paymentStatus)
                  ├─ uploadStatusValue(uploadStatus)
                  ├─ fulfillmentStatusValue(fulfillmentStatus)
                  └─ stableExternalOrderId(...) || Date.now() fallback
                  │
                  ▼
         normalizedExternalOrderSchema.parse(...)
                  │
                  ▼
         NormalizedExternalOrder
```

### State Mutations
- **None**: Pure data transformation. No DB writes, no side effects.

### Taint Propagation
```
RawExternalOrder (untrusted external payload)
  └─ Each field: stringValue, centsValue, intValue, urlValue conversions
      └─ stringValue: first truthy value wins — returns undefined if all falsy
      └─ centsValue: >1000 && isInteger → already cents; else * 100
      └─ urlValue: URL constructor in try/catch — empty catch swallows errors
      └─ stableExternalOrderId: falls back to `${channelKey}-${Date.now()}` if no ID found
```

### Stale Reference Analysis
- **Not applicable**: Pure functions.

### Findings
- Structural duplication: 8 identical normalizers with different hard-coded field-name fallback chains. C=49 from duplication, not algorithm complexity.
- `normalizeStripeCheckoutOrder` uses `input.client_reference_id` for `packagePurchased` — Stripe's `client_reference_id` is an arbitrary string, not a package key. This is a potentially incorrect mapping.
- No input null-guard at top of any normalizer — null/undefined `input` would throw TypeError.

---

## 7. delivery-packaging-service → Build Archive Plan

### Source: `src/server/services/delivery-packaging-service.ts` (C=44)

### Data Flow Diagram
```
DeliveryArchiveInput
├─ organizationId, jobId, jobNumber, clientName
├─ processedFiles: DeliveryProcessedFileInput[]
├─ selectedPresets: PlatformPreset[]
├─ includeManifest, includeReadme, includeBeforeAfter
└─ generatedByUserId
         │
         ▼
buildDeliveryArchivePlan(input)
         │
         ├─ buildDeliveryRootFolder({clientName, jobNumberOrId})
         ├─ assertSafeDeliveryRelativePath(rootFolder)          // LATE: called after rootFolder built
         ├─ foldersForPresets(selectedPresets)
         │
         ├─ processedFiles.map → archiveFileFromProcessedFile
         │     ├─ folderForProcessedFile(file)
         │     │     ├─ file.folderPath? → normalize
         │     │     └─ DEFAULT_PLATFORM_PRESETS.find(key==file.presetKey)
         │     ├─ normalizeFileExtension + buildOutputFileName
         │     └─ ternary: FAILED→failed / REJECTED→excluded / else→included
         │
         ├─ ensureUniqueFileNames(outputFiles)
         ├─ buildManifestCsvFromArchiveFiles
         ├─ buildComplianceSafeDeliveryReadme
         ├─ optional: manifest metadataFile
         ├─ optional: readme metadataFile
         └─ buildManifestSummary
         │
         ▼
DeliveryArchivePlan
├─ status: 'PLANNED'
├─ files: DeliveryArchiveFilePlan[]
├─ folders: string[]
├─ manifestCsv, readmeText
├─ zipFileName, zipStorageKey
├─ fileCount, outputCount, missingCount
└─ metadata: {generatedByUserId, includeBeforeAfter, safeLanguage}
```

### State Mutations
| Variable | Origin | Persisted? |
|----------|--------|-----------|
| `status: 'PLANNED'` | Constant | Yes (will change on ZIP build) |
| `file.status` | Derived from file.status + file.approvedStatus | In-plan only |
| `manifestCsv` | Built from output files | As file in archive |
| `readmeText` | Built from metadata | As file in archive |
| `zipStorageKey` | Generated from orgId + jobId + rootFolder | In-plan only |

### Taint Propagation
- `input.processedFiles[].storageKey` → flows to `archiveFileFromProcessedFile` output → `buildManifestCsv`. Storage keys are internal paths, not user input.
- `input.clientName` → flows to `buildDeliveryRootFolder`, `buildOutputFileName`, `buildComplianceSafeDeliveryReadme`. Client name is user-supplied but pre-stored in DB.
- `input.selectedPresets` → flows to folder creation and file planning. Preset keys are system-defined constants.

### Stale Reference Analysis
- `buildDeliveryArchivePlan` reads `DEFAULT_PLATFORM_PRESETS` (module-level constant) — no staleness risk.
- `DEFAULT_PLATFORM_PRESETS.find()` inside `folderForProcessedFile` and `platformForPresetKey` — linear scan each call, not cached.

### Critical Finding
- `assertSafeDeliveryRelativePath(rootFolder)` called AFTER `buildDeliveryRootFolder`. If the assertion fails, the expensive `foldersForPresets` call on the next line has already executed. The assertion serves as a guard but is positioned too late.

---

## 8. admin-job-queue-service → Queue Filter/Sort

### Source: `src/server/services/admin-job-queue-service.ts` (C=40)

### Data Flow Diagram
```
JobQueueSource[]
         │
         ▼
toJobQueueItem(job, now)
         │
         ├─ normalizeJobPriority(job.priority)
         ├─ getDeadlineWarningLevel({deadline, now, status})
         ├─ calculateQueueRank({priority, deadline, createdAt, status, queuePosition})
         │
         ▼
JobQueueItem[]
         │
         ├─ filterJobQueue(items, filters)
         │     ├─ status filter
         │     ├─ priority filter
         │     ├─ sourceChannelName filter
         │     ├─ deadlineWarningLevel filter
         │     └─ search filter
         │
         ├─ sortJobQueue(items, sortBy, direction)
         │     ├─ sortValue(item, sortBy) → comparable value
         │     └─ queueRank as tiebreaker
         │
         ├─ summarizeAdminQueue(items)
         │
         └─ sanitizeJobAdminNote(note)
```

### State Mutations
| Variable | Origin | Persisted? |
|----------|--------|-----------|
| `queueRank` | Computed from priority, deadline, createdAt, status | No (computed at runtime) |
| `deadlineWarningLevel` | Computed from deadline, now, status | No (computed at runtime) |
| `priority` | Normalized from source `priority` field | No (computed) |

### Taint Propagation
- `items` come from Database (JobQueueSource) — not directly user-supplied.
- `filters.search` (user input) → `haystack.includes(filters.search.toLowerCase())` — safe, read-only, no injection vector (includes check, not eval).
- `sanitizeJobAdminNote` strips control characters and secret patterns — safe output.

### Stale Reference Analysis
- `sortJobQueue` creates `[...items].sort(...)` — shallow copy, then sorts. The original array is not mutated.
- `filterJobQueue` uses `.filter()` — returns new array. Original is not mutated.
- Both produce fresh arrays on every call. No stale reference issue.

---

## 9. upload-token-service → Issue → Validate → Consume

### Source: `src/server/services/upload-token-service.ts` (C=7)

### Data Flow Diagram
```
buildUploadTokenIssuePlan(input: {organizationId, jobId, expiresInMinutes})
         │
         ├─ randomBytes(32) → rawToken (base64url)
         ├─ hashToken(rawToken) → tokenHash
         ├─ expiresAt = now + expiresInMinutes
         │
         ▼
UploadTokenPlan
├─ response: { token, expiresAt, uploadUrl }          // Returned to client
└─ persistable: { tokenHash, expiresAt, orgId, jobId } // Stored in DB

validateUploadTokenRecord(token, record)
         │
         ├─ hashToken(token) === record.tokenHash ?
         ├─ now < record.expiresAt ?
         ├─ !record.usedAt ?
         └─ !record.revokedAt ?
         │
         ▼
{ valid: boolean, reason?: string }

redactUploadTokenForLogs(persistable)
         │
         └─ partial hash + expiresAt + orgId
```

### State Mutations
| Variable | Origin | Persisted? |
|----------|--------|-----------|
| `tokenHash` | SHA-256(rawToken) | Yes (Prisma) |
| `expiresAt` | `new Date(now + minutes * 60000)` | Yes (Prisma) |
| `organizationId` | From input | Yes (Prisma) |
| `jobId` | From input (nullable) | Yes (Prisma) |

### Taint Propagation
- `rawToken` is generated server-side (randomBytes) — not tainted.
- `input.organizationId`, `input.jobId` — these should be validated by caller (session-scoped).

### Stale Reference Analysis
- **CRITICAL FINDING**: `validateUploadTokenRecord` return value is computed in this service, but the Phase 1 CFG analysis flagged that the caller (`buildUploadTokenIssuePlan`) does not check the `{valid: false, reason}` response. The validation result is computed but unused. This means a token could be:
  - Expired but treated as valid
  - Already used but treated as single-use
  - Revoked but treated as active

### Findings
- `buildUploadTokenIssuePlan` stores `persistable` in DB but does not call `validateUploadTokenRecord` on the same token — the validation is designed for a separate read path, but no consumer currently checks it.

---

## 10. upload-intake-service → File Normalization → Storage Plan

### Source: `src/server/services/upload-intake-service.ts` (C=7)

### Data Flow Diagram
```
buildUploadIntakePlan(input: {organizationId, clientId, jobId, sourceKind, source, files[]})
         │
         ├─ (input.files ?? []).map(normalizeFile)
         │
         ├─ normalizeFile(file: Record<string, unknown>)
         │     ├─ if file.fileName → use new field names
         │     └─ else → backward-compat: name → fileName, type → mimeType, size → sizeBytes
         │
         ├─ imageRecordDrafts = files.map(file => ({
         │      storageKey: `/originals/${orgId}/${jobId}/${file.fileName}`,
         │      originalFileName, mimeType, sizeBytes, width, height
         │   }))
         │
         └─ storagePolicy: { preserveOriginals: true, finalDeliveryStillRequiresAdminApproval: true }
         │
         ▼
{ imageRecordDrafts, storagePolicy, jobUpdateDraft, phase: 'intake_planned' }
```

### State Mutations
| Variable | Origin | Persisted? |
|----------|--------|-----------|
| `storageKey` | Template: `/originals/${orgId}/${jobId}/${fileName}` | In-plan only |
| `imageRecordDrafts` | Derived from file metadata | In-plan only |
| `jobUpdateDraft.uploadStatus` | Constant `'COMPLETE'` | In-plan only |

### Taint Propagation
```
User-supplied files[] → normalizeFile → imageRecordDrafts
  ├─ file.fileName → storageKey template                    // Path traversal risk: '..' in fileName?
  └─ file.sizeBytes → totalSize sum (number, safe)
```

### Stale Reference Analysis
- **Not applicable**: Pure function, no captured state.

### Findings
- `storageKey` uses user-supplied `file.fileName` in a template path: `/originals/${orgId}/${jobId}/${file.fileName}`. If `fileName` contains `../`, it could break out of the intended directory. Mitigation: this is a plan (not a write), but the eventual storage write must sanitize the path.
- Backward-compat field detection (`name`, `type`, `size` → `fileName`, `mimeType`, `sizeBytes`) uses implicit undefined checks. No validation that the old fields actually contain the expected types.

---

## Module Cross-Reference: Mutation Graph

```
                         ┌──────────────────┐
                         │  auth-service.ts  │
                         │  (C=18)           │
                         │  Writes: user,    │
                         │  session, org,    │
                         │  membership,      │
                         │  auditLog         │
                         └────────┬─────────┘
                                  │ sessionToken (cookie)
                                  ▼
 ┌────────────────────────────────────────────────────────────┐
 │                HTTP Request / Response Layer                │
 │  Cookie: ll_session → resolveSessionFromRequest → session   │
 └────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
 ┌────────────────────────────┐        ┌──────────────────────────┐
 │ upload-token-service.ts    │        │ upload-intake-service.ts │
 │ (C=7)                     │        │ (C=7)                    │
 │ Writes: uploadToken       │        │ Plans: imageRecordDrafts │
 │ (persistable hash+expiry) │        │ (not yet persisted)      │
 └─────────────┬─────────────┘        └───────────┬──────────────┘
               │                                  │
               ▼                                  ▼
 ┌────────────────────────────┐        ┌──────────────────────────┐
 │ preview-gallery.ts         │        │ admin-job-queue-service  │
 │ (C=50)                    │        │ (C=40)                   │
 │ Reads: processedFile       │        │ Reads: Job (DB)          │
 │ Computes: reviewStatus,    │        │ Computes: queueRank,     │
 │   visibility, flags        │        │   deadlineWarningLevel   │
 └─────────────┬─────────────┘        └───────────┬──────────────┘
               │                                  │
               ▼                                  ▼
 ┌────────────────────────────┐        ┌──────────────────────────┐
 │ delivery-packaging-service │        │ delivery-notifications.ts│
 │ (C=44)                    │        │ (C=21)                   │
 │ Writes: None (plans only) │        │ Reads: delivery state     │
 │ Reads: PlatformPreset[]   │        │ Computes: access verdict  │
 └─────────────┬─────────────┘        └───────────┬──────────────┘
               │                                  │
               ▼                                  ▼
 ┌────────────────────────────┐        ┌──────────────────────────┐
 │ sales-channel-normalizer   │        │ normalization-helpers    │
 │ (C=49)                    │        │ (C=59)                   │
 │ Reads: RawExternalOrder    │        │ Reads: unknown values    │
 │ Writes: None (pure)       │        │ Computes: normalized     │
 └────────────────────────────┘        │ orders (string, int,     │
                                       │ cents, URL, status... ) │
                                       └──────────────────────────┘
```

## Taint Propagation Summary

| Entry Point | Module | Sanitization Path | Risk Level |
|-------------|--------|-------------------|------------|
| `filterItems.search` | preview-gallery.ts | `.includes()` — read-only, no DB path | Low |
| `bulkApproval.selectedIds` | preview-gallery.ts | Passed to audit log `selectedIds` | Low |
| `payloadText` (webhook) | gumroad-fulfillment.ts | `JSON.parse()` — empty catch | **Medium** (ok:true on fail) |
| `event.data.object` | stripe-billing.ts | No schema validation | **Medium** (placeholder) |
| `input.metadata` | stripe-billing.ts | Passed through unchanged | **Medium** (placeholder) |
| `files[].fileName` | upload-intake-service.ts | Template path — no sanitization | **Medium** (path traversal) |
| `rawToken` | upload-token-service.ts | `randomBytes(32)` — server-generated | None |
| `name` | auth-service.ts | Written directly to DB | Low |
| `organizationName` | auth-service.ts | Slug generation (alphanumeric+hyphen) | Low |
| RawExternalOrder fields | normalization-helpers.ts | Type-coerced via stringValue/intValue/centsValue | Low |

## Stale Reference Summary

| Module | Issue | Severity |
|--------|-------|----------|
| `auth-service.ts` `resolveSessionFromRequest` | Returns `null` for both "no session" and "expired" | Medium |
| `upload-token-service.ts` | `validateUploadTokenRecord` result computed but not consumed by issuing flow | **High** |
| `delivery-packaging-service.ts` | `assertSafeDeliveryRelativePath` called after expensive `foldersForPresets` | Low |
| `preview-gallery.ts` | `filterPreviewItems` closure captures `filters` at call time — correct by design | None |
| `admin-job-queue-service.ts` | `filterJobQueue` and `sortJobQueue` produce fresh arrays — no stale state | None |
| `delivery-notifications.ts` | Pure function — all inputs passed as values | None |
| `sales-channel-normalizer.ts` | Pure functions — no mutable state captured | None |

## Critical Path: Upload → Processing → Delivery (End-to-End Data Flow)

```
User Upload ──► upload-intake-service (plan) ──► DB: Image[]
                                                      │
                                                      ▼
                                          image-processing (Phase 10-11)
                                                      │
                                                      ▼
                                          DB: ProcessedFile[]
                                                      │
                                                      ├──► preview-gallery.ts (filter/summarize)
                                                      │
                                                      ├──► delivery-notifications.ts (access check)
                                                      │
                                                      └──► delivery-packaging-service (archive plan)
                                                               │
                                                               ▼
                                                         ZIP Build → Manifest → Delivery Link
                                                               │
                                                               ▼
                                                    evaluateDeliveryAccess (8 blockers)
                                                               │
                                                               ▼
                                                       ALLOWED / BLOCKED
```

---

## Anti-Tautology Verification

- **filterPreviewItems**: 8 sequential guard tests on item properties — outcome is a truthy boolean. Verified: each guard returns `false` on match, with the final `return true` as the accumulator. Correct.
- **evaluateDeliveryAccess**: 8 sequential blockers pushed to array. `allowed = blockers.length === 0`. Verified: each push is conditional on a real failure state. Correct.
- **calculateQueueRank**: Weighted formula `activeBoost + deadlinePenalty - priorityWeight`. Verified: higher urgency = lower rank (sorts ascending). Correct.
- **derivePreviewReviewStatus**: If-FAILED → If-REJECTED → If-FLAGGED → If-APPROVED → fallthrough READY_FOR_REVIEW. Verified: priority-ordered check chain (failures take precedence). Correct.
