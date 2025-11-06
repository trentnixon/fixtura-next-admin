"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import ChartCard, {
  ChartSummaryStat,
} from "@/components/modules/charts/ChartCard";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import { BarChart3, TrendingUp } from "lucide-react";
import CodeExample from "./CodeExample";
import type { ChartConfig } from "@/components/ui/chart";
import { formatNumber } from "@/utils/chart-formatters";

/**
 * Bar Chart Showcase
 *
 * Displays examples of single bar chart usage
 */
export default function BarChartShowcase() {
  const sampleData = [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 200 },
    { name: "Apr", value: 278 },
    { name: "May", value: 189 },
    { name: "Jun", value: 239 },
  ];

  const chartConfig = {
    value: {
      label: "Value",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const total = sampleData.reduce((sum, item) => sum + item.value, 0);
  const average = total / sampleData.length;
  const max = Math.max(...sampleData.map((item) => item.value));

  const summaryStats: ChartSummaryStat[] = [
    {
      icon: BarChart3,
      label: "Total",
      value: formatNumber(total),
    },
    {
      icon: TrendingUp,
      label: "Average",
      value: formatNumber(Math.round(average)),
    },
    {
      icon: BarChart3,
      label: "Max",
      value: formatNumber(max),
    },
  ];

  return (
    <SectionContainer
      title="Bar Charts"
      description="Single bar chart examples with ChartCard and formatting utilities"
    >
      <div className="space-y-6">
        <ElementContainer
          title="Basic Bar Chart"
          subtitle="Simple single bar chart with ChartCard"
        >
          <ChartCard
            title="Sales Data"
            description="Monthly sales figures"
            icon={BarChart3}
            chartConfig={chartConfig}
            summaryStats={summaryStats}
          >
            <BarChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatNumber(value)}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number) => [formatNumber(value), "Value"]}
              />
              <Bar
                dataKey="value"
                fill="var(--color-value)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartCard>
          <div className="mt-6">
            <CodeExample
              code={`import ChartCard from "@/components/modules/charts/ChartCard";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatNumber } from "@/utils/chart-formatters";

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

<ChartCard
  title="Sales Data"
  description="Monthly sales figures"
  icon={BarChart3}
  chartConfig={chartConfig}
  summaryStats={summaryStats}
>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" vertical={false} />
    <XAxis dataKey="name" />
    <YAxis tickFormatter={(value) => formatNumber(value)} />
    <ChartTooltip
      content={<ChartTooltipContent />}
      formatter={(value) => [formatNumber(value), "Value"]}
    />
    <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
  </BarChart>
</ChartCard>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer
          title="Bar Chart with Custom Styling"
          subtitle="Bar chart with custom colors and rounded corners"
        >
          <ChartCard
            title="Performance Metrics"
            description="Key performance indicators"
            chartConfig={chartConfig}
          >
            <BarChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatNumber(value)}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number) => [formatNumber(value), "Value"]}
              />
              <Bar
                dataKey="value"
                fill="hsl(221, 83%, 53%)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ChartCard>
          <div className="mt-6">
            <CodeExample
              code={`<BarChart data={data}>
  <Bar
    dataKey="value"
    fill="hsl(221, 83%, 53%)"
    radius={[8, 8, 0, 0]} // Custom rounded corners
  />
</BarChart>`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}
