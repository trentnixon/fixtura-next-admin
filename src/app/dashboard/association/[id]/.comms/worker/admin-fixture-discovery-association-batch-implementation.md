# Worker Implementation Plan - Association Fixture Discovery Batch CTA

**Route:** `/dashboard/association/[id]`
**Scope:** Add an onClick CTA that triggers fixture discovery for all grades under the current association.
**Reference request:** [`../request/admin-fixture-discovery-association-batch-trigger.md`](../request/admin-fixture-discovery-association-batch-trigger.md)

---

## Goal

Implement a new association-level CTA on the association detail page that calls:

- `POST /api/association/trigger-fixture-discovery-batch`

with:

```json
{
  "associationId": 123
}
```

The CTA should follow the same UX pattern already used on this page for:

- `Process Direct`
- `Grades batch scrape`
- `Lookup teams batch`

Primary integration target:

- [`src/app/dashboard/association/[id]/components/AssociationHeader.tsx`](D:/htdoc/Fixtura/Fixtura.com.au/Admin/fixtura-admin/src/app/dashboard/association/[id]/components/AssociationHeader.tsx)

---

## What We Learned

The request handoff covers the backend contract well, but it does **not** fully specify the frontend implementation details needed in this repo.

The missing pieces we need to lock down in code are:

- exact file names for the new type, service, and hook
- CTA placement in the current route
- button label and dialog copy
- toast content on success and failure
- React Query invalidation behavior
- error parsing shape in the service layer

There is also an existing repo caveat:

- the association detail page queries with `["association-detail", id]`
- some existing association mutation hooks incorrectly invalidate `["associationDetail", id]`

Do **not** copy that mismatch into this implementation.

Reference:

- [`src/hooks/association/useAssociationDetail.ts`](D:/htdoc/Fixtura/Fixtura.com.au/Admin/fixtura-admin/src/hooks/association/useAssociationDetail.ts)

---

## Required Files

Create these files:

1. `src/types/triggerFixtureDiscoveryAssociationBatch.ts`
2. `src/lib/services/data-collection/triggerFixtureDiscoveryAssociationBatch.ts`
3. `src/hooks/association/useTriggerFixtureDiscoveryAssociationBatch.ts`

Update this file:

4. `src/app/dashboard/association/[id]/components/AssociationHeader.tsx`

Optional docs update if the team wants the repo docs kept current:

5. association services/hooks readme references if similar trigger docs are being maintained elsewhere

---

## Type Contract

Create:

- [`src/types/triggerFixtureDiscoveryAssociationBatch.ts`](D:/htdoc/Fixtura/Fixtura.com.au/Admin/fixtura-admin/src/types/triggerFixtureDiscoveryAssociationBatch.ts)

Suggested contents:

```ts
/**
 * Types for POST /association/trigger-fixture-discovery-batch
 * Queues one fixture_discovery job per eligible grade under an association.
 */

export interface TriggerFixtureDiscoveryAssociationBatchRequest {
  associationId: number;
}

export interface TriggerFixtureDiscoveryAssociationBatchSuccessResponse {
  success: true;
  associationId: number;
  sport: string;
  competitionsScanned: number;
  gradesFound: number;
  queued: number;
  skipped: number;
  queueName: "fixture_discovery";
  runId: string;
}
```

---

## Service Layer

Create:

- [`src/lib/services/data-collection/triggerFixtureDiscoveryAssociationBatch.ts`](D:/htdoc/Fixtura/Fixtura.com.au/Admin/fixtura-admin/src/lib/services/data-collection/triggerFixtureDiscoveryAssociationBatch.ts)

Implementation requirements:

- mark file with `"use server"`
- use the existing `axiosInstance` pattern
- POST to `"/association/trigger-fixture-discovery-batch"`
- accept `TriggerFixtureDiscoveryAssociationBatchRequest`
- return `TriggerFixtureDiscoveryAssociationBatchSuccessResponse`
- parse error shapes defensively

Error parsing must support all of these:

- plain string body
- `{ message: string }`
- `{ error: { message: string } }`
- fallback to `error.message`

Suggested implementation shape:

