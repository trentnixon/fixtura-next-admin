"use client";

import { useMemo } from "react";
import { CircleDollarSign } from "lucide-react";

import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";
import { OverviewDataWorkspace } from "@/app/dashboard/components/live-snapshot/OverviewDataWorkspace";
import { useGlobalCostSummary } from "@/hooks/rollups/useGlobalCostSummary";
import { formatCurrency, formatNumber, formatPercentage } from "@/utils/chart-formatters";
import PeriodControls, {
  type PeriodControlsProps,
  type SummaryPeriod,
} from "./PeriodControls";

function periodLabel(period: SummaryPeriod): string {
  switch (period) {
    case "current-month":
      return "Current month";
    case "last-month":
      return "Last month";
    case "current-year":
      return "Current year";
    case "all-time":
      return "All time";
    default:
      return "Current month";
  }
}

type BudgetWorkspaceHeaderProps = PeriodControlsProps;

/**
 * Budget route workspace — global cost KPIs and period / granularity controls.
 */
export default function BudgetWorkspaceHeader(props: BudgetWorkspaceHeaderProps) {
  const { period } = props;
  const { data, isLoading, isError } = useGlobalCostSummary(period);

  const metrics = useMemo(() => {
    const label = periodLabel(period);
    if (isLoading) {
      return [
        { id: "total", label: "Total cost", value: "—", meta: label, isLoading: true },
        { id: "lambda", label: "Lambda", value: "—", meta: label, isLoading: true },
        { id: "ai", label: "AI", value: "—", meta: label, isLoading: true },
        {
          id: "renders",
          label: "Renders",
          value: "—",
          meta: "Accounts & schedulers",
          isLoading: true,
        },
      ];
    }

    if (!data) {
      return [
        { id: "total", label: "Total cost", value: "—", meta: label },
        { id: "lambda", label: "Lambda", value: "—", meta: label },
        { id: "ai", label: "AI", value: "—", meta: label },
        {
          id: "renders",
          label: "Renders",
          value: "—",
          meta: "Accounts & schedulers",
        },
      ];
    }

    const trendMeta =
      data.costTrend === "up"
        ? `Up ${formatPercentage(Math.abs(data.percentageChange ?? 0))}`
        : data.costTrend === "down"
          ? `Down ${formatPercentage(Math.abs(data.percentageChange ?? 0))}`
          : "Stable";

    return [
      {
        id: "total",
        label: "Total cost",
        value: formatCurrency(data.totalCost ?? 0),
        meta: `${label} · ${trendMeta}`,
        isLoading: false,
      },
      {
        id: "lambda",
        label: "Lambda",
        value: formatCurrency(data.totalLambdaCost ?? 0),
        meta: formatCurrency(data.averageCostPerDay ?? 0) + " / day avg",
        isLoading: false,
      },
      {
        id: "ai",
        label: "AI",
        value: formatCurrency(data.totalAiCost ?? 0),
        meta: formatCurrency(data.averageCostPerRender ?? 0) + " / render",
        isLoading: false,
      },
      {
        id: "renders",
        label: "Renders",
        value: formatNumber(data.totalRenders ?? 0),
        meta: `${formatNumber(data.totalAccounts ?? 0)} accounts · ${formatNumber(data.totalSchedulers ?? 0)} schedulers`,
        isLoading: false,
      },
    ];
  }, [data, isLoading, period]);

  return (
    <OverviewDataWorkspace
      title="Render cost workspace"
      description="Global lambda, AI, and render spend for the selected summary period."
      icon={CircleDollarSign}
      metrics={metrics}
      columns={4}
      action={<PeriodControls {...props} />}
      footer={
        <>
          <span className="text-muted-foreground">
            {isError
              ? "Summary unavailable — charts may still load for trend ranges"
              : data?.periodStart && data?.periodEnd
                ? `${data.periodStart} → ${data.periodEnd}`
                : periodLabel(period)}
          </span>
          <div className="flex flex-wrap gap-2">
            <DashboardLinkButton
              href="/dashboard/budget/account"
              trailingIcon="arrow"
            >
              Account costs
            </DashboardLinkButton>
            <DashboardLinkButton
              href="/dashboard/renders"
              intent="highlight"
              trailingIcon="external"
            >
              Renders
            </DashboardLinkButton>
          </div>
        </>
      }
    />
  );
}
