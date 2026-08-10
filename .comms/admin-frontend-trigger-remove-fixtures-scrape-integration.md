# Admin Frontend: Trigger remove-fixtures scrape enqueue — integration

**From:** CMS (Strapi) Backend Team  
**To:** Admin Frontend Team  
**Date:** 2026-05-22  
**Purpose:** Call `POST /api/game-meta-data/trigger-remove-fixtures-scrape` to enqueue Bull queue `scrape:remove-fixtures` jobs (`scope: remove_fixtures`). Python checks PlayHQ URLs; CMS **does not** delete fixtures from this endpoint (enqueue-only v1).

**Scraper handoff:** [.comms/Data-Processing/handoff/cms-remove-fixtures-queue-trigger-handoff.md](../../../../.comms/Data-Processing/handoff/cms-remove-fixtures-queue-trigger-handoff.md)

**Infra:** bull-bridge-worker must register `scrape:remove-fixtures` and pass the job body through to Python `/process-job` (not part of this Strapi repo).

---

## 1. Endpoint

| Property     | Value |
| ------------ | ----- |
| Method       | POST |
| Path         | `/api/game-meta-data/trigger-remove-fixtures-scrape` |
| Full URL     | `{CMS_BASE_URL}/api/game-meta-data/trigger-remove-fixtures-scrape` |
| Auth         | None on route (`auth: false`). Protect via network/gateway in production. |
| Content-Type | `application/json` |

---

## 2. Request — TypeScript

```typescript
interface TriggerRemoveFixturesScrapeRequest {
  /** CMS account id (required on job payload for correlation) */
  accountId: number;
  sourceType: "grade" | "competition";
  /** Grade id when `sourceType` is `grade`; competition id when `competition` */
  sourceId: number;
  /** Routes to sport-specific fixture collection; default `cricket` → `game-meta-data` */
  sport?: string;
  /** Overrides default generated run key */
  runId?: string;
  /** Discovery only: no Bull `add` when true */
  dryRun?: boolean;
}
```

---

## 3. Behaviour (server-side)

- Resolves grades: single grade, or every grade under a competition.
- Loads all fixtures on those grades from the sport’s collection (no rolling date filter; unlike result-batch).
- Builds targets with **`id`** = CMS fixture row id and **`url`** = resolved HTTPS PlayHQ URL from `urlToScoreCard`; skips rows without valid **`https`** `playhq.com` / `*.playhq.com` URLs.
- Splits targets into Bull jobs sized by **`REMOVE_FIXTURES_CHUNK_SIZE`** ([`config/remove-fixtures-controls.js`](../../../../config/remove-fixtures-controls.js); default 150, max 250).

---

## 4. Success response (HTTP 200)

```typescript
interface TriggerRemoveFixturesJobRow {
  jobId: string;
  bullJobId: number | string;
  batchIndex: number;
  targetCount: number;
}

interface TriggerRemoveFixturesScrapeSuccessResponse {
  success: true;
  runId: string;
  accountId: number;
  sourceType: "grade" | "competition";
  sourceId: number;
  queueName: "scrape:remove-fixtures";
  targetsDiscovered: number;
  targetsEnqueued: number;
  targetsSkipped: number;
  jobsQueued: number;
  batchTotal: number;
  jobs: TriggerRemoveFixturesJobRow[];
  dryRun?: boolean;
  skipped?: Array<{ cmsFixtureId: number; reason: string }>;
  message: string;
}
```

When no valid targets remain after URL filtering, `jobsQueued` is `0`; response remains **200**.

---

## 5. Errors

| HTTP | When |
| ---- | ---- |
| 400  | Invalid `accountId`, `sourceType`, `sourceId`, unsupported `sport`, grade/competition not found |
| 400  | `accountId` not linked to the association that owns the source grade/competition (expected once CMS validates linkage—confirm with backend) |
| 500  | Queue or server error |

---

## 6. Account resolution — admin frontend (v1)

`accountId` is **association-scoped correlation**, not a field on grade/competition payloads.

Rules:

| Context | Resolve accounts from |
|---------|-------------------------|
| Grade UI | Owning association: grade → competition → association → `/association/admin/:id` → `accounts` |
| Competition UI | Drilldown association: competition admin detail → `association.accounts` |

Selection behaviour:

1. **No linked accounts:** Do not enqueue; disable the trigger and show *No Fixtura account linked to this association*.
2. **Exactly one:** Use that `accountId` (no picker).
3. **Multiple:** Require an explicit picker in the confirm step—no silent default (unless CMS adds a primary/current flag later).
4. CMS should validate `accountId` against the resolved association **before** enqueue (see 400 row above).

Request body remains flat: `accountId` + `sourceType` + `sourceId`.

---

## 7. Operational notes

- Progress: `/dashboard/data` scraper logs; queue name `scrape:remove-fixtures`.
- Enqueue-only v1—Python validates PlayHQ scorecard URLs via jobs; CMS does **not** delete fixtures from this route.
- Re-clicks: new `runId` per call (no CMS-side dedupe of repeated clicks).

---

## 8. Example

```typescript
const CMS_BASE_URL = process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:1337";

async function triggerRemoveFixturesScrape(
  payload: TriggerRemoveFixturesScrapeRequest
) {
  const res = await fetch(
    `${CMS_BASE_URL}/api/game-meta-data/trigger-remove-fixtures-scrape`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof data?.error?.message === "string"
        ? data.error.message
        : `HTTP ${res.status}`
    );
  }
  return data as TriggerRemoveFixturesScrapeSuccessResponse;
}

// Example request
await triggerRemoveFixturesScrape({
  accountId: 42,
  sourceType: "grade",
  sourceId: 71354,
});
```