```ts
"use server";

import axiosInstance from "@/lib/axios";
import axios from "axios";
import type {
  TriggerFixtureDiscoveryAssociationBatchRequest,
  TriggerFixtureDiscoveryAssociationBatchSuccessResponse,
} from "@/types/triggerFixtureDiscoveryAssociationBatch";

function messageFromAxiosResponseData(data: unknown): string | undefined {
  if (typeof data === "string" && data.trim()) {
    return data.trim();
  }

  if (data && typeof data === "object") {
    const value = data as {
      message?: string;
      error?: { message?: string };
    };
    return value.error?.message ?? value.message;
  }

  return undefined;
}

export async function triggerFixtureDiscoveryAssociationBatch(
  payload: TriggerFixtureDiscoveryAssociationBatchRequest
): Promise<TriggerFixtureDiscoveryAssociationBatchSuccessResponse> {
  try {
    const response =
      await axiosInstance.post<TriggerFixtureDiscoveryAssociationBatchSuccessResponse>(
        "/association/trigger-fixture-discovery-batch",
        payload
      );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        messageFromAxiosResponseData(error.response?.data) ??
        error.message ??
        `Request failed: ${error.response?.status ?? "Unknown"}`;

      throw new Error(message);
    }

    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to trigger association fixture discovery batch"
    );
  }
}
```

---

## Hook Layer

Create:

- [`src/hooks/association/useTriggerFixtureDiscoveryAssociationBatch.ts`](D:/htdoc/Fixtura/Fixtura.com.au/Admin/fixtura-admin/src/hooks/association/useTriggerFixtureDiscoveryAssociationBatch.ts)

Requirements:

- use `useMutation`
- show `toast.success()` on success
- show `toast.error()` on failure
- invalidate the correct association detail query key:
  - `["association-detail", associationId]`

Suggested success toast behavior:

- primary message:
  - `Queued {queued} fixture discovery job(s) ({skipped} skipped)`
- optional description:
  - include `runId`

Suggested hook shape:

```ts
import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { triggerFixtureDiscoveryAssociationBatch } from "@/lib/services/data-collection/triggerFixtureDiscoveryAssociationBatch";
import type {
  TriggerFixtureDiscoveryAssociationBatchRequest,
  TriggerFixtureDiscoveryAssociationBatchSuccessResponse,
} from "@/types/triggerFixtureDiscoveryAssociationBatch";

export function useTriggerFixtureDiscoveryAssociationBatch(): UseMutationResult<
  TriggerFixtureDiscoveryAssociationBatchSuccessResponse,
  Error,
  TriggerFixtureDiscoveryAssociationBatchRequest
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: triggerFixtureDiscoveryAssociationBatch,
    onSuccess: (data, variables) => {
      toast.success(
        `Queued ${data.queued} fixture discovery job(s) (${data.skipped} skipped)`,
        {
          description: `Run ID: ${data.runId}`,
        }
      );

      queryClient.invalidateQueries({
        queryKey: ["association-detail", variables.associationId],
      });
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to trigger association fixture discovery batch"
      );
    },
  });
}
```

---

## CTA Placement

Update:

- [`src/app/dashboard/association/[id]/components/AssociationHeader.tsx`](D:/htdoc/Fixtura/Fixtura.com.au/Admin/fixtura-admin/src/app/dashboard/association/[id]/components/AssociationHeader.tsx)

The new CTA belongs in the existing action row beside:

- `Process Direct`
- `Grades batch scrape`
- `Lookup teams batch`

Current placement area:

- action row in the header near lines where those three buttons are rendered

Add:

- new hook import
- icon import
- a new local button component following the same confirmation-dialog pattern already used in this file

---

## CTA UX Spec

### Button label

Use:

- `Fixture discovery batch`

This is clearer in the association context than a generic `Discover Fixtures`, because this action fans out across many grades rather than one grade.

### Button style

Use:

- `variant="secondary"`
- `size="sm"`

This keeps it visually aligned with the other batch/admin actions already in the association header.

### Recommended icon

Use one of:

- `Search`
- `Radar`
- `RefreshCw`

If you want the smallest change, `RefreshCw` is acceptable because it already appears in similar trigger CTAs.

---

## Confirmation Dialog

Add a new local component inside `AssociationHeader.tsx`, similar to the existing button components.

Suggested component name:

