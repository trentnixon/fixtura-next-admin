# Completed Tickets Index

- TKT-2026-054
- TKT-2026-053

# Ticket – TKT-2026-054

---

ID: TKT-2026-054
Status: Completed
Priority: Medium
Owner: Admin Frontend
Created: 2026-05-22
Updated: 2026-05-22
Related: Comms-admin-frontend-trigger-remove-fixtures-scrape-integration

---

## Overview

Enqueue remove-fixtures scope jobs from grade and competition admin views via `POST /api/game-meta-data/trigger-remove-fixtures-scrape` (`scrape:remove-fixtures`), with association-scoped Fixtura `accountId` resolution and explicit account selection when multiple accounts exist.

## What We Need to Do

Ship types, server action, mutation hook, shared confirm dialog (`TriggerRemoveFixturesScrapeButton`), `GradeRemoveFixturesTrigger` (association admin fetch), wiring on grade detail and competition snapshot; document account-resolution rules in comms.

## Completion Summary

Delivered `triggerRemoveFixturesScrape`, `useTriggerRemoveFixturesScrape`, `associationAccountSelection` helpers, `TriggerRemoveFixturesScrapeButton`, and `GradeRemoveFixturesTrigger`; competition drilldown passes `association.accounts`; grade page resolves accounts via `useAssociationDetail(association.id)`; toasts + invalidations mirror result-batch (`gradeInRender`, `competition` admin-detail, `scraperLogs`). Contract updates in [`.comms/admin-frontend-trigger-remove-fixtures-scrape-integration.md`](../../../../../../.comms/admin-frontend-trigger-remove-fixtures-scrape-integration.md).

# Ticket – TKT-2026-053

---

ID: TKT-2026-053
Status: Completed
Priority: High
Owner: Admin Frontend
Created: 2026-05-20
Updated: 2026-05-20
Related: Roadmap-CompetitionDrilldown, Comms-admin-frontend-trigger-result-batch-scrape-integration

---

## Overview

Expose CMS `POST /api/game-meta-data/trigger-result-batch-scrape` so admins can enqueue `scrape:result-batch` jobs for all resultable fixtures in scope (grade or competition).

## What We Need to Do

Provide types, server action, mutation hook, and confirm-dialog controls on grade detail and competition drilldown snapshot.

## Completion Summary

Delivered `triggerResultBatchScrape`, `useTriggerResultBatchScrape`, and `TriggerResultBatchScrapeButton` wired to `/dashboard/grades/[gradeID]` and competition `SnapshotSection`; success and zero-enqueue toasts, invalidation for `gradeInRender` / `competition` admin-detail and `scraperLogs`. Integration contract: [`../../.comms/admin-frontend-trigger-result-batch-scrape-integration.md`](../../.comms/admin-frontend-trigger-result-batch-scrape-integration.md).

# Ticket – TKT-2025-011

---

ID: TKT-2025-011
Status: In Progress
Priority: High
Owner: Admin Frontend
Created: 2025-11-08
Updated: 2025-11-08
Related: Roadmap-CompetitionDrilldown, Epic-CompetitionsDashboard, Dependency-API-CompetitionAdminDetail

---

## Overview

Plan the rebuild of the competition drilldown route to consume the CMS admin detail endpoint and deliver a rich per-competition experience.

## What We Need to Do

Replace the legacy competition detail page with a CMS-driven drilldown that mirrors the admin stats dashboard patterns (service + hook + UI composition).

## Phases & Tasks

### Phase 1: Audit Current Implementation

#### Tasks

- [x] Document the existing `page.tsx` and grade table component usage to understand legacy expectations.
- [x] Identify reusable scaffolding or widgets from the competitions dashboard that should appear in the drilldown.

### Phase 2: Model CMS Admin Detail Contract

#### Tasks

- [x] Create TypeScript definitions for the admin competition detail response in `src/types/competitionAdminDetail.ts`.
- [x] Export the new types via `src/types/index.ts` for cross-app usage.

### Phase 3: Service Layer

#### Tasks

- [x] Implement `fetchCompetitionAdminDetail` in `src/lib/services/competitions/` with validation and error handling for numeric IDs.
- [x] Add lightweight logging/telemetry for success and failure cases to aid debugging.

### Phase 4: TanStack Query Hook

#### Tasks

- [x] Build `useCompetitionAdminDetail` that wraps the service, including disabled state until a numeric `competitionId` exists.
- [x] Ensure hook options align with drilldown UX (stale times, refetch behaviour).

### Phase 5: UI Composition

#### Tasks

- [x] Design modular components for meta header, summary KPIs, analytics charts, and tables using the new data contract.
- [x] Integrate loading, empty, and error states consistent with dashboard patterns.

### Phase 6: Page Integration

#### Tasks

- [x] Replace legacy `page.tsx` logic with the new hook and composed components, wiring router params and fallback routes.
- [x] Remove or refactor outdated components (e.g., `competitionGradeTable.tsx`) in favour of the new drilldown modules.

### Phase 7: Quality & Documentation

#### Tasks

- [ ] Validate behaviour across success, 400, and 404 scenarios (including inactive competitions).
- [x] Update readmes, roadmap, and parent documentation to reflect the new drilldown architecture.

## Constraints, Risks, Assumptions

- Constraints: Endpoint only supports active competitions; handling 404s gracefully is required.
- Risks: Large nested payloads (teams/clubs) may impact rendering performance.
- Assumptions: Admin detail schema matches the provided CMS documentation and axios base URL remains consistent.

# Summaries of Completed Tickets

- _None yet_
