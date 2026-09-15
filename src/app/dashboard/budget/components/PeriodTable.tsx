"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { CalendarRange, Clapperboard, Cpu, DollarSign } from "lucide-react";
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
import { useWeeklyRollupsRange } from "@/hooks/rollups/useWeeklyRollupsRange";
import { useMonthlyRollupsRange } from "@/hooks/rollups/useMonthlyRollupsRange";
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
} from "@/utils/chart-formatters";
import { formatPeriodDate } from "./_utils/budgetChartHelpers";
import {
  getDailyRollupRangeParams,
  getMonthlyRollupRangeParams,
  getWeeklyRollupRangeParams,
} from "./_utils/budgetRollupRanges";
import { extractGlobalLambdaAi } from "./_utils/extractGlobalCosts";
import { getPeriodDetailUrl } from "./_utils/navigation";
import type { PeakPeriodType } from "./PeakPeriodsChart";

export type RollupTablePeriodType = PeakPeriodType;

interface PeriodTableProps {
  periodType?: RollupTablePeriodType;
  showHeader?: boolean;
}

type PeriodRow = {
  id: number | string;
  label: string;
  periodKey: string;
  sortKey?: number;
  totalCost: number;
  lambda: number | null;
  ai: number | null;
  renders: number;
  schedulers?: number;
  avgDaily?: number;
};

