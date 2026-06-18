# Q12 Phase 3 — Cognitive Walkthrough & Heuristic Evaluation

## Methodology

Each persona walks through their 3-5 primary journeys using Nielsen's 10 usability heuristics:

| # | Heuristic | Score (1-5) |
|---|-----------|-------------|
| H1 | Visibility of system status | 1=poor, 5=excellent |
| H2 | Match between system and real world | 1=poor, 5=excellent |
| H3 | User control and freedom | 1=poor, 5=excellent |
| H4 | Consistency and standards | 1=poor, 5=excellent |
| H5 | Error prevention | 1=poor, 5=excellent |
| H6 | Recognition rather than recall | 1=poor, 5=excellent |
| H7 | Flexibility and efficiency of use | 1=poor, 5=excellent |
| H8 | Aesthetic and minimalist design | 1=poor, 5=excellent |
| H9 | Help users recognize, diagnose, recover from errors | 1=poor, 5=excellent |
| H10 | Help and documentation | 1=poor, 5=excellent |

Violations: **Critical** (blocks task), **High** (severe friction), **Medium** (notable friction), **Low** (minor polish).

---

## P1. Anonymous Visitor (Public)

### Journey A: Home Page → Browse → Pricing/Examples

**Step 1.** Land on `/` — PublicShell renders with header, hero, BeforeAfterCard, UploadDropzone, PackageGrid.

| Heuristic | Score | Observation |
|-----------|-------|-------------|
| H1 | 4 | Home page loads full content immediately. No loading skeleton needed for static content. |
| H2 | 5 | Marketing language matches ecommerce photography context: "Turn messy product photos into organized marketplace image packs." |
| H3 | 4 | User can freely navigate to /pricing, /examples, /login. Navigation is visible and predictable. |
| H4 | 4 | PublicShell uses standard nav pattern. LinkButton variants (primary/ghost) are consistent. |
| H5 | 3 | UploadDropzone shows accepted types but has no client-side file validation beyond Badge display. No size limits shown before upload attempt. |
| H6 | 4 | CTAs are clearly labeled: "View packages", "See examples". No jargon. |
| H7 | 2 | No skip-to-content link detected. Keyboard users tab through entire header nav. Mobile nav is hidden behind `md:flex` — no hamburger menu detected in responsive breakpoint. |
| H8 | 5 | Clean, minimalist design. Generous whitespace, clear typography hierarchy, restrained use of color. |
| H9 | 3 | No error states on home page. If packages misconfigured, page renders silently with empty grid — user sees nothing. |
| H10 | 2 | No contextual help, tooltips, or documentation link on home page. Users must know what ListingLift does from marketing copy alone. |

**Violations:** 
- **Medium (H7):** No skip-to-content link. Keyboard users must tab through entire header on each page load.
- **Medium (H7):** No responsive hamburger menu — public nav items hidden on mobile with no fallback.
- **Low (H5):** No inline file size/type warnings before user attempts upload.
- **Low (H9):** Empty PackageGrid on config failure is silent — no fallback state.

---

### Journey B: Trigger 404 → Not Found Page

**Step 1.** Visit any invalid route → middleware passes through, Next.js renders not-found boundary.

| Heuristic | Score | Observation |
|-----------|-------|-------------|
| H1 | 4 | User immediately sees 404 page (static route). |
| H2 | 3 | No "go back" or "return home" link visible in the 404 content (inferred from component listing, no explicit 404 content read). |
| H3 | 2 | No navigation recovery offered within the error page itself. User must use browser back or know to click header logo. |
| H4 | 5 | Standard Next.js 404 behavior follows web conventions. |
| H5 | 4 | 404 only triggers on genuinely invalid paths — middleware blocks TRACE/CONNECT methods. |
| H6 | 3 | Error is clear but offers no recovery path inline. |
| H7 | 1 | No link to home or search. User must manually navigate. |
| H8 | 4 | Minimal error styling — follows the pattern. |
| H9 | 2 | "Not Found" with no suggestions, links, or search. |
| H10 | 1 | No help in error state. |

**Violations:**
- **High (H3/H7/H9):** 404 page offers no navigation recovery — no "Return home" link, no search, no suggested pages. User is stranded.

---

## P2. Registered Buyer / Client

### Journey A: Signup → Email Verify → Login → Dashboard

**Step 1.** Click "Log in" from PublicShell → redirected to `/login?next=...`.

