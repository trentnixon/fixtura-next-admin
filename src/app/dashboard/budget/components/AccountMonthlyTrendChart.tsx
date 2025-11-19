"use client";

import { useMemo } from "react";
import { useAccountMonthlyRollupsRange } from "@/hooks/rollups/useAccountMonthlyRollupsRange";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import BarChartComponent from "@/components/modules/charts/BarChartComponent";
import { formatCurrency } from "./_utils/formatCurrency";
import type { ChartConfig } from "@/components/ui/chart";

interface AccountMonthlyTrendChartProps {
  accountId: number;
}

export default function AccountMonthlyTrendChart({
  accountId,
}: AccountMonthlyTrendChartProps) {
  // Default to last 12 months
  const now = new Date();
  const startYear = now.getFullYear();
  const startMonth = now.getMonth() - 11; // 12 months ago
  const endYear = now.getFullYear();
  const endMonth = now.getMonth() + 1; // Current month

  // Adjust for year rollover
  const adjustedStartYear = startMonth < 0 ? startYear - 1 : startYear;
  const adjustedStartMonth = startMonth < 0 ? startMonth + 12 : startMonth + 1;

  const { data, isLoading, isError, error } = useAccountMonthlyRollupsRange(
    accountId,
    {
      startYear: adjustedStartYear,
      startMonth: adjustedStartMonth,
      endYear,
      endMonth,
      limit: 12,
    }
  );

  // Transform data for chart
  const chartData = useMemo(() => {
    if (!data) return [];
    return data.map((rollup) => ({
      month: `${rollup.year}-${String(rollup.month).padStart(2, "0")}`,
      cost: rollup.totalCost ?? 0,
      renders: rollup.totalRenders ?? 0,
    }));
  }, [data]);

  const chartConfig = {
    cost: {
      label: "Cost",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card className="bg-white border shadow-none">
      <CardHeader className="p-4">
        <CardTitle>Account Monthly Trend</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading && <LoadingState message="Loading monthly trend..." />}
        {isError && (
          <ErrorState
            variant="card"
            title="Unable to load monthly trend"
            error={error as Error}
          />
        )}
        {data && chartData.length > 0 && (
          <div className="space-y-4">
            <BarChartComponent
              data={chartData}
              xAxisKey="month"
              barKey="cost"
              barColor="hsl(var(--chart-1))"
              config={chartConfig}
              height={300}
            />
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <Stat
                label="Total Cost (12 months)"
                value={formatCurrency(
                  chartData.reduce((sum, d) => sum + d.cost, 0)
                )}
              />
              <Stat
                label="Total Renders (12 months)"
                value={chartData
                  .reduce((sum, d) => sum + d.renders, 0)
                  .toLocaleString()}
              />
            </div>
          </div>
        )}
        {data && chartData.length === 0 && (
          <div className="text-sm text-muted-foreground text-center py-8">
            No monthly data available for this account
          </div>
        )}
        {!data && !isLoading && !isError && (
          <div className="text-sm text-muted-foreground text-center py-8">
            No data available for this account
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-lg font-semibold">{value}</span>
    </div>
  );
}
