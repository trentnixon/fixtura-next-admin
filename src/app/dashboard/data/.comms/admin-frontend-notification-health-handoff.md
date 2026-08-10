# Admin Frontend: Scraper notification health aggregate (`GET …/notifications/health`)

**From:** CMS (Strapi) Backend Team  
**To:** Admin Frontend Team  
**Date:** 2026-03-31  
**Purpose:** Document the **notification health summary** API so the admin UI can show **scraping/CMS failure trends** over time (counts, summed metrics, issue breakdowns, daily timeline). Notifications are written when a scraper `job.completed` event includes **issues** or **fatal**, or when the APP POSTs a notification directly.

---

## 1. Endpoint

| Property | Value |
|----------|--------|
| **Method** | `GET` |
| **Path** | `/api/fixtura-scraper/notifications/health` |
| **Auth** | None at route layer (`auth: false`), same pattern as `/api/fixtura-scraper/logs` list endpoints. Treat as **internal/trusted network** until auth is tightened. |

**Backend implementation:** [`controllers/handlers/NotificationHealthSummary.js`](../controllers/handlers/NotificationHealthSummary.js)

---

## 2. Time window (query)

The API filters rows by **`createdAt`** (when the CMS stored the notification), not by scraper `timestamp`.

Use **one** of these modes (mixing them returns **400**):

| Mode | Query | Notes |
|------|--------|--------|
| **Preset** | `days=7` or `14` or `30` or `60` | Rolling window ending **now** (server time). |
| **Explicit range** | `createdAt_gte` and/or `createdAt_lte` | ISO8601 datetimes. If only one bound is set, the other defaults: missing `gte` → epoch start; missing `lte` → now. |
| **Default** | *(no query)* | Last **7** days, same as `days=7`. |

**Validation errors (400):** `days` combined with `createdAt_*`; invalid `days`; invalid ISO strings; `createdAt_gte` after `createdAt_lte`.

---

## 3. Response shape (200)

Top-level: `{ data, meta }`.

### 3.1 `data.window`

Echoes the resolved range: `from`, `to` (ISO strings), `fromMs`, `toMs`.

### 3.2 `data.notifications`

| Field | Meaning |
|-------|--------|
| `notificationCount` | Rows in window (after cap; see `meta.truncated`). |
| `fatalCount` | Rows with `fatal === true`. |
| `nonFatalCount` | Rows with `fatal !== true`. |

### 3.3 `data.metricsSums`

Sums of numeric fields from each row’s **`metrics`** JSON (missing/non-numeric treated as 0):

- **Fixture scrape:** `fixturesTotal`, `fixturesSucceeded`, `fixturesFailed`, `durationMs`
- **CMS ingest sub-pipeline:** `ingest_total`, `ingest_success`, `ingest_failed`, `ingest_retried`

Use these for dashboard **volume** totals across failing runs in the period.

### 3.4 `data.rates`

| Field | Meaning |
|-------|--------|
| `weightedFixtureErrorRate` | `sum(fixturesFailed) / sum(fixturesTotal)` across rows, or **`null`** if `sum(fixturesTotal) === 0`. Preferred **overall** fixture failure rate for the window. |
| `avgErrorRate` | Mean of per-row **`errorRate`** stored on the entity (each row is computed server-side from that row’s metrics). |

### 3.5 `data.byDimension`

Objects keyed by string → count of notifications: `byService`, `byScope`, `byQueueName`, `byKind`. Empty or missing keys may appear as `_unknown` where applicable.

### 3.6 `data.issues`

Aggregates **flattened** issue objects from every row’s **`issues`** array:

| Field | Meaning |
|-------|--------|
| `totalIssueRows` | Total issue entries (sum of array lengths). |
| `byStep` | Counts by issue `step` (e.g. `page_not_found`, `content_wait`, `ingest`). |
| `bySeverity` | Counts by `severity` (e.g. `WARN`). |
| `byIssueScope` | Counts by issue **`scope`** (pipeline scope inside the issue, e.g. `grades_lookup_teams`). |
| `topMessages` | Array of `{ message, count }`, up to **20** entries, sorted by count descending. |
| `retryableCount` | Issues with `retryable === true`. |
| `selectorDriftCount` | Issues with `selectorDriftSignal === true`. |

### 3.7 `data.timeline.byDay`

Array of daily buckets (UTC midnight), sorted by time:

| Field | Meaning |
|-------|--------|
| `bucket` | ISO start-of-day UTC |
| `bucketMs` | Epoch ms |
| `notificationCount` | Notifications whose `createdAt` falls that day |
| `fixturesFailed` | Sum of `metrics.fixturesFailed` for that day |

Use for **sparklines / bar charts** of failure volume over the window.

### 3.8 `meta`

| Field | Meaning |
|-------|--------|
| `truncated` | `true` if the query hit the **10,000** row cap; aggregates are **only** over those rows. |
| `maxEntries` | `10000` |

If `truncated` is true, narrow the date range or follow up with backend for a higher cap or server-side aggregation.

---

## 4. Example requests

**Last 30 days (preset):**

```http
GET /api/fixtura-scraper/notifications/health?days=30
```

**Custom range:**

```http
GET /api/fixtura-scraper/notifications/health?createdAt_gte=2026-03-01T00:00:00.000Z&createdAt_lte=2026-03-31T23:59:59.999Z
```

**Default (7 days):**

```http
GET /api/fixtura-scraper/notifications/health
```

---

## 5. Related endpoint (per run detail)

For a **single** job run (full `metrics`, `issues`, optional linked log), use:

`GET /api/fixtura-scraper/notifications/by-run/:jobId/:runId`

See **readMe** in [`.docs/readMe.md`](../.docs/readMe.md) and [`.comms/read-routes-auth.md`](read-routes-auth.md).

---

## 6. Product notes for UI

- **Health** is about **failure notifications**; absence of rows in a window does not mean “all scrapes succeeded” globally—only that nothing produced a failure notification in that period.
- **`weightedFixtureErrorRate`** is the best single number for “how bad were fixture scrapes” across the window; pair with **`metricsSums`** for scale.
- **Issue `step`** breakdown highlights **404 vs timeout vs ingest** class problems (see production samples in planning docs).
- **Do not** rely on `auth: false` long-term for public internet admin; coordinate with backend when auth is added.