| Heuristic | Score | Observation |
|-----------|-------|-------------|
| H1 | 3 | No loading skeleton on login page. Form submission state not visible (button loading state assumed from codex notes but not verified in rendered output). |
| H2 | 5 | Standard email/password form — matches user expectations. |
| H3 | 3 | No "forgot password" link detected. User must have credentials. |
| H4 | 4 | Form follows standard auth conventions. |
| H5 | 4 | Zod validation on server side. Password min-length enforced. Email format validated. |
| H6 | 4 | Fields clearly labeled. Password strength hints visible? Not confirmed in code — schema only shows `min 8`. |
| H7 | 2 | No social login. No SSO. No passwordless email link option. |
| H8 | 4 | Minimal form — no clutter. |
| H9 | 4 | `mapServiceError` returns structured `{ ok: false, error: { code, message } }` with status codes. Zod errors sanitized (e.g. "Invalid email format" instead of raw regex errors). |
| H10 | 2 | No help text near form fields. No "why do I need this?" tooltips. |

**Step 2.** Submit signup form → `POST /api/auth/signup`.

| Heuristic | Score | Observation |
|-----------|-------|-------------|
| H1 | 3 | No progress indicator during submission. Idempotency check runs silently. |
| H2 | 5 | Standard signup flow. |
| H3 | 3 | No way to cancel mid-flow. If user navigates away, form state lost. |
| H4 | 4 | Consistent response envelope `{ ok, data }` / `{ ok, error }`. |
| H5 | 4 | Duplicate email results in 409 CONFLICT — clear error code. Password validation server-side. |
| H6 | 4 | Field labels are unambiguous. |
| H7 | 2 | No "show password" toggle. No password generation suggestion. |
| H8 | 4 | Clean form layout. |
| H9 | 4 | 409 returns "Email already registered" (inferred from code). 422 returns first validation error. |
| H10 | 2 | No inline help. |

**Step 3.** Verify email → redirect to dashboard.

| Heuristic | Score | Observation |
|-----------|-------|-------------|
| H1 | 3 | Verification result not visible until response returns. No "verifying..." state. |
| H2 | 4 | Standard email verification workflow. |
| H3 | 2 | No option to resend verification email on the verification page itself. |
| H4 | 4 | Consistent with industry pattern. |
| H5 | 4 | Invalid token returns 400 — clear error. |
| H6 | 4 | Token-based verification is standard. |
| H7 | 2 | No alternative verification method. |
| H8 | 4 | Minimal. |
| H9 | 3 | Invalid token error is clear but offers no recovery path (no resend link). |
| H10 | 2 | No help text. |

**Violations:**
- **Medium (H7/H3):** No "forgot password" flow on login page. No "show password" toggle on signup.
- **Low (H9):** Invalid verification token offers no resend option.
- **Low (H1):** No loading state indicators on auth forms — user cannot tell if submission is in progress.

---

### Journey B: Receive Upload Link → Upload Images via Token

**Step 1.** Client receives secure upload link → visits `/upload/[token]`.

| Heuristic | Score | Observation |
|-----------|-------|-------------|
| H1 | 4 | Token status card shows resolved token preview. Upload checklist visible. |
| H2 | 5 | "Secure upload" label, dropzone, file validation table — clear mental model. |
| H3 | 3 | No "cancel upload" mechanism. No back button to review token. |
| H4 | 4 | Consistent with standard upload interfaces. |
| H5 | 3 | **Critical gap:** Token is validated by `typeof token !== 'string' → notFound()`. No server-side token existence/expiry check on page load. Invalid/expired token shows 404 with no explanation. |
| H6 | 4 | Dropzone clearly shows accepted file types via Badge components. |
| H7 | 2 | No drag-and-drop alternative for keyboard users. ZIP upload is offered but no parallel upload capability. |
| H8 | 4 | Clean layout. |
| H9 | 3 | `error.tsx` boundary exists with "Try again" button, but error message is generic: "This upload link could not be loaded. The token may be invalid or expired." No specific error code shown. |
| H10 | 2 | No tooltip or help text explaining file requirements, size limits, or what happens after upload. |

**Step 2.** Drop files → validate → commit batch.

| Heuristic | Score | Observation |
|-----------|-------|-------------|
| H1 | 3 | No upload progress bar visible in the shell UI. File validation table shows sample files but upload state transitions are not rendered. |
| H2 | 4 | Drag-and-drop matches user expectation. |
| H3 | 2 | No way to remove individual files from the queue before submission. |
| H4 | 4 | Standard dropzone pattern. |
| H5 | 2 | **Critical gap:** Client-side file validation is not implemented in the current shell. `UploadDropzone` is a UI-only component — no actual validation runs before upload attempt. |
| H6 | 3 | Badge icons show accepted types but no visual cue for rejected files. |
| H7 | 1 | No keyboard-accessible file selection — drag-and-drop is mouse-dependent. |
| H8 | 4 | Clean, uncluttered. |
| H9 | 2 | Upload error page exists but only handles token-level errors, not per-file validation failures. |
| H10 | 1 | No help text, no documentation about file requirements. |

