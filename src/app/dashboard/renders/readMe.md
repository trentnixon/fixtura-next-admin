# Folder Overview

This folder contains render management pages and components for the Fixtura Admin application. It provides functionality for viewing and managing renders with comprehensive data including downloads, game results, grades, and upcoming games. All components use the new UI library patterns with standardized state management, error handling, and consistent styling.

## Files

- `page.tsx`: Main renders listing page (currently placeholder)
- `[renderID]/page.tsx`: Individual render detail page with comprehensive data display using PageContainer and SectionContainer
- `[renderID]/components/`: Detailed render components including:
  - `renderHeader.tsx`: Action buttons and status flags component
  - `renderOverview.tsx`: Render overview component with summary metrics and scheduler information
  - `renderTabs.tsx`: Tab navigation component for render sections (Downloads, Game Results, Upcoming Games, Grades)
  - `StatusFlags.tsx`: Status flags component for render state indicators
  - `TableDownloads.tsx`: Table component for displaying render downloads with category filtering
  - `TableGameResults.tsx`: Table component for displaying game results
  - `TableGradesInRender.tsx`: Table component for displaying grades in render
  - `TableUpcomingGames.tsx`: Table component for displaying upcoming games
- `components/`: Shared render components (currently empty)

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: Dashboard navigation and render management workflows
- Key dependencies: `../../components/scaffolding/` for containers, `../../../../hooks/` for data fetching, `../../../../components/ui-library/` for state components

## Dependencies

- Internal:
  - `../../components/scaffolding/containers/`: PageContainer, SectionContainer, CreatePageTitle
  - `../../../../components/ui-library/`: LoadingState, ErrorState, EmptyState
  - `../../../../components/ui/`: Card, Table, Button, Badge, Tabs, Select components
  - `../../../../hooks/renders/`: useRendersQuery, useGetAccountDetailsFromRenderId
  - `../../../../hooks/downloads/`: useDownloadsQuery
  - `../../../../hooks/games/`: useFetchGamesCricket
  - `../../../../hooks/grades/`: useGradeInRender
  - `../../../../types/`: TypeScript interfaces and type definitions
- External:
  - `next/link`: Next.js navigation
  - `next/navigation`: useParams hook
  - `lucide-react`: Icons

## Patterns

- **Page Structure**: Uses CreatePageTitle, PageContainer, and SectionContainer for consistent layout
- **State Management**: Standardized LoadingState, ErrorState, and EmptyState components with retry functionality
- **Dynamic Routing**: Uses Next.js dynamic routing with [renderID] parameter
- **Component Organization**: Domain-specific components for render management with clear separation of concerns
- **Data Integration**: Integration with custom hooks for render data fetching with proper error handling
- **Tab Navigation**: Tab-based organization for complex render information using UI library Tabs component
- **Table Components**: Specialized table components with proper loading, error, and empty states
- **Status Management**: Status flags and indicators for render state using Badge components
- **Error Recovery**: All data fetching includes retry functionality via ErrorState components
- **Type Safety**: Strong TypeScript integration with proper prop interfaces
- **Responsive Design**: Consistent spacing and layout using grid and flex utilities
