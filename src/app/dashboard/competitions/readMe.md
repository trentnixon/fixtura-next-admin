# Folder Overview

This folder contains competition management pages and components for the Fixtura Admin application. It provides the competitions dashboard plus detail pages for viewing and managing competitions with their associated grades and teams.

## Files

- `page.tsx`: Competitions dashboard page that renders CMS-driven admin stats with "Lookup Grade Teams" trigger button
- `components/CompetitionAdminStats.tsx`: Client component that fetches competition admin stats and renders filters, highlights, charts, and tables
- `components/LookupGradeTeamsButton.tsx`: Button to trigger grade-teams scrape via POST /api/grade-teams/trigger-grades-lookup-teams-scrape
- `components/TriggerRemoveFixturesScrapeButton.tsx`: Shared confirm dialog to enqueue remove-fixtures check via POST /api/game-meta-data/trigger-remove-fixtures-scrape (association account resolution; grade + competition scopes)
- `[competitionID]/page.tsx`: Individual competition drilldown page powered by the CMS admin detail endpoint
- `[competitionID]/components/CompetitionAdminDetail.tsx`: Drilldown component composing summary, analytics, tables, insights, and a "Scrape Grades" button to trigger single-competition grades scrape

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: Dashboard navigation and competition management workflows
- Key dependencies: `../../components/` for UI scaffolding and charts, `../../../../hooks/` for data fetching

## Dependencies

- Internal:
  - `../../components/`: UI scaffolding, metric cards, table primitives, and chart wrappers
  - `../../../../hooks/competitions/useCompetitionAdminStats.ts`: React Query hook for admin stats
  - `../../../../hooks/competitions/useCompetitionAdminDetail.ts`: React Query hook for per-competition drilldown data
  - `../../../../hooks/competitions/useTriggerGradesCompsSingleScrape.ts`: Mutation hook for triggering single-competition grades scrape
  - `../../../../hooks/competitions/useTriggerGradesLookupTeamsScrape.ts`: Mutation hook for triggering grade-teams lookup scrape
  - `../../../../hooks/data-collection/useTriggerResultBatchScrape.ts`: Mutation hook for batch result scrape (grade or competition scope)
  - `../../../../hooks/data-collection/useTriggerRemoveFixturesScrape.ts`: Mutation hook for remove-fixtures enqueue (grade or competition scope)
  - `../../../../lib/services/data-collection/triggerResultBatchScrape.ts`: Service for POST /api/game-meta-data/trigger-result-batch-scrape
  - `../../../../lib/services/data-collection/triggerRemoveFixturesScrape.ts`: Service for POST /api/game-meta-data/trigger-remove-fixtures-scrape
  - `../../../../types/triggerResultBatchScrape.ts`: Types for result-batch scrape request/response
  - `../../../../types/triggerRemoveFixturesScrape.ts`: Types for remove-fixtures scrape request/response
  - `../../../../lib/services/competitions/fetchCompetitionAdminStats.ts`: Service that talks to the CMS stats endpoint
  - `../../../../lib/services/competitions/fetchCompetitionAdminDetail.ts`: Service for the CMS detail endpoint
  - `../../../../types/competitionAdminStats.ts`: Shared TypeScript contract for the stats response
  - `../../../../types/competitionAdminDetail.ts`: Shared TypeScript contract for the detail response
- External:
  - `@tanstack/react-query`: Data fetching and caching
  - `recharts`: Visualization library for charts

## Patterns

- **Page Structure**: Dashboard composition using `CreatePageTitle` + `PageContainer` + `SectionContainer`
- **Dynamic Routing**: Uses Next.js dynamic routing with [competitionID] parameter
- **Component Organization**: Domain-specific components for competition admin insights and grade tables
- **Data Integration**: React Query hooks backed by CMS services for competitions and stats
- **Navigation**: Seamless navigation between competitions and related data
- **Type Safety**: Strong TypeScript integration with proper prop interfaces
