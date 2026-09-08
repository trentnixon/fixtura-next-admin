# Account Health Run Abort Handoff

## Status

| Capability | Admin UI | Backend API |
|------------|----------|-------------|
| Abort active run | Shipped | Shipped |
| Reconcile completed-limbo run | Shipped (run detail) | Shipped |
| Resume (correlation miss) | Not wired | Shipped |

## Summary

Support tool to **abort an active account-health run** when it is stuck, failed to finalize, or otherwise blocking new refreshes.

Admin frontend calls this from:

- Run detail: `/dashboard/accounts/health/runs/[runId]`
- Account Data refresh tab when a live run exists

Abort is a **soft cleanup** — records are retained for audit; the run moves to terminal `failed` state and the account lock is cleared.

## Endpoint

```http
POST /api/account/health/runs/:runId/abort
Content-Type: application/json
```

### Request body

```json
{
  "reason": "operator_aborted",
  "cleanupItems": true
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `reason` | string | `"operator_aborted"` | Stored on run `failureReason` |
| `cleanupItems` | boolean | `true` | When true, mark non-terminal items failed |

## Behaviour

The endpoint should:

1. Load run by `:runId`; reject if not found.
2. Reject if run status is already terminal (`completed`, `failed`, `finalized`).
3. When `cleanupItems === true`:
   - For each `account-health-item` linked to this run with status in `pending | queued | running`:
     - Set status → `failed`
     - Set `failedAt` → now
     - Set `failureReason` → `"aborted_with_run"` (or include operator `reason`)
4. Update run:
   - status → `failed`
   - `failedAt` → now
   - `failureReason` → request `reason` (default `operator_aborted`)
   - Clear or leave `blockingItem` reference as appropriate for read model
5. Reset account denormalized health fields when this run is the account's active/latest run:
   - `accountHealthStatus` → `failed`
   - `accountHealthLastFailedAt` → now
   - `accountHealthFailureReason` → request `reason`
   - Do **not** leave account in `running` / `queued`
6. Best-effort: cancel or ignore in-flight Bull jobs referenced by item `bullJobId` (do not block abort on job removal failure).
7. Return the same payload shape as `GET /api/account/health/runs/:runId/status`.

Active run statuses (abort allowed):

```ts
type ActiveAccountHealthRunStatus = "pending" | "queued" | "running";
```

## Success Response

Same as run status:

```ts
type AccountHealthAbortResponse = {
  data: AccountHealthRun; // includes items[], itemCounts, blockingItem, etc.
};
```

Example after abort:

```json
{
  "data": {
    "id": 444,
    "accountId": 136,
    "status": "failed",
    "failureReason": "operator_aborted",
    "failedAt": "2026-08-18T05:30:00.000Z",
    "items": [ ... ],
    "itemCounts": { "failed": 2, "completed": 5 }
  }
}
```

## Error Response

Standard Strapi 400 envelope:

```json
{
  "data": null,
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "run_not_active",
    "details": {}
  }
}
```

Stable reason codes:

```ts
type AccountHealthAbortErrorReason =
  | "invalid_run_id"
  | "not_found"
  | "run_not_active"
  | "abort_failed";
```

| Code | When |
|------|------|
| `invalid_run_id` | Non-numeric or ≤ 0 |
| `not_found` | Run row missing |
| `run_not_active` | Status is `completed`, `failed`, or `finalized` |
| `abort_failed` | Unexpected persistence/worker error |

## Auth

Add permission alongside existing health mutations:

```text
api::account.account.postAccountHealthRunAbort
```

Restrict to support/admin roles — same policy as `reconcile` and `resume`.

If admin frontend uses `APP_API_KEY` bearer auth, ensure middleware allows this route (same follow-up as other health endpoints).

## Idempotency

- Calling abort on an already-failed run → `run_not_active` (400).
- Safe to retry only while run is still active; duplicate abort after success should fail with `run_not_active`.

## After Abort

Admin will:

- Invalidate run, account, and global health queries
- Show toast: run aborted — user can queue new update via `POST .../health/run-on-demand`

## Related Endpoints

| Endpoint | Use when |
|----------|----------|
| `POST .../reconcile` | Fixture discovery stale rows; may finalize without abort |
| `POST .../resume` | First-step correlation miss |
| `POST .../abort` | Stuck run, operator reset, unblock account |

Try **reconcile first** when all steps show completed but run never finalized. Use **abort** when reconcile does not help or the run is clearly stuck.

## Backend Files (expected)

```text
src/api/account/controllers/services/accountHealth/index.js   # add abortRun()
src/api/account/controllers/services/accountHealth/abortRun.js  # optional extract
src/api/account/controllers/account.js                        # postAccountHealthRunAbort
src/api/account/routes/custom-account.js                      # route registration
```

## Admin Frontend Files

```text
src/lib/services/account-health/abortAccountHealthRun.ts
src/hooks/account-health/useAbortAccountHealthRun.ts
src/app/dashboard/accounts/components/account-health/AbortAccountHealthRunButton.tsx
src/lib/services/account-health/reconcileAccountHealthRun.ts
src/hooks/account-health/useReconcileAccountHealthRun.ts
src/app/dashboard/accounts/components/account-health/ReconcileAccountHealthRunButton.tsx
```

## Smoke Test

1. Create or identify an active run (status `running`).
2. `POST /api/account/health/runs/:runId/abort` with `{ "cleanupItems": true }`.
3. Confirm run status → `failed`, account `accountHealthStatus` → `failed`.
4. Confirm `POST /api/account/:accountId/health/run-on-demand` queues a new run (not `existing_active`).
