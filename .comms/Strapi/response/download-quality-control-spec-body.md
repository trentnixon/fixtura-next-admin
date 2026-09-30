## Problem Statement

Fixtura operators monitoring **renders** cannot reliably triage **download output failures** at fleet scale or quickly understand whether a problem is a failed download row, a **render output integrity** gap, or a **render pipeline failure** (account asset run). Per-render Downloads UI only shows coarse icons for `hasError` and `hasBeenProcessed`, omits structured errors, and does not classify legacy ambiguous rows. There is no **download attention** queue on the Global Render Monitor, and using raw Strapi `GET /api/downloads` fleet-wide is unsuitable (draft/publish, indexing, account context).

## Solution

Introduce **download attention** in the Renders workspace in phased delivery:

1. **Phase A (now):** Enrich render-detail **Downloads** with attention buckets, full error display, `publicationState=preview` fetch, and force rerender; add Overview **three-signal** navigation (download attention path, integrity audit, render activity failures).
2. **Phase B (after CMS):** New authenticated admin **quality-queue** route and a **Download attention** tab on `/dashboard/renders`.
3. **Phase C (after CMS):** Sydney-bucket summary tiles on Overview.
4. **Phase D (later):** Separate **Article QC** tab using Pressbox fields—not mixed with download rows.

Keep three signals separate in product and data: **download output failure**, **render output integrity**, **render pipeline failure**.

## User Stories

1. As an operator, I want to open a render’s Downloads tab and see which outputs **need attention**, so that I can triage Creator failures without opening every row in Strapi.
2. As an operator, I want downloads classified as **Failed**, **In progress**, **OK**, or **Unknown**, so that legacy ambiguous rows are never shown as silently healthy.
3. As an operator, I want **Failed** to include rows with `hasError` true or non-empty `errorHandler`, so that CMS legacy combinations are handled consistently.
4. As an operator, I want to read `UserErrorMessage` on the render Downloads view, so that I see the primary user-facing failure text without opening download detail.
5. As an operator, I want to see `errorHandler` entry **Type** values as chips, so that I get a quick category hint when types are present.
6. As an operator, I want to see when **error email was sent to admin**, so that I know notification already happened.
7. As an operator, I want to filter Downloads on a render by **All**, **Needs attention**, **In progress**, and **Failed**, so that I can focus the table.
8. As an operator, I want draft/unpublished download rows visible on render detail, so that QC is not hidden by default published-only Strapi behaviour.
9. As an operator, I want to **force rerender** a download from render detail, so that I can retry output without PATCHing `forceRerender` alone in Strapi.
10. As an operator, I want the UI to refetch after force rerender and explain that `hasError` may remain until Creator updates, so that I do not assume immediate clearance.
11. As an operator, I want the Global Render Monitor Overview to show **three cards** (download attention, integrity, pipeline failures), so that I pick the right troubleshooting path.
12. As an operator, I want the download attention card to deep-link appropriately before the fleet tab exists (e.g. guidance or render-detail entry), so that I am not blocked until CMS Option A ships.
13. As an operator, I want the integrity card to link to per-render **Integrity Audit**, so that ghost and fixture-gap issues stay separate from download flags.
14. As an operator, I want the pipeline card to link to **Render activity** with failed status, so that orchestration failures are not confused with download rows.
15. As an operator, I want account labels on future fleet rows to match render audit (`FirstName` via render → scheduler → account), so that naming is consistent across monitors.
16. As an operator, I want links from QC contexts to the correct **club or association client** overview, so that I can jump to the paying customer record.
17. As an operator, I want a future **Download attention** tab listing fleet rows paginated by `updatedAt`, so that I can work a queue without scanning every render.
18. As an operator, I want the fleet queue default window of **7 days** on `updatedAt` with 24h/48h/7d/custom presets, so that triage matches operational habits.
19. As an operator, I want fleet queue default filter **needs attention** (failed flags or errorHandler), so that the queue opens on actionable rows.
20. As an operator, I want **Unknown** bucket rows excluded from the fleet queue by default, so that ambiguous legacy data does not flood the queue.
21. As an operator, I want timestamps in the fleet UI displayed in **Australia/Sydney**, so that local ops time is clear.
22. As an operator, I want future Overview summary tiles using **Sydney calendar days**, so that daily counts match local operations—not render telemetry `failedToday`.
23. As an operator, I want force rerender on fleet queue rows when Phase B ships, so that I can act from the queue.
24. As an operator, I want to open download detail and render detail from queue rows, so that I can drill down.
25. As an operator, I want download QC to **not** merge asset-run failures into the same table, so that pipeline vs output semantics stay clear.
26. As an operator, I want download QC to **not** treat render **Complete** as “no download problems”, so that I do not miss failed outputs on completed renders.
27. As an operator, I want the system to **not** use `isAccurate` for filtering, so that I am not misled by an unused field.
28. As an operator, I want article failures handled in a **separate** Article QC experience later, so that Pressbox state is authoritative for articles.
29. As a developer, I want CMS contracts documented in comms artifacts, so that implementation does not re-litigate field semantics.
30. As a developer, I want domain terms in `CONTEXT.md` aligned with UI copy (**download attention**, etc.), so that specs and code share vocabulary.

## Implementation Decisions

### Phasing

- **Phase A** ships without new CMS routes; **Phase B/C** blocked on CMS Option A/B quality-queue and summary endpoints (authenticated like render audit, not public `auth: false`).
- Local tracking: **TKT-2026-002** in renders `Tickets.md`. CMS references: `download-quality-control-cms-response.md`, `download-quality-control-admin-decisions.md`.

### Domain classification module

