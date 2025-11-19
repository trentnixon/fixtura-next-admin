# Completed Tickets

- _None yet_

---

# Ticket – TKT-2025-023

---

ID: TKT-2025-023
Status: Draft
Priority: High
Owner: Frontend Team
Created: 2025-01-27
Updated: 2025-01-27
Related: Roadmap-Association-Detail, Epic-Association-Admin

---

## Overview

Integrate the Association Admin Detail API endpoint (`/api/association/admin/:id`) into the frontend application following established service/hook/component patterns. This endpoint provides comprehensive detailed information about a single association by ID, including all core association data, relational data (competitions, clubs, grades, accounts), detailed statistics, and formatted responses for all related entities.

## What We Need to Do

Build a complete data integration layer (types, service, hook) and UI components to display association detail on the `/dashboard/association/[id]` page, providing a comprehensive single-association admin view with statistics, competitions, clubs, accounts, and insights.

## Phases & Tasks

### Phase 1: Type Definitions ✅

#### Tasks

- [x] Create `src/types/associationDetail.ts` with all TypeScript interfaces from HandoverFromCMS.md
- [x] Define `AssociationDetailResponse` as the main response wrapper
- [x] Define `AssociationDetail` interface with core association data (id, name, sport, href, logoUrl, playHqId, contactDetails, location, website, isActive, timestamps)
- [x] Define `ContactDetails`, `Location`, `Coordinates`, `Website` interfaces
- [x] Define `AssociationStatistics` interface with nested statistics (competitions, grades, clubs, teams, accounts, trial)
- [x] Define `CompetitionStatistics`, `GradeStatistics`, `ClubStatistics`, `TeamStatistics`, `AccountStatistics`, `TrialStatus` interfaces
- [x] Define `CompetitionDetail` interface with timeline, grades, and clubs
- [x] Define `CompetitionTimeline` interface (status, daysTotal, daysElapsed, daysRemaining, progressPercent)
- [x] Define `GradeDetail` and `CompetitionClubDetail` interfaces
- [x] Define `ClubDetail` interface with competition and team counts
- [x] Define `AccountDetail` interface with accountType and subscriptionTier
- [x] Define `AccountType` and `SubscriptionTier` interfaces
- [x] Define `InsightsData` interface (currently empty, reserved for Phase 8)
- [x] Define `Metadata` interface for response metadata and performance metrics
- [x] Export all types for use in services and hooks

### Phase 2: Service Layer ✅

#### Tasks

- [x] Create `src/lib/services/association/fetchAssociationDetail.ts` service function
- [x] Implement function that accepts required `id` parameter (number)
- [x] Use `axiosInstance` from `@/lib/axios` for API calls
- [x] Call endpoint: `/api/association/admin/${id}`
- [x] Implement proper error handling for 400 (invalid ID - non-numeric) and 404 (not found) errors
- [x] Implement proper error handling for 500 (server error) responses
- [x] Add "use server" directive for Next.js server-side execution
- [x] Add comprehensive error logging following existing service patterns
- [x] Validate ID is numeric before making request
- [x] Update `src/lib/services/association/readMe.md` documentation to include new service
- [x] Update main services readMe.md to reference association detail service

### Phase 3: React Query Hook ✅

#### Tasks

- [x] Create `src/hooks/association/useAssociationDetail.ts` hook
- [x] Use `useQuery` from `@tanstack/react-query`
- [x] Implement query key: `['association-detail', id]` for proper cache invalidation
- [x] Set `staleTime: 5 * 60 * 1000` (5 minutes) as recommended in handover
- [x] Set `gcTime: 10 * 60 * 1000` (10 minutes) for garbage collection
- [x] Configure retry logic (3 retries with exponential backoff)
- [x] Disable query when `id` is null, undefined, or invalid (not numeric)
- [x] Return `UseQueryResult<AssociationDetailResponse, Error>`
- [x] Update main hooks readMe.md to include association detail hook

### Phase 3.5: Test Page Implementation ✅

#### Tasks

- [x] Create `src/app/dashboard/association/[id]/page.tsx` test page
- [x] Extract `id` from route params using Next.js `useParams`
- [x] Convert `id` to number and validate it's numeric
- [x] Use `useAssociationDetail` hook with validated ID
- [x] Display JSON response for testing and verification
- [x] Implement loading state handling
- [x] Implement error state handling (400, 404, 500, invalid ID)
- [x] Add quick preview section with key data points
- [x] Use existing PageContainer and SectionContainer components for layout

### Phase 4: UI Components

#### Tasks

