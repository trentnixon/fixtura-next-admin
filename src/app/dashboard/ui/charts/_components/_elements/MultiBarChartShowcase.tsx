"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import ChartCard, {
  ChartSummaryStat,
} from "@/components/modules/charts/ChartCard";
import {
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import { BarChart3, TrendingUp, Activity } from "lucide-react";
import CodeExample from "./CodeExample";
import type { ChartConfig } from "@/components/ui/chart";
import { formatNumber } from "@/utils/chart-formatters";

/**
 * Multi-Bar Chart Showcase
 *
 * Displays examples of multi-bar chart usage
 */
export default function MultiBarChartShowcase() {
  const sampleData = [
    { name: "Jan", sales: 400, returns: 50, orders: 350 },
    { name: "Feb", sales: 300, returns: 40, orders: 260 },
    { name: "Mar", sales: 200, returns: 30, orders: 170 },
    { name: "Apr", sales: 278, returns: 35, orders: 243 },
    { name: "May", sales: 189, returns: 25, orders: 164 },
    { name: "Jun", sales: 239, returns: 30, orders: 209 },
  ];

  const chartConfig = {
    sales: {
      label: "Sales",
      color: "hsl(var(--chart-1))",
    },
    returns: {
      label: "Returns",
      color: "hsl(var(--chart-2))",
    },
    orders: {
      label: "Orders",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  const totalSales = sampleData.reduce((sum, item) => sum + item.sales, 0);
  const totalReturns = sampleData.reduce((sum, item) => sum + item.returns, 0);
  const totalOrders = sampleData.reduce((sum, item) => sum + item.orders, 0);

  const summaryStats: ChartSummaryStat[] = [
    {
      icon: BarChart3,
      label: "Total Sales",
      value: formatNumber(totalSales),
    },
    {
      icon: TrendingUp,
      label: "Total Orders",
      value: formatNumber(totalOrders),
    },
    {
      icon: Activity,
      label: "Total Returns",
      value: formatNumber(totalReturns),
    },
  ];

  return (
    <SectionContainer
      title="Multi-Bar Charts"
      description="Multiple bar chart examples with grouped bars"
    >
      <div className="space-y-6">
        <ElementContainer
          title="Grouped Multi-Bar Chart"
          subtitle="Multiple bars grouped by category"
        >
          <ChartCard
            title="Sales Performance"
            description="Sales, orders, and returns comparison"
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
                formatter={(value: number, name: string) => [
                  formatNumber(value),
                  chartConfig[name as keyof typeof chartConfig]?.label || name,
                ]}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="sales"
                fill="var(--color-sales)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="returns"
                fill="var(--color-returns)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="orders"
                fill="var(--color-orders)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartCard>
          <div className="mt-6">
            <CodeExample
              code={`import ChartCard from "@/components/modules/charts/ChartCard";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { formatNumber } from "@/utils/chart-formatters";

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
  returns: {
    label: "Returns",
    color: "hsl(var(--chart-2))",
  },
  orders: {
    label: "Orders",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

<ChartCard
  title="Sales Performance"
  chartConfig={chartConfig}
>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" vertical={false} />
    <XAxis dataKey="name" />
    <YAxis tickFormatter={(value) => formatNumber(value)} />
    <ChartTooltip content={<ChartTooltipContent />} />
    <ChartLegend content={<ChartLegendContent />} />
    <Bar dataKey="sales" fill="var(--color-sales)" radius={[4, 4, 0, 0]} />
    <Bar dataKey="returns" fill="var(--color-returns)" radius={[4, 4, 0, 0]} />
    <Bar dataKey="orders" fill="var(--color-orders)" radius={[4, 4, 0, 0]} />
  </BarChart>
</ChartCard>`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}
