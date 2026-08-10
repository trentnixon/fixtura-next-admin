# CMS handoff: Scraper log job detail API (Admin)

**Audience:** CMS / Strapi / backend owners of `fixtura-scraper` logs  
**From:** Fixtura Admin frontend  
**Date:** 2026-03-20  
**Admin feature:** Route `/dashboard/data/[jobId]` — full timeline + payloads for one scraper job.

**CMS implementation (reply):** [`cms-response-admin-scraper-log-job-detail-api.md`](./cms-response-admin-scraper-log-job-detail-api.md) — R1–R5 live as of 2026-03-22.

---

## 1. Why we need this

The Data page lists scraper jobs. Admins open **Details** to see **every event** for that job (dequeued, started, heartbeats, completed, failed, retry_later, circuit events, etc.) with **rich fields** (metrics, issues, metadata).

Today the admin client must load **one job + all its `entries`** without scanning paginated list pages. That requires either:

- **Filtering the existing list endpoint by `jobId`**, or  
- A **dedicated GET-by-job-id** resource.

We also need each log row to expose the **original posted JSON** as `payload` so the UI can render `job.completed` metrics/issues and other event-specific shapes.

---

## 2. What the admin calls today

| Step | Request | Notes |
|------|---------|--------|
| 1 | `GET fixtura-scraper/logs?jobId=<id>&include=entries&pagination[page]=1&pagination[pageSize]=100` | Preferred. `jobId` must match stored `jobId` exactly (e.g. `strapi:1773992557227`). |
| 2 (fallback) | `GET fixtura-scraper/logs/<url-encoded-jobId>` | Used if step 1 fails (e.g. param not implemented) or returns no matching job. |

Base URL is whatever the admin already uses for `fixtura-scraper/logs` (same auth/headers as list).

**Frontend resolution after step 1:** `data.find(j => j.jobId === requestedJobId)` — so either return **only** that job or ensure the job appears in `data` when filtered.

---

## 3. CMS requirements (checklist)

| # | Requirement | Priority |
|---|-------------|----------|
| R1 | Support **`jobId`** query param on **`GET fixtura-scraper/logs`** with **`include=entries`**, returning the matching job with **`entries[]` populated** | **High** (simplest for both sides) |
| R2 | **OR** implement **`GET fixtura-scraper/logs/:jobId`** (URL-encoded id) with a documented JSON shape | **High** (alternative to R1) |
| R3 | Each **`LogEntry`** includes **`payload`** (object) = original request body stored for that log row | **High** (without this, detail page is mostly timestamps + labels) |
| R4 | **`404`** (or clear error body) when job id does not exist | **Medium** |
| R5 | List endpoint should **not error** when `jobId` is present if you implement R1 (avoid 400 for “unknown query param”) | **Medium** |

Implement **R1 or R2** (or both). R3 is independent but strongly recommended for the intended UX.

---

## 4. Contract details

### 4.1 List endpoint extension (`jobId`)

- **Query:** `jobId=<string>` (exact match on grouped job key).
- **With:** `include=entries`.
- **Response:** Same as existing list: `{ data: JobSummary[], meta: ... }`.
- **Expected:** `data` contains **at least one** `JobSummary` with `jobId` equal to the request; that object includes **`entries`** (all events for that job, ordered by time however you store; client re-sorts by `timestamp` / `createdAt`).

Optional: when `jobId` is set, `data` may contain **only** that job (efficient).

### 4.2 Path endpoint (fallback we accept)

**`GET fixtura-scraper/logs/{jobId}`** — `{jobId}` is **URL-encoded** (colon → `%3A`).

We normalize **any** of these shapes if `job.jobId` matches:

1. `{ "job": JobSummary, "entries": LogEntry[] }`
2. `JobSummary` (with `entries` on the same object)
3. `{ "data": JobSummary }` with `entries` on `JobSummary`
4. `{ "data": { "job": JobSummary, "entries": LogEntry[] } }`

### 4.3 `LogEntry.payload`

- Type: JSON object (not string), or omit if truly unavailable.
- Content: same JSON the scraper/worker **POST**ed to the logs ingest (per your CMS–scraper contract): e.g. for `job.completed`, include top-level / nested **`metrics`**, **`issues`**, **`fatal`**, **`metadata`**, worker fields, etc.

