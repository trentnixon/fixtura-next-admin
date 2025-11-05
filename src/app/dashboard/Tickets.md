# Completed Tickets

---

# Ticket – TKT-2025-009

## Overview

Implement global data collection insights endpoint for fetching system-wide data collection performance and monitoring metrics. This endpoint provides high-level operational metrics across all data collections (unlike the account-specific endpoint) and will be integrated into the main dashboard page to display global system health and performance.

## What We Need to Do

Create a complete implementation pathway for the global data collection insights endpoint, including:

1. TypeScript type definitions for request/response data matching the API documentation
2. Server action function to call CMS backend global insights endpoint (`/api/data-collection/insights`)
3. TanStack Query hook (`useQuery`) for frontend data fetching with optional query parameters
4. UI component for displaying global insights on the main dashboard page
5. Error handling and loading states for user feedback
6. Support for optional query parameters (sport, accountType, hasError, dateFrom, dateTo, sortBy, sortOrder, limit)

## Phases & Tasks

### Phase 1: Type Definitions ✅

- [x] Create or update `src/types/dataCollection.ts` to add global insights types
- [x] Define `UseGlobalInsightsOptions` interface for optional query parameters:
  - `sport?: string` (Cricket, AFL, Hockey, Netball, Basketball)
  - `accountType?: 'CLUB' | 'ASSOCIATION'`
  - `hasError?: boolean`
  - `dateFrom?: string` (ISO format)
  - `dateTo?: string` (ISO format)
  - `sortBy?: string` (whenWasTheLastCollection, TimeTaken, MemoryUsage)
  - `sortOrder?: 'asc' | 'desc'`
  - `limit?: number`
- [x] Define `GlobalInsightsResponse` interface matching API documentation structure
- [x] Define nested type interfaces:
  - `GlobalSummary` (totalCollections, collectionsWithErrors, collectionsIncomplete, errorRate, averageTimeTaken, averageMemoryUsage, dateRange)
  - `GlobalPerformanceMetrics` (timeTaken stats, memoryUsage stats)
  - `GlobalErrorAnalysis` (totalErrors, collectionsWithErrors, errorRate)
  - `GlobalTemporalAnalysis` (totalCollections, lastCollectionDate, daysSinceLastCollection, collectionFrequency)
  - `IncompleteCollections` (count, percentage)
  - `AccountTimeSummary` (accountId, accountName, totalTimeTaken, averageTimeTaken, collectionCount)
  - `RecentCollection` (id, accountId, accountName, whenWasTheLastCollection, timeTaken, memoryUsage, hasError, isIncomplete)
  - `GlobalTimeSeries` (performanceOverTime, errorsOverTime, collectionsFrequencyOverTime)
  - `PerformanceDataPoint` (date, averageTimeTaken, averageMemoryUsage, maxTimeTaken, maxMemoryUsage)
  - `ErrorDataPoint` (date, errorCount, incompleteCount, totalCollections)
  - `FrequencyDataPoint` (date, count)
- [x] Export all types for use in hooks and components
- [x] Ensure type definitions match the API documentation exactly

**Implementation Details:**

- All types have been added to `src/types/dataCollection.ts` with proper JSDoc comments
- Types are prefixed with `Global` where needed to differentiate from account-specific types (e.g., `GlobalSummary`, `GlobalPerformanceMetrics`, `GlobalErrorAnalysis`, `GlobalTemporalAnalysis`, `GlobalTimeSeries`)
- All types match the API documentation structure exactly
- All types are exported and ready for use in hooks and components
- Type definitions include proper comments indicating units (seconds, MB, percentages) and formats (ISO 8601, YYYY-MM-DD)

### Phase 2: Service Layer (Server Action) ✅

