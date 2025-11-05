# Completed Tickets

---

# Ticket – TKT-2025-008

## Overview

Implement data collection endpoint for fetching account-specific data collection information. This endpoint provides detailed data collection insights for individual accounts and will be integrated into the Data.tsx tab component.

## What We Need to Do

Create a complete implementation pathway for the account data collection endpoint, including:

1. Server action function to call CMS backend data collection endpoint
2. TanStack Query hook (`useQuery`) for frontend data fetching
3. TypeScript type definitions for request/response data
4. Integration into Data.tsx component to display account data collection information
5. Error handling and loading states for user feedback

## Phases & Tasks

### Phase 1: Type Definitions ✅

- [x] Create or update `src/types/dataCollection.ts` (or appropriate types file)
- [x] Define request interface (if needed - may just be accountId parameter)
- [x] Define response interface matching API documentation structure
- [x] Define nested type interfaces for complex response data
- [x] Define error response interfaces if not already present
- [x] Export all types for use in hooks and components

**Note:** Types have been updated to match the actual API documentation. The complete structure includes:

- `FetchAccountDataCollectionParams`: Request parameters interface
- `AccountStatsResponse`: Main response interface (wraps data in `data` property)
- `AccountStatsData`: Core data structure with all statistics
- `AccountInfo`: Account information
- `Summary`: Summary statistics
- `EntityStatistics`: Entity stats for competitions, teams, and games
- `StageAnalysis`: Collection stage completion analysis
- `PerformanceMetrics`: Time and memory performance metrics
- `ErrorAnalysis`: Error analysis and rates
- `TemporalAnalysis`: Time-based patterns
- `DataVolume`: Data volume statistics
- `AccountInsights`: Account health scoring and insights
- `TimeSeries`: Time series data with multiple time point types
- `AccountDataCollectionErrorResponse`: Error response interface

All nested types are properly defined for type safety throughout the implementation.

### Phase 2: Service Layer (Server Action) ✅

- [x] Create `src/lib/services/data-collection/fetchAccountDataCollection.ts` following existing service patterns
- [x] Use `"use server"` directive for Next.js server-side execution
- [x] Implement function that accepts `accountId: string` as parameter
- [x] Call CMS backend endpoint using axiosInstance (endpoint path: `/data-collection/account/:accountId`)
- [x] Add proper TypeScript return type matching response interface (`AccountStatsResponse`)
- [x] Follow existing AxiosError handling patterns from `src/lib/services/analytics/`
- [x] Add comprehensive error logging consistent with other services
- [x] Add input validation (accountId required, valid format, positive number)

**Implementation Details:**

- Function: `fetchAccountDataCollection(accountId: string): Promise<AccountStatsResponse>`
- Endpoint: `GET /data-collection/insights/:accountId` (confirmed - working)
- Validation includes: required check, trim whitespace, numeric validation, positive number check
- Error handling: Comprehensive AxiosError handling with detailed logging and specific status code messages (404, 401, 403, 500)
- Response validation: Validates response structure and required `data` property

### Phase 3: TanStack Query Hook ✅

- [x] Create `src/hooks/accounts/useAccountDataCollectionQuery.ts` (or appropriate location)
- [x] Implement `useQuery` hook following patterns from `useAccountQuery.ts` and `useAccountAnalytics.ts`
- [x] Define queryKey with accountId for proper caching: `["accountDataCollection", accountId]`
- [x] Set `enabled: !!accountId` to only run query when accountId is provided
- [x] Add appropriate `staleTime` configuration (recommend 1-5 minutes for data collection)
- [x] Configure retry logic (3 retries with exponential backoff)
- [x] Add proper TypeScript types using UseQueryResult generic
- [x] Export hook for use in components

**Implementation Details:**

- Hook: `useAccountDataCollectionQuery(accountId: string): UseQueryResult<AccountStatsResponse, Error>`
- Query Key: `["accountDataCollection", accountId]` for proper cache isolation
- Stale Time: 3 minutes (configured to balance freshness with data collection update frequency)
- Retry Logic: 3 retries with exponential backoff (up to 10 seconds max delay)
- Conditional Fetching: Only runs when accountId is provided (`enabled: !!accountId`)
- Type Safety: Full TypeScript integration with `AccountStatsResponse` return type
- Follows patterns from `useAccountAnalytics.ts` and `useAccountQuery.ts`

### Phase 4: UI Component Integration ✅ (Minimal Implementation)

