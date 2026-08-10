"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ChartCard, {
  ChartSummaryStat,
} from "@/components/modules/charts/ChartCard";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { SubsectionTitle } from "@/components/type/titles";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import { TrendingUp, Activity } from "lucide-react";
import ComponentRef from "./ComponentRef";
import { CHART_TOKENS } from "./chartTokens";
import type { ChartConfig } from "@/components/ui/chart";
import { formatNumber, formatDateShort } from "@/utils/chart-formatters";

const sampleData = [
  { date: "2024-01-01", value: 400 },
  { date: "2024-01-08", value: 300 },
  { date: "2024-01-15", value: 500 },
  { date: "2024-01-22", value: 278 },
  { date: "2024-01-29", value: 350 },
  { date: "2024-02-05", value: 420 },
];

const chartConfig = {
  value: { label: "Value", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

const average =
  sampleData.reduce((sum, item) => sum + item.value, 0) / sampleData.length;
const max = Math.max(...sampleData.map((item) => item.value));
const min = Math.min(...sampleData.map((item) => item.value));

const summaryStats: ChartSummaryStat[] = [
  { icon: TrendingUp, label: "Average", value: formatNumber(Math.round(average)) },
  { icon: Activity, label: "Max", value: formatNumber(max) },
  { icon: Activity, label: "Min", value: formatNumber(min) },
];

/**
 * Line chart showcase — single series line charts
 */
export default function LineChartShowcase() {
  return (
    <SectionContainer
      title="Line Charts"
      description="Single line chart examples with ChartCard"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Basic</SubsectionTitle>
            <span className="text-xs text-muted-foreground">date axis · formatters</span>
          </div>
          <ChartCard
            title="Trend Analysis"
            description="Value trends over time"
            icon={TrendingUp}
            chartConfig={chartConfig}
            summaryStats={summaryStats}
          >
            <LineChart
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
                formatter={(value: number) => [formatNumber(value), "Value"]}
                labelFormatter={(label) => formatDateShort(label)}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--color-value)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartCard>
          <ComponentRef token={CHART_TOKENS.line.basic} />
        </div>
      </div>
    </SectionContainer>
  );
}