- [x] Create `src/lib/services/data-collection/fetchGlobalInsights.ts` following existing service patterns
- [x] Use `"use server"` directive for Next.js server-side execution
- [x] Implement function that accepts optional `UseGlobalInsightsOptions` parameter
- [x] Call CMS backend endpoint using axiosInstance (endpoint path: `/data-collection/insights`)
- [x] Build query string from optional parameters (only include non-undefined values)
- [x] Add proper TypeScript return type matching response interface (`GlobalInsightsResponse`)
- [x] Follow existing AxiosError handling patterns from `src/lib/services/data-collection/fetchAccountDataCollection.ts`
- [x] Add comprehensive error logging consistent with other services
- [x] Add input validation for date formats (ISO format validation)
- [x] Add input validation for enum values (sport, accountType, sortBy, sortOrder)
- [x] Add input validation for numeric values (limit must be positive)

**Implementation Details:**

- Function: `fetchGlobalInsights(options?: UseGlobalInsightsOptions): Promise<GlobalInsightsResponse>`
- Endpoint: `GET /data-collection/insights` (with optional query parameters)
- Query string building: Uses URLSearchParams to construct query string from options (only includes non-undefined values)
- Validation includes:
  - Date format validation: ISO 8601 format validation with regex and Date object validation
  - Date range validation: Ensures dateFrom is before or equal to dateTo
  - Enum validation: Validates sport (Cricket, AFL, Hockey, Netball, Basketball), accountType (CLUB, ASSOCIATION), sortBy (whenWasTheLastCollection, TimeTaken, MemoryUsage), sortOrder (asc, desc)
  - Numeric validation: Validates limit is a positive integer
- Error handling: Comprehensive AxiosError handling with detailed logging and specific status code messages (404, 401, 403, 500)
- Response validation: Validates response structure and required `data` property
- Helper functions: Created `isValidISODate`, `isValidSport`, and `isValidSortBy` for validation logic
- Logging: Comprehensive console logging for debugging (includes input options, endpoint URL, response keys, and success metrics)
- Error messages: User-friendly error messages for all validation failures and HTTP errors

### Phase 3: TanStack Query Hook ✅

- [x] Create `src/hooks/data-collection/useGlobalInsights.ts` (or appropriate location)
- [x] Implement `useQuery` hook following patterns from `useGlobalAnalytics.ts` and `useAccountDataCollectionQuery.ts`
- [x] Define queryKey with options for proper caching: `["globalDataCollectionInsights", options]` (serialize options for cache key)
- [x] Accept optional `UseGlobalInsightsOptions` parameter in hook
- [x] Pass options to service function
- [x] Add appropriate `staleTime` configuration (recommend 3-5 minutes for global insights)
- [x] Configure retry logic (3 retries with exponential backoff)
- [x] Add proper TypeScript types using UseQueryResult generic
- [x] Export hook for use in components
- [x] Consider creating a hook variant that accepts filter options as reactive dependencies

**Implementation Details:**

- Hook: `useGlobalInsights(options?: UseGlobalInsightsOptions): UseQueryResult<GlobalInsightsData, Error>`
- Query Key: `["globalDataCollectionInsights", JSON.stringify(options || {})]` for proper cache isolation based on filters
- Stale Time: 3 minutes (configured to balance freshness with global insights update frequency)
- Retry Logic: 3 retries with exponential backoff (up to 10 seconds max delay)
- Type Safety: Full TypeScript integration with `GlobalInsightsData` return type (extracts `data` property from response wrapper)
- Follows patterns from `useGlobalAnalytics.ts` and `useAccountDataCollectionQuery.ts`
- Data extraction: Hook extracts `response.data` from the service response wrapper to provide direct access to `GlobalInsightsData`
- Cache key serialization: Uses `JSON.stringify` to ensure different filter combinations create separate cache entries

### Phase 4: UI Component Integration ✅

- [x] Create `src/app/dashboard/components/GlobalDataCollectionInsights.tsx` component
- [x] Import and use `useGlobalInsights` hook (with optional filter parameters)
- [x] Handle loading state with appropriate UI feedback (spinner with loading message)
- [x] Handle error state with user-friendly error messages
- [x] Add empty state handling when no data is available
- [x] Create component folder structure following account-specific pattern
- [x] Create `GlobalInsightsDashboard.tsx` orchestrator component
- [x] Create `GlobalInsightsSection.tsx` wrapper component
- [x] Create placeholder components for all sections:
  - Summary cards component
  - Performance metrics cards component
  - Error analysis card component
  - Temporal analysis card component
  - Top accounts table component
  - Recent collections table component
  - Performance over time chart component
  - Errors over time chart component
  - Collections frequency chart component
