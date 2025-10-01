# Folder Overview

This folder contains the main dashboard application pages and components for the Fixtura Admin application. It provides the core functionality for managing accounts, competitions, renders, teams, and other business entities with comprehensive CRUD operations and data visualization.

## Files

### accounts/

Account management pages and components:

- `page.tsx`: Main accounts overview page with charts and summary data
- `association/`: Association-specific account management
- `club/`: Club-specific account management
- `components/`: Account-related components (AccountOverview, actions, overview, ui)

### competitions/

Competition management pages:

- `page.tsx`: Main competitions listing page
- `[competitionID]/`: Individual competition detail pages

### components/

Shared dashboard components:

- `LiveOverview.tsx`: Live data overview component
- `SchedulerRollupData.tsx`: Scheduler data aggregation component

### downloads/

Download management pages:

- `page.tsx`: Main downloads listing page
- `[downloadID]/`: Individual download detail pages

### grades/

Grade/division management pages:

- `page.tsx`: Main grades listing page
- `[gradeID]/`: Individual grade detail pages

### renders/

Render management pages:

- `page.tsx`: Main renders listing page
- `[renderID]/`: Individual render detail pages with comprehensive data

### schedulers/

Scheduler management pages:

- `page.tsx`: Main schedulers listing page
- `[schedulersID]/`: Individual scheduler detail pages
- `components/`: Scheduler-related components and data visualization

### teams/

Team management pages:

- `page.tsx`: Main teams listing page
- `[teamID]/`: Individual team detail pages
- `components/`: Team-related components and data display

### Root Files

- `page.tsx`: Main dashboard overview page with live data and scheduler rollup

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: Application routing and navigation
- Key dependencies: `../../components/` for UI components, `../../hooks/` for data fetching, `../../types/` for type definitions

## Dependencies

- Internal:
  - `../../components/`: UI components, scaffolding, and providers
  - `../../hooks/`: Custom React hooks for data fetching
  - `../../types/`: TypeScript interfaces and type definitions
  - `../../lib/services/`: API service functions
- External:
  - `@clerk/nextjs/server`: Server-side authentication
  - `next/navigation`: Next.js routing and navigation

## Patterns

- **Page Structure**: Consistent page structure using CreatePage and CreatePageTitle components
- **Authentication**: Server-side authentication checks with redirect handling
- **Data Fetching**: Integration with custom hooks for server state management
- **Component Organization**: Domain-based component organization with shared components
- **Dynamic Routing**: Uses Next.js dynamic routing with [id] parameters
- **Type Safety**: Strong TypeScript integration throughout all pages
