# Admin Frontend: Scraper notification issues drill-down (`GET …/notifications/issues`)

**From:** CMS (Strapi) Backend Team  
**To:** Admin Frontend Team  
**Date:** 2026-07-02  
**Purpose:** Document the **notification issues list** API so the admin UI can drill down from the **health aggregate** into **per-issue rows** with URL, message, job context, and optional screenshots.

**Pairing:** Use **[notification health aggregate](admin-frontend-notification-health-handoff.md)** for dashboards and trends; use **this route** when the user clicks a step bucket or wants a searchable issue table. Use **[notification by run](admin-frontend-notification-by-run-handoff.md)** for full run detail + linked scraper log.

---

## 1. Endpoint

| Property | Value |
|----------|--------|
| **Method** | `GET` |
| **Path** | `/api/fixtura-scraper/notifications/issues` |
| **Auth** | None at route layer (`auth: false`), same pattern as `/api/fixtura-scraper/notifications/health`. Treat as **internal/trusted network** until auth is tightened. |

**Backend implementation:** [`controllers/handlers/NotificationIssuesList.js`](../controllers/handlers/NotificationIssuesList.js)

---

## 2. Pairing with health

| View | Endpoint | Use for |
|------|----------|---------|
| Aggregate dashboard | `GET /api/fixtura-scraper/notifications/health` | Counts, rates, `byStep`, `topMessages`, timeline |
| Issue table / drill-down | `GET /api/fixtura-scraper/notifications/issues` | Individual rows with URL, message, jobId, runId |
| Single run detail | `GET /api/fixtura-scraper/notifications/by-run/:jobId/:runId` | Full `issues[]`, `metrics`, `scraperLog` |
| Job event timeline | `GET /api/fixtura-scraper/logs/:jobId` | All lifecycle events + `payload` |

**Typical drill-down:** health `data.issues.byStep.request_timeout` → issues `?days=30&step=request_timeout&page=1`.

---

## 3. Time window (query)

Same rules as health. Filters rows by **`createdAt`** (when CMS stored the notification), not scraper `timestamp`.

Use **one** of these modes (mixing them returns **400**):

| Mode | Query | Notes |
|------|--------|--------|
| **Preset** | `days=7` or `14` or `30` or `60` | Rolling window ending **now** (server time). |
| **Explicit range** | `createdAt_gte` and/or `createdAt_lte` | ISO8601 datetimes. If only one bound is set, the other defaults: missing `gte` → epoch start; missing `lte` → now. |
| **Default** | *(no query)* | Last **7** days, same as `days=7`. |

**Validation errors (400):** `days` combined with `createdAt_*`; invalid `days`; invalid ISO strings; `createdAt_gte` after `createdAt_lte`.

---

## 4. Query parameters

### 4.1 Notification-level filters (applied before flatten)

| Param | Matches |
|-------|---------|
| `scope` | Notification **`scope`** only (e.g. `grades_comps`, `association_to_competition`) |
| `service` | Notification `service` |
| `queueName` | Notification `queueName` |
| `kind` | Notification `kind` (`account` / `fixture`) |
| `jobId` | Notification `jobId` (exact) |
| `runId` | Notification `runId` (exact) |

### 4.2 Issue-level filters (applied after flatten)

| Param | Matches |
|-------|---------|
| `step` | `issue.step` (exact), e.g. `request_timeout`, `page_not_found`, `content_wait` |
| `issueScope` | `issue.scope` (exact), e.g. `grades_lookup_teams` |
| `retryable` | `true` / `false` → `issue.retryable` |
| `selectorDrift` | `true` / `false` → `issue.selectorDriftSignal` |
| `message` | Case-insensitive substring on `issue.message` |

### 4.3 Pagination

| Param | Default | Max |
|-------|---------|-----|
| `page` | `1` | — |
| `pageSize` | `50` | `200` |

### 4.4 Enrichment

| Param | Default | Effect |
|-------|---------|--------|
| `includeArtifacts` | `false` | When `true`, batch-loads `fixtura-scraper-artifact` rows for `jobId`s on the **current page** and attaches matching screenshots/traces to each issue row |

---

## 5. Response shape (200)

Top-level: `{ data, meta }`.

### 5.1 `data.window`

Echoes the resolved range: `from`, `to` (ISO strings), `fromMs`, `toMs`.

### 5.2 `data.issues[]`

Each entry is one element from a notification’s `issues` array, with parent context attached.

| Field | Type | Meaning |
|-------|------|--------|
| `issueIndex` | number | 0-based position within the parent notification’s `issues` array |
| `step` | string \| null | Issue step (e.g. `request_timeout`, `page_not_found`) |
| `severity` | string \| null | e.g. `WARN` |
| `message` | string \| null | Human-readable error message |
| `url` | string \| null | PlayHQ/page URL when scraper supplied it |
| `issueScope` | string \| null | Issue-level `scope` (renamed to avoid clashing with notification `scope`) |
| `retryable` | boolean | `issue.retryable === true` |
| `selectorDriftSignal` | boolean | `issue.selectorDriftSignal === true` |
| `fixtureKey` | string \| null | Fixture key when present on issue |
| `extra` | object | Any other keys from the scraper issue object (forward-compatible) |
| `notification` | object | Parent notification context (see below) |
| `artifacts` | array | Empty unless `includeArtifacts=true`; see §5.4 |