- [x] Create utility formatters file
- [x] Organize components into logical folders (summary, performance, errors, temporal, accounts, collections, charts, utils)
- [x] Implement summary metrics display:
  - Total collections count
  - Error rate percentage
  - Average time taken
  - Average memory usage
  - Incomplete collections count
- [x] Implement performance metrics cards (average, median, min, max for time and memory)
- [x] Implement error analysis section UI
- [x] Implement temporal analysis section UI
- [x] Implement top 5 accounts table UI
- [x] Implement recent collections table UI
- [x] Implement time series charts with recharts:
  - Performance over time (averageTimeTaken, averageMemoryUsage, maxTimeTaken, maxMemoryUsage)
  - Errors over time (errorCount, incompleteCount, totalCollections)
  - Collections frequency over time (count per day)
- [x] Style consistently with existing dashboard components (following patterns from GlobalAnalyticsWidget)
- [x] Add section titles and appropriate spacing
- [ ] Consider adding filter UI controls (sport selector, account type selector, date range picker, error filter toggle)

**Implementation Details (Current):**

- Component structure created: `src/app/dashboard/components/global-insights/`
- Main entry component: `GlobalDataCollectionInsights.tsx` - handles loading/error/empty states with Skeleton components
- Dashboard orchestrator: `GlobalInsightsDashboard.tsx` - organizes all sections using GlobalInsightsSection wrapper
- Section wrapper: `GlobalInsightsSection.tsx` - provides consistent styling with Card components
- All components implemented and fully functional:
  - `summary/SummaryCards.tsx` - Uses MetricCard components in responsive grid (6 cards)
  - `performance/PerformanceMetricsCards.tsx` - Two-card layout with variance indicators and spread calculations
  - `errors/ErrorAnalysisCard.tsx` - Error analysis with severity indicators, progress bars, and action alerts
  - `temporal/TemporalAnalysisCard.tsx` - Temporal analysis with frequency status, last collection info, and staleness warnings
  - `accounts/TopAccountsTable.tsx` - Table with rank, account links, time metrics, and summary footer
  - `collections/RecentCollectionsTable.tsx` - Table showing recent collections with status badges and account links
  - `charts/PerformanceOverTimeChart.tsx` - Multi-line chart with dual Y-axis showing time and memory metrics
  - `charts/ErrorsOverTimeChart.tsx` - Multi-line chart with dual Y-axis showing errors, incomplete, and total collections
  - `charts/CollectionsFrequencyChart.tsx` - Bar chart showing daily collection frequency
- Utilities: `utils/formatters.ts` - All formatting functions implemented (duration, memory, percentage, dates)
- All components use common UI components: Card, Badge, Table, ChartContainer, MetricCard
- All charts use recharts with ChartContainer, ChartTooltip, ChartTooltipContent
- Loading states: Uses Skeleton components for better UX
- Error states: Uses Card components with error styling
- Empty states: Proper empty state handling for all components
- Structure follows account-specific data collection pattern for consistency
- All components are responsive and follow dashboard design patterns
- Charts include summary statistics above each chart
- Tables include clickable account links for navigation

### Phase 5: Dashboard Page Integration ✅

- [x] Update `src/app/dashboard/page.tsx` to include GlobalDataCollectionInsights component
- [x] Add section with appropriate SectionTitle (e.g., "Data Collection Insights")
- [x] Position component appropriately in dashboard layout (after LiveOverview or Schedulers section)
- [x] Ensure proper spacing and layout consistency
- [x] Test loading states, error states, and data display
- [ ] Verify responsive design works correctly

**Implementation Details:**