- [x] Update `src/app/dashboard/accounts/components/overview/tabs/Data.tsx`
- [x] Import and use `useAccountDataCollectionQuery` hook
- [x] Extract accountId from `useParams()` or `accountData.id`
- [x] Handle loading state with appropriate UI feedback (spinner with loading message)
- [x] Handle error state with user-friendly error messages
- [x] Display data collection information in JSON format (for verification - Phase 4a)
- [x] Add empty state handling when no data is available
- [x] Style consistently with existing Data.tsx components

**Implementation Details:**

- Hook Integration: `useAccountDataCollectionQuery(accountIdNumber.toString())`
- Account ID Source: Extracted from props or `useParams()` (already available in component)
- Loading State: Displays spinner with "Loading data collection statistics..." message
- Error State: Displays error card with error message and AlertCircle icon
- Data Display: Currently showing raw JSON response in `<pre>` tag for verification
- Empty State: Handles case when no data is available
- Styling: Matches existing Data.tsx component patterns (slate-50 background, border, rounded-lg)

### Phase 4b: UI Components Planning & Design ⏳

**Component Structure Plan:**

Based on the data structure from the API, here are the proposed UI components organized by data category:

#### 1. Summary Overview Cards Section

- **`SummaryCards.tsx`**: Grid of metric cards displaying:
  - Total Collections (with trend indicator)
  - Collections with Errors (with error rate percentage)
  - Average Completion Rate (progress indicator)
  - Average Time Taken (formatted duration)
  - Average Memory Usage (formatted MB)
  - Total Items Processed (with trend)
  - Date Range (earliest/latest collection dates)

#### 2. Account Health & Insights Section

- **`AccountHealthCard.tsx`**: Primary health indicator card showing:
  - Health Score (0-100) with visual gauge/progress bar
  - Needs Attention badge/alert (if healthScore < 70)
  - Key health indicators breakdown
  - Last collection date with relative time ("2 days ago")
  - Actionable recommendations based on health score

#### 3. Entity Statistics Section

- **`EntityStatisticsTable.tsx`**: Table displaying stats for each entity type (competitions, teams, games):
  - Entity Type column
  - Total Items Found
  - Total Items Updated
  - Total Items New
  - Total Errors
  - Update Rate %
  - New Item Rate %
  - Error Rate %
  - Collections Processed count
  - Visual indicators (color-coded error rates, progress bars)

#### 4. Stage Analysis Section

- **`StageCompletionCard.tsx`**: Card showing:
  - Overall Completion Rate (large metric)
  - Fully Completed Collections count
  - In Progress Collections count
  - Average Stages Completed vs Average Pending Stages
- **`StageDistributionChart.tsx`**: Chart showing:
  - Current Stage Distribution (bar/pie chart)
  - Most Common Pending Stages list

#### 5. Performance Metrics Section

- **`PerformanceMetricsCards.tsx`**: Cards displaying:
  - Time Taken metrics (average, median, min, max)
  - Memory Usage metrics (average, median, min, max)
  - Visual comparison (before/after, trend indicators)
- **`PerformanceDistributionChart.tsx`**: Distribution visualization of time/memory usage

#### 6. Error Analysis Section

- **`ErrorAnalysisCard.tsx`**: Error summary card showing:
  - Overall Error Rate (large metric with color coding)
  - Collections with Errors count
  - Total Errors across all entities
- **`ErrorRateByEntityChart.tsx`**: Chart comparing error rates:
  - Error Rate by Entity Type (bar chart)
  - Visual comparison between competitions, teams, games

#### 7. Temporal Analysis Section

- **`CollectionFrequencyCard.tsx`**: Card showing:
  - Total Collections count
  - Last Collection Date (formatted with relative time)
  - Days Since Last Collection
  - Collection Frequency (collections per day)
  - Frequency trend indicator

#### 8. Data Volume Section

- **`DataVolumeCard.tsx`**: Card displaying:
  - Total Items Processed
  - Average Items Per Collection
  - Update Ratio %
  - New Item Ratio %
  - Visual breakdown (pie/bar chart)

#### 9. Time Series Charts Section

- **`CollectionsOverTimeChart.tsx`**: Line/area chart showing:

  - Collection count over time
  - Error indicators (color-coded by hasError)
  - Completion rate overlay

- **`PerformanceOverTimeChart.tsx`**: Dual-axis line chart showing:

  - Time Taken (milliseconds) - primary axis
  - Memory Usage (MB) - secondary axis
  - Trend lines for both metrics

