# Account Health Status Admin Handoff

## Summary

Account health is a recurring backend workflow that refreshes account data using the same scraper-style sequence as onboarding, but with separate tracking records.

Admin should expose account-health visibility in three places:

- Dashboard: global account-health status.
- Account detail page: status for one account.
- Account detail child view: drill-down for a specific health run.

Completed-empty runs are not failures. They mean the account was checked successfully, but there was no current season data such as competitions, grades, teams, or fixtures.

## Endpoints

All endpoints are under the Strapi API prefix.

### Global Dashboard Status

```http
GET /api/account/health/status
```

Use on the admin dashboard.

Returns an overview of recent account-health runs across all accounts.

### Account Status

```http
GET /api/account/:accountId/health/status
```

Use on the account detail page.

Returns account-level health summary fields, recent runs, and the latest run detail.

### Run Status

```http
GET /api/account/health/runs/:runId/status
```

Use as a child/detail view from the account health panel.

Returns one run with all tracked step items and fixture-discovery progress.

### Manual Run Trigger

```http
POST /api/account/:accountId/health/run
Content-Type: application/json

{
  "force": false
}
```

Use for admin/support testing. `force: true` bypasses the 5-day freshness window, but does not bypass invalid account, inactive account, or non-billable account checks.

### Run Reconcile

```http
POST /api/account/health/runs/:runId/reconcile
```

Support tool. Rechecks fixture-discovery ingest rows, requeues stale non-terminal CMS processing rows, and finalizes the run if all expected rows are terminal.

### Run Resume

```http
POST /api/account/health/runs/:runId/resume
```

Support tool for first-step ingest correlation misses. It resumes from the first health item and continues the sequence.

## Auth

Routes use authenticated Account permissions:

```text
api::account.account.getAccountHealthGlobalStatus
api::account.account.getAccountHealthAccountStatus
api::account.account.getAccountHealthRunStatus
api::account.account.postAccountHealthRun
api::account.account.postAccountHealthRunReconcile
api::account.account.postAccountHealthRunResume
```

## Types

```ts
type AccountHealthRunStatus =
  | "pending"
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "finalized";

type AccountHealthItemStatus =
  | "pending"
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "skipped";

type AccountHealthAccountStatus =
  | "not_started"
  | "queued"
  | "running"
  | "completed"
  | "failed";

type AccountHealthScope =
  | "scrape:association-single"
  | "scrape:club-single"
  | "scrape:grades-batch"
  | "internal:club-to-association-sync"
  | "internal:association-to-club-sync"
  | "scrape:grades-lookup-teams-batch"
  | "scrape:fixture-discovery-batch";
```

```ts
type StatusCounts = Record<string, number>;

type FixtureDiscoveryRowStatus = {
  id: number;
  processingStatus: "pending" | "processing" | "processed" | "failed";
  gradeId: number | null;
  updatedAt: string | null;
  processingStartedAt: string | null;
};

type FixtureDiscoverySummary = {
  expectedTerminalCount: number;
  total: number;
  terminal: number;
  nonTerminal: number;
  failed: number;
  nonTerminalRows: FixtureDiscoveryRowStatus[];
};

type AccountHealthItem = {
  id: number;
  stepIndex: number;
  scope: AccountHealthScope | string;
  targetType: string;
  targetId: number;
  status: AccountHealthItemStatus;
  runId: string | null;
  bullJobId: string | null;
  startedAt: string | null;
  completedAt: string | null;
  failedAt: string | null;
  failureReason: string | null;
  resultSummary: Record<string, unknown> | null;
  fixtureDiscovery: FixtureDiscoverySummary | null;
};

type AccountHealthRun = {
  id: number;
  accountId: number;
  status: AccountHealthRunStatus;
  accountType: "association" | "club";
  currentStepIndex: number;
  startedAt: string | null;
  queuedAt: string | null;
  completedAt: string | null;
  failedAt: string | null;
  finalizedAt: string | null;
  failureReason: string | null;
  summary: AccountHealthRunSummary | null;
  itemCounts: StatusCounts;
  blockingItem: AccountHealthItem | null;
  items: AccountHealthItem[];
};

type AccountHealthRunSummary = {
  emptyResult?: boolean;
  reason?: string;
  scope?: string;
  [key: string]: unknown;
};

type AccountHealthScopeLabel =
  | "Association overview"
  | "Club overview"
  | "Grades"
  | "Club to association link sync"
  | "Association to club link sync"
  | "Team lookup"
  | "Fixture discovery";
```

Recommended scope labels:

