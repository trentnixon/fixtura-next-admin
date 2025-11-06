"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import ChartSummaryStats, {
  ChartSummaryStat,
} from "@/components/modules/charts/ChartSummaryStats";
import { Clock, TrendingUp, Activity, BarChart3, MemoryStick } from "lucide-react";
import CodeExample from "./CodeExample";
import { formatNumber, formatPercentage, formatDuration } from "@/utils/chart-formatters";

/**
 * ChartSummaryStats Showcase
 *
 * Displays examples of ChartSummaryStats component usage
 */
export default function ChartSummaryStatsShowcase() {
  const sampleStats2Col: ChartSummaryStat[] = [
    {
      icon: TrendingUp,
      label: "Total Sales",
      value: formatNumber(15420),
    },
    {
      icon: Activity,
      label: "Growth Rate",
      value: formatPercentage(12.5),
    },
  ];

  const sampleStats3Col: ChartSummaryStat[] = [
    {
      icon: Clock,
      label: "Avg Time",
      value: formatDuration(2.5),
    },
    {
      icon: MemoryStick,
      label: "Avg Memory",
      value: "128MB",
    },
    {
      icon: BarChart3,
      label: "Total Requests",
      value: formatNumber(15420),
    },
  ];

  const sampleStats4Col: ChartSummaryStat[] = [
    {
      icon: TrendingUp,
      label: "Total Sales",
      value: formatNumber(15420),
    },
    {
      icon: Activity,
      label: "Active Users",
      value: formatNumber(1250),
    },
    {
      icon: BarChart3,
      label: "Conversion Rate",
      value: formatPercentage(3.2),
    },
    {
      icon: Clock,
      label: "Avg Session",
      value: formatDuration(180),
    },
  ];

  return (
    <SectionContainer
      title="Chart Summary Stats"
      description="Reusable component for displaying summary statistics above charts"
    >
      <div className="space-y-6">
        <ElementContainer
          title="Basic Usage"
          subtitle="Summary stats with 2 columns"
        >
          <ChartSummaryStats stats={sampleStats2Col} columns={2} />
          <div className="mt-6">
            <CodeExample
              code={`import ChartSummaryStats from "@/components/modules/charts/ChartSummaryStats";
import { formatNumber, formatPercentage } from "@/utils/chart-formatters";

const stats = [
  {
    icon: TrendingUp,
    label: "Total Sales",
    value: formatNumber(15420),
  },
  {
    icon: Activity,
    label: "Growth Rate",
    value: formatPercentage(12.5),
  },
];

<ChartSummaryStats stats={stats} columns={2} />`}
            />
          </div>
        </ElementContainer>

        <ElementContainer
          title="3 Columns"
          subtitle="Summary stats with 3 columns (responsive)"
        >
          <ChartSummaryStats stats={sampleStats3Col} columns={3} />
          <div className="mt-6">
            <CodeExample
              code={`<ChartSummaryStats stats={stats} columns={3} />`}
            />
          </div>
        </ElementContainer>

        <ElementContainer
          title="4 Columns (Default)"
          subtitle="Summary stats with 4 columns - default layout"
        >
          <ChartSummaryStats stats={sampleStats4Col} columns={4} />
          <div className="mt-6">
            <CodeExample
              code={`<ChartSummaryStats stats={stats} columns={4} />`}
            />
          </div>
        </ElementContainer>

        <ElementContainer
          title="Without Border"
          subtitle="Summary stats without bottom border"
        >
          <ChartSummaryStats stats={sampleStats2Col} showBorder={false} />
          <div className="mt-6">
            <CodeExample
              code={`<ChartSummaryStats stats={stats} showBorder={false} />`}
            />
          </div>
        </ElementContainer>

        <ElementContainer
          title="Without Icons"
          subtitle="Summary stats can work without icons"
        >
          <ChartSummaryStats
            stats={[
              { label: "Total", value: formatNumber(15420) },
              { label: "Average", value: formatNumber(3855) },
              { label: "Max", value: formatNumber(12500) },
              { label: "Min", value: formatNumber(500) },
            ]}
          />
          <div className="mt-6">
            <CodeExample
              code={`<ChartSummaryStats
  stats={[
    { label: "Total", value: formatNumber(15420) },
    { label: "Average", value: formatNumber(3855) },
  ]}
/>`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}