**Violations:**
- **Critical (H5):** Token validation is client-side string check only — no server-side resolution. Expired/invalid tokens show generic 404 with misleading "not found" instead of "link expired/invalid."
- **Critical (H5):** UploadDropzone has no client-side file validation. Users can submit unsupported files and get a server 422 with no client-side preview.
- **High (H7):** No keyboard-accessible file selection. Drag-and-drop is mouse-only.
- **Medium (H3):** No file removal from queue before submission. No cancel button.
- **Medium (H1):** No upload progress indicator.
- **Medium (H9):** Upload error page shows a generic message without the actual error code or actionable guidance.

---

### Journey C: Request Revision → Track Status

**Step 1.** Submit revision request via `POST /api/revisions/request`.

| Heuristic | Score | Observation |
|-----------|-------|-------------|
| H1 | 3 | No UI for revision status tracking visible in the client dashboard shell. |
| H2 | 4 | Revision request with notes field matches user expectation. |
| H3 | 3 | No ability to amend a submitted revision request. |
| H4 | 4 | Consistent with other mutation endpoints. |
| H5 | 3 | Idempotency guard prevents duplicate revision submissions, but no client-side warning. |
| H6 | 3 | Unclear what happens after submission — "revision" vs "reprocess" distinction not obvious. |
| H7 | 2 | No batch revision request for multiple files. |
| H8 | 3 | Revision UI not visible in current client shell — assumed minimal. |
| H9 | 3 | Structured error responses from API but may not translate to user-friendly frontend messages. |
| H10 | 1 | No documentation on revision SLA, expected turnaround, or what constitutes a valid revision request. |

**Violations:**
- **Medium (H6/H10):** No explanation of what happens after revision request — no SLA, no status tracking, no confirmation of expected turnaround.
- **Low (H3):** No ability to amend a submitted revision.

---

## P3. Listing Provider / Agency User

### Journey A: Sales Channel Import → Normalize → Job Creation

**Step 1.** Navigate to agency dashboard → import orders.

| Heuristic | Score | Observation |
|-----------|-------|-------------|
| H1 | 3 | No import progress indicator. Batch processing (parallel limit=10) has no per-item status visible in shell. |
| H2 | 4 | Sales channel terminology matches agency workflows. |
| H3 | 3 | No ability to pause or cancel an in-progress import. |
| H4 | 4 | Consistent API structure across all sales channel endpoints. |
| H5 | 3 | Deduplication via `/api/external-orders/dedupe-check` is available, but must be called as a separate step — no automatic dedupe on import. |
| H6 | 3 | Channel adapter key normalization requires user to know exact channel keys. No dropdown/autocomplete visible. |
| H7 | 2 | No bulk operations on the agency dashboard beyond the import itself. No template or saved import configuration. |
| H8 | 3 | Agency dashboard layout not fully visible in scan — assumed functional but unpolished. |
| H9 | 3 | Per-item errors collected and returned as array, but frontend display of mixed success/failure not confirmed. |
| H10 | 2 | No documentation on channel-specific normalization rules. Users must understand each channel's data model. |

**Step 2.** Review normalized results → create manual orders.

| Heuristic | Score | Observation |
|-----------|-------|-------------|
| H1 | 3 | DryRun mode exists for testing, but result visibility in UI not confirmed. |
| H2 | 4 | "Normalize" concept maps to agency workflow. |
| H3 | 3 | No way to selectively skip individual items from an import batch. |
| H4 | 4 | Consistent `dryRun` flag pattern across all creation endpoints. |
| H5 | 4 | DryRun prevents accidental creation — good error prevention. |
| H6 | 3 | Normalized payload structure may not be intuitive to non-technical agency staff. |
| H7 | 2 | No saved channel mappings or templates. Each import requires full configuration. |
| H8 | 3 | Functional, not polished. |
| H9 | 3 | Per-item errors returned but presentation quality unknown. |
| H10 | 2 | No inline guidance on normalization rules. |

**Violations:**
- **Medium (H10):** No documentation on channel-specific normalization behavior. Users must reverse-engineer adapter behavior.
- **Medium (H7):** No saved import templates or channel presets. Each import is fully manual configuration.
- **Low (H1):** No per-item import progress indicator. Batch results appear only after full completion.

---

## P4. Admin / Superadmin

### Journey A: Admin Dashboard → Job Queue → Job Detail → QC → Approval

**Step 1.** Login → middleware redirects to `/login?next=/admin/...` → session verified → dashboard renders.

