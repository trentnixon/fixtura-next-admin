# Folder Overview

This folder contains shared dashboard components that provide live data overview and scheduler rollup functionality for the Fixtura Admin application. These components are used across multiple dashboard pages to display real-time information and aggregated data.

## Files

- `LiveOverview.tsx`: Orchestrates the dashboard live snapshot (renders, fleet, revenue, recent scrape jobs)
- `live-snapshot/`: Subcomponents for the expanded live snapshot section
  - `LiveSnapshotMetricStrip.tsx`: Dense KPI strip
  - `RecentScrapeJobsTable.tsx`: Last five scraper jobs table
  - `liveSnapshotRevenue.ts`: Revenue period helpers (MTD/QTD/YTD)
- `SchedulerRollupData.tsx`: Scheduler data aggregation component for displaying scheduler statistics and metrics

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: Main dashboard page and other dashboard components
- Key dependencies: `../../components/` for UI components, `../../../../hooks/` for data fetching

## Dependencies

- Internal:
  - `../../components/`: UI components and scaffolding
  - `../accounts/components/overview/tabs/components/metricCard.tsx`: Metric card component
  - `../data/utils/formatScrapeScope.ts`: Scraper scope labels
  - `../../../../hooks/`: Custom React hooks for data fetching
  - `../../../../types/`: TypeScript interfaces and type definitions
- External:
  - `next/link`: Next.js navigation
  - `lucide-react`: Icon library

## Patterns

- **Live Data**: Real-time data fetching and display with automatic updates
- **Metric Display**: Consistent metric card patterns for key performance indicators
- **Data Aggregation**: Rollup and summary data processing
- **Navigation Integration**: Seamless navigation to related dashboard sections
- **Type Safety**: Strong TypeScript integration with proper prop interfaces
- **Responsive Design**: Components adapt to different screen sizes
