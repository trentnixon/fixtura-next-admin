# Folder Overview

Single-club admin detail page for viewing a comprehensive review of one club by numeric ID.

## Files

- `page.tsx`: Entry point for the club admin detail page powered by the Club Admin Detail endpoint.
- `SingleClubNotes.md`: Handover notes and API documentation from the CMS team.
- `DevelopmentRoadMap.md`: Roadmap for implementing the single-club review experience.
- `Tickets.md`: Ticket backlog and phased tasks for integrating the club admin detail route.

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Key dependencies:
  - `@/hooks/club/useClubAdminDetail.ts` for data fetching
  - `@/lib/services/club/fetchClubAdminDetail.ts` for CMS calls
  - `@/types/clubAdminDetail.ts` for type contracts
  - `../../../components/scaffolding/` and `../../../components/ui/` for layout and UI
- Consumed by: Dashboard router at `/dashboard/club/[id]`

## Dependencies

- Internal:
  - `@/hooks/club/useClubAdminDetail`
  - `@/lib/services/club/fetchClubAdminDetail`
  - `@/types/clubAdminDetail`
- External:
  - Club Admin Detail API endpoint at `/api/club/admin/:id`
