"use client";

import { useMemo, useState } from "react";
import { useDailyRollupsRange } from "@/hooks/rollups/useDailyRollupsRange";
import { useWeeklyRollupsRange } from "@/hooks/rollups/useWeeklyRollupsRange";
import { useMonthlyRollupsRange } from "@/hooks/rollups/useMonthlyRollupsRange";
import ChartCard, {
  ChartSummaryStat,
} from "@/components/modules/charts/ChartCard";
import {
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { formatCurrency } from "@/utils/chart-formatters";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { TrendingUp, DollarSign, Calendar } from "lucide-react";

type PeriodType = "daily" | "weekly" | "monthly";

export default function PeakPeriodsChart() {
  const [periodType, setPeriodType] = useState<PeriodType>("daily");

  // Calculate date ranges for last 90 days, 12 weeks, or 12 months
  const dailyParams = useMemo(() => {
    const end = new Date();
    const start = new Date(end);
    start.setDate(end.getDate() - 89); // Last 90 days
    return {
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
      limit: 90,
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

  const error =
    periodType === "daily"
      ? (dailyError as unknown as Error | null)
      : periodType === "weekly"
      ? (weeklyError as unknown as Error | null)
      : (monthlyError as unknown as Error | null);

  // Chart configuration
  const chartConfig = {
    cost: {
      label: "Cost",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  // Helper to format date safely
  const formatDate = (dateString: string | undefined | null): string => {
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
            const formatted = parsedDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            return formatted.replace(",", "");
          }
        }
        return "Invalid Date";
      }
      const formatted = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return formatted.replace(",", ""); // "Nov 3 2025"
    } catch {
      return "Invalid Date";
    }
  };

  // Helper to format month/year safely
  const formatMonthYear = (year: number, month: number): string => {
    try {
      const date = new Date(year, month - 1);
      if (isNaN(date.getTime())) {
        return `${year}-${month}`; // Fallback format
      }
      const formatted = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      return formatted.replace(",", ""); // "Nov 2025"
    } catch {
      return `${year}-${month}`; // Fallback format
    }
  };

  // Transform and sort data to get top 10 peak periods
  const peakData = useMemo(() => {
    let data: Array<{ period: string; cost: number; renders: number }> = [];

    if (periodType === "daily" && dailyData) {
      data = dailyData
        .map((rollup) => {
          // Try date first, then periodStart as fallback
          const dateStr = rollup.date || rollup.periodStart;
          const period = formatDate(dateStr);
          return {
            period,
            cost: rollup.totalCost ?? 0,
            renders: rollup.totalRenders ?? 0,
          };
        })
        .filter(
          (item) =>
            item.period !== "Invalid Date" && item.period !== "Unknown Date"
        )
        .sort((a, b) => b.cost - a.cost)
        .slice(0, 10);
    } else if (periodType === "weekly" && weeklyData) {
      data = weeklyData
        .map((rollup) => ({
          period: `${rollup.year} W${rollup.week}`,
          cost: rollup.totalCost ?? 0,
          renders: rollup.totalRenders ?? 0,
        }))
        .sort((a, b) => b.cost - a.cost)
        .slice(0, 10);
    } else if (periodType === "monthly" && monthlyData) {
      data = monthlyData
        .map((rollup) => {
          const period =
            rollup.year && rollup.month
              ? formatMonthYear(rollup.year, rollup.month)
              : "Unknown Period";
          return {
            period,
            cost: rollup.totalCost ?? 0,
            renders: rollup.totalRenders ?? 0,
          };
        })
        .filter((item) => item.period !== "Unknown Period")
        .sort((a, b) => b.cost - a.cost)
        .slice(0, 10);
    }

    return data;
  }, [periodType, dailyData, weeklyData, monthlyData]);

  // Summary stats for ChartCard
  const summaryStats: ChartSummaryStat[] = useMemo(() => {
    if (peakData.length === 0) return [];
    const total = peakData.reduce((sum, p) => sum + p.cost, 0);
    const average = peakData.length > 0 ? total / peakData.length : 0;
    return [
      {
        icon: Calendar,
        label: "Peak Period",
        value: peakData[0]?.period || "N/A",
      },
      {
        icon: DollarSign,
        label: "Total (Top 10)",
        value: formatCurrency(total),
      },
      {
        icon: TrendingUp,
        label: "Avg (Top 10)",
        value: formatCurrency(average),
      },
    ];
  }, [peakData]);

  if (isLoading)
    return <LoadingState message={`Loading peak ${periodType} periods...`} />;
  if (isError && error)
    return (
      <ErrorState
        variant="card"
        title={`Unable to load peak ${periodType} periods`}
        error={error as unknown as Error}
      />
    );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Peak Periods (Top 10)</h3>
          <p className="text-sm text-muted-foreground">
            Top 10 peak periods by cost ({periodType})
          </p>
        </div>
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
      <ChartCard
        title=""
        description=""
        chartConfig={chartConfig}
        summaryStats={summaryStats}
        chartClassName="h-[350px]"
        emptyStateMessage={`No ${periodType} data available for peak periods`}
      >
        {peakData.length > 0 ? (
          <BarChart data={peakData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <YAxis
              dataKey="period"
              type="category"
              width={100}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload[0]) return null;
                const data = payload[0].payload as {
                  period: string;
                  cost: number;
                  renders: number;
                };
                return (
                  <div className="relative">
                    <ChartTooltipContent
                      active={active}
                      payload={payload}
                      label={data.period}
                      formatter={(value) => [
                        formatCurrency(value as number),
                        "Cost",
                      ]}
                    />
                    <div className="absolute -bottom-8 left-0 right-0 flex justify-center">
                      <div className="text-xs text-muted-foreground bg-background px-2 py-1 rounded border">
                        Renders: {data.renders.toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="cost"
              fill="var(--color-cost)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        ) : null}
      </ChartCard>
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
