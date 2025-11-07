# Tickets – Contact Form Mailbox

## Completed Tickets

- (None yet)

---

# TKT-2025-009: Contact Form Mailbox Implementation

---

ID: TKT-2025-009
Status: In Progress
Priority: High
Owner: Frontend Team
Created: 2025-01-27
Updated: 2025-01-27
Related: Backend Ticket TKT-2025-008

---

## Overview

Implement a complete contact form mailbox interface for viewing and managing contact form submissions from the CMS. This includes TypeScript types, API service integration, React Query hooks, and a comprehensive UI dashboard.

## What We Need to Do

Build a fully functional contact form submissions dashboard that displays all contact form submissions from the CMS with proper data fetching, caching, error handling, and a user-friendly interface for viewing submission details.

## Phases & Tasks

### Phase 1: Type Definitions

- [x] Create TypeScript type definitions file (`src/types/contact-form.ts`)
- [x] Define `ContactFormStatus` enum type ("New" | "Read" | "Resolved")
- [x] Define `ContactFormSubmission` interface with all fields from API
- [x] Define `ContactFormAdminResponse` interface for API response wrapper
- [x] Define `ContactFormErrorResponse` interface for error handling
- [x] Export all types from the types file

### Phase 2: API Service Integration

- [x] Create service function (`src/lib/services/contact-form/fetchContactFormSubmissions.ts`)
- [x] Implement server action with `"use server"` directive
- [x] Use axios instance to call `/api/contact-form/admin/all` endpoint
- [x] Add proper error handling with AxiosError catching
- [x] Add logging for debugging and monitoring
- [x] Return properly typed response data

### Phase 3: React Query Hook

- [x] Create hook file (`src/hooks/contact-form/useContactFormSubmissions.ts`)
- [x] Implement `useContactFormSubmissions` hook using TanStack Query
- [x] Set up query key: `["contactForms", "admin", "all"]`
- [x] Configure staleTime (1-5 minutes recommended)
- [x] Configure refetchInterval (5 minutes for real-time updates)
- [x] Add retry logic with exponential backoff
- [x] Create `useContactFormSubmissionsData` convenience hook that returns just the data array and total count
- [x] Add proper TypeScript return types

### Phase 4: UI Components

- [x] Create contact form submissions table component
- [x] Display submission list with key fields (ID, name, email, subject, status, timestamp)
- [x] Add loading state UI
- [x] Add error state UI with user-friendly messages
- [x] Add empty state UI when no submissions exist
- [ ] Implement submission detail view/modal
- [x] Add status badges with color coding (New/Read/Resolved)
- [x] Add timestamp formatting for better readability
- [x] Add hasSeen and Acknowledged indicators
- [x] Implement responsive design for mobile/tablet views

### Phase 5: Page Integration

- [x] Update `src/app/dashboard/contact/page.tsx` to use the new hook
- [x] Replace "Coming Soon" placeholder with actual UI
- [x] Integrate table component with data from hook
- [x] Add proper error boundaries
- [ ] Test full data flow from API to UI

### Phase 6: Polish & Enhancement

- [ ] Add filtering by status (New/Read/Resolved)
- [ ] Add search functionality (by name, email, subject)
- [ ] Add sorting capabilities (by date, status, etc.)
- [ ] Add pagination if needed (if dataset grows large)
- [ ] Add refresh button for manual data refresh
- [ ] Add submission count summary cards
- [ ] Improve accessibility (ARIA labels, keyboard navigation)
- [ ] Add loading skeletons instead of simple loading text

## Constraints, Risks, Assumptions

### Constraints

- API endpoint currently has `auth: false` - authentication will be added in Phase 4 of backend ticket (TKT-2025-008)
- API returns all submissions at once - no pagination currently available
- Text field can be long - need to handle truncation in table view

### Risks

- Large datasets may cause performance issues if all submissions are loaded at once
- No authentication currently - endpoint is publicly accessible (will be fixed in backend Phase 4)
- API response structure may change when authentication is added

### Assumptions

- Strapi CMS API is accessible at `NEXT_APP_API_BASE_URL` environment variable
- API endpoint `/api/contact-form/admin/all` is functional and returns expected data structure
- React Query is already configured in the application
- UI components library (shadcn/ui) is available for building interface

## Notes

- Reference API documentation in `Untitled-1` for complete endpoint details
- Follow existing patterns from `src/hooks/analytics/` and `src/lib/services/analytics/` for consistency
- Use TypeScript strictly for type safety
- Ensure proper error handling at all levels (service, hook, component)
- Consider future enhancements like marking submissions as read, replying to submissions, etc.
