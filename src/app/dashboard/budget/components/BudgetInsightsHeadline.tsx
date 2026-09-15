"use client";

import { useMemo } from "react";
import { CircleDollarSign, TrendingDown, TrendingUp } from "lucide-react";
import ChartSummaryStats from "@/components/modules/charts/ChartSummaryStats";
import { useGlobalCostSummary } from "@/hooks/rollups/useGlobalCostSummary";
import {
  formatCurrency,
  formatPercentage,
} from "@/utils/chart-formatters";
import { periodLabel } from "./_utils/budgetPeriods";
import type { SummaryPeriod } from "./PeriodControls";

interface BudgetInsightsHeadlineProps {
  period: SummaryPeriod;
}

/** Workspace summary context for Insights (not the trend window). */
export default function BudgetInsightsHeadline({
  period,
}: BudgetInsightsHeadlineProps) {
  const { data, isLoading } = useGlobalCostSummary(period);

  const stats = useMemo(() => {
    if (isLoading || !data) {
      return [
        {
          icon: CircleDollarSign,
          label: "Summary period",
          value: periodLabel(period),
        },
        {
          icon: CircleDollarSign,
          label: "Total cost",
          value: "—",
        },
      ];
    }

    const TrendIcon =
      data.costTrend === "up"
        ? TrendingUp
        : data.costTrend === "down"
          ? TrendingDown
          : CircleDollarSign;

    const trendLabel =
      data.costTrend === "up"
        ? `Up ${formatPercentage(Math.abs(data.percentageChange ?? 0))}`
        : data.costTrend === "down"
          ? `Down ${formatPercentage(Math.abs(data.percentageChange ?? 0))}`
          : "Stable vs prior";

    return [
      {
        icon: CircleDollarSign,
        label: periodLabel(period),
        value: formatCurrency(data.totalCost ?? 0),
      },
      {
        icon: TrendIcon,
        label: "Period trend",
        value: trendLabel,
      },
      {
        icon: CircleDollarSign,
        label: "Avg / day",
        value: formatCurrency(data.averageCostPerDay ?? 0),
      },
      {
        icon: CircleDollarSign,
        label: "Avg / render",
        value: formatCurrency(data.averageCostPerRender ?? 0),
      },
    ];
  }, [data, isLoading, period]);

  return (
    <ChartSummaryStats stats={stats} layout="inline" className="rounded-md border border-slate-200 bg-white px-4 py-3" />
  );
}