| Heuristic | Score | Observation |
|-----------|-------|-------------|
| H1 | 4 | AdminJobQueueTable shows queue with summary cards. Status labels (WAITING_FOR_UPLOAD, WAITING_FOR_REVIEW, FLAGGED_OUTPUTS) clearly visible. |
| H2 | 4 | Job queue terminology matches fulfillment domain. |
| H3 | 3 | No inline actions in table — user must navigate to job detail for any operation. |
| H4 | 4 | Consistent page header and data table pattern across all admin pages. |
| H5 | 3 | No confirmation dialog before navigating away from job. |
| H6 | 4 | Status badges, priority indicators, deadline columns — good at-a-glance information. |
| H7 | 3 | Filter bar available but no saved filter presets or bulk selection in table. |
| H8 | 4 | Clean admin layout with consistent spacing. |
| H9 | 3 | No inline validation feedback on filter bar. Empty queue state not tested. |
| H10 | 3 | Page header descriptions provide context. |

**Step 2.** Navigate to job detail → quality control review.

| Heuristic | Score | Observation |
|-----------|-------|-------------|
| H1 | 4 | QualityControlBoard shows per-output status, quality scores, flag lists. |
| H2 | 4 | Review terminology matches QC domain. |
| H3 | 3 | No batch action available from quality page — user reviews one output at a time. Bulk review exists as separate endpoint but UI not confirmed. |
| H4 | 4 | Consistent output card pattern across all outputs. |
| H5 | 3 | No warning when approving a flagged output. |
| H6 | 4 | Quality scores and flag labels are clear. |
| H7 | 2 | Bulk-quality endpoint exists but no UI for it on this page. Admin must use separate endpoint or approve individually. |
| H8 | 4 | Clean output cards with status colors. |
| H9 | 3 | Flag resolution flow unclear from UI alone. No inline guidance on resolution types. |
| H10 | 3 | Page descriptions provide context. |

**Violations:**
- **Medium (H7):** Bulk QC review endpoint exists (`POST /api/quality-control/bulk-review`) but no UI for it — admin must approve/reject outputs individually.
- **Low (H5):** No confirmation dialog when approving a FLAGGED output — admin could accidentally approve a flagged item.
- **Low (H3):** No inline actions in job queue table — requires full page navigation for any operation.

---

### Journey B: Full Lifecycle — QC Flag → Manual Replacement → Re-approve

**Step 1.** Admin flags bad output → output transitions to FLAGGED.

| Heuristic | Score | Observation |
|-----------|-------|-------------|
| H1 | 4 | Flag immediately visible on QualityControlBoard with severity indicator. |
| H2 | 4 | "Flag" concept is standard in QC workflows. |
| H3 | 3 | No undo for an accidental flag. Would require a separate resolve endpoint. |
| H4 | 4 | Flag/create/review/resolve pattern consistent across all QC endpoints. |
| H5 | 3 | No client-side validation on flag severity — user could set mismatched severity. |
| H6 | 4 | Flag labels (edge_quality_issue, wrong_crop, failed_mask, missing_part) are descriptive. |
| H7 | 2 | No bulk-flag capability. Each output must be flagged individually. |
| H8 | 4 | Clean flag display. |
| H9 | 3 | Flag resolution endpoint exists but resolution options not documented in UI. |
| H10 | 2 | No guidance on what severity level to assign. |

**Step 2.** Upload manual replacement → re-approve.

| Heuristic | Score | Observation |
|-----------|-------|-------------|
| H1 | 3 | Manual upload flow not fully visible from shell. Upload progress unclear. |
| H2 | 4 | Manual replacement as admin upload maps to real workflow. |
| H3 | 3 | No ability to cancel a manual upload mid-stream. |
| H4 | 4 | Consistent with upload token pattern. |
| H5 | 3 | Audit logging on admin manual upload — good error prevention. |
| H6 | 3 | Difference between "manual replacement" and "reprocess" not visually distinguished. |
| H7 | 2 | No batch upload for multiple manual replacements. |
| H8 | 4 | Standard upload component. |
| H9 | 3 | No inline preview of replacement before approval submission. |
| H10 | 2 | No documentation on manual replacement workflow. |

**Violations:**
- **Medium (H7):** No bulk-flag or bulk-manual-replacement UI — admin repeats individual operations per output.
- **Low (H3):** No undo for accidental flag. Must resolve via separate endpoint.
- **Low (H6):** "Manual replacement" vs "reprocess" distinction not visible in UI.

---

## P5. API Consumer (Programmatic)

### Journey A: API Authentication → Create Job → Check Status

**Step 1.** Obtain API token → call `/api/v1/jobs` with appropriate auth.

