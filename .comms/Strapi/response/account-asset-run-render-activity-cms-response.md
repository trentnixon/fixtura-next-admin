# CMS Response: Account Asset Run Render Activity Report

**Date:** 2026-06-02  
**From:** CMS (Strapi) Backend  
**To:** fixtura-admin  
**Re:** [account-asset-run-render-activity-report-endpoint.md](../requests/account-asset-run-render-activity-report-endpoint.md), [account-asset-run-render-activity-admin-reply.md](../requests/account-asset-run-render-activity-admin-reply.md)

---

## Status

**Implemented** in CMS (Strapi Backend).

---

## Endpoint

| Property | Value |
|----------|-------|
| **Method** | GET |
| **Path** | `/api/account-asset-runs/render-activity` |
| **Auth** | Admin sends `Authorization: Bearer ${APP_API_KEY}` (same as other admin CMS calls). Route uses `auth: false` like existing asset-run custom routes for v1. |
| **Behaviour** | Read-only — does **not** call `advanceAccountAssetRun` or mutate run state. |

---

## Query parameters

| Param | Required | Default | Notes |
|-------|----------|---------|-------|
| `from` | No | `now - 48h` UTC | ISO timestamp |
| `to` | No | `now` UTC | Inclusive upper bound on resolved run start |
| `page` | No | `1` | Page number |
| `pageSize` | No | `100` | Max `500`. If only `limit` is sent, treated as `pageSize` for page 1 |
| `status` | No | all | Comma-separated. `running` expands to all non-terminal asset-run statuses |
| `accountId` | No | all | Optional account drilldown |
| `includeItems` | No | `false` | Slim item breakdown per run when `true` |

### Resolved run start (filter + sort)

1. `startedAt`
2. Epoch ms suffix from `runKey` when present (on-demand keys)
3. `createdAt`

---

## Response shape

```ts
type Response = {
  data: Array<{
    run: {
      id: number;
      runKey: string;
      status: string;
      mode: string;
      trigger: string;
      scheduledDate: string | null;
      startedAt: string | null;
      finishedAt: string | null;
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
    scheduler: { id: number; name: string | null } | null;
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
  }>;
  meta: {
    from: string;
    to: string;
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
    returned: number;
    totalIsEstimated?: boolean;
  };
};
```

### `finishedAt`

`completedAt || failedAt || cancelledAt || null`

### `durationMs`

- **Completed / failed / cancelled:** terminal timestamp − resolved start
- **Active:** `now − resolved start`
- **No resolved start:** `null`

---

## Example

```http
GET /api/account-asset-runs/render-activity?page=1&pageSize=25
Authorization: Bearer ${APP_API_KEY}
```

```json
{
  "data": [
    {
      "run": {
        "id": 42,
        "runKey": "account-asset-run:575:88:2026-06-02",
        "status": "completed",
        "mode": "full",
        "trigger": "scheduled",
        "scheduledDate": "2026-06-02",
        "startedAt": "2026-06-02T09:01:00.000Z",
        "finishedAt": "2026-06-02T09:18:31.000Z",
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
          "totalItems": 45
        }
      }
    }
  ],
  "meta": {
    "from": "2026-05-31T12:00:00.000Z",
    "to": "2026-06-02T12:00:00.000Z",
    "page": 1,
    "pageSize": 25,
    "pageCount": 1,
    "total": 1,
    "returned": 1
  }
}
```

---

## Admin table mapping

| Column | Source |
|--------|--------|
| Org | `account.name`, fallback `Account {id}` |
| Started | `run.startedAt` (resolved start used for filtering) |
| Finished | `run.finishedAt` |
| Time taken | `run.durationMs` |
| Status | `run.status` |
| Render items | `render.counts.totalItems` |
| Render link | `/dashboard/renders/{render.id}` when present |
| Run link | `/dashboard/accounts/asset-runs/{run.id}?accountId={account.id}` |

If `render` is null, show **Render pending** and link to run detail.

---

## Code

- [src/api/account-asset-run/routes/custom-account-asset-run.js](../../../src/api/account-asset-run/routes/custom-account-asset-run.js)
- [src/api/account-asset-run/controllers/account-asset-run.js](../../../src/api/account-asset-run/controllers/account-asset-run.js)
- [src/api/account/controllers/services/accountAssetRuns/renderActivityReport.js](../../../src/api/account/controllers/services/accountAssetRuns/renderActivityReport.js)

---

## Verify

1. `GET /api/account-asset-runs/render-activity` — default last 48h UTC, paginated `meta`
2. `?status=running` — includes `queued`, `scraping_results`, etc.
3. `?accountId={id}` — account drilldown
4. `?includeItems=true` — slim scope breakdown on rows
5. Repeated list calls do not change run status (read-only)