- Component imported and added to dashboard page
- Section added with SectionTitle "Data Collection Insights"
- Positioned after Schedulers section, before Renders section
- Follows existing dashboard layout patterns with consistent spacing
- API response verified and working correctly
- Component structure displays JSON data for all sections
- Loading states working with Skeleton components
- Error states properly handled with Card components
- Data successfully flowing from API → Service → Hook → Component

### Phase 6: Advanced Features (Optional)

- [ ] Add filter controls UI component for filtering insights:
  - Sport dropdown selector
  - Account type radio buttons or toggle
  - Date range picker component
  - Error filter toggle switch
  - Sort controls (sortBy dropdown, sortOrder toggle)
  - Limit input field
- [ ] Implement filter state management (useState or URL params)
- [ ] Pass filter options to useGlobalInsights hook
- [ ] Add "Clear Filters" button
- [ ] Add export functionality (CSV export of insights data)
- [ ] Add refresh button for manual data refresh
- [ ] Add tooltips for metric explanations
- [ ] Add comparison views (compare different time periods)

## Constraints, Risks, Assumptions

### Constraints

- CMS backend endpoint must be accessible at `/data-collection/insights`
- Backend endpoint accepts query parameters as documented
- Backend returns standardized response format matching documentation
- Time series data is limited to last 12 months (backend constraint)
- Biggest accounts returns only top 5 (backend constraint)
- Recent collections returns only top 5 (backend constraint)

### Risks

- Large dataset responses may impact performance - consider implementing pagination or data limiting
- Multiple filter combinations may create many cache entries - monitor cache memory usage
- Time series data rendering may be slow with 12 months of daily data points - consider data aggregation or virtualization
- Filter options may conflict with each other - ensure backend handles all combinations correctly

### Assumptions

- CMS backend endpoint exists and is accessible (endpoint path confirmed: `/data-collection/insights`)
- Backend accepts optional query parameters as documented
- Backend returns standardized response format matching documentation
- Global insights data updates are relatively infrequent (appropriate for caching)
- Dashboard page has sufficient space for the insights component
- Charting library (recharts) is already available in the project
- Users have permission to view global data collection insights

## Implementation Pathway

### Step-by-Step Implementation Order

1. **Start with Type Definitions** → Create types first to ensure type safety throughout ✅
2. **Create Service Function** → Implement server action following existing patterns ✅
3. **Create TanStack Query Hook** → Bridge between server action and UI components ✅
4. **Create Component Structure** → Set up folder structure and placeholder components ✅
5. **Integrate into Dashboard** → Add component to main dashboard page ✅
6. **Implement Summary Metrics** → Display summary cards with key metrics (in progress)
7. **Implement Performance Metrics** → Display performance cards and distributions
8. **Implement Error Analysis** → Display error analysis section
9. **Implement Temporal Analysis** → Display temporal analysis section
10. **Implement Tables** → Display top accounts and recent collections tables
11. **Implement Time Series Charts** → Implement chart visualizations with recharts
12. **Add Error Handling** → Comprehensive error handling and user feedback ✅
13. **Add Filters (Optional)** → Implement filter controls if needed
14. **Test & Validate** → Ensure all scenarios work correctly

### File Structure

