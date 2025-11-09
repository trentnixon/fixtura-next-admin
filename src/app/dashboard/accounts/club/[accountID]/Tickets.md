# Completed Tickets

- _None yet_

# Ticket – TKT-2025-013

---

ID: TKT-2025-013
Status: In Progress
Priority: High
Owner: Admin Frontend
Created: 2025-11-08
Updated: 2025-11-08
Related: Roadmap-ClubDrilldown, Epic-CompetitionsDashboard, Dependency-API-CompetitionClubDrilldown

---

## Overview

Track the work required to integrate the club competition drilldown endpoint into the club account view, providing parity with association drilldowns.

## What We Need to Do

Enable the Competitions tab to consume `/api/competition/admin/:clubId/clubs` alongside the association drilldown, including new types, services, hook, and UI composition.

## Phases & Tasks

### Phase 1: Audit Current Tab Layout

#### Tasks

- [x] Review `DisplayClub.tsx` tab structure and confirm UX placement for the club drilldown.
- [x] Identify shared components from association/competition dashboards suitable for reuse.

### Phase 2: Model CMS Contract

#### Tasks

- [x] Create TypeScript definitions in `src/types/competitionClubDrilldown.ts`.
- [x] Export the new types through `src/types/index.ts` for shared consumption.

### Phase 3: Service Layer

#### Tasks

- [x] Implement `fetchCompetitionClubDrilldown` in `src/lib/services/competitions/` with numeric ID validation and detailed error handling.
- [x] Add logging for success/error to aid observability.

### Phase 4: TanStack Query Hook

#### Tasks

- [x] Build `useCompetitionClubDrilldown` that wraps the service and remains disabled until a numeric club ID is available.
- [x] Align hook behaviour (stale time, retry, focus refetch) with other competition drilldowns.

### Phase 5: UI Composition

#### Tasks

- [x] Extend the competitions tab to render club summary KPIs, meta card, and competitions table using the drilldown payload.
- [x] Ensure consistent loading, empty, and error states across association and club flows.

### Phase 6: Page Integration

#### Tasks

- [x] Wire the new UI into `DisplayClub.tsx` via the shared competitions tab, handling club/association branching.
- [x] Remove legacy reliance on account-based competition fetches.

### Phase 7: Quality & Documentation

#### Tasks

- [ ] Validate the club drilldown for active/inactive competitions and error handling scenarios.
- [x] Update readmes, roadmap, and parent documentation to reflect the new club drilldown architecture.

## Constraints, Risks, Assumptions

- Constraints: Endpoint is scoped to club accounts; ensure route is conditionally unavailable for associations where appropriate.
- Risks: Large nested competition payloads may impact rendering; monitor performance and consider pagination/virtualization.
- Assumptions: Club IDs from account data map directly to the CMS endpoint and use existing authentication.

# Summaries of Completed Tickets

- _None yet_
