# Fixture Insights Integration - Implementation Checklist

Use this checklist to track your progress through the implementation.

## Phase 1: Type Definitions ✅

### Create Type File
- [ ] Create `src/types/fixtureInsights.ts`
- [ ] Copy type definitions from `handOverNotes.md`
- [ ] Define `FixtureInsightsResponse`
- [ ] Define `FixtureDetailsResponse`
- [ ] Define `FixtureOverview`
- [ ] Define `FixtureCategories` with:
  - [ ] `AssociationSummary`
  - [ ] `CompetitionSummary`
  - [ ] `GradeSummary`
- [ ] Define `FixtureCharts` with:
  - [ ] `FixtureTimelineEntry`
  - [ ] `MonthlyDistribution`
  - [ ] `WeeklyDistribution`
- [ ] Define `FixtureDistributions` with:
  - [ ] `StatusDistribution`
  - [ ] `CompetitionDistribution`
  - [ ] `AssociationDistribution`
  - [ ] `GradeDistribution`
  - [ ] `DayOfWeekDistribution`
- [ ] Define `FixtureSummary`
- [ ] Define `FixtureFilters`
- [ ] Define `FixtureInsightsMeta`
- [ ] Define `FixtureDetailsMeta`
- [ ] Add type guards:
  - [ ] `isFixtureInsightsResponse()`
  - [ ] `isFixtureDetailsResponse()`

### Export Types
- [ ] Update `src/types/index.ts` to export all fixture types

### Verify
- [ ] Run `npm run type-check` - no errors
- [ ] All types match the API response structure from `handOverNotes.md`

---

## Phase 2: Service Layer ✅

### Create Service Directory
- [ ] Create directory `src/lib/services/fixtures/`

### Create Insights Service
- [ ] Create `src/lib/services/fixtures/fetchFixtureInsights.ts`
- [ ] Add `"use server"` directive
- [ ] Import `axiosInstance` from `@/lib/axios`
- [ ] Import `AxiosError` from `axios`
- [ ] Import `FixtureInsightsResponse` type
- [ ] Implement `fetchFixtureInsights()` function
- [ ] Add endpoint: `/game-meta-data/admin/insights`
- [ ] Add console logging for debugging
- [ ] Validate response structure
- [ ] Handle AxiosError with proper error messages:
  - [ ] 400 Bad Request
  - [ ] 500 Internal Server Error
  - [ ] Timeout errors
  - [ ] Network errors
- [ ] Return typed response

### Create Details Service
- [ ] Create `src/lib/services/fixtures/fetchFixtureDetails.ts`
- [ ] Add `"use server"` directive
- [ ] Import `axiosInstance` from `@/lib/axios`
- [ ] Import `AxiosError` from `axios`
- [ ] Import `FixtureDetailsResponse` and `FixtureFilters` types
- [ ] Implement `fetchFixtureDetails(filters?: FixtureFilters)` function
- [ ] Build query string from filters:
  - [ ] `association` parameter
  - [ ] `grade` parameter
  - [ ] `competition` parameter
- [ ] Add endpoint: `/game-meta-data/admin/fixtures`
- [ ] Add console logging for debugging
- [ ] Validate response structure
- [ ] Handle AxiosError with proper error messages
- [ ] Return typed response

### Documentation
- [ ] Create `src/lib/services/fixtures/readMe.md`
- [ ] Document both services
- [ ] Include usage examples
- [ ] Document error handling

### Verify
- [ ] Test `fetchFixtureInsights()` in isolation
- [ ] Test `fetchFixtureDetails()` with no filters
- [ ] Test `fetchFixtureDetails()` with association filter
- [ ] Test `fetchFixtureDetails()` with multiple filters
- [ ] Verify error handling works (try invalid filters)
- [ ] Check console logs are helpful

---

## Phase 3: React Query Hooks ✅

### Create Hooks Directory
- [ ] Create directory `src/hooks/fixtures/`

