# Admin Frontend: Trigger Club to Competition Scrape — Button Integration

**From:** CMS (Strapi) Backend Team
**To:** Admin Frontend Team
**Date:** 2026-03-16
**Purpose:** Instructions for integrating the trigger-club-to-competition-scrape endpoint with an onClick button in the admin UI. Includes TypeScript types, request/response contracts, and implementation guidance.

---

## 1. Overview

The admin frontend can trigger a **single-club** scrape by calling `POST /api/club/trigger-club-to-competition-scrape` with `{ clubId }`. The CMS looks up the club, resolves the PlayHQ URL from `club.href`, and enqueues a job to `scrape:club-to-competition`. The bull-bridge-worker picks it up, scrapes the PlayHQ club page, and POSTs the result to the `club-to-competitions` ingest endpoint.

**Use case:** A "Refresh" or "Scrape Club Competitions" button on the club detail page. When clicked, the frontend sends the club ID. The CMS handles URL resolution and queueing.

---

## 2. Endpoint Contract

| Property         | Value                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| **Method**       | POST                                                                  |
| **Path**         | `/api/club/trigger-club-to-competition-scrape`                        |
| **Full URL**     | `{CMS_BASE_URL}/api/club/trigger-club-to-competition-scrape`           |
| **Auth**         | None required (`auth: false`). Can be called without Bearer token.     |
| **Content-Type** | `application/json`                                                    |

---

## 3. Request Payload — TypeScript Types

### 3.1 Full type definition

```typescript
/**
 * Request payload for POST /api/club/trigger-club-to-competition-scrape
 * CMS looks up the club by ID and resolves the URL from club.href.
 */
interface TriggerClubToCompetitionScrapeRequest {
  clubId: number; // Required. Strapi club document ID.
}
```

### 3.2 Required vs optional

| Field   | Required | Type   | Notes                                                                              |
| ------- | -------- | ------ | ---------------------------------------------------------------------------------- |
| `clubId` | **Yes**  | number | Strapi club document ID. Club must exist and have a valid `href` (PlayHQ URL).     |

---

## 4. Response — TypeScript Types

### 4.1 Success response (HTTP 200)

```typescript
interface TriggerClubToCompetitionScrapeSuccessResponse {
  success: boolean; // true
  jobId: number; // Bull queue job ID
  runId: string; // Run identifier (e.g. club-single-1731667200000)
  message: string; // "Club to competition scrape job queued successfully"
  queueName: string; // "scrape:club-to-competition"
}
```

### 4.2 Error responses

| HTTP Status | Body               | Type                                                                              |
| ----------- | ------------------ | --------------------------------------------------------------------------------- |
| **400**     | Strapi error shape | Validation — clubId invalid, club not found, or club has no valid href             |
| **500**     | Strapi error shape | Server/queue error                                                                |

**400 examples:**

```json
{
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "clubId must be a positive integer"
  }
}
```

```json
{
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "Club not found: 999"
  }
}
```

```json
{
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "Club has no href (PlayHQ URL)"
  }
}
```

**500 example:**

```json
{
  "error": {
    "status": 500,
    "name": "InternalServerError",
    "message": "Error queueing club to competition scrape: ..."
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

### 5.1 Minimal (club detail page)

```json
{
  "clubId": 456
}
```

### 5.2 From route/context

When on the club edit/detail page, use the club ID from the route or context:

```json
{
  "clubId": 42
}
```

---

## 6. Button Click Integration — Implementation Guide

### 6.1 High-level flow

1. User is on the club detail/edit page (has `clubId` from route or context).
2. User clicks a button (e.g. "Refresh Club" or "Scrape Club Competitions").
3. On click, call `POST /api/club/trigger-club-to-competition-scrape` with `{ clubId }`.
4. On success (200): show success message with jobId and queueName.
5. On error (4xx/5xx): show error message to the user.

### 6.2 Fetch example (TypeScript/React)

```typescript
const CMS_BASE_URL = process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:1337";

async function triggerClubToCompetitionScrape(
  payload: TriggerClubToCompetitionScrapeRequest
): Promise<TriggerClubToCompetitionScrapeSuccessResponse> {
  const res = await fetch(
    `${CMS_BASE_URL}/api/club/trigger-club-to-competition-scrape`,
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

  return data as TriggerClubToCompetitionScrapeSuccessResponse;
}
```

### 6.3 React button + handler example (club detail page)

```tsx
function TriggerClubToCompetitionScrapeButton({
  clubId,
}: {
  clubId: number;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await triggerClubToCompetitionScrape({ clubId });
      toast.success(
        `Scrape job queued (Job ID: ${result.jobId}, Queue: ${result.queueName})`
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to trigger club to competition scrape"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={handleClick} disabled={loading}>
        {loading ? "Queuing..." : "Refresh Club Competitions"}
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
    const result = await triggerClubToCompetitionScrape({ clubId });
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

| Field        | Validation                                                |
| ------------ | --------------------------------------------------------- |
| `clubId`     | Required. Must be a positive integer.                     |
| Club         | Must exist in CMS.                                        |
| `club.href`  | Must be non-empty and resolve to a valid PlayHQ URL.     |

---

## 8. Summary Table

| Item              | Value                                                                 |
| ----------------- | --------------------------------------------------------------------- |
| **Endpoint**      | `POST {CMS_BASE_URL}/api/club/trigger-club-to-competition-scrape`     |
| **Auth**          | None required                                                         |
| **Request body**  | `TriggerClubToCompetitionScrapeRequest` (JSON, `clubId` required)     |
| **Success**       | 200, `TriggerClubToCompetitionScrapeSuccessResponse`                  |
| **Client errors** | 400 (validation)                                                      |
| **Server errors** | 500                                                                   |

---

## 9. Future: Single-Club Trigger

A single-club trigger (by `clubId`) will be added in a future release. The Data page currently triggers all clubs; the club detail page will gain a per-club "Refresh" button when this is available.

---

## 10. References

- [cms-trigger-club-to-competition.md](./cms-trigger-club-to-competition.md) — Queue spec, Bull payload, worker handoff
- Backend handler: `src/api/club/controllers/handlers/admin/TriggerClubToCompetitionScrape.js`
