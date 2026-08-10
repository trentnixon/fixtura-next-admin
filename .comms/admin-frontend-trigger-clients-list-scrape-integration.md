# Admin Frontend: Trigger Clients List Scrape — Button Integration

**From:** CMS (Strapi) Backend Team  
**To:** Admin Frontend Team  
**Date:** 2026-03-09  
**Purpose:** Instructions for integrating the trigger-clients-list-scrape endpoint with a button click in the admin UI. Includes full TypeScript types, request/response contracts, and implementation guidance.

---

## 1. Overview

The admin frontend can trigger a `clients_list` scrape by calling `POST /api/data-collection/trigger-clients-list-scrape`. This enqueues a job to the Redis queue `scrape:clients-list`. The Fixtura worker picks it up, runs the Python scraper, and POSTs scraped clubs/associations to the `client-list-queue` collection.

**Use case:** A button in the admin UI (e.g. "Trigger Clients List Scrape" or "Run Clubs/Associations Scrape") that, when clicked, sends a payload to the CMS. The job is queued and processed asynchronously by the scraper worker.

---

## 2. Endpoint Contract

| Property | Value |
|----------|-------|
| **Method** | POST |
| **Path** | `/api/data-collection/trigger-clients-list-scrape` |
| **Full URL** | `{CMS_BASE_URL}/api/data-collection/trigger-clients-list-scrape` |
| **Auth** | None required (`auth: false`). Can be called without Bearer token. |
| **Content-Type** | `application/json` |

---

## 3. Request Payload — TypeScript Types

### 3.1 Full type definitions

```typescript
/**
 * A single target URL for the scraper (Option B: explicit targets)
 */
interface ScrapeTarget {
  fixtureKey: string;  // e.g. "cricket-australia", "afl-australia"
  url: string;          // e.g. "https://www.playhq.com/cricket-australia"
}

/**
 * Scrape options
 */
interface ScrapeOptions {
  dryRun?: boolean;       // Default: false
  playhqMaxPages?: number; // 0 = unlimited, 1–2 for testing
}

/**
 * Request payload for POST /api/data-collection/trigger-clients-list-scrape
 * All fields are optional. CMS applies defaults for omitted fields.
 */
interface TriggerClientsListScrapeRequest {
  accountId?: number | null;  // Optional. Include if scraping for a specific account
  jobId?: string;             // Optional. Default: strapi:${Date.now()}
  runId?: string;             // Optional. Default: cron-YYYY-MM-DD
  kind?: string;              // Optional. Must be "account" if provided
  scope?: string;             // Optional. Must be "clients_list" if provided
  targets?: ScrapeTarget[];   // Optional. Empty = all from config (Option A)
  options?: ScrapeOptions;    // Optional. Default: { dryRun: false, playhqMaxPages: 0 }
}
```

### 3.2 Required vs optional

| Field | Required | Type | Default | Notes |
|-------|----------|------|---------|-------|
| `accountId` | No | number \| null | — | Omit if not scraping for a specific account |
| `jobId` | No | string | `strapi:${Date.now()}` | Unique job identifier |
| `runId` | No | string | `cron-YYYY-MM-DD` | Run identifier |
| `kind` | No | string | `"account"` | Must be `"account"` if provided |
| `scope` | No | string | `"clients_list"` | Must be `"clients_list"` if provided |
| `targets` | No | array | `[]` | Empty = all targets from config (Option A). Non-empty = explicit URLs (Option B) |
| `options` | No | object | `{ dryRun: false, playhqMaxPages: 0 }` | Scrape behaviour |

---

## 4. Response — TypeScript Types

### 4.1 Success response (HTTP 200)

```typescript
interface TriggerClientsListScrapeSuccessResponse {
  success: boolean;   // true
  jobId: number;      // Bull queue job ID
  runId: string;      // Run identifier (echoed from request or default)
  message: string;    // "Clients list scrape job queued successfully"
  queueName: string;  // "scrape:clients-list"
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
    "message": "scope must be \"clients_list\""
  }
}
```

