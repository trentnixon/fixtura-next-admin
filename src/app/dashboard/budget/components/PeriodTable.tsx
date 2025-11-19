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

type PeriodType = "daily" | "weekly" | "monthly";

// Helper to format period dates for display
const formatPeriodDate = (dateString: string | undefined | null): string => {
  if (!dateString) return "Unknown Date";
  try {
    // Handle ISO date strings and YYYY-MM-DD format
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // Try parsing as YYYY-MM-DD if direct parsing fails
      const parts = dateString.split("-");
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const parsedDate = new Date(year, month, day);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
        }
      }
      return "Invalid Date";
    }
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Invalid Date";
  }
};

export default function PeriodTable() {
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
  const {
    data: weeklyData,
    isLoading: weeklyLoading,
    isError: weeklyError,
  } = useWeeklyRollupsRange(weeklyParams);
  const {
    data: monthlyData,
    isLoading: monthlyLoading,
    isError: monthlyError,
  } = useMonthlyRollupsRange(monthlyParams);

  const isLoading =
    (periodType === "daily" && dailyLoading) ||
    (periodType === "weekly" && weeklyLoading) ||
    (periodType === "monthly" && monthlyLoading);

  const isError =
    (periodType === "daily" && dailyError) ||
    (periodType === "weekly" && weeklyError) ||
    (periodType === "monthly" && monthlyError);

  if (isLoading)
    return <LoadingState message={`Loading ${periodType} rollups...`} />;
  if (isError)
    return (
      <ErrorState
        variant="card"
        title={`Unable to load ${periodType} rollups`}
        error={
          (periodType === "daily"
            ? dailyError
            : periodType === "weekly"
            ? weeklyError
            : monthlyError) as unknown as Error
        }
      />
    );

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Period Rollup Table</h3>
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
      {((periodType === "daily" && dailyData && dailyData.length > 0) ||
        (periodType === "weekly" && weeklyData && weeklyData.length > 0) ||
        (periodType === "monthly" &&
          monthlyData &&
          monthlyData.length > 0)) && (
        <div className="space-y-4">
          <div className="border rounded-lg overflow-hidden shadow-none w-full">
            <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      {periodType === "daily"
                        ? "Date"
                        : periodType === "weekly"
                        ? "Week"
                        : "Month"}
                    </TableHead>
                    <TableHead className="text-right">Total Cost</TableHead>
                    <TableHead className="text-right">Lambda Cost</TableHead>
                    <TableHead className="text-right">AI Cost</TableHead>
                    <TableHead className="text-right">Renders</TableHead>
                    {periodType === "daily" && (
                      <TableHead className="text-right">Schedulers</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {periodType === "daily" &&
                    dailyData?.map((rollup) => {
                      // Try to get lambda and AI costs from costBreakdown
                      const lambdaCost =
                        rollup.costBreakdown?.global?.lambda ??
                        rollup.costBreakdown?.global?.["lambda"] ??
                        rollup.costBreakdown?.global?.["lambdaCost"] ??
                        null;
                      const aiCost =
                        rollup.costBreakdown?.global?.ai ??
                        rollup.costBreakdown?.global?.["ai"] ??
                        rollup.costBreakdown?.global?.["aiCost"] ??
                        null;
                      return (
                        <TableRow key={rollup.id}>
                          <TableCell className="font-medium">
                            {formatPeriodDate(rollup.date || rollup.periodStart)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(rollup.totalCost)}
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {lambdaCost != null
                              ? formatCurrency(lambdaCost)
                              : "-"}
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {aiCost != null ? formatCurrency(aiCost) : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatNumber(rollup.totalRenders)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatNumber(rollup.totalSchedulers)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {periodType === "weekly" &&
                    weeklyData?.map((rollup) => {
                      const lambdaCost =
                        rollup.costBreakdown?.global?.lambda ??
                        rollup.costBreakdown?.global?.["lambda"] ??
                        rollup.costBreakdown?.global?.["lambdaCost"] ??
                        null;
                      const aiCost =
                        rollup.costBreakdown?.global?.ai ??
                        rollup.costBreakdown?.global?.["ai"] ??
                        rollup.costBreakdown?.global?.["aiCost"] ??
                        null;
                      return (
                        <TableRow key={rollup.id}>
                          <TableCell className="font-medium">
                            {rollup.year} W{rollup.week}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(rollup.totalCost)}
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {lambdaCost != null
                              ? formatCurrency(lambdaCost)
                              : "-"}
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {aiCost != null ? formatCurrency(aiCost) : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatNumber(rollup.totalRenders)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {periodType === "monthly" &&
                    monthlyData?.map((rollup) => {
                      const lambdaCost =
                        rollup.costBreakdown?.global?.lambda ??
                        rollup.costBreakdown?.global?.["lambda"] ??
                        rollup.costBreakdown?.global?.["lambdaCost"] ??
                        null;
                      const aiCost =
                        rollup.costBreakdown?.global?.ai ??
                        rollup.costBreakdown?.global?.["ai"] ??
                        rollup.costBreakdown?.global?.["aiCost"] ??
                        null;
                      const date = new Date(rollup.year, rollup.month - 1);
                      return (
                        <TableRow key={rollup.id}>
                          <TableCell className="font-medium">
                            {date.toLocaleDateString("en-US", {
                              month: "long",
                              year: "numeric",
                            })}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(rollup.totalCost)}
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {lambdaCost != null
                              ? formatCurrency(lambdaCost)
                              : "-"}
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {aiCost != null ? formatCurrency(aiCost) : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatNumber(rollup.totalRenders)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
          </div>

            {/* Summary totals */}
            {(() => {
              const currentData =
                periodType === "daily"
                  ? dailyData
                  : periodType === "weekly"
                  ? weeklyData
                  : monthlyData;
              if (!currentData || currentData.length === 0) return null;
              return (
                <div className="grid grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Total Cost
                    </div>
                    <div className="text-lg font-semibold">
                      {formatCurrency(
                        currentData.reduce(
                          (sum, r) => sum + (r.totalCost ?? 0),
                          0
                        )
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Total Renders
                    </div>
                    <div className="text-lg font-semibold">
                      {formatNumber(
                        currentData.reduce(
                          (sum, r) => sum + (r.totalRenders ?? 0),
                          0
                        )
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Avg Cost
                    </div>
                    <div className="text-lg font-semibold">
                      {formatCurrency(
                        currentData.length > 0
                          ? currentData.reduce(
                              (sum, r) => sum + (r.totalCost ?? 0),
                              0
                            ) / currentData.length
                          : 0
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Periods
                    </div>
                    <div className="text-lg font-semibold">
                      {currentData.length}
                    </div>
                  </div>
                </div>
              );
            })()}
        </div>
      )}
      {((periodType === "daily" && (!dailyData || dailyData.length === 0)) ||
        (periodType === "weekly" &&
          (!weeklyData || weeklyData.length === 0)) ||
        (periodType === "monthly" &&
          (!monthlyData || monthlyData.length === 0))) && (
        <div className="text-sm text-muted-foreground text-center py-8">
          No {periodType} rollup data available
        </div>
      )}
    </div>
  );
}

// Helper function to get week number
function getWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
