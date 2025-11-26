# Folder Overview

This folder contains the single fixture detail page for viewing comprehensive information about a single cricket fixture by ID. Provides detailed fixture data, team information, scores, validation status, content/prompts, and related entities in an admin-focused view.

## Files

- `page.tsx`: Entry point for the fixture detail page (currently uses dummy data via FixtureDetail component)
- `CMS_HandoverNotes.md`: API documentation and handover notes from CMS team
- `DevelopmentRoadMap.md`: Planning checklist for the single fixture detail feature
- `Tickets.md`: Detailed tickets and phased tasks for single fixture detail implementation
- `_components/`: Fixture detail UI components (to be created)

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Key dependencies: `../../../components/` scaffolding + UI primitives, `../../../../hooks/fixtures/` for data hooks, `../../../../lib/services/fixtures/` for CMS calls, `../../../../types/` for shared contracts
- Consumed by: Dashboard router at `/dashboard/fixtures/[id]`

## Dependencies

- Internal:
  - `../../../../hooks/fixtures/useSingleFixtureDetail.ts`: React Query hook for single fixture detail data (to be created)
  - `../../../../lib/services/fixtures/fetchSingleFixtureDetail.ts`: CMS service wrapper for single fixture detail endpoint (to be created)
  - `../../../../types/fixtureDetail.ts`: TypeScript interfaces for single fixture detail response (to be created)
  - `../../../components/scaffolding/`: Page layout containers (PageContainer, SectionContainer, ElementContainer)
  - `../../../components/ui/`: UI primitives (cards, tables, badges, progress bars)
- External:
  - `@tanstack/react-query`: Data fetching and caching
  - `next/navigation`: Route parameters and navigation
  - Single Fixture Detail API endpoint at `/api/game-meta-data/admin/fixture/{id}`

## API Endpoint

- **Route**: `GET /api/game-meta-data/admin/fixture/{id}`
- **Response Time**: Includes validation calculations and performance metrics
- **Response Size**: 5-10KB depending on scorecards data
- **Authentication**: Currently `auth: false` (TODO: Add proper admin authentication)

## Patterns

- **Page Structure**: Consistent page structure using PageContainer and SectionContainer components
- **Dynamic Routing**: Uses Next.js dynamic routing with `[id]` parameter
- **Component Organization**: Domain-specific components for fixture detail sections (header, teams, match details, content, validation, related entities, admin context)
- **Data Fetching**: TanStack Query hook pattern with 2-minute stale time, 5-minute garbage collection
- **Error Handling**: Comprehensive error handling for 400 (invalid ID), 404 (not found), and 500 (server error) responses
- **Null Handling**: Graceful handling of optional fields (dates, venue, scores, toss, content, logos, etc.)
