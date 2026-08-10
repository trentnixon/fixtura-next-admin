"use client";

import ChartCard from "@/components/modules/charts/ChartCard";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import {
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useAccountSummaryQuery } from "@/hooks/accounts/useAccountSummaryQuery";
import { BarChart3, Layers, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  value: {
    label: "Count",
    color: "hsl(var(--chart-1))",
  },
  count: {
    label: "Count",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

/**
 * Account analytics charts — chart.card.with-summary-stats + chart.layout.grid-3
 */
export default function AccountSummaryCharts() {
  const { data, isLoading, isError, error, refetch } =
    useAccountSummaryQuery();

  if (isLoading) {
    return (
      <LoadingState
        variant="minimal"
        message="Loading account charts…"
        className="py-6"
      />
    );
  }

  if (isError && error) {
    return (
      <ErrorState
        error={error instanceof Error ? error : new Error(String(error))}
        title="Could not load account charts"
        onRetry={refetch}
        variant="default"
      />
    );
  }

  const barCharts = data?.data?.BarChartData;
  const accountTypes = barCharts?.accountTypesBarChart ?? [];
  const sportsCount = barCharts?.sportsCountBarChart ?? [];
  const engagement = barCharts?.engagementMetricsBarChart ?? [];

  if (
    accountTypes.length === 0 &&
    sportsCount.length === 0 &&
    engagement.length === 0
  ) {
    return (
      <EmptyState
        title="No chart data"
        description="Account analytics charts are not available yet."
      />
    );
  }

  const accountTypeTotal = accountTypes.reduce(
    (sum, item) => sum + item.value,
    0,
  );
  const sportsTotal = sportsCount.reduce((sum, item) => sum + item.value, 0);
  const engagementTotal = engagement.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <ChartCard
        title="Account types"
        description="Association vs club account mix"
        icon={Layers}
        chartConfig={chartConfig}
        chartClassName="h-[220px]"
        summaryStats={[
          {
            icon: Layers,
            label: "Total",
            value: accountTypeTotal.toLocaleString(),
          },
        ]}
        emptyStateMessage="No account type data available."
      >
        {accountTypes.length > 0 ? (
          <BarChart data={accountTypes}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="value"
              fill="hsl(var(--chart-1))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        ) : null}
      </ChartCard>

      <ChartCard
        title="Sports coverage"
        description="Accounts grouped by sport"
        icon={BarChart3}
        chartConfig={chartConfig}
        chartClassName="h-[220px]"
        summaryStats={[
          {
            icon: BarChart3,
            label: "Total",
            value: sportsTotal.toLocaleString(),
          },
        ]}
        emptyStateMessage="No sport data available."
      >
        {sportsCount.length > 0 ? (
          <BarChart data={sportsCount}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="value"
              fill="hsl(var(--chart-2))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        ) : null}
      </ChartCard>

      <ChartCard
        title="Engagement metrics"
        description="Key engagement signals across accounts"
        icon={TrendingUp}
        chartConfig={chartConfig}
        chartClassName="h-[220px]"
        summaryStats={[
          {
            icon: TrendingUp,
            label: "Total",
            value: engagementTotal.toLocaleString(),
          },
        ]}
        emptyStateMessage="No engagement data available."
      >
        {engagement.length > 0 ? (
          <BarChart data={engagement}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="metric"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="count"
              fill="hsl(var(--chart-3))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        ) : null}
      </ChartCard>
    </div>
  );
}
