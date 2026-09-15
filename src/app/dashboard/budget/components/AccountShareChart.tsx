"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { PieChart as PieChartIcon, DollarSign, Users } from "lucide-react";
import ChartCard, {
  ChartSummaryStat,
} from "@/components/modules/charts/ChartCard";
import {
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { useTopAccountsByCost } from "@/hooks/rollups/useTopAccountsByCost";
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
} from "@/utils/chart-formatters";
import { periodLabel } from "./_utils/budgetPeriods";
import type { SummaryPeriod } from "./PeriodControls";
import { getPrimaryShadesColorArray } from "@/utils/chart-colors";

const SLICE_COLORS = getPrimaryShadesColorArray();

interface AccountShareChartProps {
  period?: SummaryPeriod;
  limit?: number;
}

export default function AccountShareChart({
  period = "current-month",
  limit = 10,
}: AccountShareChartProps) {
  const { data, isLoading, isError, error } = useTopAccountsByCost({
    period,
    limit,
    sortBy: "totalCost",
    sortOrder: "desc",
  });

  const chartData = useMemo(() => {
    return (
      data?.data?.map((account, index) => {
        const displayName =
          account.accountName?.trim() ||
          (account.accountId != null ? `Account #${account.accountId}` : "Unknown");
        return {
          name: displayName,
          accountId: account.accountId,
          value: account.totalCost ?? 0,
          percentage: account.percentageOfTotal ?? 0,
          renders: account.totalRenders ?? 0,
          color: SLICE_COLORS[index % SLICE_COLORS.length],
        };
      }) ?? []
    );
  }, [data]);

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    chartData.forEach((item) => {
      config[item.name] = {
        label: item.name,
        color: item.color,
      };
    });
    return config;
  }, [chartData]);

  const totalCost = useMemo(
    () => chartData.reduce((sum, item) => sum + item.value, 0),
    [chartData],
  );

  const topAccount = useMemo(() => {
    if (chartData.length === 0) return null;
    return chartData.reduce((max, item) =>
      item.value > max.value ? item : max,
    );
  }, [chartData]);

  const summaryStats: ChartSummaryStat[] = useMemo(() => {
    if (chartData.length === 0) return [];
    return [
      {
        icon: DollarSign,
        label: `Top ${limit} spend`,
        value: formatCurrency(totalCost),
      },
      {
        icon: Users,
        label: "Accounts",
        value: formatNumber(chartData.length),
      },
      {
        icon: PieChartIcon,
        label: "Leader share",
        value: topAccount ? formatPercentage(topAccount.percentage) : "—",
      },
    ];
  }, [chartData, totalCost, topAccount, limit]);

  if (isLoading) {
    return (
      <LoadingState variant="minimal" message="Loading account share…" />
    );
  }
  if (isError) {
    return (
      <ErrorState
        variant="minimal"
        title="Unable to load account share"
        error={error as Error}
      />
    );
  }
  if (!data) return null;

  return (
    <ChartCard
      title="Fleet concentration"
      description={`${periodLabel(period)} · top ${limit} by cost`}
      icon={PieChartIcon}
      chartConfig={chartConfig}
      summaryStats={summaryStats}
      summaryStatsLayout="inline"
      chartClassName="h-[260px]"
      emptyStateMessage="No account spend in this period"
    >
      {chartData.length > 0 ? (
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={88}
            paddingAngle={1}
            labelLine={false}
            label={({ name, percentage }) =>
              percentage > 8 ? `${name.split(" ")[0]} ${formatPercentage(percentage)}` : ""
            }
            dataKey="value"
          >
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <ChartTooltip
            content={({ active, payload }) => {
              if (!active || !payload || !payload[0]) return null;
              const row = payload[0].payload as {
                name: string;
                value: number;
                percentage: number;
                renders: number;
              };
              return (
                <ChartTooltipContent
                  active={active}
                  payload={payload}
                  label={`${row.name} · ${formatPercentage(row.percentage)}`}
                  formatter={(value) => [
                    formatCurrency(value as number),
                    "Cost",
                  ]}
                />
              );
            }}
          />
        </PieChart>
      ) : null}
    </ChartCard>
  );
}