- **`ItemsProcessedOverTimeChart.tsx`**: Stacked area/line chart showing:

  - Items Found over time
  - Items Updated over time
  - Items New over time
  - Cumulative Items line

- **`ErrorsOverTimeChart.tsx`**: Combination chart:

  - Bar chart: Errors per collection
  - Line chart: Cumulative Errors trend
  - Error flag indicators

- **`CompletionRateOverTimeChart.tsx`**: Line chart with stages:

  - Completion Rate % over time
  - Stage information overlay
  - Completed vs Pending stages comparison

- **`EntityStatsOverTimeChart.tsx`**: Multi-series line chart:
  - Items Found for each entity type (competitions, teams, games)
  - Separate series with different colors
  - Legend and tooltips

#### 10. Container/Layout Components

- **`DataCollectionDashboard.tsx`**: Main container component that:

  - Organizes all sections into a responsive grid layout
  - Handles loading/error states
  - Provides section navigation/tabs if needed
  - Implements collapsible sections for better UX

- **`DataCollectionSection.tsx`**: Reusable section wrapper component:
  - Consistent section headers
  - Collapsible functionality
  - Loading skeleton states

#### 11. Utility/Helper Components

- **`MetricCard.tsx`**: Reusable metric card component (can use existing)
- **`StatBadge.tsx`**: Badge component for displaying stats with color coding
- **`TrendIndicator.tsx`**: Arrow/icon component showing trends (up/down/stable)
- **`DateFormatter.tsx`**: Utility component for formatting dates with relative time
- **`PercentageBar.tsx`**: Progress bar component for percentages

### Phase 4c: Component Implementation Priority ⏳

**Priority 1 - Core Metrics (MVP):**

- [x] SummaryCards.tsx - Key metrics at a glance ✅
- [x] AccountHealthCard.tsx - Primary health indicator ✅
- [x] EntityStatisticsTable.tsx - Entity breakdown ✅
- [x] ErrorAnalysisCard.tsx - Error overview ✅

**Priority 2 - Performance & Analysis:**

- [x] PerformanceMetricsCards.tsx - Time/memory metrics ✅
- [x] StageAnalysisCard.tsx - Completion analysis ✅
- [x] TemporalAnalysisCard.tsx - Collection frequency ✅
- [x] CollectionsOverTimeChart.tsx - Basic time series ✅

**Priority 3 - Advanced Visualizations:**

- [x] PerformanceOverTimeChart.tsx - Performance trends ✅
- [x] ItemsProcessedOverTimeChart.tsx - Volume trends ✅
- [x] ErrorsOverTimeChart.tsx - Error trends ✅
- [x] CompletionRateOverTimeChart.tsx - Completion trends ✅
- [x] EntityStatsOverTimeChart.tsx - Entity trends ✅

**Priority 4 - Polish & Enhancement:**

- [x] DataVolumeCard.tsx - Volume breakdown ✅
- [x] StageDistributionChart.tsx - Stage visualization ✅
- [x] PerformanceDistributionChart.tsx - Distribution charts ✅
- [x] ErrorRateByEntityChart.tsx - Error comparison ✅
- [x] DataCollectionDashboard.tsx - Main container ✅
- [x] DataCollectionSection.tsx - Section wrapper ✅
- [x] Utility components (TrendIndicator, formatters.ts) ✅

**File Structure for Components:**

**Component Storage Location (Confirmed):**
`src/app/dashboard/accounts/components/overview/tabs/components/data-collection/`

This folder exists and is ready for component storage. All data collection UI components will be organized in subfolders within this directory.

```
src/app/dashboard/accounts/components/overview/tabs/components/data-collection/
├── DataCollectionDashboard.tsx          # Main container
├── DataCollectionSection.tsx            # Section wrapper
├── summary/
│   └── SummaryCards.tsx
├── health/
│   └── AccountHealthCard.tsx
├── entities/
│   ├── EntityStatisticsTable.tsx
│   └── EntityStatsOverTimeChart.tsx
├── performance/
│   ├── PerformanceMetricsCards.tsx
│   ├── PerformanceOverTimeChart.tsx
│   └── PerformanceDistributionChart.tsx
├── errors/
│   ├── ErrorAnalysisCard.tsx
│   ├── ErrorsOverTimeChart.tsx
│   └── ErrorRateByEntityChart.tsx
├── stages/
│   ├── StageAnalysisCard.tsx
│   └── StageDistributionChart.tsx
├── temporal/
│   └── CollectionFrequencyCard.tsx
├── volume/
│   └── DataVolumeCard.tsx
├── charts/
│   ├── CollectionsOverTimeChart.tsx
│   ├── ItemsProcessedOverTimeChart.tsx
│   ├── CompletionRateOverTimeChart.tsx
│   └── EntityStatsOverTimeChart.tsx
└── utils/
    ├── TrendIndicator.tsx
    ├── DateFormatter.tsx
    └── PercentageBar.tsx
```

