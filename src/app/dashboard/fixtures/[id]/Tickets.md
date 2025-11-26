# Completed Tickets

- _None yet_

---

# Ticket – TKT-2025-XXX

---

ID: TKT-2025-XXX
Status: In Progress
Priority: High
Owner: Frontend Team
Created: 2025-01-27
Updated: 2025-01-27
Related: Roadmap-Fixture-Detail, Epic-Fixture-Admin

---

## Overview

Integrate the Single Fixture Details API endpoint (`/api/game-meta-data/admin/fixture/{id}`) into the frontend application following established service/hook/component patterns. This endpoint provides comprehensive detailed information about a single cricket fixture by ID, including all core fixture data, related entities (grade, teams, downloads, render status), validation scoring, and administrative metadata.

## What We Need to Do

Build a complete data integration layer (types, service, hook) and UI components to display single fixture detail on the `/dashboard/fixtures/[id]` page, replacing the existing dummy data implementation with real API data. The page should provide a comprehensive single-fixture admin view with fixture information, team details, scores, validation status, content/prompts, and related entities.

## Phases & Tasks

### Phase 1: Type Definitions ✅

#### Tasks

- [x] Create `src/types/fixtureDetail.ts` with all TypeScript interfaces from CMS_HandoverNotes.md
- [x] Define `SingleFixtureDetailResponse` as the main response wrapper
- [x] Define `FixtureDetailData` interface with core fixture data:
  - [x] Basic info (id, gameID, round, status, type, isFinished)
  - [x] Dates object (dayOne, finalDaysPlay, date, time, dateRange, dateRangeObj)
  - [x] Venue object (ground)
  - [x] Teams object (home/away with name and scores)
  - [x] MatchDetails object (tossWinner, tossResult, urlToScoreCard, scorecards, resultStatement)
  - [x] Content object (gameContext, basePromptInformation, hasBasePrompt, upcomingFixturePrompt, hasUpcomingFixturePrompt, lastPromptUpdate)
  - [x] Team roster (any | null)
- [x] Define `TeamScores` interface (total, overs, firstInnings)
- [x] Define `GradeDetail` interface with association nested object
- [x] Define `AssociationDetail` interface (id, name, logoUrl)
- [x] Define `TeamData` interface (id, name, logoUrl)
- [x] Define `Download` interface (id, name, url, type)
- [x] Define `RenderStatus` interface with upcomingGamesRenders and gameResultsRenders arrays
- [x] Define `RenderEntry` interface (id, status, processedAt)
- [x] Define `ClubData` interface (id, name, logoUrl)
- [x] Define `AdminContext` interface (createdAt, updatedAt, publishedAt, lastPromptUpdate)
- [x] Define `Context` interface with admin nested object
- [x] Define `ValidationBreakdown` interface (basicInfo, scheduling, matchDetails, content, relations, results)
- [x] Define `ValidationStatus` type union ("excellent" | "good" | "fair" | "poor" | "critical")
- [x] Define `ValidationData` interface (overallScore, status, statusBased, breakdown, missingFields, recommendations)
- [x] Define `PerformanceMetrics` interface (fetchTimeMs, processingTimeMs, totalTimeMs)
- [x] Define `MetaData` interface (generatedAt, fixtureId, validation, performance)
- [x] Export all types for use in services and hooks
- [x] Update `src/types/index.ts` to export all fixture detail types

### Phase 2: Service Layer ✅

#### Tasks

- [x] Create `src/lib/services/fixtures/fetchSingleFixtureDetail.ts` service function
- [x] Implement function that accepts required `id` parameter (number)
- [x] Use `axiosInstance` from `@/lib/axios` for API calls
- [x] Call endpoint: `/api/game-meta-data/admin/fixture/${id}`
- [x] Add "use server" directive for Next.js server-side execution
- [x] Implement proper error handling for 400 (invalid ID - non-numeric) and 404 (not found) errors
- [x] Implement proper error handling for 500 (server error) responses
- [x] Add comprehensive error logging following existing service patterns
- [x] Validate ID is numeric before making request
- [x] Add console logging for debugging (request endpoint, response metadata)
- [x] Return typed `SingleFixtureDetailResponse`
- [x] Update `src/lib/services/fixtures/readMe.md` documentation to include new service
- [x] Update main services readMe.md to reference single fixture detail service

### Phase 3: React Query Hook ✅

#### Tasks

- [x] Create `src/hooks/fixtures/useSingleFixtureDetail.ts` hook
- [x] Use `useQuery` from `@/tanstack/react-query`
- [x] Implement query key: `['single-fixture-detail', id]` for proper cache invalidation
- [x] Set `staleTime: 2 * 60 * 1000` (2 minutes) - similar to fixture details endpoint
- [x] Set `gcTime: 5 * 60 * 1000` (5 minutes) for garbage collection
- [x] Configure retry logic (3 retries with exponential backoff)
- [x] Disable query when `id` is null, undefined, or invalid (not numeric)
- [x] Return `UseQueryResult<SingleFixtureDetailResponse, Error>`
- [x] Update main hooks readMe.md to include single fixture detail hook

