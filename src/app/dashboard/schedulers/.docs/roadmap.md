# Roadmap: Schedulers Route Modernization

This roadmap outlines the steps to upgrade the Schedulers route to the new application standards.

## Phase 1: Layout & Scaffolding (Structural Cleanup) [COMPLETE]
*Goal: Establish a clean, modern layout hierarchy.*
- [x] **Step 1.1:** Modify `src/app/dashboard/schedulers/page.tsx` to remove the outer `SectionContainer`.
- [x] **Step 1.2:** Adjust the `PageContainer` spacing to accommodate headline metrics.
- [x] **Step 1.3:** Ensure `CreatePageTitle` includes clear by-lines for the context of the page.

## Phase 2: Core Metric Components (At-a-glance Monitoring) [COMPLETE]
*Goal: Improve the visibility and aesthetics of key data points.*
- [x] **Step 2.1:** Update `src/app/dashboard/schedulers/components/SchedulerRollupData.tsx`.
- [x] **Step 2.2:** Assign `StatCard` variants and icons.
- [ ] **Step 2.3:** (Optional) Add a "Recently Completed" count (Deferred to API Integration Phase).

## Phase 3: Interactive Components (Table & Tab Updates) [COMPLETE]
*Goal: Modernize the data lists and status indicators.*
- [x] **Step 3.1:** Update `SchedulerRenderingTable.tsx`.
    - Modernized individual tables within `SectionContainers` with icons.
    - Applied `StatusBadge` to differentiate Rendering vs Queued.
- [x] **Step 3.2:** Update `getTodaysSchedulers.tsx` and `getTomorrowsSchedulers.tsx`.
    - Replaced `ElementContainer` with `SectionContainer`.
    - Updated Boolean icons (Check/X) to `StatusBadge` (Success/Error).
    - Standardized Table layouts and Actions.

## Phase 4: Data Visualization & Polish [COMPLETE]
*Goal: Enhance the charts and final UX.*
- [x] **Step 4.1:** Verify `SchedulerBarChartByDays.tsx` alignment within the new layout.
- [x] **Step 4.2:** Ensure all "View in Strapi" and "View Details" buttons use the latest icon and variant patterns.
- [x] **Step 4.3:** Refactored Scheduler Detail route `[schedulersID]` to use `SectionContainer`, `MetricGrid`, and `StatCard`.
- [ ] **Step 4.4:** Perform final responsive checks for tablet and mobile views.

## Phase 5: Data Expansion & API Integration (Development) [COMPLETE]
*Goal: Integrate new CMS capabilities (Ref: [ticket-api-integration.md](.docs/ticket-api-integration.md)).*
- [x] **Step 5.1:** Audit current `useSchedulerRollup` and identify gaps in performance monitoring.
- [x] **Step 5.2:** Design requirements for new API endpoints (See `.docs/api-requirements.md`).
- [x] **Step 5.3:** Update TypeScript interfaces and create new fetching services.
- [x] **Step 5.4:** Implement new React Query hooks and update existing ones.

## Phase 6: Advanced Monitoring [COMPLETE]
*Goal: Implement specific monitoring views requested for operational oversight.*
- [x] **Step 6.1:** Implement "Yesterday" tab in the lower schedule section to review previous day success/failure.
- [x] **Step 6.2:** Add "Duration" tracking to active renders in `GetTodaysSchedulers`.
- [x] **Step 6.3:** Implement "Stuck" render detection with visual warnings based on time thresholds.

## Phase 7: Navigation & UX [COMPLETE]
*Goal: Streamline access to individual scheduler reviews.*
- [x] **Step 7.1:** Add "Quick Search" at page top to jump to specific schedulers by Name/ID.
- [x] **Step 7.2:** Implement "Quick Intervention Sidebar" for immediate attention to failures.
- [x] **Step 7.3:** Conduct final responsive/mobile checks and accessibility audit.

## Future Considerations
- Implement a real-time "Refresh" mechanism.
- Add "Time in Queue" metrics if available from the API.
- Create a dedicated "Scheduler Performance" view within the child `[schedulersID]` route.
