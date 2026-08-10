# Account Asset Run On-Demand Trigger Handoff

## Summary

This endpoint lets Admin force a scheduled asset workflow for a single account.

It uses the new `account-asset-run` orchestration, so on-demand renders are tracked in the same run/item status views as cron-created renders.

Use `asset_only` when Admin wants to create assets immediately from current CMS data. Use `full` when Admin wants the system to scrape recent results, validate upcoming fixtures, then create assets.

## Trigger Endpoint

```http
POST /api/account-asset-runs/account/:accountId/trigger
Content-Type: application/json
```

Example for account `575`, asset creation only:

```json
{
  "mode": "asset_only",
  "force": true
}
```

Example for account `575`, full scrape + asset flow:

```json
{
  "mode": "full",
  "force": true
}
```

## Request Payload

```ts
type AccountAssetRunTriggerPayload = {
  /**
   * "asset_only" skips result scraping and remove-fixtures checks.
   * "full" runs result scrape, remove-fixtures, then asset creation.
   * Defaults to "full" when omitted or invalid.
   */
  mode?: "asset_only" | "full";

  /**
   * true creates a unique on-demand run key.
   * It does not bypass account/payment/render safety checks.
   * Defaults to false.
   */
  force?: boolean;
};
```

## Behaviour

The endpoint will:

- create an `account-asset-run` row
- create an `eligibility_check` item
- set `scheduler.Queued = true`
- create a CMS-owned `render` row before asset dispatch
- queue `startAssetBundleCreation` for asset creation
- track render completion through `render.Processing`, `render.Complete`, and downloads

For `asset_only`, the endpoint will:

- skip `result_batch_scrape`
- skip `remove_fixtures_scrape`
- still create tracked items for those skipped stages
- immediately move to asset creation

For `full`, the endpoint will:

- queue result scrape jobs for `today - 14 days`
- queue remove-fixtures jobs for `today + 14 days`
- dispatch asset creation after those scrape stages complete

## Safety Checks

The endpoint rejects or returns `not_ready` for:

- invalid account id
- account not found
- missing scheduler
- inactive account
- account setup incomplete
- account already updating
- no active paid order
- scheduler/render already processing
- existing active account asset run, unless `force: true`

Paid account check requires an order with:

```ts
type PaidOrderRequirement = {
  Status: true;
  isActive: true;
  OrderPaid: true;
};
```

Active trials do not qualify for this asset trigger.

## Success Response

The endpoint returns a standard Strapi `data` envelope.

```ts
type AccountAssetRunTriggerSuccessResponse = {
  data: {
    status: "queued";
    run: AccountAssetRun;
    advanced:
      | { status: "waiting_result_scrape" }
      | { status: "waiting_remove_fixtures" }
      | { status: "waiting_asset_creation" }
      | { status: "completed" }
      | { status: "failed"; reason?: string }
      | { status: "noop" };
  };
};
```

Example `asset_only` response:

```json
{
  "data": {
    "status": "queued",
    "run": {
      "id": 12,
      "runKey": "account-asset-run:575:88:2026-05-26:ondemand:asset_only:1779750000000",
      "status": "queued",
      "scheduledDate": "2026-05-26",
      "summary": {
        "trigger": "on_demand",
        "mode": "asset_only",
        "force": true
      }
    },
    "advanced": {
      "status": "waiting_asset_creation"
    }
  }
}
```

Admin should use `run.id` for follow-up status polling.

## Not Ready Response

The endpoint currently returns not-ready states inside `data`, not a 400 error.

```ts
type AccountAssetRunTriggerNotReadyResponse = {
  data: {
    status: "not_ready" | "skipped";
    reason: AccountAssetRunTriggerNotReadyReason;
    run?: AccountAssetRun;
  };
};

type AccountAssetRunTriggerNotReadyReason =
  | "invalid_account_id"
  | "account_not_found"
  | "scheduler_not_found"
  | "account_inactive"
  | "account_not_setup"
  | "account_updating"
  | "no_active_paid_order"
  | "render_processing"
  | "active_run_exists"
  | "run_key_exists";
```

Example:

```json
{
  "data": {
    "status": "not_ready",
    "reason": "no_active_paid_order"
  }
}
```

Suggested Admin labels:

```ts
const ACCOUNT_ASSET_TRIGGER_REASON_LABELS = {
  invalid_account_id: "Invalid account ID.",
  account_not_found: "Account not found.",
  scheduler_not_found: "Account has no scheduler.",
  account_inactive: "Account is inactive.",
  account_not_setup: "Account setup is not complete.",
  account_updating: "Account is already updating.",
  no_active_paid_order: "Account does not have an active paid order.",
  render_processing: "A render is already processing for this scheduler.",
  active_run_exists: "An asset run is already active for this account.",
  run_key_exists: "This on-demand run already exists.",
};
```

## Status Endpoints

Poll latest run for an account:

```http
GET /api/account-asset-runs/account/:accountId/latest
```

Poll a specific run:

```http
GET /api/account-asset-runs/:id/status
```

List recent runs:

```http
GET /api/account-asset-runs/status?limit=25
```

Retry a failed run:

```http
POST /api/account-asset-runs/:id/retry
```

## Status Types

