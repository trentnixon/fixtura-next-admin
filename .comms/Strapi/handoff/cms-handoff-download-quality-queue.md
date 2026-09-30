# CMS handoff: download attention queue

**Date:** 2026-09-29
**From:** CMS (Strapi) Backend
**To:** fixtura-admin
**Re:** Fleet QC on `/dashboard/renders/download-quality-control`
**Status:** Implemented. Restart Strapi after pulling this change, then grant the permission below.

This replaces the short sort note. The route Admin already calls is live. Drop the 404 stub once staging returns 200.

---

## Endpoint

| | |
| --- | --- |
| Method | `GET` |
| Strapi path | `/api/downloads/admin/quality-queue` |
| Admin axios | `GET {NEXT_APP_API_BASE_URL}/downloads/admin/quality-queue` |
| Auth | `Authorization: Bearer` API token, same instance as `GET /renders/audit` |
| Behaviour | Read-only. Does not rerender, clear errors, or write any download field. |

`NEXT_APP_API_BASE_URL` already includes `/api`. The relative path in code stays `/downloads/admin/quality-queue`.

### Permission

After deploy, on the **same API token role** Admin already uses:

1. Settings, Users and Permissions plugin, Roles. Open the role tied to the Admin API token.
2. Open **Download**.
3. Enable **qualityQueue**.
4. Save.

Scope string: `api::download.download.qualityQueue`

A Full access token needs no checkbox. A Custom token without this action gets **403 Forbidden**. A missing route is still **404**. Those are different. The empty-queue stub should stay only for 404 and 501.

---

## Query parameters

The fleet page should keep sending `from`, `to`, `page`, `pageSize`, and `needsAttention=true`.

| Param | Required | Default | Notes |
| --- | --- | --- | --- |
| `from` | No | now minus 48 hours | Inclusive ISO instant on download `updatedAt` |
| `to` | No | now | Inclusive ISO instant on download `updatedAt` |
| `page` | No | `1` | Values below 1 fall back to 1 |
| `pageSize` | No | `25` | Hard cap `100`. Non-positive values fall back to 25 |
| `needsAttention` | No | treated as `true` | Only omitted or `true` is valid |

Send both `from` and `to` from the 24h, 48h, and 7d presets. The server default of 48 hours applies only when a bound is omitted. If you send only a `to` that is older than now minus 48 hours, `from` lands after `to` and the call returns 400.

There is no `sport`, `accountId`, `renderId`, `q`, or `attention` query param in this version.

### Who is in the list

`needsAttention=true` (and an omitted flag) keeps a download when either rule matches. Drafts and published rows are both included.

1. **Failed** (`attention: "failed"`). `hasError === true`, or `errorHandler` is a non-empty array. This wins if the download is also unprocessed.
2. **In progress** (`attention: "in_progress"`). Not failed, and `hasBeenProcessed` is not true. A null `hasBeenProcessed` counts as not processed and is sent as `false`.

Left out: a processed download that is not failed. That includes `hasError: null` with an empty or missing `errorHandler`. An empty array does not count as failed. A non-array `errorHandler` does not count as failed. `hasError: null` is not rewritten to `false`.

### Sort

This is the change from the earlier lock, which sorted by `updatedAt` only.

1. All failed rows, then all in-progress rows.
2. Inside each bucket, `updatedAt` descending.
3. Same timestamp, higher `downloadId` first.

An in-progress row never appears above a failure. Use `attention` for the badge. Do not recompute the bucket from the flags. The server already coerced a null `hasBeenProcessed`.

### Time

Filter instants are UTC. `meta.from` and `meta.to` are the resolved window as ISO strings. Display them in Australia/Sydney in the UI. This queue is not aligned to render telemetry `failedToday`.

### Errors

HTTP 400. The Strapi `error.message` is one of:

- `needsAttention must be true or omitted`
- `from and to must be valid ISO timestamps when provided`
- `from must be before or equal to to`

---

## Response

CamelCase. No `queueAvailable`. That field stays client-only on the 404 stub.

