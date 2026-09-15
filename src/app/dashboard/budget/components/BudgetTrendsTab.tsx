"use client";

import { useEffect, useState } from "react";
import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
import { Button } from "@/components/ui/button";
import { siteNavigationCtaClass } from "@/lib/actions/siteNavigationButtonStyles";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AccountShareChart from "./AccountShareChart";
import CostBreakdownChart from "./CostBreakdownChart";
import PeakPeriodsChart, {
  type PeakPeriodType,
} from "./PeakPeriodsChart";
import PeriodTrendsChart from "./PeriodTrendsChart";
import StackedCostTrendsChart from "./StackedCostTrendsChart";
import TopAccountsList from "./TopAccountsList";
import { periodLabel } from "./_utils/budgetPeriods";
import type { SummaryPeriod, TrendGranularity } from "./PeriodControls";

interface BudgetTrendsTabProps {
  period: SummaryPeriod;
  granularity: TrendGranularity;
  startDate: string;
  endDate: string;
  onOpenInsights?: () => void;
}

function granularityLabel(granularity: TrendGranularity): string {
  switch (granularity) {
    case "daily":
      return "Daily";
    case "weekly":
      return "Weekly";
    case "monthly":
      return "Monthly";
    default:
      return granularity;
  }
}

/**
 * Budget trends — time-series costs, concentration, and peak periods.
 */
export default function BudgetTrendsTab({
  period,
  granularity,
  startDate,
  endDate,
  onOpenInsights,
}: BudgetTrendsTabProps) {
  const [peakPeriodType, setPeakPeriodType] = useState<PeakPeriodType>(
    granularity as PeakPeriodType,
  );

  useEffect(() => {
    setPeakPeriodType(granularity as PeakPeriodType);
  }, [granularity]);

  return (
    <div className="space-y-6">
      <p className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-muted-foreground">
        Trend charts use{" "}
        <span className="font-medium text-slate-900">
          {granularityLabel(granularity).toLowerCase()}
        </span>{" "}
        buckets from{" "}
        <span className="font-medium tabular-nums text-slate-900">
          {startDate}
        </span>{" "}
        to{" "}
        <span className="font-medium tabular-nums text-slate-900">
          {endDate}
        </span>
        . Side panels reflect the summary period{" "}
        <span className="font-medium text-slate-900">
          {periodLabel(period)}
        </span>{" "}
        (workspace selector).
      </p>

      <OverviewRecordPanel
        title="Cost over time"
        description="Total spend, Lambda vs AI stack, and fleet concentration for the trend window."
        action={
          onOpenInsights ? (
            <Button
              type="button"
              variant="outline"
              className={cn(siteNavigationCtaClass, "h-9")}
              onClick={onOpenInsights}
            >
              Anomaly detail
            </Button>
          ) : undefined
        }
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <PeriodTrendsChart
              granularity={granularity}
              startDate={startDate}
              endDate={endDate}
            />
            <StackedCostTrendsChart
              granularity={granularity}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
          <div className="space-y-6 lg:col-span-1">
            <AccountShareChart period={period} limit={8} />
            <TopAccountsList period={period} limit={8} />
            <CostBreakdownChart period={period} compact />
            <p className="text-xs text-muted-foreground">
              Lambda vs AI pie uses the workspace summary period, not the trend
              date range above.
            </p>
          </div>
        </div>
      </OverviewRecordPanel>

      <OverviewRecordPanel
        title="Peak periods"
        description="Highest-cost days, weeks, or months in the rollup (top 10)."
        action={
          <Select
            value={peakPeriodType}
            onValueChange={(v) => setPeakPeriodType(v as PeakPeriodType)}
          >
            <SelectTrigger className="h-9 w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        }
      >
        <PeakPeriodsChart
          periodType={peakPeriodType}
          onPeriodTypeChange={setPeakPeriodType}
          showHeader={false}
        />
      </OverviewRecordPanel>
    </div>
  );
}
