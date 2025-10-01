# Folder Overview

This folder contains grade/division management pages and components for the Fixtura Admin application. It provides functionality for viewing and managing grades with their associated teams and competition data.

## Files

- `page.tsx`: Main grades listing page (currently placeholder)
- `[gradeID]/page.tsx`: Individual grade detail page
- `[gradeID]/components/gradeTeamsTable.tsx`: Component for displaying teams associated with a specific grade

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: Dashboard navigation and grade management workflows
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
- **Dynamic Routing**: Uses Next.js dynamic routing with [gradeID] parameter
- **Component Organization**: Domain-specific components for grade management
- **Data Integration**: Integration with custom hooks for grade data fetching
- **Navigation**: Seamless navigation between grades and related data
- **Type Safety**: Strong TypeScript integration with proper prop interfaces
