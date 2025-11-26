# Completed Tickets

- _None yet_

---

# Ticket – TKT-2025-024

---

ID: TKT-2025-024
Status: Draft
Priority: High
Owner: Frontend Team
Created: 2025-11-21
Updated: 2025-11-22
Related: Roadmap-Club-Admin-Detail, Epic-Club-Admin

---

## Overview

Integrate the Club Admin Detail API endpoint (`/api/club/admin/:id`) into the frontend application following existing association/competition detail patterns (service, hook, types, and route). This endpoint provides a bundled, read-only snapshot of a single club, including its core data, statistics, associations, teams, competitions, accounts, and insights for admin-only review.

## What We Need to Do

Build a complete integration pathway (types, service, hook, and page) to power the `/dashboard/club/[id]` route, enabling admins to deeply inspect a single club and fan that data out into sections/tabs (overview, associations, teams, competitions, accounts, insights).

## Phases & Tasks

### Phase 1: Type Definitions ✅

#### Tasks

- [x] Create `src/types/clubAdminDetail.ts` with all TypeScript interfaces from `SingleClubNotes.md`
- [x] Define `ClubAdminDetailResponse` as the main response wrapper
- [x] Define `ClubAdminDetailPayload` with root fields (club, statistics, associations, teams, competitions, accounts, insights, meta)
- [x] Define `ClubCore` with core club data (id, name, sport, href, logoUrl, playHqId, parentLogo, contactDetails, location, website, isActive, hasPlayhqLogoStored, timestamps)
- [x] Define `ClubStatistics` structure (associations, teams, competitions, grades, accounts, trial)
- [x] Define `ClubAssociationDetail`, `ClubTeamDetail`, `ClubCompetitionDetail`, `ClubAccountSummary`
- [x] Define `ParticipationMethod` union type and competition `timeline` structure
- [x] Define `ClubInsights` (competitionTimeline, activityPatterns, growthTrends, competitionStartDates)
- [x] Define `ClubDetailMeta` (generatedAt, dataPoints, performance)
- [x] Export all types for use in services, hooks, and components

### Phase 2: Service Layer ✅

#### Tasks

- [x] Create `src/lib/services/club/fetchClubAdminDetail.ts` service function
- [x] Implement function that accepts required numeric `id` parameter
- [x] Use `axiosInstance` from `@/lib/axios` for API calls
- [x] Call endpoint: `/api/club/admin/${id}`
- [x] Validate ID is numeric, finite, positive integer before making request
- [x] Implement proper error handling for 400 (invalid ID - non-numeric), 404 (not found), and 500 (server error)
- [x] Add `"use server"` directive for Next.js server-side execution
- [x] Log key details (endpoint, ID, error context) in line with other services
- [x] Update `src/lib/services/readMe.md` and add `src/lib/services/club/readMe.md` to document the new service

### Phase 3: React Query Hook ✅

#### Tasks

- [x] Create `src/hooks/club/useClubAdminDetail.ts` hook
- [x] Use `useQuery` from `@tanstack/react-query`
- [x] Implement query key: `['club-admin-detail', id]` for proper cache scoping
- [x] Set `staleTime: 5 * 60 * 1000` (5 minutes) and `gcTime: 10 * 60 * 1000` (10 minutes)
- [x] Configure retry logic (3 retries with exponential backoff)
- [x] Disable query when `id` is null, undefined, or invalid (non-numeric / non-positive)
- [x] Return `UseQueryResult<ClubAdminDetailResponse, Error>`

### Phase 4: Page Integration (Initial) ⏳

#### Tasks

- [x] Create `/dashboard/club/[id]/page.tsx` entry point
- [x] Extract `id` from route params using Next.js `useParams`
- [x] Convert `id` to number and validate it's numeric
- [x] Use `useClubAdminDetail` hook with validated ID
- [x] Implement loading state at page level using existing `LoadingState` and scaffolding containers
- [x] Implement error state at page level (400, 404, 500, invalid ID) using `ErrorState`
- [x] Handle invalid ID gracefully (show “Invalid club ID” with guidance)
- [x] Render a basic success state (JSON preview or simple sections) as a first integration step

### Phase 5: UI Components (Club Review Experience) ⏳

#### Tasks

- [x] Create `src/app/dashboard/club/[id]/components/` folder structure
- [x] Design components mirroring association detail patterns:
  - [x] `ClubHeader.tsx` – core club header (name, sport, logos, contact, location, website, active status)
  - [x] `StatisticsOverview.tsx` – club-level statistics cards (associations, teams, competitions, grades, accounts, trial)
  - [x] `AssociationsList.tsx` – associations table/list with competitionCount and teamCount
  - [x] `TeamsList.tsx` – teams table with competition + grade context
  - [x] `CompetitionsList.tsx` – competitions list with timeline progress and participation method
  - [x] `AccountsList.tsx` – linked account summary table/cards
  - [x] `InsightsSection.tsx` – insights and charts placeholder leveraging `ClubInsights`
- [x] Implement empty states for each section where applicable
- [x] Reuse `PageContainer`, `SectionContainer`, and existing UI primitives for layout by wiring components into `/dashboard/club/[id]/page.tsx`

### Phase 6: Insights & Polish ⏳

#### Tasks

- [x] Implement basic charts/timelines for `competitionTimeline`, `activityPatterns`, and `growthTrends` in `InsightsSection.tsx` using shared chart primitives
- [x] Add views for upcoming vs recent competition start dates using `competitionStartDates` (top 5 in each list) with association labels where available
- [ ] Optimise for large payloads (virtualization, lazy loading, or pagination where needed)
- [ ] Add cross-links to association and competition detail pages using IDs from the payload
- [x] Ensure handling for null/optional fields across all sections via optional chaining and empty/placeholder states

## Constraints, Risks, Assumptions

- **Constraints**:

  - API endpoint currently has `auth: false` (frontend will rely on admin UI auth)
  - Response can be large depending on number of competitions/teams/associations
  - ID must be numeric (Strapi returns 400 on non-numeric IDs)

- **Risks**:

  - Large responses may impact initial load performance for very active clubs
  - Many optional fields (contactDetails, location, website, dates) require careful null handling
  - Insights visualisations may need performance tuning with large time series

- **Assumptions**:
  - Endpoint contract stays aligned with `SingleClubNotes.md`
  - Existing association/competition detail patterns can be reused for consistency
  - Admin users accessing this route have permission to view club-level detail

---

# Summaries of Completed Tickets

- _None yet_