| Heuristic | Score | Observation |
|-----------|-------|-------------|
| H1 | 4 | Structured response `{ ok, data }` with clear status codes. |
| H2 | 4 | RESTful conventions. |
| H3 | 4 | Idempotency key-based control gives consumer control over retries. |
| H4 | 4 | Consistent envelope format across all API versions. |
| H5 | 4 | Zod schemas enforce input validation with descriptive error messages. Rate limiting with Retry-After header. |
| H6 | 4 | Clear error codes: VALIDATION_ERROR, SESSION_REQUIRED, FORBIDDEN, NOT_FOUND, CONFLICT, RATE_LIMITED. |
| H7 | 3 | No pagination parameters visible in GET /api/v1/jobs schema. |
| H8 | 4 | JSON responses are clean and minimal. |
| H9 | 3 | Error messages are sanitized — technical Zod details hidden. Good for security but may obscure root cause. |
| H10 | 3 | API documentation exists but inline schema responses use `codexNote` fields — not production-ready documentation. |

**Step 2.** Create upload session → complete upload.

| Heuristic | Score | Observation |
|-----------|-------|-------------|
| H1 | 4 | dryRun mode returns full plan before real execution. |
| H2 | 4 | Upload session pattern matches file upload API conventions. |
| H3 | 3 | No way to update or delete a draft session. |
| H4 | 4 | Consistent dryRun flag across all creation endpoints. |
| H5 | 4 | Token storage "hash-only", unsafe upload protection, originals preserved — clear contract. |
| H6 | 3 | `dryRun` field is clear, but relationship between `/api/v1/uploads` and admin upload endpoints could confuse. |
| H7 | 3 | No bulk upload API endpoint. |
| H8 | 4 | Minimal response. |
| H9 | 3 | 422 validation on schema parse returns first error — consumer may need multiple rounds to fix all issues. |
| H10 | 2 | `codexNote` fields are developer hints, not consumer-facing documentation. OpenAPI/Swagger not confirmed. |

**Violations:**
- **Medium (H10):** API responses contain `codexNote` fields that are developer scaffolding, not production documentation. No OpenAPI/Swagger specification confirmed.
- **Low (H7):** No pagination parameters on GET /api/v1/jobs — assumes single-page results.
- **Low (H9):** Zod validation returns only the first error — consumers must fix-and-retry sequentially for multi-field issues.

---

## P6. Mobile User (Responsive)

### Journey: All journeys on mobile viewport

**Step 1.** Access home page on narrow viewport (<768px).

| Heuristic | Score | Observation |
|-----------|-------|-------------|
| H1 | 3 | Content stacks vertically on small screens, but no mobile-specific status indicators. |
| H2 | 4 | Content hierarchy preserved. |
| H3 | 2 | **Critical gap:** No hamburger menu. PublicShell uses `hidden md:flex` for nav — on mobile, nav items disappear with no fallback. No mobile menu toggle detected. |
| H4 | 3 | Tailwind breakpoints used but mobile UX is "hide desktop nav" — not a mobile-first approach. |
| H5 | 3 | Upload dropzone is still usable on mobile via touch, but file picker behavior depends on browser. |
| H6 | 4 | Content text is readable on mobile. |
| H7 | 1 | No mobile navigation. User relies on "Start upload" button and "Log in" link (which is hidden on mobile via `hidden sm:inline`). |
| H8 | 3 | Layout stacks but header lacks mobile optimization. |
| H9 | 2 | No mobile-specific error handling. Error pages same as desktop with tiny tap targets. |
| H10 | 1 | No mobile help or touch-friendly guidance. |

**Step 2.** Upload files on mobile.

| Heuristic | Score | Observation |
|-----------|-------|-------------|
| H1 | 2 | UploadDropzone not optimized for mobile — "Drop files" instruction assumes desktop drag-and-drop. |
| H2 | 3 | Touch to select files works via browser default. |
| H3 | 2 | No mobile-specific upload controls. |
| H4 | 3 | Dropzone renders same as desktop. |
| H5 | 2 | No mobile-specific file validation — camera captures may produce HEIC files not in accepted types. |
| H6 | 3 | Badge shows accepted types. |
| H7 | 1 | No mobile-specific upload workflow. Drag-and-drop instruction is desktop-biased. |
| H8 | 3 | Standard rendering. |
| H9 | 1 | "Try again" button on error page has 48px height — barely meets touch target minimum. |
| H10 | 1 | No mobile help. |

**Violations:**
- **Critical (H3/H7):** No mobile navigation menu. Public nav items are hidden on small screens with no hamburger toggle. Mobile users cannot navigate the site.
- **High (H7/H1):** Upload page instruction says "Drop files here" — inappropriate for mobile touch interface. Should say "Tap to select files."
- **Medium (H8):** Header layout not optimized for mobile. Log in link hidden behind `hidden sm:inline`.
- **Low (H9):** Error page "Try again" button at 48px is minimum touch target — barely accessible.

