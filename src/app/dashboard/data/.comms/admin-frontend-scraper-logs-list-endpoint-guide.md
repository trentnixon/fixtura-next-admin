# Admin Frontend Guide: Scraper Logs List Endpoint

**For:** Frontend Admin team  
**From:** CMS / Backend team  
**Date:** 2026-03-12  
**Purpose:** How to consume the scraper logs list endpoint for the scope UI and charts.

---

## 1. Endpoint Overview

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **Path** | `/api/fixtura-scraper/logs` |
| **Full URL** | `{CMS_BASE_URL}/api/fixtura-scraper/logs` |
| **Auth** | Currently `auth: false` — no auth required (TODO: may change) |
| **Content-Type** | N/A (GET, no body) |

### 1.1 Job detail: `jobId` query and path GET (implemented)

CMS implements **single-job** loads for Admin `/dashboard/data/[jobId]`:

- **`GET .../logs?jobId=<id>&include=entries`** — returns `data` with **one** `JobSummary` when found; **`include=entries`** required for `data[0].entries[]`.
- **`GET .../logs/<url-encoded-jobId>`** — same shape as list (`{ data: [ JobSummary ] }`); **`entries`** always included on the job.

Errors, `meta` scoping, and the **10,000 rows per request** cap are documented in **[`cms-response-admin-scraper-log-job-detail-api.md`](./cms-response-admin-scraper-log-job-detail-api.md)**.

---

## 2. Request

### 2.1 No Request Body

This is a GET request. There is no request body. All parameters are passed as **query parameters**.

### 2.2 Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|--------------|
| `scope` | `string` | **Yes** | — | Queue name to filter. Must be one of: `scrape:clients-list`, `scrape:association-to-competition`, `scrape:association-single` |
| `queueName` | `string` | No | — | Filter by queue name (e.g. `scrape:clients-list`) |
| `event` | `string` | No | — | Filter by event type: `job.started`, `job.heartbeat`, `job.retry_later`, `job.completed` |
| `timestamp_gte` | `string` | No | — | Start of date range (ISO8601, e.g. `2026-03-01T00:00:00.000Z`) |
| `timestamp_lte` | `string` | No | — | End of date range (ISO8601) |
| `pagination[page]` | `number` | No | `1` | Page number (1-based) |
| `pagination[pageSize]` | `number` | No | `25` | Jobs per page (1–100) |
| `include` | `string` | No | — | Set to `entries` to include full event timeline per job |
| `jobId` | `string` | No | — | When supported by CMS, return only the job matching this id (used with `include=entries` for `/dashboard/data/[jobId]`). See `admin-frontend-scraper-log-by-job-id-integration.md`. |

### 2.3 Example Requests

```
GET /api/fixtura-scraper/logs?scope=scrape:clients-list
GET /api/fixtura-scraper/logs?scope=scrape:clients-list&pagination[page]=1&pagination[pageSize]=10
GET /api/fixtura-scraper/logs?scope=scrape:association-to-competition&timestamp_gte=2026-03-01T00:00:00.000Z&timestamp_lte=2026-03-12T23:59:59.999Z
GET /api/fixtura-scraper/logs?scope=scrape:clients-list&include=entries
GET /api/fixtura-scraper/logs?jobId=strapi%3A1773204751507&include=entries&pagination[page]=1&pagination[pageSize]=1
```

### 2.4 `LogEntry.payload` (when `include=entries`)

Each stored log row may include **`payload`** (object): the original JSON event body posted to the CMS (`metrics`, `issues`, `metadata`, worker fields, etc.). The admin job detail page uses this for full fidelity; row-level columns remain the summary.

---

## 3. Response

### 3.1 Success Response (200 OK)

The response is a JSON object with two top-level keys: `data` and `meta`.

```typescript
interface ListLogsResponse {
  data: JobSummary[];
  meta: ListLogsMeta;
}
```

### 3.2 `data` — Array of Job Summaries

Each item represents one job (all events for that job grouped by `jobId`).

```typescript
interface JobSummary {
  jobId: string;              // e.g. "strapi:1773204751507", "bull:1"
  runId: string | null;       // e.g. "cron-2026-03-11"
  scope: string;             // e.g. "clients_list"
  queueName: string | null;   // e.g. "scrape:clients-list"
  service: string | null;     // e.g. "python-scraper"
  kind: string | null;        // "account" | "fixture" | null
  startedAt: string | null;   // ISO8601
  latestAt: string | null;    // ISO8601
  startedAtMs: number | null; // Epoch milliseconds (for charts)
  latestAtMs: number | null;  // Epoch milliseconds (for charts)
  status: JobStatus;          // "completed" | "retry_later" | "in_progress" | "unknown"
  durationMs: number | null; // Elapsed ms from first to last event
  durationFormatted: string | null;  // e.g. "10m 24s", "1s"
  eventCounts: EventCounts;    // { started, heartbeat, retry_later, completed }
  entryCount: number;          // Total events in this job
  entries?: LogEntry[];       // Only present when ?include=entries
}

type JobStatus = "completed" | "retry_later" | "in_progress" | "unknown";

interface EventCounts {
  started: number;
  heartbeat: number;
  retry_later: number;
  completed: number;
}
```

### 3.3 `meta` — Metadata and Aggregations

```typescript
interface ListLogsMeta {
  scope: string;
  pagination: Pagination;
  dateRange: DateRange;
  summary: Summary;
  timeline: Timeline;
}

interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

interface DateRange {
  from: string | null;   // ISO8601 (earliest job start)
  to: string | null;     // ISO8601 (latest job end)
  fromMs: number | null; // Epoch ms
  toMs: number | null;   // Epoch ms
}

interface Summary {
  totalJobs: number;
  byStatus: Record<JobStatus, number>;
  totalDurationMs: number;
  avgDurationMs: number | null;
}

interface Timeline {
  byHour: TimelineBucket[];
  byDay: TimelineBucket[];
}

interface TimelineBucket {
  bucket: string;        // ISO8601 (start of hour/day)
  bucketMs: number | null;
  jobCount: number;
  totalDurationMs: number;
  byStatus: Record<string, number>;
}
```

