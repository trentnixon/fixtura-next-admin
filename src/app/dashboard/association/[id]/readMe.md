# Folder Overview

This folder contains the association detail page for viewing comprehensive information about a single association by ID. Provides detailed association data, statistics, competitions, clubs, accounts, and insights in an admin-focused view.

## Files

- `page.tsx`: Entry point for the association detail page (test implementation with JSON output)
- `HandoverFromCMS.md`: API documentation and handover notes from CMS team
- `DevelopmentRoadMap.md`: Planning checklist for the association detail feature
- `Tickets.md`: Detailed tickets and phased tasks for association detail implementation
- `components/`: Association detail UI components (placeholders created, implementation pending)

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Key dependencies: `../../../components/` scaffolding + UI primitives, `../../../../hooks/association/` for data hooks, `../../../../lib/services/association/` for CMS calls, `../../../../types/` for shared contracts
- Consumed by: Dashboard router at `/dashboard/association/[id]`

## Dependencies

- Internal:
  - `../../../../hooks/association/useAssociationDetail.ts`: React Query hook for association detail data
  - `../../../../lib/services/association/fetchAssociationDetail.ts`: CMS service wrapper for association detail endpoint
  - `../../../../types/associationDetail.ts`: TypeScript interfaces for association detail response
  - `../../../components/scaffolding/`: Page layout containers (PageContainer, SectionContainer, ElementContainer)
  - `../../../components/ui/`: UI primitives (cards, tables, badges, progress bars)
- External:
  - `@tanstack/react-query`: Data fetching and caching
  - `next/navigation`: Route parameters and navigation
  - Association Admin Detail API endpoint at `/api/association/admin/:id`

## API Endpoint

- **Route**: `GET /api/association/admin/:id`
- **Response Time**: 150-300ms typical
- **Response Size**: 100-500KB depending on data volume
- **Authentication**: Currently `auth: false` (TODO: Add proper admin authentication)

## Patterns

- **Page Structure**: Consistent page structure using PageContainer and SectionContainer components
- **Dynamic Routing**: Uses Next.js dynamic routing with `[id]` parameter
- **Component Organization**: Domain-specific components for association detail sections (header, statistics, competitions, clubs, accounts)
- **Data Fetching**: TanStack Query hook pattern with 5-minute stale time, 10-minute garbage collection
- **Error Handling**: Comprehensive error handling for 400 (invalid ID), 404 (not found), and 500 (server error) responses
- **Null Handling**: Graceful handling of optional fields (contactDetails, location, website, coordinates, dates, trial)
