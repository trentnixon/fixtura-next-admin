# Folder Overview

This folder contains association-specific account management pages and components for the Fixtura Admin application. It provides functionality for viewing, managing, and displaying association accounts with their related data and operations.

## Files

- `page.tsx`: Main associations listing page with table display and navigation
- `[accountID]/page.tsx`: Individual association account detail page
- `[accountID]/components/DisplayAssociation.tsx`: Component for displaying association account details
- `components/AssociationsTable.tsx`: Table component for listing and managing association accounts

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
- **Component Organization**: Domain-specific components for association management
- **Data Integration**: Integration with custom hooks for account data fetching
- **Navigation**: Seamless navigation between association accounts and related data
- **Type Safety**: Strong TypeScript integration with proper prop interfaces