### Create Insights Hook
- [ ] Create `src/hooks/fixtures/useFixtureInsights.ts`
- [ ] Import `useQuery` and `UseQueryResult` from `@tanstack/react-query`
- [ ] Import `FixtureInsightsResponse` type
- [ ] Import `fetchFixtureInsights` service
- [ ] Implement `useFixtureInsights()` hook
- [ ] Set query key: `["fixture-insights"]`
- [ ] Set stale time: 5 minutes
- [ ] Set cache time (gcTime): 10 minutes
- [ ] Set retry: 3 attempts
- [ ] Set retry delay: exponential backoff
- [ ] Return typed `UseQueryResult`

### Create Details Hook
- [ ] Create `src/hooks/fixtures/useFixtureDetails.ts`
- [ ] Import `useQuery` and `UseQueryResult` from `@tanstack/react-query`
- [ ] Import `FixtureDetailsResponse` and `FixtureFilters` types
- [ ] Import `fetchFixtureDetails` service
- [ ] Implement `useFixtureDetails(filters?: FixtureFilters)` hook
- [ ] Set query key: `["fixture-details", filters]`
- [ ] Set stale time: 2 minutes
- [ ] Set cache time (gcTime): 5 minutes
- [ ] Set retry: 3 attempts
- [ ] Set retry delay: exponential backoff
- [ ] Return typed `UseQueryResult`

### Verify
- [ ] Test hooks in a component
- [ ] Verify caching works (check React Query DevTools)
- [ ] Verify retry logic works (simulate API failure)
- [ ] Check loading states work
- [ ] Check error states work

---

## Phase 4: UI Integration - Association Selection ✅

### Create Association Selector Component
- [ ] Create `src/app/dashboard/fixtures/_components/AssociationSelector.tsx`
- [ ] Add `"use client"` directive
- [ ] Import `useFixtureInsights` hook
- [ ] Import UI components (Table, Card, Button, etc.)
- [ ] Define props: `onSelect: (associationId: number) => void`
- [ ] Call `useFixtureInsights()` hook
- [ ] Handle loading state:
  - [ ] Show skeleton loader
- [ ] Handle error state:
  - [ ] Show error message
  - [ ] Show retry button
- [ ] Render table of associations:
  - [ ] Association Name column
  - [ ] Fixture Count column
  - [ ] Competition Count column
  - [ ] Grade Count column
  - [ ] Date Range column (earliest - latest)
  - [ ] Action column (Select button)
- [ ] Implement `onSelect` callback when user clicks Select
- [ ] Add sorting functionality
- [ ] Add search/filter functionality (optional)

### Create Association Fixtures Table Component
- [ ] Create `src/app/dashboard/fixtures/_components/AssociationFixturesTable.tsx`
- [ ] Add `"use client"` directive
- [ ] Import `useFixtureDetails` hook
- [ ] Import UI components (Table, Card, Button, Badge, etc.)
- [ ] Define props:
  - [ ] `associationId: number`
  - [ ] `onBack: () => void`
- [ ] Call `useFixtureDetails({ association: associationId })` hook
- [ ] Handle loading state:
  - [ ] Show skeleton loader
- [ ] Handle error state:
  - [ ] Show error message
  - [ ] Show retry button
- [ ] Add "Back to Associations" button
- [ ] Render table of fixtures:
  - [ ] Date column
  - [ ] Round column
  - [ ] Competition column
  - [ ] Grade column
  - [ ] Teams column (Home vs Away)
  - [ ] Status column (with badge)
  - [ ] Type column
  - [ ] Actions column (View Details button)
- [ ] Implement navigation to fixture detail page
- [ ] Add sorting functionality
- [ ] Add filtering by status (optional)
- [ ] Add pagination (if needed)

### Update Fixtures Overview Component
- [ ] Open `src/app/dashboard/fixtures/_components/FixturesOverview.tsx`
- [ ] Add state: `const [selectedAssociation, setSelectedAssociation] = useState<number | null>(null)`
- [ ] Remove dummy data
- [ ] Implement conditional rendering:
  - [ ] Show `AssociationSelector` when `selectedAssociation === null`
  - [ ] Show `AssociationFixturesTable` when `selectedAssociation !== null`
- [ ] Pass `onSelect` callback to `AssociationSelector`
- [ ] Pass `associationId` and `onBack` to `AssociationFixturesTable`
- [ ] Test the flow:
  - [ ] Can select an association
  - [ ] Can view fixtures for that association
  - [ ] Can go back to association list
  - [ ] Can select a different association

