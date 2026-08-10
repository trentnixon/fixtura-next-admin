"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ChartCard, {
  ChartSummaryStat,
} from "@/components/modules/charts/ChartCard";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { SubsectionTitle } from "@/components/type/titles";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import { TrendingUp, Activity } from "lucide-react";
import ComponentRef from "./ComponentRef";
import { CHART_TOKENS } from "./chartTokens";
import type { ChartConfig } from "@/components/ui/chart";
import { formatNumber, formatDateShort } from "@/utils/chart-formatters";

const sampleData = [
  { date: "2024-01-01", sales: 400, orders: 350, returns: 50 },
  { date: "2024-01-08", sales: 300, orders: 280, returns: 40 },
  { date: "2024-01-15", sales: 500, orders: 450, returns: 60 },
  { date: "2024-01-22", sales: 278, orders: 240, returns: 35 },
  { date: "2024-01-29", sales: 350, orders: 320, returns: 45 },
  { date: "2024-02-05", sales: 420, orders: 390, returns: 55 },
];

const chartConfig = {
  sales: { label: "Sales", color: "hsl(var(--chart-1))" },
  orders: { label: "Orders", color: "hsl(var(--chart-2))" },
  returns: { label: "Returns", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig;

const summaryStats: ChartSummaryStat[] = [
  {
    icon: TrendingUp,
    label: "Total Sales",
    value: formatNumber(sampleData.reduce((s, i) => s + i.sales, 0)),
  },
  {
    icon: Activity,
    label: "Total Orders",
    value: formatNumber(sampleData.reduce((s, i) => s + i.orders, 0)),
  },
  {
    icon: Activity,
    label: "Avg Returns",
    value: formatNumber(
      Math.round(sampleData.reduce((s, i) => s + i.returns, 0) / sampleData.length)
    ),
  },
];

/**
 * Multiple line chart showcase — multi-series line charts
 */
export default function MultipleLineChartShowcase() {
  return (
    <SectionContainer
      title="Multiple Line Charts"
      description="Multiple line chart examples with multiple series"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Multi-Series</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              sales · orders · returns
            </span>
          </div>
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
                formatter={(value: string) =>
                  chartConfig[value as keyof typeof chartConfig]?.label || value
                }
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
          <ComponentRef token={CHART_TOKENS.multiLine.series} />
        </div>
      </div>
    </SectionContainer>
  );
}