export default function PeriodTable({
  periodType = "daily",
  showHeader = true,
}: PeriodTableProps) {
  const router = useRouter();

  const dailyParams = useMemo(() => getDailyRollupRangeParams(30), []);
  const weeklyParams = useMemo(() => getWeeklyRollupRangeParams(12), []);
  const monthlyParams = useMemo(() => getMonthlyRollupRangeParams(12), []);

  const {
    data: dailyData,
    isLoading: dailyLoading,
    isError: dailyError,
    error: dailyErr,
  } = useDailyRollupsRange(dailyParams);
  const {
    data: weeklyData,
    isLoading: weeklyLoading,
    isError: weeklyError,
    error: weeklyErr,
  } = useWeeklyRollupsRange(weeklyParams);
  const {
    data: monthlyData,
    isLoading: monthlyLoading,
    isError: monthlyError,
    error: monthlyErr,
  } = useMonthlyRollupsRange(monthlyParams);

  const isLoading =
    (periodType === "daily" && dailyLoading) ||
    (periodType === "weekly" && weeklyLoading) ||
    (periodType === "monthly" && monthlyLoading);

  const isError =
    (periodType === "daily" && dailyError) ||
    (periodType === "weekly" && weeklyError) ||
    (periodType === "monthly" && monthlyError);

  const rows: PeriodRow[] = useMemo(() => {
    if (periodType === "daily" && dailyData) {
      return [...dailyData]
        .map((rollup) => {
          const { lambda, ai } = extractGlobalLambdaAi(rollup.costBreakdown);
          const periodKey = rollup.date || rollup.periodStart;
          return {
            id: rollup.id,
            label: formatPeriodDate(periodKey),
            periodKey,
            totalCost: rollup.totalCost ?? 0,
            lambda,
            ai,
            renders: rollup.totalRenders ?? 0,
            schedulers: rollup.totalSchedulers ?? 0,
          };
        })
        .sort(
          (a, b) =>
            new Date(b.periodKey).getTime() - new Date(a.periodKey).getTime(),
        );
    }

    if (periodType === "weekly" && weeklyData) {
      return [...weeklyData]
        .map((rollup) => {
          const { lambda, ai } = extractGlobalLambdaAi(rollup.costBreakdown);
          const periodKey = `${rollup.year}-W${rollup.week}`;
          return {
            id: rollup.id,
            label: `${rollup.year} W${rollup.week}`,
            periodKey,
            sortKey: rollup.year * 100 + rollup.week,
            totalCost: rollup.totalCost ?? 0,
            lambda,
            ai,
            renders: rollup.totalRenders ?? 0,
            avgDaily: rollup.averageDailyCost,
          };
        })
        .sort((a, b) => (b.sortKey ?? 0) - (a.sortKey ?? 0));
    }

    if (periodType === "monthly" && monthlyData) {
      return [...monthlyData]
        .map((rollup) => {
          const { lambda, ai } = extractGlobalLambdaAi(rollup.costBreakdown);
          const periodKey = `${rollup.year}-${String(rollup.month).padStart(2, "0")}`;
          const date = new Date(rollup.year, rollup.month - 1);
          return {
            id: rollup.id,
            label: date.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            }),
            periodKey,
            sortKey: rollup.year * 100 + rollup.month,
            totalCost: rollup.totalCost ?? 0,
            lambda,
            ai,
            renders: rollup.totalRenders ?? 0,
          };
        })
        .sort((a, b) => (b.sortKey ?? 0) - (a.sortKey ?? 0));
    }

    return [];
  }, [periodType, dailyData, weeklyData, monthlyData]);

  const totals = useMemo(() => {
    const totalCost = rows.reduce((sum, r) => sum + r.totalCost, 0);
    const totalRenders = rows.reduce((sum, r) => sum + r.renders, 0);
    const totalLambda = rows.reduce((sum, r) => sum + (r.lambda ?? 0), 0);
    const totalAi = rows.reduce((sum, r) => sum + (r.ai ?? 0), 0);
    const infra = totalLambda + totalAi;
    return {
      totalCost,
      totalRenders,
      totalLambda,
      totalAi,
      aiShare: infra > 0 ? (totalAi / infra) * 100 : 0,
      avgBucket: rows.length > 0 ? totalCost / rows.length : 0,
      avgPerRender: totalRenders > 0 ? totalCost / totalRenders : 0,
    };
  }, [rows]);

  if (isLoading) {
    return (
      <LoadingState variant="minimal" message={`Loading ${periodType} rollups…`} />
    );
  }
  if (isError) {
    const err = (dailyErr || weeklyErr || monthlyErr) as Error;
    return (
      <ErrorState
        variant="minimal"
        title={`Unable to load ${periodType} rollups`}
        error={err}
      />
    );
  }

  if (rows.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No {periodType} rollup data in this library window.
      </p>
    );
  }

  const periodColumn =
    periodType === "daily"
      ? "Date"
      : periodType === "weekly"
        ? "Week"
        : "Month";

  return (
    <div className="space-y-4">
      {showHeader ? (
        <div>
          <h3 className="text-lg font-semibold">Period rollup table</h3>
          <p className="text-sm text-muted-foreground">
            Latest {periodType} buckets from the rollup library — click a row to
            open period detail when available.
          </p>
        </div>
      ) : null}

      <ChartSummaryStats
        layout="inline"
        stats={[
          {
            icon: DollarSign,
            label: "Total cost",
            value: formatCurrency(totals.totalCost),
          },
          {
            icon: Clapperboard,
            label: "Renders",
            value: formatNumber(totals.totalRenders),
          },
          {
            icon: Cpu,
            label: "Lambda / AI",
            value: `${formatCurrency(totals.totalLambda)} / ${formatCurrency(totals.totalAi)}`,
          },
          {
            icon: CalendarRange,
            label: "Avg / render",
            value: formatCurrency(totals.avgPerRender),
          },
          {
            icon: Cpu,
            label: "AI share",
            value: formatPercentage(totals.aiShare),
          },
        ]}
      />

      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{periodColumn}</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Lambda</TableHead>
              <TableHead className="text-right">AI</TableHead>
              <TableHead className="text-right">Renders</TableHead>
              {periodType === "daily" ? (
                <TableHead className="text-right">Schedulers</TableHead>
              ) : null}
              {periodType === "weekly" ? (
                <TableHead className="text-right">Avg / day</TableHead>
              ) : null}
              <TableHead className="text-right">Avg / render</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const avgRender =
                row.renders > 0 ? row.totalCost / row.renders : null;
              return (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() =>
                    router.push(
                      getPeriodDetailUrl(row.periodKey, periodType),
                    )
                  }
                >
                  <TableCell className="font-medium">{row.label}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {formatCurrency(row.totalCost)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-sm">
                    {row.lambda != null ? formatCurrency(row.lambda) : "—"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-sm">
                    {row.ai != null ? formatCurrency(row.ai) : "—"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatNumber(row.renders)}
                  </TableCell>
                  {periodType === "daily" ? (
                    <TableCell className="text-right tabular-nums">
                      {formatNumber(row.schedulers ?? 0)}
                    </TableCell>
                  ) : null}
                  {periodType === "weekly" ? (
                    <TableCell className="text-right tabular-nums text-sm">
                      {row.avgDaily != null
                        ? formatCurrency(row.avgDaily)
                        : "—"}
                    </TableCell>
                  ) : null}
                  <TableCell className="text-right tabular-nums text-sm text-muted-foreground">
                    {avgRender != null ? formatCurrency(avgRender) : "—"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
