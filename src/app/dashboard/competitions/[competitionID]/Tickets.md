# Completed Tickets

- _None yet_

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
