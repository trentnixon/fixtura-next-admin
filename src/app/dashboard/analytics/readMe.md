# Folder Overview

This folder contains the analytics dashboard pages and components for the Order Analytics API system. It provides comprehensive business intelligence insights including global metrics, revenue trends, trial conversion, subscription lifecycle, and cohort retention analysis.

## Files

- `page.tsx`: Main analytics dashboard page with comprehensive analytics widgets
- `components/GlobalAnalyticsWidget.tsx`: Widget displaying global system metrics
- `components/RevenueChart.tsx`: Component showing revenue trends and patterns
- `components/TrialConversionWidget.tsx`: Widget for trial conversion funnel analysis
- `components/SubscriptionTrendsWidget.tsx`: Component displaying subscription lifecycle data
- `components/CohortRetentionWidget.tsx`: Widget for cohort retention analysis
- `readMe.md`: Documentation for this folder

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: Dashboard routing and navigation
- Key dependencies: `../../hooks/analytics/` for data fetching, `../../types/analytics.ts` for type definitions, `../../components/ui/` for UI components

## Dependencies

- Internal:
  - `../../hooks/analytics/`: React Query hooks for analytics data fetching
  - `../../types/analytics.ts`: TypeScript interfaces and type definitions
  - `../../components/ui/`: UI components (Card, Skeleton, etc.)
  - `../../components/scaffolding/containers/`: Page layout components
  - `../../components/type/titles.tsx`: Typography components
- External:
  - `@tanstack/react-query`: React Query library for data fetching and caching

## Patterns

- **Client Components**: All analytics components use `"use client"` for React Query hooks
- **Loading States**: Consistent Skeleton components for loading states
- **Error Handling**: Comprehensive error display with user-friendly messages
- **Responsive Design**: Grid layouts that adapt to different screen sizes
- **Card-Based UI**: Uses shadcn/ui Card components for consistent styling
- **Data Visualization**: Progress bars and metrics display for analytics data

## Analytics Widgets

1. **Global Analytics Widget**: Key system-wide metrics (accounts, revenue, conversion, retention)
2. **Revenue Chart**: Monthly/quarterly revenue trends with visual representation
3. **Trial Conversion Widget**: Conversion funnel showing trial progression stages
4. **Subscription Trends Widget**: Lifecycle stages and renewal vs churn patterns
5. **Cohort Retention Widget**: Customer cohort analysis with retention metrics

## Usage

Navigate to `/dashboard/analytics` to view the comprehensive analytics dashboard.

## Future Enhancements

- Individual account analytics pages (`[accountId]/page.tsx`)
- Interactive charts with data drill-down capabilities
- Export functionality for analytics data
- Real-time updates via WebSocket
- Custom date range filtering