### 3.4 `entries` (when `?include=entries`)

Each entry in `job.entries` has:

```typescript
interface LogEntry {
  id: number;
  event: string;         // e.g. job.dequeued, job.started, job.heartbeat, job.completed, job.failed, job.retry_later, cms.circuit.opened
  scope: string;
  timestamp: string | null;  // ISO8601
  queueName: string | null;
  jobId: string;
  runId: string | null;
  service: string | null;
  kind: string | null;
  bullJobId?: string | null;
  attempt?: number | null;
  cmsReceivedAt?: string | null;
  cmsProcessingDurationMs?: number | null;
  payload?: Record<string, unknown> | null;  // full posted body when persisted
  createdAt: string;     // ISO8601
}
```

---

## 4. Error Responses

### 4.1 400 Bad Request — Missing scope

**When:** `scope` is missing, empty, or not a string.

**Body:**
```json
{
  "error": {
    "status": 400,
    "message": "scope is required"
  }
}
```

### 4.2 400 Bad Request — Invalid pagination

**When:** `pagination[page]` < 1 or `pagination[pageSize]` not in 1–100.

**Body:**
```json
{
  "error": {
    "status": 400,
    "message": "pagination[page] must be >= 1, pagination[pageSize] must be 1-100"
  }
}
```

### 4.3 500 Internal Server Error

**When:** Server error during processing.

**Body:**
```json
{
  "error": {
    "status": 500,
    "message": "Failed to list scraper logs: <error detail>"
  }
}
```

---

## 5. Usage for Charts

| Chart Type | Data Source | X-Axis | Y-Axis |
|------------|-------------|--------|--------|
| Line — jobs over time | `meta.timeline.byHour` or `byDay` | `bucket` or `bucketMs` | `jobCount` |
| Line — duration over time | `meta.timeline.byHour` or `byDay` | `bucket` | `totalDurationMs` |
| Stacked bar — status over time | `meta.timeline.byHour` | `bucket` | `byStatus` (stacked) |
| Bar — status distribution | `meta.summary.byStatus` | status key | count |
| Bar — duration by job | `data` | `jobId` | `durationMs` |
| Scatter — duration vs start | `data` | `startedAtMs` | `durationMs` |

**Axis bounds:** Use `meta.dateRange.fromMs` and `meta.dateRange.toMs` for chart domain.

---

## 6. Scope Values Reference (queue names)

| scope (queue name) | Description |
|-------------------|-------------|
| `scrape:clients-list` | Clients list scraping |
| `scrape:association-to-competition` | Association-to-competition scraping |
| `scrape:association-single` | Single-association scrape (triggered from association detail) |

---

## 7. Status Values Reference

| status | Meaning |
|--------|---------|
| `completed` | Job finished (last event was `job.completed`) |
| `retry_later` | Job asked to retry later (last event was `job.retry_later`) |
| `in_progress` | Job still running (last event was `job.started` or `job.heartbeat`) |
| `unknown` | Could not determine status |

---

## 8. Example Full Response

```json
{
  "data": [
    {
      "jobId": "strapi:1773204751507",
      "runId": "cron-2026-03-11",
      "scope": "clients_list",
      "queueName": "scrape:clients-list",
      "service": "python-scraper",
      "kind": "account",
      "startedAt": "2026-03-11T04:52:32.023609+00:00",
      "latestAt": "2026-03-11T05:02:56.427109+00:00",
      "startedAtMs": 1773204752023,
      "latestAtMs": 1773205376427,
      "status": "completed",
      "durationMs": 624404,
      "durationFormatted": "10m 24s",
      "eventCounts": { "started": 1, "heartbeat": 31, "retry_later": 0, "completed": 1 },
      "entryCount": 33
    }
  ],
  "meta": {
    "scope": "clients_list",
    "pagination": { "page": 1, "pageSize": 25, "pageCount": 1, "total": 4 },
    "dateRange": {
      "from": "2026-03-11T04:52:32.023Z",
      "to": "2026-03-11T09:34:36.370Z",
      "fromMs": 1773204752023,
      "toMs": 1773221676370
    },
    "summary": {
      "totalJobs": 4,
      "byStatus": { "completed": 2, "retry_later": 1, "in_progress": 1, "unknown": 0 },
      "totalDurationMs": 800681,
      "avgDurationMs": 200170
    },
    "timeline": {
      "byHour": [
        {
          "bucket": "2026-03-11T04:00:00.000Z",
          "bucketMs": 1773201600000,
          "jobCount": 1,
          "totalDurationMs": 624404,
          "byStatus": { "completed": 1 }
        }
      ],
      "byDay": [
        {
          "bucket": "2026-03-11T00:00:00.000Z",
          "bucketMs": 1773187200000,
          "jobCount": 4,
          "totalDurationMs": 800681,
          "byStatus": { "in_progress": 1, "completed": 2, "retry_later": 1 }
        }
      ]
    }
  }
}
```

---

## 9. Quick Reference

- **Base URL:** `{CMS_BASE_URL}/api/fixtura-scraper/logs`
- **Required param:** `scope` (string)
- **Optional params:** `jobId`, `queueName`, `event`, `timestamp_gte`, `timestamp_lte`, `pagination[page]`, `pagination[pageSize]`, `include=entries`
- **Success:** 200, JSON with `data` and `meta`
- **Errors:** 400 (bad request), 500 (server error)
