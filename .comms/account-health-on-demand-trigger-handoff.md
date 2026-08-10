# Account Health On-Demand Trigger Handoff

## Summary

This endpoint lets Admin trigger one account-health update immediately for a single account.

It uses the same account-health orchestration as the recurring cron, but bypasses the 5-day freshness window. It does not bypass account safety checks and it will not create a duplicate run when one is already active.

## Endpoint

```http
POST /api/account/:accountId/health/run-on-demand
Content-Type: application/json
```

Use this for the Admin "Run account update now" action.

No request body is required.

```json
{}
```

## Behaviour

The endpoint will:

- queue a new account-health run immediately when the account is eligible
- bypass only the normal "not checked in the last 5 days" due check
- reject invalid, inactive, not setup, updating, and non-billable accounts
- return an existing active run instead of creating a duplicate
- leave onboarding fields and scheduled asset delivery state unchanged

Active run statuses are:

```ts
type ActiveAccountHealthRunStatus = "pending" | "queued" | "running";
```

If a run already exists in one of those statuses, Admin should link the user to that run instead of showing a failure.

## Auth

The route currently uses Strapi authenticated Account permissions:

```text
api::account.account.postAccountHealthRunOnDemand
```

If the Admin frontend calls custom backend routes with a different auth model, such as an `APP_API_KEY` bearer token, backend auth middleware will need a follow-up change.

## Success Response

```ts
type AccountHealthScope =
  | "scrape:association-single"
  | "scrape:club-single"
  | "scrape:grades-batch"
  | "internal:club-to-association-sync"
  | "internal:association-to-club-sync"
  | "scrape:grades-lookup-teams-batch"
  | "scrape:fixture-discovery-batch";

type AccountHealthTriggerQueuedResponse = {
  data: {
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
        targetType: "association" | "club";
        targetId: number | null;
      }>;
    };
  };
};
```

Example:

```json
{
  "data": {
    "status": "queued",
    "runId": 4,
    "itemId": 9,
    "jobId": "account-health:575:scrape:association-single:2964:account-health-575-1779670548858-j73epy",
    "fetchPlan": {
      "accountId": 575,
      "accountType": "association",
      "associationIds": [2964],
      "clubId": null,
      "primaryOrganisation": {
        "type": "association",
        "id": 2964,
        "name": "Darwin And Districts Cricket Competition",
        "href": "https://www.playhq.com/cricket-australia/org/darwin-and-districts-cricket-competition/a44c6113"
      },
      "scopeSequence": [
        {
          "order": 1,
          "scope": "scrape:association-single",
          "targetType": "association",
          "targetId": 2964
        },
        {
          "order": 2,
          "scope": "scrape:grades-batch",
          "targetType": "association",
          "targetId": 2964
        }
      ]
    }
  }
}
```

## Existing Active Run Response

```ts
type AccountHealthTriggerExistingActiveResponse = {
  data: {
    status: "existing_active";
    runId: number;
    reason: "active_run_exists";
  };
};
```

Example:

```json
{
  "data": {
    "status": "existing_active",
    "runId": 4,
    "reason": "active_run_exists"
  }
}
```

Recommended Admin behaviour:

- show "An account update is already running"
- open or link to the run detail view for `runId`
- do not show this as an error state

## Error Response

Validation errors use the standard Strapi error envelope:

```ts
type AccountHealthTriggerErrorResponse = {
  data: null;
  error: {
    status: 400;
    name: "BadRequestError";
    message: AccountHealthTriggerErrorReason;
    details: Record<string, unknown>;
  };
};

type AccountHealthTriggerErrorReason =
  | "invalid_account_id"
  | "not_found"
  | "inactive"
  | "not_setup"
  | "account_updating"
  | "not_billable"
  | "invalid_health_plan";
```

Example:

```json
{
  "data": null,
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "not_billable",
    "details": {}
  }
}
```

Frontend should parse `error.message` as the stable reason code.

Suggested display labels:

```ts
const ACCOUNT_HEALTH_TRIGGER_ERROR_LABELS = {
  invalid_account_id: "Invalid account ID.",
  not_found: "Account not found.",
  inactive: "Account is inactive.",
  not_setup: "Account setup is not complete.",
  account_updating: "Account is already updating.",
  not_billable: "Account does not have an active paid order or active trial.",
  invalid_health_plan:
    "Account does not have a valid organisation health plan.",
};
```

## Follow-Up Status

After a queued or existing-active response, poll the run status endpoint:

```http
GET /api/account/health/runs/:runId/status
```

Recommended polling:

- every 10-15 seconds while status is `pending`, `queued`, or `running`
- stop when status is `completed`, `failed`, or `finalized`
- fixture discovery can take over an hour, so show progress rather than timing out in the UI

## Related Files

```text
src/api/account/controllers/account.js
src/api/account/routes/custom-account.js
src/api/account/controllers/services/accountHealth/index.js
src/api/account/.docs/admin/account-health-status-admin-handoff.md
```