- [x] Create `src/app/dashboard/association/[id]/components/` folder structure
- [x] Build components as outlined in Phase 4.1 (see detailed breakdown below)
- [x] Create placeholder components with basic structure (AssociationHeader, StatisticsOverview, CompetitionsList, CompetitionCard, ClubsList, ClubCard, AccountsList, AccountCard, InsightsSection, MetadataCard)
- [ ] Use existing component library components (cards, tables, badges, charts, etc.)
- [ ] Implement proper null handling for optional fields (contactDetails, location, website, coordinates, trial, dates)
- [ ] Add loading skeletons/spinners for all components
- [ ] Add error state displays with retry functionality
- [ ] Ensure all components handle empty states gracefully
- [ ] Implement timeline visualization for competitions (progress bars, status badges, countdown timers)

### Phase 4.1: Component & Section Planning

**Header Section** (`AssociationDetail`) ✅

- `AssociationHeader.tsx` ✅ - Main association header component
  - ✅ Association name, sport, logo
  - ✅ Contact details (phone, email, address) - handle null
  - ✅ Location information (address, city, state, country, coordinates) - handle null
  - ✅ Website link - handle null
  - ✅ Active status badge
  - ✅ PlayHQ link (if available)

**Statistics Overview Section** (`AssociationStatistics`) ✅

- `StatisticsOverview.tsx` ✅ - Main statistics overview card
  - ✅ Competition statistics (total, active, upcoming, completed, byStatus breakdown)
  - ✅ Grade statistics (total, withTeams, withoutTeams)
  - ✅ Club statistics (total, active, withCompetitions)
  - ✅ Team statistics (total, acrossCompetitions, acrossGrades)
  - ✅ Account statistics (total, active, withOrders)
  - ✅ Trial status indicator (if applicable)

**Competitions Section** (`CompetitionDetail[]`) ✅

- `CompetitionsList.tsx` ✅ - Main competitions list component
  - ✅ Display competitions sorted by timeline status (upcoming → in_progress → completed → unknown)
  - ✅ Competition cards with:
    - ✅ Name, season, status, active badge
    - ✅ Start/end dates (handle null)
    - ✅ Timeline progress (status, daysTotal, daysElapsed, daysRemaining, progressPercent)
    - ✅ Grade count, team count, club count
    - ✅ PlayHQ URL link (if available)
    - ✅ Nested grades list (GradeDetail[]) - collapsible
    - ✅ Nested clubs list (CompetitionClubDetail[]) - collapsible
  - ✅ Empty state handling
  - ✅ Timeline visualization (progress bars, status badges with color coding)

**Clubs Section** (`ClubDetail[]`) ✅

- `ClubsList.tsx` ✅ - Main clubs list component
  - ✅ Display clubs sorted by team count (descending), then alphabetically
  - ✅ Club cards with:
    - ✅ Name, sport, logo
    - ✅ Competition count, team count
    - ✅ Active status badge
    - ✅ PlayHQ link (if available)
  - ✅ Empty state handling
  - ✅ Responsive grid layout (1 col mobile, 2 cols tablet, 3 cols desktop)

**Accounts Section** (`AccountDetail[]`) ✅

- `AccountsList.tsx` ✅ - Main accounts list component
  - ✅ Display accounts sorted by lastName, firstName, then creation date
  - ✅ Account cards with:
    - ✅ Name (firstName, lastName), email (with mailto link)
    - ✅ Account type badge, subscription tier badge
    - ✅ Active status badge, setup status indicator
    - ✅ Active order indicator badge
  - ✅ Empty state handling
  - ✅ Responsive grid layout (1 col mobile, 2 cols tablet, 3 cols desktop)

**Insights Section** (`InsightsData`) ✅

- `InsightsSection.tsx` ✅ - Insights placeholder component
  - ✅ Currently empty object (`{}`) - handled gracefully
  - ✅ Phase 8 deferred - displays "coming soon" message
  - ✅ Structure defined in types for future implementation
  - ✅ Display message indicating insights coming soon with EmptyState component
  - ✅ Checks for insights data and handles both empty and populated states

**Component Structure:**

```
components/
├── AssociationHeader.tsx ✅ (placeholder)
├── StatisticsOverview.tsx ✅ (placeholder)
├── CompetitionsList.tsx ✅ (placeholder)
├── CompetitionCard.tsx ✅ (placeholder - nested component)
├── ClubsList.tsx ✅ (placeholder)
├── ClubCard.tsx ✅ (placeholder - nested component)
├── AccountsList.tsx ✅ (placeholder)
├── AccountCard.tsx ✅ (placeholder - nested component)
├── InsightsSection.tsx ✅ (placeholder)
└── MetadataCard.tsx ✅ (placeholder)
```