Admin merges `payload` with denormalised columns on `LogEntry` for display when keys are missing in `payload`.

### 4.4 `JobSummary` / `LogEntry` columns we already use

We rely on existing list shapes plus:

- `JobSummary`: `jobId`, `runId`, `scope`, `queueName`, `service`, `kind`, `bullJobId`, `attempt`, `status`, `durationMs` / `durationFormatted`, `startedAt`, `latestAt`, `eventCounts`, `entryCount`, optional `entries`.
- `LogEntry`: `id`, `event`, `timestamp`, `createdAt`, `service`, `scope`, `queueName`, `jobId`, `runId`, `kind`, `bullJobId`, `attempt`, `cmsProcessingDurationMs`, **`payload`**.

Event names we render specifically in UI include: `job.dequeued`, `job.started`, `job.heartbeat`, `job.retry_later`, `job.completed`, `job.failed`, `cms.circuit.opened`; others still show as JSON.

---

## 5. Errors

- **Unknown job:** Prefer **`404`** with a JSON `error.message` (or your standard error envelope) so the admin can show “job not found”.
- **Invalid `jobId`:** **`400`** with message is acceptable.

---

## 6. Example (illustrative)

**Request (preferred):**

```http
GET /api/fixtura-scraper/logs?jobId=strapi%3A1773992557227&include=entries&pagination[page]=1&pagination[pageSize]=25
```

**Minimal success fragment:**

```json
{
  "data": [
    {
      "jobId": "strapi:1773992557227",
      "runId": "cron-2026-03-20",
      "scope": "clients_list",
      "status": "completed",
      "entryCount": 33,
      "entries": [
        {
          "id": 1,
          "event": "job.started",
          "timestamp": "2026-03-20T08:00:00.000Z",
          "createdAt": "2026-03-20T08:00:01.000Z",
          "service": "python-scraper",
          "jobId": "strapi:1773992557227",
          "payload": {
            "event": "job.started",
            "leaseId": "…",
            "targetCount": 100,
            "metadata": { "leaseId": "…", "targetCount": 100 }
          }
        },
        {
          "id": 2,
          "event": "job.completed",
          "timestamp": "2026-03-20T08:15:00.000Z",
          "createdAt": "2026-03-20T08:15:01.000Z",
          "service": "python-scraper",
          "jobId": "strapi:1773992557227",
          "payload": {
            "event": "job.completed",
            "metrics": { "fixturesTotal": 2, "fixturesSucceeded": 2, "fixturesFailed": 0, "durationMs": 1001166, "ingest_total": 1166, "ingest_success": 1166, "ingest_failed": 0, "ingest_retried": 0 },
            "fatal": false,
            "issues": [],
            "metadata": { "metrics": { }, "fatal": false, "issues": [], "durationMs": 1001166, "artifactCount": 0 }
          }
        }
      ]
    }
  ],
  "meta": { }
}
```

(Shape of `meta` can stay as your current list implementation.)

---

## 7. References in this repo

| Doc / code | Purpose |
|------------|---------|
| `admin-frontend-scraper-log-by-job-id-integration.md` | Short integration note (duplicate of parts of this handoff) |
| `admin-frontend-scraper-logs-list-endpoint-guide.md` | Original list endpoint doc (updated with `jobId` + `payload`) |
| `src/lib/services/data-collection/fetchScraperLogByJobId.ts` | Exact client behaviour and normalisation |
| `src/types/scraperLogs.ts` | TypeScript contracts |

**External:** CMS–scraper event contract (Python `CmsService`, `cms_event_schema`, etc.) defines what appears inside `payload`.

---

## 8. Open questions for CMS

1. **`accountId`** on events: some specs mention it on `job.completed`; Python may not send it today — confirm whether Strapi should require it or store it when present only.
2. **Auth:** list endpoint is currently documented as unauthenticated; confirm whether job detail should use the same policy or stricter auth when exposed to admins only via Fixtura Admin.

---

## 9. Reply we need from CMS

Please confirm:

- [ ] **R1** (`jobId` on list) and/or **R2** (path by id) — which you will implement and target date  
- [ ] **R3** — whether `payload` can be populated for new and/or backfilled rows  
- [ ] Final **404/400** behaviour for missing job  

Thank you.
