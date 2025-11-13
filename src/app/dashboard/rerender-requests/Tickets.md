# Tickets – ReRender Requests

## Completed Tickets

- (None yet)

---

# TKT-2025-010: ReRender Requests Implementation

---

ID: TKT-2025-010
Status: In Progress
Priority: High
Owner: Frontend Team
Created: 2025-01-27
Updated: 2025-01-27
Related: ADMIN_ROUTES.md

---

## Overview

Implement a complete re-render requests management interface for viewing and managing re-render requests from the CMS. This includes TypeScript types, API service integration, React Query hooks, and a comprehensive UI dashboard with both list and detail views.

## What We Need to Do

Build a fully functional re-render requests dashboard that displays all re-render requests from the CMS with proper data fetching, caching, error handling, and a user-friendly interface for viewing request details and marking requests as handled.

## Phases & Tasks

### Phase 1: Type Definitions

- [x] Create TypeScript type definitions file (`src/types/rerender-request.ts`)
- [x] Define `RerenderRequestStatus` enum type ("Pending" | "Processing" | "Completed" | "Rejected")
- [x] Define `RerenderRequest` interface with all fields from API (list view response)
- [x] Define `RerenderRequestDetail` interface with all fields from API (detail view response including account and render objects)
- [x] Define `RerenderRequestAdminResponse` interface for list API response wrapper with meta
- [x] Define `RerenderRequestDetailResponse` interface for detail API response wrapper
- [x] Define `MarkHandledResponse` interface for mark-handled API response
- [x] Define `RerenderRequestErrorResponse` interface for error handling
- [x] Export all types from the types file

### Phase 2: API Service Integration

- [x] Create service function (`src/lib/services/rerender-request/fetchRerenderRequests.ts`)
- [x] Implement server action with `"use server"` directive
- [x] Use axios instance to call `/api/rerender-request/admin/all` endpoint
- [x] Add proper error handling with AxiosError catching
- [x] Add logging for debugging and monitoring
- [x] Return properly typed response data
- [x] Create service function (`src/lib/services/rerender-request/fetchRerenderRequestById.ts`)
- [x] Implement server action with `"use server"` directive
- [x] Use axios instance to call `/api/rerender-request/admin/:id` endpoint
- [x] Add proper error handling with AxiosError catching
- [x] Add logging for debugging and monitoring
- [x] Return properly typed response data
- [x] Create service function (`src/lib/services/rerender-request/markRerenderRequestHandled.ts`)
- [x] Implement server action with `"use server"` directive
- [x] Use axios instance to call `/api/rerender-request/admin/:id/mark-handled` endpoint (PUT)
- [x] Add proper error handling with AxiosError catching
- [x] Add logging for debugging and monitoring
- [x] Return properly typed response data

### Phase 3: React Query Hooks

- [x] Create hook file (`src/hooks/rerender-request/useRerenderRequests.ts`)
- [x] Implement `useRerenderRequests` hook using TanStack Query for list view
- [x] Set up query key: `["rerenderRequests", "admin", "all"]`
- [x] Configure staleTime (1-5 minutes recommended)
- [x] Configure refetchInterval (5 minutes for real-time updates)
- [x] Add retry logic with exponential backoff
- [x] Create `useRerenderRequestsData` convenience hook that returns just the data array and total count
- [x] Add proper TypeScript return types
- [x] Create hook file (`src/hooks/rerender-request/useRerenderRequestById.ts`)
- [x] Implement `useRerenderRequestById` hook using TanStack Query for detail view
- [x] Set up query key: `["rerenderRequest", "admin", id]`
- [x] Configure staleTime (1-2 minutes recommended)
- [x] Add retry logic with exponential backoff
- [x] Add proper TypeScript return types
- [x] Create hook file (`src/hooks/rerender-request/useMarkRerenderRequestHandled.ts`)
- [x] Implement `useMarkRerenderRequestHandled` mutation hook using TanStack Query
- [x] Set up mutation function to call mark-handled service
- [x] Add cache invalidation for both list and detail queries on success
- [x] Add optimistic updates for better UX
- [x] Add proper error handling and retry logic
- [x] Add proper TypeScript return types

### Phase 4: UI Components - List View

