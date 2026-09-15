"use client";

import { useMemo, useState } from "react";
import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { siteNavigationCtaClass } from "@/lib/actions/siteNavigationButtonStyles";
import { cn } from "@/lib/utils";
import AnomalyDetection, {
  type AnomalyDetectionMethod,
} from "./AnomalyDetection";
import CostForecast, { type ForecastMethod } from "./CostForecast";
import BudgetInsightsHeadline from "./BudgetInsightsHeadline";
import { getExtendedForecastRange } from "./_utils/budgetTrendRange";
import { periodLabel } from "./_utils/budgetPeriods";
import type { SummaryPeriod, TrendGranularity } from "./PeriodControls";

interface BudgetInsightsTabProps {
  period: SummaryPeriod;
  granularity: TrendGranularity;
  startDate: string;
  endDate: string;
  onOpenTrends?: () => void;
}

function granularityLabel(granularity: TrendGranularity): string {
  switch (granularity) {
    case "daily":
      return "daily";
    case "weekly":
      return "weekly";
    case "monthly":
      return "monthly";
    default:
      return granularity;
  }
}

export default function BudgetInsightsTab({
  period,
  granularity,
  startDate,
  endDate,
  onOpenTrends,
}: BudgetInsightsTabProps) {
  const [anomalyMethod, setAnomalyMethod] =
    useState<AnomalyDetectionMethod>("zscore");
  const [forecastMethod, setForecastMethod] = useState<ForecastMethod>("hybrid");
  const [forecastPeriods, setForecastPeriods] = useState(4);

  const forecastRange = useMemo(
    () => getExtendedForecastRange(granularity),
    [granularity],
  );

  return (
    <div className="space-y-6">
      <p className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-muted-foreground">
        Anomalies and forecasts use the workspace{" "}
        <span className="font-medium text-slate-900">
          {granularityLabel(granularity)}
        </span>{" "}
        trend window ({startDate} → {endDate}). Forecast models also pull extra
        history from {forecastRange.startDate}. Summary KPIs below reflect{" "}
        <span className="font-medium text-slate-900">
          {periodLabel(period)}
        </span>
        , not the trend range.
      </p>

      <BudgetInsightsHeadline period={period} />

      <OverviewRecordPanel
        title="Anomaly detection"
        description="Statistical spikes and drops on total cost — same series as the Trends tab."
        action={
          <div className="flex flex-wrap items-center gap-2">
            {onOpenTrends ? (
              <Button
                type="button"
                variant="outline"
                className={cn(siteNavigationCtaClass, "h-9")}
                onClick={onOpenTrends}
              >
                View trends
              </Button>
            ) : null}
            <Select
              value={anomalyMethod}
              onValueChange={(v) =>
                setAnomalyMethod(v as AnomalyDetectionMethod)
              }
            >
              <SelectTrigger className="h-9 w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zscore">Z-score (2σ)</SelectItem>
                <SelectItem value="threshold">±50% vs mean</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        <AnomalyDetection
          granularity={granularity}
          startDate={startDate}
          endDate={endDate}
          method={anomalyMethod}
          showHeader={false}
        />
      </OverviewRecordPanel>

      <OverviewRecordPanel
        title="Cost forecast"
        description="Projected spend from historical buckets — guidance only, not a billing commitment."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={forecastMethod}
              onValueChange={(v) => setForecastMethod(v as ForecastMethod)}
            >
              <SelectTrigger className="h-9 w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="sma">Moving avg</SelectItem>
                <SelectItem value="linear">Linear</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={String(forecastPeriods)}
              onValueChange={(v) => setForecastPeriods(parseInt(v, 10))}
            >
              <SelectTrigger className="h-9 w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 ahead</SelectItem>
                <SelectItem value="4">4 ahead</SelectItem>
                <SelectItem value="6">6 ahead</SelectItem>
                <SelectItem value="8">8 ahead</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        <CostForecast
          granularity={granularity}
          startDate={forecastRange.startDate}
          endDate={forecastRange.endDate}
          method={forecastMethod}
          forecastPeriods={forecastPeriods}
          showHeader={false}
        />
      </OverviewRecordPanel>
    </div>
  );
}
