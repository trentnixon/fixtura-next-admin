"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ChartSummaryStats from "@/components/modules/charts/ChartSummaryStats";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { useTopAccountsByCost } from "@/hooks/rollups/useTopAccountsByCost";
import type { TopAccount } from "@/types/rollups";
import { formatCurrency, formatNumber } from "@/utils/chart-formatters";
import { periodLabel } from "./_utils/budgetPeriods";
import { getAccountAnalyticsUrl } from "./_utils/navigation";
import type { SummaryPeriod } from "./PeriodControls";

interface TopAccountsListProps {
  period?: SummaryPeriod;
  limit?: number;
  /** Overview panel omits nested card chrome */
  variant?: "card" | "embedded";
}

export default function TopAccountsList({
  period = "current-month",
  limit = 10,
  variant = "card",
}: TopAccountsListProps) {
  const router = useRouter();
  const { data, isLoading, isError, error } = useTopAccountsByCost({
    period,
    limit,
    sortBy: "totalCost",
    sortOrder: "desc",
  });

  if (isLoading) {
    return (
      <LoadingState variant="minimal" message="Loading top accounts…" />
    );
  }
  if (isError) {
    return (
      <ErrorState
        variant="minimal"
        title="Unable to load top accounts"
        error={error as Error}
      />
    );
  }

  const accounts = data?.data ?? [];
  if (accounts.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">
        No account spend in this period.
      </p>
    );
  }

  const topShare =
    typeof accounts[0]?.percentageOfTotal === "number"
      ? accounts[0].percentageOfTotal
      : null;

  const list = (
    <ul className="space-y-2">
      {accounts.map((a: TopAccount, index) => (
        <li
          key={a.accountId}
          className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-3 transition-colors hover:border-brandPrimary-300 hover:bg-brandPrimary-50/50"
          onClick={() => {
            if (a.accountId) {
              router.push(getAccountAnalyticsUrl(a.accountId));
            }
          }}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-semibold text-slate-600">
            {index + 1}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">
              {a.accountName ?? `Account #${a.accountId}`}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatNumber(a.totalRenders ?? 0)} renders · avg{" "}
              {a.averageCostPerRender != null
                ? formatCurrency(a.averageCostPerRender)
                : "—"}
              /render
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-sm font-semibold tabular-nums">
              {a.totalCost != null ? formatCurrency(a.totalCost) : "—"}
            </div>
            {typeof a.percentageOfTotal === "number" ? (
              <div className="text-xs tabular-nums text-muted-foreground">
                {a.percentageOfTotal.toFixed(1)}% of fleet
              </div>
            ) : null}
          </div>
          <ChevronRight
            className="h-4 w-4 shrink-0 text-muted-foreground"
            aria-hidden
          />
        </li>
      ))}
    </ul>
  );

  if (variant === "embedded") {
    return list;
  }

  return (
    <Card className="rounded-md border bg-slate-50 shadow-none">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" aria-hidden />
          <CardTitle className="text-lg font-semibold">
            Top accounts by cost
          </CardTitle>
        </div>
        <CardDescription>
          {periodLabel(period)} · top {limit}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {topShare != null ? (
          <ChartSummaryStats
            layout="inline"
            stats={[
              {
                icon: Users,
                label: "#1 share of fleet",
                value: `${topShare.toFixed(1)}%`,
              },
            ]}
          />
        ) : null}
        {list}
      </CardContent>
    </Card>
  );
}
