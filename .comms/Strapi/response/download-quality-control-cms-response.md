# CMS response — Download quality control (render operations)

**Date:** 2026-09-28  
**From:** CMS (Strapi) backend  
**To:** fixtura-admin  
**Re:** RFI — Download QC in the Admin Renders workspace  

Admin decisions from the grill session: `.comms/Strapi/response/download-quality-control-admin-decisions.md`

**v1 route (implemented):** [cms-handoff-download-quality-queue.md](../handoff/cms-handoff-download-quality-queue.md)

---

CMS can answer this from the current Strapi 4.24 model. A fleet QC queue should be a new authenticated admin route. Render-detail QC can stay on `GET /api/downloads`. Download flags, render integrity, and account-asset-run failures are three separate signals.

## Decision

| Surface | Use |
|---|---|
| Render detail Downloads tab | Existing `GET /api/downloads` (see the example below). |
| Fleet queue and Overview rollups | New admin routes. Do not extend `GET /api/renders/audit`, `GET /api/renders/telemetry`, or `GET /api/renders/lineage/:id`. |
| AI articles | Separate collection and a separate queue. Do not reuse the download row shape. |
| Asset-run failures | Leave on `GET /api/account-asset-runs/render-activity`. Do not merge into download QC. |

`GET /api/downloads` can filter and paginate, but it is a poor fleet queue: draft/publish hides unpublished rows, `createdAt` is stripped from every REST response, `hasError` is nullable and unindexed, the user-facing text is split across two fields, and account context is not a flat label.

---

## 1. Field dictionary — `download`

UID: `api::download.download`. Collection: `downloads`. Display name: `[ren] Asset Download`. **Draft and publish is on.**

There is no `failedAt`, error-code enum, or `qcStatus` / `qcReviewedAt`.

Writers, from the data-platform catalogue: CMS render orchestration and Creator/Journalist callbacks. In this repo, CMS code only writes two of these fields. Creator is what sets the quality flags, by updating the download over Strapi. This backend never assigns `hasError`, `UserErrorMessage`, `isAccurate`, `URL`, or `CompletionTime`.

| Field | Meaning in CMS | Who sets it here | Trust for QC |
|---|---|---|---|
| `hasError` | Boolean, **no default** (null is allowed). Not exclusive with `hasBeenProcessed`. | Not set in this repo. | Yes, when `true`. Treat `null` as unknown, not healthy. |
| `hasBeenProcessed` | Boolean, default `false`. | CMS sets `false` on force rerender. Creator is expected to set `true` when it finishes. CMS does not check storage. | “Renderer finished this pass,” not “file exists.” |
| `isAccurate` | Boolean, no default. | No writer in this repo. Content Hub only echoes it. | Do not filter on it. |
| `UserErrorMessage` | String, **no max length**. | Not set in this repo. | Display it, and also read `errorHandler`. |
| `errorHandler` | JSON. The admin error email expects an array of `{ Message, Type }`. | Cleared to `[]` on force rerender. Otherwise written by Creator. | This is the closest thing to a category. `Type` is free text, not an enum. |
| `errorEmailSentToAdmin` | Boolean, default `false`. | `POST /api/download/handleDownloadErrorEmail` sets `true` after email. | Safe to show as “already notified.” |
| `forceRerender` | Boolean, default `false`. | `POST /api/download/ForceAssetRerender` sets `true`, sets `hasBeenProcessed` false, sets `editTrigger` false, clears `errorHandler`, and enqueues `setCreateAssets`. It does **not** clear `hasError` or `UserErrorMessage`. | State flag plus queue trigger. Call that route. Do not PATCH the boolean alone. |
| `CompletionTime` | **String**, not a datetime. | Not set here. | Do not use it as a time-window anchor. |
| `DisplayCost`, `OutputFileSize`, `numDownloads` | Float, string, integer. No rule that zero size means failure. | Not set here. | No QC meaning in CMS. |
| `URL` | String. | Not set here. | Empty `URL` with `hasError` false or null is allowed. |
| `downloads` | JSON (member download list / file metadata). | Not set here. | Separate from the `download` row. |
| `grouping_category` | Free string. Content Hub groups on it. | Creator / orchestration. | Useful display filter, not an enum. |
| `Name`, `assetLinkID`, `gameID` | Strings. `assetLinkID` is **not unique**. | Orchestration. | Staff ids, in this order: `id`, `Name`, `assetLinkID`, `gameID`. |