### Phase 4: UI Components Planning

#### Component Structure

Based on the API response structure, we need to create components to display:

**Header Section**

- `FixtureDetailHeader.tsx` - Main fixture header component
  - Fixture round, type, status
  - Grade and association logos
  - Date and time information
  - Venue/ground information

**Teams Section**

- `FixtureTeams.tsx` - Teams display component
  - Home and away team names with logos
  - Team scores (total, overs, first innings)
  - Result statement (if finished)

**Match Details Section**

- `FixtureMatchDetails.tsx` - Match details component
  - Toss winner and result
  - Scorecard URL link
  - Result statement

**Content Section**

- `FixtureContent.tsx` - Content and prompts component
  - Game context
  - Base prompt information (with indicator if present)
  - Upcoming fixture prompt (with indicator if present)
  - Last prompt update timestamp

**Validation Section**

- `FixtureValidation.tsx` - Validation status component
  - Overall score (0-100) with visual indicator
  - Status badge (excellent/good/fair/poor/critical)
  - Breakdown scores by category
  - Missing fields list
  - Recommendations list

**Related Entities Section**

- `FixtureRelatedEntities.tsx` - Related entities component
  - Grade information with association
  - Downloads/media files list
  - Render status information

**Admin Context Section**

- `FixtureAdminContext.tsx` - Admin metadata component
  - Created/updated/published timestamps
  - Last prompt update timestamp
  - Performance metrics (optional, collapsible)

#### Tasks

- [x] Create `src/app/dashboard/fixtures/[id]/_components/` folder structure
- [x] Create `FixtureDetailHeader.tsx` component
  - [x] Display fixture round, type, status
  - [x] Display grade and association logos (handle null)
  - [x] Display date/time information (handle multiple date formats)
  - [x] Display venue/ground (handle null)
- [x] Create `FixtureTeams.tsx` component
  - [x] Display home/away team names with logos from club array
  - [x] Display team scores (total, overs, first innings) - handle null
  - [x] Display result statement if available
  - [x] Handle finished vs upcoming fixtures differently
- [x] Create `FixtureMatchDetails.tsx` component
  - [x] Display toss winner and result (handle null)
  - [x] Display scorecard URL as clickable link (handle null)
  - [x] Display result statement (handle null)
- [x] Create `FixtureContent.tsx` component
  - [x] Display game context (handle null)
  - [x] Display base prompt information with indicator badge
  - [x] Display upcoming fixture prompt with indicator badge
  - [x] Display last prompt update timestamp (handle null)
- [x] Create `FixtureValidation.tsx` component
  - [x] Display overall score with progress bar or circular indicator
  - [x] Display status badge with color coding
  - [x] Display breakdown scores by category (basicInfo, scheduling, matchDetails, content, relations, results)
  - [x] Display missing fields list (if any)
  - [x] Display recommendations list (if any)
- [x] Create `FixtureRelatedEntities.tsx` component
  - [x] Display grade information with association logo
  - [x] Display downloads/media files list (handle empty)
  - [x] Display render status (upcomingGamesRenders, gameResultsRenders)
- [x] Create `FixtureAdminContext.tsx` component
  - [x] Display admin timestamps (createdAt, updatedAt, publishedAt, lastPromptUpdate)
  - [x] Display performance metrics (fetchTimeMs, processingTimeMs, totalTimeMs) - collapsible
- [x] Implement proper null handling for all optional fields
- [x] Add loading skeletons/spinners for all components
- [x] Add error state displays with retry functionality
- [x] Ensure all components handle empty states gracefully
- [x] Use existing component library components (cards, tables, badges, progress bars, etc.)

### Phase 5: Page Integration ✅

#### Tasks

- [x] Update `src/app/dashboard/fixtures/[id]/page.tsx` entry point
- [x] Extract `id` from route params
- [x] Convert `id` to number and validate it's numeric
- [x] Use `useSingleFixtureDetail` hook with validated ID
- [x] Replace existing `FixtureDetail` component usage
- [x] Integrate all UI components (FixtureDetailHeader, FixtureTeams, FixtureMatchDetails, FixtureContent, FixtureValidation, FixtureRelatedEntities, FixtureAdminContext)
- [x] Implement loading state handling at page level
- [x] Implement error state handling at page level (400, 404, 500)
- [x] Handle invalid ID gracefully (show error message)
- [x] Use existing PageContainer and SectionContainer components for layout
- [x] Organize sections in logical order (Header → Teams → Match Details → Content → Validation → Related Entities → Admin Context)
- [ ] Add navigation breadcrumbs linking back to `/dashboard/fixtures` (optional enhancement)
- [x] Remove or update existing dummy data usage

