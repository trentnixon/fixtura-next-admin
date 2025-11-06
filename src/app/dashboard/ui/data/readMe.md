# Folder Overview

This folder contains the Data Display showcase page, demonstrating card components including Stat Cards, Metric Grids, and Base Cards. The showcase provides interactive examples, code snippets, and usage guidelines for displaying data in card formats.

## Purpose

This showcase serves as:
- **Card Component Reference**: Visual display of all card variants and configurations
- **Usage Examples**: Code snippets showing how to use cards in different contexts
- **Design System**: Demonstrates card styling with brand colors and themes
- **Interactive Testing**: Live examples for testing card behavior and appearance

## Components

### Card Components

- **StatCard**: Metric display cards with trends, icons, and themes
  - Variants: `primary`, `secondary`, `accent`, `light`, `dark`
  - Features: Top accent stripe, trend indicators, icon containers
- **MetricGrid**: Grid layout for multiple StatCards
- **Base Cards**: Standard card components with header, content, footer

### Showcase Structure

- `DataDisplayShowcase.tsx`: Main showcase component
- `_elements/`:
  - `StatCardsShowcase.tsx`: StatCard examples with all variants
  - `MetricGridShowcase.tsx`: Grid layout examples
  - `CardsShowcase.tsx`: Base card component examples
  - `UsageGuidelinesShowcase.tsx`: Usage guidelines and best practices
  - `CodeExample.tsx`: Shared code snippet component

## Usage

### StatCard

Use StatCards for:
- Dashboard metrics and KPIs
- Displaying key performance indicators
- Showing trends and changes over time
- Highlighting important numbers

```tsx
import { StatCard } from "@/components/ui-library/metrics/StatCard";

<StatCard
  variant="primary"
  title="Total Users"
  value="12,345"
  description="Active users this month"
  trend={{ value: 12.5, direction: "up" }}
/>
```

### MetricGrid

Use MetricGrid for:
- Organizing multiple StatCards
- Dashboard layouts
- Responsive metric displays

## File Location

- Components: `src/components/ui-library/metrics/StatCard.tsx`
- Showcase: `src/app/dashboard/ui/data/_components/`
- Documentation: This file

## Dependencies

- `@/components/ui-library/metrics/StatCard` - StatCard component
- `@/components/ui/card` - Base Card component
- Tailwind brand colors for theming

## Note

Tables and Lists have been moved to separate routes (`/dashboard/ui/tables` and `/dashboard/ui/lists`).

