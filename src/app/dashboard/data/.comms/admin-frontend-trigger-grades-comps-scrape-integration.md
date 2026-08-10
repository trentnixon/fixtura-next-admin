# Admin Frontend: Trigger Grades Comps Scrape — Button Integration

**From:** CMS (Strapi) Backend Team  
**To:** Admin Frontend Team  
**Date:** 2026-03-17  
**Purpose:** Instructions for integrating the trigger-grades-comps-scrape endpoint with an onClick button in the admin UI. Triggers a **full run** — all competitions in the system. Optionally supports scraping specific competitions only.

---

## 1. Overview

The admin frontend can trigger a **grades scrape** by calling `POST /api/competition/trigger-grades-comps-scrape`. The CMS enqueues a job to the Redis queue `scrape:grades-comps`. The bull-bridge-worker picks it up, calls the Python scraper, which fetches competitions from CMS (recon + data endpoints), scrapes each PlayHQ grades page, and POSTs results to `/api/competition-grades/ingest`.

**Use case:** A "Scrape All Grades" or "Refresh Competition Grades" button (e.g. on a competitions list page or admin dashboard). When clicked, the frontend sends an empty body `{}`. The CMS handles queueing; Python fetches all competitions from CMS and scrapes their grades pages.

**Full run (default):** Empty `targets: []` — Python fetches all competitions from CMS and scrapes each competition's grades page.

**Direct targets:** Provide `targets` with specific competitions — useful when you want to scrape only one or a few competitions (e.g. after creating a new competition).

---

## 2. Endpoint Contract

| Property | Value |
|----------|-------|
| **Method** | POST |
| **Path** | `/api/competition/trigger-grades-comps-scrape` |
| **Full URL** | `{CMS_BASE_URL}/api/competition/trigger-grades-comps-scrape` |
| **Auth** | None required (`auth: false`). Can be called without Bearer token. |
| **Content-Type** | `application/json` |

---

## 3. Request Payload — TypeScript Types

### 3.1 Full type definitions

```typescript
/**
 * A single competition target for direct scraping (optional).
 * Use when you want to scrape specific competitions instead of all.
 */
interface GradesCompsTarget {
  fixtureKey: string;   // PlayHQ competition ID (e.g. "9fcb396f")
  fixtureId?: string;  // Same as fixtureKey if omitted
  url: string;          // Full PlayHQ grades page URL
  strapiId: number;     // Strapi competition document ID — required for ingest correlation
}

/**
 * Scrape options
 */
interface GradesCompsOptions {
  dryRun?: boolean;       // Default: false
  skipAccountSlot?: boolean; // Default: true
  jobMaxConcurrency?: number; // Default: 2
}

/**
 * Request payload for POST /api/competition/trigger-grades-comps-scrape
 * All fields are optional. CMS applies defaults for omitted fields.
 */
interface TriggerGradesCompsScrapeRequest {
  jobId?: string;             // Optional. Default: grades:${Date.now()}
  runId?: string;             // Optional. Default: cms-grades-YYYY-MM-DD
  kind?: string;             // Optional. Must be "account" if provided
  scope?: string;            // Optional. Must be "grades_comps" if provided
  targets?: GradesCompsTarget[]; // Optional. Empty or omit = full run (all competitions from CMS)
  options?: GradesCompsOptions;   // Optional
}
```

### 3.2 Required vs optional

| Field | Required | Type | Default | Notes |
|-------|----------|------|---------|-------|
| `jobId` | No | string | `grades:${Date.now()}` | Unique job identifier |
| `runId` | No | string | `cms-grades-YYYY-MM-DD` | Run identifier |
| `kind` | No | string | `"account"` | Must be `"account"` if provided |
| `scope` | No | string | `"grades_comps"` | Must be `"grades_comps"` if provided |
| `targets` | No | array | `[]` | Empty = full run. Non-empty = scrape only these competitions |
| `options` | No | object | `{ dryRun: false, skipAccountSlot: true, jobMaxConcurrency: 2 }` | Scrape behaviour |

---

## 4. Response — TypeScript Types

### 4.1 Success response (HTTP 200)

```typescript
interface TriggerGradesCompsScrapeSuccessResponse {
  success: boolean;   // true
  jobId: number;      // Bull queue job ID
  runId: string;      // Run identifier (echoed from request or default)
  message: string;    // "Grades comps scrape job queued successfully"
  queueName: string;  // "scrape:grades-comps"
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
    "message": "scope must be \"grades_comps\""
  }
}
```

