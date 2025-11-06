"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import ChartCard, {
  ChartSummaryStat,
} from "@/components/modules/charts/ChartCard";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import { Clock, TrendingUp, Activity, BarChart3 } from "lucide-react";
import CodeExample from "./CodeExample";
import type { ChartConfig } from "@/components/ui/chart";

/**
 * ChartCard Showcase
 *
 * Displays examples of ChartCard component usage
 */
export default function ChartCardShowcase() {
  const sampleData = [
    { name: "Jan", value: 400, target: 350 },
    { name: "Feb", value: 300, target: 380 },
    { name: "Mar", value: 200, target: 320 },
    { name: "Apr", value: 278, target: 290 },
    { name: "May", value: 189, target: 250 },
  ];

  const chartConfig = {
    value: {
      label: "Value",
      color: "hsl(var(--chart-1))",
    },
    target: {
      label: "Target",
      color: "hsl(var(--chart-2))",
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
    {
      icon: BarChart3,
      label: "Max",
      value: "400",
    },
    {
      icon: Clock,
      label: "Growth",
      value: "+12%",
    },
  ];

  return (
    <SectionContainer
      title="Chart Card"
      description="Reusable wrapper component combining Card, ChartContainer, header, and supporting data pattern matching the data insights design"
    >
      <div className="space-y-6">
        <ElementContainer
          title="Basic ChartCard"
          subtitle="Simple chart card with title and description"
        >
          <ChartCard
            title="Sample Chart"
            description="A simple chart example"
            chartConfig={chartConfig}
          >
            <BarChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="var(--color-value)" />
            </BarChart>
          </ChartCard>
          <div className="mt-6">
            <CodeExample
              code={`import ChartCard from "@/components/modules/charts/ChartCard";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

<ChartCard
  title="Sample Chart"
  description="A simple chart example"
  chartConfig={chartConfig}
>
  <BarChart data={sampleData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Bar dataKey="value" fill="var(--color-value)" />
  </BarChart>
</ChartCard>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer
          title="ChartCard with Icon and Summary Stats"
          subtitle="Complete example with icon, summary statistics, and chart"
        >
          <ChartCard
            title="Performance Metrics"
            description="Key performance indicators over time"
            icon={Activity}
            chartConfig={chartConfig}
            summaryStats={summaryStats}
          >
            <BarChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="var(--color-value)" />
            </BarChart>
          </ChartCard>
          <div className="mt-6">
            <CodeExample
              code={`import ChartCard, { ChartSummaryStat } from "@/components/modules/charts/ChartCard";
import { Activity, TrendingUp } from "lucide-react";

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
  {/* Chart content */}
</ChartCard>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer
          title="ChartCard with Empty State"
          subtitle="Example showing empty state handling"
        >
          <ChartCard
            title="Data Collection"
            description="Collection frequency over time"
            icon={Clock}
            chartConfig={chartConfig}
            emptyStateMessage="No collection data available"
          >
            {null}
          </ChartCard>
          <div className="mt-6">
            <CodeExample
              code={`<ChartCard
  title="Data Collection"
  description="Collection frequency over time"
  icon={Clock}
  chartConfig={chartConfig}
  emptyStateMessage="No collection data available"
>
  {/* Empty children = empty state shown */}
</ChartCard>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer
          title="ChartCard Variants"
          subtitle="ChartContainer variant can be customized"
        >
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Default Variant</h4>
              <ChartCard
                title="Chart with Default Variant"
                description="ChartContainer uses default variant"
                chartConfig={chartConfig}
                variant="default"
              >
                <BarChart data={sampleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-value)" />
                </BarChart>
              </ChartCard>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Elevated Variant</h4>
              <ChartCard
                title="Chart with Elevated Variant"
                description="ChartContainer uses elevated variant (additional background)"
                chartConfig={chartConfig}
                variant="elevated"
              >
                <BarChart data={sampleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-value)" />
                </BarChart>
              </ChartCard>
            </div>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`// Default variant (no additional background on ChartContainer)
<ChartCard
  title="Chart"
  chartConfig={chartConfig}
  variant="default"
>
  {/* Chart content */}
</ChartCard>

// Elevated variant (additional background on ChartContainer)
<ChartCard
  title="Chart"
  chartConfig={chartConfig}
  variant="elevated"
>
  {/* Chart content */}
</ChartCard>`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}
