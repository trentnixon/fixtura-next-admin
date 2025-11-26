# Completed Tickets

- TKT-2025-021

---

# Ticket – TKT-2025-022

## Overview

Deliver the club data lookup and insight experience under `/dashboard/club` using the Club Admin Insights API endpoint (`GET /api/club/admin/insights`).

## What We Need to Do

Provide a comprehensive club insights dashboard with sport filtering, overview statistics, distributions, club listings, and competition timelines. Integrate with existing single club detail page (`/dashboard/club/[id]`).

## Phases & Tasks

### Phase 1: Data Infrastructure ✅

- [x] Implement service layer function `fetchClubInsights.ts`
- [x] Create React Query hook `useClubInsights.ts`
- [x] Define TypeScript models for API responses (`clubInsights.ts`)
- [x] Export types from `src/types/index.ts`

### Phase 2: Core UI Components

#### 2.1 Filter Component

- [ ] Create `SportFilter.tsx` component
  - Required sport filter (not optional like association insights)
  - Options: Cricket, AFL, Hockey, Netball, Basketball
  - Default: Cricket
  - Updates query when changed
  - Visual indicator that sport is required

#### 2.2 Overview Statistics Section (`ClubOverview`)

- [ ] Create `OverviewStatsCard.tsx` component
  - Display total clubs, active/inactive counts
  - Account coverage metrics (clubs with/without accounts)
  - Association count
  - Average teams per club
  - Average competitions per club
  - Sport display
  - Grid layout with stat cards

#### 2.3 Distributions Section (`Distributions`)

- [ ] Create `DistributionsCard.tsx` component
  - Clubs by Teams Distribution (`clubsByTeams`)
    - Zero, 1-5, 6-10, 11-20, 21+ ranges
  - Clubs by Competitions Distribution (`clubsByCompetitions`)
    - Zero, 1, 2-3, 4-6, 7+ ranges
  - Clubs by Associations Distribution (`clubsByAssociations`)
    - Zero, 1, 2-3, 4+ ranges
  - Clubs by Account Coverage Distribution (`clubsByAccountCoverage`)
    - With accounts, without accounts, with trials
  - Use bar charts or stat grids for visual representation

#### 2.4 Teams Insights Section (`TeamsInsights`)

- [ ] Create `TeamsInsightsCard.tsx` component
  - Total teams across all clubs
  - Average teams per club
  - Simple stat card layout

#### 2.5 Accounts Insights Section (`AccountsInsights`)

- [ ] Create `AccountsInsightsCard.tsx` component
  - Total accounts
  - Active accounts (currently null, handle gracefully)
  - Clubs with accounts count
  - Clubs with trials count
  - Clubs with active trials count
  - Grid layout with stat cards

#### 2.6 Competition Timeline Section (`Insights.competitionTimeline`)

- [ ] Create `CompetitionTimelineCard.tsx` component
  - Monthly timeline visualization
  - Show competitions starting, ending, and active per month
  - Format: "YYYY-MM" (e.g., "2024-09")
  - Use line chart or timeline visualization
  - Sort chronologically

#### 2.7 Clubs Table Section (`Club[]`)

- [ ] Create `ClubsTable.tsx` component
  - Display all clubs for selected sport (no pagination from API)
  - Implement client-side pagination or virtual scrolling (7,000+ clubs possible)
  - Columns:
    - Logo (logoUrl)
    - Name (name)
    - Sport (sport)
    - Associations (associationNames array, associationCount)
    - Teams (teamCount)
    - Competitions (competitionCount)
    - Account Status (hasAccount badge)
    - Actions (link to `/dashboard/club/[id]`)
  - Sortable columns
  - Search/filter functionality (client-side)
  - Responsive table layout

#### 2.8 Metadata & Performance Section (`Meta`)

- [ ] Create `MetadataCard.tsx` component
  - Generated At timestamp (generatedAt)
  - Sport filter display
  - Data Points Summary (clubs, associations, competitions, teams, accounts)
  - Performance Metrics (fetchTimeMs, calculationTimeMs, totalTimeMs)
  - Collapsible or footer placement

#### 2.9 Data Wrapper Component

- [ ] Create `DataWrapper.tsx` component
  - Centralized loading state handler
  - Error state handler with retry functionality
  - Empty/no data state handler
  - Wraps all content sections

**Component Structure:**

```
components/
├── SportFilter.tsx
├── DataWrapper.tsx
├── OverviewStatsCard.tsx
├── DistributionsCard.tsx
├── TeamsInsightsCard.tsx
├── AccountsInsightsCard.tsx
├── CompetitionTimelineCard.tsx
├── ClubsTable.tsx
└── MetadataCard.tsx
```

### Phase 3: Page Integration