**500 example:**
```json
{
  "error": {
    "status": 500,
    "name": "InternalServerError",
    "message": "Error queueing clients list scrape: ..."
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

### 5.1 Minimal (empty body — all defaults)

```json
{}
```

Uses: `jobId: strapi:${Date.now()}`, `runId: cron-YYYY-MM-DD`, `targets: []`, `options: { dryRun: false, playhqMaxPages: 0 }`. Scrapes **all** targets from scraper config.

### 5.2 Option A: Empty targets (all from config)

```json
{
  "targets": [],
  "options": { "dryRun": false, "playhqMaxPages": 0 }
}
```

### 5.3 Option B: Explicit targets (specific URLs only)

```json
{
  "jobId": "strapi:1739000000000",
  "runId": "cron-2026-03-09",
  "targets": [
    {
      "fixtureKey": "cricket-australia",
      "url": "https://www.playhq.com/cricket-australia"
    },
    {
      "fixtureKey": "afl-australia",
      "url": "https://www.playhq.com/afl"
    }
  ],
  "options": { "dryRun": false, "playhqMaxPages": 2 }
}
```

### 5.4 With accountId

```json
{
  "accountId": 675,
  "targets": [],
  "options": { "dryRun": false, "playhqMaxPages": 0 }
}
```

---

## 6. Button Click Integration — Implementation Guide

### 6.1 High-level flow

1. User clicks a button (e.g. "Trigger Clients List Scrape" or "Run Clubs/Associations Scrape").
2. Optionally show a form/modal to collect: accountId, targets, options. Or use defaults for a quick trigger.
3. On submit, call `POST /api/data-collection/trigger-clients-list-scrape` with the payload.
4. On success (200): show success message with jobId and queueName.
5. On error (4xx/5xx): show error message to the user.

### 6.2 Fetch example (TypeScript/React)

```typescript
const CMS_BASE_URL = process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:1337";

async function triggerClientsListScrape(
  payload: TriggerClientsListScrapeRequest = {}
): Promise<TriggerClientsListScrapeSuccessResponse> {
  const res = await fetch(
    `${CMS_BASE_URL}/api/data-collection/trigger-clients-list-scrape`,
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

  return data as TriggerClientsListScrapeSuccessResponse;
}
```

### 6.3 React button + handler example

```tsx
function TriggerClientsListScrapeButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    const payload: TriggerClientsListScrapeRequest = {
      targets: [],
      options: { dryRun: false, playhqMaxPages: 0 },
    };

    try {
      const result = await triggerClientsListScrape(payload);
      toast.success(
        `Scrape job queued (Job ID: ${result.jobId}, Queue: ${result.queueName})`
      );
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to trigger clients list scrape"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={handleClick} disabled={loading}>
        {loading ? "Queuing..." : "Trigger Clients List Scrape"}
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
    const result = await triggerClientsListScrape({});
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
|-------|------------|
| `scope` | If provided, must be `"clients_list"` |
| `kind` | If provided, must be `"account"` |
| `targets` | Must be array if provided (can be empty) |
| `accountId` | If provided, must be positive integer (otherwise omitted from job) |

---

## 8. Summary Table

| Item | Value |
|------|-------|
| **Endpoint** | `POST {CMS_BASE_URL}/api/data-collection/trigger-clients-list-scrape` |
| **Auth** | None required |
| **Request body** | `TriggerClientsListScrapeRequest` (JSON, all fields optional) |
| **Success** | 200, `TriggerClientsListScrapeSuccessResponse` |
| **Client errors** | 400 (validation) |
| **Server errors** | 500 |

---

## 9. References

- [cms-trigger-clients-list-scrape-via-redis.md](../src/api/data-collection/.comms/cms-trigger-clients-list-scrape-via-redis.md) — Queue spec, job payload, Python scraper handoff
- Backend handler: `src/api/data-collection/controllers/handler/admin/triggerClientsListScrape.js`