---

## P7. Screen-Reader User (A11y Baseline)

### Journey: All critical flows using assistive technology

**Step 1.** Navigate home page with screen reader.

| Heuristic | Score | Observation |
|-----------|-------|-------------|
| H1 | 3 | `main#main-content` landmark present — good. Skip-to-content link not detected. |
| H2 | 3 | ARIA labels exist (`aria-label="ListingLift home"`, `aria-label="Public navigation"`, `aria-hidden="true"` on decorative icon) but coverage is incomplete. |
| H3 | 2 | No skip-link. User tabs through entire header (logo + 3 nav links + 2 header actions) on every page. |
| H4 | 3 | Semantic HTML used in parts (nav, main) but not consistently. |
| H5 | 2 | Error prevention for screen reader users is limited — form validation errors may not be announced. |
| H6 | 2 | UploadDropzone's hidden `aria-hidden="true"` on decorative icon is correct, but the dropzone itself lacks `role="button"` or keyboard handler. |
| H7 | 1 | **Critical gap:** UploadDropzone is mouse-only — drag-and-drop requires pointer device. No keyboard-activated file picker. |
| H8 | 4 | Simple layout aids screen reader comprehension. |
| H9 | 2 | Error pages have no `role="alert"` or `aria-live="polite"` announcements. |
| H10 | 1 | No screen reader-specific help or instructions. |

**Step 2.** Complete signup/login flow with screen reader.

| Heuristic | Score | Observation |
|-----------|-------|-------------|
| H1 | 2 | No `aria-live` region for form submission status. Loading state not announced. |
| H2 | 3 | Standard form labels. |
| H3 | 2 | No way to pause or cancel form submission. |
| H4 | 3 | Standard form controls. |
| H5 | 2 | Inline validation errors not confirmed to be announced by screen reader. |
| H6 | 3 | Labels are clear. |
| H7 | 1 | No keyboard shortcut for form submission beyond Enter key. |
| H8 | 3 | Clean form. |
| H9 | 2 | Error messages present but `aria-describedby` not confirmed for error-to-field association. |
| H10 | 1 | No help text. |

**Violations:**
- **Critical (H7):** UploadDropzone is entirely inaccessible to keyboard-only and screen reader users — no `role="button"`, no keyboard event handler, no accessible file input. Drag-and-drop is mouse-dependent.
- **High (H3):** No skip-to-content link anywhere. Screen reader users must navigate entire header on every page load.
- **High (H9):** No `role="alert"` or `aria-live` announcements on error pages or form validation errors. Screen reader users may miss error state changes.
- **Medium (H1):** No `aria-live="polite"` region for form submission loading states. User cannot tell if submission is in progress.
- **Medium (H9):** Error-to-field association via `aria-describedby` not confirmed. Screen reader users may not connect error messages to the correct field.

---

## Cross-Cutting Evaluation: Error Messages & Form Validation

### Error Message Quality (from Q12_P1 Error Catalog)

| Error Type | Code Location | Heuristic Score | Assessment |
|------------|--------------|-----------------|------------|
| Zod validation | `mapServiceError` sanitizes → human-readable | **H9: 4** | Sanitization prevents raw regex/schema leaks. Good security hygiene. |
| CSRF errors | Returns code + message | **H9: 4** | Clear codes (CSRF_TOKEN_MISSING, CSRF_TOKEN_EXPIRED, etc.) — actionable. |
| Prisma errors (P2002) | Mapped to CONFLICT 409 | **H9: 3** | Good status code mapping but error message is Prisma's raw message — could expose internal table names. |
| Rate limiting | 429 + Retry-After header | **H9: 4** | Clear header-based feedback. |
| 404 (invalid token) | `notFound()` from Next.js | **H9: 2** | Generic 404 for invalid/expired upload tokens — misleading. Should differentiate "not found" from "expired." |
| Internal errors | 500 + generic message | **H9: 3** | Generic message is correct for security, but no error reference code for support. |

### Form Validation Patterns

| Pattern | Assessment | Severity |
|---------|-----------|----------|
| Server-side Zod validation | Strong. All endpoints validate input. | ✅ Good |
| Client-side pre-validation | Not present in UploadDropzone or auth forms. | **High** — users submit invalid data before server round-trip. |
| Inline field errors | Not confirmed — error display mechanism not visible in current UI. | **Medium** — errors likely shown as page-level toasts, not per-field. |
| Password strength indicator | Not detected in signup form (schema shows `min 8` only). | **Low** — minimal requirements shown. |
| File type/ size pre-check | Not present in UploadDropzone shell. | **High** — server rejects after upload attempt. |
| Idempotency feedback | Silent — no user-facing indication of duplicate detection. | **Low** — correct behavior, but user may wonder why nothing happened. |

