# CMS response: Scraper log job detail API (Admin)

**From:** CMS / Strapi backend (`fixtura-scraper-log`)  
**To:** Fixtura Admin frontend  
**Date:** 2026-03-22  
**Re:** [cms-handoff-scraper-log-job-detail-api.md](./cms-handoff-scraper-log-job-detail-api.md)

---

## Summary

The backend now supports loading **one scraper job by exact `jobId`** with **full `entries[]`** and **`payload`** on each log row, without relying on list pagination across all jobs. Both the **preferred query form** and the **path fallback** from your handoff are implemented.

---

## Requirements covered

| ID | Requirement | Status |
|----|-------------|--------|
| **R1** | `GET .../logs?jobId=<id>&include=entries` | **Live** — exact DB match on `jobId`; response `data` contains **only** that job (one element) when found. |
| **R2** | `GET .../logs/<url-encoded-jobId>` | **Live** — same `JobSummary` + `entries` shape as list mode; **`entries` always included** (no need to pass `include=entries`). |
| **R3** | `LogEntry.payload` (object) | **Unchanged** — ingest already stores the full POST body in `payload`; list/detail responses select `payload` on each entry. Legacy rows without stored payload may omit or have null (no backfill in this work). |
| **R4** | Unknown job | **`404`** — Strapi’s standard not-found envelope; message text includes **Job not found**. |
| **R5** | `jobId` query param | **Supported** — not treated as an unknown param. |

---

## Endpoints

Base URL: `{CMS_BASE_URL}/api` (same as existing logs list).

### 1) Preferred — list with `jobId` query

| Property | Value |
|----------|--------|
| **Method** | GET |
| **Path** | `/api/fixtura-scraper/logs` |
| **Auth** | Same as list today: **`auth: false`** on this route (TODO on our side to harden if product requires). |

**Query parameters**

| Parameter | Required | Notes |
|-----------|----------|--------|
| `jobId` | For this flow | **Exact** string match (e.g. `strapi:1773992557227`). |
| `include` | Yes, for timeline | Set to **`entries`** to receive `data[0].entries[]`. |
| `scope`, `queueName`, `event`, `timestamp_gte`, `timestamp_lte` | No | Combined with **`AND`** against `jobId` when provided. |
| `pagination[page]`, `pagination[pageSize]` | No | When `jobId` is set, pagination in **`meta`** is normalised to a **single job** (`total: 1`, `page: 1`, `pageCount: 1`); `pageSize` is still validated (1–100). |

**Example**

```http
GET /api/fixtura-scraper/logs?jobId=strapi%3A1773992557227&include=entries&pagination[page]=1&pagination[pageSize]=100
```

**Success:** `200` — `{ data: [ JobSummary ], meta: { ... } }` with `data.length === 1` and `data[0].jobId` equal to the requested id.

**Client check:** `data.find(j => j.jobId === requestedJobId)` — with a valid id, `data[0]` is that job.

### 2) Fallback — GET by path

| Property | Value |
|----------|--------|
| **Method** | GET |
| **Path** | `/api/fixtura-scraper/logs/:jobId` |
| **Auth** | Same as list (`auth: false` today). |

`:jobId` must be **URL-encoded** (e.g. `strapi%3A1773992557227`). The server applies **`decodeURIComponent`** once.

**Behaviour**

- **`entries`** are **always** attached to the job object (equivalent to `include=entries` on the list route).
- Optional query filters (`scope`, etc.) still apply if you pass them.
- Response body matches **shape (3)** in your handoff §4.2: `{ "data": [ JobSummary ] }` with `entries` on `JobSummary` (we return an array with one job, same as R1).

**Example**

```http
GET /api/fixtura-scraper/logs/strapi%3A1773992557227
```

---

## Errors

| Situation | HTTP | Notes |
|-----------|------|--------|
| No log rows for that `jobId` (and any other filters) | **404** | Job not found. |
| `jobId` query param **present** but empty / whitespace only | **400** | e.g. `?jobId=` |
| Path segment missing or empty after decode/trim | **400** | |
| Invalid `%` encoding in path `jobId` | **400** | Message: invalid encoding. |
| Invalid pagination | **400** | Unchanged: page ≥ 1, pageSize 1–100. |

---

## Response shape and `meta` (job detail)

- **`data`**: Same `JobSummary` fields as the existing scope list (`jobId`, `runId`, `scope`, `queueName`, `service`, `kind`, `bullJobId`, `attempt`, `status`, `durationMs`, `durationFormatted`, `startedAt`, `latestAt`, `eventCounts`, `entryCount`, optional `entries`).
- **`entries`**: Sorted by `timestamp` then `createdAt` (string compare). Each entry includes **`payload`** (JSON object) when stored.
- **`meta`**: When `jobId` is used (query or path), **`summary`**, **`dateRange`**, and **`timeline`** are computed **only from that job** (not the full table), so job detail is cheap and consistent.

### `job.completed` artifacts

- **`metadata.artifactCount`**: Number of capture files the scraper recorded for the run (commonly screenshots for failed steps).
- **`issues[].artifactRefs`**: Relative storage paths for files tied to that issue (e.g. `artifacts/.../run-YYYY-MM-DD/{fixtureKey}.png`). There is **no download URL** in the log payload itself.
- **Admin UI:** Lists deduped paths from `artifactRefs`. Optional env **`NEXT_PUBLIC_SCRAPER_ARTIFACT_BASE_URL`** (no trailing slash): if set to the base that serves those paths, the admin shows **clickable links**; otherwise paths are **display-only** (open files via CMS, bucket console, or worker host).

---

## Limits

- At most **10,000** log **rows** are loaded per request (existing cap). For a single `jobId`, that is effectively a cap on **events per job**; jobs with more than 10k events would truncate unless we raise the limit later.

---

## Code references (this repo)

| Area | Path |
|------|------|
| List / job-detail logic | `src/api/fixtura-scraper-log/controllers/handlers/ListScraperLogs.js` |
| Controller (path handler) | `src/api/fixtura-scraper-log/controllers/fixtura-scraper-log.js` |
| Routes | `src/api/fixtura-scraper-log/routes/custom-fixtura-scraper-log.js` |

Route order: **`GET .../logs/:jobId`** is registered **before** **`GET .../logs`** so the dynamic segment is not swallowed by the list route.

---

## Open items (unchanged from your handoff)

1. **`accountId`** — Not required by CMS; store when present in payloads if you reintroduce it client-side.
2. **Auth** — GET logs (list, job query, job path) remain **unauthenticated** in Strapi config until we align on policy (admin-only proxy vs CMS token).

---

## Related docs

- Original request: [cms-handoff-scraper-log-job-detail-api.md](./cms-handoff-scraper-log-job-detail-api.md)
- List endpoint guide (query params, shapes, §1.1 job detail): [admin-frontend-scraper-logs-list-endpoint-guide.md](./admin-frontend-scraper-logs-list-endpoint-guide.md)
- Admin integration note: [admin-frontend-scraper-log-by-job-id-integration.md](./admin-frontend-scraper-log-by-job-id-integration.md)
