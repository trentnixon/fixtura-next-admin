# Scheduler Details Documentation

This directory contains documentation and planning for the Scheduler Details page (`/dashboard/schedulers/[id]`).

## Purpose

The Scheduler Details page provides a deep dive into an individual scheduler's configuration, operational performance, and historical render data. It serves as the primary interface for troubleshooting specific account schedules and auditing their output.

## Architecture

- **Page Entry**: `src/app/dashboard/schedulers/[schedulersID]/page.tsx`
- **Main View**: `src/app/dashboard/schedulers/[schedulersID]/components/SchedulerPage.tsx` (Summary metrics)
- **Data Table**: `src/app/dashboard/schedulers/[schedulersID]/components/TableofRenders.tsx` (History)

## Improvements & Recommendations

### 1. UI & Visual Design
- **Standardized CTAs**: Transition all action buttons to use the `variant="primary"` design pattern with icons (Eye, Database, ExternalLink).
- **Premium Metrics**: Upgrade the `StatCard` section to include more context and visual weighting. Use gradients and micro-animations for status indicators.
- **Account Context**: Add an "Account Summary" card that displays the parent account, sport, and organization name, providing quick navigation back to the account.

### 2. Operational Intelligence
- **Success Rate Chart**: Implement a mini line/bar chart showing the last 7-30 days of success vs. failure for this specific scheduler.
- **Performance Benchmarking**: Calculate "Average Duration" and "Average Wait Time" specific to this ID to identify bot-specific performance issues.
- **Capacity Indicators**: Show the next scheduled execution time clearly.

### 3. Functional Controls
- **Trigger Render**: Add a "Run Now" or "Force Rerender" button to the main dashboard (once supported by API).
- **Status Management**: Allow toggling the `isActive` state directly from this page.