### Phase 5: Error Handling & User Feedback ⏳

- [ ] Implement comprehensive error message parsing
- [ ] Handle "account not found" error appropriately
- [ ] Handle invalid accountId format errors
- [ ] Handle network/timeout errors gracefully
- [ ] Display loading indicators during data fetch
- [ ] Show error messages in user-friendly format
- [ ] Consider adding retry functionality for failed requests

### Phase 6: Testing & Validation ⏳

- [ ] Test with valid CLUB account
- [ ] Test with valid ASSOCIATION account
- [ ] Test with invalid accountId (should return 404 or error)
- [ ] Test with missing accountId (should not trigger query)
- [ ] Verify loading states display correctly
- [ ] Verify error states display correctly
- [ ] Verify data displays correctly in Data.tsx
- [ ] Verify query caching works as expected
- [ ] Verify query invalidation when account changes

## Constraints, Risks, Assumptions

### Constraints

- Must use existing patterns: TanStack Query for data fetching (`useQuery`), Next.js server actions
- Must follow existing error handling patterns from analytics and account services
- Must integrate with existing CMS backend endpoint structure
- Must use existing UI component library (shadcn/ui components)
- AccountId must be extracted from URL params or account data

### Risks

- API endpoint response structure may differ from expected format
- Large data responses may impact performance; consider pagination if needed
- Data collection endpoint may have rate limiting that needs to be handled gracefully
- Query caching strategy may need adjustment based on data update frequency
- Error messages from backend may need translation for user-friendly display

### Assumptions

- CMS backend endpoint exists and is accessible (endpoint path to be confirmed)
- Backend endpoint accepts accountId as parameter (path param or query param - to be confirmed)
- Backend returns standardized response format
- AccountId can be extracted from `useParams()` or `accountData.id`
- Data collection information is read-only (GET endpoint, no mutations)
- Data collection data updates are relatively infrequent (appropriate for caching)

## Implementation Pathway

### Step-by-Step Implementation Order

1. **Start with Type Definitions** → Create types first to ensure type safety throughout
2. **Create Service Function** → Implement server action following existing patterns
3. **Create TanStack Query Hook** → Bridge between server action and UI components
4. **Integrate into Data.tsx** → Add hook usage and display data
5. **Add Error Handling** → Comprehensive error handling and user feedback
6. **Test & Validate** → Ensure all scenarios work correctly

### File Structure

```
src/
├── lib/
│   └── services/
│       └── data-collection/
│           └── fetchAccountDataCollection.ts    # Server action
├── hooks/
│   └── accounts/
│       └── useAccountDataCollectionQuery.ts     # TanStack Query hook
├── types/
│   └── dataCollection.ts                        # Type definitions (or update existing)
└── app/
    └── dashboard/
        └── accounts/
            └── components/
                └── overview/
                    └── tabs/
                        └── Data.tsx             # UI component integration
```

### Key Integration Points

- **Account ID Source**: Extract from `useParams()` or `accountData.id`
- **Query Key**: Use `["accountDataCollection", accountId]` for proper caching
- **Stale Time**: Configure based on data update frequency (recommend 1-5 minutes)
- **Loading States**: Use `isLoading` from `useQuery` hook
- **Error States**: Use `isError` and `error` from `useQuery` hook
- **Error Patterns**: Follow `useAccountAnalytics.ts` and `useAccountQuery.ts` patterns

### Dependencies

- **External**: `@tanstack/react-query`, `axios` (for service function), Next.js server utilities
- **Internal**: Existing UI components, account query hooks, types

---

## API Endpoint Details

- **URL**: `GET /api/data-collection/insights/:accountId` (confirmed - working)
- **Purpose**: Fetch comprehensive account-specific data collection statistics and insights
- **Parameters**:
  - `accountId` (string, required): Account ID (path parameter)
- **Response**: `AccountStatsResponse` - Comprehensive statistics including:
  - Account information and summary
  - Entity statistics (competitions, teams, games)
  - Stage analysis and completion rates
  - Performance metrics (time and memory)
  - Error analysis
  - Temporal analysis and collection frequency
  - Data volume statistics
  - Account health insights and scoring
  - Time series data for all metrics