- [ ] Update `src/app/dashboard/club/page.tsx` to use `useClubInsights` hook
- [ ] Add state management for selected sport filter (default: Cricket, required)
- [ ] Integrate all UI components in logical order:
  1. Sport Filter (top of page, required indicator)
  2. Overview Section (OverviewStatsCard)
  3. Distributions Section (DistributionsCard)
  4. Teams Insights Section (TeamsInsightsCard)
  5. Accounts Insights Section (AccountsInsightsCard)
  6. Competition Timeline Section (CompetitionTimelineCard)
  7. Clubs Table Section (ClubsTable with pagination/virtual scrolling)
  8. Metadata Section (MetadataCard - optional, collapsible)
- [ ] Implement loading state handling at page level (via DataWrapper)
- [ ] Implement error state handling at page level (via DataWrapper)
- [ ] Replace placeholder content with actual data-driven UI
- [ ] Add navigation links to single club detail page (`/dashboard/club/[id]`)

### Phase 4: Performance Optimization

- [ ] Implement virtual scrolling or pagination for ClubsTable (handle 7,000+ clubs)
- [ ] Add debouncing for search/filter in ClubsTable
- [ ] Optimize re-renders with React.memo where appropriate
- [ ] Test with large datasets (Cricket has 7,328 clubs)

### Phase 5: QA & Rollout

- [ ] Test empty, loading, and error states
- [ ] Test with all sport filters (Cricket, AFL, Hockey, Netball, Basketball)
- [ ] Test navigation to single club detail page
- [ ] Test client-side pagination/virtual scrolling with large datasets
- [ ] Verify responsive design (mobile, tablet, desktop)
- [ ] Document data sources, known constraints, and follow-ups
- [ ] Update roadmap and close tickets with findings

## Constraints, Risks, Assumptions

### Constraints