### Verify
- [ ] Association table loads and displays correctly
- [ ] Can select an association
- [ ] Fixtures table loads for selected association
- [ ] Can go back to association list
- [ ] Can navigate to fixture detail page
- [ ] Loading states work
- [ ] Error states work
- [ ] No console errors

---

## Phase 5: Statistics Dashboard ✅

### Update Fixtures Stats Component
- [ ] Open `src/app/dashboard/fixtures/_components/FixturesStats.tsx`
- [ ] Import `useFixtureInsights` hook
- [ ] Remove dummy data
- [ ] Call `useFixtureInsights()` hook
- [ ] Handle loading state:
  - [ ] Show skeleton cards
- [ ] Handle error state:
  - [ ] Show error message
- [ ] Display stats from `data.overview`:
  - [ ] Total Fixtures
  - [ ] Fixtures Past (with percentage)
  - [ ] Fixtures Future (with percentage)
  - [ ] Fixtures Today (with percentage)
  - [ ] Unique Competitions
  - [ ] Unique Associations
  - [ ] Unique Grades
- [ ] Use existing `MetricCard` or similar components
- [ ] Add tooltips with additional info (optional)

### Verify
- [ ] Stats display correctly
- [ ] Numbers match the API response
- [ ] Loading state works
- [ ] Error state works
- [ ] Layout looks good

---

## Phase 6: Charts and Visualizations (Optional - Future)

### Create Timeline Chart Component
- [ ] Create `src/app/dashboard/fixtures/_components/FixtureTimelineChart.tsx`
- [ ] Import chart library (Recharts, Chart.js, etc.)
- [ ] Import `useFixtureInsights` hook
- [ ] Use `data.charts.fixtureTimeline`
- [ ] Display fixture count over time
- [ ] Show status breakdown (stacked area chart)
- [ ] Add interactive tooltips
- [ ] Add date range selector (optional)

### Create Distribution Charts Component
- [ ] Create `src/app/dashboard/fixtures/_components/FixtureDistributionCharts.tsx`
- [ ] Import chart library
- [ ] Import `useFixtureInsights` hook
- [ ] Use `data.distributions`
- [ ] Create pie chart for status distribution
- [ ] Create bar chart for day of week distribution
- [ ] Create bar chart for association distribution
- [ ] Add interactive tooltips

### Verify
- [ ] Charts render correctly
- [ ] Data is accurate
- [ ] Charts are responsive
- [ ] Tooltips work
- [ ] No performance issues

---

## Phase 7: Fixture Detail Page Enhancement ✅

### Update Fixture Detail Component
- [ ] Open `src/app/dashboard/fixtures/_components/FixtureDetail.tsx`
- [ ] Remove dummy data (`DUMMY_FIXTURES_DATA`)
- [ ] Decide on data fetching strategy:
  - Option A: Use `useFixtureDetails()` and filter by ID
  - Option B: Create `useFixtureById(id)` hook
- [ ] Implement chosen strategy
- [ ] Handle loading state
- [ ] Handle error state (fixture not found)
- [ ] Ensure `FixtureInfo` component works with real data
- [ ] Ensure `GamesTable` component works with real data
- [ ] Update types if needed

### Update Fixture Detail Page
- [ ] Open `src/app/dashboard/fixtures/[id]/page.tsx`
- [ ] Remove dummy data references
- [ ] Pass fixture ID to `FixtureDetail` component
- [ ] Add breadcrumbs (optional)
- [ ] Add "Back to Fixtures" button

### Verify
- [ ] Can navigate to fixture detail page
- [ ] Fixture data loads correctly
- [ ] Games table displays correctly
- [ ] Loading state works
- [ ] Error state works (try invalid ID)
- [ ] Navigation works

---

## Testing ✅

### Unit Tests
- [ ] Test type guards with valid data
- [ ] Test type guards with invalid data
- [ ] Test service error handling (400 error)
- [ ] Test service error handling (500 error)
- [ ] Test service error handling (timeout)
- [ ] Test query string building in `fetchFixtureDetails`