- `FixtureDiscoveryAssociationBatchButton`

Suggested dialog content:

**Title**

- `Confirm Fixture Discovery Batch`

**Description**

- `This will queue fixture discovery for every eligible grade under this association. The CMS will load the association, scan its competitions and grades, and enqueue one fixture_discovery job per grade with a usable URL. Work runs asynchronously.`

**Metadata block**

- show `Association ID`

**Confirm button label**

- `Confirm discovery`

**Pending label**

- `Queuing...`

Behavior:

- keep dialog open if mutation fails
- close dialog only after successful `mutateAsync`

---

## Success and Error UX

### Success

On HTTP 200:

- show a success toast with:
  - queued count
  - skipped count
  - runId in description if supported

Recommended message:

- `Queued {queued} fixture discovery job(s) ({skipped} skipped)`

If `queued === 0`:

- still treat this as success
- optionally append helpful context in the toast description:
  - if `gradesFound > 0`, likely missing grade URLs
  - if `gradesFound === 0`, likely no grades under the association

### Error

Surface backend validation messages directly where possible, including:

- `associationId is required`
- `associationId must be a positive integer`
- `Association not found: <id>`
- `Association has no Sport`
- `Association Sport must not be Unknown`

Do not replace these with generic copy unless parsing fails.

---

## Implementation Notes For This Repo

### 1. Follow existing local button pattern

`AssociationHeader.tsx` already defines small local CTA components with:

- `useState(false)` for dialog state
- mutation hook call
- `mutateAsync`
- loading state from `isPending`
- close-on-success / stay-open-on-error behavior

Mirror that pattern for consistency.

### 2. Do not use the wrong query key

Correct:

```ts
["association-detail", associationId]
```

Incorrect:

```ts
["associationDetail", associationId]
```

### 3. Keep this action association-scoped

The payload for this endpoint is:

```json
{ "associationId": number }
```

Do not send:

- `id`
- `gradeId`
- `runId`

unless the backend contract changes later.

### 4. This is asynchronous queueing only

Do not imply that fixtures are refreshed immediately in the UI.

The button confirms queue acceptance, not completion.

---

## Suggested `AssociationHeader.tsx` Change Shape

At a high level:

1. add hook import
2. add icon import if needed
3. render new CTA in the action row
4. add local `FixtureDiscoveryAssociationBatchButton` component near the other local CTA components

Pseudo-shape:

```tsx
import { useTriggerFixtureDiscoveryAssociationBatch } from "@/hooks/association/useTriggerFixtureDiscoveryAssociationBatch";

// inside action row
<FixtureDiscoveryAssociationBatchButton associationId={associationId} />
```

Local component behavior should match the existing button components in this file.

---

## Acceptance Checklist

- [ ] Clicking the new CTA opens a confirmation dialog
- [ ] Confirm sends `POST /association/trigger-fixture-discovery-batch`
- [ ] Payload is exactly `{ associationId }`
- [ ] Pending state disables the trigger button and confirm button
- [ ] Success toast shows queued/skipped counts
- [ ] Error toast shows parsed backend message
- [ ] Dialog closes only on success
- [ ] Hook invalidates `["association-detail", associationId]`
- [ ] CTA is rendered on `/dashboard/association/[id]`
- [ ] No existing association CTAs regress

---

## Nice-To-Have Follow-Up

If we want to clean up this area while touching it, we should consider a later pass to fix the same query-key mismatch in:

- [`src/hooks/association/useProcessAssociationDirect.ts`](D:/htdoc/Fixtura/Fixtura.com.au/Admin/fixtura-admin/src/hooks/association/useProcessAssociationDirect.ts)
- [`src/hooks/association/useTriggerGradesBatchScrape.ts`](D:/htdoc/Fixtura/Fixtura.com.au/Admin/fixtura-admin/src/hooks/association/useTriggerGradesBatchScrape.ts)

That is out of scope for this CTA unless requested, but worth noting.

---

## Deliverable Summary

This implementation should result in:

- a new typed service wrapper for the batch fixture discovery endpoint
- a new React Query mutation hook
- a new association-header CTA with confirmation dialog
- success/error toast handling consistent with the rest of the admin UI
- correct query invalidation using the actual association detail query key
