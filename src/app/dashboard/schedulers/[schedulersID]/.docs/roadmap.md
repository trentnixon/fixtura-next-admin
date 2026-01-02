# Scheduler Details Enhancement Roadmap

## Phase 1: Visual & Layout Refinement
- [ ] **Standardize UI Components**: Refactor `TableOfRenders` to use the premium table style and primary button variants.
- [ ] **Account Header Card**: Add a section showing the Account Name, Sport, and Type, linking back to the account dashboard.
- [ ] **Responsive Grid**: Adjust the metric grid to be more responsive and use the full width of the container.

## Phase 2: Specific Performance Metrics
- [ ] **Scheduler Health Mini-Chart**: Integrate a `recharts` line graph showing the success/fail trend for the last 14 renders.
- [ ] **Timing Analysis**: Add stats for "Average Time to Complete" and "Average Time in Queue".
- [ ] **Email Delivery Stats**: Summary of email delivery success for this specific scheduler.

## Phase 3: Operational Controls
- [ ] **Immediate Action Buttons**:
    - [ ] `Manual Run`: Trigger a render outside the scheduled window.
    - [ ] `Toggle Status`: Quickly enable/disable the scheduler.
- [ ] **Bulk Actions**: Allow selecting multiple renders in history for mass re-runs or deletion.

## Phase 4: Intelligence & Warnings
- [ ] **Stalled Render Detection**: Visual warning if the most recent render has been "Processing" for an abnormal amount of time relative to its history.
- [ ] **Failure Breakdown**: Categorize and display common failure reasons for this scheduler.
