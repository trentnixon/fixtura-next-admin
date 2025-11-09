# Ticket – TKT-2025-022

## Overview
Deliver the club data lookup and insight experience under `/dashboard/club`.

## What We Need to Do
Provide a searchable club catalogue with metrics, filters, and navigation into detailed views.

## Phases & Tasks
### Phase 1: Discovery
- [ ] Audit available club data sources and define required fields
- [ ] Evaluate alignment with existing club drilldown components
- [ ] Confirm permissions and access controls

### Phase 2: Data Infrastructure
- [ ] Implement service layer functions for club lookup
- [ ] Create React Query hooks for list and detail retrieval
- [ ] Define TypeScript models for API responses

### Phase 3: UI Implementation
- [ ] Design club search filters, table layout, and summary cards
- [ ] Integrate drilldown navigation into club and competition pages
- [ ] Wire metrics to highlight coverage gaps and opportunities

### Phase 4: QA & Rollout
- [ ] Test empty, loading, and error states
- [ ] Document data sources, known constraints, and follow-ups
- [ ] Update roadmap and close tickets with findings

## Constraints, Risks, Assumptions
- Constraints: Pending confirmation on club listing pagination and search parameters
- Risks: Inconsistent club data across associations could affect filtering accuracy
- Assumptions: Club data closely mirrors the account-based club detail responses

