"use client";

import { useGlobalCostSummary } from "@/hooks/rollups/useGlobalCostSummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "./_utils/formatCurrency";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { SummaryPeriod } from "./PeriodControls";

interface PeriodComparisonProps {
  currentPeriod?: SummaryPeriod;
  comparePeriod?: SummaryPeriod;
}

const PERIOD_LABELS: Record<string, string> = {
  "current-month": "Current Month",
  "last-month": "Last Month",
  "current-year": "Current Year",
  "all-time": "All Time",
};

export default function PeriodComparison({
  currentPeriod = "current-month",
  comparePeriod = "last-month",
}: PeriodComparisonProps) {
  const { data: currentData, isLoading: currentLoading, isError: currentError } =
    useGlobalCostSummary(currentPeriod);
  const { data: compareData, isLoading: compareLoading, isError: compareError } =
    useGlobalCostSummary(comparePeriod);

  const isLoading = currentLoading || compareLoading;
  const isError = currentError || compareError;

  if (isLoading) {
    return <LoadingState message="Loading period comparison..." />;
  }

  if (isError) {
    return (
      <ErrorState
        variant="card"
        title="Unable to load period comparison"
        error={(currentError || compareError) as Error}
      />
    );
  }

  if (!currentData || !compareData) {
    return null;
  }

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return { value: 0, percentage: 0, direction: "stable" };
    const change = current - previous;
    const percentage = (change / previous) * 100;
    return {
      value: change,
      percentage: Math.abs(percentage),
      direction: change > 0 ? "up" : change < 0 ? "down" : "stable",
    };
  };

  const totalCostChange = calculateChange(
    currentData.totalCost ?? 0,
    compareData.totalCost ?? 0
  );
  const lambdaCostChange = calculateChange(
    currentData.totalLambdaCost ?? 0,
    compareData.totalLambdaCost ?? 0
  );
  const aiCostChange = calculateChange(
    currentData.totalAiCost ?? 0,
    compareData.totalAiCost ?? 0
  );
  const rendersChange = calculateChange(
    currentData.totalRenders ?? 0,
    compareData.totalRenders ?? 0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Period Comparison: {PERIOD_LABELS[currentPeriod]} vs{" "}
          {PERIOD_LABELS[comparePeriod]}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Total Cost */}
          <ComparisonRow
            label="Total Cost"
            current={formatCurrency(currentData.totalCost)}
            previous={formatCurrency(compareData.totalCost)}
            change={totalCostChange}
          />

          {/* Lambda vs AI Split */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <ComparisonRow
              label="Lambda Cost"
              current={formatCurrency(currentData.totalLambdaCost)}
              previous={formatCurrency(compareData.totalLambdaCost)}
              change={lambdaCostChange}
              compact
            />
            <ComparisonRow
              label="AI Cost"
              current={formatCurrency(currentData.totalAiCost)}
              previous={formatCurrency(compareData.totalAiCost)}
              change={aiCostChange}
              compact
            />
          </div>

          {/* Renders */}
          <ComparisonRow
            label="Total Renders"
            current={formatNumber(currentData.totalRenders)}
            previous={formatNumber(compareData.totalRenders)}
            change={rendersChange}
          />

          {/* Averages */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Avg Cost per Render
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">
                  {formatCurrency(currentData.averageCostPerRender)}
                </span>
                <span className="text-xs text-muted-foreground">
                  vs {formatCurrency(compareData.averageCostPerRender)}
                </span>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Avg Cost per Account
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">
                  {formatCurrency(currentData.averageCostPerAccount)}
                </span>
                <span className="text-xs text-muted-foreground">
                  vs {formatCurrency(compareData.averageCostPerAccount)}
                </span>
              </div>
            </div>
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
  change: {
    value: number;
    percentage: number;
    direction: "up" | "down" | "stable";
  };
  compact?: boolean;
}

function ComparisonRow({
  label,
  current,
  previous,
  change,
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
        <div className="text-sm text-muted-foreground mb-1">{label}</div>
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold">{current}</span>
          {change.percentage > 0 && (
            <span className={`text-xs flex items-center gap-1 ${colorClass}`}>
              <Icon className="h-3 w-3" />
              {change.percentage.toFixed(1)}%
            </span>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">
          Previous: {previous}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        {change.percentage > 0 && (
          <span className={`text-sm flex items-center gap-1 ${colorClass}`}>
            <Icon className="h-4 w-4" />
            {change.percentage.toFixed(1)}%{" "}
            {change.direction === "up" ? "increase" : "decrease"}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Current</div>
          <div className="text-lg font-semibold">{current}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Previous</div>
          <div className="text-lg font-semibold text-muted-foreground">
            {previous}
          </div>
        </div>
      </div>
      {change.value !== 0 && (
        <div className="text-xs text-muted-foreground">
          Change:{" "}
          <span className={colorClass}>
            {change.value > 0 ? "+" : ""}
            {formatCurrency(change.value)}
          </span>
        </div>
      )}
    </div>
  );
}

