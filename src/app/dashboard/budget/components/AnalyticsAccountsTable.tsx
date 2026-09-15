"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, Users } from "lucide-react";
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
import { useTopAccountsByCost } from "@/hooks/rollups/useTopAccountsByCost";
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
} from "@/utils/chart-formatters";
import { periodLabel } from "./_utils/budgetPeriods";
import { getAccountAnalyticsUrl } from "./_utils/navigation";
import type { SummaryPeriod } from "./PeriodControls";

interface AnalyticsAccountsTableProps {
  period: SummaryPeriod;
  limit?: number;
}

/**
 * Workspace-period account leaderboard (API top accounts).
 */
export default function AnalyticsAccountsTable({
  period,
  limit = 20,
}: AnalyticsAccountsTableProps) {
  const router = useRouter();
  const { data, isLoading, isError, error } = useTopAccountsByCost({
    period,
    limit,
    sortBy: "totalCost",
    sortOrder: "desc",
  });

  if (isLoading) {
    return (
      <LoadingState variant="minimal" message="Loading account leaderboard…" />
    );
  }
  if (isError) {
    return (
      <ErrorState
        variant="minimal"
        title="Unable to load accounts"
        error={error as Error}
      />
    );
  }

  const accounts = data?.data ?? [];
  if (accounts.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No account spend for {periodLabel(period).toLowerCase()}.
      </p>
    );
  }

  const fleetTotal = accounts.reduce((sum, a) => sum + (a.totalCost ?? 0), 0);
  const top = accounts[0];

  return (
    <div className="space-y-4">
      <ChartSummaryStats
        layout="inline"
        stats={[
          {
            icon: Users,
            label: "Accounts",
            value: formatNumber(accounts.length),
          },
          {
            icon: Users,
            label: "Top spend (listed)",
            value: formatCurrency(fleetTotal),
          },
          {
            icon: Users,
            label: "Leader",
            value: top?.accountName?.trim() || `#${top?.accountId ?? "—"}`,
          },
          {
            icon: Users,
            label: "Leader share",
            value:
              typeof top?.percentageOfTotal === "number"
                ? formatPercentage(top.percentageOfTotal)
                : "—",
          },
        ]}
      />

      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead>Account</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead className="text-right">Renders</TableHead>
              <TableHead className="text-right">Avg / render</TableHead>
              <TableHead className="text-right">Fleet %</TableHead>
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account, index) => (
              <TableRow
                key={account.accountId}
                className="cursor-pointer hover:bg-brandPrimary-50/40"
                onClick={() => {
                  if (account.accountId != null) {
                    router.push(getAccountAnalyticsUrl(account.accountId));
                  }
                }}
              >
                <TableCell className="text-muted-foreground tabular-nums">
                  {index + 1}
                </TableCell>
                <TableCell className="font-medium">
                  {account.accountName?.trim() ||
                    `Account #${account.accountId}`}
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {formatCurrency(account.totalCost ?? 0)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatNumber(account.totalRenders ?? 0)}
                </TableCell>
                <TableCell className="text-right tabular-nums text-sm">
                  {account.averageCostPerRender != null
                    ? formatCurrency(account.averageCostPerRender)
                    : "—"}
                </TableCell>
                <TableCell className="text-right tabular-nums text-sm text-muted-foreground">
                  {typeof account.percentageOfTotal === "number"
                    ? formatPercentage(account.percentageOfTotal)
                    : "—"}
                </TableCell>
                <TableCell>
                  <ChevronRight
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
