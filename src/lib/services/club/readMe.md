# Folder Overview

Service functions for club-level admin data.

## Files

- `fetchClubAdminDetail.ts`: Fetches bundled admin detail for a single club by ID from `/api/club/admin/:id`.

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: `src/hooks/club/useClubAdminDetail.ts`, `/dashboard/club/[id]` page.
- Key dependencies: `@/lib/axios`, `@/types/clubAdminDetail`.

## Dependencies

- Internal: `src/types/clubAdminDetail.ts`
- External: Strapi Club Admin Detail API (`GET /api/club/admin/:id`)
