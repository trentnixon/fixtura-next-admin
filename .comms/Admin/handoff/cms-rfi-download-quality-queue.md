# RFI response — Download quality queue

**Date:** 2026-09-29  
**From:** fixtura-admin (Renders workspace)  
**To:** CMS (Strapi) Backend  
**Re:** Answers for `GET /api/downloads/admin/quality-queue`  
**Status:** Answered — contract locked in CMS (see [.comms/Strapi/response/download-quality-queue-api-lock.md](../../Strapi/response/download-quality-queue-api-lock.md))

**Prior admin decisions:** [.comms/Strapi/response/download-quality-control-admin-decisions.md](../../Strapi/response/download-quality-control-admin-decisions.md)  
**CMS context:** RFI dated 2026-09-29 (download quality queue)

---

## Summary

We confirm a **dedicated admin read route** at `GET /api/downloads/admin/quality-queue`. We will **not** use core `GET /api/downloads` for the fleet screen. Per-render Downloads continues to use scoped `GET /api/downloads` with `publicationState=preview` and filters applied in the client.

Until the route exists, Admin treats **404/501** as “endpoint not deployed” (empty queue + `queueAvailable: false` in our local fallback only — **not** part of your JSON envelope).

---

## Inline answers

### 1. Path

**Confirmed.**

| Layer | Value |
|--------|--------|
| Strapi | `GET /api/downloads/admin/quality-queue` |
| Admin axios | `GET {NEXT_APP_API_BASE_URL}/downloads/admin/quality-queue` |

`NEXT_APP_API_BASE_URL` is the same base used for `GET /renders/audit` and `GET /account-asset-runs/render-activity` (includes the `/api` prefix). Relative path in code: `/downloads/admin/quality-queue`.

**Query string v1 (always sent by fleet page today):**

| Param | Example | Notes |
|--------|---------|--------|
| `from` | `2026-09-22T01:00:00.000Z` | Inclusive ISO instant; rolling window start |
| `to` | `2026-09-29T01:00:00.000Z` | Inclusive ISO instant; rolling window end |
| `page` | `1` | |
| `pageSize` | `25` | We use **25** in UI (not 100) |
| `needsAttention` | `true` | See item 2 |

We do **not** append a manual query string in code; axios serializes `params` (standard `key=value&…` encoding).

---

### 2. Who is in the queue (default membership)

**Default for the fleet screen:** rows that match our **Needs attention** filter (same rules as render-detail Downloads tab).

Implement server-side when `needsAttention=true` (our v1 default):

1. **Failed:** `hasError === true` **OR** `errorHandler` is a non-empty array  
2. **In progress:** **not** Failed (per rule 1) **and** `hasBeenProcessed === false`

**Exclude:**

- **OK:** processed and not Failed  
- **Unknown:** everything else (including `hasError === null` with no errorHandler and processed — ambiguous legacy)

`hasError === null` is **not** treated as healthy. It may still appear as **In progress** if `hasBeenProcessed === false`. It should **not** match an “errors only” filter that only checks `hasError === true`.

We are **not** asking for `hasError === true` only as the fleet default; legacy rows where `hasError` is false but `errorHandler` is populated must appear.

Optional later: `needsAttention=false` or additional params for “failed only” / “in progress only”; v1 UI only sends `needsAttention=true`.

---

### 3. Time window

**Confirmed:** filter on download `updatedAt` with inclusive ISO `from` and `to`.

| Topic | Admin answer |
|--------|----------------|
| UI default preset | **7 days** rolling (not 48h) |
| Presets in UI | **24h**, **48h**, **7d** (we compute `from`/`to` in the browser and always send both) |
| Custom ISO range | **Planned** (same pattern as render-activity); not in fleet UI v1 but we want the API to accept arbitrary `from`/`to` |
| Server default if `from`/`to` omitted | **48h** is acceptable as a CMS fallback; we will normally send explicit bounds |
| Telemetry `failedToday` | **Do not** align. Fleet QC is download `updatedAt` only |

Display in Admin: timestamps formatted in **Australia/Sydney**. Filter instants remain UTC ISO.

---

### 4. Drafts

**Include unpublished downloads** in this route (same intent as render-detail `publicationState=preview`).

Operators must see draft/publish gaps during QC; published-only would hide rows we already surface on the render Downloads tab.

---

### 5. AI articles

**Confirmed: v1 is downloads only.**

Article / Pressbox QC is a **later** route and tab (`latestFailureCode`, `latestFailureSummary`, `currentOutcome`). Do not mix article rows into this queue.

---

### 6. Filters — v1 vs contract

**v1 client will send:** `from`, `to`, `page`, `pageSize`, `needsAttention`.

**Keep on the contract for near-term UI (do not remove):**

| Param | v1 sent? | Notes |
|--------|----------|--------|
| `sport` | No | Fleet filters — Phase B+ |
| `accountType` | No | |
| `accountId` | No | Useful for deep links / account-scoped queue |
| `renderId` | No | Useful from render context |
| `assetCategory` | No | Match `asset_category.Identifier` |
| `q` | No | Search `Name`, `assetLinkID`, `gameID` |
| `hasError` | No | Prefer `needsAttention` semantics unless you need explicit toggles |
| `hasBeenProcessed` | No | Same |
| `sortBy` / `sortOrder` | No | Defaults sufficient for v1 |

**Missing param we may want later (not blocking v1):** `attention` enum (`failed` \| `in_progress` \| `needs_attention` \| `all`) if boolean `needsAttention` is awkward — optional; boolean is fine if item 2 semantics are implemented.

---

### 7. Pagination

