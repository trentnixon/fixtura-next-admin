"use client";

import { useAccountRollupsSummary } from "@/hooks/rollups/useAccountRollupsSummary";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import {
  formatCurrency,
  formatNumber,
} from "@/app/dashboard/budget/components/_utils/formatCurrency";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";

interface AccountCostSummaryProps {
  accountId: number;
}

export default function AccountCostSummary({
  accountId,
}: AccountCostSummaryProps) {
  const {
    data: summaryData,
    isLoading: summaryLoading,
    isError: summaryError,
    error: summaryErr,
  } = useAccountRollupsSummary(accountId);

  // Get Lambda and AI costs from currentMonth if available (most accurate)
  // Otherwise, calculate from recent renders (limited to last 10)
  const currentMonthLambda =
    summaryData?.currentMonth?.costBreakdown?.global?.lambda;
  const currentMonthAi = summaryData?.currentMonth?.costBreakdown?.global?.ai;

  // Fallback: calculate from recent renders (only last 10, so not complete)
  const recentRendersLambda =
    summaryData?.recentRenders?.reduce(
      (sum, render) => sum + (render.totalLambdaCost ?? 0),
      0
    ) ?? 0;

  const recentRendersAi =
    summaryData?.recentRenders?.reduce(
      (sum, render) => sum + (render.totalAiCost ?? 0),
      0
    ) ?? 0;

  // Use current month breakdown if available, otherwise show recent renders (with note)
  const displayLambda = currentMonthLambda ?? recentRendersLambda;
  const displayAi = currentMonthAi ?? recentRendersAi;
  const isCurrentMonthOnly = currentMonthLambda !== undefined;

  // Calculate Total Cost to match the displayed Lambda and AI costs
  // Priority: currentMonth.totalCost > (displayLambda + displayAi) > totals.totalCost
  // This ensures Total Cost matches the sum of displayed Lambda and AI costs
  const calculatedCost = displayLambda + displayAi;
  const displayTotalCost =
    summaryData?.currentMonth?.totalCost ??
    (isNaN(calculatedCost)
      ? summaryData?.totals.totalCost ?? 0
      : calculatedCost);

  return (
    <SectionContainer
      title="Total Renders"
      description="Complete account-level cost summary across all schedulers"
      variant="compact"
    >
      {summaryLoading && (
        <LoadingState message="Loading account cost summary..." />
      )}
      {summaryError && (
        <ErrorState
          variant="card"
          title="Unable to load account cost summary"
          error={summaryErr as Error}
        />
      )}
      {summaryData && (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">
                Total Renders
              </div>
              <div className="text-lg font-semibold">
                {formatNumber(summaryData.totals.totalRenders)}
              </div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">
                Total Cost
                {!isCurrentMonthOnly && displayTotalCost > 0 && (
                  <span className="ml-1 text-xs">(recent only)</span>
                )}
              </div>
              <div className="text-lg font-semibold">
                {formatCurrency(displayTotalCost)}
              </div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">
                Lambda Cost
                {!isCurrentMonthOnly && (
                  <span className="ml-1 text-xs">(recent only)</span>
                )}
              </div>
              <div className="text-lg font-semibold">
                {formatCurrency(displayLambda)}
              </div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">
                AI Cost
                {!isCurrentMonthOnly && (
                  <span className="ml-1 text-xs">(recent only)</span>
                )}
              </div>
              <div className="text-lg font-semibold">
                {formatCurrency(displayAi)}
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              <strong>Total Schedulers:</strong>{" "}
              {formatNumber(summaryData.totals.totalSchedulers)}
            </p>
            <p>
              <strong>Average Cost per Render:</strong>{" "}
              {formatCurrency(summaryData.totals.averageCostPerRender)}
            </p>
            {summaryData.currentMonth && (
              <p>
                <strong>Current Month:</strong>{" "}
                {formatCurrency(summaryData.currentMonth.totalCost)} (
                {formatNumber(summaryData.currentMonth.totalRenders)} renders)
                {summaryData.currentMonth.costBreakdown?.global?.lambda !==
                  undefined && (
                  <span className="ml-2">
                    [Lambda:{" "}
                    {formatCurrency(
                      summaryData.currentMonth.costBreakdown.global.lambda
                    )}
                    , AI:{" "}
                    {formatCurrency(
                      summaryData.currentMonth.costBreakdown.global.ai
                    )}
                    ]
                  </span>
                )}
              </p>
            )}
            <p className="mt-2 pt-2 border-t text-xs">
              <strong>Note:</strong> This shows account-level totals across all
              schedulers. The scheduler breakdown below may show different
              numbers if limited to a specific scheduler or date range.
            </p>
          </div>
        </div>
      )}
      {!summaryData && !summaryLoading && !summaryError && (
        <div className="text-sm text-muted-foreground text-center py-8">
          No cost data available for this account
        </div>
      )}
    </SectionContainer>
  );
}
