# Completed Tickets

- _None yet_

# Ticket – TKT-2025-010

---

ID: TKT-2025-010
Status: Draft
Priority: High
Owner: Admin Frontend
Created: 2025-11-08
Updated: 2025-11-08
Related: Roadmap-CompetitionsDashboard, Epic-CompetitionsDashboard, Dependency-API-CompetitionAdminStats

---

## Overview

Plan the frontend integration work needed to consume the new `/api/competition/admin/stats` endpoint within the competitions dashboard.

## What We Need to Do

Deliver a data-driven competitions dashboard page that uses the new admin stats endpoint through our service + hook + UI component pattern.

## Phases & Tasks

### Phase 1: Understand Current Dashboard Foundations

#### Tasks

- [x] Review `src/app/dashboard/competitions/page.tsx` scaffolding and identify required layout containers.
- [x] Analyze existing admin dashboard patterns (e.g., accounts module) for the established service + hook + UI workflow.

### Phase 2: Model CMS Admin Stats Contract

#### Tasks

- [x] Create TypeScript definitions for the admin stats response in `src/types/competitionAdminStats.ts`.
- [x] Export the new types through `src/types/index.ts` for reuse across the application.

### Phase 3: Service Layer

#### Tasks

- [x] Implement `fetchCompetitionAdminStats` in `src/lib/services/competitions/` with query param support and robust error handling.
- [x] Add request/response logging or telemetry hooks as needed for observability.

### Phase 4: TanStack Query Hook

#### Tasks

- [x] Build a `useCompetitionAdminStats` hook that wraps the service with `@tanstack/react-query`, including cache keys for filters.
- [x] Ensure loading, error, and refetch behaviors match existing admin dashboard conventions.

### Phase 5: UI Composition

#### Tasks

- [x] Compose a `CompetitionAdminStats` UI container that renders summary cards, charts, tables, and highlights using shared components.
- [x] Wire loading and error fallbacks with `LoadingState` and `ErrorState` to match other dashboards.

### Phase 6: Page Integration & Filters

#### Tasks

- [x] Integrate the new stats container into `src/app/dashboard/competitions/page.tsx` alongside page titles and controls.
- [x] Add optional association/season filters that trigger hook refetches while preserving query cache stability.

### Phase 7: Quality & Documentation

#### Tasks

- [ ] Validate endpoint behavior for default, association, and season queries through manual checks or Storybook scenarios.
- [x] Update `readMe.md`, `DevelopmentRoadMap.md`, and cross-link documentation to reflect the new data flow.

## Constraints, Risks, Assumptions

- Constraints: Endpoint requires authenticated admin sessions via the shared axios instance.
- Risks: Large datasets could impact charts/table performance; may require pagination or aggregation tweaks.
- Assumptions: CMS contract remains aligned with the provided documentation and axios base URL points to the CMS gateway.

# Summaries of Completed Tickets

- _None yet_
