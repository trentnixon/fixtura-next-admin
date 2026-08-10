# Admin Implementation Guide — March 2026 Changes

**For:** Admin Frontend team  
**From:** CMS / Backend team  
**Date:** 2026-03-16  
**Purpose:** What’s new, what changed, and how to update the Admin UI

---

## 1. Summary

| Area | Change | Action |
|------|--------|--------|
| **Logs list endpoint** | `scope` is now optional; new fields in response | Update types; optionally use new fields |
| **Log entries** | `payload`, `cmsReceivedAt`, `cmsProcessingDurationMs`, `bullJobId`, `attempt` | Update types; surface in UI if useful |
| **Artifacts** | New collection for screenshots from failed scrapes | Optional: add artifact viewer/link |
| **EventCounts** | `failed` added | Update types |

---

## 2. What’s New

### 2.1 Logs List — `scope` Optional

**Before:** `scope` was required. Requests without `scope` returned 400.

**Now:** `scope` is optional. Omit it to get all scopes.

```
GET /api/fixtura-scraper/logs                    ← Returns all scopes
GET /api/fixtura-scraper/logs?scope=clients_list ← Filter by scope (unchanged)
```

**Impact:** If the Admin UI previously required users to pick a scope before loading, you can now support an “All scopes” view by omitting `scope`.

---

### 2.2 New Fields in Job Summary

| Field | Type | Description |
|-------|------|-------------|
| `bullJobId` | `string \| null` | Bull job ID (e.g. `"2"`, `"3"`) |
| `attempt` | `number \| null` | Attempt number (retries) |
| `scope` | `string \| null` | Now nullable when no scope filter is applied |

---

### 2.3 New Fields in Log Entries (`?include=entries`)

| Field | Type | Description |
|-------|------|-------------|
| `bullJobId` | `string \| null` | Bull job ID |
| `attempt` | `number \| null` | Attempt number |
| `cmsReceivedAt` | `string \| null` | ISO8601 when request arrived at CMS |
| `cmsProcessingDurationMs` | `number \| null` | CMS persist time (ms) |
| `payload` | `object \| null` | Full raw payload from scraper |

**`payload` contents (varies by event):**
- `metadata` — `durationMs`, `heartbeatSequence`, `elapsedMs`, `queueDepth`, etc.
- `workerId`, `workerHost`, `workerVersion` — worker info
- `metrics` — for `job.completed`: `fixturesTotal`, `fixturesSucceeded`, `durationMs`, etc.

---

### 2.4 EventCounts — `failed` Added

`eventCounts` now includes `failed`:

```typescript
interface EventCounts {
  dequeued: number;
  started: number;
  heartbeat: number;
  retry_later: number;
  completed: number;
  failed: number;   // NEW
}
```

---

### 2.5 Artifacts Endpoint (New Collection)

Screenshots from failed scrapes are stored in `fixtura-scraper-artifact`.

**To view artifacts in Admin:**
- Use Strapi Content Manager: **Fixtura Scraper Artifact**
- Or: `GET /api/fixtura-scraper-artifacts` (standard Strapi CRUD)

**Artifact fields:** `jobId`, `bullJobId`, `runId`, `fixtureKey`, `artifactType`, `contentType`, `file` (media)

**Optional:** Add a link from a failed job log to its artifacts (filter by `jobId` or `bullJobId`).

---

## 3. What Changed (Breaking / Behaviour)

### 3.1 `scope` No Longer Required

| Before | After |
|--------|-------|
| `scope` required; 400 if missing | `scope` optional; omit for all scopes |
| `meta.scope` always a string | `meta.scope` is `"all"` when no scope filter |

**Migration:** If you always required `scope` before loading, you can now support an “All” view. Existing calls with `scope` are unchanged.

---

### 3.2 `data[].scope` Can Be Null

| Before | After |
|--------|-------|
| `scope` always a string | `scope` can be `null` when no scope filter |

**Migration:** Treat `scope` as `string | null` in types and UI.

---

### 3.3 `meta.scope` When No Filter

When no `scope` filter is used, `meta.scope` is `"all"` instead of a scope value.

---

## 4. Migration Checklist

- [ ] **Types:** Add `bullJobId`, `attempt` to `JobSummary`; `scope` as `string | null`
- [ ] **Types:** Add `failed` to `EventCounts`
- [ ] **Types:** Add `bullJobId`, `attempt`, `cmsReceivedAt`, `cmsProcessingDurationMs`, `payload` to `LogEntry` (when `include=entries`)
- [ ] **Scope:** Decide whether to support “All scopes” (omit `scope` param)
- [ ] **UI:** Handle `scope: null` in job rows (e.g. show “—” or scope from first entry)
- [ ] **Optional:** Show `cmsProcessingDurationMs` in entry detail for latency
- [ ] **Optional:** Show `payload.metadata` (e.g. `durationMs`, `queueDepth`) in entry detail
- [ ] **Optional:** Add artifact viewer or link from failed jobs to artifacts

---

## 5. Updated TypeScript Types

```typescript
interface JobSummary {
  jobId: string;
  runId: string | null;
  scope: string | null;        // was string
  queueName: string | null;
  service: string | null;
  kind: string | null;
  bullJobId: string | null;    // NEW
  attempt: number | null;     // NEW
  startedAt: string | null;
  latestAt: string | null;
  startedAtMs: number | null;
  latestAtMs: number | null;
  status: JobStatus;
  durationMs: number | null;
  durationFormatted: string | null;
  eventCounts: EventCounts;
  entryCount: number;
  entries?: LogEntry[];
}

interface EventCounts {
  dequeued: number;
  started: number;
  heartbeat: number;
  retry_later: number;
  completed: number;
  failed: number;              // NEW
}

interface LogEntry {
  id: number;
  event: string;
  scope: string | null;
  timestamp: string | null;
  queueName: string | null;
  jobId: string;
  runId: string | null;
  service: string | null;
  kind: string | null;
  bullJobId: string | null;    // NEW
  attempt: number | null;      // NEW
  cmsReceivedAt: string | null;       // NEW
  cmsProcessingDurationMs: number | null;  // NEW
  payload: Record<string, unknown> | null;  // NEW
  createdAt: string;
}
```

---

## 6. References

| Document | Purpose |
|----------|---------|
| [admin-frontend-scraper-logs-list-endpoint-guide.md](./admin-frontend-scraper-logs-list-endpoint-guide.md) | Full logs list API spec |
| [cms-response-scraper-status-requests-2026-03.md](./cms-response-scraper-status-requests-2026-03.md) | Scraper team response (logs + artifacts) |

---

## 7. Questions?

If anything is unclear or you need more detail on payload shapes or artifact display, ask the backend team.
