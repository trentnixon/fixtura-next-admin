# Admin Frontend: Trigger result-batch scrape — integration

**From:** CMS (Strapi) Backend Team  
**To:** Admin Frontend Team  
**Date:** 2026-05-20  
**Purpose:** Call `POST /api/game-meta-data/trigger-result-batch-scrape` from an admin control (“Scrape results for grade” / “Scrape results for competition”) to enqueue Bull queue `scrape:result-batch` jobs (max five fixtures per job). Python scrapes each target and writes back via the existing single-fixture ingest contract.

**Scraper / worker handoff:** [.comms/Data-Processing/handoff/cms-result-batch-scope-handoff.md](../../../../.comms/Data-Processing/handoff/cms-result-batch-scope-handoff.md)

---

## 1. Endpoint

| Property     | Value |
| ------------ | ----- |
| Method       | POST |
| Path         | `/api/game-meta-data/trigger-result-batch-scrape` |
| Full URL     | `{CMS_BASE_URL}/api/game-meta-data/trigger-result-batch-scrape` |
| Auth         | None on route (`auth: false`). Protect via network/gateway in production. |
| Content-Type | `application/json` |

---

## 2. Request — TypeScript

```typescript
interface TriggerResultBatchScrapeRequest {
  sourceType: "grade" | "competition";
  /** Strapi grade id when `sourceType` is `grade`; competition id when `competition` */
  sourceId: number;
  /** Default `cricket` (lowercase in queue payload) */
  sport?: string;
  /** Pass-through to job `options.dryRun` (default false) */
  dryRun?: boolean;
}
```

`sourceId` must be a positive integer.

**Fixture window (server-side):** CMS selects fixtures with the sport’s date field between **today minus `RESULT_BATCH_DAYS_BACK`** and **today** (default **14** days; Strapi env / [`config/result-batch-controls.js`](../../../../config/result-batch-controls.js)). Only fixtures that are “resultable” (same rules as `GET /fixture-results/grade/:gradeId/targets`) and have a valid PlayHQ **game-centre** URL are enqueued; others are counted in `targetsSkipped` / `skipped`.

---

## 3. Success response (HTTP 200)

```typescript
interface TriggerResultBatchJobRow {
  jobId: string;
  bullJobId: number | string;
  batchIndex: number;
  targetCount: number;
}

interface TriggerResultBatchScrapeSuccessResponse {
  success: true;
  runId: string;
  sourceType: "grade" | "competition";
  sourceId: number;
  queueName: "scrape:result-batch";
  daysBack: number;
  /** Resultable fixtures found before URL filtering */
  targetsDiscovered: number;
  /** Valid targets actually placed on Bull jobs */
  targetsEnqueued: number;
  /** Fixtures skipped (e.g. missing/invalid game-centre URL) */
  targetsSkipped: number;
  jobsQueued: number;
  batchTotal: number;
  jobs: TriggerResultBatchJobRow[];
  skipped?: Array<{ cmsFixtureId: number; reason: string }>;
  message: string;
}
```

When no fixtures match or all are skipped, `jobsQueued` is `0` and the response is still **200**.

---

## 4. Errors

| HTTP | When |
| ---- | ---- |
| 400  | Invalid `sourceType`, invalid `sourceId`, unsupported `sport`, grade or competition not found |
| 500  | Queue or server error |

---

## 5. Example

```typescript
const CMS_BASE_URL = process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:1337";

async function triggerResultBatchScrape(
  payload: TriggerResultBatchScrapeRequest
): Promise<TriggerResultBatchScrapeSuccessResponse> {
  const res = await fetch(
    `${CMS_BASE_URL}/api/game-meta-data/trigger-result-batch-scrape`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message ?? res.statusText);
  return data as TriggerResultBatchScrapeSuccessResponse;
}

await triggerResultBatchScrape({
  sourceType: "grade",
  sourceId: 12345,
  sport: "cricket",
});
```

---

## 6. Operational notes

- **Progress:** There is no combined batch ingest; each fixture updates via `POST /fixture-results/ingest`. Poll `scorecards.v1.scrapedAt` or scraper logs (`CMS_PUBLIC_URL` / `STRAPI_PUBLIC_URL` sets `cms.logUrl` on each job).
- **Duration:** Batch jobs can take on the order of tens of seconds per chunk (see scope handoff smoke notes).
- **Re-clicks:** Each call uses a new `runId` (timestamp); jobs are not deduped at CMS beyond Bull `jobId` per chunk.
