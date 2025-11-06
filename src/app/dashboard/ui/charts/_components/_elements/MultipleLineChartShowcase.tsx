"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import ChartCard, {
  ChartSummaryStat,
} from "@/components/modules/charts/ChartCard";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import { TrendingUp, Activity } from "lucide-react";
import CodeExample from "./CodeExample";
import type { ChartConfig } from "@/components/ui/chart";
import { formatNumber, formatDateShort } from "@/utils/chart-formatters";

/**
 * Multiple Line Chart Showcase
 *
 * Displays examples of multiple line chart usage
 */
export default function MultipleLineChartShowcase() {
  const sampleData = [
    { date: "2024-01-01", sales: 400, orders: 350, returns: 50 },
    { date: "2024-01-08", sales: 300, orders: 280, returns: 40 },
    { date: "2024-01-15", sales: 500, orders: 450, returns: 60 },
    { date: "2024-01-22", sales: 278, orders: 240, returns: 35 },
    { date: "2024-01-29", sales: 350, orders: 320, returns: 45 },
    { date: "2024-02-05", sales: 420, orders: 390, returns: 55 },
  ];

  const chartConfig = {
    sales: {
      label: "Sales",
      color: "hsl(var(--chart-1))",
    },
    orders: {
      label: "Orders",
      color: "hsl(var(--chart-2))",
    },
    returns: {
      label: "Returns",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  const totalSales = sampleData.reduce((sum, item) => sum + item.sales, 0);
  const totalOrders = sampleData.reduce((sum, item) => sum + item.orders, 0);
  const avgReturns =
    sampleData.reduce((sum, item) => sum + item.returns, 0) / sampleData.length;

  const summaryStats: ChartSummaryStat[] = [
    {
      icon: TrendingUp,
      label: "Total Sales",
      value: formatNumber(totalSales),
    },
    {
      icon: Activity,
      label: "Total Orders",
      value: formatNumber(totalOrders),
    },
    {
      icon: Activity,
      label: "Avg Returns",
      value: formatNumber(Math.round(avgReturns)),
    },
  ];

  return (
    <SectionContainer
      title="Multiple Line Charts"
      description="Multiple line chart examples with multiple series"
    >
      <div className="space-y-6">
        <ElementContainer
          title="Multiple Line Chart"
          subtitle="Multiple lines with different colors and styles"
        >
          <ChartCard
            title="Sales Performance"
            description="Sales, orders, and returns trends"
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
                formatter={(value: number, name: string) => [
                  formatNumber(value),
                  chartConfig[name as keyof typeof chartConfig]?.label || name,
                ]}
                labelFormatter={(label) => formatDateShort(label)}
              />
              <Legend
                wrapperStyle={{ paddingTop: "20px" }}
                iconType="line"
                formatter={(value: string) => {
                  return (
                    chartConfig[value as keyof typeof chartConfig]?.label ||
                    value
                  );
                }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="var(--color-sales)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="var(--color-orders)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="returns"
                stroke="var(--color-returns)"
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
import { ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { formatNumber, formatDateShort } from "@/utils/chart-formatters";

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
  orders: {
    label: "Orders",
    color: "hsl(var(--chart-2))",
  },
  returns: {
    label: "Returns",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

<ChartCard
  title="Sales Performance"
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
    <ChartTooltip content={<ChartTooltipContent />} />
    <Legend
      wrapperStyle={{ paddingTop: "20px" }}
      iconType="line"
      formatter={(value) => {
        return chartConfig[value as keyof typeof chartConfig]?.label || value;
      }}
    />
    <Line type="monotone" dataKey="sales" stroke="var(--color-sales)" strokeWidth={2} dot={false} />
    <Line type="monotone" dataKey="orders" stroke="var(--color-orders)" strokeWidth={2} dot={false} />
    <Line type="monotone" dataKey="returns" stroke="var(--color-returns)" strokeWidth={2} dot={false} />
  </LineChart>
</ChartCard>`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}