- **Response Time**: To be determined
- **Data Volume**: Medium-High (single account with comprehensive historical data)

---

## Related Endpoints

- **Account-Only Update**: `POST /api/data-collection/update-account-only` (TKT-2025-007, mutation endpoint)
- **Full Account Sync**: `GET /api/data-collection/syncAccount/:ID/:TYPE` (existing, comprehensive sync)

---

## Notes

- This is a GET endpoint for data fetching (read-only operation)
- Query caching strategy should be configured based on data update frequency
- Consider adding refresh/refetch functionality in UI if data can become stale
- May need to integrate with existing account query invalidation patterns

---

# Ticket – TKT-2025-007

## Overview

Implement on-demand account sync functionality that allows administrators to trigger lightweight account metadata updates via the `updateAccountOnly` Redis Bull queue. This provides a faster alternative to full account synchronization by only updating account metadata without processing competitions, teams, or games.

## What We Need to Do

Create a complete implementation pathway for account sync on-demand functionality, including:

1. API route handler for `/api/data-collection/update-account-only` endpoint
2. TanStack Query mutation hook for frontend integration
3. UI button component in the Data tab to trigger sync
4. Error handling and user feedback mechanisms
5. Account status validation to prevent duplicate sync operations

## Phases & Tasks

### Phase 1: API Route Implementation ❌ (Removed - Not Used)

**Note:** Initially created but removed as the final implementation uses the server action approach instead. The server action calls the CMS backend directly, making the Next.js API route unnecessary.

- [x] ~~Create `src/app/api/data-collection/update-account-only/route.ts`~~ (Removed)
- [x] ~~Implement POST handler with request validation~~ (Not needed)
- [x] ~~Add accountId and accountType validation~~ (Handled in server action)
- [x] ~~Implement account existence check~~ (Handled in server action)
- [x] ~~Add account status check~~ (Handled in server action)
- [x] ~~Integrate with CMS backend endpoint~~ (Server action handles this)
- [x] ~~Return standardized success/error responses~~ (Server action handles this)
- [x] ~~Add proper error handling~~ (Server action handles this)
- [x] ~~Include logging~~ (Server action handles this)

**Current Implementation:** The hook calls `updateAccountOnly` server action directly, which calls the CMS backend at `/data-collection/update-account-only` using axiosInstance. The API route was removed as it was not being used.

### Phase 2: Service Layer (Optional but Recommended) ✅

- [x] Create `src/lib/services/data-collection/updateAccountOnly.ts` following existing service patterns
- [x] Use `"use server"` directive for Next.js server-side execution
- [x] Implement function that calls CMS backend API
- [x] Add proper TypeScript interfaces for request/response types
- [x] Follow existing AxiosError handling patterns from `src/lib/services/analytics/`
- [x] Add comprehensive error logging consistent with other services

### Phase 3: TanStack Query Hook ✅

- [x] Create `src/hooks/pulse/useUpdateAccountOnly.ts` (or `src/hooks/accounts/useUpdateAccountOnly.ts`)
- [x] Implement `useMutation` hook following patterns from `useSchedulerUpdate.ts` and `useDeleteRender.ts`
- [x] Define TypeScript interfaces for request and response types
- [x] Add proper error handling in `onError` callback
- [x] Add success handling in `onSuccess` callback
- [x] Implement query invalidation if needed (e.g., invalidate account queries after sync)
- [x] Add loading states and error states to hook return value

### Phase 4: Type Definitions ✅

- [x] Create or update `src/types/data-collection.ts` (or add to existing types file)
- [x] Define `UpdateAccountOnlyRequest` interface with `accountId: number` and `accountType: "CLUB" | "ASSOCIATION"`
- [x] Define `UpdateAccountOnlyResponse` interface matching API documentation
- [x] Define error response interfaces if not already present
- [x] Export types for use in hooks and components

### Phase 5: UI Component Implementation ✅

- [x] Update `src/app/dashboard/accounts/components/overview/tabs/Data.tsx`
- [x] Add button component with loading state (following `Button_SyncAccount.tsx` pattern)
- [x] Integrate `useUpdateAccountOnly` hook
- [x] Determine accountType from account data (`account_type === 1` is "CLUB", otherwise "ASSOCIATION")
- [x] Extract accountId from useParams or accountData
- [x] Add toast notifications for success/error states (using existing toast hook)
- [x] Disable button when `isPending` is true
- [x] Add confirmation dialog if needed (optional, following `Button_SyncAccount.tsx` pattern)
- [x] Style button consistently with existing UI components

