# Folder Overview

This folder contains custom React hooks that provide data fetching, state management, and UI behavior abstractions for the Fixtura Admin application. Hooks are organized by domain and primarily use React Query for server state management, providing consistent patterns for caching, error handling, and data synchronization.

## Files

### accounts/

- `useAccountQuery.ts`: Fetches individual account details by ID with caching
- `useAccountsQuery.ts`: Retrieves paginated list of accounts with filtering
- `useAccountSummaryQuery.ts`: Gets aggregated account statistics and analytics
- `useUpdateAccountOnly.ts`: Mutation hook for triggering lightweight account metadata updates
- `useAccountDataCollectionQuery.ts`: Fetches comprehensive account-specific data collection statistics including entity statistics, performance metrics, error analysis, temporal patterns, and time series data

### association/

- `useAssociationInsights.ts`: Fetches comprehensive association admin insights including overview statistics, grade/club distributions, competition insights, and detailed per-association metrics with optional sport filtering
- `useAssociationDetail.ts`: Fetches detailed association information by ID including core association data, relational data (competitions, clubs, grades, accounts), detailed statistics, and formatted responses for all related entities

### competitions/

- `useCompetitionsQuery.ts`: Fetches competitions for specific organization with account type filtering
- `useFetchCompetitionByID.ts`: Retrieves single competition details with populated relations

### downloads/

- `useDownloadsQuery.ts`: Manages download data fetching and caching

### orders/

- `useAdminOrderOverview.ts`: Fetches admin orders overview data (table rows, stats, timeline) with filter parameters
- `useAdminOrderDetail.ts`: Fetches single order detail payload and related orders for drill-down views
- `useAdminCreateInvoice.ts`: Mutation hook for creating manual invoice orders via POST /api/orders/admin/create-invoice
- `useAdminOrderUpdate.ts`: Mutation hook for updating existing orders via POST /api/orders/admin/:id

### subscription-tiers/

- `useSubscriptionTiers.ts`: Fetches all subscription tiers from the Strapi API endpoint GET /api/subscription-tiers

### fixtures/

- `useFixtureInsights.ts`: Fetches comprehensive fixture insights including overview statistics, categorized summaries (by association, competition, grade), charts, and distributions with 5-minute cache
- `useFixtureDetails.ts`: Fetches filtered fixture details based on optional filters (association, grade, competition) with 2-minute cache
- `useSingleFixtureDetail.ts`: Fetches comprehensive detailed information about a single fixture by ID including core fixture data, related entities, validation scoring, and administrative metadata with 2-minute cache

### fetch-tests/

- `useFetchTestsQuery.ts`: Fetches all fetch test data including test runs, summary, and charts
- `useFetchTestByIdQuery.ts`: Fetches detailed test information by ID with performance metrics and system info

### games/

- `useFetchGamesCricket.ts`: Fetches cricket game metadata with ID-based filtering

### grades/

- `useGradeByID.ts`: Retrieves grade/division information by ID
- `useGradeInRender.ts`: Gets grades associated with specific render operations

### renders/

- `useDeleteRender.ts`: Mutation hook for deleting renders with cache invalidation
- `useGetAccountDetailsFromRenderId.ts`: Gets account information from render ID
- `useRendersQuery.ts`: Fetches render details with enhanced data transformation

### scheduler/

- `useGetTodaysRenders.ts`: Gets renders scheduled for today
- `useGetTomorrowsRenders.ts`: Gets renders scheduled for tomorrow
- `useSchedulerByID.ts`: Retrieves scheduler details by ID
- `useSchedulerQuery.ts`: Fetches scheduler data with proper data unwrapping
- `useSchedulerRollup.ts`: Gets aggregated scheduler statistics
- `useSchedulerUpdate.ts`: Mutation hook for updating scheduler configuration

### teams/

- `useGetTeamsOnSearchTerm.ts`: Searches teams by name or criteria
- `useTeamsByID.ts`: Retrieves team details by ID

### Utility Hooks

- `use-mobile.tsx`: Responsive design hook for mobile breakpoint detection

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: React components throughout the application
- Key dependencies: `src/lib/services/` for API calls, `src/lib/tanstack-query.ts` for query client

## Dependencies

- Internal:
  - `src/lib/services/`: API service functions for data fetching
  - `src/types/`: TypeScript interfaces and type definitions
  - `src/lib/tanstack-query.ts`: React Query client configuration
- External:
  - `@tanstack/react-query`: Data fetching and caching library
  - `react`: Core React hooks and utilities

## Patterns

### Query Hooks

- **Consistent Structure**: All query hooks follow similar patterns with queryKey, queryFn, enabled, retry, and retryDelay
- **Type Safety**: Strong TypeScript integration with proper return types
- **Caching Strategy**: Domain-based query keys for efficient cache management
- **Error Handling**: Consistent error handling with exponential backoff retry logic
- **Conditional Fetching**: Uses `enabled` parameter to prevent unnecessary API calls

### Mutation Hooks

- **Cache Invalidation**: Automatic cache invalidation on successful mutations
- **Error Handling**: Comprehensive error logging and user feedback
- **Success Callbacks**: Success handlers for optimistic updates and notifications
- **Type Safety**: Proper input/output type definitions for mutations

### Data Transformation

- **Enhanced Data**: Some hooks transform raw API data into more usable formats
- **Nested Data Handling**: Proper handling of Strapi CMS nested data structures
- **Type Extensions**: Custom interfaces that extend base types for enhanced functionality

### Utility Hooks

- **Responsive Design**: Mobile breakpoint detection for responsive UI
- **Performance**: Optimized with proper cleanup and event listener management