```ts
const ACCOUNT_HEALTH_SCOPE_LABELS: Record<AccountHealthScope, string> = {
  "scrape:association-single": "Association overview",
  "scrape:club-single": "Club overview",
  "scrape:grades-batch": "Grades",
  "internal:club-to-association-sync": "Club to association link sync",
  "internal:association-to-club-sync": "Association to club link sync",
  "scrape:grades-lookup-teams-batch": "Team lookup",
  "scrape:fixture-discovery-batch": "Fixture discovery",
};
```

## Global Status Response

```ts
type AccountHealthGlobalStatusResponse = {
  data: {
    runCounts: StatusCounts;
    activeCount: number;
    failedCount: number;
    completedEmptyCount: number;
    latestRuns: Array<{
      id: number;
      accountId: number;
      accountName: string | null;
      primaryOrgLabel: string | null;
      status: AccountHealthRunStatus;
      accountType: "association" | "club";
      startedAt: string | null;
      completedAt: string | null;
      failedAt: string | null;
      finalizedAt: string | null;
      failureReason: string | null;
      summary: AccountHealthRunSummary | null;
    }>;
  };
};
```

Example:

```json
{
  "data": {
    "runCounts": {
      "finalized": 12,
      "running": 2,
      "failed": 1
    },
    "activeCount": 2,
    "failedCount": 1,
    "completedEmptyCount": 4,
    "latestRuns": [
      {
        "id": 18,
        "accountId": 575,
        "accountName": "Darwin And Districts Cricket Competition",
        "primaryOrgLabel": "Darwin And Districts Cricket Competition",
        "status": "running",
        "accountType": "association",
        "startedAt": "2026-05-25T00:15:10.000Z",
        "completedAt": null,
        "failedAt": null,
        "finalizedAt": null,
        "failureReason": null,
        "summary": null
      }
    ]
  }
}
```

## Account Status Response

```ts
type AccountHealthAccountStatusResponse = {
  data: {
    account: {
      id: number;
      accountHealthStatus: AccountHealthAccountStatus;
      accountHealthLastQueuedAt: string | null;
      accountHealthLastStartedAt: string | null;
      accountHealthLastCompletedAt: string | null;
      accountHealthLastFailedAt: string | null;
      accountHealthFailureReason: string | null;
    };
    runCounts: StatusCounts;
    latestRun: AccountHealthRun | null;
    recentRuns: Array<{
      id: number;
      status: AccountHealthRunStatus;
      startedAt: string | null;
      completedAt: string | null;
      failedAt: string | null;
      finalizedAt: string | null;
      summary: AccountHealthRunSummary | null;
    }>;
  };
};
```

Example:

```json
{
  "data": {
    "account": {
      "id": 575,
      "accountHealthStatus": "completed",
      "accountHealthLastQueuedAt": "2026-05-25T00:02:10.000Z",
      "accountHealthLastStartedAt": "2026-05-25T00:03:20.000Z",
      "accountHealthLastCompletedAt": "2026-05-25T00:45:00.000Z",
      "accountHealthLastFailedAt": null,
      "accountHealthFailureReason": null
    },
    "runCounts": {
      "finalized": 2
    },
    "latestRun": {
      "id": 4,
      "accountId": 575,
      "status": "finalized",
      "accountType": "association",
      "currentStepIndex": 4,
      "startedAt": "2026-05-25T00:02:10.000Z",
      "queuedAt": "2026-05-25T00:02:11.000Z",
      "completedAt": "2026-05-25T00:44:59.000Z",
      "failedAt": null,
      "finalizedAt": "2026-05-25T00:45:00.000Z",
      "failureReason": null,
      "summary": null,
      "itemCounts": {
        "completed": 6
      },
      "blockingItem": null,
      "items": []
    },
    "recentRuns": [
      {
        "id": 4,
        "status": "finalized",
        "startedAt": "2026-05-25T00:02:10.000Z",
        "completedAt": "2026-05-25T00:44:59.000Z",
        "failedAt": null,
        "finalizedAt": "2026-05-25T00:45:00.000Z",
        "summary": null
      }
    ]
  }
}
```

## Run Status Response

```ts
type AccountHealthRunStatusResponse = {
  data: AccountHealthRun;
};
```

Example:

```json
{
  "data": {
    "id": 4,
    "accountId": 575,
    "status": "running",
    "accountType": "association",
    "currentStepIndex": 4,
    "startedAt": "2026-05-25T00:02:10.000Z",
    "queuedAt": "2026-05-25T00:02:11.000Z",
    "completedAt": null,
    "failedAt": null,
    "finalizedAt": null,
    "failureReason": null,
    "summary": null,
    "itemCounts": {
      "completed": 5,
      "queued": 1
    },
    "blockingItem": {
      "id": 12,
      "stepIndex": 4,
      "scope": "scrape:fixture-discovery-batch",
      "targetType": "association",
      "targetId": 2964,
      "status": "queued",
      "runId": "account-health-575-1779670548858-j73epy",
      "bullJobId": "account-health:fixture-discovery-batch:2964:account-health-575-1779670548858-j73epy",
      "startedAt": null,
      "completedAt": null,
      "failedAt": null,
      "failureReason": null,
      "resultSummary": {
        "event": "batch_enqueued",
        "queued": 17
      },
      "fixtureDiscovery": {
        "expectedTerminalCount": 17,
        "total": 17,
        "terminal": 16,
        "nonTerminal": 1,
        "failed": 0,
        "nonTerminalRows": [
          {
            "id": 404,
            "processingStatus": "pending",
            "gradeId": 71352,
            "updatedAt": "2026-05-25T00:10:00.000Z",
            "processingStartedAt": null
          }
        ]
      }
    },
    "items": []
  }
}
```

## Manual Trigger Response

```ts
type TriggerAccountHealthRunResponse = {
  data:
    | {
        status: "queued";
        runId: number;
        itemId: number;
        jobId: string;
        fetchPlan: {
          accountId: number;
          accountType: "association" | "club";
          associationIds: number[];
          clubId: number | null;
          primaryOrganisation: {
            type: "association" | "club";
            id: number;
            name: string | null;
            href: string | null;
          };
          scopeSequence: Array<{
            order: number;
            scope: AccountHealthScope;
            targetType: string;
            targetId: number | null;
          }>;
        };
      }
    | {
        status: "existing_active";
        runId: number;
        reason: "active_run_exists";
      };
};
```

Common `400` reasons:

```text
invalid_account_id
not_found
inactive
not_setup
account_updating
not_billable
not_due_or_active_run
invalid_health_plan
```

## Reconcile Response

```ts
type ReconcileAccountHealthRunResponse = {
  data: {
    status: "reconciled";
    runId: number;
    reconciled: number;
    requeued: number;
    itemSummaries: Array<{
      itemId: number;
      itemRunId: string | null;
      itemStatus: AccountHealthItemStatus;
      expectedTerminalCount: number;
      terminalCount: number;
      nonTerminalCount: number;
      nonTerminalRows: Array<{
        id: number;
        processingStatus: "pending" | "processing";
        gradeId: number | null;
      }>;
    }>;
  };
};
```

## UI Placement

### Dashboard

Use `GET /api/account/health/status`.

Current v1 behaviour:

- `latestRuns` returns the newest 20 rows from the newest 100 health runs.
- There is no pagination or filter query support yet.
- `activeCount` is the count of runs with status `pending`, `queued`, or `running`.
- `completedEmptyCount` is the count of terminal runs with status `completed` or `finalized` and `summary.emptyResult === true`.
- `failedCount` is the count of runs with status `failed`.

Recommended widgets:

- Active health runs.
- Failed health runs.
- Completed-empty runs.
- Latest runs table.

Latest runs table columns:

- Run ID.
- Account.
- Status.
- Account type.
- Started.
- Finalized.
- Failure reason.
- Empty-result reason.

### Account Page

Use `GET /api/account/:accountId/health/status`.

Current v1 behaviour:

- `latestRun` includes the full ordered `items` list through the same shape as the run-detail endpoint.
- `recentRuns` returns the newest 10 runs, sorted newest first by `createdAt`.
- There is no stable pagination for `recentRuns` yet.
- For account table badges, use `account.accountHealthStatus`.
- For the account page while a run is active, prefer `latestRun.status` because it is the live workflow state.
- `account.accountHealthStatus` is a denormalized summary updated as the workflow queues, starts, finalizes, or fails.
- Admin account lookup/list endpoints should expose `accountHealthStatus`, `accountHealthLastCompletedAt`, `accountHealthLastFailedAt`, and `accountHealthFailureReason` for table filters. That is recommended next work if the current lookup endpoint does not include them.

Recommended panel:

- Current health status.
- Last completed.
- Last failed.
- Failure reason.
- Latest run status.
- Recent run list.

Recent run row action:

- Open child run detail using `GET /api/account/health/runs/:runId/status`.

### Run Child View

Use `GET /api/account/health/runs/:runId/status`.

Current v1 behaviour:

- `items` is always returned, ordered by `stepIndex` then `createdAt`.
- The backend caps run items at 200. Normal account-health runs should be much smaller.
- For a child/detail page, call this endpoint directly and poll it while the run is active.
- Strapi content-manager links:
  - `/admin/content-manager/collection-types/api::account-health-run.account-health-run/:runId`
  - `/admin/content-manager/collection-types/api::account-health-item.account-health-item/:itemId`