### Relations

| Relation | Schema | QC use |
|---|---|---|
| `render` | manyToOne → `api::render.render` | Required. One render has many downloads. |
| `account` | oneToOne on the download | Direct link exists (`downloads_account_links`). Audit does **not** use it. Audit uses `render → scheduler → account`. Prefer that path so the label matches `/renders/audit`. |
| `asset` | oneToOne → catalogue asset (`Name`, `CompositionID`) | Template, not the output instance. Key rows by download `id`. |
| `asset_category` | oneToOne | `Identifier` is what Content Hub compares to `"VIDEO"` and `"IMAGE"`. Distribution looks up category `Name` `"VIDEO"` / `"IMAGE"`. Both are plain strings. |
| `asset_type` | oneToOne | `Name` (for example results vs upcoming in Content Hub metrics). |
| `grades` | manyToMany | Not a single `grade`. Lineage still populates `download.grade`, which is not a schema field. |
| Sport game data | manyToMany `game_data_afls`, `game_data_netballs`, `game_data_hockeys`, `game_data_basketballs` | Optional. `gameID` string is the staff-facing id. |
| `scheduler` | oneToOne | Present. Account for QC should still come through the render’s scheduler. |

Duplicates are allowed. Nothing unique-constrains `(render, asset, gameID)` or `assetLinkID`. `GET /api/download/asset-by-link/:assetLinkID` uses `findMany`.

Account label: `account.FirstName` (audit calls this `accountName`). `LastName` exists. Sport is `account.Sport`: `Cricket`, `AFL`, `Hockey`, `Netball`, `Basketball`. Type is `account.account_type.Name`, not a string on the account.

### Failure taxonomy

There is no download error code. Modes CMS can name:

- Structured blob in `errorHandler[].Type` / `.Message` (free text).
- User string in `UserErrorMessage`.
- Admin email already sent (`errorEmailSentToAdmin`).
- Pipeline failure on the asset run (separate; see below).

A render can be `Complete: true` and still have downloads with `hasError: true`. Nothing in the schema or in asset-run completion checks download errors. Completion marks the run successful when `Processing === false` and `Complete === true`, and only counts download rows.

Integrity is orthogonal. `GET /api/renders/lineage/:id?checkIntegrity=true` builds `errors[]` for a ghost render (complete, zero downloads and zero AI articles) and a warning when both `Processing` and `Complete` are true. `summary.errorCount` is the length of that list. It does not read `hasError`. Lineage download objects are `id`, `name`, type, category, timestamps. They omit `hasError`, `UserErrorMessage`, and `errorHandler`.

`isGhostRender` on `GET /api/renders/audit` is `Complete && downloadsCount === 0 && aiArticlesCount === 0`. Keep that as its own bucket.

### Timestamps

Anchor a “failed in the last 48h” queue on download **`updatedAt`**. That also moves when someone force-rerenders or when the error email flag flips. There is no failure timestamp.

Do not use `CompletionTime` (string), download `publishedAt` (draft/publish time), render `publishedAt` (render publish, not the failure), or asset-run `failedAt`.

`createdAt` is in `config/api.js` `responses.privateAttributes`, so REST omits it on every content type. `updatedAt` and `publishedAt` still return.

`failedToday` on `GET /api/renders/telemetry` is not a download metric and not Sydney-midnight. It counts renders with `publishedAt` inside the **Node process local** calendar day, `Complete: false`, `Processing: false`. QC “today” should be an explicit `Australia/Sydney` window on a new summary route, or absolute ISO instants on `updatedAt`. Do not copy `failedToday`.

---

## 2. AI articles

In scope as a **second** queue, not the same rows.

UID: `api::ai-article.ai-article`. Draft and publish is on. Shared with downloads: `render`, `account`, `asset`, `asset_category`, `grouping_category`, `assetLinkID`, `hasError`, `forceRerender`, `errorHandler`.

Not on articles: `hasBeenProcessed`, `isAccurate`, `UserErrorMessage`, `errorEmailSentToAdmin`, `URL`, `gameID`.

