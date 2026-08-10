# Admin Frontend: Trigger Grades Comps Single Scrape — Button Integration

**From:** CMS (Strapi) Backend Team  
**To:** Admin Frontend Team  
**Date:** 2026-03-18  
**Purpose:** Instructions for integrating the trigger-grades-comps-single-scrape endpoint with an onClick button in the admin UI. Includes TypeScript types, request/response contracts, and implementation guidance.

---

## 1. Overview

The admin frontend can trigger a **single-competition grades scrape** by calling `POST /api/competition/trigger-grades-comps-single-scrape` with `{ competitionId }`. The CMS looks up the competition, resolves the PlayHQ grades URL from `competition.url`, and enqueues a job to `scrape:grades-comps-single`. The bull-bridge-worker picks it up, scrapes the PlayHQ grades page, and POSTs the result to `/api/competition-grades/ingest`.

**Use case:** A "Scrape Grades" or "Refresh Grades" button on the competition detail page. When clicked, the frontend sends the competition ID. The CMS handles URL resolution and queueing.

---

## 2. Endpoint Contract

| Property         | Value                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| **Method**       | POST                                                                  |
| **Path**         | `/api/competition/trigger-grades-comps-single-scrape`                 |
| **Full URL**     | `{CMS_BASE_URL}/api/competition/trigger-grades-comps-single-scrape`   |
| **Auth**         | None required (`auth: false`). Can be called without Bearer token.    |
| **Content-Type** | `application/json`                                                   |

---

## 3. Request Payload — TypeScript Types

### 3.1 Full type definition

```typescript
/**
 * Request payload for POST /api/competition/trigger-grades-comps-single-scrape
 * CMS looks up the competition by ID and resolves the URL from competition.url.
 */
interface TriggerGradesCompsSingleScrapeRequest {
  competitionId: number; // Required. Strapi competition document ID.
}
```

### 3.2 Required vs optional

| Field           | Required | Type   | Notes                                                                                    |
| --------------- | -------- | ------ | ---------------------------------------------------------------------------------------- |
| `competitionId` | **Yes**  | number | Strapi competition document ID. Competition must exist and have a valid `url` (PlayHQ grades URL). |

---

## 4. Response — TypeScript Types

### 4.1 Success response (HTTP 200)

```typescript
interface TriggerGradesCompsSingleScrapeSuccessResponse {
  success: boolean; // true
  jobId: number; // Bull queue job ID
  runId: string; // Run identifier (e.g. cms-grades-single-1710500000000)
  message: string; // "Single competition grades scrape job queued successfully"
  queueName: string; // "scrape:grades-comps-single"
}
```

### 4.2 Error responses

| HTTP Status | Body               | Type                                                                                    |
| ----------- | ------------------ | --------------------------------------------------------------------------------------- |
| **400**     | Strapi error shape | Validation — competitionId invalid, competition not found, or competition has no url    |
| **500**     | Strapi error shape | Server/queue error                                                                      |

**400 examples:**

```json
{
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "competitionId must be a positive integer"
  }
}
```

```json
{
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "Competition not found: 999"
  }
}
```

```json
{
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "Competition has no url (PlayHQ grades URL)"
  }
}
```

**500 example:**

```json
{
  "error": {
    "status": 500,
    "name": "InternalServerError",
    "message": "Error queueing single competition grades scrape: ..."
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
2. User clicks a button (e.g. "Scrape Grades" or "Refresh Grades").
3. On click, call `POST /api/competition/trigger-grades-comps-single-scrape` with `{ competitionId }`.
4. On success (200): show success message with jobId and queueName.
5. On error (4xx/5xx): show error message to the user.

### 6.2 Fetch example (TypeScript/React)

```typescript
const CMS_BASE_URL = process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:1337";

async function triggerGradesCompsSingleScrape(
  payload: TriggerGradesCompsSingleScrapeRequest
): Promise<TriggerGradesCompsSingleScrapeSuccessResponse> {
  const res = await fetch(
    `${CMS_BASE_URL}/api/competition/trigger-grades-comps-single-scrape`,
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

  return data as TriggerGradesCompsSingleScrapeSuccessResponse;
}
```

### 6.3 React button + handler example (competition detail page)

```tsx
function TriggerGradesCompsSingleScrapeButton({ competitionId }: { competitionId: number }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await triggerGradesCompsSingleScrape({ competitionId });
      toast.success(
        `Scrape job queued (Job ID: ${result.jobId}, Queue: ${result.queueName})`
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to trigger single competition grades scrape"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={handleClick} disabled={loading}>
        {loading ? "Queuing..." : "Scrape Grades"}
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
    const result = await triggerGradesCompsSingleScrape({ competitionId });
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

| Field              | Validation                                                |
| ------------------ | --------------------------------------------------------- |
| `competitionId`    | Required. Must be a positive integer.                     |
| Competition        | Must exist in CMS.                                        |
| `competition.url`  | Must be non-empty (relative or full PlayHQ grades URL).   |

---

## 8. Summary Table

| Item             | Value                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| **Endpoint**     | `POST {CMS_BASE_URL}/api/competition/trigger-grades-comps-single-scrape` |
| **Auth**         | None required                                                         |
| **Request body** | `TriggerGradesCompsSingleScrapeRequest` (JSON, `competitionId` required) |
| **Success**      | 200, `TriggerGradesCompsSingleScrapeSuccessResponse`                  |
| **Client errors**| 400 (validation)                                                      |
| **Server errors**| 500                                                                   |

---

## 9. References

- [cms-trigger-grades-comps-single.md](../../club-to-competition/.comms/cms-trigger-grades-comps-single.md) — Queue spec, Bull payload, worker handoff
- [cms-competition-grades-ingest-python-handoff.md](./cms-competition-grades-ingest-python-handoff.md) — Ingest endpoint
- Backend handler: `src/api/competition/controllers/handlers/admin/TriggerGradesCompsSingleScrape.js`
