"use client";

import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useFixtureInsights } from "@/hooks/fixtures/useFixtureInsights";
import ErrorState from "@/components/ui-library/states/ErrorState";
import ChartCard from "@/components/modules/charts/ChartCard";
import {
  ChartConfig,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, PieChart as PieChartIcon } from "lucide-react";

export function FixturesDistributions() {
  const { data, isLoading, error, refetch } = useFixtureInsights();
  const dayChartConfig: ChartConfig = useMemo(
    () => ({
      value: { label: "Fixtures", color: "hsl(var(--chart-2))" },
    }),
    [],
  );

  const statusChartConfig: ChartConfig = useMemo(
    () => ({
      Upcoming: { label: "Upcoming", color: "hsl(var(--chart-4))" },
      "In Progress": { label: "In Progress", color: "hsl(var(--chart-2))" },
      Finished: { label: "Finished", color: "hsl(var(--chart-1))" },
      Cancelled: { label: "Cancelled", color: "hsl(var(--destructive))" },
    }),
    [],
  );

  const dayOfWeekData = useMemo(() => {
    if (!data?.data?.distributions?.byDayOfWeek) return [];
    const d = data.data.distributions.byDayOfWeek;
    return [
      { name: "Mon", value: d.monday },
      { name: "Tue", value: d.tuesday },
      { name: "Wed", value: d.wednesday },
      { name: "Thu", value: d.thursday },
      { name: "Fri", value: d.friday },
      { name: "Sat", value: d.saturday },
      { name: "Sun", value: d.sunday },
    ];
  }, [data]);

  const statusData = useMemo(() => {
    if (!data?.data?.distributions?.byStatus) return [];
    const s = data.data.distributions.byStatus;
    return [
      { name: "Upcoming", value: s.upcoming, color: "#f59e0b" }, // Amber
      { name: "In Progress", value: s.inProgress, color: "#22c55e" }, // Green
      { name: "Finished", value: s.finished, color: "#64748b" }, // Slate
      { name: "Cancelled", value: s.cancelled, color: "#ef4444" }, // Red
    ].filter((item) => item.value > 0);
  }, [data]);

  if (isLoading) {
    return (
      <>
        <div className="rounded-md border bg-slate-50 p-6">
          <Skeleton className="mb-4 h-5 w-40" />
          <Skeleton className="h-[300px] w-full rounded-md" />
        </div>
        <div className="rounded-md border bg-slate-50 p-6">
          <Skeleton className="mb-4 h-5 w-36" />
          <Skeleton className="h-[300px] w-full rounded-md" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border bg-slate-50 p-6 lg:col-span-2">
        <ErrorState
          error={error}
          title="Failed to load distribution data"
          onRetry={() => refetch()}
          variant="minimal"
        />
      </div>
    );
  }

  return (
    <>
      <ChartCard
        title="Day of Week"
        description="Fixture distribution across the week."
        icon={BarChart3}
        chartConfig={dayChartConfig}
        emptyStateMessage="No day-of-week data available"
      >
        {dayOfWeekData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dayOfWeekData}>
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="value"
                fill="hsl(var(--chart-2))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : null}
      </ChartCard>

      <ChartCard
        title="Status Mix"
        description="Scheduled, live, finished, and cancelled fixtures."
        icon={PieChartIcon}
        chartConfig={statusChartConfig}
        emptyStateMessage="No fixture status data available"
      >
        {statusData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
              <ChartLegend content={<ChartLegendContent nameKey="name" />} />
            </PieChart>
          </ResponsiveContainer>
        ) : null}
      </ChartCard>
    </>
  );
}
