# Ticket: Refactor Schedulers Dashboard with Modern UI Library

## Description
The `/dashboard/schedulers` route requires a visual and technical update to align with the new application design system and UI library. The current implementation uses legacy container patterns and lacks the clear status visualization provided by the new library components.

## Objectives
- Improve layout hierarchy for better "at-a-glance" monitoring.
- Standardize UI components using the `src/components/ui-library` directory.
- Enhance data visualization and status tracking for active schedulers.

## Tasks

### 1. Layout Refactoring
- [x] **Flatten Page Hierarchy:** Remove the redundant `SectionContainer` wrapper in `src/app/dashboard/schedulers/page.tsx`.
- [x] **Promote Metrics:** Move `<SchedulerRollupData />` above the main sections as headline statistics.
- [x] **Standardize Containers:** Replace all `ElementContainer` instances with `SectionContainer`.

### 2. Metric & Monitoring Enhancements
- [x] **StatCard Polishing:** Update `SchedulerRollupData` to use appropriate `variant` props (Primary/Secondary/Accent/Warning) and consistent Lucide icons.
- [x] **Status Visualization:** Implement `StatusBadge` in all tables to represent "Rendering", "Queued", and "Complete" states.

### 3. Component Updates
- [x] **Unified Tables:** Refactor `SchedulerRenderingTable` to potentially unify Rendering and Queued lists into a single "Active Items" table with a status column if it improves readability.
- [x] **Tabs Modernization:** Ensure `Tabs` in `GetTodaysSchedulers` and `GetTomorrowsSchedulers` use the latest UI library variants.

### 4. Data Expansion & API Integration [COMPLETE]
- [x] **Define New Requirements:** Identified gaps in history and telemetry.
- [x] **Request New Endpoints:** Created `.docs/api-requirements.md` and integrated new CMS responses.
- [x] **Implement Performance Metrics:** Integrated `avgRenderTime` and success rates into headline cards.

### 5. Enhanced Monitoring & History [COMPLETE]
- [x] **Yesterday's Performance:** Implemented "Yesterday" tab for auditing history.
- [x] **Still Running Detection:** Added real-time duration tracking to active renders.
- [x] **Stuck Thresholds:** Implemented visual warnings for renders processing > 30 mins.

### 6. Individual Review & Navigation [COMPLETE]
- [x] **Scheduler Search:** Added quick-search component at the top of the dashboard.
- [x] **Quick Intervention Sidebar:** Implemented sidebar for urgent render review.

### 7. Advanced Visualization (Phase 2 API Integrated) [IN PROGRESS]
- [x] **Integrate Health History API:** Created services and hooks for 14-day trends.
- [x] **Telemetry Expansion:** Integrated `failureReason` and `queueWaitTimeSeconds` into audit tables.
- [x] **System Health Trend Chart:** Implemented 14-day Daily Success vs Failure line chart.
- [ ] **Error Distribution Chart:** Implement Pie/Bar chart showing which Sports or Account Types are failing most (using `failureReason`).
- [ ] **Peak Load Heatmap:** Visualization of when most schedulers are triggered throughout the day vs throughput.



## Success Criteria
- [x] The dashboard feels less "boxy" and more integrated with the dashboard theme (Matched /dashboard/orders pattern).
- [x] Statuses are immediately identifiable via color-coded badges.
- [x] No "Unexpected any" or legacy container patterns remain in the route.
