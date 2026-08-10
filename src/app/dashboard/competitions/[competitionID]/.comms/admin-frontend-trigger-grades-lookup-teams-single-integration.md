# Admin Frontend: Trigger Grades Lookup Teams Single Scrape — Button Integration

**From:** CMS (Strapi) Backend Team  
**To:** Admin Frontend Team  
**Date:** 2026-03-18  
**Purpose:** Instructions for integrating the trigger-grades-lookup-teams-single-scrape endpoint with an onClick button in the admin UI. Includes TypeScript types, request/response contracts, and implementation guidance.

---

## 1. Overview

The admin frontend can trigger a **single-competition grades-teams scrape** by calling `POST /api/competition/trigger-grades-lookup-teams-single-scrape` with `{ competitionId }`. The CMS enqueues a job to `scrape:grades-lookup-teams-single`. The bull-bridge-worker picks it up, Python fetches grades from CMS via `GET /api/grade-teams/by-competition`, scrapes each grade's ladder page for teams, and POSTs results to `/api/grade-teams/response`.

**Use case:** A "Scrape Teams" or "Refresh Teams" button on the competition detail page. When clicked, the frontend sends the competition ID. The CMS handles queueing; Python fetches grades for that competition and scrapes each grade's ladder for teams.

---

## 2. Endpoint Contract

| Property | Value |
|----------|-------|
| **Method** | POST |
| **Path** | `/api/competition/trigger-grades-lookup-teams-single-scrape` |
| **Full URL** | `{CMS_BASE_URL}/api/competition/trigger-grades-lookup-teams-single-scrape` |
| **Auth** | None required (`auth: false`). Can be called without Bearer token. |
| **Content-Type** | `application/json` |

---

## 3. Request Payload — TypeScript Types

### 3.1 Full type definition

```typescript
/**
 * Request payload for POST /api/competition/trigger-grades-lookup-teams-single-scrape
 * Python fetches grades for this competition from CMS, then scrapes each grade's ladder for teams.
 */
interface TriggerGradesLookupTeamsSingleScrapeRequest {
  competitionId: number; // Required. Strapi competition document ID.
}
```

### 3.2 Required vs optional

| Field | Required | Type | Notes |
|-------|----------|------|-------|
| `competitionId` | **Yes** | number | Strapi competition document ID. Python fetches grades via GET /api/grade-teams/by-competition. |

---

## 4. Response — TypeScript Types

### 4.1 Success response (HTTP 200)

```typescript
interface TriggerGradesLookupTeamsSingleScrapeSuccessResponse {
  success: boolean; // true
  jobId: number; // Bull queue job ID
  runId: string; // Run identifier (e.g. cms-grades-lookup-teams-single-1710500000000)
  message: string; // "Single competition grades lookup teams scrape job queued successfully"
  queueName: string; // "scrape:grades-lookup-teams-single"
}
```

### 4.2 Error responses

| HTTP Status | Body | Type |
|-------------|------|------|
| **400** | Strapi error shape | Validation — competitionId invalid or missing |
| **500** | Strapi error shape | Server/queue error |

**400 examples:**

```json
{
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "competitionId is required"
  }
}
```

```json
{
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "competitionId must be a positive integer"
  }
}
```

**500 example:**

```json
{
  "error": {
    "status": 500,
    "name": "InternalServerError",
    "message": "Error queueing grades lookup teams single scrape: ..."
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

### 5.1 Minimal (competition detail page)

```json
{
  "competitionId": 13093
}
```

### 5.2 From route/context

When on the competition edit/detail page, use the competition ID from the route or context:

```json
{
  "competitionId": 42
}
```

---

## 6. Button Click Integration — Implementation Guide

### 6.1 High-level flow

1. User is on the competition detail/edit page (has `competitionId` from route or context).
2. User clicks a button (e.g. "Scrape Teams" or "Refresh Teams").
3. On click, call `POST /api/competition/trigger-grades-lookup-teams-single-scrape` with `{ competitionId }`.
4. On success (200): show success message with jobId and queueName.
5. On error (4xx/5xx): show error message to the user.

### 6.2 Fetch example (TypeScript/React)

```typescript
const CMS_BASE_URL = process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:1337";

async function triggerGradesLookupTeamsSingleScrape(
  payload: TriggerGradesLookupTeamsSingleScrapeRequest
): Promise<TriggerGradesLookupTeamsSingleScrapeSuccessResponse> {
  const res = await fetch(
    `${CMS_BASE_URL}/api/competition/trigger-grades-lookup-teams-single-scrape`,
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

  return data as TriggerGradesLookupTeamsSingleScrapeSuccessResponse;
}
```

### 6.3 React button + handler example (competition detail page)

```tsx
function TriggerGradesLookupTeamsSingleScrapeButton({
  competitionId,
}: {
  competitionId: number;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await triggerGradesLookupTeamsSingleScrape({ competitionId });
      toast.success(
        `Scrape job queued (Job ID: ${result.jobId}, Queue: ${result.queueName})`
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
        {loading ? "Queuing..." : "Scrape Teams"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
}
```

### 6.4 Minimal one-click

```tsx
const handleClick = async () => {
  setLoading(true);
  try {
    const result = await triggerGradesLookupTeamsSingleScrape({ competitionId });
    toast.success(`Job ${result.jobId} queued to ${result.queueName}`);
  } catch (e) {
    toast.error(e instanceof Error ? e.message : "Failed");
  } finally {
    setLoading(false);
  }
};
```

---

## 7. Validation Rules (Server-Side)

| Field | Validation |
|-------|-------------|
| `competitionId` | Required. Must be a positive integer. |

---

## 8. Summary Table

| Item | Value |
|------|-------|
| **Endpoint** | `POST {CMS_BASE_URL}/api/competition/trigger-grades-lookup-teams-single-scrape` |
| **Auth** | None required |
| **Request body** | `TriggerGradesLookupTeamsSingleScrapeRequest` (JSON, `competitionId` required) |
| **Success** | 200, `TriggerGradesLookupTeamsSingleScrapeSuccessResponse` |
| **Client errors** | 400 (validation) |
| **Server errors** | 500 |

---

## 9. References

- [cms-trigger-grades-lookup-teams-single.md](./cms-trigger-grades-lookup-teams-single.md) — Queue spec, Bull payload, worker handoff
- [cms-grade-teams-by-competition-request.md](./cms-grade-teams-by-competition-request.md) — Endpoint Python uses to fetch grades
- [cms-grade-teams-response-endpoint-python-handoff.md](./cms-grade-teams-response-endpoint-python-handoff.md) — Ingest endpoint
- Backend handler: `src/api/competition/controllers/handlers/admin/TriggerGradesLookupTeamsSingleScrape.js`
