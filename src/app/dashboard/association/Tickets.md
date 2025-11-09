# Ticket – TKT-2025-021

## Overview

Build the association data lookup and insight experience under `/dashboard/association`.

## What We Need to Do

Deliver a searchable association catalogue with summary metrics and drilldown entry points.

## Phases & Tasks

### Phase 1: Discovery

- [ ] Inventory available association endpoints and fields
- [ ] Confirm data freshness and pagination behaviour
- [ ] Identify reusable components from competitions and accounts views

### Phase 2: Data Access

- [ ] Implement service function(s) for association lookup
- [ ] Add React Query hooks for list and detail retrieval
- [ ] Define TypeScript contracts for responses

### Phase 3: UI Experience

- [ ] Design search, filter, and table layout for associations
- [ ] Integrate metrics/insight cards aligned with existing dashboards
- [ ] Wire navigation into association and account drilldowns

### Phase 4: QA & Documentation

- [ ] Validate behaviour across success, loading, and empty states
- [ ] Document data mapping, limitations, and follow-up work
- [ ] Update roadmap and tickets with outcomes

## Constraints, Risks, Assumptions

- Constraints: Awaiting confirmation on association list endpoint parameters
- Risks: Potential mismatch between account permissions and data access requirements
- Assumptions: Association drilldown data mirrors the account-based views
