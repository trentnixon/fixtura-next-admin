# Worker Implementation Doc - Grade Fixture Discovery Trigger

## Goal

Add a user-triggered CTA to the grade detail route at `/dashboard/grades/[gradeID]` that queues fixture discovery for the current grade via the CMS endpoint.

This document is implementation-focused for the Admin frontend worker. It fills in the frontend decisions that are not fully specified in the backend handoff note.

Related source docs:

- Request handoff: [../requests/admin-fixture-discovery-grade-trigger.md](../requests/admin-fixture-discovery-grade-trigger.md)

---

## Scope

Implement all frontend pieces required for a working CTA on the grade detail page:

1. Add a dedicated typed request/response contract.
2. Add a service function that calls the CMS endpoint.
3. Add a React Query mutation hook with toast handling.
4. Add a button with confirmation dialog and pending state.
5. Render the CTA on the grade detail page header area.

Out of scope:

- Polling for fixture discovery completion
- Worker-status UI
- New backend work
- Authentication or route protection changes

---

## Route Context

The current page is:

- [src/app/dashboard/grades/[gradeID]/page.tsx](D:/htdoc/Fixtura/Fixtura.com.au/Admin/fixtura-admin/src/app/dashboard/grades/[gradeID]/page.tsx)

The page already:

- Reads `gradeID` from `useParams()`
- Loads grade detail through `useGradeByID(...)`
- Renders action icons in the top-right header area

Existing query hook:

- [src/hooks/grades/useGradeByID.ts](D:/htdoc/Fixtura/Fixtura.com.au/Admin/fixtura-admin/src/hooks/grades/useGradeByID.ts)

Existing query key:

- `["gradeInRender", gradeID]`

Use that key for local invalidation if needed.

---

## Canonical Endpoint For This App

Use this path in the Admin frontend service layer:

- `POST /grade/trigger-fixture-discovery`

Do not call `/api/grade/trigger-fixture-discovery` from the service file.

Reason:

- The shared Axios client already uses `NEXT_APP_API_BASE_URL` as its base URL.
- In this repo, service functions pass relative endpoint paths like `"/club/trigger-club-single-scrape"` rather than repeating `/api`.

Reference:

- [src/lib/axios.ts](D:/htdoc/Fixtura/Fixtura.com.au/Admin/fixtura-admin/src/lib/axios.ts)

---

## Request/Response Contract

### Request payload

```json
{
  "id": 1234
}
```

Rules:

- `id` is required
- `id` must be a positive integer
- `id` is the Strapi grade document id from the current page

### Success response

Expected shape:

```json
{
  "success": true,
  "jobId": "fixture-discovery:1234:cms-fixture-discovery-grade-1712345678901",
  "runId": "cms-fixture-discovery-grade-1712345678901",
  "message": "Fixture discovery grade job queued successfully",
  "queueName": "fixture_discovery",
  "gradeId": 1234
}
```

Type expectations for frontend:

- `success: boolean`
- `jobId: string`
- `runId: string`
- `message: string`
- `queueName: string`
- `gradeId: number`

### Error handling

Expected 400-style messages include:

- `id is required`
- `id must be a positive integer`
- `Grade not found: <id>`
- `Grade has no url`
- `Grade has no competition`
- `Competition has no association`
- `Association has no Sport`
- `Association Sport must not be Unknown`

The service should normalize Strapi-style error shapes and throw `Error(message)` so the hook can show `toast.error(...)`.

---

## UX Decision

This CTA should follow the same interaction pattern already used elsewhere in this repo for queue-trigger buttons.

Pattern:

1. User clicks CTA.
2. Confirmation dialog opens.
3. User confirms.
4. Mutation runs.
5. Button shows pending state while request is in flight.
6. On success:
   - close dialog
   - show success toast
7. On error:
   - keep dialog open
   - show error toast

Reference patterns:

- [src/app/dashboard/club/[id]/components/ClubHeader.tsx](D:/htdoc/Fixtura/Fixtura.com.au/Admin/fixtura-admin/src/app/dashboard/club/[id]/components/ClubHeader.tsx)
- [src/app/dashboard/competitions/[competitionID]/components/CompetitionAdminDetail/sections/SnapshotSection.tsx](D:/htdoc/Fixtura/Fixtura.com.au/Admin/fixtura-admin/src/app/dashboard/competitions/[competitionID]/components/CompetitionAdminDetail/sections/SnapshotSection.tsx)

---

## CTA Placement

Render the new CTA in the existing action group in the grade detail page header.

Current location:

- The action row in [page.tsx](D:/htdoc/Fixtura/Fixtura.com.au/Admin/fixtura-admin/src/app/dashboard/grades/[gradeID]/page.tsx) beside:
  - PlayHQ external link button
  - Strapi CMS button
  - badges

Recommended placement:

- Add the new action button before the status badges.

Recommended label:

- `Discover Fixtures`

Recommended icon:

- `RefreshCw`

Recommended variant:

- `accent`

Recommended size:

- `sm`

---

## File Plan

Create these files:

1. `src/types/triggerFixtureDiscoveryGrade.ts`
2. `src/lib/services/data-collection/triggerFixtureDiscoveryGrade.ts`
3. `src/hooks/grades/useTriggerFixtureDiscoveryGrade.ts`
4. `src/app/dashboard/grades/[gradeID]/components/TriggerFixtureDiscoveryButton.tsx`

Update this file:

5. `src/app/dashboard/grades/[gradeID]/page.tsx`

No backend files are part of this task.

---

## Implementation Details

### 1. Type file

Create:

- [src/types/triggerFixtureDiscoveryGrade.ts](D:/htdoc/Fixtura/Fixtura.com.au/Admin/fixtura-admin/src/types/triggerFixtureDiscoveryGrade.ts)

