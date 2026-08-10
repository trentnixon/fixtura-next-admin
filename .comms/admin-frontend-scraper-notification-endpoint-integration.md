# Admin Frontend: Scraper Notification Endpoint Integration

**From:** CMS (Strapi) Backend Team  
**To:** Admin Frontend Team  
**Date:** 2026-03-09  
**Purpose:** Instructions for integrating the scraper notification ingest endpoint with a button click in the admin UI. Includes full TypeScript types, request/response contracts, and implementation guidance for LLM-assisted development.

---

## 1. Overview

The admin frontend can create scrape failure notifications by calling `POST /api/fixtura-scraper/notifications`. This is useful when an admin wants to manually report a scrape failure (e.g. after observing an issue, or when triggering a test notification).

**Use case:** A button in the admin UI (e.g. "Report Scrape Failure" or "Create Test Notification") that, when clicked, sends a notification payload to the CMS. The notification is stored in the `fixtura-scraper-notification` collection and can be viewed in the admin panel.

---

## 2. Endpoint Contract

| Property | Value |
|----------|-------|
| **Method** | POST |
| **Path** | `/api/fixtura-scraper/notifications` |
| **Full URL** | `{CMS_BASE_URL}/api/fixtura-scraper/notifications` |
| **Auth** | Bearer token (required). Use the admin user's JWT or an API key with permission to the `fixtura-scraper-notification` custom route. |
| **Content-Type** | `application/json` |

---

## 3. Request Payload — TypeScript Types

### 3.1 Full type definitions

```typescript
/**
 * A single scrape failure issue (ScrapeFailure)
 */
interface ScrapeFailureIssue {
  scope: string;           // e.g. "clients_list", "association_overview"
  severity: "FATAL" | "ERROR" | "WARN";
  step: string;             // e.g. "pre_scrape_validation", "navigate", "extract", "paginate"
  message: string;          // Human-readable error description
  fixtureKey?: string;      // Fixture ID, e.g. "cricket-australia"
  url?: string;             // URL being scraped when failure occurred
  missingItems?: string[];  // Expected selectors/elements not found
  selectorsTried?: string[];// Selectors attempted before failure
  remediation?: string;     // Optional hint for how to fix
  artifactRefs?: string[];  // Paths to screenshot/trace (local to scraper)
}

/**
 * Metrics object — counts and duration
 */
interface ScraperMetrics {
  fixturesTotal: number;
  fixturesSucceeded: number;
  fixturesFailed: number;
  durationMs: number;
}

/**
 * Request payload for POST /api/fixtura-scraper/notifications
 * All fields except accountId are required.
 */
interface CreateScraperNotificationRequest {
  jobId: string;            // Required. Bull job ID or arbitrary identifier
  runId: string;            // Required. Run identifier
  accountId?: number | null;// Optional. Account ID (0 or null if none)
  fatal: boolean;           // Required. true if any FATAL issue
  metrics: ScraperMetrics;  // Required. Must be an object with the four fields
  issues: ScrapeFailureIssue[]; // Required. Array (may be empty for test)
}
```

### 3.2 Required vs optional

| Field | Required | Type | Notes |
|-------|----------|------|-------|
| `jobId` | Yes | string | Cannot be undefined or null |
| `runId` | Yes | string | Cannot be undefined or null |
| `accountId` | No | number \| null | Omit or pass null if no account |
| `fatal` | Yes | boolean | Must be explicitly true or false |
| `metrics` | Yes | object | Must have fixturesTotal, fixturesSucceeded, fixturesFailed, durationMs |
| `issues` | Yes | array | Must be an array (can be empty []) |

### 3.3 Server-side computation

The CMS **computes** `errorRate` from `metrics`:

- `errorRate = metrics.fixturesFailed / metrics.fixturesTotal`
- If `metrics.fixturesTotal === 0`, then `errorRate = 0`

Do **not** send `errorRate` in the request; it is ignored.

---

## 4. Response — TypeScript Types

### 4.1 Success response (HTTP 201)

```typescript
interface CreateScraperNotificationSuccessResponse {
  success: boolean;   // true
  id: number;         // Created record ID in fixtura-scraper-notification
  created: boolean;  // true
  message: string;    // "Scraper notification stored"
}
```

### 4.2 Error responses

| HTTP Status | Body | Type |
|-------------|------|------|
| **400** | `{ message: string }` or Strapi error shape | Validation error — missing/invalid fields |
| **401** | Unauthorized | Missing or invalid Bearer token |
| **500** | `{ message: string }` or error detail | Server error |

**400 example:**
```json
{
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "jobId is required"
  }
}
```

