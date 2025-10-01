# Folder Overview

This folder contains render management pages and components for the Fixtura Admin application. It provides functionality for viewing and managing renders with comprehensive data including downloads, game results, grades, and upcoming games.

## Files

- `page.tsx`: Main renders listing page (currently placeholder)
- `[renderID]/page.tsx`: Individual render detail page with comprehensive data display
- `[renderID]/components/`: Detailed render components including:
  - `renderHeader.tsx`: Render header component with basic information
  - `renderOverview.tsx`: Render overview component with summary data
  - `renderTabs.tsx`: Tab navigation component for render sections
  - `StatusFlags.tsx`: Status flags component for render state indicators
  - `TableDownloads.tsx`: Table component for displaying render downloads
  - `TableGameResults.tsx`: Table component for displaying game results
  - `TableGradesInRender.tsx`: Table component for displaying grades in render
  - `TableUpcomingGames.tsx`: Table component for displaying upcoming games
- `components/`: Shared render components (currently empty)

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: Dashboard navigation and render management workflows
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
- **Dynamic Routing**: Uses Next.js dynamic routing with [renderID] parameter
- **Component Organization**: Domain-specific components for render management
- **Data Integration**: Integration with custom hooks for render data fetching
- **Tab Navigation**: Tab-based organization for complex render information
- **Table Components**: Specialized table components for different data types
- **Status Management**: Status flags and indicators for render state
- **Type Safety**: Strong TypeScript integration with proper prop interfaces
