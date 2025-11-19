"use client";

import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDailyRollupsRange } from "@/hooks/rollups/useDailyRollupsRange";
import { useWeeklyRollupsRange } from "@/hooks/rollups/useWeeklyRollupsRange";
import { useMonthlyRollupsRange } from "@/hooks/rollups/useMonthlyRollupsRange";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { formatCurrency, formatNumber } from "./_utils/formatCurrency";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AccountBreakdown as AccountBreakdownType } from "@/types/rollups";

type PeriodType = "daily" | "weekly" | "monthly";

export default function AccountBreakdown() {
  const [periodType, setPeriodType] = useState<PeriodType>("daily");

  // Calculate default date ranges
  const dailyParams = useMemo(() => {
    const end = new Date();
    const start = new Date(end);
    start.setDate(end.getDate() - 29); // Last 30 days
    return {
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
      limit: 30,
    };
  }, []);

  const weeklyParams = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const getWeekNumber = (date: Date) => {
      const d = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      );
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      return Math.ceil(
        ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
      );
    };
    const currentWeek = getWeekNumber(now);
    return {
      startYear: currentYear,
      startWeek: Math.max(1, currentWeek - 11), // Last 12 weeks
      endYear: currentYear,
      endWeek: currentWeek,
      limit: 12,
    };
  }, []);

  const monthlyParams = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    return {
      startYear: currentYear,
      startMonth: Math.max(1, currentMonth - 11), // Last 12 months
      endYear: currentYear,
      endMonth: currentMonth,
      limit: 12,
    };
  }, []);

  const {
    data: dailyData,
    isLoading: dailyLoading,
    isError: dailyError,
  } = useDailyRollupsRange(dailyParams);
  // Note: Weekly and Monthly rollups don't have accountBreakdown structure
  // Only fetching for consistency, but only using daily data
  useWeeklyRollupsRange(weeklyParams);
  useMonthlyRollupsRange(monthlyParams);

  const isLoading = periodType === "daily" && dailyLoading;
  const isError = periodType === "daily" && dailyError;

  // Aggregate account breakdowns across all periods
  // Note: Only DailyRollup has accountBreakdown structure
  const accountBreakdown = useMemo(() => {
    const aggregated: Record<string, AccountBreakdownType> = {};

    // Process daily rollups (only period type with accountBreakdown)
    if (periodType === "daily" && dailyData) {
      dailyData.forEach((period) => {
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
            // Merge schedulers (unique)
            breakdown.schedulers.forEach((schedulerId) => {
              if (!aggregated[accountId].schedulers.includes(schedulerId)) {
                aggregated[accountId].schedulers.push(schedulerId);
              }
            });
          }
        );
      });
    }

    // Convert to array and sort by cost
    return Object.entries(aggregated)
      .map(([accountId, breakdown]) => ({
        accountId,
        ...breakdown,
      }))
      .sort((a, b) => b.totalCost - a.totalCost);
  }, [periodType, dailyData]);

  const totalCost = accountBreakdown.reduce(
    (sum, acc) => sum + acc.totalCost,
    0
  );

  if (isLoading)
    return <LoadingState message="Loading account breakdown..." />;
  if (isError)
    return (
      <ErrorState
        variant="card"
        title="Unable to load account breakdown"
        error={new Error("Failed to load data")}
      />
    );

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Account Breakdown by Period</h3>
        <Select
          value={periodType}
          onValueChange={(v) => setPeriodType(v as PeriodType)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {periodType !== "daily" && (
        <div className="text-sm text-muted-foreground text-center py-8">
          Account breakdown is currently only available for daily periods.
          Please select &quot;Daily&quot; to view account breakdown data.
        </div>
      )}
      {periodType === "daily" && accountBreakdown.length > 0 && (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Total Accounts: {accountBreakdown.length} • Total Cost:{" "}
            {formatCurrency(totalCost)}
          </div>
          <div className="border rounded-lg overflow-hidden shadow-none w-full">
            <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Account ID</TableHead>
                    <TableHead className="text-right">Total Cost</TableHead>
                    <TableHead className="text-right">Renders</TableHead>
                    <TableHead className="text-right">Schedulers</TableHead>
                    <TableHead className="text-right">% of Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accountBreakdown.map((account) => (
                    <TableRow key={account.accountId}>
                      <TableCell className="font-mono text-sm">
                        #{account.accountId}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(account.totalCost)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumber(account.totalRenders)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumber(account.schedulers.length)}
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {totalCost > 0
                          ? ((account.totalCost / totalCost) * 100).toFixed(1)
                          : "0.0"}
                        %
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </div>
        </div>
      )}
      {periodType === "daily" && accountBreakdown.length === 0 && (
        <div className="text-sm text-muted-foreground text-center py-8">
          No account breakdown data available
        </div>
      )}
    </div>
  );
}