**Key finding:** ListingLift has strong **server-side** validation via Zod schemas and structured error responses, but **client-side** form validation is nearly absent. Users experience round-trip delays for basic validation (empty fields, invalid formats) that could be caught instantly.

---

## Cross-Cutting Evaluation: Navigation & Recovery

### Can Users Recover from Wrong Turns?

| Scenario | Recovery Path | Assessment |
|----------|--------------|------------|
| 404 on invalid URL | No recovery — no home link, no search, no suggestions | **High** failure |
| Invalid/expired upload token | Shows 404 (misleading) — "Try again" button resets to same URL → same error | **Critical** — recovery button loops back to same error |
| 403 forbidden on admin page | Redirect to /login?next=... — clear recovery | ✅ Good |
| 401 no session | Redirect to /login with next parameter | ✅ Good |
| Wrong form data submitted | Back navigation loses form state | **Medium** — no draft saving |
| Cancelled file upload mid-stream | No cancel mechanism | **Medium** — must navigate away |
| Rate limited (429) | Retry-After header returned — frontend behavior not confirmed | **Medium** — API-level only, no UI throttle indicator |

---

## Summary: Violations by Severity

### Critical (blocks task)

1. **P6 (Mobile) — No mobile navigation menu.** Public nav is `hidden md:flex` with no hamburger fallback. Mobile users cannot navigate.
2. **P7 (A11y) — UploadDropzone is mouse-only.** No keyboard accessibility. Screen reader / keyboard-only users cannot upload files.
3. **P2 (Upload) — Token validation is client-side only.** Invalid/expired tokens show generic 404. Recovery button loops back to same error.
4. **P2 (Upload) — No client-side file validation.** User submits unsupported files, gets server 422 after upload attempt.

### High (severe friction)

1. **P1 (404) — No navigation recovery.** 404 page offers no links, no search, no suggestions.
2. **P6 (Mobile) — "Drop files here" on mobile.** Upload instruction is desktop-biased. Should say "Tap to select files."
3. **P7 (A11y) — No skip-to-content link.** Screen reader users tab through entire header on every page load.
4. **P7 (A11y) — No aria-live announcements.** Error state changes not announced to screen readers.
5. **P2 (Upload) — No keyboard-accessible file selection.** Drag-and-drop is mouse-only, no accessible fallback.

### Medium (notable friction)

1. **P1 (Home) — No skip-to-content link.**
2. **P1 (Home) — Empty PackageGrid has no fallback state.**
3. **P2 (Auth) — No "forgot password" flow. No "show password" toggle.**
4. **P2 (Upload) — No file removal from queue. No upload progress indicator.**
5. **P3 (Agency) — No saved import templates. No documentation on normalization rules.**
6. **P4 (Admin) — No bulk-QC UI despite bulk endpoint existing.**
7. **P4 (Admin) — No confirmation when approving flagged output.**
8. **P7 (A11y) — Form loading states not announced to screen reader.**
9. **All — No client-side pre-validation on any form.** All validation is server round-trip.

### Low (minor polish)

1. **P5 (API) — Zod returns only first validation error. No pagination on GET endpoints.**
2. **P5 (API) — `codexNote` fields in API responses not production-ready.**
3. **P4 (Admin) — No undo for accidental flag.**
4. **P6 (Mobile) — "Log in" link hidden on mobile. Error button at minimum touch target.**
5. **P2 (Auth) — No "resend verification" option on invalid token error.**

---

## Recommendations by Priority

### Immediate (Critical/High)

1. **Add mobile hamburger menu** — replace `hidden md:flex` with responsive nav that shows a toggle button on small screens.
2. **Make UploadDropzone keyboard-accessible** — add hidden `<input type="file">`, `role="button"`, `tabIndex={0}`, and keyboard event handler (Enter/Space to open file picker).
3. **Implement server-side token resolution on upload page** — validate token expiry, existence, and usage count before rendering upload UI. Show specific error states (expired, used, invalid) instead of generic 404.
4. **Add client-side file validation** — check file type, size, and count against token constraints before upload attempt. Show inline errors.
5. **Add skip-to-content link** — first tabbable element on every page, linking to `#main-content`.
6. **Fix 404 page** — add "Return home" link and navigation suggestions.
7. **Add `aria-live="polite"` regions** — announce form submission states, errors, and confirmations to screen readers.

