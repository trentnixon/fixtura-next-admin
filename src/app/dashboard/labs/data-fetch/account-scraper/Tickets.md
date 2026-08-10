# 📁 Tickets.md – Fetch Account Tests

This file is used for **feature-level planning and tracking** for the account scrape test dashboard.

---

## 🌟 Ticket Structure

Every ticket must include the following sections:

1. **Metadata Block**

   ```md
   ---
   ID: TKT-YYYY-NNN
   Status: Draft | In Progress | Completed
   Priority: High | Medium | Low
   Owner: (Name / Team)
   Created: YYYY-MM-DD
   Updated: YYYY-MM-DD
   Related: Roadmap-[ID], Epic-[ID], Dependency-[ID]
   ---
   ```

2. **Overview**
   A short description of the ticket's purpose.

3. **What We Need to Do**
   A high-level statement of the goal.

4. **Phases & Tasks** _(only for new or in-progress tickets)_

   - Organise work into phases.
   - Each phase contains a **Tasks** list.
   - Tasks must use checkbox format `[ ]` and start with an **action verb**.

   Example:

   ```md
   ### Phase 1: Setup Infrastructure

   #### Tasks

   - [ ] Research caching options (Redis vs in-memory)
   - [ ] Add caching dependency to project
   - [ ] Configure cache service wrapper
   ```

5. **Constraints, Risks, Assumptions**
   Capture anything that may affect the ticket.
   Example:

   - Constraints: Waiting on Redis env vars.
   - Risks: Cache invalidation complexity.
   - Assumptions: Traffic patterns are stable.

---

# Completed Tickets

---

# Active Tickets

## TKT-2025-001

---

ID: TKT-2025-001
Status: In Progress
Priority: High
Owner: Development Team
Created: 2025-01-27
Updated: 2025-01-27
Related: Roadmap-fetchAccountTests

---

### Overview

Create TypeScript types for account scrape tests functionality.

### What We Need to Do

Define comprehensive TypeScript interfaces for account-specific scrape test data, extending the existing fetch-test types with account-specific fields and relationships.

### Phases & Tasks

#### Phase 1: Type Definition

- [ ] Create account-specific test run interfaces
- [ ] Define account test summary and metrics types
- [ ] Add account relationship types to existing interfaces
- [ ] Create account test charts and visualization types

#### Phase 2: Integration

- [ ] Update existing fetch-test types to support account filtering
- [ ] Ensure type compatibility with existing API endpoints
- [ ] Add proper TypeScript exports and imports

### Constraints, Risks, Assumptions

- Constraints: Must maintain compatibility with existing fetch-test types
- Risks: Type complexity may increase with account-specific data
- Assumptions: Account data structure is similar to existing test data

---

## TKT-2025-002

---

ID: TKT-2025-002
Status: Draft
Priority: High
Owner: Development Team
Created: 2025-01-27
Updated: 2025-01-27
Related: Roadmap-fetchAccountTests, TKT-2025-001

---

### Overview

Create API service functions for fetchAccountTests following established patterns.

### What We Need to Do

Implement server-side API functions that fetch account-specific scrape test data, following the same patterns as the existing fetchTests services.

### Phases & Tasks

#### Phase 1: Service Implementation

- [ ] Create fetchAllAccountTests service function
- [ ] Create fetchAccountTestById service function
- [ ] Implement proper error handling and logging
- [ ] Add TypeScript type safety

#### Phase 2: Testing & Validation

- [ ] Test API endpoints with mock data
- [ ] Validate error handling scenarios
- [ ] Ensure proper response formatting

### Constraints, Risks, Assumptions

- Constraints: Must follow existing axios instance patterns
- Risks: API endpoint availability and response structure
- Assumptions: Backend endpoints will follow similar patterns to fetchTests

---

## TKT-2025-003

---

ID: TKT-2025-003
Status: Draft
Priority: Medium
Owner: Development Team
Created: 2025-01-27
Updated: 2025-01-27
Related: Roadmap-fetchAccountTests, TKT-2025-002

---

### Overview

Create React Query hooks for fetchAccountTests data fetching.

### What We Need to Do

Implement custom hooks using Tanstack Query for fetching account test data, following the established patterns from fetchTests hooks.

### Phases & Tasks

#### Phase 1: Hook Implementation

- [x] Create useFetchAccountTestsQuery hook
- [x] Create useFetchAccountTestByIdQuery hook
- [x] Implement proper query key strategies
- [x] Add enabled conditions for conditional fetching

#### Phase 2: Integration

- [x] Test hooks with existing components
- [x] Ensure proper caching behavior
- [x] Add error handling and loading states

### Constraints, Risks, Assumptions

- Constraints: Must use existing Tanstack Query configuration
- Risks: Query cache conflicts with existing fetchTests data
- Assumptions: React Query patterns are consistent across the application

---

## TKT-2025-004

---

ID: TKT-2025-004
Status: In Progress
Priority: High
Owner: Development Team
Created: 2025-01-27
Updated: 2025-01-27
Related: Roadmap-fetchAccountTests, TKT-2025-001

---

### Overview

Create API service functions for fetch-account-scrape-test following established patterns.

### What We Need to Do

Implement server-side API functions that fetch account-specific scrape test data, following the same patterns as the existing fetchTests services.

### Phases & Tasks

#### Phase 1: Service Implementation

- [x] Create fetchAllFetchTestAccounts service function
- [x] Create fetchFetchTestAccountById service function
- [x] Implement proper error handling and logging
- [x] Add TypeScript type safety

#### Phase 2: Testing & Validation

- [x] Test API endpoints with mock data
- [x] Validate error handling scenarios
- [x] Ensure proper response formatting

### Constraints, Risks, Assumptions

- Constraints: Must follow existing axios instance patterns
- Risks: API endpoint availability and response structure
- Assumptions: Backend endpoints follow similar patterns to fetchTests

---

## TKT-2025-005

---

ID: TKT-2025-005
Status: Completed
Priority: Medium
Owner: Development Team
Created: 2025-01-27
Updated: 2025-01-27
Related: Roadmap-fetchAccountTests, TKT-2025-003

---

### Overview

Create comprehensive UI components for fetchAccountTests dashboard pages.

### What We Need to Do

Implement all UI components including main dashboard page, individual test detail page, and shared components for data visualization.

### Completion Summary

Successfully implemented complete UI component suite including main dashboard page with table, summary cards, and charts, plus individual account test detail page with statistics cards, discrepancies analysis, and performance charts. All components follow established patterns and integrate seamlessly with React Query hooks.

---

# Summaries of Completed Tickets

### TKT-2025-001

Created comprehensive TypeScript types for account scrape tests, extending existing fetch-test patterns with account-specific data structures including TestRun, TestSummary, TestCharts, and TestResponse interfaces.

### TKT-2025-002

Implemented React Query hooks for fetchAccountTests data fetching, following established patterns with proper query key strategies, conditional fetching, and error handling integration.

### TKT-2025-004

Created API service functions for fetch-account-scrape-test following established axios patterns, including fetchAllFetchTestAccounts and fetchFetchTestAccountById with comprehensive error handling and TypeScript type safety.

### TKT-2025-005

Implemented complete UI component suite for fetchAccountTests including main dashboard page, individual test detail page, and shared components for data visualization, charts, and performance metrics.