**500 example:**
```json
{
  "error": {
    "status": 500,
    "name": "InternalServerError",
    "message": "Notification ingest failed: ..."
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

### 5.1 Minimal (test notification)

```json
{
  "jobId": "admin-test-001",
  "runId": "manual-20260309",
  "fatal": false,
  "metrics": {
    "fixturesTotal": 1,
    "fixturesSucceeded": 0,
    "fixturesFailed": 1,
    "durationMs": 0
  },
  "issues": [
    {
      "scope": "clients_list",
      "severity": "ERROR",
      "step": "pre_scrape_validation",
      "message": "Manual test notification from admin"
    }
  ]
}
```

### 5.2 Full (with all optional issue fields)

```json
{
  "jobId": "bull:1772886783051-0",
  "runId": "cms-queue-20260309",
  "accountId": 675,
  "fatal": false,
  "metrics": {
    "fixturesTotal": 5,
    "fixturesSucceeded": 3,
    "fixturesFailed": 2,
    "durationMs": 12000
  },
  "issues": [
    {
      "scope": "clients_list",
      "severity": "ERROR",
      "step": "pre_scrape_validation",
      "message": "Pre-scrape validation failed: expected org tiles not found",
      "fixtureKey": "cricket-australia",
      "url": "https://playhq.com/...",
      "missingItems": ["ORG_ITEMS", "ORG_ITEMS_FALLBACK"],
      "selectorsTried": ["[data-testid=\"search-results\"] a[data-testid^=\"organisationTile-\"]"],
      "remediation": "Check PlayHQ site for HTML structure change",
      "artifactRefs": []
    }
  ]
}
```

---

## 6. Button Click Integration — Implementation Guide

### 6.1 High-level flow

1. User clicks a button (e.g. "Report Scrape Failure" or "Create Test Notification").
2. Optionally show a form/modal to collect: jobId, runId, accountId, fatal, metrics, issues. Or use defaults for a quick test.
3. On submit, call `POST /api/fixtura-scraper/notifications` with the payload.
4. On success (201): show success message, optionally navigate to the notification list or refresh.
5. On error (4xx/5xx): show error message to the user.

### 6.2 Fetch example (TypeScript/React)

```typescript
const CMS_BASE_URL = process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:1337";

async function createScraperNotification(
  payload: CreateScraperNotificationRequest,
  token: string
): Promise<CreateScraperNotificationSuccessResponse> {
  const res = await fetch(`${CMS_BASE_URL}/api/fixtura-scraper/notifications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    const msg = data?.error?.message ?? data?.message ?? `Request failed: ${res.status}`;
    throw new Error(msg);
  }

  return data as CreateScraperNotificationSuccessResponse;
}
```

### 6.3 React button + handler example

```tsx
function ReportScrapeFailureButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthToken(); // Your auth hook

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    const payload: CreateScraperNotificationRequest = {
      jobId: `admin-${Date.now()}`,
      runId: "manual-report",
      fatal: false,
      metrics: {
        fixturesTotal: 1,
        fixturesSucceeded: 0,
        fixturesFailed: 1,
        durationMs: 0,
      },
      issues: [
        {
          scope: "clients_list",
          severity: "ERROR",
          step: "pre_scrape_validation",
          message: "Manually reported from admin UI",
        },
      ],
    };

    try {
      const result = await createScraperNotification(payload, token);
      toast.success(`Notification created (ID: ${result.id})`);
      // Optionally: navigate to /admin/plugins/fixtura-scraper-notification or refresh list
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={handleClick} disabled={loading}>
        {loading ? "Creating..." : "Report Scrape Failure"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
}
```

### 6.4 Form-based flow (collect user input)

If the admin should provide custom values:

- **jobId**: Text input (e.g. Bull job ID or free-form identifier).
- **runId**: Text input (e.g. run identifier).
- **accountId**: Number input, optional (null/empty if none).
- **fatal**: Checkbox or toggle.
- **metrics**: Four number inputs: fixturesTotal, fixturesSucceeded, fixturesFailed, durationMs.
- **issues**: Array of issue objects. For a simple form, one issue with: scope, severity, step, message. Advanced: allow adding multiple issues with full fields.

Validate before submit: ensure jobId, runId, fatal, metrics, issues are present and correctly typed.

---

## 7. Validation Rules (Server-Side)

The server validates as follows. Ensure the frontend sends valid data to avoid 400 errors:

| Field | Validation |
|-------|------------|
| `jobId` | Must be present (not undefined, not null) |
| `runId` | Must be present (not undefined, not null) |
| `fatal` | Must be boolean (true or false) |
| `metrics` | Must be object (not null, not array) |
| `issues` | Must be array (can be empty []) |

`accountId` is optional. If provided, it is coerced to number; invalid values become null.

---

## 8. Permissions

Ensure the admin user or API key has permission to call the `fixtura-scraper-notification` **ingest** custom route. In Strapi Admin:

- **Settings** → **Users & Permissions** → **Roles** → [Admin or relevant role]
- Under **Fixtura-scraper-notification**, enable the custom route (e.g. `ingest` or the POST to `/fixtura-scraper/notifications`).

---

## 9. Summary Table

| Item | Value |
|------|-------|
| **Endpoint** | `POST {CMS_BASE_URL}/api/fixtura-scraper/notifications` |
| **Auth** | `Authorization: Bearer <token>` |
| **Request body** | `CreateScraperNotificationRequest` (JSON) |
| **Success** | 201, `CreateScraperNotificationSuccessResponse` |
| **Client errors** | 400 (validation), 401 (auth) |
| **Server errors** | 500 |

---

## 10. References

- [python-scraper-cms-endpoints-how-to.md](./python-scraper-cms-endpoints-how-to.md) — Python scraper integration (logs + notifications)
- [cms-t19-scrape-failure-notification-handoff.md](./cms-t19-scrape-failure-notification-handoff.md) — T19 spec, ScrapeFailure schema
- Backend handler: `src/api/fixtura-scraper-notification/controllers/handlers/IngestNotification.js`
