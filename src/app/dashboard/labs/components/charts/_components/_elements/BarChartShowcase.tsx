"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ChartCard, {
  ChartSummaryStat,
} from "@/components/modules/charts/ChartCard";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { SubsectionTitle } from "@/components/type/titles";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import { BarChart3, TrendingUp } from "lucide-react";
import ComponentRef from "./ComponentRef";
import { CHART_TOKENS } from "./chartTokens";
import { sampleBarData } from "./chartSampleData";
import type { ChartConfig } from "@/components/ui/chart";
import { formatNumber } from "@/utils/chart-formatters";

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const total = sampleBarData.reduce((sum, item) => sum + item.value, 0);
const average = total / sampleBarData.length;
const max = Math.max(...sampleBarData.map((item) => item.value));

const summaryStats: ChartSummaryStat[] = [
  { icon: BarChart3, label: "Total", value: formatNumber(total) },
  { icon: TrendingUp, label: "Average", value: formatNumber(Math.round(average)) },
  { icon: BarChart3, label: "Max", value: formatNumber(max) },
];

/**
 * Bar chart showcase — single series bar charts
 */
export default function BarChartShowcase() {
  return (
    <SectionContainer
      title="Bar Charts"
      description="Single bar chart examples with ChartCard and formatting utilities"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Basic</SubsectionTitle>
            <span className="text-xs text-muted-foreground">ChartCard · summary stats</span>
          </div>
          <ChartCard
            title="Sales Data"
            description="Monthly sales figures"
            icon={BarChart3}
            chartConfig={chartConfig}
            summaryStats={summaryStats}
          >
            <BarChart data={sampleBarData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatNumber(value)}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number) => [formatNumber(value), "Value"]}
              />
              <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartCard>
          <ComponentRef token={CHART_TOKENS.bar.basic} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Custom Styling</SubsectionTitle>
            <span className="text-xs text-muted-foreground">fill · radius</span>
          </div>
          <ChartCard
            title="Performance Metrics"
            description="Key performance indicators"
            chartConfig={chartConfig}
          >
            <BarChart data={sampleBarData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatNumber(value)}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number) => [formatNumber(value), "Value"]}
              />
              <Bar dataKey="value" fill="hsl(221, 83%, 53%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ChartCard>
          <ComponentRef token={CHART_TOKENS.bar.customStyling} />
        </div>
      </div>
    </SectionContainer>
  );
}
