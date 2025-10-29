# Folder Overview

This folder contains analytics service functions that handle all Order Analytics API data fetching for the Fixtura Admin application. Services follow consistent patterns for error handling, type safety, and comprehensive analytics data retrieval.

## Files

- `fetchGlobalAnalytics.ts`: Fetches system-wide analytics including accounts, subscriptions, trials, revenue, and churn analysis
- `fetchAccountAnalytics.ts`: Retrieves detailed account-specific insights including order history, subscription timeline, trial usage, payment status, renewal patterns, and account health scoring
- `fetchSubscriptionTrends.ts`: Analyzes subscription lifecycle patterns, renewal vs churn rates, tier migration trends, subscription duration patterns, and customer journey analysis
- `fetchTrialAnalytics.ts`: Provides trial usage patterns, conversion funnels, trial success predictors, engagement metrics, and trial performance analysis
- `fetchRevenueAnalytics.ts`: Delivers comprehensive revenue analysis including monthly/quarterly trends, revenue by subscription tier, payment method analysis, billing cycles, revenue projections, customer lifetime value, and seasonal patterns
- `fetchCohortAnalysis.ts`: Provides customer cohort analysis including acquisition cohorts, retention analysis, lifecycle stages, revenue patterns, churn analysis, and customer segmentation

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: React hooks in `src/hooks/analytics/`, React components, and API routes
- Key dependencies: `src/lib/axios.ts` for HTTP client, `src/types/analytics.ts` for type definitions

## Dependencies

- Internal:
  - `src/lib/axios.ts`: Configured Axios instance for API calls
  - `src/types/analytics.ts`: TypeScript interfaces and type definitions for analytics data
- External:
  - `axios`: HTTP client library
  - Order Analytics API backend endpoints at `http://localhost:1337/api/orders/analytics`

## Patterns

- **Server Actions**: All functions use `"use server"` directive for Next.js server-side execution
- **Error Handling**: Consistent AxiosError handling with detailed logging and user-friendly error messages
- **Type Safety**: Strong typing with TypeScript interfaces for requests and responses
- **Comprehensive Logging**: Detailed console logging for debugging and monitoring
- **Consistent Structure**: All services follow similar patterns for error handling, logging, and response formatting
- **API Integration**: Uses Order Analytics API endpoints with proper URL construction and parameter handling

## API Endpoints

- `/orders/analytics/global-summary` - System-wide analytics (Response time: <1s, Data volume: High)
- `/orders/analytics/account/:id` - Account-specific analytics (Response time: <1s, Data volume: Medium)
- `/orders/analytics/subscription-trends` - Subscription lifecycle analysis (Response time: <2s, Data volume: High)
- `/orders/analytics/trial-analytics` - Trial conversion analysis (Response time: <1s, Data volume: Medium)
- `/orders/analytics/revenue-analytics` - Financial insights (Response time: <2s, Data volume: High)
- `/orders/analytics/cohort-analysis` - Customer retention analysis (Response time: <2s, Data volume: High)

## Authentication Status

- **Current**: All endpoints have `auth: false` (Phase 1 implementation)
- **Planned**: Authentication will be implemented in Phase 2
- **Future**: Rate limiting and Redis caching planned for Phase 3