Recommended layout:

- Run summary header.
- Blocking item alert if `blockingItem` is present.
- Step list ordered by `stepIndex`.
- Fixture-discovery progress for fixture items.

Fixture progress display:

```text
16 / 17 fixture discovery rows processed
```

If `nonTerminalRows` exists, show grade IDs and processing status.

## Display Rules

- `summary.emptyResult === true`: show as "Completed: no current season data".
- For dashboard/latest-run rows with `summary.emptyResult === true`, show `summary.reason` when space allows.
- `status === "failed"`: show as operational failure.
- `blockingItem.status === "failed"`: show failure reason.
- `blockingItem.status` in `pending | queued | running`: show "In progress".
- Fixture discovery `nonTerminal > 0`: show progress, not failure.
- Fixture discovery `failed > 0`: show warning/error depending on final run status.

## Workflow Semantics

Health sequence:

1. `scrape:association-single` or `scrape:club-single`
2. `scrape:grades-batch`
3. internal org-link sync
4. `scrape:grades-lookup-teams-batch`
5. `scrape:fixture-discovery-batch`

Daily cron:

- runs once every 24 hours
- queues max 10 due accounts
- account is due if it has not completed health in the last 5 days
- account must be active, setup, not updating, and billable/trial-active

Fixture-discovery sweeper:

- runs every 15 minutes
- requeues stale `pending` fixture-ingest processing rows after 10 minutes
- requeues stale `processing` fixture-ingest processing rows after 60 minutes
- calls reconcile/finalization automatically

## Mutations And Errors

400 responses use the normal Strapi error envelope:

```json
{
  "data": null,
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "not_due_or_active_run",
    "details": {}
  }
}
```

Frontend should parse `error.message` as the stable reason code for v1.

When manual trigger returns:

```json
{
  "data": {
    "status": "existing_active",
    "runId": 4,
    "reason": "active_run_exists"
  }
}
```

show a short "Health run already active" message and open or link to that run detail view.

`reconcile` and `resume` are intended to be idempotent support actions. They are safe to retry, but should be restricted in the admin UI to support/super-admin style roles because they can requeue scraper work. There is no backend rate limit yet.

## Auth And Rollout

These routes currently use Strapi authenticated Account permissions, not the `APP_API_KEY` bearer pattern:

```text
api::account.account.getAccountHealthGlobalStatus
api::account.account.getAccountHealthAccountStatus
api::account.account.getAccountHealthRunStatus
api::account.account.postAccountHealthRun
api::account.account.postAccountHealthRunReconcile
api::account.account.postAccountHealthRunResume
```

If the admin frontend can only call backend custom routes with `APP_API_KEY`, backend auth middleware will need a small follow-up change before staging/production rollout.

Current availability is local/dev branch. Staging should roll out after the backend deploy/migration and a smoke test of manual trigger, cron due selection, and one completed run. Production should follow after staging confirms worker correlation fields and fixture-discovery reconciliation.

## Operational UX

Polling guidance:

- Dashboard/global view: refresh every 60 seconds.
- Account/run detail while status is `pending`, `queued`, or `running`: poll every 10-15 seconds.
- Fixture-discovery-heavy runs can take over an hour. Treat non-terminal fixture rows as progress, not failure.
- Stop polling once the run is `completed`, `failed`, or `finalized`.

Timestamps are Strapi datetime values and should be treated as UTC ISO strings. Display in the admin user's local timezone.

Health runs can be distinguished from onboarding by:

- account-health run/item records
- run IDs beginning with `account-health-`
- Bull job IDs beginning with `account-health:`
- account-health scopes listed in this document

There is no guaranteed v1 link to `/dashboard/data/[jobId]` for every scraper log. Use `bullJobId` for debugging display, but treat scraper-log deep links as best-effort unless the worker/CMS log contract is expanded.

## Backend Files

Primary backend implementation:

```text
src/api/account/controllers/services/accountHealth/index.js
src/api/account/controllers/services/accountHealth/statusReadModel.js
config/cron-tasks/tasks/accountHealthSequence.js
config/cron-tasks/tasks/sweepAccountHealthFixtureDiscovery.js
```

Schemas:

```text
src/api/account-health-run/content-types/account-health-run/schema.json
src/api/account-health-item/content-types/account-health-item/schema.json
src/api/account/content-types/account/schema.json
```

Routes/controllers:

```text
src/api/account/routes/custom-account.js
src/api/account/controllers/account.js
```
