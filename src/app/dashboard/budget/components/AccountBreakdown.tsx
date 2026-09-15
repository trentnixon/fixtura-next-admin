"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Layers, Users } from "lucide-react";
import ChartSummaryStats from "@/components/modules/charts/ChartSummaryStats";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDailyRollupsRange } from "@/hooks/rollups/useDailyRollupsRange";
import type { AccountBreakdown as AccountBreakdownType } from "@/types/rollups";
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
} from "@/utils/chart-formatters";
import { getDailyRollupRangeParams } from "./_utils/budgetRollupRanges";
import { getAccountAnalyticsUrl } from "./_utils/navigation";

const DISPLAY_LIMIT = 40;

interface AccountBreakdownProps {
  showHeader?: boolean;
}

/**
 * Aggregates `accountBreakdown` payloads from daily rollups (last 30 days).
 */
export default function AccountBreakdown({
  showHeader = true,
}: AccountBreakdownProps) {
  const router = useRouter();
  const dailyParams = useMemo(() => getDailyRollupRangeParams(30), []);

  const { data: dailyData, isLoading, isError, error } =
    useDailyRollupsRange(dailyParams);

  const accountBreakdown = useMemo(() => {
    const aggregated: Record<string, AccountBreakdownType> = {};

    dailyData?.forEach((period) => {
      Object.entries(period.accountBreakdown || {}).forEach(
        ([accountId, breakdown]) => {
          if (!aggregated[accountId]) {
            aggregated[accountId] = {
              totalRenders: 0,
              totalCost: 0,
              schedulers: [],
            };
          }
          aggregated[accountId].totalRenders += breakdown.totalRenders;
          aggregated[accountId].totalCost += breakdown.totalCost;
          breakdown.schedulers.forEach((schedulerId) => {
            if (!aggregated[accountId].schedulers.includes(schedulerId)) {
              aggregated[accountId].schedulers.push(schedulerId);
            }
          });
        },
      );
    });

    return Object.entries(aggregated)
      .map(([accountId, breakdown]) => ({
        accountId,
        ...breakdown,
      }))
      .sort((a, b) => b.totalCost - a.totalCost);
  }, [dailyData]);

  const visibleRows = accountBreakdown.slice(0, DISPLAY_LIMIT);
  const totalCost = accountBreakdown.reduce(
    (sum, acc) => sum + acc.totalCost,
    0,
  );
  const topShare =
    totalCost > 0 && accountBreakdown[0]
      ? (accountBreakdown[0].totalCost / totalCost) * 100
      : 0;

  if (isLoading) {
    return (
      <LoadingState variant="minimal" message="Loading daily account mix…" />
    );
  }
  if (isError) {
    return (
      <ErrorState
        variant="minimal"
        title="Unable to load account breakdown"
        error={error as Error}
      />
    );
  }

  if (accountBreakdown.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No account breakdown on daily rollups in the last 30 days.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {showHeader ? (
        <div>
          <h3 className="text-lg font-semibold">Daily rollup account mix</h3>
          <p className="text-sm text-muted-foreground">
            Summed from daily rollup accountBreakdown maps (last 30 days). Use
            the leaderboard above for named accounts by workspace period.
          </p>
        </div>
      ) : null}

      <ChartSummaryStats
        layout="inline"
        stats={[
          {
            icon: Users,
            label: "Accounts",
            value: formatNumber(accountBreakdown.length),
          },
          {
            icon: Layers,
            label: "Total cost",
            value: formatCurrency(totalCost),
          },
          {
            icon: Users,
            label: "Top account share",
            value: formatPercentage(topShare),
          },
        ]}
      />

      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead className="text-right">Renders</TableHead>
              <TableHead className="text-right">Schedulers</TableHead>
              <TableHead className="text-right">Share</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleRows.map((account) => (
              <TableRow
                key={account.accountId}
                className="cursor-pointer hover:bg-slate-50"
                onClick={() =>
                  router.push(getAccountAnalyticsUrl(account.accountId))
                }
              >
                <TableCell className="font-mono text-sm">
                  #{account.accountId}
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {formatCurrency(account.totalCost)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatNumber(account.totalRenders)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatNumber(account.schedulers.length)}
                </TableCell>
                <TableCell className="text-right tabular-nums text-sm text-muted-foreground">
                  {totalCost > 0
                    ? formatPercentage((account.totalCost / totalCost) * 100)
                    : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {accountBreakdown.length > DISPLAY_LIMIT ? (
        <p className="text-xs text-muted-foreground">
          Showing top {DISPLAY_LIMIT} of {accountBreakdown.length} accounts by
          aggregated daily cost.
        </p>
      ) : null}
    </div>
  );
}
