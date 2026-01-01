# Ticket: Scheduler Monitoring API Integration

## Description
Implement the advanced monitoring capabilities enabled by the updated CMS API. This includes integrating yesterday's render history, calculating real-time render durations, and displaying enhanced health metrics on the dashboard.

## Objectives
- Integrate the new `getYesterdaysRenders` endpoint.
- Update data models to include timestamps and new telemetry fields.
- Implement "Stalled Render" detection logic (Processing > 30 mins).
- Expand the Dashboard Stats with yesterday's performance and average duration.

---

## Tasks

### Phase 1: Data Models & Services (The Foundation)
- [ ] **Update TypeScript Interfaces:**
    - Update `TodaysRenders` in `src/types/scheduler.ts` to include `startedAt`, `updatedAt`, and `emailSent`.
    - Create `YesterdaysRenders` interface (matching `TodaysRenders` structure but for history).
    - Update `SchedulerRollup` to include `yesterdaySuccessCount`, `yesterdayFailureCount`, and `avgRenderTimeMinutes`.
- [ ] **Create New Fetch Service:**
    - Implement `fetchGetYesterdaysRenders.ts` in `src/lib/services/scheduler/`.
- [ ] **Update Existing Services:**
    - Ensure `fetchSchedulerRollup.ts` and `fetchGetTodaysRenders.ts` handle the new fields appropriately.

### Phase 2: React Query Hooks
- [ ] **Create `useGetYesterdaysRenders` Hook:**
    - Implement in `src/hooks/scheduler/`.
- [ ] **Update Cache Management:**
    - Ensure `schedulerRollup` and `todaysRenders` queries are invalidated when updates occur.

### Phase 3: Enhanced Headline Metrics
- [ ] **Update `SchedulerRollupData.tsx`:**
    - Add new `StatCard` components for "Success Rate (Yesterday)" and "Avg Render Time".
    - Update existing cards with new icon patterns if necessary.

### Phase 4: Tabbed Schedule Views (History & Real-time)
- [ ] **Update `SchedulersPage` (page.tsx):**
    - Add the "Yesterday" tab to the bottom Tabs component.
- [ ] **Create `GetYesterdaysSchedulers.tsx`:**
    - Build the component to display yesterday's performance data.
- [ ] **Update `GetTodaysSchedulers.tsx`:**
    - Integrate the `emailSent` badge.
    - Add a "Duration" column to the table.

### Phase 5: Monitoring Logic & UX Polish
- [ ] **Implement Duration Logic:**
    - Create a utility or hook to calculate minutes since `startedAt`.
- [ ] **Stalled Render Visualization:**
    - Add conditional styling (Warning/Error) to `StatusBadge` or rows if a render is processing for > 30 mins.
- [ ] **Final Responsive Review:**
    - Ensure the expanded metrics and tables work on all device sizes.

## Success Criteria
- [ ] Dashboard shows yesterday's success/failure counts.
- [ ] Administrators can see exactly how long a render has been running today.
- [ ] "Yesterday" historical data is accessible via its own tab.
- [ ] All code follows the established service/hook pattern.
