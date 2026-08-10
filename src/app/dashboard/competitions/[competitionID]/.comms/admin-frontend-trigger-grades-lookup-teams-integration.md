# Admin Frontend: Trigger Grades Lookup Teams Scrape — Button Integration

**From:** CMS (Strapi) Backend Team  
**To:** Admin Frontend Team  
**Date:** 2026-03-18  
**Purpose:** Instructions for integrating the trigger-grades-lookup-teams-scrape endpoint with an onClick button in the admin UI. Triggers a **full run** — all grades in the system. Optionally supports scraping specific grades only.

---

## 1. Overview

The admin frontend can trigger a **grade-teams scrape** by calling `POST /api/grade-teams/trigger-grades-lookup-teams-scrape`. The CMS enqueues a job to the Redis queue `scrape:grades-lookup-teams`. The bull-bridge-worker picks it up, calls the Python scraper, which fetches grades from CMS (recon + data endpoints), scrapes each PlayHQ ladder page for teams, and POSTs results to `/api/grade-teams/response`.

**Use case:** A "Scrape All Grade Teams" or "Refresh Grade Teams" button (e.g. on a grades list page or admin dashboard). When clicked, the frontend sends an empty body `{}`. The CMS handles queueing; Python fetches all grades from CMS and scrapes each grade's ladder page for teams.

**Full run (default):** Empty `targets: []` — Python fetches all grades from CMS and scrapes each grade's ladder page for teams.

**Direct targets:** Provide `targets` with specific grades — useful when you want to scrape only one or a few grades (e.g. after creating or updating a grade).

---

## 2. Endpoint Contract

| Property | Value |
|----------|-------|
| **Method** | POST |
| **Path** | `/api/grade-teams/trigger-grades-lookup-teams-scrape` |
| **Full URL** | `{CMS_BASE_URL}/api/grade-teams/trigger-grades-lookup-teams-scrape` |
| **Auth** | None required (`auth: false`). Can be called without Bearer token. |
| **Content-Type** | `application/json` |

---

## 3. Request Payload — TypeScript Types

### 3.1 Full type definitions

```typescript
/**
 * A single grade target for direct scraping (optional).
 * Use when you want to scrape specific grades instead of all.
 */
interface GradesLookupTeamsTarget {
  fixtureKey: string;   // PlayHQ grade ID (e.g. "36eec9ac")
  fixtureId?: string;  // Same as fixtureKey if omitted
  url: string;          // Full PlayHQ ladder page URL (grade URL + /ladder)
  strapiId: number;     // Strapi grade document ID — required for ingest correlation
  competitionStrapiID?: number;  // Strapi competition document ID — parent competition
}

/**
 * Scrape options
 */
interface GradesLookupTeamsOptions {
  dryRun?: boolean;       // Default: false
  skipAccountSlot?: boolean; // Default: true
  jobMaxConcurrency?: number; // Default: 2
}

/**
 * Request payload for POST /api/grade-teams/trigger-grades-lookup-teams-scrape
 * All fields are optional. CMS applies defaults for omitted fields.
 */
interface TriggerGradesLookupTeamsScrapeRequest {
  jobId?: string;             // Optional. Default: grade-teams:${Date.now()}
  runId?: string;             // Optional. Default: cms-grade-teams-YYYY-MM-DD
  kind?: string;             // Optional. Must be "account" if provided
  scope?: string;            // Optional. Must be "grades_lookup_teams" if provided
  targets?: GradesLookupTeamsTarget[]; // Optional. Empty or omit = full run (all grades from CMS)
  options?: GradesLookupTeamsOptions;   // Optional
}
```

### 3.2 Required vs optional

| Field | Required | Type | Default | Notes |
|-------|----------|------|---------|-------|
| `jobId` | No | string | `grade-teams:${Date.now()}` | Unique job identifier |
| `runId` | No | string | `cms-grade-teams-YYYY-MM-DD` | Run identifier |
| `kind` | No | string | `"account"` | Must be `"account"` if provided |
| `scope` | No | string | `"grades_lookup_teams"` | Must be `"grades_lookup_teams"` if provided |
| `targets` | No | array | `[]` | Empty = full run. Non-empty = scrape only these grades |
| `options` | No | object | `{ dryRun: false, skipAccountSlot: true, jobMaxConcurrency: 2 }` | Scrape behaviour |

