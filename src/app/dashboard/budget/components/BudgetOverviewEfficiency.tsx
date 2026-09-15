"use client";

import { useMemo } from "react";
import { AlertTriangle, Cpu, Gauge, Layers, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { useGlobalCostSummary } from "@/hooks/rollups/useGlobalCostSummary";
import { useGlobalCostTrends } from "@/hooks/rollups/useGlobalCostTrends";
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
} from "@/utils/chart-formatters";
import { detectAnomalies } from "./_utils/calculateAnomalies";
import type { SummaryPeriod } from "./PeriodControls";

interface BudgetOverviewEfficiencyProps {
  period: SummaryPeriod;
}

/**
 * Overview-only efficiency metrics and recent spend anomaly signal (not duplicated in workspace).
 */
export default function BudgetOverviewEfficiency({
  period,
}: BudgetOverviewEfficiencyProps) {
  const { data, isLoading, isError, error } = useGlobalCostSummary(period);

  const trendRange = useMemo(() => {
    const end = new Date();
    const start = new Date(end);
    start.setDate(end.getDate() - 29);
    return {
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
    };
  }, []);

  const { data: trendData } = useGlobalCostTrends({
    granularity: "daily",
    startDate: trendRange.startDate,
    endDate: trendRange.endDate,
  });

  const recentAnomalies = useMemo(() => {
    if (!trendData?.dataPoints || trendData.dataPoints.length < 3) return [];
    return detectAnomalies(
      trendData.dataPoints.map((point) => ({ cost: point.totalCost ?? 0 })),
      2,
    );
  }, [trendData]);

  if (isLoading) {
    return <LoadingState variant="minimal" message="Loading efficiency metrics…" />;
  }

  if (isError) {
    return (
      <ErrorState
        variant="minimal"
        title="Efficiency metrics unavailable"
        error={error as Error}
      />
    );
  }

  if (!data) return null;

  const infraTotal =
    (data.totalLambdaCost ?? 0) + (data.totalAiCost ?? 0);
  const aiShare =
    infraTotal > 0 ? ((data.totalAiCost ?? 0) / infraTotal) * 100 : 0;
  const spikeCount = recentAnomalies.filter((a) => a.type === "spike").length;

  const items = [
    {
      icon: Gauge,
      label: "Avg / render",
      value: formatCurrency(data.averageCostPerRender ?? 0),
    },
    {
      icon: Layers,
      label: "Avg / account",
      value: formatCurrency(data.averageCostPerAccount ?? 0),
    },
    {
      icon: Zap,
      label: "Avg / day",
      value: formatCurrency(data.averageCostPerDay ?? 0),
    },
    {
      icon: Cpu,
      label: "AI share",
      value: formatPercentage(aiShare),
    },
  ];

  return (
    <div className="flex h-full flex-col gap-4">
      {recentAnomalies.length > 0 ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={spikeCount > 0 ? "destructive" : "secondary"}
              className="gap-1"
            >
              <AlertTriangle className="h-3 w-3" aria-hidden />
              {formatNumber(recentAnomalies.length)} daily anomal
              {recentAnomalies.length === 1 ? "y" : "ies"}
              {spikeCount > 0 ? ` · ${spikeCount} spike${spikeCount === 1 ? "" : "s"}` : ""}
            </Badge>
            <span className="text-muted-foreground">
              Last 30 days — open the Insights tab for detail.
            </span>
          </div>
        </div>
      ) : null}

      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-start gap-3 rounded-md border border-slate-200 bg-white px-3 py-3"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600">
              <Icon className="h-4 w-4" aria-hidden />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-muted-foreground">
                {label}
              </div>
              <div className="mt-0.5 text-lg font-semibold tabular-nums text-slate-950">
                {value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        {formatNumber(data.totalSchedulers ?? 0)} schedulers ·{" "}
        {formatNumber(data.totalAccounts ?? 0)} accounts with spend in this
        period
      </p>
    </div>
  );
}
