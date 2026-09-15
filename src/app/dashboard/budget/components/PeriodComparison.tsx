"use client";

import { ArrowDown, ArrowUp, GitCompare, Minus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ChartSummaryStats, {
  type ChartSummaryStat,
} from "@/components/modules/charts/ChartSummaryStats";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { useGlobalCostSummary } from "@/hooks/rollups/useGlobalCostSummary";
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
} from "@/utils/chart-formatters";
import { periodLabel } from "./_utils/budgetPeriods";
import type { SummaryPeriod } from "./PeriodControls";

interface PeriodComparisonProps {
  currentPeriod?: SummaryPeriod;
  comparePeriod?: SummaryPeriod;
}

type ChangeResult = {
  value: number;
  percentage: number;
  direction: "stable" | "up" | "down";
};

function calculateChange(current: number, previous: number): ChangeResult {
  if (previous === 0) return { value: 0, percentage: 0, direction: "stable" };
  const change = current - previous;
  const percentage = (change / previous) * 100;
  return {
    value: change,
    percentage: Math.abs(percentage),
    direction: change > 0 ? "up" : change < 0 ? "down" : "stable",
  };
}

function changeStat(
  label: string,
  change: ChangeResult,
  invertColors = false,
): ChartSummaryStat {
  const Icon =
    change.direction === "up"
      ? ArrowUp
      : change.direction === "down"
        ? ArrowDown
        : Minus;

  const upClass = invertColors ? "text-green-600" : "text-red-600";
  const downClass = invertColors ? "text-red-600" : "text-green-600";
  const colorClass =
    change.direction === "up"
      ? upClass
      : change.direction === "down"
        ? downClass
        : "text-muted-foreground";

  return {
    icon: Icon,
    label,
    value:
      change.percentage > 0 ? (
        <span className={colorClass}>
          {formatPercentage(change.percentage)}{" "}
          {change.direction === "up"
            ? "↑"
            : change.direction === "down"
              ? "↓"
              : ""}
        </span>
      ) : (
        "No change"
      ),
  };
}