Pressbox is the authoritative article state: `currentProcessingStatus`, `currentOutcome`, `latestFailureCode` (max 64), `latestFailureSummary` (max 500), `lastError`, `articleStatus` (`pending | waiting | writing | completed | failed`). `legacyFieldSync` sets `hasError: true` for a failed outcome, and can leave `hasError: true` even when an older successful article body is kept. For article QC, prefer `latestFailureCode` / `latestFailureSummary` / `currentOutcome`, and treat `hasError` as a legacy mirror.

---

## 3. Asset runs vs download flags

Do not merge them.

`account-asset-item.scope` is a pipeline stage (`eligibility_check`, `grades_comps_refresh`, `result_batch_scrape`, `remove_fixtures_scrape`, `asset_creation`, `asset_completion`). For asset stages, `targetType` is `"render"` and `targetId` is the **render id**, not a download id.

`checkAssetCompletion` never reads `download.hasError`. A run can complete while downloads are in error. A run can fail with `render_completed_without_success` or `render_not_found` when no download row has `hasError`.

| Signal | Means |
|---|---|
| Download `hasError` | That output row was marked failed by Creator. |
| Integrity `errorCount` / ghost | Render completeness and fixture gaps. |
| Asset-run `failed` | Orchestration did not finish a stage. |

---

## 4. What `GET /api/downloads` can do

Strapi 4.24 REST. `config/api.js`: `defaultLimit: 100`, `maxLimit: 250`. No extra rate limit on this route. Auth is Users & Permissions on the core router (`find` must be granted to the Admin token). It is not `auth: false`. Permissions live in the Strapi permission tables, not in git.

Supported and appropriate for a **single render**:

```http
GET /api/downloads?publicationState=preview
  &filters[render][id][$eq]=123
  &filters[hasError][$eq]=true
  &pagination[page]=1
  &pagination[pageSize]=100
  &sort=updatedAt:desc
  &fields[0]=Name
  &fields[1]=hasError
  &fields[2]=hasBeenProcessed
  &fields[3]=UserErrorMessage
  &fields[4]=grouping_category
  &fields[5]=assetLinkID
  &fields[6]=gameID
  &fields[7]=errorEmailSentToAdmin
  &fields[8]=updatedAt
  &populate[render][fields][0]=Name
  &populate[render][fields][1]=Complete
  &populate[render][fields][2]=Processing
  &populate[render][fields][3]=publishedAt
  &populate[account][fields][0]=FirstName
  &populate[account][fields][1]=Sport
  &populate[asset][fields][0]=Name
  &populate[asset_category][fields][0]=Identifier
  &populate[asset_category][fields][1]=Name
```

Also valid: `filters[hasBeenProcessed][$eq]`, `filters[updatedAt][$gte]`, `filters[account][Sport][$eq]=Cricket`, `filters[asset_category][Identifier][$eq]=VIDEO`, `filters[gameID][$containsi]=`.

Do not use this as the fleet queue without `publicationState=preview`. The default is published-only. Schema declares no index on `hasError`, `hasBeenProcessed`, or `isAccurate`. A global `hasError=true` scan has no latency budget in this repo. There is no CMS promise of p95 under 2s.

`filters[$or][0][Name][$containsi]` plus `assetLinkID` / `gameID` works as a search, and it is the expensive variant.

Content Hub already returns a per-render bundle via `DownloadService` (`hasError`, `errorHandler`, category `Identifier`). It omits `UserErrorMessage`. That route is for the member hub, not Admin QC.

`GET /api/renders/audit` is a fixed page of 25, then two count queries per row. Adding `downloadsWithErrorCount` there is possible and would keep that N+1 pattern. It still would not list the download rows. Leave audit as it is.

---

## 5. Proposed admin APIs

**Option A — build this for the fleet queue.** Same auth as `GET /api/renders/audit`: authenticated, `policies: []`, not `auth: false`. `GET /api/renders/distribution` is the public exception. Do not copy that.

Query params in the RFI are fine, with these amendments:

- Time window filters `updatedAt`, inclusive ISO instants.
- `hasError=true` means the boolean true only. Null stays out.
- `sport` matches `account.Sport` through `render.scheduler.account`.
- `accountType` matches `account_type.Name` on that same account.
- `assetCategory` matches `asset_category.Identifier`.
- `q` is contains on `Name`, `assetLinkID`, `gameID`.
- Cap `pageSize` at 100. Default sort `updatedAt:desc`.
- Add `outputType=download|ai-article` later, rather than one mixed row.

