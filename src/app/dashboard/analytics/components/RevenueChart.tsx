"use client";

import { useRevenueAnalytics } from "@/hooks/analytics/useRevenueAnalytics";
import { Skeleton } from "@/components/ui/skeleton";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import ChartCard, {
  ChartSummaryStat,
} from "@/components/modules/charts/ChartCard";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/utils/chart-formatters";
import { DollarSign, TrendingUp, Calendar } from "lucide-react";
import type { ChartConfig } from "@/components/ui/chart";

/**
 * RevenueChart Component
 *
 * Displays monthly/quarterly revenue trends with visual representation of revenue patterns.
 */
export function RevenueChart() {
  const { data, isLoading, error, refetch } = useRevenueAnalytics();

  if (isLoading) {
    return (
      <LoadingState variant="skeleton">
        <div className="bg-slate-50 border rounded-md p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </LoadingState>
    );
  }

  if (error) {
    return (
      <ErrorState
        variant="card"
        title="Error Loading Revenue Data"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        variant="card"
        title="No Revenue Data"
        description="Revenue data will appear here once available"
        icon={<DollarSign className="h-12 w-12 text-muted-foreground" />}
      />
    );
  }

  const analytics = data;
  const monthlyRevenue = analytics.monthlyQuarterlyRevenueTrends.monthlyRevenue;
  const revenueEntries = Object.entries(monthlyRevenue).sort();

  // Transform data for BarChart
  const chartData = revenueEntries.map(([month, revenue]) => ({
    month,
    revenue: revenue / 100, // Convert cents to dollars
  }));

  const totalRevenue =
    analytics.monthlyQuarterlyRevenueTrends.totalRevenue / 100;
  const avgRevenue =
    analytics.monthlyQuarterlyRevenueTrends.averageMonthlyRevenue / 100;
  const periods = revenueEntries.length;

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const summaryStats: ChartSummaryStat[] = [
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
    },
    {
      icon: TrendingUp,
      label: "Average Monthly",
      value: formatCurrency(avgRevenue),
    },
    {
      icon: Calendar,
      label: "Periods",
      value: `${periods} months`,
    },
  ];

  return (
    <ChartCard
      title="Monthly Revenue Trends"
      description="Revenue breakdown by month"
      icon={DollarSign}
      chartConfig={chartConfig}
      summaryStats={summaryStats}
      variant="elevated"
    >
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          angle={-45}
          textAnchor="end"
          height={80}
          fontSize={12}
        />
        <YAxis tickFormatter={(value) => formatCurrency(value)} fontSize={12} />
        <ChartTooltip
          content={<ChartTooltipContent />}
          formatter={(value) => formatCurrency(Number(value))}
        />
        <Bar dataKey="revenue" fill="var(--color-revenue)" />
      </BarChart>
    </ChartCard>
  );
}
