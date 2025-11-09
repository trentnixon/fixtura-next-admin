# Folder Overview

Competition drilldown dashboard for a single competition. Provides an admin-focused view with summary, grades, clubs, teams, and analytics once integrated with the CMS drilldown endpoint.

## Files

- `page.tsx`: Entry point for the competition drilldown page that renders the admin detail experience
- `components/CompetitionAdminDetail.tsx`: Client component that loads the CMS drilldown endpoint and composes meta header, analytics, insights, and tables

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Key dependencies: `../../../components/` scaffolding + UI primitives, `../../../../hooks/competitions/` for data hooks, `../../../../lib/services/competitions/` for CMS calls, `../../../../types/` for shared contracts
- Consumed by: Dashboard router at `/dashboard/competitions/[competitionID]`

## Dependencies

- Internal:
  - `../../../../hooks/competitions/useCompetitionAdminDetail.ts`: React Query hook for admin detail data
  - `../../../../lib/services/competitions/` for CMS service wrappers
  - `../../../../types/` for admin detail contracts
  - `../../../components/scaffolding/` for page layout containers
- External:
  - `@tanstack/react-query` for data fetching
  - `recharts` and shared chart components for analytics visualisation
