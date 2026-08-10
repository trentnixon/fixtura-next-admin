# Admin Frontend: Scraper notification by job run (`GET …/notifications/by-run/...`)

**From:** CMS (Strapi) Backend Team  
**To:** Admin Frontend Team  
**Date:** 2026-03-31  
**Purpose:** Document the **per-run notification lookup** so the admin UI can show **full detail** for a single scraper job execution: `metrics`, `issues`, `fatal`, and the optional linked **`fixtura-scraper-log`** row for traceability.

**Pairing:** Use **[notification health aggregate](admin-frontend-notification-health-handoff.md)** for dashboards and trends; use **this route** when the user drills into a specific **`jobId` + `runId`** (e.g. from logs or a table row).

---

## 1. Endpoint

| Property | Value |
|----------|--------|
| **Method** | `GET` |
| **Path** | `/api/fixtura-scraper/notifications/by-run/:jobId/:runId` |
| **Auth** | None at route layer (`auth: false`), same pattern as `/api/fixtura-scraper/logs` list endpoints. Treat as **internal/trusted network** until auth is tightened. |

**Backend implementation:** [`controllers/handlers/GetNotificationByJobRun.js`](../controllers/handlers/GetNotificationByJobRun.js)

---

## 2. Path parameters

| Param | Required | Notes |
|-------|----------|--------|
| `jobId` | Yes | Non-empty string after trim. **URL-encode** if it contains reserved characters (e.g. spaces, `/`, `?`, `#`). The server runs **`decodeURIComponent`** on both params. |
| `runId` | Yes | Same rules as `jobId`. |

**Errors:**

| Status | When |
|--------|------|
| **400** | Invalid encoding, or `jobId` / `runId` empty after decode + trim. |
| **404** | No `fixtura-scraper-notification` row exists for that exact pair. |

---

## 3. Behaviour when multiple rows exist

The API loads up to **5** matching rows, sorted by **`createdAt` descending**. It returns **only the latest** (first row).

`meta` explains duplicates:

| Field | Type | Meaning |
|-------|------|--------|
| `duplicateCount` | number | How many rows were found in the limited fetch (`1`–`5`). |
| `returnedLatestByCreatedAt` | boolean | `true` if `duplicateCount > 1` (more than one notification stored for the same `jobId` + `runId`). |

If you need full history for a run, use Strapi REST **find** with filters (subject to permissions) or ask backend for a dedicated list endpoint.

---

## 4. Response shape (200)

```json
{
  "data": { },
  "meta": {
    "duplicateCount": 1,
    "returnedLatestByCreatedAt": false
  }
}
```

### 4.1 `data` (notification entity)

Strapi **entityService** shape (not the REST plugin’s `{ id, attributes }` envelope). Typical top-level fields:

| Field | Notes |
|-------|--------|
| `id` | Internal CMS id |
| `jobId`, `runId` | Match path (echo) |
| `service`, `timestamp`, `scope`, `queueName`, `kind` | Optional metadata from scraper/APP |
| `fatal` | boolean |
| `metrics` | JSON object (e.g. `fixturesTotal`, `fixturesFailed`, `ingest_*`, `durationMs`) |
| `issues` | JSON array of issue objects (`step`, `severity`, `message`, `url`, `scope`, etc.) |
| `errorRate` | Decimal; computed server-side when the row is created |
| `scraperLog` | Populated relation — see below |
| `createdAt`, `updatedAt` | CMS timestamps |

Notifications created **only** via APP ingest may have **`scraperLog`: null** (no linked log).

### 4.2 `data.scraperLog` (populated)

When present, **`scraperLog`** is the related **`fixtura-scraper-log`** document (the `job.completed` / lifecycle log that triggered T19 notification creation). Use it to correlate with the same **job timeline** as [`GET /api/fixtura-scraper/logs/:jobId`](../../fixtura-scraper-log/routes/custom-fixtura-scraper-log.js) (different grouping: this endpoint is **notification-centric**, logs endpoint is **event stream**).

Shape depends on the log content-type; expect fields like `event`, `payload`, `jobId`, `runId`, `cmsReceivedAt`, etc.

---

## 5. Example requests

**Plain ids:**

```http
GET /api/fixtura-scraper/notifications/by-run/grade-teams-batch-123/run-abc-789
```

**Encoded ids** (if the id contains special characters):

```http
GET /api/fixtura-scraper/notifications/by-run/job%2Fwith%2Fslashes/run%231
```

Build paths with your HTTP client’s URL encoding for **path segments** (not the same as query encoding only).

---

## 6. Product notes for UI

- **404** means “no failure notification for this pair,” not “job did not run.” Jobs that complete cleanly **without** issues/fatal **do not** create a notification row.
- Prefer showing **`meta.returnedLatestByCreatedAt`** in the UI if true (e.g. badge “multiple records; showing latest”).
- For **large `issues` arrays**, consider collapsible lists, counts by `step`, and links to `url` where present.
- **Auth:** coordinate with backend before exposing this on a public admin host without VPN or token.

---

## 7. Related docs

- **Health aggregate:** [admin-frontend-notification-health-handoff.md](admin-frontend-notification-health-handoff.md)
- **Route auth note:** [read-routes-auth.md](read-routes-auth.md)
- **T19 / notification spec (repo root):** [cms-t19-scrape-failure-notification-handoff.md](../../../../.comms/cms-t19-scrape-failure-notification-handoff.md)