**Page Layout Structure:**

1. Association Header (AssociationHeader)
2. Statistics Overview (StatisticsOverview)
3. Competitions Section (CompetitionsList with CompetitionCard components)
4. Clubs Section (ClubsList with ClubCard components)
5. Accounts Section (AccountsList with AccountCard components)
6. Insights Section (InsightsSection - placeholder)
7. Metadata Section (MetadataCard - optional, collapsible)

### Phase 5: Page Integration ✅

#### Tasks

- [x] Create `src/app/dashboard/association/[id]/page.tsx` entry point
- [x] Extract `id` from route params using Next.js `useParams`
- [x] Convert `id` to number and validate it's numeric
- [x] Use `useAssociationDetail` hook with validated ID
- [x] Integrate all UI components (AssociationHeader, StatisticsOverview, CompetitionsList, ClubsList, AccountsList, InsightsSection, MetadataCard)
- [x] Implement loading state handling at page level
- [x] Implement error state handling at page level (400, 404, 500)
- [x] Handle invalid ID gracefully (show error message)
- [x] Use existing PageContainer and SectionContainer components for layout
- [x] Organize sections in logical order (Header → Statistics → Competitions → Clubs → Accounts → Insights → Metadata)
- [ ] Add navigation breadcrumbs linking back to `/dashboard/association`

### Phase 6: Testing & Polish

#### Tasks

- [ ] Test with valid association ID - verify all data sections are populated
- [ ] Test with invalid ID (non-numeric) - verify 400 error handling
- [ ] Test with non-existent ID - verify 404 error handling
- [ ] Test with minimal data - association with no competitions/clubs/accounts
- [ ] Test logo fallbacks - verify default logo appears when no Logo/PlayHQLogo exists
- [ ] Test timeline calculations - verify progress percentages and status values
- [ ] Test null handling - verify UI handles null values gracefully (contactDetails, location, website, coordinates, dates, trial)
- [ ] Test performance - monitor response times with associations that have many relations (100-500KB responses)
- [ ] Test loading states during ~150-300ms API response time
- [ ] Test error states (network errors, 500 responses)
- [ ] Test responsive design on mobile/tablet/desktop
- [ ] Verify sorting:
  - Competitions: timeline status → start date
  - Clubs: team count (desc) → name (asc)
  - Accounts: lastName (asc) → firstName (asc) → creation date (desc)
- [ ] Test virtualization/lazy loading for large lists if implemented

## Implementation Notes

### Key Considerations from Handover

- **Response Size**: Can be large (100-500KB) depending on number of competitions, clubs, and grades
- **Timeline Data**: Competition `timeline.status` values: `"upcoming"`, `"in_progress"`, `"completed"`, `"unknown"`
- **Null Handling**: Many fields can be null (contactDetails, location, website, coordinates, trial, dates)
- **Logo URLs**: Always return string (never null) with fallback logic: `Logo.url` → `PlayHQLogo.url` → default logo
- **Performance**: Typical response time: 150-300ms, includes performance metrics in `meta.performance`
- **Sorting**: Competitions by timeline status → start date, Clubs by team count → name, Accounts by lastName → firstName → creation date
- **Insights Field**: Currently empty (`{}`), Phase 8 deferred, can be safely ignored

### Patterns to Follow

- Follow existing service patterns from `fetchAssociationInsights.ts`
- Follow existing hook patterns from `useAssociationInsights.ts`
- Follow existing component patterns from `CompetitionAdminDetail.tsx`
- Use existing scaffolding components (PageContainer, SectionContainer, ElementContainer)
- Use existing UI components (cards, tables, badges, charts)
- Follow error handling patterns from other detail pages

## Constraints, Risks, Assumptions

- **Constraints**:

  - API endpoint currently has `auth: false` (authentication will be added later)
  - Response can be large (100-500KB) when association has many relations
  - Typical response time: 150-300ms depending on data size
  - ID must be numeric (validated in service layer)

- **Risks**:

  - Large response size may impact initial load performance - consider lazy loading/virtualization
  - Need to handle null values properly (contactDetails, location, website, coordinates, dates, trial)
  - Timeline calculations depend on valid date fields - handle null dates gracefully
  - Competition/club/account arrays can be large - consider pagination or virtualization

- **Assumptions**:
  - API endpoint is available and stable
  - Component library has all necessary UI components (cards, tables, badges, progress bars, dropdowns)
  - Existing patterns from other detail pages (competitions, accounts) can be followed for consistency
  - Logo fallback logic works as documented (Logo.url → PlayHQLogo.url → default logo)

---

# Summaries of Completed Tickets

- _None yet_
