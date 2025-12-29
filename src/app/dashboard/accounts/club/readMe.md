# Folder Overview

This folder contains club-specific account management pages and components for the Fixtura Admin application. It provides functionality for viewing, managing, and displaying club accounts with their related data and operations.

## Files

- `page.tsx`: Main clubs listing page with table display and navigation
- `[accountID]/page.tsx`: Individual club account detail page
- `[accountID]/components/DisplayClub.tsx`: Component for displaying club account details
- `[accountID]/components/overview/tabs/competitions.tsx`: Shared competitions tab that now supports club drilldowns
- `components/ClubsTable.tsx`: Table component for listing and managing club accounts
- `components/clubEmails.tsx`: Premium contacts management interface with subscription filtering and CSV export

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: Dashboard navigation and account management workflows
- Key dependencies: `../../components/` for UI components, `../../../../hooks/` for data fetching, `../../../../lib/services/` for CMS integrations

## Dependencies

- Internal:
  - `../../components/`: UI components and scaffolding
  - `../../../../hooks/accounts/useAccountQuery.ts`: Fetches base account data
  - `../../../../hooks/competitions/useCompetitionClubDrilldown.ts`: Loads club competition drilldown data
  - `../../../../hooks/competitions/useCompetitionAssociationDrilldown.ts`: Shared hook leveraged when rendering association accounts via the same tab
  - `../../../../lib/services/competitions/fetchCompetitionClubDrilldown.ts`: Service wrapper for the CMS club drilldown endpoint
  - `../../../../types/competitionClubDrilldown.ts`: Shared contract for the club drilldown payload
- External:
  - `next/link`: Next.js navigation
  - `@tanstack/react-query`: Data fetching and caching

## Patterns

- **Page Structure**: Consistent page structure using CreatePage and CreatePageTitle components
- **Dynamic Routing**: Uses Next.js dynamic routing with [accountID] parameter
- **Component Organization**: Domain-specific components for club management and competition drilldowns
- **Data Integration**: Integration with account hooks plus CMS drilldown hooks for competition visibility
- **Navigation**: Seamless navigation between club accounts and related data
- **Type Safety**: Strong TypeScript integration with proper prop interfaces

## Contacts Management

The Contacts tab (via `clubEmails.tsx`) provides a premium administrative interface for:
- **Subscription Awareness**: Automatically filters clubs based on their active/inactive order status via `useAccountsQuery`.
- **Global Search**: Real-time filtering across names, emails, IDs, and physical addresses.
- **Data Portability**: Purpose-built CSV export function for SendGrid, which respects blacklisted/unsubscribed status regardless of subscription filters.
- **Interactive Actions**: Integrated shortcuts for Google Maps, club websites, and direct Strapi CMS management.