### Phase 6: Testing & Polish

#### Tasks

- [ ] Test with valid fixture ID - verify all data sections are populated
- [ ] Test with invalid ID (non-numeric) - verify 400 error handling
- [ ] Test with non-existent ID - verify 404 error handling
- [ ] Test with minimal data - fixture with missing optional fields
- [ ] Test logo fallbacks - verify default logo appears when no logoUrl exists
- [ ] Test validation status display - verify all status levels (excellent/good/fair/poor/critical) display correctly
- [ ] Test null handling - verify UI handles null values gracefully (dates, venue, scores, toss, content, etc.)
- [ ] Test performance - monitor response times (response can be 5-10KB depending on scorecards data)
- [ ] Test loading states during API response time
- [ ] Test error states (network errors, 500 responses)
- [ ] Test responsive design on mobile/tablet/desktop
- [ ] Test date formatting - verify all date formats display correctly (dayOne, finalDaysPlay, date, time, dateRange)
- [ ] Test scorecard URL links - verify they open correctly
- [ ] Test downloads/media files - verify links work correctly
- [ ] Test render status display - verify upcomingGamesRenders and gameResultsRenders display correctly
- [ ] Verify validation breakdown scores display correctly for all categories

## Implementation Notes

### Key Considerations from Handover

- **Response Size**: Can be large (5-10KB) depending on scorecards JSON data
- **Processing Time**: Includes validation calculations and performance metrics
- **Validation Status**: Status values: "excellent" (90-100%), "good" (75-89%), "fair" (50-74%), "poor" (25-49%), "critical" (0-24%)
- **Null Handling**: Many fields can be null (dates, venue, scores, toss, content, logos, etc.)
- **Logo URLs**: May be null - handle gracefully with fallback or placeholder
- **Performance**: Response includes performance metrics in `meta.performance`
- **Date Formats**: Multiple date formats provided (ISO datetime, ISO date only, display format, time, dateRange)
- **Scorecards**: Large JSON object - may need special handling or lazy loading
- **Team Roster**: JSON data - may need special handling or lazy loading
- **Authentication**: Currently `auth: false` - will require admin authentication in future

### Patterns to Follow

- Follow existing service patterns from `fetchFixtureDetails.ts`
- Follow existing hook patterns from `useFixtureDetails.ts`
- Follow existing component patterns from association detail components
- Use existing scaffolding components (PageContainer, SectionContainer, ElementContainer)
- Use existing UI components (cards, tables, badges, progress bars, charts)
- Follow error handling patterns from other detail pages

### UI Component Mapping

Based on the API response structure, map out which components can be created:

1. **FixtureDetailHeader** - Uses: `fixture.round`, `fixture.type`, `fixture.status`, `grade.gradeName`, `grade.logoUrl`, `grade.association`, `fixture.dates`, `fixture.venue`
2. **FixtureTeams** - Uses: `club[]` (for logos), `fixture.teams.home`, `fixture.teams.away`, `fixture.matchDetails.resultStatement`
3. **FixtureMatchDetails** - Uses: `fixture.matchDetails.tossWinner`, `fixture.matchDetails.tossResult`, `fixture.matchDetails.urlToScoreCard`, `fixture.matchDetails.resultStatement`
4. **FixtureContent** - Uses: `fixture.content.gameContext`, `fixture.content.basePromptInformation`, `fixture.content.hasBasePrompt`, `fixture.content.upcomingFixturePrompt`, `fixture.content.hasUpcomingFixturePrompt`, `fixture.content.lastPromptUpdate`
5. **FixtureValidation** - Uses: `meta.validation.overallScore`, `meta.validation.status`, `meta.validation.breakdown`, `meta.validation.missingFields`, `meta.validation.recommendations`
6. **FixtureRelatedEntities** - Uses: `grade`, `downloads[]`, `renderStatus`
7. **FixtureAdminContext** - Uses: `context.admin`, `meta.performance`

## Constraints, Risks, Assumptions

- **Constraints**:

  - API endpoint currently has `auth: false` (authentication will be added later)
  - Response can be large (5-10KB) when fixture has detailed scorecards
  - Scorecards and teamRoster are JSON objects that may need special handling
  - ID must be numeric (validated in service layer)

- **Risks**:

  - Large scorecards JSON may impact rendering performance - consider lazy loading or virtualization
  - Need to handle null values properly (dates, venue, scores, toss, content, logos, etc.)
  - Validation status calculations depend on data completeness - handle gracefully
  - Multiple date formats need proper parsing and display

- **Assumptions**:
  - API endpoint is available and stable
  - Component library has all necessary UI components (cards, tables, badges, progress bars, etc.)
  - Existing patterns from other detail pages (associations, competitions) can be followed for consistency
  - Logo URLs may be null - need fallback handling
  - Scorecards and teamRoster JSON can be displayed or collapsed for performance

---

# Summaries of Completed Tickets

- _None yet_
