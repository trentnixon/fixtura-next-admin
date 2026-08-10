# Admin Frontend: Trigger Grades Lookup Teams Batch Scrape

**From:** CMS (Strapi) Backend Team  
**To:** Admin Frontend Team  
**Date:** 2026-04-17  
**Purpose:** Integrate `POST` trigger for association-scoped **grades lookup teams batch** (Bull queue `scrape:grades-lookup-teams-batch`). Python loads targets from `GET /api/grade-teams/batch/{id}` then runs the same scrape as other `grades_lookup_teams` modes.

**Related:** [Scope-grade-teams-lookup-batch-handoff.md](./response/Scope-grade-teams-lookup-batch-handoff.md), [cms-grade-teams-batch-get-python-handoff.md](./handoff/cms-grade-teams-batch-get-python-handoff.md)

---

## 1. Overview

Call **`POST /api/competition/trigger-grades-lookup-teams-batch-scrape`** (or **`/api/competitions/...`**) with either:

- **`associationId`** — Strapi association document id (recommended for admin UI), or  
- **`gradeTeamsBatchContextId`** — string passed through to the worker (same value as path segment for `GET /api/grade-teams/batch/{id}`; in CMS this is the association id).

The CMS enqueues a job to **`scrape:grades-lookup-teams-batch`**. The bull-bridge-worker runs Python with `gradeTeamsBatchContextId`; Python calls **`GET {CMS}/api/grade-teams/batch/{encodedId}`**, builds targets from `data[]`, scrapes ladders, **`POST /api/grade-teams/response`**.

**Infra:** Ensure the worker environment watches this queue (e.g. `QUEUE_WATCH_LIST` includes `scrape:grades-lookup-teams-batch`).

---

## 2. Endpoint contract

| Property | Value |
|----------|--------|
| **Method** | POST |
| **Paths** | `/api/competition/trigger-grades-lookup-teams-batch-scrape`, `/api/competitions/trigger-grades-lookup-teams-batch-scrape` |
| **Auth** | None required today (`auth: false`). |
| **Content-Type** | `application/json` |

---

## 3. Request payload — TypeScript

```typescript
/**
 * POST /api/competition/trigger-grades-lookup-teams-batch-scrape
 * Provide associationId OR gradeTeamsBatchContextId (not both required; associationId takes precedence when both sent).
 */
interface TriggerGradesLookupTeamsBatchScrapeRequest {
  /** Strapi association id. Validated against api::association.association. */
  associationId?: number;
  /** Opaque batch context; in CMS equals association id string. Use if not resolving association in UI. */
  gradeTeamsBatchContextId?: string;
  /** Optional; default cms-grades-lookup-teams-batch-{timestamp} */
  runId?: string;
  /** Optional; default grades-lookup-teams-batch:{context}:{runId} */
  jobId?: string;
}
```

| Field | Required | Notes |
|-------|----------|--------|
| `associationId` | One of associationId **or** gradeTeamsBatchContextId | Positive integer; 404-style message if association missing. |
| `gradeTeamsBatchContextId` | (alternative) | Non-empty after trim. |

If neither is usable: **400** — `Provide associationId or gradeTeamsBatchContextId`.

---

## 4. Success response (200)

```typescript
interface TriggerGradesLookupTeamsBatchScrapeSuccessResponse {
  success: boolean;
  jobId: number | string;
  runId: string;
  message: string;
  queueName: "scrape:grades-lookup-teams-batch";
  gradeTeamsBatchContextId: string;
}
```

---

## 5. Errors

| Status | Typical message |
|--------|------------------|
| **400** | `associationId must be a positive integer`, `Association not found: {id}`, `Provide associationId or gradeTeamsBatchContextId` |
| **500** | Queue / server failure |

---

## 6. Example bodies

**By association (typical admin):**

```json
{ "associationId": 42 }
```

**By context string:**

```json
{ "gradeTeamsBatchContextId": "42" }
```

---

## 7. Backend references

- Queue: [`config/redis/initializeQueues.js`](../../../../config/redis/initializeQueues.js) — `scrapeGradesLookupTeamsBatch`
- Handler: [`TriggerGradesLookupTeamsBatchScrape.js`](../../competition/controllers/handlers/admin/TriggerGradesLookupTeamsBatchScrape.js)
- Routes: [`01-custom-competition.js`](../../competition/routes/01-custom-competition.js)
