"use client";

import { Cell, Legend, Pie, PieChart } from "recharts";
import { Cpu, PieChart as PieChartIcon } from "lucide-react";
import ChartCard from "@/components/modules/charts/ChartCard";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { useGlobalCostSummary } from "@/hooks/rollups/useGlobalCostSummary";
import {
  formatCurrency,
  formatPercentage,
} from "@/utils/chart-formatters";
import type { SummaryPeriod } from "./PeriodControls";

interface CostBreakdownChartProps {
  period?: SummaryPeriod;
  /** Shorter chart for overview layout */
  compact?: boolean;
}

const chartConfig = {
  lambda: {
    label: "Lambda",
    color: "hsl(var(--chart-1))",
  },
  ai: {
    label: "AI",
    color: "hsl(var(--chart-2))",
  },
};

export default function CostBreakdownChart({
  period = "current-month",
  compact = false,
}: CostBreakdownChartProps) {
  const { data, isLoading, isError, error } = useGlobalCostSummary(period);

  if (isLoading) {
    return (
      <LoadingState variant="minimal" message="Loading cost breakdown…" />
    );
  }
  if (isError && error) {
    return (
      <ErrorState
        variant="minimal"
        title="Unable to load cost breakdown"
        error={error as Error}
      />
    );
  }
  if (!data) return null;

  const lambdaCost = data.totalLambdaCost ?? 0;
  const aiCost = data.totalAiCost ?? 0;
  const total = lambdaCost + aiCost;

  const chartData = [
    {
      name: "Lambda",
      value: lambdaCost,
      percentage: total > 0 ? (lambdaCost / total) * 100 : 0,
      fill: "hsl(var(--chart-1))",
    },
    {
      name: "AI",
      value: aiCost,
      percentage: total > 0 ? (aiCost / total) * 100 : 0,
      fill: "hsl(var(--chart-2))",
    },
  ].filter((item) => item.value > 0);

  const summaryStats = [
    {
      icon: PieChartIcon,
      label: "Infra total",
      value: formatCurrency(total),
    },
    {
      icon: Cpu,
      label: "Lambda",
      value:
        total > 0
          ? `${formatCurrency(lambdaCost)} (${formatPercentage((lambdaCost / total) * 100)})`
          : formatCurrency(lambdaCost),
    },
    {
      icon: Cpu,
      label: "AI",
      value:
        total > 0
          ? `${formatCurrency(aiCost)} (${formatPercentage((aiCost / total) * 100)})`
          : formatCurrency(aiCost),
    },
  ];

  return (
    <ChartCard
      title="Lambda vs AI"
      description="Infrastructure spend split for the selected period"
      icon={PieChartIcon}
      chartConfig={chartConfig}
      summaryStats={summaryStats}
      summaryStatsLayout="inline"
      chartClassName={compact ? "h-[220px]" : "h-[280px]"}
      cardClassName={compact ? "bg-white" : undefined}
      emptyStateMessage="No Lambda or AI cost in this period"
    >
      {chartData.length > 0 ? (
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={compact ? 48 : 56}
            outerRadius={compact ? 72 : 84}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            label={({ name, percentage }) =>
              `${name}: ${percentage.toFixed(1)}%`
            }
          >
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Pie>
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => formatCurrency(Number(value))}
              />
            }
          />
          <Legend />
        </PieChart>
      ) : null}
    </ChartCard>
  );
}
