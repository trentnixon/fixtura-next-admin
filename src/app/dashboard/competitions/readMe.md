# Folder Overview

This folder contains competition management pages and components for the Fixtura Admin application. It provides the competitions dashboard plus detail pages for viewing and managing competitions with their associated grades and teams.

## Files

- `page.tsx`: Competitions dashboard page that renders CMS-driven admin stats
- `components/CompetitionAdminStats.tsx`: Client component that fetches competition admin stats and renders filters, highlights, charts, and tables
- `[competitionID]/page.tsx`: Individual competition drilldown page powered by the CMS admin detail endpoint
- `[competitionID]/components/CompetitionAdminDetail.tsx`: Drilldown component composing summary, analytics, tables, and insights

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: Dashboard navigation and competition management workflows
- Key dependencies: `../../components/` for UI scaffolding and charts, `../../../../hooks/` for data fetching

## Dependencies

- Internal:
  - `../../components/`: UI scaffolding, metric cards, table primitives, and chart wrappers
  - `../../../../hooks/competitions/useCompetitionAdminStats.ts`: React Query hook for admin stats
  - `../../../../hooks/competitions/useCompetitionAdminDetail.ts`: React Query hook for per-competition drilldown data
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