### 5.3 `data.issues[].notification`

| Field | Type | Meaning |
|-------|------|--------|
| `id` | number | CMS notification id |
| `jobId` | string \| null | Scraper job id — link to `/dashboard/data/[jobId]` |
| `runId` | string \| null | Run identifier |
| `service` | string \| null | e.g. `python-scraper` |
| `scope` | string \| null | Notification scope (e.g. `grades_comps`) |
| `queueName` | string \| null | Bull queue name |
| `kind` | string \| null | `account` or `fixture` |
| `fatal` | boolean | Whether run was fatal |
| `errorRate` | number \| null | Server-computed from metrics |
| `createdAt` | string \| null | When CMS stored the notification |
| `scraperLogId` | number \| null | Linked `fixtura-scraper-log` id; `null` for APP-ingested notifications |

### 5.4 `data.issues[].artifacts[]` (when `includeArtifacts=true`)

| Field | Type | Meaning |
|-------|------|--------|
| `id` | number | Artifact record id |
| `artifactType` | string \| null | `screenshot`, `trace`, or `har` |
| `fixtureKey` | string \| null | Optional fixture correlation |
| `runId` | string \| null | Run id on artifact |
| `contentType` | string \| null | MIME type |
| `fileUrl` | string \| null | Strapi media URL for display/download |

**Matching rules:**

1. If issue has `fixtureKey` → artifacts with same `jobId` + `fixtureKey`
2. Else → all artifacts for that `jobId`

Empty `artifacts[]` is normal (e.g. navigation timeouts before a screenshot was captured).

### 5.5 `data.pagination`

| Field | Meaning |
|-------|--------|
| `page` | Current page (clamped to valid range) |
| `pageSize` | Page size used |
| `totalIssues` | Total issue rows after filters (before pagination) |
| `totalNotifications` | Distinct parent notifications in filtered set |
| `pageCount` | `ceil(totalIssues / pageSize)` |

### 5.6 `data.facets`

Computed from the **full filtered set** (before pagination). Reflects active filters so drill-down counts stay consistent.

| Field | Meaning |
|-------|--------|
| `byStep` | Counts by `step` |
| `byIssueScope` | Counts by `issueScope` |
| `retryableCount` | Issues with `retryable === true` |
| `selectorDriftCount` | Issues with `selectorDriftSignal === true` |

### 5.7 `meta`

| Field | Meaning |
|-------|--------|
| `notificationsScanned` | Notification rows loaded in window (after notification-level filters) |
| `notificationsTruncated` | `true` if scan hit the **10,000** notification cap |
| `maxNotifications` | `10000` |
| `artifactsIncluded` | Whether `includeArtifacts=true` was honoured |

If `notificationsTruncated` is true, show a warning and narrow the date range.

---

## 6. Example requests

**All issues in last 30 days:**

```http
GET /api/fixtura-scraper/notifications/issues?days=30
```

**Drill into timeouts from health dashboard:**

```http
GET /api/fixtura-scraper/notifications/issues?days=30&step=request_timeout&page=1&pageSize=50
```

**404s with screenshots:**

```http
GET /api/fixtura-scraper/notifications/issues?days=14&step=page_not_found&includeArtifacts=true
```

**Retryable issues in a scope:**

```http
GET /api/fixtura-scraper/notifications/issues?days=7&scope=grades_comps&retryable=true
```

**Selector drift only:**

```http
GET /api/fixtura-scraper/notifications/issues?days=30&selectorDrift=true
```

**Message search:**

```http
GET /api/fixtura-scraper/notifications/issues?days=30&message=404
```

---

## 7. UI recommendations

### 7.1 Table columns

| Column | Source |
|--------|--------|
| When | `notification.createdAt` |
| Step | `step` |
| Message | `message` (truncate in table) |
| URL | `url` (external link when present) |
| Job | `notification.jobId` → `/dashboard/data/[jobId]` |
| Run | `notification.runId` |
| Scope | `notification.scope` |
| Issue scope | `issueScope` (optional column) |
| Retryable | badge when `retryable` |
| Selector drift | badge when `selectorDriftSignal` |
| Screenshot | thumbnail from `artifacts[0].fileUrl` when `includeArtifacts=true` |

### 7.2 Interactions

- Click health **`byStep`** bucket → navigate to issues view with `step` pre-filled and same `days` window.
- Click issue row → `GET /api/fixtura-scraper/notifications/by-run/:jobId/:runId` for full detail + `scraperLog`.
- Optional: link jobId to `GET /api/fixtura-scraper/logs/:jobId` for full event timeline.
- Load screenshots on demand: default list without artifacts; toggle or per-row fetch with `includeArtifacts=true` on refresh (artifacts are loaded per page only).

