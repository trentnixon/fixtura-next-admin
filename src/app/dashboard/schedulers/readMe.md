# Folder Overview

This folder contains scheduler management pages and components for the Fixtura Admin application. It provides comprehensive functionality for viewing, managing, and monitoring schedulers with rollup data, charts, and scheduling information.

## Files

- `page.tsx`: Main schedulers page with rollup data, charts, and tabbed scheduling information
- `[schedulersID]/page.tsx`: Individual scheduler detail page
- `[schedulersID]/components/`: Scheduler detail components:
  - `SchedulerPage.tsx`: Main scheduler page component
  - `TableofRenders.tsx`: Table component for displaying renders associated with scheduler
- `components/`: Shared scheduler components:
  - `getTodaysSchedulers.tsx`: Component for displaying today's scheduled renders
  - `getTomorrowsSchedulers.tsx`: Component for displaying tomorrow's scheduled renders
  - `schedulerBarChartByDays.tsx`: Bar chart component for scheduler data by days
  - `SchedulerRenderingTable.tsx`: Table component for scheduler rendering information
  - `SchedulerRollupData.tsx`: Rollup data component for scheduler statistics

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: Dashboard navigation and scheduler management workflows
- Key dependencies: `../../components/` for UI components, `../../../../hooks/` for data fetching

## Dependencies

- Internal:
  - `../../components/`: UI components and scaffolding
  - `../../../../hooks/`: Custom React hooks for data fetching
  - `../../../../types/`: TypeScript interfaces and type definitions
- External:
  - `next/link`: Next.js navigation
  - `@clerk/nextjs/server`: Server-side authentication

## Patterns

- **Page Structure**: Consistent page structure using CreatePage and CreatePageTitle components
- **Dynamic Routing**: Uses Next.js dynamic routing with [schedulersID] parameter
- **Component Organization**: Domain-specific components for scheduler management
- **Data Integration**: Integration with custom hooks for scheduler data fetching
- **Tab Navigation**: Tab-based organization for today/tomorrow scheduling
- **Chart Components**: Data visualization with bar charts and rollup data
- **Table Components**: Specialized table components for scheduler information
- **Real-time Data**: Live data updates for current scheduling status
- **Type Safety**: Strong TypeScript integration with proper prop interfaces
