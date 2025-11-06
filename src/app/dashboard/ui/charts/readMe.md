# Folder Overview

This folder contains the Charts & Data Visualization showcase page, demonstrating chart components, containers, and layout patterns. The showcase provides interactive examples, code snippets, and usage guidelines for chart components built with Recharts and the ChartContainer wrapper.

## Purpose

This showcase serves as:
- **Component Documentation**: Visual reference for chart components and containers
- **Usage Examples**: Code snippets showing how to use charts in different contexts
- **Layout Patterns**: Demonstrates different layout patterns for organizing charts
- **Interactive Testing**: Live examples for testing chart behavior and appearance

## Structure

```
charts/
├── page.tsx                          # Main showcase page
├── _components/
│   ├── ChartsShowcase.tsx            # Main showcase component that composes all sub-showcases
│   └── _elements/
│       ├── ChartContainerShowcase.tsx    # ChartContainer component examples
│       ├── ChartCardShowcase.tsx         # ChartCard component examples
│       ├── ChartSummaryStatsShowcase.tsx # ChartSummaryStats component examples
│       ├── ChartColorPalettesShowcase.tsx # Color palette examples
│       ├── ChartFormattingShowcase.tsx   # Formatting utilities examples
│       ├── BarChartShowcase.tsx          # Single bar chart examples
│       ├── MultiBarChartShowcase.tsx     # Multi-bar chart examples
│       ├── LineChartShowcase.tsx         # Single line chart examples
│       ├── MultipleLineChartShowcase.tsx # Multiple line chart examples
│       ├── StackedLineChartShowcase.tsx  # Stacked area chart examples
│       ├── PieChartShowcase.tsx          # Pie chart examples
│       ├── ChartLayoutsShowcase.tsx      # Chart layout patterns and examples
│       └── CodeExample.tsx                # Shared code snippet component
```

## Chart Components

### ChartContainer

The ChartContainer component is located at `src/components/ui/chart.tsx` and provides:

- **Responsive Sizing**: Automatically adapts to container size using Recharts ResponsiveContainer
- **Theme Support**: Supports light/dark themes with CSS variables
- **Configuration**: ChartConfig prop for defining colors, labels, and themes
- **Context Provider**: Provides chart context to child components via React Context
- **Background Variants**: Supports `variant="default" | "elevated"` for different background styles

### ChartCard

The ChartCard component is located at `src/components/modules/charts/ChartCard.tsx` and provides:

- **Complete Chart Pattern**: Combines Card, ChartContainer, header, and supporting data
- **Card Wrapper**: Elevated background (`bg-slate-50`) matching data insights pattern
- **Header Section**: Icon, title, and description support
- **Summary Stats**: Optional grid of statistics above chart (2-4 columns, responsive)
- **Empty State**: Built-in empty state handling
- **Variant Support**: Configurable ChartContainer variant

### Component Definition

```tsx
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

<ChartContainer config={chartConfig} className="h-[300px]">
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Bar dataKey="value" fill="var(--color-value)" />
  </BarChart>
</ChartContainer>
```

### ChartContainer Variants

ChartContainer supports background variants:

- **Default Variant** (`variant="default"`): Transparent background, standard appearance
- **Elevated Variant** (`variant="elevated"`): Darker background (`bg-slate-50`) with rounded corners and padding, matches data insights pattern

```tsx
// Default variant
<ChartContainer config={chartConfig} className="h-[300px]">
  {/* Chart content */}
</ChartContainer>

// Elevated variant (matches data insights pattern)
<ChartContainer config={chartConfig} variant="elevated" className="h-[300px]">
  {/* Chart content */}
</ChartContainer>
```

### ChartCard Usage

```tsx
import ChartCard, { ChartSummaryStat } from "@/components/modules/charts/ChartCard";
import { Activity, TrendingUp } from "lucide-react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const summaryStats: ChartSummaryStat[] = [
  {
    icon: Activity,
    label: "Total Value",
    value: "1,367",
  },
  {
    icon: TrendingUp,
    label: "Average",
    value: "273.4",
  },
];

<ChartCard
  title="Performance Metrics"
  description="Key performance indicators over time"
  icon={Activity}
  chartConfig={chartConfig}
  summaryStats={summaryStats}
>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Bar dataKey="value" fill="var(--color-value)" />
  </BarChart>
</ChartCard>
```

## Chart Types

The showcase includes examples for all major chart types:

1. **Bar Charts**: Single bar chart with ChartCard and formatting utilities
2. **Multi-Bar Charts**: Grouped bar charts with multiple series
3. **Line Charts**: Single line chart with date formatting
4. **Multiple Line Charts**: Multiple lines with different colors and styles
5. **Stacked Area Charts**: Stacked area charts showing cumulative values
6. **Pie Charts**: Pie and donut charts with percentage formatting

Each chart type showcase demonstrates:
- ChartCard integration
- Formatting utilities usage
- ChartConfig configuration
- Code examples

## Formatting Utilities

Chart formatting utilities are located at `src/utils/chart-formatters.ts` and provide consistent formatting across all chart components.

### Available Formatters

- **formatDuration**: Format duration values (seconds or milliseconds) to human-readable strings
- **formatMemory**: Format memory values (MB or bytes) to human-readable strings
- **formatPercentage**: Format percentage values with configurable decimals
- **formatNumber**: Format numbers with locale-specific formatting
- **formatAbbreviatedNumber**: Format large numbers with abbreviated units (K, M, B)
- **formatCurrency**: Format currency values with locale support
- **formatDate**: Format dates with time
- **formatDateShort**: Format dates to short format (MMM DD)
- **formatDateISO**: Format dates to ISO format (YYYY-MM-DD)
- **formatRelativeTime**: Format dates as relative time (e.g., "2 hours ago")

