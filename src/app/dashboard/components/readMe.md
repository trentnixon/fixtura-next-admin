# Folder Overview

Shared dashboard tab components and live overview widgets for the Fixtura Admin application.

## Files

- `DashboardTabs.tsx`: Overview, Financials, Asset Creation, and Data Collection tab shell
- `DashboardFinancials.tsx`: Financial snapshot tab
- `DashboardAssetCreation.tsx`: Render pipeline tab
- `DashboardDataCollection.tsx`: Data refresh and scraper tab
- `LiveOverview.tsx`: Overview tab — live ops metrics and conditional action queues
- `live-snapshot/`: Overview subcomponents
  - `OverviewDataWorkspace.tsx`: Metric workspace container
  - `OverviewRecordPanel.tsx`: Attention panel shell
  - `StuckRenderingAttentionList.tsx`: Stuck render queue rows
  - `RerenderRequestAttentionList.tsx`: Unhandled re-render request rows
  - `ContactFormAttentionList.tsx`: Unseen/unacknowledged contact rows
  - `NotificationHealthAttentionSummary.tsx`: 7-day notification failure summary
  - `DashboardLinkButton.tsx`: Overview navigation buttons
- `SchedulerRollupData.tsx`: Scheduler rollup metrics (legacy/shared)

## Child Modules

- `./live-snapshot/readMe.md` (if present)
- `./financials/`
- `./account-health/`
- `./data-collection/`
- `./asset-creation/`

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: `/dashboard` page
- Key dependencies: `@/hooks/*`, `@/lib/overview/overviewActionQueues`, `@/components/scaffolding/containers`