- Sport parameter is **required** (unlike association insights where it's optional)
- No pagination from API - all clubs returned in single response (can be 7,000+)
- Response times: 300-500ms typical, may vary with dataset size
- Competition timeline format: "YYYY-MM" (e.g., "2024-09")

### Risks

- Large club lists (7,000+ clubs) may cause performance issues without virtual scrolling/pagination
- Inconsistent club data across associations could affect filtering accuracy
- Account active status currently null in API response

### Assumptions

- Club data structure aligns with single club detail endpoint (`/dashboard/club/[id]`)
- Users will primarily filter by sport (required parameter)
- Client-side pagination/virtual scrolling acceptable for large lists
- Competition timeline data is sorted chronologically by month

## Related Endpoints

- **Single Club Detail**: `GET /api/club/admin/:id` - Detailed information for a specific club
- See `src/app/dashboard/club/[id]/SingleClubNotes.md` for details on the single club endpoint

## API Endpoint Details

- **URL**: `GET /api/club/admin/insights?sport={sport}`
- **Required Parameter**: `sport` (Cricket, AFL, Hockey, Netball, Basketball)
- **Response**: `ClubInsightsResponse` with overview, distributions, clubs array, teams/accounts insights, competition timeline, and meta
- **Performance**: 300-500ms typical response time
- **Data Volume**: High - can return 7,000+ clubs in single response

---

# Ticket – TKT-2025-023

---

ID: TKT-2025-023
Status: In Progress
Priority: High
Owner: Frontend Team
Created: 2025-01-27
Updated: 2025-01-27
Related: Roadmap-Club-Insights, TKT-2025-022, GANTT_CHART_RESEARCH.md, CMS_REQUEST_CompetitionDateRanges.md

---

## Overview

Implement a Gantt chart visualization for clubs showing their competition start and end date ranges. This will provide a visual timeline view of when clubs' competitions are active, similar to the association Gantt chart implementation. The backend enhancement has been completed, and `competitionDateRange` data is now available in the `/api/club/admin/insights` endpoint.

## What We Need to Do

Create a Gantt chart component for clubs that displays each club's competition timeline based on the earliest start date and latest end date across all their competitions. The component should include filtering, sorting, and color-coding features consistent with the association Gantt chart implementation.

## Phases & Tasks

### Phase 1: Type Updates ✅

- [x] Verify `CompetitionDateRange` interface exists in `src/types/clubInsights.ts`
- [x] Verify `ClubInsight` includes `competitionDateRange: CompetitionDateRange | null`
- [x] Add type guards (`hasCompetitionDateRange`, `isClubInsightsResponse`, `isErrorResponse`)
- [x] Update research document to reflect data availability

### Phase 2: Gantt Chart Component

#### 2.1 Main Gantt Section Component ✅

- [x] Create `src/app/dashboard/club/components/ClubGanttSection.tsx`
  - Accept `clubs: ClubInsight[]` as prop
  - Filter clubs with valid `competitionDateRange` data
  - Transform `ClubInsight[]` to `GanttFeature[]` format
  - Implement "Hide Finished" filter (hide clubs finishing before 1 month from now)
  - Implement "Sort by Date" toggle (chronological vs alphabetical)
  - Calculate weight thresholds by sport (quartiles)
  - Apply color coding based on normalized weight
  - Handle empty state (no clubs with date ranges)
  - Use `GanttProvider`, `GanttSidebar`, `GanttTimeline` components
  - Navigate to `/dashboard/club/[id]` on click

#### 2.2 Tooltip Content Component ✅

- [x] Create `src/app/dashboard/club/components/ClubTooltipContent.tsx`
  - Display club name
  - Display start date, end date, duration
  - Display sport
  - Display competition count (with valid date count if different)
  - Display team count
  - Display association names/count
  - Use `date-fns` for date formatting (consistent with association tooltip)

#### 2.3 Weight Calculation & Coloring ✅

- [x] Implement weight calculation logic
  - Use `competitionCount + teamCount` as raw weight (or alternative metric)
  - Calculate sport-specific quartiles (p25, p50, p75)
  - Normalize weights to 0-100 scale for color coding
  - Map normalized weights to colors:
    - 75-100: Green (rgba(34, 197, 94, 0.5))
    - 50-74: Yellow (rgba(234, 179, 8, 0.5))
    - 25-49: Orange (rgba(249, 115, 22, 0.5))
    - 0-24: Gray (rgba(100, 116, 139, 0.5))

#### 2.4 Filter Controls ✅

- [x] Implement filter UI controls
  - "Hide Finished" switch (default: true)
    - Hide clubs that finish before 1 month from now
    - Inline style matching association Gantt
  - "Sort by Date" switch (default: true)
    - Toggle between chronological (by start date) and alphabetical sorting
    - Inline style matching association Gantt
  - Use `Switch` and `Label` components from UI library

### Phase 3: Page Integration ✅

- [x] Update `src/app/dashboard/club/page.tsx`
  - Import `ClubGanttSection` component
  - Add `ClubGanttSection` to page layout
  - Position after sport filter (top of page, similar to association page)
  - Pass `clubs` array from `useClubInsights` hook
  - Ensure proper loading/error state handling

### Phase 4: Styling & Consistency ✅

- [x] Match association Gantt chart styling
  - Same filter control layout (inline switches with labels)
  - Same section container styling
  - Same Gantt chart dimensions and responsive breakpoints
  - Same empty state messaging
  - Same tooltip styling

### Phase 5: Testing & Edge Cases

- [ ] Test with clubs that have:
  - No competitions (`competitionDateRange: null`)
  - Competitions with null dates (`competitionsWithValidDates < totalCompetitions`)
  - Competitions with valid dates
  - Multiple competitions spanning different date ranges
- [ ] Test filter behaviors:
  - "Hide Finished" correctly filters clubs
  - "Sort by Date" toggles between chronological and alphabetical
  - Both filters work together
- [ ] Test navigation:
  - Clicking on club bar navigates to `/dashboard/club/[id]`
  - Tooltip displays correctly on hover
- [ ] Test with different sports:
  - Cricket (7,328 clubs - large dataset)
  - AFL, Hockey, Netball, Basketball
- [ ] Test responsive design:
  - Mobile, tablet, desktop breakpoints
  - Gantt chart scrolling behavior

## Constraints, Risks, Assumptions

### Constraints

- Sport parameter is **required** for club insights (unlike association insights)
- Large datasets possible (Cricket has 7,328 clubs)
- Some clubs may have `competitionDateRange: null` (no competitions or no valid dates)
- Date ranges are calculated from earliest start to latest end across all competitions

### Risks

- Large club lists may impact performance when calculating quartiles and transforming data
- Weight calculation needs to be meaningful (consider using `competitionCount + teamCount` or similar)
- Color coding should be consistent with association Gantt for UX consistency

### Assumptions

- Backend enhancement is complete (`competitionDateRange` available in API response) ✅
- Gantt chart library components are available and stable
- Association Gantt chart implementation serves as reference pattern
- Users want to see clubs grouped by sport in the Gantt chart

## Related Files

- **Research**: `src/app/dashboard/club/GANTT_CHART_RESEARCH.md`
- **CMS Request**: `src/app/dashboard/club/CMS_REQUEST_CompetitionDateRanges.md`
- **Types**: `src/types/clubInsights.ts`
- **Reference Implementation**: `src/app/dashboard/association/components/AssociationGanttSection.tsx`
- **Gantt Library**: `src/components/ui/shadcn-io/gantt.tsx`
- **Tooltip Component**: `src/app/dashboard/competitions/components/CompetitionAdminStats/sections/GanttTooltip.tsx`

## API Endpoint Details

- **URL**: `GET /api/club/admin/insights?sport={sport}`
- **Required Parameter**: `sport` (Cricket, AFL, Hockey, Netball, Basketball)
- **Response Field**: `clubs[].competitionDateRange`
  - `earliestStartDate: string | null`
  - `latestEndDate: string | null`
  - `competitionsWithValidDates: number`
  - `totalCompetitions: number`