Suggested shape:

```ts
export interface TriggerFixtureDiscoveryGradeRequest {
  id: number;
}

export interface TriggerFixtureDiscoveryGradeSuccessResponse {
  success: boolean;
  jobId: string;
  runId: string;
  message: string;
  queueName: string;
  gradeId: number;
}
```

Notes:

- `jobId` must be typed as `string`, not `number`
- Match the backend handoff sample exactly

### 2. Service file

Create:

- [src/lib/services/data-collection/triggerFixtureDiscoveryGrade.ts](D:/htdoc/Fixtura/Fixtura.com.au/Admin/fixtura-admin/src/lib/services/data-collection/triggerFixtureDiscoveryGrade.ts)

Implementation rules:

- Add `"use server";`
- Use `axiosInstance`
- Call `axiosInstance.post("/grade/trigger-fixture-discovery", payload)`
- Normalize error shapes the same way as other trigger services in the repo
- Throw a plain `Error` with a user-safe message

Model this after:

- [src/lib/services/data-collection/triggerClubSingleScrape.ts](D:/htdoc/Fixtura/Fixtura.com.au/Admin/fixtura-admin/src/lib/services/data-collection/triggerClubSingleScrape.ts)

### 3. Mutation hook

Create:

- [src/hooks/grades/useTriggerFixtureDiscoveryGrade.ts](D:/htdoc/Fixtura/Fixtura.com.au/Admin/fixtura-admin/src/hooks/grades/useTriggerFixtureDiscoveryGrade.ts)

Implementation rules:

- Use `useMutation`
- Import `toast` from `sonner`
- Call the new service function in `mutationFn`
- Show `toast.success(...)` on success
- Show `toast.error(...)` on failure

Success toast behavior:

- Prefer `data.message`
- Fallback copy:
  - `Fixture discovery job queued (Job ID: ${data.jobId}, Queue: ${data.queueName})`

Query invalidation:

- Invalidate `["gradeInRender", variables.id]`
- Do not add broader invalidation unless there is a proven UI dependency

Reason:

- This route already uses `["gradeInRender", gradeID]` and that is the least-surprising local refresh target.
- The trigger itself is asynchronous, so invalidation is mostly for consistency rather than immediate visible data change.

### 4. CTA component

Create:

- [src/app/dashboard/grades/[gradeID]/components/TriggerFixtureDiscoveryButton.tsx](D:/htdoc/Fixtura/Fixtura.com.au/Admin/fixtura-admin/src/app/dashboard/grades/[gradeID]/components/TriggerFixtureDiscoveryButton.tsx)

Props:

```ts
{
  gradeId: number;
  disabled?: boolean;
}
```

Behavior:

- Open confirmation dialog on click
- Show `Queuing...` while pending
- Close dialog only after successful mutation
- Keep dialog open on error

Suggested dialog copy:

- Title:
  - `Confirm Fixture Discovery`
- Description:
  - `This will queue a background job to discover fixtures for this grade. The CMS resolves the grade's sport and PlayHQ URL, then enqueues the job to the fixture_discovery queue. The job runs asynchronously.`
- Detail block:
  - `Grade ID: {gradeId}`

Confirm button label:

- `Confirm Discovery`

Cancel button label:

- `Cancel`

### 5. Page integration

Update:

- [src/app/dashboard/grades/[gradeID]/page.tsx](D:/htdoc/Fixtura/Fixtura.com.au/Admin/fixtura-admin/src/app/dashboard/grades/[gradeID]/page.tsx)

Integration rules:

- Import the new button component
- Render it in the top-right action row
- Pass `grade?.topLineData.id`

Disable logic:

- Disable button when grade id is missing or invalid

Recommended:

```ts
disabled={!grade?.topLineData.id}
```

Do not block the button based on `url` presence in the frontend.

Reason:

- The backend already performs authoritative validation and returns a clear error message.
- The current page data may not expose enough linked relation detail to safely infer all prerequisites client-side.

---

## Acceptance Criteria

Implementation is complete when all of the following are true:

- A visible `Discover Fixtures` CTA appears on `/dashboard/grades/[gradeID]`
- Clicking the CTA opens a confirmation dialog
- Confirming sends `POST /grade/trigger-fixture-discovery` with `{ id: gradeId }`
- Pending state disables repeated submits
- Success closes the dialog and shows a success toast
- Failure keeps the dialog open and shows an error toast
- The new code follows existing repo patterns for:
  - type file
  - service file
  - hook file
  - button component
- No `/api/api/...` path duplication is introduced

---

## Manual Test Plan

### Happy path

1. Open a valid grade detail page.
2. Click `Discover Fixtures`.
3. Confirm the action.
4. Verify a success toast appears.
5. Verify no console/runtime errors occur.

### Validation path

Test with a grade known to be missing one prerequisite such as `url` or association sport.

1. Open the grade detail page.
2. Click `Discover Fixtures`.
3. Confirm the action.
4. Verify an error toast surfaces the backend message.
5. Verify the dialog remains open after failure.

### Regression checks

1. Existing PlayHQ link still works.
2. Existing Strapi link still works.
3. Status badges still render correctly.
4. Teams table remains unaffected.

---

## Notes For The Worker

- Follow existing naming patterns exactly.
- Keep implementation ASCII-only.
- Use `apply_patch` for edits.
- Do not invent extra status polling or job detail UI in this task.
- If a shared icon import is already present in the target file, reuse it where practical.

---

## Implementation Summary

This is a straightforward frontend queue-trigger integration. The only important repo-specific pitfall is endpoint path construction: use the relative path `"/grade/trigger-fixture-discovery"` with the shared Axios client, not a hard-coded `/api/...` path.
