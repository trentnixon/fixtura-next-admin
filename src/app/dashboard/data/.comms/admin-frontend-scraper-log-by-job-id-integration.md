# Admin Frontend: Scraper log by job ID

**For:** CMS / Backend team  
**From:** Admin Frontend  
**Date:** 2026-03-20  
**Purpose:** Contract for loading a single scraper job with full event entries for `/dashboard/data/[jobId]`.

**Full CMS handoff (requirements, checklist, examples):** [`cms-handoff-scraper-log-job-detail-api.md`](./cms-handoff-scraper-log-job-detail-api.md)

**CMS implementation (live contract):** [`cms-response-admin-scraper-log-job-detail-api.md`](./cms-response-admin-scraper-log-job-detail-api.md)

---

## 1. Preferred: list endpoint with `jobId`

**Method:** `GET`  
**Path:** `fixtura-scraper/logs` (same as list)

**Query parameters:**

| Parameter | Value |
|-----------|--------|
| `jobId` | Exact job id, e.g. `strapi:1773992557227` |
| `include` | `entries` |
| `pagination[page]` | `1` |
| `pagination[pageSize]` | `1`–`100` (frontend uses `100` if filtering is loose) |

**Expected behaviour:** Response shape matches the existing list endpoint (`{ data: JobSummary[], meta }`). `data` should contain **only** the job matching `jobId`, with `entries` populated on that item.

**Frontend resolution:** Finds `data.find(j => j.jobId === jobId)`.

If `jobId` is not yet supported, the list call may fail or return an unfiltered page; the client then tries the path fallback below.

---

## 2. Optional: dedicated path

**Method:** `GET`  
**Path:** `fixtura-scraper/logs/{jobId}` (`jobId` URL-encoded, e.g. `strapi%3A1773992557227`)

**Accepted response shapes (any one):**

1. `{ job: JobSummary, entries: LogEntry[] }`
2. `JobSummary` with `entries` on the object
3. `{ data: JobSummary }` where `JobSummary` includes `entries`
4. `{ data: { job: JobSummary, entries: LogEntry[] } }`

---

## 3. `LogEntry.payload`

When `include=entries` is used, each `LogEntry` should include **`payload`** (object): the original JSON body posted to the CMS for that event (see scraper contract: `job.completed` metrics/issues, `job.failed` metadata, heartbeats, etc.). The detail UI merges `payload` with row-level columns for display.

---

## 4. References

- List endpoint guide: `admin-frontend-scraper-logs-list-endpoint-guide.md`
- Types: `src/types/scraperLogs.ts`
- Service: `src/lib/services/data-collection/fetchScraperLogByJobId.ts`
