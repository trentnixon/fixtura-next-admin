"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import ChartCard, {
  ChartSummaryStat,
} from "@/components/modules/charts/ChartCard";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import { TrendingUp, Activity } from "lucide-react";
import CodeExample from "./CodeExample";
import type { ChartConfig } from "@/components/ui/chart";
import { formatNumber, formatDateShort } from "@/utils/chart-formatters";

/**
 * Line Chart Showcase
 *
 * Displays examples of single line chart usage
 */
export default function LineChartShowcase() {
  const sampleData = [
    { date: "2024-01-01", value: 400 },
    { date: "2024-01-08", value: 300 },
    { date: "2024-01-15", value: 500 },
    { date: "2024-01-22", value: 278 },
    { date: "2024-01-29", value: 350 },
    { date: "2024-02-05", value: 420 },
  ];

  const chartConfig = {
    value: {
      label: "Value",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const average =
    sampleData.reduce((sum, item) => sum + item.value, 0) / sampleData.length;
  const max = Math.max(...sampleData.map((item) => item.value));
  const min = Math.min(...sampleData.map((item) => item.value));

  const summaryStats: ChartSummaryStat[] = [
    {
      icon: TrendingUp,
      label: "Average",
      value: formatNumber(Math.round(average)),
    },
    {
      icon: Activity,
      label: "Max",
      value: formatNumber(max),
    },
    {
      icon: Activity,
      label: "Min",
      value: formatNumber(min),
    },
  ];

  return (
    <SectionContainer
      title="Line Charts"
      description="Single line chart examples with ChartCard"
    >
      <div className="space-y-6">
        <ElementContainer
          title="Basic Line Chart"
          subtitle="Simple single line chart with date axis"
        >
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
          <div className="mt-6">
            <CodeExample
              code={`import ChartCard from "@/components/modules/charts/ChartCard";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatNumber, formatDateShort } from "@/utils/chart-formatters";

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

<ChartCard
  title="Trend Analysis"
  chartConfig={chartConfig}
>
  <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
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
      formatter={(value) => [formatNumber(value), "Value"]}
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
</ChartCard>`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}
