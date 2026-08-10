# Development Roadmap – Single Club Admin Detail

## ✅ Completed

- [x] Documented Club Admin Detail API in `SingleClubNotes.md`
- [x] Added TypeScript models in `src/types/clubAdminDetail.ts`
- [x] Implemented service `fetchClubAdminDetail` in `src/lib/services/club`
- [x] Implemented React Query hook `useClubAdminDetail` in `src/hooks/club`

## ⏳ To Do (easy → hard)

1. [ ] Wire `/dashboard/club/[id]` page to `useClubAdminDetail` with loading/error/invalid ID states
2. [ ] Implement initial UI sections (header, statistics, associations, teams, competitions, accounts) using existing scaffolding + UI primitives
3. [ ] Add insights visualisations (timelines, trends, activity patterns) and refine performance for large payloads

## 💡 Recommendations

- Reuse layout and component patterns from `association/[id]` and `competitions/[competitionID]` detail pages.
- Plan for cross-linking out to association and competition detail routes where IDs are available.
- Consider virtualization or pagination if clubs participate in many competitions/teams to keep UI responsive.