---

## 4. Response — TypeScript Types

### 4.1 Success response (HTTP 200)

```typescript
interface TriggerGradesLookupTeamsScrapeSuccessResponse {
  success: boolean;   // true
  jobId: number;      // Bull queue job ID
  runId: string;      // Run identifier (echoed from request or default)
  message: string;   // "Grades lookup teams scrape job queued successfully"
  queueName: string;  // "scrape:grades-lookup-teams"
}
```

### 4.2 Error responses

| HTTP Status | Body | Type |
|-------------|------|------|
| **400** | Strapi error shape | Validation error — e.g. scope/kind invalid |
| **500** | Strapi error shape | Server/queue error |

**400 example:**
```json
{
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "scope must be \"grades_lookup_teams\""
  }
}
```

**500 example:**
```json
{
  "error": {
    "status": 500,
    "name": "InternalServerError",
    "message": "Failed to trigger grades lookup teams scrape"
  }
}
```

### 4.3 Error response type (for handling)

```typescript
interface StrapiErrorResponse {
  error?: {
    status: number;
    name: string;
    message: string;
  };
}
```

---

## 5. Example Request Bodies

### 5.1 Minimal (empty body — recommended for full run)

```json
{}
```

Uses: `jobId: grade-teams:${Date.now()}`, `runId: cms-grade-teams-YYYY-MM-DD`, `targets: []`, `options: { dryRun: false, skipAccountSlot: true, jobMaxConcurrency: 2 }`. Scrapes **all** grades from CMS.

### 5.2 Full run with optional overrides

```json
{
  "targets": [],
  "options": {
    "dryRun": false,
    "skipAccountSlot": true,
    "jobMaxConcurrency": 3
  }
}
```

### 5.3 Direct targets (single grade)

```json
{
  "jobId": "grade-teams-single:1731667200000",
  "runId": "cms-grade-teams-single-001",
  "targets": [
    {
      "fixtureKey": "36eec9ac",
      "fixtureId": "36eec9ac",
      "url": "https://www.playhq.com/new-zealand-cricket/org/christchurch-metro-cricket-associationcjca/cmca-youth-boys-2025/jurgens-demolition-premier-1/36eec9ac/ladder",
      "strapiId": 41194,
      "competitionStrapiID": 13093
    }
  ],
  "options": {
    "skipAccountSlot": true
  }
}
```

### 5.4 Direct targets (multiple grades)

```json
{
  "targets": [
    {
      "fixtureKey": "36eec9ac",
      "url": "https://www.playhq.com/.../36eec9ac/ladder",
      "strapiId": 41194,
      "competitionStrapiID": 13093
    },
    {
      "fixtureKey": "abc12345",
      "url": "https://www.playhq.com/.../abc12345/ladder",
      "strapiId": 41200,
      "competitionStrapiID": 13093
    }
  ]
}
```

---

## 6. Button Click Integration — Implementation Guide

### 6.1 High-level flow

1. User clicks a button (e.g. "Scrape All Grade Teams" or "Refresh Grade Teams").
2. Optionally show a form/modal to collect: targets (for specific grades), options. Or use defaults for a quick full run.
3. On submit, call `POST /api/grade-teams/trigger-grades-lookup-teams-scrape` with the payload.
4. On success (200): show success message with jobId and queueName.
5. On error (4xx/5xx): show error message to the user.

### 6.2 Fetch example (TypeScript/React)

