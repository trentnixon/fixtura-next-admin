"use client";

import { useEffect, useState } from "react";
import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";
import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AccountBreakdown from "./AccountBreakdown";
import AnalyticsAccountsTable from "./AnalyticsAccountsTable";
import PeriodTable, { type RollupTablePeriodType } from "./PeriodTable";
import { periodLabel } from "./_utils/budgetPeriods";
import type { SummaryPeriod, TrendGranularity } from "./PeriodControls";

interface BudgetAnalyticsTabProps {
  period: SummaryPeriod;
  granularity: TrendGranularity;
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
 * Budget analytics — rollup tables and account-level views.
 */
export default function BudgetAnalyticsTab({
  period,
  granularity,
}: BudgetAnalyticsTabProps) {
  const [rollupPeriodType, setRollupPeriodType] =
    useState<RollupTablePeriodType>(granularity as RollupTablePeriodType);

  useEffect(() => {
    setRollupPeriodType(granularity as RollupTablePeriodType);
  }, [granularity]);

  return (
    <div className="space-y-6">
      <p className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-muted-foreground">
        <span className="font-medium text-slate-900">Period rollups</span> come
        from the fixed library windows (30 days / 12 weeks / 12 months). The{" "}
        <span className="font-medium text-slate-900">account leaderboard</span>{" "}
        uses the workspace summary period{" "}
        <span className="font-medium text-slate-900">
          {periodLabel(period)}
        </span>
        . Daily account mix is built from rollup payloads, not the top-accounts
        API.
      </p>

      <OverviewRecordPanel
        title="Period rollups"
        description="Bucket-level cost, Lambda/AI split, and render volume."
        action={
          <Select
            value={rollupPeriodType}
            onValueChange={(v) =>
              setRollupPeriodType(v as RollupTablePeriodType)
            }
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
        <PeriodTable periodType={rollupPeriodType} showHeader={false} />
      </OverviewRecordPanel>

      <OverviewRecordPanel
        title="Account leaderboard"
        description={`Top accounts by spend for ${periodLabel(period).toLowerCase()}.`}
        action={
          <DashboardLinkButton
            href="/dashboard/budget/account"
            trailingIcon="arrow"
          >
            All accounts
          </DashboardLinkButton>
        }
      >
        <AnalyticsAccountsTable period={period} limit={20} />
      </OverviewRecordPanel>

      <OverviewRecordPanel
        title="Daily rollup account mix"
        description={`Aggregated account IDs from daily rollups — aligned with ${granularityLabel(granularity).toLowerCase()} trend granularity, not the summary period selector.`}
      >
        <AccountBreakdown showHeader={false} />
      </OverviewRecordPanel>
    </div>
  );
}
