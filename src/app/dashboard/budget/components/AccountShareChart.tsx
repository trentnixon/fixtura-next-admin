"use client";

import { useMemo } from "react";
import { useTopAccountsByCost } from "@/hooks/rollups/useTopAccountsByCost";
import ChartCard, { ChartSummaryStat } from "@/components/modules/charts/ChartCard";
import {
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { SummaryPeriod } from "./PeriodControls";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { formatCurrency, formatPercentage } from "@/utils/chart-formatters";
import {
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { PieChart as PieChartIcon, DollarSign, Users } from "lucide-react";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
  "hsl(var(--chart-7))",
  "hsl(var(--chart-8))",
  "hsl(var(--chart-9))",
  "hsl(var(--chart-10))",
];

interface AccountShareChartProps {
  period?: SummaryPeriod;
  limit?: number;
}

export default function AccountShareChart({
  period = "current-month",
  limit = 10,
}: AccountShareChartProps) {
  const { data, isLoading, isError, error } = useTopAccountsByCost(period, {
    limit,
    sortBy: "totalCost",
    sortOrder: "desc",
  });

  // Transform data for pie chart
  const chartData = useMemo(() => {
    return (
      data?.data?.map((account, index) => ({
        name: `Account #${account.accountId}`,
        accountId: account.accountId,
        value: account.totalCost ?? 0,
        percentage: account.percentageOfTotal ?? 0,
        renders: account.totalRenders ?? 0,
        color: COLORS[index % COLORS.length],
      })) ?? []
    );
  }, [data]);

  // Create chart config from data
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
    [chartData]
  );

  const topAccount = useMemo(() => {
    if (chartData.length === 0) return null;
    return chartData.reduce((max, item) =>
      item.value > max.value ? item : max
    );
  }, [chartData]);

  // Summary stats for ChartCard
  const summaryStats: ChartSummaryStat[] = useMemo(() => {
    if (chartData.length === 0) return [];
    return [
      {
        icon: DollarSign,
        label: `Total Cost (Top ${limit})`,
        value: formatCurrency(totalCost),
      },
      {
        icon: Users,
        label: "Accounts",
        value: `${chartData.length}`,
      },
      {
        icon: PieChartIcon,
        label: "Top Account Share",
        value: topAccount
          ? formatPercentage(topAccount.percentage)
          : "N/A",
      },
    ];
  }, [chartData, totalCost, topAccount, limit]);

  if (isLoading) return <LoadingState message="Loading account share..." />;
  if (isError)
    return (
      <ErrorState
        variant="card"
        title="Unable to load account share"
        error={error as Error}
      />
    );
  if (!data) return null;

  return (
    <ChartCard
      title="Account Share of Total Cost"
      description={`Top ${limit} accounts by cost for ${period}`}
      chartConfig={chartConfig}
      summaryStats={summaryStats}
      chartClassName="h-[300px]"
      emptyStateMessage="No account data available for this period"
    >
      {chartData.length > 0 ? (
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) =>
              percentage > 5
                ? `${name}: ${formatPercentage(percentage)}`
                : ""
            }
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <ChartTooltip
            content={({ active, payload }) => {
              if (!active || !payload || !payload[0]) return null;
              const data = payload[0].payload as {
                name: string;
                value: number;
                percentage: number;
                renders: number;
              };
              return (
                <div className="relative">
                  <ChartTooltipContent
                    active={active}
                    payload={payload}
                    label={`${data.name} • ${formatPercentage(data.percentage)}`}
                    formatter={(value) => [
                      formatCurrency(value as number),
                      "Cost",
                    ]}
                  />
                  <div className="absolute -bottom-8 left-0 right-0 flex justify-center">
                    <div className="text-xs text-muted-foreground bg-background px-2 py-1 rounded border">
                      Renders: {data.renders.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            }}
          />
        </PieChart>
      ) : null}
    </ChartCard>
  );
}