Row shape amendments: `account.name` is not a field — use `firstName` / `lastName`. `account.type` is `account_type.Name`. Include `errorHandler` (or a flattened `errorType` from `errorHandler[0].Type`) beside `userErrorMessage`. `isAccurate` should be omitted until a writer exists. Include `publishedAt` only as a draft/publish fact, not as the failure time.

One query with joins is feasible. Cardinality is not in the repo.

**Option B — summary, after A.** Counts on `hasError = true` and `hasBeenProcessed = false` for a window are cheap enough if the queue route’s filters are indexed. Do not hang this off render telemetry. `accurate` should be omitted. Cache only if the window is closed; a live “today” count should be uncached. Day buckets in `Australia/Sydney`.

**Option C — not preferred.** Render detail should keep using `GET /api/downloads?filters[render][id][$eq]=`. Do not bury QC fields inside lineage.

---

## 6. Actions

| Action | v1 |
|---|---|
| Force rerun one download | Already exists: `POST /api/download/ForceAssetRerender` with `{ "data": { "RerenderID": "<download id>" } }`. Authenticated. Re-query the row after, because `hasError` can stay true. |
| Clear error / mark reviewed | No field. QC stays read-only aside from force rerender. A later `qcReviewedAt` is a schema change, not something Admin can invent. |
| Re-queue the whole render | Render has its own `forceRerender`. That is not a download QC action. |
| Bulk by filter | Not supported. |

---

## 7. Non-functional

- Latency: no p95 target exists. Audit is page size 25 with per-row counts. A new queue should be one filtered query, page size ≤ 100, and will need a real index on `(hasError, updatedAt)` before anyone signs “under 2s.”
- Rate limits: none on download or render admin routes.
- `UserErrorMessage` and `errorHandler` may contain fixture or account context. The error email already sends `errorHandler` plus account `FirstName` and `Sport` to a fixed admin inbox. Showing `UserErrorMessage` in the Admin UI is consistent with that. Do not assume it is PII-free, and do not assume a max length.
- Retention: `cleanupStaleRenders` (03:30 Australia/Sydney) deletes a render and its downloads when `publishedAt` is older than 365 days, `Processing` is false, and `Complete` is true. The cron is off unless `DATA_CLEANUP_RENDER_CRON_ENABLED=true`, and dry-run unless `DATA_CLEANUP_RENDER_DRY_RUN=false`. Incomplete renders are not deleted by this job. Failed downloads on a **completed** render disappear with that render. There is no archive that hides them earlier. Catalogue assets linked from the download are not deleted.

---

## 8. Rules of thumb for staff

1. `hasError: true` on a download means that output failed. Open `UserErrorMessage` and `errorHandler`.
2. `hasError` null and `hasBeenProcessed` false means not finished, not proven healthy.
3. `Complete` on the render does not clear download errors.
4. Ghost / integrity errors mean missing outputs or fixture gaps, even when every existing download is clean.
5. A red asset-run means the pipeline stage failed. It may not have a download row at all.
6. After force rerender, a row can still show the old `hasError` until Creator writes the next result.
7. Article problems: use Pressbox `latestFailureCode` and `currentOutcome`, not the download queue.

Legacy rows can have any combination of null `hasError`, empty `URL`, `hasBeenProcessed: true`, and a non-empty `errorHandler`. QC should treat `hasError === true` OR a non-empty `errorHandler` as needing attention, and should not infer failure from file size or URL alone.

---

## Acceptance criteria

| Criterion | Answer |
|---|---|
| List downloads needing attention, paginated | Per render: yes, REST, with `publicationState=preview`. Fleet-wide under 2s: not with current indexes. That needs Option A. |
| Row has render id, account label, category, flags, error text | REST can supply them. Account label is `FirstName` via `render.scheduler.account`. Error text is `UserErrorMessage` plus `errorHandler`. |
| AI articles in the same UX | No. Separate queue. Pressbox failure fields are the source of truth. |
| Integrity and asset-run vs download flags | Three views. Do not merge. |
| Auth | Same as `GET /api/renders/audit`: Users & Permissions token. Not a public route. |
