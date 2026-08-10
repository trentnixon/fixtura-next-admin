# Data Section — Scraper Logs Integration

## Completed Tickets Index

* TKT-2026-003
* TKT-2026-004

---

## Active Tickets

---

## TKT-2026-004

---
ID: TKT-2026-004
Status: Completed
Priority: Medium
Owner: Admin Frontend Team
Created: 2026-07-02
Updated: 2026-07-02
Related: .comms/admin-frontend-notification-issues-handoff.md, .comms/admin-frontend-notification-health-handoff.md
---

## Overview

Integrate `GET /api/fixtura-scraper/notifications/issues` for paginated drill-down from notification health into per-issue rows with filters, optional screenshots, and job/run navigation.

## What We Need to Do

Ship types, fetch service, React Query hook, dedicated `/dashboard/data/notifications/issues` route, and health dashboard drill-down links.

## Completion Summary

Added notification issues types, fetch/hook, bookmarkable issues page with URL-driven filters and pagination, health `byStep` drill-down links, and comms documentation.

---

## TKT-2026-003

---
ID: TKT-2026-003
Status: Completed
Priority: Medium
Owner: Admin Frontend Team
Created: 2026-03-20
Updated: 2026-03-20
Related: .comms/admin-frontend-scraper-log-by-job-id-integration.md, .comms/admin-frontend-scraper-logs-list-endpoint-guide.md
---

## Overview

Add `/dashboard/data/[jobId]` with full event timeline and payload rendering; replace the list-page Events modal with a Details link; extend list table and API client with optional `jobId` filter.

## What We Need to Do

Ship job detail route, `fetchScraperLogByJobId` + `useScraperLogByJobId`, event-specific payload UI, and comms for CMS alignment.

## Completion Summary

Implemented job detail page with expandable timeline, `fetchScraperLogByJobId` (list `jobId` query + path fallback), types for metrics/issues/queue depth, table columns Kind/Service/Entries, and documentation updates.

---

## TKT-2026-002

---
ID: TKT-2026-002
Status: Draft
Priority: Medium
Owner: Admin Frontend Team
Created: 2026-03-12
Updated: 2026-03-12
Related: .comms/admin-frontend-scraper-logs-list-endpoint-guide.md
---

## Overview

Integrate the CMS scraper logs list endpoint (`GET /api/fixtura-scraper/logs`) into the Data page UI. The endpoint provides job summaries, timeline aggregations, and pagination for both `clients_list` and `association_to_competition` scopes. The UI will surface recent logs, job status, and charts.

## What We Need to Do

Deliver a full integration from the CMS endpoint through to the UI: types, service layer, TanStack Query hook, and components that display job logs and charts (jobs over time, status distribution, duration metrics) per scope.

## Phases & Tasks

### Phase 1: Types & Service Layer

- [x] Define TypeScript interfaces for `ListLogsResponse`, `JobSummary`, `ListLogsMeta`, `JobStatus`, `EventCounts`, `TimelineBucket`, `LogEntry`, `Pagination`, `DateRange`, `Summary` from the endpoint spec
- [x] Create `src/types/scraperLogs.ts` (or `src/types/listScraperLogs.ts`) with all response types
- [x] Implement `fetchScraperLogs.ts` in `src/lib/services/data-collection/` that:
  - Calls `GET {CMS_BASE}/api/fixtura-scraper/logs` via axios instance
  - Accepts query params: `scope`, `queueName`, `event`, `timestamp_gte`, `timestamp_lte`, `pagination[page]`, `pagination[pageSize]`, `include`
  - Returns typed `ListLogsResponse`
  - Handles 400, 500 errors and maps to thrown `Error` with message
- [x] Confirm base URL path: `NEXT_APP_API_BASE_URL` + `/api/fixtura-scraper/logs` (adjust if CMS base already includes `/api`)

### Phase 2: TanStack Query Hook

- [x] Create `useScraperLogs` hook in `src/hooks/data-collection/` (or similar)
- [x] Accept params: `scope`, optional `page`, `pageSize`, `timestamp_gte`, `timestamp_lte`, `include`
- [x] Use `useQuery` with query key including scope and params
- [x] Return `{ data, meta, isLoading, error, refetch }`
- [x] Add parameter guards (scope required; validate scope enum)

### Phase 3: UI — Logs List & Summary Cards

- [x] Add a logs section to `ClientsListScrapeSection` and `AssociationToCompetitionScrapeSection` (or create a shared `ScraperLogsSection` component)
- [x] Display summary cards from `meta.summary`: `totalJobs`, `byStatus`, `avgDurationMs`
- [x] Display jobs table from `data`: columns for `jobId`, `status`, `durationFormatted`, `startedAt`, `runId`
- [x] Add pagination controls (page, pageSize) wired to hook params
- [x] Add date range picker (optional) wired to `timestamp_gte` / `timestamp_lte`
- [x] Use `useScraperLogs` with `scope="clients_list"` and `scope="association_to_competition"` per section
- [x] Handle loading, empty, and error states

### Phase 4: UI — Charts

- [x] Jobs over time chart: use `meta.timeline.byHour` or `byDay`; X-axis `bucket`/`bucketMs`, Y-axis `jobCount`
- [x] Status distribution chart: use `meta.summary.byStatus`; bar chart by status
- [x] Duration over time chart (optional): use `meta.timeline.byHour`; Y-axis `totalDurationMs`
- [x] Use `meta.dateRange.fromMs` and `meta.dateRange.toMs` for chart domain
- [x] Reuse existing chart components from `src/app/dashboard/labs/components/charts/_components/` and `ChartContainer` / `ChartCard`

### Phase 5: Optional Enhancements

- [x] Job detail modal: when `include=entries` is passed, show full event timeline per job
- [x] Scope selector (tabs or dropdown) if combining both scopes in one view
- [x] Refresh button / polling for in-progress jobs

## Constraints, Risks, Assumptions

- **Auth:** Endpoint currently has `auth: false`; may change later (TODO in docs).
- **Base URL:** CMS base is `NEXT_APP_API_BASE_URL`; verify path is `/api/fixtura-scraper/logs` or `fixtura-scraper/logs` depending on config.
- **Scope values:** `clients_list`, `association_to_competition` (from endpoint spec).
- **Charts:** Chart library already in use (Recharts, ChartContainer); follow existing patterns.

## Reference

- Endpoint guide: `src/app/dashboard/data/.comms/admin-frontend-scraper-logs-list-endpoint-guide.md`
- Existing trigger services: `src/lib/services/data-collection/triggerClientsListScrape.ts`, `triggerAssociationToCompetitionScrape.ts`
- Chart patterns: `src/app/dashboard/labs/components/charts/readMe.md`, `src/utils/chart-formatters.ts`