export default function PeriodComparison({
  currentPeriod = "current-month",
  comparePeriod = "last-month",
}: PeriodComparisonProps) {
  const {
    data: currentData,
    isLoading: currentLoading,
    isError: currentError,
    error: currentErr,
  } = useGlobalCostSummary(currentPeriod);
  const {
    data: compareData,
    isLoading: compareLoading,
    isError: compareError,
    error: compareErr,
  } = useGlobalCostSummary(comparePeriod);

  const isLoading = currentLoading || compareLoading;
  const isError = currentError || compareError;

  if (isLoading) {
    return (
      <LoadingState variant="minimal" message="Loading period comparison…" />
    );
  }

  if (isError) {
    return (
      <ErrorState
        variant="card"
        title="Unable to load period comparison"
        error={(currentErr || compareErr) as Error}
      />
    );
  }

  if (!currentData || !compareData) {
    return null;
  }

  const totalCostChange = calculateChange(
    currentData.totalCost ?? 0,
    compareData.totalCost ?? 0,
  );
  const lambdaCostChange = calculateChange(
    currentData.totalLambdaCost ?? 0,
    compareData.totalLambdaCost ?? 0,
  );
  const aiCostChange = calculateChange(
    currentData.totalAiCost ?? 0,
    compareData.totalAiCost ?? 0,
  );
  const rendersChange = calculateChange(
    currentData.totalRenders ?? 0,
    compareData.totalRenders ?? 0,
  );
  const accountsChange = calculateChange(
    currentData.totalAccounts ?? 0,
    compareData.totalAccounts ?? 0,
  );
  const schedulersChange = calculateChange(
    currentData.totalSchedulers ?? 0,
    compareData.totalSchedulers ?? 0,
  );

  const headlineStats: ChartSummaryStat[] = [
    {
      icon: GitCompare,
      label: "Total spend",
      value: formatCurrency(currentData.totalCost ?? 0),
    },
    changeStat("Spend vs prior", totalCostChange),
    changeStat("Renders vs prior", rendersChange, true),
    changeStat("Active accounts", accountsChange, true),
  ];

  return (
    <Card className="rounded-md border bg-slate-50 shadow-none">
      <CardHeader>
        <div className="flex items-center gap-2">
          <GitCompare className="h-5 w-5 text-muted-foreground" aria-hidden />
          <CardTitle className="text-lg font-semibold">Period comparison</CardTitle>
        </div>
        <CardDescription>
          {periodLabel(currentPeriod)} compared with {periodLabel(comparePeriod)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ChartSummaryStats stats={headlineStats} layout="inline" />

        <div className="space-y-5 rounded-md border border-slate-200 bg-white p-4">
          <ComparisonRow
            label="Total cost"
            current={formatCurrency(currentData.totalCost)}
            previous={formatCurrency(compareData.totalCost)}
            change={totalCostChange}
            formatDelta={formatCurrency}
          />

          <div className="grid grid-cols-1 gap-5 border-t border-slate-100 pt-5 sm:grid-cols-2">
            <ComparisonRow
              label="Lambda"
              current={formatCurrency(currentData.totalLambdaCost)}
              previous={formatCurrency(compareData.totalLambdaCost)}
              change={lambdaCostChange}
              formatDelta={formatCurrency}
              compact
            />
            <ComparisonRow
              label="AI"
              current={formatCurrency(currentData.totalAiCost)}
              previous={formatCurrency(compareData.totalAiCost)}
              change={aiCostChange}
              formatDelta={formatCurrency}
              compact
            />
          </div>

          <div className="grid grid-cols-1 gap-5 border-t border-slate-100 pt-5 sm:grid-cols-3">
            <ComparisonRow
              label="Renders"
              current={formatNumber(currentData.totalRenders)}
              previous={formatNumber(compareData.totalRenders)}
              change={rendersChange}
              formatDelta={(n) => formatNumber(n)}
              compact
            />
            <ComparisonRow
              label="Accounts"
              current={formatNumber(currentData.totalAccounts)}
              previous={formatNumber(compareData.totalAccounts)}
              change={accountsChange}
              formatDelta={(n) => formatNumber(n)}
              compact
            />
            <ComparisonRow
              label="Schedulers"
              current={formatNumber(currentData.totalSchedulers)}
              previous={formatNumber(compareData.totalSchedulers)}
              change={schedulersChange}
              formatDelta={(n) => formatNumber(n)}
              compact
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ComparisonRowProps {
  label: string;
  current: string;
  previous: string;
  change: ChangeResult;
  formatDelta: (value: number) => string;
  compact?: boolean;
}

function ComparisonRow({
  label,
  current,
  previous,
  change,
  formatDelta,
  compact = false,
}: ComparisonRowProps) {
  const Icon =
    change.direction === "up"
      ? ArrowUp
      : change.direction === "down"
        ? ArrowDown
        : Minus;

  const colorClass =
    change.direction === "up"
      ? "text-red-600"
      : change.direction === "down"
        ? "text-green-600"
        : "text-muted-foreground";

  if (compact) {
    return (
      <div>
        <div className="mb-1 text-sm text-muted-foreground">{label}</div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-base font-semibold tabular-nums">{current}</span>
          {change.percentage > 0 ? (
            <span
              className={`flex items-center gap-1 text-xs tabular-nums ${colorClass}`}
            >
              <Icon className="h-3 w-3" aria-hidden />
              {formatPercentage(change.percentage)}
            </span>
          ) : null}
        </div>
        <div className="mt-0.5 text-xs text-muted-foreground">
          Prior: {previous}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium">{label}</span>
        {change.percentage > 0 ? (
          <span
            className={`flex items-center gap-1 text-sm tabular-nums ${colorClass}`}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {formatPercentage(change.percentage)}{" "}
            {change.direction === "up" ? "increase" : "decrease"}
          </span>
        ) : null}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="mb-1 text-xs text-muted-foreground">Current</div>
          <div className="text-lg font-semibold tabular-nums">{current}</div>
        </div>
        <div>
          <div className="mb-1 text-xs text-muted-foreground">Prior</div>
          <div className="text-lg font-semibold tabular-nums text-muted-foreground">
            {previous}
          </div>
        </div>
      </div>
      {change.value !== 0 ? (
        <div className="text-xs text-muted-foreground">
          Delta:{" "}
          <span className={colorClass}>
            {change.value > 0 ? "+" : ""}
            {formatDelta(change.value)}
          </span>
        </div>
      ) : null}
    </div>
  );
}