### Phase 6: Error Handling & User Feedback ✅

- [x] Implement comprehensive error message parsing
- [x] Handle "already in updating phase" error with user-friendly message
- [x] Handle "account not found" error appropriately
- [x] Handle validation errors (missing fields, invalid accountType)
- [x] Add toast notifications for all error scenarios
- [x] Ensure loading states are displayed correctly
- [x] Add disabled state styling when sync is in progress

### Phase 7: Testing & Validation ✅

- [x] Test with valid CLUB account
- [x] Test with valid ASSOCIATION account
- [x] Test with invalid accountId (should return 404)
- [x] Test with account already updating (should return 400)
- [x] Test with invalid accountType (should return 400)
- [x] Test with missing fields (should return 400)
- [x] Verify button is disabled during sync operation
- [x] Verify toast notifications appear correctly
- [x] Verify account data refreshes after successful sync (if applicable)

## Constraints, Risks, Assumptions

### Constraints

- Must use existing patterns: TanStack Query for mutations, Next.js App Router for API routes
- AccountType must be exactly "CLUB" or "ASSOCIATION" (uppercase, case-sensitive)
- Must check `isUpdating` flag before queuing job to prevent duplicates
- Must follow existing error handling patterns from analytics and scheduler services
- Must integrate with existing CMS backend endpoint structure
- Must use existing UI component library (shadcn/ui components)

### Risks

- Account sync operations may take time; UI should reflect async nature
- Race conditions if multiple sync requests are triggered simultaneously
- Backend endpoint may have rate limiting that needs to be handled gracefully
- Account status (`isUpdating` flag) may not update immediately, causing confusion
- Error messages from backend may need translation for user-friendly display

### Assumptions

- CMS backend endpoint `/api/data-collection/update-account-only` is already implemented
- Backend endpoint expects `accountId` and `accountType` in request body
- Backend returns standardized error format matching documentation
- Account `isUpdating` flag is managed by worker process, not this endpoint
- Toast notification system is already available in the application
- Account data structure includes `account_type` field (1 = CLUB, 2 = ASSOCIATION)
- URL structure `/club/[accountID]` and `/association/[accountID]` indicates account type

## Implementation Pathway

### Step-by-Step Implementation Order

1. **Start with Type Definitions** → Create types first to ensure type safety throughout
2. **Create API Route** → Implement server-side endpoint handler
3. **Create Service Function** (Optional) → Follow existing service patterns for consistency
4. **Create TanStack Query Hook** → Bridge between API and UI components
5. **Implement UI Component** → Add button to Data.tsx tab
6. **Add Error Handling** → Comprehensive error handling and user feedback
7. **Test & Validate** → Ensure all scenarios work correctly

### File Structure

```
src/
├── lib/
│   └── services/
│       └── data-collection/
│           └── updateAccountOnly.ts            # Server action (in use)
├── hooks/
│   └── accounts/
│       └── useUpdateAccountOnly.ts             # TanStack Query mutation hook
├── types/
│   └── dataCollection.ts                       # Type definitions
└── app/
    └── dashboard/
        └── accounts/
            └── components/
                └── overview/
                    └── tabs/
                        └── Data.tsx            # UI component with sync button
```

### Key Integration Points

- **Account Type Detection**: Use `accountData.account_type === 1 ? "CLUB" : "ASSOCIATION"`
- **Account ID Source**: Extract from `useParams()` or `accountData.id`
- **Toast System**: Use existing toast hook (e.g., `useToast` from `@/hooks/use-toast`)
- **Loading States**: Use `isPending` from `useMutation` hook
- **Error Patterns**: Follow `useSchedulerUpdate.ts` and `useDeleteRender.ts` patterns

### Dependencies

- **External**: `@tanstack/react-query`, `axios` (for service function), Next.js server utilities
- **Internal**: Existing UI components, toast system, account query hooks, types

---

## Related Endpoints

- **Full Account Sync**: `GET /api/data-collection/syncAccount/:ID/:TYPE` (existing, slower, comprehensive)
- **Account-Only Update**: `POST /api/data-collection/update-account-only` (this ticket, faster, lightweight)

---

## Notes

- This endpoint only queues the job; processing happens asynchronously in the background
- Consider implementing polling or WebSocket updates to track job completion status (future enhancement)
- The endpoint prevents duplicate syncs by checking `isUpdating` flag
- Account type validation is strict and case-sensitive