### Usage Example

```tsx
import {
  formatDuration,
  formatMemory,
  formatPercentage,
  formatNumber,
} from "@/utils/chart-formatters";

// Duration formatting
formatDuration(2.5) // "2.5s"
formatDuration(500, "milliseconds") // "500ms"

// Memory formatting
formatMemory(128) // "128.0MB"
formatMemory(512, "bytes") // "512.0 B"

// Number formatting
formatNumber(1234) // "1,234"
formatPercentage(85.5) // "85.5%"
```

## Chart Configuration

ChartContainer requires a `config` prop that follows the ChartConfig type:

```tsx
type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<"light" | "dark", string> }
  );
}
```

### Configuration Options

- **label**: Display label for the data series
- **icon**: Optional icon component for the data series
- **color**: Single color value (string)
- **theme**: Theme object with light/dark color variants

## Chart Layouts

### Single Chart Layout

A single chart taking full width:

```tsx
<ChartContainer config={chartConfig} className="h-[300px] w-full">
  {/* Chart content */}
</ChartContainer>
```

### Grid Layouts

Charts can be arranged in grids:

- **2 Columns**: `grid grid-cols-1 md:grid-cols-2 gap-6`
- **3 Columns**: `grid grid-cols-1 md:grid-cols-3 gap-6`
- **Responsive**: `grid grid-cols-1 lg:grid-cols-2 gap-6`

### Responsive Patterns

- Use Tailwind responsive breakpoints (`md:`, `lg:`, etc.)
- Single column on mobile, multiple columns on larger screens
- Consistent gap spacing between charts

## Usage Examples

### Basic Chart

```tsx
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";

const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
];

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

<ChartContainer config={chartConfig} className="h-[300px]">
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Bar dataKey="value" fill="var(--color-value)" />
  </BarChart>
</ChartContainer>
```

### Custom Height

```tsx
<ChartContainer config={chartConfig} className="h-[200px]">
  {/* Chart content */}
</ChartContainer>
```

### Grid Layout

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <ChartContainer config={chartConfig} className="h-[250px]">
    {/* Chart content */}
  </ChartContainer>
  <ChartContainer config={chartConfig} className="h-[250px]">
    {/* Chart content */}
  </ChartContainer>
</div>
```

## Showcase Components

Each showcase component demonstrates a specific aspect of charts:

1. **ChartContainerShowcase**: Shows ChartContainer component usage and configuration
2. **ChartCardShowcase**: Demonstrates ChartCard component with various configurations
3. **ChartSummaryStatsShowcase**: Shows ChartSummaryStats component usage and configuration
4. **ChartColorPalettesShowcase**: Demonstrates color palette options (brand theme, primary shades, standard)
5. **ChartFormattingShowcase**: Shows all formatting utilities with examples
6. **BarChartShowcase**: Single bar chart examples
7. **MultiBarChartShowcase**: Multi-bar chart examples with grouped bars
8. **LineChartShowcase**: Single line chart examples with date formatting
9. **MultipleLineChartShowcase**: Multiple line chart examples
10. **StackedLineChartShowcase**: Stacked area chart examples
11. **PieChartShowcase**: Pie and donut chart examples
12. **ChartLayoutsShowcase**: Demonstrates different layout patterns for organizing charts

## Container Structure

The showcase uses a consistent container hierarchy:

- **PageContainer**: Top-level wrapper (`page.tsx`)
- **SectionContainer**: Groups related examples (`_elements` components)
- **ElementContainer**: Wraps individual examples with optional title/subtitle
- **CodeExample**: Shared component for displaying code snippets with copy functionality

## Relations

- **Parent folder**: [../readMe.md](../readMe.md)
- **Chart Components**: `../../../../components/ui/chart.tsx`
- **Chart Modules**: `../../../../components/modules/charts/ChartCard.tsx`
- **Container Components**: `../../../../components/scaffolding/containers/`

## Dependencies

- **Internal**:
  - `@/components/ui/chart`: ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent
  - `@/components/modules/charts/ChartCard`: ChartCard component wrapper
  - `@/components/modules/charts/ChartSummaryStats`: ChartSummaryStats component
  - `@/utils/chart-formatters`: Formatting utilities for chart data
  - `@/utils/chart-colors`: Color palette utilities (brand theme, primary shades, standard)
  - `@/components/scaffolding/containers`: PageContainer, SectionContainer, ElementContainer
- **External**:
  - `recharts`: Chart library for building charts
  - `react`: React framework
  - CSS variables for theming (`--chart-1`, `--color-value`, etc.)

## Best Practices

1. **Configuration**: Always provide a ChartConfig prop with proper color definitions
2. **Responsive Design**: Use Tailwind responsive classes for mobile-first layouts
3. **Height Management**: Set explicit heights using className (e.g., `h-[300px]`)
4. **Accessibility**: Ensure chart data is accessible and provide proper labels
5. **Performance**: Use React.memo for expensive chart components when needed
6. **Theme Support**: Use CSS variables for colors to support light/dark themes

## Design System Integration

Charts are integrated with the design system through:

- **CSS Variables**: Color tokens (`--chart-1`, `--chart-2`, etc.)
- **Theme Support**: Automatic light/dark theme switching
- **Consistent Spacing**: Uses Tailwind spacing scale
- **Typography**: Follows text size conventions (`text-xs` for chart text)

## Chart Types

While this showcase focuses on containers and layouts, the ChartContainer supports any Recharts chart type:

- Bar Charts
- Line Charts
- Area Charts
- Pie Charts
- Radar Charts
- And more...

See [Recharts documentation](https://recharts.org/) for chart type options.

