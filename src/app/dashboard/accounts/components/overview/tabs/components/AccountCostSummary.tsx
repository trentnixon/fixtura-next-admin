"use client";

import {
  Bot,
  CircleDollarSign,
  Cpu,
  Film,
} from "lucide-react";
import { useAccountRollupsSummary } from "@/hooks/rollups/useAccountRollupsSummary";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { EmptyState } from "@/components/ui-library";
import {
  formatCurrency,
  formatNumber,
} from "@/app/dashboard/budget/components/_utils/formatCurrency";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import {
  LiveSnapshotMetricStrip,
  type LiveSnapshotMetricItem,
} from "@/app/dashboard/components/live-snapshot/LiveSnapshotMetricStrip";

interface AccountCostSummaryProps {
  accountId: number;
}

const METRIC_ICON_CLASS = "bg-slate-100 text-slate-600";

export default function AccountCostSummary({
  accountId,
}: AccountCostSummaryProps) {
  const {
    data: summaryData,
    isLoading: summaryLoading,
    isError: summaryError,
    error: summaryErr,
  } = useAccountRollupsSummary(accountId);

  if (summaryLoading) {
    return (
      <div className="space-y-4">
        <LiveSnapshotMetricStrip
          columns={4}
          items={[
            { id: "1", label: "Total Renders", value: "", meta: "", icon: Film, isLoading: true },
            { id: "2", label: "Total Cost", value: "", meta: "", icon: CircleDollarSign, isLoading: true },
            { id: "3", label: "Lambda Cost", value: "", meta: "", icon: Cpu, isLoading: true },
            { id: "4", label: "AI Cost", value: "", meta: "", icon: Bot, isLoading: true },
          ]}
        />
        <SectionContainer
          title="Account costs"
          description="Complete account-level cost summary across all schedulers"
          variant="compact"
        >
          <LoadingState message="Loading account cost summary…" />
        </SectionContainer>
      </div>
    );
  }

  if (summaryError) {
    return (
      <SectionContainer
        title="Account costs"
        description="Complete account-level cost summary across all schedulers"
        variant="compact"
      >
        <ErrorState
          variant="card"
          title="Unable to load account cost summary"
          error={summaryErr as Error}
        />
      </SectionContainer>
    );
  }

  if (!summaryData) {
    return (
      <SectionContainer
        title="Account costs"
        description="Complete account-level cost summary across all schedulers"
        variant="compact"
      >
        <EmptyState
          title="No cost data"
          description="No cost data is available for this account yet."
          variant="minimal"
        />
      </SectionContainer>
    );
  }

  const currentMonthLambda =
    summaryData.currentMonth?.costBreakdown?.global?.lambda;
  const currentMonthAi = summaryData.currentMonth?.costBreakdown?.global?.ai;

  const recentRendersLambda =
    summaryData.recentRenders?.reduce(
      (sum, render) => sum + (render.totalLambdaCost ?? 0),
      0,
    ) ?? 0;

  const recentRendersAi =
    summaryData.recentRenders?.reduce(
      (sum, render) => sum + (render.totalAiCost ?? 0),
      0,
    ) ?? 0;

  const displayLambda = currentMonthLambda ?? recentRendersLambda;
  const displayAi = currentMonthAi ?? recentRendersAi;
  const isCurrentMonthOnly = currentMonthLambda !== undefined;

  const calculatedCost = displayLambda + displayAi;
  const displayTotalCost =
    summaryData.currentMonth?.totalCost ??
    (Number.isNaN(calculatedCost)
      ? summaryData.totals.totalCost ?? 0
      : calculatedCost);

  const recentOnlyNote = isCurrentMonthOnly ? undefined : "Recent renders only";

  const summaryMetrics: LiveSnapshotMetricItem[] = [
    {
      id: "renders",
      label: "Total Renders",
      value: formatNumber(summaryData.totals.totalRenders),
      meta: `${formatNumber(summaryData.totals.totalSchedulers)} schedulers`,
      icon: Film,
      iconClassName: METRIC_ICON_CLASS,
    },
    {
      id: "total",
      label: "Total Cost",
      value: formatCurrency(displayTotalCost),
      meta: recentOnlyNote ?? "Account lifetime rollup",
      icon: CircleDollarSign,
      iconClassName: METRIC_ICON_CLASS,
    },
    {
      id: "lambda",
      label: "Lambda Cost",
      value: formatCurrency(displayLambda),
      meta: recentOnlyNote ?? "Current month breakdown",
      icon: Cpu,
      iconClassName: METRIC_ICON_CLASS,
    },
    {
      id: "ai",
      label: "AI Cost",
      value: formatCurrency(displayAi),
      meta: recentOnlyNote ?? "Current month breakdown",
      icon: Bot,
      iconClassName: METRIC_ICON_CLASS,
    },
  ];

  return (
    <div className="space-y-4">
      <LiveSnapshotMetricStrip items={summaryMetrics} columns={4} />

      <SectionContainer
        title="Account costs"
        description="Complete account-level cost summary across all schedulers"
        variant="compact"
      >
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Total schedulers</dt>
            <dd className="font-medium text-slate-900">
              {formatNumber(summaryData.totals.totalSchedulers)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Average cost per render</dt>
            <dd className="font-medium text-slate-900">
              {formatCurrency(summaryData.totals.averageCostPerRender)}
            </dd>
          </div>
          {summaryData.currentMonth && (
            <>
              <div>
                <dt className="text-muted-foreground">Current month total</dt>
                <dd className="font-medium text-slate-900">
                  {formatCurrency(summaryData.currentMonth.totalCost)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Current month renders</dt>
                <dd className="font-medium text-slate-900">
                  {formatNumber(summaryData.currentMonth.totalRenders)}
                </dd>
              </div>
            </>
          )}
        </dl>

        <p className="mt-4 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-muted-foreground">
          Account-level totals span all schedulers. The scheduler breakdown below
          may differ if scoped to one scheduler or a narrower date range.
        </p>
      </SectionContainer>
    </div>
  );
}
