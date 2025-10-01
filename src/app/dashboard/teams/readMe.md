# Folder Overview

This folder contains team management pages and components for the Fixtura Admin application. It provides functionality for viewing and managing teams with their fixtures, overview information, and upcoming games.

## Files

- `page.tsx`: Main teams listing page with search and display functionality
- `[teamID]/page.tsx`: Individual team detail page
- `[teamID]/components/`: Team detail components:
  - `Fixtures.tsx`: Component for displaying team fixtures
  - `Overview.tsx`: Component for displaying team overview information
  - `UpcomingGames.tsx`: Component for displaying upcoming games
- `components/`: Shared team components:
  - `displayTeams.tsx`: Component for displaying team information
  - `searchForTeam.tsx`: Component for team search functionality

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: Dashboard navigation and team management workflows
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
- **Dynamic Routing**: Uses Next.js dynamic routing with [teamID] parameter
- **Component Organization**: Domain-specific components for team management
- **Data Integration**: Integration with custom hooks for team data fetching
- **Search Functionality**: Team search and filtering capabilities
- **Navigation**: Seamless navigation between teams and related data
- **Type Safety**: Strong TypeScript integration with proper prop interfaces