### Integration Tests
- [ ] Test `useFixtureInsights` hook with real API
- [ ] Test `useFixtureDetails` hook with no filters
- [ ] Test `useFixtureDetails` hook with association filter
- [ ] Test `useFixtureDetails` hook with multiple filters
- [ ] Test association selection flow
- [ ] Test fixture table rendering
- [ ] Test navigation to detail page

### UI Tests
- [ ] Verify loading states display correctly
- [ ] Verify error states display user-friendly messages
- [ ] Verify retry buttons work
- [ ] Verify table sorting works
- [ ] Verify table filtering works (if implemented)
- [ ] Verify navigation between views works
- [ ] Verify fixture detail page loads correctly
- [ ] Test on mobile (responsive design)
- [ ] Test on tablet (responsive design)
- [ ] Test on desktop

### Performance Tests
- [ ] Verify caching works (check React Query DevTools)
- [ ] Verify stale time works (5 min for insights, 2 min for details)
- [ ] Verify retry logic works on failed requests
- [ ] Monitor API response times
- [ ] Check for memory leaks (long session)
- [ ] Check bundle size (no significant increase)

### Browser Tests
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge

---

## Cleanup ✅

### Remove Dummy Data
- [ ] Remove `DUMMY_FIXTURES` from `FixturesOverview.tsx`
- [ ] Remove `DUMMY_FIXTURES_DATA` from `FixtureDetail.tsx`
- [ ] Remove old dummy types from `types.ts` (if not needed)

### Update Documentation
- [ ] Update `README.md` to reflect real data usage
- [ ] Update `IMPLEMENTATION_TICKET.md` with completion status
- [ ] Add any lessons learned to documentation

### Code Review
- [ ] Review all new files for code quality
- [ ] Check for consistent naming conventions
- [ ] Check for proper error handling
- [ ] Check for proper TypeScript types
- [ ] Check for accessibility (a11y)
- [ ] Check for console.log statements (remove or keep?)

---

## Deployment Checklist ✅

### Environment Variables
- [ ] Verify `NEXT_APP_API_BASE_URL` is set
- [ ] Verify `APP_API_KEY` is set
- [ ] Test with production API (if different from dev)

### Build
- [ ] Run `npm run build` - no errors
- [ ] Run `npm run type-check` - no errors
- [ ] Run `npm run lint` - no errors
- [ ] Test production build locally

### Monitoring
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Set up performance monitoring
- [ ] Set up API usage monitoring

### Documentation
- [ ] Update deployment docs
- [ ] Update API docs
- [ ] Update user guide (if applicable)

---

## Post-Deployment ✅

### Monitoring
- [ ] Monitor error rates
- [ ] Monitor API response times
- [ ] Monitor user engagement
- [ ] Check for console errors in production

### User Feedback
- [ ] Gather user feedback
- [ ] Create tickets for bugs/improvements
- [ ] Prioritize enhancements

### Optimization
- [ ] Analyze performance metrics
- [ ] Optimize slow queries
- [ ] Implement additional caching if needed
- [ ] Consider pagination if needed

---

## Future Enhancements 🚀

### Filtering
- [ ] Add competition filter
- [ ] Add grade filter
- [ ] Add date range filter
- [ ] Add multi-select filters
- [ ] Add saved filter presets

### Features
- [ ] Add export to CSV
- [ ] Add export to PDF
- [ ] Add print view
- [ ] Add real-time updates for live fixtures
- [ ] Add fixture creation wizard
- [ ] Add bulk operations
- [ ] Add fixture editing
- [ ] Add game score updates

### Charts
- [ ] Add fixture timeline chart
- [ ] Add distribution charts
- [ ] Add interactive filters on charts
- [ ] Add chart export functionality

### Performance
- [ ] Implement pagination for large lists
- [ ] Implement virtual scrolling for very long tables
- [ ] Optimize bundle size
- [ ] Implement service worker for offline support

---

## Notes

**Estimated Time**: 15-22 hours total

**Priority**: High

**Dependencies**:
- CMS API must be available
- React Query already installed
- UI components already available

**Blockers**: None identified

**Questions**:
- Should we implement pagination from the start?
- Do we need real-time updates for live fixtures?
- Should we add export functionality in this phase?

---

**Last Updated**: 2025-11-25
**Status**: Ready to start
**Next Step**: Begin Phase 1 - Type Definitions
