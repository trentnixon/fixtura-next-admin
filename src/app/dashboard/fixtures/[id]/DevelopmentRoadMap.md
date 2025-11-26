# Development Roadmap – Single Fixture Detail Route

This file tracks **progress, priorities, and recommendations** for the single fixture detail route implementation. It should remain **clean and high-level**, while detailed planning lives in `Tickets.md`.

---

## ✅ Completed

- [x] Created Tickets.md with comprehensive implementation plan
- [x] Reviewed CMS handover notes and API documentation
- [x] **Phase 1: Type Definitions** – Created TypeScript types for single fixture detail response
  - Created `src/types/fixtureDetail.ts` with all interfaces from CMS_HandoverNotes.md
  - Exported types from `src/types/index.ts`
- [x] **Phase 2: Service Layer** – Created service function to fetch single fixture detail
  - Created `src/lib/services/fixtures/fetchSingleFixtureDetail.ts`
  - Implemented error handling (400, 404, 500, timeouts, network errors)
  - Updated service documentation
- [x] **Phase 3: React Query Hook** – Created hook for fetching single fixture detail
  - Created `src/hooks/fixtures/useSingleFixtureDetail.ts`
  - Configured caching (2 min stale, 5 min GC) and retry logic
  - Updated hooks documentation
- [x] **Phase 4: UI Components** – Built components to display fixture data
  - Created component structure in `src/app/dashboard/fixtures/[id]/_components/`
  - Built: FixtureDetailHeader, FixtureTeams, FixtureMatchDetails, FixtureContent, FixtureValidation, FixtureRelatedEntities, FixtureAdminContext
  - Implemented loading states, error states, and null handling
- [x] **Phase 5: Page Integration** – Integrated components into page
  - Updated `src/app/dashboard/fixtures/[id]/page.tsx`
  - Replaced dummy data with real API data
  - Implemented loading and error state handling

---

## ⏳ To Do (easy → hard)

1. [ ] **Phase 6: Testing & Polish** – Test and refine implementation
   * (see TKT-2025-XXX for details)
   * Test with various fixture IDs (valid, invalid, non-existent)
   * Test null handling and edge cases
   * Test responsive design
   * Verify validation status display
   * Test performance with large scorecards data
   * Optional: Add navigation breadcrumbs linking back to `/dashboard/fixtures`

---

## 💡 Recommendations

* Consider lazy loading or virtualization for large scorecards JSON data
* Implement collapsible sections for performance metrics and admin context
* Add export functionality for fixture data (future enhancement)
* Consider real-time updates for live fixtures (future enhancement)
* Add ability to edit fixture data (future enhancement)
* Consider adding fixture comparison view (future enhancement)
* Reference existing association detail implementation for component patterns
* Use existing UI component library for consistency

---

### Example Usage

* Mark off items as they are completed.
* Reorder tasks so easier jobs always appear first.
* Update when scope changes or new requirements arise.
* Cross-reference each task with its ticket for detailed breakdowns and discussions.