**500 example:**
```json
{
  "error": {
    "status": 500,
    "name": "InternalServerError",
    "message": "Failed to trigger grades comps scrape"
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

Uses: `jobId: grades:${Date.now()}`, `runId: cms-grades-YYYY-MM-DD`, `targets: []`, `options: { dryRun: false, skipAccountSlot: true, jobMaxConcurrency: 2 }`. Scrapes **all** competitions from CMS.

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

### 5.3 Direct targets (single competition)

```json
{
  "jobId": "grades-single:1731667200000",
  "runId": "cms-grades-single-001",
  "targets": [
    {
      "fixtureKey": "9fcb396f",
      "fixtureId": "9fcb396f",
      "url": "https://www.playhq.com/new-zealand-cricket/org/christchurch-metro-cricket-associationcjca/cmca-youth-boys-2025/9fcb396f",
      "strapiId": 13093
    }
  ],
  "options": {
    "skipAccountSlot": true
  }
}
```

### 5.4 Direct targets (multiple competitions)

```json
{
  "targets": [
    {
      "fixtureKey": "9fcb396f",
      "url": "https://www.playhq.com/.../9fcb396f",
      "strapiId": 13093
    },
    {
      "fixtureKey": "abc12345",
      "url": "https://www.playhq.com/.../abc12345",
      "strapiId": 13100
    }
  ]
}
```

---

## 6. Button Click Integration — Implementation Guide

### 6.1 High-level flow

1. User clicks a button (e.g. "Scrape All Grades" or "Refresh Competition Grades").
2. Optionally show a form/modal to collect: targets (for specific competitions), options. Or use defaults for a quick full run.
3. On submit, call `POST /api/competition/trigger-grades-comps-scrape` with the payload.
4. On success (200): show success message with jobId and queueName.
5. On error (4xx/5xx): show error message to the user.

### 6.2 Fetch example (TypeScript/React)

```typescript
const CMS_BASE_URL = process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:1337";

async function triggerGradesCompsScrape(
  payload: TriggerGradesCompsScrapeRequest = {}
): Promise<TriggerGradesCompsScrapeSuccessResponse> {
  const res = await fetch(
    `${CMS_BASE_URL}/api/competition/trigger-grades-comps-scrape`,
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

  return data as TriggerGradesCompsScrapeSuccessResponse;
}
```

### 6.3 React button + handler example (full run)

```tsx
function TriggerGradesCompsScrapeButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await triggerGradesCompsScrape({});
      toast.success(
        `Grades scrape job queued (Job ID: ${result.jobId}, Queue: ${result.queueName})`
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to trigger grades comps scrape"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={handleClick} disabled={loading}>
        {loading ? "Queuing..." : "Scrape All Grades"}
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
    const result = await triggerGradesCompsScrape({});
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
| `scope` (if sent) | Must be `"grades_comps"` |
| `kind` (if sent) | Must be `"account"` |
| `targets` (if sent) | Must be array if provided (can be empty) |
| `targets[].fixtureKey` | Required when using direct targets |
| `targets[].url` | Required when using direct targets |
| `targets[].strapiId` | Required when using direct targets |
| `targets[].fixtureId` | Optional; defaults to fixtureKey |

---

## 8. What Happens After the Request

1. **CMS** enqueues the job to Redis queue `scrape:grades-comps`.
2. **Bull-bridge-worker** picks up the job and forwards to Python scraper.
3. **Python (full run):** Calls `GET /api/competition/recon` and `GET /api/competition/data` to fetch all competitions from CMS.
4. **Python (direct targets):** Uses the provided `targets` as-is.
5. **Python** scrapes each competition's PlayHQ grades page.
6. **Python** POSTs each result to `POST /api/competition-grades/ingest`.
7. **CMS** processes the ingest (creates/updates grade records linked to competition).

---

## 9. Summary Table

| Item | Value |
|------|-------|
| **Endpoint** | `POST {CMS_BASE_URL}/api/competition/trigger-grades-comps-scrape` |
| **Auth** | None required |
| **Request body** | `{}` or optional overrides — no ID required for full run |
| **Success** | 200, `TriggerGradesCompsScrapeSuccessResponse` |
| **Client errors** | 400 (validation) |
| **Server errors** | 500 |

---

## 10. References

- [cms-trigger-grades-comps-redis-queue.md](./cms-trigger-grades-comps-redis-queue.md) — Queue spec, Bull payload, worker handoff
- [cms-competition-recon-and-data-endpoints-python-handoff.md](./cms-competition-recon-and-data-endpoints-python-handoff.md) — Recon + data endpoints
- [cms-competition-grades-ingest-python-handoff.md](./cms-competition-grades-ingest-python-handoff.md) — Ingest endpoint
- Backend handler: `src/api/competition/controllers/handlers/admin/TriggerGradesCompsScrape.js`
