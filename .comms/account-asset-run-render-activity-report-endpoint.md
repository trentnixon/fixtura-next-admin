# Account Asset Run Render Activity Report Endpoint

**Date:** 2026-06-02  
**From:** fixtura-admin  
**To:** CMS / Strapi backend  
**Re:** New time-windowed render activity report for Admin `/dashboard`

## Summary

Admin needs a dashboard report showing render workflows that happened in a configurable time window, starting with the last 48 hours.

The existing `GET /api/account-asset-runs/status?limit=25` endpoint is useful for recent status, but it is limit-based and slim. It cannot reliably answer "all renders in the last 48 hours" when the number of runs in that window exceeds the requested limit, and it does not include enough render detail for the operations table.

Please create a new report endpoint that returns account asset runs joined to their render/account/scheduler detail, filterable by date range.

## Proposed Endpoint

```http
GET /api/account-asset-runs/render-activity?from=2026-06-01T00:00:00.000Z&to=2026-06-03T00:00:00.000Z
```

This endpoint is intended for Admin reporting, not per-run polling.

## Query Parameters

| Param | Required | Default | Notes |
|-------|----------|---------|-------|
| `from` | No | `now - 48h` | ISO timestamp. Filter against run start time when available, otherwise run `createdAt`. |
| `to` | No | `now` | ISO timestamp. Inclusive upper bound. |
| `limit` | No | `100` | Maximum rows returned. Suggested hard cap: `500`. |
| `page` | No | `1` | Optional if pagination is easier than a single capped result. |
| `pageSize` | No | `100` | Optional alternative to `limit`; suggested hard cap: `500`. |
| `status` | No | all | Optional comma-separated list, e.g. `completed,failed,running`. |
| `accountId` | No | all | Optional account filter for drilldown. |
| `includeItems` | No | `false` | When true, include a slim item breakdown. Default false for dashboard performance. |

Admin should be able to change the filter to last 24h, 48h, 7d, custom ranges, etc.

## Date Filtering Rule

Use the best available run timestamp in this order:

1. `account-asset-run.startedAt`
2. timestamp encoded in `runKey`, if this is still needed for older records
3. `account-asset-run.createdAt`

Rows should be sorted newest first by the same resolved start timestamp.

## Response Shape

```ts
type AccountAssetRunRenderActivityResponse = {
  data: AccountAssetRunRenderActivityRow[];
  meta: {
    from: string;
    to: string;
    limit: number;
    total: number;
    returned: number;
    page?: number;
    pageSize?: number;
    pageCount?: number;
  };
};

type AccountAssetRunRenderActivityRow = {
  run: {
    id: number;
    runKey: string;
    status: string;
    mode: "asset_only" | "full" | string | null;
    trigger: "scheduled" | "on_demand" | string | null;
    scheduledDate: string | null;
    startedAt: string | null;
    completedAt: string | null;
    failedAt: string | null;
    durationMs: number | null;
    failureReason: string | null;
  };
  account: {
    id: number;
    name: string | null;
    type: string | null;
    sport: string | null;
  };
  scheduler: {
    id: number;
    name: string | null;
  } | null;
  render: {
    id: number;
    name: string | null;
    processing: boolean;
    complete: boolean;
    emailSent: boolean;
    createdAt: string | null;
    updatedAt: string | null;
    publishedAt: string | null;
    counts: {
      downloads: number;
      aiArticles: number;
      gameResults: number;
      upcomingGames: number;
      grades: number;
      totalItems: number;
    };
  } | null;
  items?: {
    total: number;
    completed: number;
    failed: number;
    skipped: number;
    running: number;
    queued: number;
    byScope: Array<{
      scope: string;
      status: string;
      startedAt: string | null;
      completedAt: string | null;
      failedAt: string | null;
      durationMs: number | null;
    }>;
  };
};
```

## Example Response

```json
{
  "data": [
    {
      "run": {
        "id": 42,
        "runKey": "account-asset-run:575:88:2026-06-02:scheduled:full:1780344000000",
        "status": "completed",
        "mode": "full",
        "trigger": "scheduled",
        "scheduledDate": "2026-06-02",
        "startedAt": "2026-06-02T09:01:00.000Z",
        "completedAt": "2026-06-02T09:18:31.000Z",
        "failedAt": null,
        "durationMs": 1051000,
        "failureReason": null
      },
      "account": {
        "id": 575,
        "name": "Org A",
        "type": "club",
        "sport": "basketball"
      },
      "scheduler": {
        "id": 88,
        "name": "Org A weekly render"
      },
      "render": {
        "id": 1234,
        "name": "Org A - 2026-06-02",
        "processing": false,
        "complete": true,
        "emailSent": true,
        "createdAt": "2026-06-02T09:12:00.000Z",
        "updatedAt": "2026-06-02T09:18:31.000Z",
        "publishedAt": "2026-06-02T09:12:00.000Z",
        "counts": {
          "downloads": 18,
          "aiArticles": 4,
          "gameResults": 10,
          "upcomingGames": 7,
          "grades": 6,
          "totalItems": 39
        }
      }
    }
  ],
  "meta": {
    "from": "2026-06-01T00:00:00.000Z",
    "to": "2026-06-03T00:00:00.000Z",
    "limit": 100,
    "total": 1,
    "returned": 1
  }
}
```

## Render Counts

The dashboard table needs a quick sense of render size. Please include counts from the render relations where available:

- downloads
- AI articles
- game results in render
- upcoming games in render
- grades in render
- total item count

`totalItems` can be a computed sum of the above. If a render relation is missing or not populated, return `0` rather than omitting the key.

## Admin Table Use Case

The first Admin table will show:

| Column | Source |
|--------|--------|
| Org | `account.name`, fallback `Account {id}` |
| Started | `run.startedAt` |
| Finished | `run.completedAt` or `run.failedAt` |
| Time taken | `run.durationMs` |
| Status | `run.status` |
| Render items | `render.counts.totalItems` plus key counts in tooltip/details |
| Render link | `/dashboard/renders/{render.id}` when present |
| Run link | `/dashboard/accounts/asset-runs/{run.id}?accountId={account.id}` |

If `render` is null, Admin will show "Render pending" and still link to the run detail.

## Implementation Notes

- This endpoint can reuse the account-asset-run model as the source of truth.
- Populate account, scheduler, render, and render counts server-side to avoid Admin making N+1 detail requests.
- Keep the default response slim: do not include full render lineage or full item payload unless `includeItems=true`.
- Use API-key/Admin auth consistent with other Admin-only custom routes.
- Return empty `data: []` with valid `meta` for windows with no activity.
- Prefer stable camelCase keys in the custom response, matching the existing Admin custom endpoint style.

## Suggested CMS Files

```text
src/api/account-asset-run/routes/custom-account-asset-run.js
src/api/account-asset-run/controllers/account-asset-run.js
src/api/account/controllers/services/accountAssetRuns/index.js
```

## Acceptance Criteria

- `GET /api/account-asset-runs/render-activity` returns the last 48 hours by default.
- `from` and `to` can expand or shrink the reporting window.
- Rows include account name/type, run start/end/duration, render id, render status, and render item counts.
- The endpoint does not require Admin to fetch each run or render individually to build the dashboard table.
- Active/running rows return `durationMs` from `startedAt` to now, or `null` if CMS prefers Admin to calculate active elapsed time.
- Failed rows use `failedAt` as the finish timestamp.
- Completed rows use `completedAt` as the finish timestamp.