```ts
type AccountAssetRunStatus =
  | "pending"
  | "queued"
  | "running"
  | "scraping_results"
  | "checking_upcoming_fixtures"
  | "creating_assets"
  | "completed"
  | "failed"
  | "cancelled";

type AccountAssetRunItemScope =
  | "eligibility_check"
  | "grades_comps_refresh"
  | "result_batch_scrape"
  | "remove_fixtures_scrape"
  | "asset_creation"
  | "asset_completion";

type AccountAssetRunItemStatus =
  | "pending"
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "skipped";
```

## Run Detail Response

```ts
type AccountAssetRunDetailResponse = {
  data: {
    id: number;
    accountId: number;
    schedulerId: number;
    renderId: number | null;
    runKey: string;
    status: AccountAssetRunStatus;
    scheduledDate: string;
    scheduledFor: string | null;
    startedAt: string | null;
    completedAt: string | null;
    failedAt: string | null;
    failureReason: string | null;
    summary: Record<string, unknown> | null;
    items: Array<{
      id: number;
      scope: AccountAssetRunItemScope;
      status: AccountAssetRunItemStatus;
      targetType: string | null;
      targetId: number | null;
      runId: string | null;
      bullJobId: string | null;
      bullJobIds: unknown[] | null;
      startedAt: string | null;
      completedAt: string | null;
      failedAt: string | null;
      failureReason: string | null;
      resultSummary: Record<string, unknown> | null;
    }>;
  };
};
```

## Recommended Admin Flow

1. Show an action menu on the account detail page:
   - "Create assets now"
   - "Run scrape and create assets"
2. On "Create assets now", call:

```json
{ "mode": "asset_only", "force": true }
```

3. On "Run scrape and create assets", call:

```json
{ "mode": "full", "force": true }
```

4. If response status is `queued`, open or poll the run detail endpoint.
5. If response status is `not_ready` or `skipped`, display the mapped reason label.
6. Poll every 10-15 seconds while status is:
   - `queued`
   - `running`
   - `scraping_results`
   - `checking_upcoming_fixtures`
   - `creating_assets`
7. Stop polling on:
   - `completed`
   - `failed`
   - `cancelled`

## Auth

The custom routes currently use:

```ts
auth: false
```

Before exposing in production Admin, add the same Admin/API-key auth model used by other admin-only controls.

## Admin frontend contract clarifications (2026-05)

Integrated in fixtura-admin: account Renders tab (`AccountAssetRunPanel` + triggers), run detail at `/dashboard/accounts/asset-runs/[runId]`, global slim list on main dashboard **Renders** tab.

### Latest vs detail

`GET /api/account-asset-runs/account/:accountId/latest` returns the **same shape** as `GET /api/account-asset-runs/:id/status`, or `null` when no run exists.

There is **no** separate per-account summary endpoint (unlike account health). v1 uses `latest` only.

### Global status list

`GET /api/account-asset-runs/status?limit=25` returns a **slim** array (no `items`). Admin links each row to run detail for full item drill-in.

### `not_ready` vs `skipped`

Both are HTTP **200** blocking outcomes (not axios errors):

- **`not_ready`**: eligibility / safety refusal (`invalid_account_id` through `active_run_exists` per doc).
- **`skipped`**: idempotency, mainly **`run_key_exists`**.

Treat both as toasts/callouts, not fatal errors.

For **`active_run_exists`**, the response includes a **`run`** object with `id` when found so UI can link to the current run.

### Trigger response

Prefer **`run.id`** + **`GET .../:id/status`** as source of truth. Do **not** surface **`advanced.status`** prominently in Admin v1 (debug/hint only).

### Billing

Asset runs require an **active paid order** (`Status`, `isActive`, `OrderPaid`). **Trials do not qualify.** The sole billing refusal reason from this trigger is **`no_active_paid_order`**.

### `renderId` timing

- **`asset_only`**: `renderId` appears on the **first** status poll; initial trigger envelope may omit it — only link `/dashboard/renders/:id` when `renderId` is present.
- **`full`**: `renderId` appears **later**, after scrape stages complete and asset creation is dispatched.

### Retry / global dashboard

v1 excludes **`POST .../:id/retry`** (support / later phase). Global list is informational + links to detail.

### Manual smoke checklist (CMS must expose routes)

```http
POST /api/account-asset-runs/account/{accountId}/trigger
GET  /api/account-asset-runs/account/{accountId}/latest
GET  /api/account-asset-runs/status?limit=25
GET  /api/account-asset-runs/{runId}/status
```

Payloads: `{ "mode": "asset_only", "force": true }` and `{ "mode": "full", "force": true }`.

### Item step timestamps (CMS request — 2026-05-30)

Admin run detail shows **Start / End / Time taken** per workflow step. Run-level timing works today; **item rows do not return `startedAt` / `completedAt` / `failedAt`**, so phase durations are wrong (see run `#28`).

**CMS action required:** expose per-item timing on `items[]` for `GET .../:id/status` and `GET .../account/:id/latest`, matching account health item fields.

Full spec: **`.comms/account-asset-run-step-timing-cms-message.md`**

## Related Files

```text
src/api/account-asset-run/routes/custom-account-asset-run.js
src/api/account-asset-run/controllers/account-asset-run.js
src/api/account/controllers/services/accountAssetRuns/index.js
src/api/account/.docs/admin/account-health-on-demand-trigger-handoff.md
```