- Introduce a small pure module (e.g. under shared lib for downloads/renders) that classifies a download-shaped input into attention buckets and exposes `needsAttention` for filters.
- Bucket rules:

```
Failed:     hasError === true OR non-empty errorHandler array
In progress: NOT Failed AND hasBeenProcessed === false
OK:         hasBeenProcessed === true AND NOT Failed
Unknown:    everything else
```

- `errorHandler` normalization: treat non-array / missing as empty; entries with Type/Message optional strings.
- `hasError === null` is **not** healthy.

### Render-detail data loading

- Extend render-scoped download fetch to use Strapi `publicationState=preview`, include fields: `UserErrorMessage`, `errorHandler`, `errorEmailSentToAdmin`, `updatedAt` (and existing QC fields).
- Extend download TypeScript attributes for `errorHandler` JSON shape `{ Message?: string; Type?: string }[]`.
- Do **not** use fleet-wide unscoped `GET /api/downloads` for a queue in Phase A.

### Render-detail UI

- Enhance Downloads table: bucket badge per asset group or row (per existing grouping strategy), filter control, error message + type chips, admin-email-sent indicator.
- Preserve links to download detail, Strapi, and file URLs where present.
- Replace binary Errors column semantics with bucket-aware display where appropriate.

### Force rerender

- New server action or service calling `POST /api/download/ForceAssetRerender` with body `{ data: { RerenderID: "<download id>" } }` (authenticated axios instance).
- On success, invalidate/refetch render downloads query; surface toast or inline note that stale `hasError` / `UserErrorMessage` may persist until Creator writes.

### Overview three-signal cards

- New section on `/dashboard/renders` Overview tab: three cards with short copy from CMS rules of thumb.
- Links: integrity → example render detail audit tab is per-render—card links to Audit tab or docs path; pipeline → Render activity with `status=failed`; download attention → placeholder CTA until Phase B (e.g. “Open a render → Downloads” or disabled state with copy)—per admin decisions, no fake fleet table.

### Phase B — Fleet queue (CMS Option A)

- Hook + service for CMS admin quality-queue endpoint (final path per CMS; params: `from`/`to` on `updatedAt`, `hasError`, sport via scheduler account, accountType, assetCategory, `q`, pagination ≤100, sort `updatedAt:desc`).
- New Renders tab **Download attention** with table, filters, pagination, row actions (view render, view download, force rerender).
- Row shape uses `firstName`/`lastName`, `account_type.Name`, `errorHandler`, `userErrorMessage` per CMS—not `isAccurate`.

### Phase C — Summary (CMS Option B)

- Overview metrics from summary endpoint; Sydney day buckets; counts for `hasError true` and `hasBeenProcessed false` in window; no attachment to render telemetry.

### Phase D — Article QC

- Separate tab and CMS article queue when available; use Pressbox `latestFailureCode`, `latestFailureSummary`, `currentOutcome`; do not reuse download row component.

### Explicit non-changes

- Do not extend `GET /api/renders/audit`, telemetry, or lineage for download QC.
- Do not add `downloadsWithErrorCount` to audit.
- Do not merge render-activity failures into download queue.
- No `qcReviewedAt`, bulk rerender by filter, or `isAccurate` filters in v1.

## Testing Decisions

### What makes a good test

- Test **observable classification behaviour** and edge cases (legacy null `hasError`, processed + non-empty `errorHandler`, empty errorHandler), not React component internals or axios mocks unless testing query serialization in a dedicated builder.
- Prefer **one primary seam**: the pure **download attention** classification module (same pattern as `globalRunAnalytics` / `displayRules` unit tests under `src/lib/**/__tests__`).

### Modules to test

- Download attention bucket classifier and `needsAttention` helper (Failed ∪ In progress for “needs attention” filter semantics per product: filter **Needs attention** = Failed only or Failed+In progress—admin decisions say filters "Needs attention | In progress | Failed" as separate filters; `needsAttention` for card copy may mean Failed OR errorHandler—align tests with filter names).

Clarify in tests:
- **Needs attention** filter = Failed bucket only (hasError or errorHandler) per Q14 fleet default; render detail filters list Needs attention | In progress | Failed separately per Q3.

### Prior art

- `src/lib/account-health/__tests__/globalRunAnalytics.test.ts` — pure functions, table-driven cases.
- `src/lib/account-health/__tests__/displayRules.test.ts` — status labels and rules.

### Optional secondary seam (only if query builder extracted)

- Unit test Strapi qs payload includes `publicationState=preview` and required fields—only if builder is a pure function; otherwise skip and rely on manual QA for fetch.

### Out of test scope for Phase A

- E2E against live Strapi; CMS Option B/C until routes exist.

## Out of Scope

- AI article QC in download tab (Phase D).
- Downloads listing page at `/dashboard/downloads` (separate TKT-2025-006).
- Extending render audit, telemetry, lineage APIs.
- Mark-reviewed / QC status fields on CMS.
- Bulk force rerender.
- Using `isAccurate`, `URL`, or file size as failure inference.
- Temporary global Strapi download scan for fleet queue.
- Member Content Hub download bundle route for Admin QC.

## Further Notes

- **Three signals** glossary is in root `CONTEXT.md`.
- After force rerender, CMS may leave `hasError` and `UserErrorMessage` until Creator updates.
- Retention: completed renders older than 365 days may be deleted with downloads when cleanup cron is enabled—operators should not expect indefinite fleet history without CMS archive.
- CMS comms in repo: `.comms/Strapi/response/download-quality-control-cms-response.md`.
- Implementation phases A→D; agent should implement **Phase A** unless issue comments direct otherwise.