### 7.3 Empty / missing data

- **`url` null** — scraper did not send URL for that issue type; still show message + job link.
- **`artifacts[]` empty** — normal for timeouts; do not show error state.
- **No rows** — may mean no failure notifications in window, not “all scrapes succeeded globally”.

---

## 8. TypeScript types (suggested)

```typescript
interface NotificationIssueRow {
  issueIndex: number;
  step: string | null;
  severity: string | null;
  message: string | null;
  url: string | null;
  issueScope: string | null;
  retryable: boolean;
  selectorDriftSignal: boolean;
  fixtureKey: string | null;
  extra: Record<string, unknown>;
  notification: NotificationIssueContext;
  artifacts: NotificationIssueArtifact[];
}

interface NotificationIssueContext {
  id: number;
  jobId: string | null;
  runId: string | null;
  service: string | null;
  scope: string | null;
  queueName: string | null;
  kind: string | null;
  fatal: boolean;
  errorRate: number | null;
  createdAt: string | null;
  scraperLogId: number | null;
}

interface NotificationIssueArtifact {
  id: number;
  artifactType: string | null;
  fixtureKey: string | null;
  runId: string | null;
  contentType: string | null;
  fileUrl: string | null;
}

interface NotificationIssuesResponse {
  data: {
    window: { from: string; to: string; fromMs: number; toMs: number };
    issues: NotificationIssueRow[];
    pagination: {
      page: number;
      pageSize: number;
      totalIssues: number;
      totalNotifications: number;
      pageCount: number;
    };
    facets: {
      byStep: Record<string, number>;
      byIssueScope: Record<string, number>;
      retryableCount: number;
      selectorDriftCount: number;
    };
  };
  meta: {
    notificationsScanned: number;
    notificationsTruncated: boolean;
    maxNotifications: number;
    artifactsIncluded: boolean;
  };
}
```

---

## 9. Known limitations

- **URL and screenshot presence** depends on what the Python scraper sends per issue type; CMS stores the payload verbatim.
- **10,000 notification cap** — same as health; aggregates and issue lists only cover scanned notifications.
- **Artifacts are opt-in** (`includeArtifacts=true`) and loaded for the **current page** only to avoid large media fetches on every list load.
- **Auth** — `auth: false` today; coordinate before exposing on public internet.

---

## 10. Related docs

| Doc | Purpose |
|-----|---------|
| [admin-frontend-notification-health-handoff.md](admin-frontend-notification-health-handoff.md) | Health aggregate API |
| [admin-frontend-notification-by-run-handoff.md](admin-frontend-notification-by-run-handoff.md) | Per-run notification detail |
| [read-routes-auth.md](read-routes-auth.md) | Route auth notes |
| [../../fixtura-scraper-log/.comms/cms-handoff-scraper-log-job-detail-api.md](../../fixtura-scraper-log/.comms/cms-handoff-scraper-log-job-detail-api.md) | Scraper log job timeline |
| [../../fixtura-scraper-log/.comms/admin-implementation-guide-2026-03.md](../../fixtura-scraper-log/.comms/admin-implementation-guide-2026-03.md) | Artifacts collection overview |

---

## 11. Example response fragment

```json
{
  "data": {
    "window": {
      "from": "2026-06-02T00:00:00.000Z",
      "to": "2026-07-02T00:00:00.000Z",
      "fromMs": 1748822400000,
      "toMs": 1751414400000
    },
    "issues": [
      {
        "issueIndex": 0,
        "step": "request_timeout",
        "severity": "WARN",
        "message": "Page.navigate timed out. Increase the 'protocolTimeout' setting...",
        "url": "https://www.playhq.com/cricket-australia/org/...",
        "issueScope": "grades_lookup_teams",
        "retryable": true,
        "selectorDriftSignal": false,
        "fixtureKey": null,
        "extra": {},
        "notification": {
          "id": 42,
          "jobId": "strapi:1773992557227",
          "runId": "cron-2026-03-20",
          "service": "python-scraper",
          "scope": "grades_comps",
          "queueName": "scrape:association-to-competition",
          "kind": "fixture",
          "fatal": false,
          "errorRate": 0.034,
          "createdAt": "2026-07-01T12:00:00.000Z",
          "scraperLogId": 991
        },
        "artifacts": []
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 50,
      "totalIssues": 103,
      "totalNotifications": 18,
      "pageCount": 3
    },
    "facets": {
      "byStep": {
        "request_timeout": 53,
        "page_not_found": 34,
        "playhq_upstream_error": 10,
        "content_wait": 6
      },
      "byIssueScope": {},
      "retryableCount": 69,
      "selectorDriftCount": 6
    }
  },
  "meta": {
    "notificationsScanned": 18,
    "notificationsTruncated": false,
    "maxNotifications": 10000,
    "artifactsIncluded": false
  }
}
```
