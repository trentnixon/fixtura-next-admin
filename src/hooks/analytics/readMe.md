# Folder Overview

This folder contains React Query hooks for the Order Analytics API system in the Fixtura Admin application. These hooks provide efficient data fetching, caching, and state management for all analytics endpoints.

## Files

- `useGlobalAnalytics.ts`: Hook for fetching global analytics summary with 5-minute cache
- `useAccountAnalytics.ts`: Hook for fetching account-specific analytics with 1-minute cache and account ID dependency
- `useSubscriptionTrends.ts`: Hook for fetching subscription trends with 10-minute cache
- `useTrialAnalytics.ts`: Hook for fetching trial analytics with 5-minute cache
- `useRevenueAnalytics.ts`: Hook for fetching revenue analytics with 5-minute cache
- `useCohortAnalysis.ts`: Hook for fetching cohort analysis with 10-minute cache

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: React components and dashboard pages
- Key dependencies: `../../types/analytics.ts` for type definitions, `../../app/api/analytics/` for API routes

## Dependencies

- Internal:
  - `../../types/analytics.ts`: TypeScript interfaces and type definitions
  - `../../app/api/analytics/`: API routes for analytics endpoints
- External:
  - `@tanstack/react-query`: React Query library for data fetching and caching

## Patterns

- **Query Keys**: Consistent query key structure for efficient cache invalidation
- **Caching**: Implements recommended staleTime based on data volatility
- **Error Handling**: Comprehensive error handling with retry logic
- **Type Safety**: Strong TypeScript integration with proper generics
- **Conditional Fetching**: Uses `enabled` option for account-specific queries
- **Retry Logic**: Exponential backoff for failed requests

## Cache Times

| Hook                    | Stale Time | Reason                                        |
| ----------------------- | ---------- | --------------------------------------------- |
| `useGlobalAnalytics`    | 5 minutes  | Moderate frequency updates acceptable         |
| `useAccountAnalytics`   | 1 minute   | Account-specific data changes more frequently |
| `useSubscriptionTrends` | 10 minutes | Historical data changes slowly                |
| `useTrialAnalytics`     | 5 minutes  | Moderate frequency updates acceptable         |
| `useRevenueAnalytics`   | 5 minutes  | Financial data changes moderately             |
| `useCohortAnalysis`     | 10 minutes | Cohort data is historical and changes slowly  |

## Usage Examples

```typescript
// Global Analytics
const { data, isLoading, error } = useGlobalAnalytics();

// Account Analytics
const { data, isLoading, error } = useAccountAnalytics(accountId);

// Subscription Trends
const { data, isLoading, error } = useSubscriptionTrends();

// Trial Analytics
const { data, isLoading, error } = useTrialAnalytics();

// Revenue Analytics
const { data, isLoading, error } = useRevenueAnalytics();

// Cohort Analysis
const { data, isLoading, error } = useCohortAnalysis();
```

## Error Handling

All hooks implement consistent error handling patterns:

- Automatic retry with exponential backoff (up to 3 attempts)
- Detailed error messages with HTTP status codes
- Proper TypeScript error types
- Integration with React Query's error boundary support
