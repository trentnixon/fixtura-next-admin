# Admin / Admin Frontend: Trigger Grades Batch Scrape

**From:** CMS (Strapi) Backend Team  
**To:** Admin & Admin Frontend Teams  
**Date:** 2026-04-17  
**Purpose:** Document `POST /api/competition/trigger-grades-batch-scrape` so you can wire buttons or internal tools to enqueue a **batch** grades scrape for **one association** (all its competitions), and understand payloads, IDs, and responses.

**Related:** [Scope-grade-batch-handoff.md](../../../../.comms/Python/request/Scope-grade-batch-handoff.md) (full pipeline: Bull, Python, ingest). CMS batch GET: `GET /api/competition/batch/:id` (association-scoped competition list).

---

## 1. Overview

Calling this endpoint enqueues a job on the Redis/Bull queue **`scrape:grades-batch`**. The **bull-bridge-worker** (separate service) picks it up, calls Python with `gradesBatchContextId`, and Python fetches the competition list from CMS via **`GET {CMS_BASE_URL}/api/competition/batch/{encodedId}`**, then runs the same **`grades_comps`** scrape loop as other modes and POSTs results to **`POST /api/competition-grades/ingest`** per competition.

**Use case:** “Refresh grades for every competition under association X” without running the full-catalog flow (`recon` + paginated `/competition/data`) and without one queue job per competition (`trigger-grades-comps-single-scrape`).

**Not the same as:**

| Trigger | What it does |
|---------|----------------|
| `POST /api/competition/trigger-grades-comps-scrape` | Full catalog: recon + paginated `/competition/data`, stale filter |
| `POST /api/competition/trigger-grades-comps-single-scrape` | One competition (`competitionId` + `url`) |
| **`POST /api/competition/trigger-grades-batch-scrape`** | **One association context** → `GET /api/competition/batch/:id` → scrape all comps returned |

---

## 2. What needs to be in place

| Dependency | Notes |
|------------|--------|
| **Strapi + Redis** | Queue **`scrape:grades-batch`** is registered in `config/redis/initializeQueues.js` as `scrapeGradesBatch`. |
| **Bull bridge worker** | Must register `scrape:grades-batch` and map jobs to Python `grades_comps` with `gradesBatchContextId`. Ensure **`QUEUE_WATCH_LIST`** includes this queue in environments that process it (see Python handoff). |
| **CMS route** | **`GET /api/competition/batch/:id`** must be deployed. **`:id`** = Strapi **association** document id (integer). Returns competition rows in the same shape as **`/api/competition/data`** `data[]` (see implementation handoff). |
| **Ingest** | No new ingest route: Python uses existing **`POST /api/competition-grades/ingest`**. |

---

## 3. Endpoint contract

| Property | Value |
|----------|--------|
| **Method** | `POST` |
| **Path** | `/api/competition/trigger-grades-batch-scrape` |
| **Full URL** | `{CMS_BASE_URL}/api/competition/trigger-grades-batch-scrape` |
| **Auth** | None required (`auth: false`). Callable without Bearer token (same pattern as other scrape triggers). |
| **Content-Type** | `application/json` |

---

## 4. Request payload

You must provide **at least one** of **`associationId`** or **`gradesBatchContextId`**.

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `associationId` | Conditional | number | Strapi **association** document id (positive integer). CMS checks the association exists; response uses `gradesBatchContextId = String(associationId)`. |
| `gradesBatchContextId` | Conditional | string | Non-empty after trim. Sent to the worker/Python as the batch context id (URL-encoded when calling **`GET /api/competition/batch/{id}`**). In CMS, this should be the **association id string** (e.g. `"42"`) unless you have a future product use for another key. |
| `runId` | No | string | Default: `cms-grades-batch-{timestamp}`. |
| `jobId` | No | string | Default: `grades-batch:{gradesBatchContextId}:{runId}`. |

**Rules:**

- If **`associationId`** is present (and not empty): it is parsed as a positive integer; if invalid → **400**. If no association row exists → **400** with `Association not found: {id}`.
- If you only pass **`gradesBatchContextId`**, no association row lookup is performed (string is passed through).

### 4.1 TypeScript — request

```typescript
interface TriggerGradesBatchScrapeRequest {
  /** Use this OR gradesBatchContextId — validates association exists in CMS */
  associationId?: number;
  /** Opaque batch key; in CMS = association id string, e.g. "42" */
  gradesBatchContextId?: string;
  runId?: string;
  jobId?: string;
}
```

### 4.2 Example bodies

**Preferred (validated association):**

```json
{
  "associationId": 12
}
```

**Explicit context string (same semantics when id is numeric):**

```json
{
  "gradesBatchContextId": "12"
}
```

**With optional overrides:**

```json
{
  "associationId": 12,
  "runId": "cms-grades-batch-manual-001",
  "jobId": "grades-batch:12:manual-001"
}
```

---

## 5. What the ID is

- **`gradesBatchContextId`** is the value the worker puts on the Bull job for Python. It must match whatever **`GET /api/competition/batch/:id`** expects.
- **In this CMS implementation**, that **`:id`** is the **Strapi association primary key** (document id). Using **`associationId`** in the body is the safest path because CMS confirms the association exists before queueing.

---

## 6. Success response (HTTP 200)

Strapi returns JSON (not wrapped in `{ data: ... }` for this custom route):

```typescript
interface TriggerGradesBatchScrapeSuccessResponse {
  success: true;
  jobId: number;              // Bull queue job id
  runId: string;
  message: string;            // "Grades batch scrape job queued successfully"
  queueName: "scrape:grades-batch";
  gradesBatchContextId: string;
}
```

**Example:**

```json
{
  "success": true,
  "jobId": 18432,
  "runId": "cms-grades-batch-1713312000123",
  "message": "Grades batch scrape job queued successfully",
  "queueName": "scrape:grades-batch",
  "gradesBatchContextId": "12"
}
```

---

## 7. Error responses

Validation and “not found” paths return **400** with a message string (Strapi `badRequest`). Other failures (e.g. Redis enqueue) return **500**.

| HTTP | When |
|------|------|
| **400** | Missing both `associationId` and `gradesBatchContextId` — message: `Provide associationId or gradesBatchContextId` |
| **400** | Invalid `associationId` — e.g. `associationId must be a positive integer` |
| **400** | Unknown association when using `associationId` — `Association not found: {id}` |
| **500** | Queue/Redis error or unexpected server error — message prefix: `Error queueing grades batch scrape: ...` |

**400 example shape:**

```json
{
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "Association not found: 99999"
  }
}
```

---

## 8. Integration checklist

- [ ] Confirm **bull-bridge-worker** watches `scrape:grades-batch` in this environment.
- [ ] Smoke-test: `POST` with a known `associationId`, then confirm worker logs and **`GET /api/competition/batch/{id}`** returns the expected competitions.
- [ ] Confirm grades appear via normal **`/api/competition-grades/ingest`** processing after the scrape.

---

## 9. Code references (this repo)

| Piece | Location |
|-------|----------|
| Trigger handler | `src/api/competition/controllers/handlers/admin/TriggerGradesBatchScrape.js` |
| Controller | `src/api/competition/controllers/competition.js` — `triggerGradesBatchScrape` |
| Route | `src/api/competition/routes/custom-competition.js` — `POST /competition/trigger-grades-batch-scrape` |
| Queue name | `config/redis/initializeQueues.js` — `scrapeGradesBatch` → `scrape:grades-batch` |
| Batch competition list | `src/api/competition/controllers/handlers/production/CompetitionsBatch.js` |