| Field | Admin preference |
|--------|------------------|
| `page` default | `1` — **confirmed** |
| `pageSize` default | Prefer **`25`** when client omits it (render audit uses 25; render-activity often uses 100 — this screen follows audit) |
| Hard cap | **`100`** — **confirmed** |
| `sortBy` default | `updatedAt` — **confirmed** |
| `sortOrder` default | `desc` — **confirmed** |

---

### 8. Account label

Join path: **`render → scheduler → account`** (not direct `download.account`) — **confirmed**.

**Table label:** `firstName` and `lastName` concatenated when present; fallback `Account {id}`. Render audit often shows **FirstName only**; fleet table shows full name when `lastName` exists for disambiguation.

Send `sport` and `type` (`account_type.Name`) as in your draft — we use them for links (club vs association overview).

---

### 9. Error text

**Confirmed:**

| Priority | Field |
|----------|--------|
| Primary | `userErrorMessage` (`UserErrorMessage`) |
| Fallback | First non-empty `errorHandler[].Message` when `userErrorMessage` is empty |
| Secondary UI | Chips from distinct `errorHandler[].Type` (free text, not enum) |
| Indicator | Show when `errorEmailSentToAdmin === true` |

We will align fleet table + render-detail Downloads to the same fallback rule (fleet may lag render-detail by a small UI patch).

---

### 10. Envelope

**Confirmed:** same shape as render-activity (`data` + `meta` with window + pagination).

**Agreed TypeScript (admin will align types to this):**

```ts
type DownloadQualityQueueRow = {
  downloadId: number;
  name: string | null;
  hasError: boolean | null;
  hasBeenProcessed: boolean;
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

**Naming:** camelCase in JSON is fine if that is your admin-route convention (render-activity uses camelCase in our types). If you emit Strapi-style PascalCase for nested fields, tell us — we will map once in the fetch layer.

**Not in CMS response:** `meta.queueAvailable` — that is **Admin-only** when we synthesize an empty payload after 404/501 before deploy.

**Delta from our current client types:** we will add `assetCategoryName`, `assetLinkId`, `url`, `forceRerender`, nullable `name` / `hasError`, and `meta.returned`; we will remove reliance on admin-only `queueAvailable` in the contract doc.

---

### 11. Auth

**Confirmed:** same **Bearer API token** as `GET /api/renders/audit`. Authenticated admin route only.

After deploy, grant the token role permission for this action — we expect **403** when forbidden, **404** when route missing.

---

### 12. v1 read-only

**Confirmed.**

| Action | Route |
|--------|--------|
| Force rerender | `POST /api/download/ForceAssetRerender` (existing) |

We understand post-rerender behaviour: `forceRerender` set, `hasBeenProcessed` / `errorHandler` cleared, **`hasError` and `UserErrorMessage` may remain** until Creator updates — row can stay in queue.

No bulk actions, no “mark reviewed”, no PATCH QC fields in v1.

Fleet row action **Detail** → `/dashboard/downloads/{downloadId}`; force rerender on fleet rows is **Phase B UI** (API already wired on render-detail).

---

### 13. Cardinality / performance

We do **not** have reliable production counts in this repo (no warehouse hookup for “downloads per day” or “hasError true in 48h”).

**Operational expectations (order-of-magnitude, not SLAs):**

| Metric | Expectation |
|--------|-------------|
| Audience | Internal staff triage, not public scale |
| Typical fleet page | Tens of rows per window after `needsAttention` filter; worst case low hundreds in 7d |
| Pagination | `pageSize=25` keeps payloads small |

**Ask CMS:** index or query plan on **`updatedAt` + attention predicates** (`hasError`, `hasBeenProcessed`, JSON `errorHandler`). `hasError` not indexed today is a risk for sub-2s at scale — acceptable for v1 if window + `needsAttention` narrow the set.

We will share real counts from staging/production after first deploy if you need tuning.

---

## Draft row markup

**Accepted** with the envelope in item 10. Optional fields (`url`, `forceRerender`, `assetCategoryName`, `assetLinkId`) are welcome on every row — we may not render all in v1 table.

---

## Out of scope (reconfirmed)

- Render integrity / ghost (`/renders/audit`, `/renders/lineage/:id`)
- Account-asset-run orchestration failures (`/account-asset-runs/render-activity`)
- AI articles / Pressbox
- Overview summary tiles (Sydney buckets) — **separate route after this queue** (Option B)
- `isAccurate`, `qcStatus`, `qcReviewedAt`, `failedAt`

---

## Admin surfaces using this route

| Surface | Route |
|---------|--------|
| Fleet queue | `/dashboard/renders/download-quality-control` |
| Per-render QC | Scoped `GET /api/downloads` + client buckets (unchanged) |

---

## Next steps

1. CMS implements route per items **2, 3, 4, 6, 10, 11** (others answered above).  
2. CMS notifies when deployed + permission name for token role.  
3. Admin updates `DownloadQualityQueueRow` types and removes 404 stub once verified in staging.  
4. Optional follow-up RFI for **Option B** summary counts (`failed` / `in progress` by Sydney day).

---

## Admin follow-up (2026-09-29) — fleet UI

| Request | Admin behaviour |
|--------|------------------|
| Window presets | 24h, 48h, 7d, **14d**, **21d** (always send `from` / `to`) |
| **All downloads** in window | Fleet sends `needsAttention=false`. Expect `attention` of `ok` / `unknown` on those rows; sort may differ from attention-only queue. |
| Group by category | Client-side groups on the **current page** by `groupingCategory`, `assetCategoryIdentifier`, or `assetCategoryName`. |

---

## Open questions for CMS

1. Exact **permission action** string for Strapi role configuration (so we can document in runbooks).  
2. Confirm **JSON casing** on the wire (camelCase vs PascalCase) for nested `render` / `account`.  
3. Whether `needsAttention` is the param name you prefer, or you want `attention=needs_attention` instead.