```ts
type DownloadAttention = "failed" | "in_progress";

type DownloadQualityQueueRow = {
  downloadId: number;
  name: string | null;
  hasError: boolean | null;
  hasBeenProcessed: boolean;
  attention: DownloadAttention;
  userErrorMessage: string | null;
  errorHandler: Array<{ Message?: string; Type?: string }> | null;
  errorEmailSentToAdmin: boolean;
  forceRerender: boolean;
  groupingCategory: string | null;
  assetCategoryIdentifier: string | null;
  assetCategoryName: string | null;
  assetName: string | null;
  assetLinkId: string | null;
  gameId: string | null;
  url: string | null;
  updatedAt: string;
  render: {
    id: number;
    name: string | null;
    complete: boolean;
    processing: boolean;
    publishedAt: string | null;
  } | null;
  account: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    sport: "Cricket" | "AFL" | "Hockey" | "Netball" | "Basketball" | null;
    type: string | null;
  } | null;
};

type DownloadQualityQueueResponse = {
  data: DownloadQualityQueueRow[];
  meta: {
    from: string;
    to: string;
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
    returned: number;
  };
};
```

`meta.total` is the number of attention rows in the window, not every download touched in that window. `meta.returned` is the current page length. `meta.pageCount` is `0` when `total` is `0`.

### Field notes

| Field | Meaning |
| --- | --- |
| `attention` | `"failed"` or `"in_progress"`. Sort key and badge. |
| `hasError` | Stored value. `null` stays `null`. |
| `hasBeenProcessed` | `true` only when stored true. Null is sent as `false`. |
| `userErrorMessage` | Primary error text. Show this first. |
| `errorHandler` | Fallback. First non-empty `Message`. `Type` is free text for chips, not an enum. |
| `errorEmailSentToAdmin` | Admin error email already sent. |
| `account` | From `render → scheduler → account`. `firstName` and `lastName` are separate. `type` is `account_type.Name`. `sport` is the account sport enum. Null when the render or scheduler account is missing. Direct `download.account` is not used, even if it disagrees. |
| `render` | Null when the download has no render. `complete` can be true on a failed download. |
| `assetCategoryIdentifier` | Category `Identifier`. Content Hub treats `"VIDEO"` and `"IMAGE"` as those values. |
| `assetCategoryName` | Category `Name`. |
| `updatedAt` | ISO instant. This is the window field. It also moves when someone force-rerenders. |

Account label in the table: join `firstName` and `lastName` when present, otherwise `Account {id}`.

---

## Example

```http
GET /api/downloads/admin/quality-queue?from=2026-09-22T01:00:00.000Z&to=2026-09-29T01:00:00.000Z&page=1&pageSize=25&needsAttention=true
Authorization: Bearer <token>
```

```json
{
  "data": [
    {
      "downloadId": 4812,
      "name": "Round 12 highlights",
      "hasError": true,
      "hasBeenProcessed": false,
      "attention": "failed",
      "userErrorMessage": "Composition missing",
      "errorHandler": [{ "Message": "Composition missing", "Type": "render" }],
      "errorEmailSentToAdmin": true,
      "forceRerender": false,
      "groupingCategory": "results",
      "assetCategoryIdentifier": "VIDEO",
      "assetCategoryName": "VIDEO",
      "assetName": "Match video",
      "assetLinkId": "asset-link-88",
      "gameId": "game-102",
      "url": null,
      "updatedAt": "2026-09-28T02:14:00.000Z",
      "render": {
        "id": 900,
        "name": "Monday render",
        "complete": true,
        "processing": false,
        "publishedAt": "2026-09-28T01:00:00.000Z"
      },
      "account": {
        "id": 42,
        "firstName": "Ada",
        "lastName": "Lovelace",
        "sport": "Cricket",
        "type": "Club"
      }
    }
  ],
  "meta": {
    "from": "2026-09-22T01:00:00.000Z",
    "to": "2026-09-29T01:00:00.000Z",
    "page": 1,
    "pageSize": 25,
    "pageCount": 1,
    "total": 1,
    "returned": 1
  }
}
```

The numbers in that sample are illustrative. The shape is what the route returns.

---

## Still elsewhere

| Need | Where |
| --- | --- |
| Per-render Downloads tab | Scoped `GET /api/downloads` with `publicationState=preview`. Unchanged. |
| Force rerender one download | `POST /api/download/ForceAssetRerender` with `{ "data": { "RerenderID": "<download id>" } }`. Sets `forceRerender`, clears `hasBeenProcessed` and `errorHandler`, and does not clear `hasError` or `UserErrorMessage`. The row can stay `failed` until Creator writes the next result. |
| Asset-run failures | `GET /api/account-asset-runs/render-activity` |
| Ghost renders and integrity | `GET /api/renders/audit`, `GET /api/renders/lineage/:id` |
| AI articles | Not in this queue. Later route, Pressbox fields. |

No bulk actions, no mark-reviewed field, no Sydney-day summary counts on this route.
