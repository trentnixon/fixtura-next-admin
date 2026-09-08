"use client";

import { DollarSign, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import ChartCard, {
  type ChartSummaryStat,
} from "@/components/modules/charts/ChartCard";
import {
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatCurrency } from "@/utils/chart-formatters";
import {
  formatMonthKeyLabel,
  type FinancialPeriodMonths,
} from "./financialDateRanges";

interface FinancialRevenueChartProps {
  data: Array<{ month: string; revenueCents: number }>;
  periodMonths: FinancialPeriodMonths;
  periodLabel: string;
  currency?: string;
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function FinancialRevenueChart({
  data,
  periodMonths,
  periodLabel,
  currency = "AUD",
}: FinancialRevenueChartProps) {
  const chartData = data.map((entry) => ({
    month: formatMonthKeyLabel(entry.month),
    revenue: entry.revenueCents / 100,
  }));

  const totalRevenue = chartData.reduce((sum, row) => sum + row.revenue, 0);
  const average =
    chartData.length > 0 ? totalRevenue / chartData.length : 0;

  const summaryStats: ChartSummaryStat[] = [
    {
      icon: DollarSign,
      label: "Period total",
      value: formatCurrency(totalRevenue, currency),
    },
    {
      icon: TrendingUp,
      label: "Monthly avg",
      value: formatCurrency(average, currency),
    },
    {
      icon: DollarSign,
      label: "Months",
      value: String(chartData.length || periodMonths),
    },
  ];

  return (
    <ChartCard
      title="Revenue trend"
      description={`Monthly revenue — ${periodLabel.toLowerCase()}`}
      icon={DollarSign}
      chartConfig={chartConfig}
      summaryStats={summaryStats}
      variant="elevated"
    >
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              tickFormatter={(value) =>
                formatCurrency(Number(value), currency, {
                  maximumFractionDigits: 0,
                })
              }
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value) => formatCurrency(Number(value), currency)}
            />
            <Bar
              dataKey="revenue"
              fill="var(--color-revenue)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : null}
    </ChartCard>
  );
}
