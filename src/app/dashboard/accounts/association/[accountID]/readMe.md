# Folder Overview

Association account drilldown page. Hosts the per-association admin experience including account overview tabs and the forthcoming CMS-powered competitions drilldown.

## Files

- `page.tsx`: Entry point that wraps the drilldown in shared `CreatePage` scaffolding
- `components/DisplayAssociation.tsx`: Client container rendering tabs (account, renders, data, competitions) and fetching core account data
- `components/overview/tabs/competitions.tsx`: Association competitions tab consuming the CMS drilldown endpoint with summary, table, and actions
- `components/` (planned): Additional association drilldown widgets as the experience expands

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Key dependencies: shared account overview components under `../components`, hooks in `../../../../../hooks/accounts`, forthcoming competition association hooks/services
- Consumed by: Dashboard route `/dashboard/accounts/association/[accountID]`

## Dependencies

- Internal:
  - `../../../../../hooks/accounts/useAccountQuery.ts`: Loads baseline account data
  - `../../../../../hooks/competitions/useCompetitionAssociationDrilldown.ts`: Fetches association competitions from the CMS
  - `../../../../../lib/services/competitions/fetchCompetitionAssociationDrilldown.ts`: Service wrapper for the CMS endpoint
  - `../../../../../types/competitionAssociationDrilldown.ts`: Shared TypeScript contract for association drilldown payloads
  - `../../../../../components/app/dashboard/accounts/components/overview/*`: Tabs, analytics, and basic info widgets
- External:
  - `@tanstack/react-query`: Data fetching layer
  - `next/navigation`: Parameter extraction and routing helpers
