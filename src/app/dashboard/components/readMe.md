# Folder Overview

Shared dashboard tab components and live overview widgets for the Fixtura Admin application.

## Files

- `DashboardTabs.tsx`: Operations tab shell (`navigation.tabs.section-default`) — Overview, Financials, Asset Creation, Data Collection
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
  - `AccountFleetOverviewCards.tsx`: Fleet account mix (`card.base.comparison`)
  - `DashboardLinkButton.tsx`: Cross-page nav CTAs (`action.button.site-navigation`)
- `SchedulerRollupData.tsx`: Scheduler rollup metrics (legacy/shared)

## Tabber pattern

`/dashboard` uses the default section tabber from the navigation lab:

- Token: `navigation.tabs.section-default` (pattern: `navigation.pattern.section-tabs`)
- Styles: `@/lib/actions/siteNavigationButtonStyles` — `sectionTabListClass`, `sectionTabTriggerClass`
- Components: `TabsList variant="primary"`, `TabsTrigger variant="section"`
- Icons: `h-4 w-4 shrink-0 text-current` (inherit active/hover colour)
- Spacing: `pb-8` wrapper below the tab list before tab content

Nested account sections use `navigation.tabs.section-inverse` — see account detail workspace.

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
