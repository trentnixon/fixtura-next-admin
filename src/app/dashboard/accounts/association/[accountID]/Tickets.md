# Completed Tickets

- _None yet_

# Ticket – TKT-2025-012

---

ID: TKT-2025-012
Status: In Progress
Priority: High
Owner: Admin Frontend
Created: 2025-11-08
Updated: 2025-11-08
Related: Roadmap-AssociationDrilldown, Epic-CompetitionsDashboard, Dependency-API-CompetitionAssociationDrilldown

---

## Overview

Plan work to integrate the association competition drilldown endpoint into the association account view, enabling admins to explore competitions for a given association.

## What We Need to Do

Extend the association detail page so the Competitions tab consumes `/api/competition/admin/:associationId/associations` via the shared service + hook + UI pattern.

## Phases & Tasks

### Phase 1: Assess Current Tab Layout

#### Tasks

- [x] Review `DisplayAssociation.tsx` tab structure and identify UX placement for the association drilldown.
- [x] Inventory reusable components from competition dashboard and detail pages suitable for association context.

### Phase 2: Model CMS Contract

#### Tasks

- [x] Create TypeScript definitions in `src/types/competitionAssociationDrilldown.ts`.
- [x] Export the new types through `src/types/index.ts` for shared consumption.

### Phase 3: Service Layer

#### Tasks

- [x] Implement `fetchCompetitionAssociationDrilldown` in `src/lib/services/competitions/` with numeric ID validation and detailed error handling.
- [x] Add observability hooks/logging for success and error cases to aid debugging.

### Phase 4: TanStack Query Hook

#### Tasks

- [x] Build `useCompetitionAssociationDrilldown` that wraps the service and remains disabled until a numeric association ID is available.
- [x] Align hook options (stale time, retry, focus refetch) with other competition drilldowns.

### Phase 5: UI Composition

#### Tasks

- [x] Create association-focused components for summary KPIs, competitions list, and nested grade/club tables.
- [x] Ensure loading, empty, and error states match the established admin dashboard look-and-feel.

### Phase 6: Page Integration

#### Tasks

- [x] Wire the new UI into the Competitions tab within `DisplayAssociation.tsx`, including parameter passing and conditional rendering.
- [x] Remove any legacy placeholders once the new drilldown renders successfully.

### Phase 7: Quality & Documentation

#### Tasks

- [ ] Validate the experience for associations with active/inactive competitions and handle error scenarios gracefully.
- [x] Update readmes, roadmap, and parent documentation to capture the new data flow.

## Constraints, Risks, Assumptions

- Constraints: Endpoint is scoped to association accounts; ensure route is hidden/disabled for club accounts.
- Risks: Large nested payloads (competitions → grades → teams) could impact performance; monitor load times.
- Assumptions: Association IDs from account data map directly to the CMS endpoint and share authentication behaviour with other competition routes.

# Summaries of Completed Tickets

- _None yet_
