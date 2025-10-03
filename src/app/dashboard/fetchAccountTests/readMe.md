# Folder Overview

This folder handles account-specific scrape test dashboard functionality for monitoring and analyzing account scraping performance.

## Files

- `page.tsx`: Main dashboard page displaying account scrape test overview with table, summary cards, and charts
- `[accountID]/page.tsx`: Individual account test details page with statistics, discrepancies analysis, and performance charts
- `components/`: Shared UI components for account test visualization
  - `FetchAccountTestsTable.tsx`: Interactive table with search and navigation
  - `FetchAccountTestsSummary.tsx`: Summary cards with key metrics
  - `FetchAccountTestsCharts.tsx`: Comprehensive charts and visualizations
- `[accountID]/components/`: Account-specific test detail components
  - `AccountTestStatsCards.tsx`: Detailed statistics cards
  - `AccountTestDiscrepanciesTable.tsx`: Test analysis and discrepancy detection
  - `AccountTestPerformanceCharts.tsx`: Performance metrics and configuration display

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Key dependencies: `fetchTests` module, `accounts` module
- Consumed by: Dashboard navigation under `/dashboard/fetchAccountTests`

## Dependencies

- Internal: `fetchTests`, `accounts`, `hooks/fetchAccountTests`, `lib/services/fetchAccountTests`
- External: Tanstack Query, shadcn/ui components
