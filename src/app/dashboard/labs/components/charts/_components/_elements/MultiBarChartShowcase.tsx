"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ChartCard, {
  ChartSummaryStat,
} from "@/components/modules/charts/ChartCard";
import {
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { SubsectionTitle } from "@/components/type/titles";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import { BarChart3, TrendingUp, Activity } from "lucide-react";
import ComponentRef from "./ComponentRef";
import { CHART_TOKENS } from "./chartTokens";
import type { ChartConfig } from "@/components/ui/chart";
import { formatNumber } from "@/utils/chart-formatters";

const sampleData = [
  { name: "Jan", sales: 400, returns: 50, orders: 350 },
  { name: "Feb", sales: 300, returns: 40, orders: 260 },
  { name: "Mar", sales: 200, returns: 30, orders: 170 },
  { name: "Apr", sales: 278, returns: 35, orders: 243 },
  { name: "May", sales: 189, returns: 25, orders: 164 },
  { name: "Jun", sales: 239, returns: 30, orders: 209 },
];

const chartConfig = {
  sales: { label: "Sales", color: "hsl(var(--chart-1))" },
  returns: { label: "Returns", color: "hsl(var(--chart-2))" },
  orders: { label: "Orders", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig;

const summaryStats: ChartSummaryStat[] = [
  {
    icon: BarChart3,
    label: "Total Sales",
    value: formatNumber(sampleData.reduce((s, i) => s + i.sales, 0)),
  },
  {
    icon: TrendingUp,
    label: "Total Orders",
    value: formatNumber(sampleData.reduce((s, i) => s + i.orders, 0)),
  },
  {
    icon: Activity,
    label: "Total Returns",
    value: formatNumber(sampleData.reduce((s, i) => s + i.returns, 0)),
  },
];

/**
 * Multi-bar chart showcase — grouped bar series
 */
export default function MultiBarChartShowcase() {
  return (
    <SectionContainer
      title="Multi-Bar Charts"
      description="Multiple bar chart examples with grouped bars"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Grouped</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              sales · returns · orders
            </span>
          </div>
          <ChartCard
            title="Sales Performance"
            description="Sales, orders, and returns comparison"
            icon={BarChart3}
            chartConfig={chartConfig}
            summaryStats={summaryStats}
          >
            <BarChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
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
              <Bar dataKey="sales" fill="var(--color-sales)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="returns" fill="var(--color-returns)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="orders" fill="var(--color-orders)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartCard>
          <ComponentRef token={CHART_TOKENS.multiBar.grouped} />
        </div>
      </div>
    </SectionContainer>
  );
}
