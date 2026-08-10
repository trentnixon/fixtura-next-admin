"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ChartCard, {
  ChartSummaryStat,
} from "@/components/modules/charts/ChartCard";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { SubsectionTitle } from "@/components/type/titles";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import { Clock, TrendingUp, Activity, BarChart3 } from "lucide-react";
import ComponentRef from "./ComponentRef";
import { CHART_TOKENS } from "./chartTokens";
import { basicChartConfig, sampleBarData } from "./chartSampleData";
import type { ChartConfig } from "@/components/ui/chart";

const multiSeriesConfig = {
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
  { icon: Activity, label: "Total Value", value: "1,367" },
  { icon: TrendingUp, label: "Average", value: "273.4" },
  { icon: BarChart3, label: "Max", value: "400" },
  { icon: Clock, label: "Growth", value: "+12%" },
];

function SampleBarChart() {
  return (
    <BarChart data={sampleBarData.slice(0, 5)}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <ChartTooltip content={<ChartTooltipContent />} />
      <Bar dataKey="value" fill="var(--color-value)" />
    </BarChart>
  );
}

/**
 * ChartCard showcase — card wrapper with header, stats, and chart content
 */
export default function ChartCardShowcase() {
  return (
    <SectionContainer
      title="Chart Card"
      description="Reusable wrapper combining Card, ChartContainer, header, and summary stats"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Basic</SubsectionTitle>
            <span className="text-xs text-muted-foreground">title · description</span>
          </div>
          <ChartCard
            title="Sample Chart"
            description="A simple chart example"
            chartConfig={basicChartConfig}
          >
            <SampleBarChart />
          </ChartCard>
          <ComponentRef token={CHART_TOKENS.card.basic} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>With Summary Stats</SubsectionTitle>
            <span className="text-xs text-muted-foreground">icon · summaryStats</span>
          </div>
          <ChartCard
            title="Performance Metrics"
            description="Key performance indicators over time"
            icon={Activity}
            chartConfig={multiSeriesConfig}
            summaryStats={summaryStats}
          >
            <SampleBarChart />
          </ChartCard>
          <ComponentRef token={CHART_TOKENS.card.withSummaryStats} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Empty State</SubsectionTitle>
            <span className="text-xs text-muted-foreground">emptyStateMessage</span>
          </div>
          <ChartCard
            title="Data Collection"
            description="Collection frequency over time"
            icon={Clock}
            chartConfig={basicChartConfig}
            emptyStateMessage="No collection data available"
          >
            {null}
          </ChartCard>
          <ComponentRef token={CHART_TOKENS.card.emptyState} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Elevated</SubsectionTitle>
            <span className="text-xs text-muted-foreground">variant elevated</span>
          </div>
          <ChartCard
            title="Chart with Elevated Variant"
            description="ChartContainer uses elevated background"
            chartConfig={basicChartConfig}
            variant="elevated"
          >
            <SampleBarChart />
          </ChartCard>
          <ComponentRef token={CHART_TOKENS.card.elevated} />
        </div>
      </div>
    </SectionContainer>
  );
}