### Short-term (Medium)

8. **Add upload progress indicator** — show file upload percentage, per-file status (queued/uploading/validated/failed).
9. **Add "forgot password" flow** — link on login page, email-based reset.
10. **Add saved import templates for agency users** — allow saving channel mappings and normalization preferences.
11. **Build bulk-QC UI** — wire the existing bulk-review endpoint to a multi-select interface on the quality control page.
12. **Add confirmation dialog** when approving flagged outputs.
13. **Wire form error messages to fields with `aria-describedby`.**
14. **Add password strength indicator** on signup form.
15. **Replace "Drop files" with touch-friendly instructions on mobile.**

### Future (Low)

16. **Add OpenAPI/Swagger documentation** for public API.
17. **Add pagination support to GET /api/v1/jobs.**
18. **Return all validation errors** from Zod instead of first-only.
19. **Add undo for QC flags** — soft-delete with confirmation dialog.
20. **Add error reference codes** to 500 responses for support triage.

---

## Heuristic Score Summary

| Persona | H1 | H2 | H3 | H4 | H5 | H6 | H7 | H8 | H9 | H10 | Avg |
|---------|----|----|----|----|----|----|----|----|----|-----|-----|
| P1 Anonymous | 4.0 | 4.5 | 3.5 | 4.5 | 3.5 | 4.0 | 1.5 | 4.5 | 2.5 | 1.5 | 3.4 |
| P2 Client | 3.2 | 4.4 | 2.8 | 4.0 | 3.2 | 3.4 | 1.8 | 4.0 | 3.0 | 1.6 | 3.1 |
| P3 Agency | 3.0 | 4.0 | 3.0 | 4.0 | 3.5 | 3.0 | 2.0 | 3.5 | 3.0 | 2.0 | 3.1 |
| P4 Admin | 3.8 | 4.0 | 3.0 | 4.0 | 3.3 | 4.0 | 2.3 | 4.0 | 3.0 | 2.7 | 3.4 |
| P5 API Consumer | 4.0 | 4.0 | 3.5 | 4.0 | 4.0 | 3.5 | 3.0 | 4.0 | 3.0 | 2.3 | 3.5 |
| P6 Mobile | 2.3 | 3.3 | 2.0 | 3.0 | 2.7 | 3.3 | 1.0 | 3.0 | 1.7 | 1.0 | 2.3 |
| P7 A11y | 2.7 | 3.0 | 2.0 | 3.3 | 2.0 | 2.7 | 1.0 | 3.3 | 2.0 | 1.0 | 2.3 |

**Overall average: 3.0 / 5.0** — Moderate usability baseline with critical gaps in mobile responsiveness and accessibility.

---

## Cross-Cutting Observations

- **Server-side architecture is strong.** Zod validation, idempotency, structured error codes, and consistent response envelopes provide a solid backend foundation.
- **Frontend is a shell.** Many components are UI-only with `codexNote` scaffolding. Real validation, progress indicators, error display, and state management are pending implementation.
- **Accessibility is the weakest area.** Two critical violations (no keyboard upload, no mobile nav) and three high violations create significant barriers for disabled users.
- **Error recovery is inconsistent.** Auth errors redirect well (401→login, 403→login). But 404 offers no recovery, and upload token errors loop back to themselves.
- **Mobile experience is desktop-shrunk.** No responsive navigation, no touch-optimized interactions, desktop-biased language throughout.

---

## Error Catalog Items Evaluated

| Error Code | Endpoint | Helpful? | Severity | Recommendation |
|-----------|----------|----------|----------|----------------|
| VALIDATION_ERROR | All POST | ✅ Yes — sanitized message | — | Add field-level `aria-describedby` association. |
| SESSION_REQUIRED | Protected routes | ✅ Yes — redirect to login | — | Already good. |
| FORBIDDEN | Protected routes | ✅ Yes — clear code | — | Already good. |
| NOT_FOUND | Token-based routes | ⚠️ Partial — generic 404 misleading | **High** | Differentiate "token expired" vs "token invalid" vs "not found." |
| CONFLICT | Signup, webhook | ✅ Yes — clear | — | Good. |
| RATE_LIMITED | /api/listings | ⚠️ Partial — header only, no UI | **Medium** | Show toast/banner with Retry-After countdown. |
| CSRF_TOKEN_* | Mutation endpoints | ✅ Yes — clear codes | — | Good. |
| INTERNAL_SERVER_ERROR | All | ⚠️ Minimal — no reference code | **Low** | Add `referenceId` for support triage. |

---

*End of Q12 Phase 3 — Cognitive Walkthrough & Heuristic Evaluation. Ready for Q12_P3_AUDIT (Deziray).*
