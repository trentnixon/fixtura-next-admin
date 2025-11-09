# Folder Overview

Club account drilldown page. Hosts the per-club admin experience including account overview tabs and the CMS-powered club competitions drilldown.

## Files

- `page.tsx`: Entry point wrapping the drilldown in shared `CreatePage` scaffolding
- `components/DisplayClub.tsx`: Client container rendering account tabs and fetching core club data
- `components/overview/tabs/competitions.tsx`: Shared competitions tab now consuming club/association drilldown endpoints

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Key dependencies: shared account overview components under `../components`, hooks in `../../../../../hooks/accounts`, competition drilldown hooks/services
- Consumed by: Dashboard route `/dashboard/accounts/club/[accountID]`

## Dependencies

- Internal:
  - `../../../../../hooks/accounts/useAccountQuery.ts`: Loads core account details
  - `../../../../../hooks/competitions/useCompetitionClubDrilldown.ts`: Retrieves club competition drilldown data
  - `../../../../../lib/services/competitions/fetchCompetitionClubDrilldown.ts`: Service wrapper for the CMS club drilldown endpoint
  - `../../../../../types/competitionClubDrilldown.ts`: Shared contract for the club drilldown payload
  - `../../../../../hooks/competitions/useCompetitionAssociationDrilldown.ts`: Shared hook for association accounts within the same tab
- External:
  - `@tanstack/react-query`: Data fetching layer
  - `next/navigation`: Parameter extraction and routing helpers
