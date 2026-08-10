# Folder Overview

Competition drilldown dashboard for a single competition. Provides an admin-focused view with summary, grades, clubs, teams, and analytics. Includes "Scrape Grades", "Scrape Teams", "Scrape results" (batch PlayHQ result scrape), and "Queue remove-fixtures check" (enqueue-only) buttons via the CMS.

## Files

- `page.tsx`: Entry point for the competition drilldown page that renders the admin detail experience
- `components/CompetitionAdminDetail.tsx`: Client component that loads the CMS drilldown endpoint and composes meta header, analytics, insights, and tables
- `components/CompetitionAdminDetail/sections/SnapshotSection.tsx`: Summary section with KPIs, action buttons (View Association, View on PlayHQ, Open in CMS, Scrape Grades, Scrape Teams, Scrape results, Queue remove-fixtures check)
- `../../components/TriggerResultBatchScrapeButton.tsx`: Shared batch result scrape trigger (imported into SnapshotSection)
- `../../components/TriggerRemoveFixturesScrapeButton.tsx`: Shared remove-fixtures enqueue trigger with association account picker (imported into SnapshotSection)

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Key dependencies: `../../../components/` scaffolding + UI primitives, `../../../../hooks/competitions/` for data hooks, `../../../../lib/services/competitions/` and `../../../../lib/services/data-collection/` for CMS calls, `../../../../types/` for shared contracts
- Consumed by: Dashboard router at `/dashboard/competitions/[competitionID]`

## Dependencies

- Internal:
  - `../../../../hooks/competitions/useCompetitionAdminDetail.ts`: React Query hook for admin detail data
  - `../../../../hooks/competitions/useTriggerGradesCompsSingleScrape.ts`: Mutation hook for triggering single-competition grades scrape
  - `../../../../hooks/competitions/useTriggerGradesLookupTeamsSingleScrape.ts`: Mutation hook for triggering single-competition grades-teams scrape
  - `../../../../hooks/data-collection/useTriggerResultBatchScrape.ts`: Mutation hook for batch result scrape (competition or grade scope)
  - `../../../../hooks/data-collection/useTriggerRemoveFixturesScrape.ts`: Mutation hook for remove-fixtures enqueue (competition or grade scope)
  - `../../../../lib/services/competitions/` for CMS service wrappers
  - `../../../../lib/services/data-collection/triggerGradesCompsSingleScrape.ts`: Service for POST /api/competition/trigger-grades-comps-single-scrape
  - `../../../../lib/services/data-collection/triggerGradesLookupTeamsSingleScrape.ts`: Service for POST /api/competition/trigger-grades-lookup-teams-single-scrape
  - `../../../../lib/services/data-collection/triggerResultBatchScrape.ts`: Service for POST /api/game-meta-data/trigger-result-batch-scrape
  - `../../../../types/` for admin detail contracts, triggerGradesCompsSingleScrape / triggerGradesLookupTeamsSingleScrape types, `triggerResultBatchScrape`, and `triggerRemoveFixturesScrape`
  - `../../../../lib/services/data-collection/triggerRemoveFixturesScrape.ts`: Service for POST /api/game-meta-data/trigger-remove-fixtures-scrape
  - `../../../components/scaffolding/` for page layout containers
- External:
  - `@tanstack/react-query` for data fetching
  - `recharts` and shared chart components for analytics visualisation
