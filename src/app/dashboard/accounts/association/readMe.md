# Folder Overview

This folder contains association-specific account management pages and components for the Fixtura Admin application. It provides functionality for viewing, managing, and displaying association accounts with their related data and operations.

## Files

- `page.tsx`: Main associations listing page with table display and navigation
- `[accountID]/page.tsx`: Individual association account detail page
- `[accountID]/components/DisplayAssociation.tsx`: Component for displaying association account details
- `[accountID]/components/overview/tabs/competitions.tsx`: Association competitions tab powered by the CMS drilldown endpoint
- `components/AssociationsTable.tsx`: Table component for listing and managing association accounts
- `components/associationEmails.tsx`: Premium contacts management interface with subscription filtering and CSV export

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: Dashboard navigation and account management workflows
- Key dependencies: `../../components/` for UI components, `../../../../hooks/` for data fetching, `../../../../lib/services/` for CMS integrations

## Dependencies

- Internal:
  - `../../components/`: UI components and scaffolding
  - `../../../../hooks/accounts/useAccountQuery.ts`: Fetches base account data
  - `../../../../hooks/competitions/useCompetitionAssociationDrilldown.ts`: Loads per-association competition data
  - `../../../../lib/services/competitions/fetchCompetitionAssociationDrilldown.ts`: Service wrapper for the CMS association drilldown endpoint
  - `../../../../types/competitionAssociationDrilldown.ts`: Shared contract for the association drilldown payload
- External:
  - `next/link`: Next.js navigation
  - `@tanstack/react-query`: Data fetching and caching

## Patterns

- **Page Structure**: Consistent page structure using CreatePage and CreatePageTitle components
- **Dynamic Routing**: Uses Next.js dynamic routing with [accountID] parameter
- **Component Organization**: Domain-specific components for association management and competition drilldowns
- **Data Integration**: Integration with account hooks plus CMS drilldown hooks for competition visibility
- **Navigation**: Seamless navigation between association accounts and related data
- **Type Safety**: Strong TypeScript integration with proper prop interfaces

## Contacts Management

The Contacts tab (via `associationEmails.tsx`) provides a premium administrative interface for:
- **Subscription Awareness**: Automatically filters associations based on their active/inactive order status via `useAccountsQuery`.
- **Global Search**: Real-time filtering across names, emails, IDs, and physical addresses.
- **Data Portability**: Purpose-built CSV export function for SendGrid, which respects blacklisted/unsubscribed status regardless of subscription filters.
- **Interactive Actions**: Integrated shortcuts for Google Maps, association websites, and direct Strapi CMS management.
