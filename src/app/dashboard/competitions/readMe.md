# Folder Overview

This folder contains competition management pages and components for the Fixtura Admin application. It provides functionality for viewing and managing competitions with their associated grades and teams.

## Files

- `page.tsx`: Main competitions listing page (currently placeholder)
- `[competitionID]/page.tsx`: Individual competition detail page
- `[competitionID]/components/competitionGradeTable.tsx`: Component for displaying competition grades and associated data

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: Dashboard navigation and competition management workflows
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
- **Dynamic Routing**: Uses Next.js dynamic routing with [competitionID] parameter
- **Component Organization**: Domain-specific components for competition management
- **Data Integration**: Integration with custom hooks for competition data fetching
- **Navigation**: Seamless navigation between competitions and related data
- **Type Safety**: Strong TypeScript integration with proper prop interfaces
