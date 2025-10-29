# Folder Overview

This folder contains comprehensive account management components for the Fixtura Admin application. It provides the core functionality for account overview, detailed account information, actions, and data visualization components used throughout the account management system.

## Files

### Root Components

- `AccountOverview.tsx`: Main account overview component with metrics and summary data
- `TestCharts.tsx`: Chart components for account data visualization

### actions/

Action components for account operations:

- `button_delete_Render.tsx`: Delete render action button component
- `button_goToPlayHq.tsx`: Navigate to PlayHQ action button component
- `Button_SyncAccount.tsx`: Sync account action button component

### overview/

Account detail overview components:

- `AccountBasics.tsx`: Basic account information display component
- `CheckBooleanStatus.tsx`: Boolean status checking component
- `Scheduler.tsx`: Scheduler information component
- `Sponsors.tsx`: Sponsors information component
- `SubscriptionTier.tsx`: Subscription tier information component
- `TemplateandTheme.tsx`: Template and theme information component
- `TrialInstance.tsx`: Trial instance information component

### overview/components/

Detailed overview sub-components:

- `ListRendersInTable.tsx`: Table component for displaying renders
- `SchedulerDetails.tsx`: Detailed scheduler information component

### overview/tabs/

Tab-based account information:

- `competitions.tsx`: Competitions tab component
- `overview.tsx`: Overview tab component
- `renders.tsx`: Renders tab component

### overview/tabs/components/

Tab-specific components:

- `metricCard.tsx`: Metric card component for displaying key metrics

### ui/

User interface components:

- `AccountTitle.tsx`: Account title display component
- `SyncCTABar.tsx`: Sync call-to-action bar component

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: Account pages, association pages, and club pages
- Key dependencies: `../../../../components/` for UI components, `../../../../hooks/` for data fetching

## Dependencies

- Internal:
  - `../../../../components/`: UI components, scaffolding, and providers
  - `../../../../hooks/`: Custom React hooks for data fetching
  - `../../../../types/`: TypeScript interfaces and type definitions
  - `../../../../lib/utils.ts`: Utility functions
- External:
  - `next/link`: Next.js navigation
  - `lucide-react`: Icon library
  - `@clerk/nextjs/server`: Server-side authentication

## Patterns

- **Component Composition**: Components are built using composition patterns with reusable UI elements
- **Data Integration**: Integration with custom hooks for server state management
- **Action Handling**: Consistent action button patterns with proper event handling
- **Tab Organization**: Tab-based organization for complex account information
- **Metric Display**: Consistent metric card patterns for key performance indicators
- **Type Safety**: Strong TypeScript integration with proper prop interfaces
- **Responsive Design**: Components adapt to different screen sizes
