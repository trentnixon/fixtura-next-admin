"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ChartCard, {
  ChartSummaryStat,
} from "@/components/modules/charts/ChartCard";
import {
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
} from "@/components/ui/chart";
import { SubsectionTitle } from "@/components/type/titles";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis } from "recharts";
import { TrendingUp, Activity } from "lucide-react";
import ComponentRef from "./ComponentRef";
import { CHART_TOKENS } from "./chartTokens";
import type { ChartConfig } from "@/components/ui/chart";
import { formatNumber, formatDateShort } from "@/utils/chart-formatters";

const sampleData = [
  { date: "2024-01-01", productA: 400, productB: 300, productC: 200 },
  { date: "2024-01-08", productA: 300, productB: 350, productC: 250 },
  { date: "2024-01-15", productA: 500, productB: 280, productC: 300 },
  { date: "2024-01-22", productA: 278, productB: 320, productC: 180 },
  { date: "2024-01-29", productA: 350, productB: 290, productC: 220 },
  { date: "2024-02-05", productA: 420, productB: 310, productC: 280 },
];

const chartConfig = {
  productA: { label: "Product A", color: "hsl(var(--chart-1))" },
  productB: { label: "Product B", color: "hsl(var(--chart-2))" },
  productC: { label: "Product C", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig;

const summaryStats: ChartSummaryStat[] = [
  {
    icon: TrendingUp,
    label: "Total A",
    value: formatNumber(sampleData.reduce((s, i) => s + i.productA, 0)),
  },
  {
    icon: Activity,
    label: "Total B",
    value: formatNumber(sampleData.reduce((s, i) => s + i.productB, 0)),
  },
  {
    icon: Activity,
    label: "Total C",
    value: formatNumber(sampleData.reduce((s, i) => s + i.productC, 0)),
  },
];

/**
 * Stacked area chart showcase — cumulative stacked areas
 */
export default function StackedLineChartShowcase() {
  return (
    <SectionContainer
      title="Stacked Area Charts"
      description="Stacked area chart examples showing cumulative values"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Stacked</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              stackId · fillOpacity
            </span>
          </div>
          <ChartCard
            title="Product Sales"
            description="Cumulative product sales over time"
            icon={TrendingUp}
            chartConfig={chartConfig}
            summaryStats={summaryStats}
          >
            <AreaChart
              data={sampleData}
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => formatDateShort(value)}
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tickFormatter={(value) => formatNumber(value)}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number, name: string) => [
                  formatNumber(value),
                  chartConfig[name as keyof typeof chartConfig]?.label || name,
                ]}
                labelFormatter={(label) => formatDateShort(label)}
              />
              <ChartLegend
                wrapperStyle={{ paddingTop: "20px" }}
                iconType="line"
                formatter={(value: string) =>
                  chartConfig[value as keyof typeof chartConfig]?.label || value
                }
              />
              <Area
                type="monotone"
                dataKey="productA"
                stackId="1"
                stroke="var(--color-productA)"
                fill="var(--color-productA)"
                fillOpacity={0.8}
              />
              <Area
                type="monotone"
                dataKey="productB"
                stackId="1"
                stroke="var(--color-productB)"
                fill="var(--color-productB)"
                fillOpacity={0.8}
              />
              <Area
                type="monotone"
                dataKey="productC"
                stackId="1"
                stroke="var(--color-productC)"
                fill="var(--color-productC)"
                fillOpacity={0.8}
              />
            </AreaChart>
          </ChartCard>
          <ComponentRef token={CHART_TOKENS.stackedArea.basic} />
        </div>
      </div>
    </SectionContainer>
  );
}
