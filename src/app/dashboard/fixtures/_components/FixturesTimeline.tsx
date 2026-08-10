"use client";

import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useFixtureInsights } from "@/hooks/fixtures/useFixtureInsights";
import ErrorState from "@/components/ui-library/states/ErrorState";
import ChartCard from "@/components/modules/charts/ChartCard";
import {
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { format, parseISO } from "date-fns";
import { Activity } from "lucide-react";

export function FixturesTimeline() {
  const { data, isLoading, error, refetch } = useFixtureInsights();
  const chartConfig: ChartConfig = useMemo(
    () => ({
      finished: { label: "Finished", color: "hsl(var(--chart-1))" },
      upcoming: { label: "Upcoming", color: "hsl(var(--chart-4))" },
    }),
    [],
  );

  const chartData = useMemo(() => {
    if (!data?.data?.charts?.fixtureTimeline) return [];

    return data.data.charts.fixtureTimeline.map((item) => ({
      date: item.date,
      formattedDate: format(parseISO(item.date), "MMM d"),
      total: item.fixtureCount,
      upcoming: item.statusBreakdown.upcoming,
      finished: item.statusBreakdown.finished,
      inProgress: item.statusBreakdown.inProgress,
    }));
  }, [data]);

  if (isLoading) {
    return (
      <div className="rounded-md border bg-slate-50 p-6 lg:col-span-2">
        <Skeleton className="mb-4 h-5 w-40" />
        <Skeleton className="h-[300px] w-full rounded-md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border bg-slate-50 p-6 lg:col-span-2">
        <ErrorState
          error={error}
          title="Failed to load timeline data"
          onRetry={() => refetch()}
          variant="minimal"
        />
      </div>
    );
  }

  return (
    <ChartCard
      title="Fixture Timeline"
      description="Daily fixture volume (Upcoming vs Finished)"
      icon={Activity}
      chartConfig={chartConfig}
      cardClassName="lg:col-span-2"
      emptyStateMessage="No fixture timeline data available"
    >
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorUpcoming" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorFinished" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#64748b" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />
            <XAxis
              dataKey="formattedDate"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              minTickGap={30}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="finished"
              name="Finished"
              stroke="#64748b"
              fillOpacity={1}
              fill="url(#colorFinished)"
              stackId="1"
            />
            <Area
              type="monotone"
              dataKey="upcoming"
              name="Upcoming"
              stroke="#f59e0b"
              fillOpacity={1}
              fill="url(#colorUpcoming)"
              stackId="1"
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : null}
    </ChartCard>
  );
}
