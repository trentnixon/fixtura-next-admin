# Folder Overview

This folder contains club-specific account management pages and components for the Fixtura Admin application. It provides functionality for viewing, managing, and displaying club accounts with their related data and operations.

## Files

- `page.tsx`: Main clubs listing page with table display and navigation
- `[accountID]/page.tsx`: Individual club account detail page
- `[accountID]/components/DisplayClub.tsx`: Component for displaying club account details
- `components/ClubsTable.tsx`: Table component for listing and managing club accounts

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: Dashboard navigation and account management workflows
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
- **Dynamic Routing**: Uses Next.js dynamic routing with [accountID] parameter
- **Component Organization**: Domain-specific components for club management
- **Data Integration**: Integration with custom hooks for account data fetching
- **Navigation**: Seamless navigation between club accounts and related data
- **Type Safety**: Strong TypeScript integration with proper prop interfaces