```
src/
├── lib/
│   └── services/
│       └── data-collection/
│           └── fetchGlobalInsights.ts          # Server action ✅
├── hooks/
│   └── data-collection/
│       └── useGlobalInsights.ts                 # TanStack Query hook ✅
├── types/
│   └── dataCollection.ts                        # Type definitions ✅
└── app/
    └── dashboard/
        ├── components/
        │   ├── GlobalDataCollectionInsights.tsx # Main entry component ✅
        │   └── global-insights/
        │       ├── GlobalInsightsDashboard.tsx  # Dashboard orchestrator ✅
        │       ├── GlobalInsightsSection.tsx     # Section wrapper ✅
        │       ├── summary/
        │       │   └── SummaryCards.tsx          # Summary metrics (placeholder) ✅
        │       ├── performance/
        │       │   └── PerformanceMetricsCards.tsx # Performance metrics (placeholder) ✅
        │       ├── errors/
        │       │   └── ErrorAnalysisCard.tsx     # Error analysis (placeholder) ✅
        │       ├── temporal/
        │       │   └── TemporalAnalysisCard.tsx  # Temporal analysis (placeholder) ✅
        │       ├── accounts/
        │       │   └── TopAccountsTable.tsx      # Top accounts table (placeholder) ✅
        │       ├── collections/
        │       │   └── RecentCollectionsTable.tsx # Recent collections (placeholder) ✅
        │       ├── charts/
        │       │   ├── PerformanceOverTimeChart.tsx # Performance chart (placeholder) ✅
        │       │   ├── ErrorsOverTimeChart.tsx    # Errors chart (placeholder) ✅
        │       │   └── CollectionsFrequencyChart.tsx # Frequency chart (placeholder) ✅
        │       └── utils/
        │           └── formatters.ts             # Utility formatters ✅
        └── page.tsx                              # Dashboard page integration ✅
```

### Key Integration Points

- **Query Key**: Use `["globalDataCollectionInsights", JSON.stringify(options)]` for proper cache isolation
- **Stale Time**: Configure based on data update frequency (recommend 3-5 minutes)
- **Loading States**: Use `isLoading` from `useQuery` hook
- **Error States**: Use `isError` and `error` from `useQuery` hook
- **Error Patterns**: Follow `useGlobalAnalytics.ts` and `useAccountDataCollectionQuery.ts` patterns
- **Component Patterns**: Follow `GlobalAnalyticsWidget.tsx` patterns for dashboard component structure
- **Chart Patterns**: Follow existing chart component patterns from data-collection components

### API Endpoint Details

- **Base URL**: `GET /api/data-collection/insights`
- **Authentication**: Requires standard Strapi auth token
- **Query Parameters**: All optional - sport, accountType, hasError, dateFrom, dateTo, sortBy, sortOrder, limit
- **Response**: GlobalInsightsResponse with comprehensive metrics and time series data

### Key Differences from Account-Specific Endpoint

| Feature                | Global Endpoint                | Account-Specific Endpoint           |
| ---------------------- | ------------------------------ | ----------------------------------- |
| **Focus**              | Performance & Time metrics     | Detailed processing tracker content |
| **Processing Tracker** | Not included                   | Fully parsed and analyzed           |
| **Entity Statistics**  | Not included                   | Detailed by entity type             |
| **Stage Analysis**     | Not included                   | Full stage completion analysis      |
| **Account Info**       | Aggregated (top accounts)      | Single account details              |
| **Time Series**        | Performance/time focused       | All metrics including entities      |
| **Date Range**         | Last 12 months for time series | All data                            |
| **Collections List**   | Top 5 recent                   | All collections (limited)           |

---

## Notes

1. **Time Series Data**: All time series arrays (`performanceOverTime`, `errorsOverTime`, `collectionsFrequencyOverTime`) are limited to the **last 12 months** and grouped by day (YYYY-MM-DD format).

2. **Biggest Accounts**: Returns only the **top 5 accounts** by total time taken.

3. **Recent Collections**: Returns only the **5 most recent collections** with account information.

4. **Date Formatting**:

   - Time series dates use `YYYY-MM-DD` format
   - Collection dates use full ISO 8601 format

5. **Filtering**: Query parameters allow filtering, but the response structure remains the same regardless of filters applied.

6. **Performance**: The endpoint aggregates data efficiently, but with large datasets, consider using date filters to limit the scope.

7. **Component Location**: The component should be placed in `src/app/dashboard/components/` following the pattern of other dashboard components like `GlobalAnalyticsWidget.tsx`.

8. **Hook Location**: Consider creating `src/hooks/data-collection/` directory if it doesn't exist, or place in `src/hooks/` root if following different pattern.

9. **Type Location**: Types should be added to existing `src/types/dataCollection.ts` file to maintain consistency with account-specific types.