- [x] Create components folder (`src/app/dashboard/rerender-requests/components/`)
- [x] Create `RerenderRequestTable.tsx` component
- [x] Display request list with key fields (ID, account name, render name, reason, status, user email, created date)
- [x] Add loading state UI (handled in page component - Phase 6)
- [x] Add error state UI with user-friendly messages (handled in page component - Phase 6)
- [x] Add empty state UI when no requests exist
- [x] Add status badges with color coding (Pending/Processing/Completed/Rejected)
- [x] Add timestamp formatting for better readability
- [x] Add hasBeenHandled indicator/badge
- [x] Add link to detail page for each request
- [x] Implement responsive design for mobile/tablet views
- [x] Create `RerenderRequestStats.tsx` component (optional)
- [x] Display summary statistics (total, pending, handled, etc.)

### Phase 5: UI Components - Detail View

- [x] Create detail page folder (`src/app/dashboard/rerender-requests/[id]/`)
- [x] Create `page.tsx` for detail route
- [x] Implement data fetching using `useRerenderRequestById` hook
- [x] Add loading state UI
- [x] Add error state UI with retry functionality
- [x] Add empty state UI when request not found
- [x] Create `RerenderRequestDetail.tsx` component
- [x] Display full request details including account and render information
- [x] Show all fields: reason, userEmail, additionalNotes, status, hasBeenHandled, timestamps
- [x] Display account details (name, email, ID)
- [x] Display render details (name, complete status, processing status, ID)
- [x] Add links to account and render detail pages
- [x] Create `RerenderRequestActions.tsx` component
- [x] Add "Mark as Handled" button with confirmation dialog
- [x] Integrate with `useMarkRerenderRequestHandled` mutation
- [x] Show loading state during mutation
- [x] Show success/error notifications
- [x] Disable button if already handled

### Phase 6: Page Integration

- [x] Update `src/app/dashboard/rerender-requests/page.tsx` to use the new hooks
- [x] Replace "Coming Soon" placeholder with actual UI
- [x] Integrate table component with data from hook
- [x] Add proper error boundaries
- [x] Add SectionContainer for stats (if implemented)
- [x] Add SectionContainer for table
- [x] Test full data flow from API to UI for list view (ready for testing)
- [x] Test full data flow from API to UI for detail view (ready for testing)
- [x] Test mark as handled mutation flow (ready for testing)

### Phase 7: Polish & Enhancement

- [x] Add filtering by status (Pending/Processing/Completed/Rejected)
- [x] Add filtering by hasBeenHandled (handled/unhandled)
- [x] Add search functionality (by account name, render name, user email)
- [x] Add sorting capabilities (by date, status, account name, etc.)
- [x] Add pagination if needed (if dataset grows large)
- [x] Add refresh button for manual data refresh
- [x] Add request count summary cards (completed in Phase 4)
- [x] Improve accessibility (ARIA labels, keyboard navigation)
- [x] Add loading skeletons instead of simple loading text (using LoadingState skeleton variant)
- [x] Add confirmation dialogs for destructive actions (completed in Phase 5)
- [x] Add toast notifications for success/error states (completed in Phase 5)
- [ ] Consider adding bulk actions (mark multiple as handled) - Future enhancement

## Constraints, Risks, Assumptions

### Constraints

- API endpoints follow standard REST patterns
- API returns all requests at once for list view - no pagination currently available
- Additional notes field can be long - need to handle truncation in table view
- Status field is a string - need to validate against expected values

### Risks

- Large datasets may cause performance issues if all requests are loaded at once
- API response structure may change if backend updates are made
- Account and render data in detail view may be null if relationships are missing
- Concurrent updates may cause cache inconsistencies

### Assumptions

- Strapi CMS API is accessible at `NEXT_APP_API_BASE_URL` environment variable
- API endpoints `/api/rerender-request/admin/all`, `/api/rerender-request/admin/:id`, and `/api/rerender-request/admin/:id/mark-handled` are functional and return expected data structure
- React Query is already configured in the application
- UI components library (shadcn/ui) is available for building interface
- Account and render detail pages exist for linking

## Notes

- Reference API documentation in `ADMIN_ROUTES.md` for complete endpoint details
- Follow existing patterns from `src/hooks/contact-form/` and `src/lib/services/contact-form/` for consistency
- Use TypeScript strictly for type safety
- Ensure proper error handling at all levels (service, hook, component)
- Consider future enhancements like filtering, bulk operations, export functionality
- Detail page should link to account and render detail pages when available
- Mark as handled action should provide clear feedback to user