```typescript
const CMS_BASE_URL = process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:1337";

async function triggerGradesLookupTeamsScrape(
  payload: TriggerGradesLookupTeamsScrapeRequest = {}
): Promise<TriggerGradesLookupTeamsScrapeSuccessResponse> {
  const res = await fetch(
    `${CMS_BASE_URL}/api/grade-teams/trigger-grades-lookup-teams-scrape`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    const msg =
      data?.error?.message ?? data?.message ?? `Request failed: ${res.status}`;
    throw new Error(msg);
  }

  return data as TriggerGradesLookupTeamsScrapeSuccessResponse;
}
```

### 6.3 React button + handler example (full run)

```tsx
function TriggerGradesLookupTeamsScrapeButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await triggerGradesLookupTeamsScrape({});
      toast.success(
        `Grade teams scrape job queued (Job ID: ${result.jobId}, Queue: ${result.queueName})`
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to trigger grades lookup teams scrape"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={handleClick} disabled={loading}>
        {loading ? "Queuing..." : "Scrape All Grade Teams"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
}
```

### 6.4 Minimal one-click (no form)

```tsx
const handleClick = async () => {
  setLoading(true);
  try {
    const result = await triggerGradesLookupTeamsScrape({});
    toast.success(`Job ${result.jobId} queued to ${result.queueName}`);
  } catch (e) {
    toast.error(e instanceof Error ? e.message : "Failed");
  } finally {
    setLoading(false);
  }
};
```

### 6.5 Handling the response

| Scenario | Action |
|----------|--------|
| **Success (200)** | Show `result.message` or a custom success message. Optionally display `result.jobId` and `result.runId` for traceability. |
| **400 Bad Request** | Show `data?.error?.message` to the user (e.g. invalid scope or kind). |
| **500 Internal Server Error** | Show a generic "Something went wrong" or `data?.error?.message`. Consider retry or support contact. |
| **Network error** | Show "Unable to connect" or similar. |

---

## 7. Validation Rules (Server-Side)

| Field | Validation |
|-------|------------|
| `scope` (if sent) | Must be `"grades_lookup_teams"` |
| `kind` (if sent) | Must be `"account"` |
| `targets` (if sent) | Must be array if provided (can be empty) |
| `targets[].fixtureKey` | Required when using direct targets |
| `targets[].url` | Required when using direct targets |
| `targets[].strapiId` | Required when using direct targets |
| `targets[].fixtureId` | Optional; defaults to fixtureKey |
| `targets[].competitionStrapiID` | Optional; recommended for relational integrity |

---

## 8. What Happens After the Request

1. **CMS** enqueues the job to Redis queue `scrape:grades-lookup-teams`.
2. **Bull-bridge-worker** picks up the job and forwards to Python scraper.
3. **Python (full run):** Calls `GET /api/grade-teams/recon` and `GET /api/grade-teams/data` to fetch all grades from CMS.
4. **Python (direct targets):** Uses the provided `targets` as-is.
5. **Python** scrapes each grade's PlayHQ ladder page for teams.
6. **Python** POSTs each result to `POST /api/grade-teams/response`.
7. **CMS** processes the response (creates/updates team records linked to grade).

---

## 9. Summary Table

| Item | Value |
|------|-------|
| **Endpoint** | `POST {CMS_BASE_URL}/api/grade-teams/trigger-grades-lookup-teams-scrape` |
| **Auth** | None required |
| **Request body** | `{}` or optional overrides — no ID required for full run |
| **Success** | 200, `TriggerGradesLookupTeamsScrapeSuccessResponse` |
| **Client errors** | 400 (validation) |
| **Server errors** | 500 |

---

## 10. References

- [cms-trigger-grades-lookup-teams-redis-queue.md](./cms-trigger-grades-lookup-teams-redis-queue.md) — Queue spec, Bull payload, worker handoff
- [cms-grade-teams-recon-and-data-endpoints-python-handoff.md](./cms-grade-teams-recon-and-data-endpoints-python-handoff.md) — Recon + data endpoints
- [cms-grade-teams-response-endpoint-python-handoff.md](./cms-grade-teams-response-endpoint-python-handoff.md) — Response endpoint (ingest)
- Backend handler: `src/api/grade-teams/controllers/handlers/admin/TriggerGradesLookupTeamsScrape.js`
