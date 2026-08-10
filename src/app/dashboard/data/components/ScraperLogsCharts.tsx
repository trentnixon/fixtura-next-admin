"use client";

import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import ChartCard from "@/components/modules/charts/ChartCard";
import { formatDateShort } from "@/utils/chart-formatters";
import { formatDuration } from "@/utils/chart-formatters";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { BarChart, Bar } from "recharts";
import type { ListLogsMeta } from "@/types/scraperLogs";
import { TrendingUp, BarChart3, Clock } from "lucide-react";
import { ChartConfig } from "@/components/ui/chart";

function formatBucketLabel(bucket: string): string {
  try {
    return formatDateShort(bucket);
  } catch {
    return bucket;
  }
}

interface ScraperLogsJobsOverTimeChartProps {
  meta: ListLogsMeta;
}

/** Jobs over time: X-axis bucket, Y-axis jobCount. Uses byDay for overview. */
export function ScraperLogsJobsOverTimeChart({
  meta,
}: ScraperLogsJobsOverTimeChartProps) {
  const timeline = meta.timeline;
  const data = timeline.byDay.length > 0 ? timeline.byDay : timeline.byHour;

  const chartConfig = {
    jobCount: {
      label: "Jobs",
      color: "hsl(221, 83%, 53%)",
    },
  } satisfies ChartConfig;

  if (data.length === 0) {
    return (
      <ChartCard
        title="Jobs Over Time"
        description="Scraper job count by bucket"
        icon={TrendingUp}
        chartConfig={chartConfig}
        emptyStateMessage="No timeline data available"
      />
    );
  }

  return (
    <ChartCard
      title="Jobs Over Time"
      description="Scraper job count by bucket"
      icon={TrendingUp}
      chartConfig={chartConfig}
      chartClassName="h-[260px]"
    >
      <LineChart
        data={data}
        margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="bucket"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={formatBucketLabel}
          angle={-45}
          textAnchor="end"
          height={60}
          fontSize={12}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          fontSize={12}
          tickFormatter={(v) => Math.round(v).toString()}
        />
        <ChartTooltip
          content={<ChartTooltipContent />}
          labelFormatter={(label) => formatBucketLabel(label)}
        />
        <Line
          type="monotone"
          dataKey="jobCount"
          stroke="hsl(221, 83%, 53%)"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ChartCard>
  );
}

interface ScraperLogsStatusDistributionChartProps {
  meta: ListLogsMeta;
}

/** Status distribution: bar chart from meta.summary.byStatus */
export function ScraperLogsStatusDistributionChart({
  meta,
}: ScraperLogsStatusDistributionChartProps) {
  const byStatus = meta.summary.byStatus;
  const data = Object.entries(byStatus)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count);

  const chartConfig = Object.fromEntries(
    data.map(({ status }) => [
      status,
      {
        label: status.replace("_", " "),
        color: "hsl(221, 83%, 53%)",
      },
    ])
  ) satisfies ChartConfig;

  if (data.length === 0) {
    return (
      <ChartCard
        title="Status Distribution"
        description="Jobs by status"
        icon={BarChart3}
        chartConfig={{ count: { label: "Count", color: "hsl(221, 83%, 53%)" } }}
        emptyStateMessage="No status data available"
      />
    );
  }

  return (
    <ChartCard
      title="Status Distribution"
      description="Jobs by status"
      icon={BarChart3}
      chartConfig={chartConfig}
      chartClassName="h-[260px]"
    >
      <BarChart
        data={data}
        margin={{ top: 5, right: 10, left: 0, bottom: 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="status"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(v) => String(v).replace("_", " ")}
          angle={-45}
          textAnchor="end"
          height={60}
          fontSize={12}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          fontSize={12}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="count"
          fill="hsl(221, 83%, 53%)"
          barSize={30}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartCard>
  );
}

interface ScraperLogsDurationOverTimeChartProps {
  meta: ListLogsMeta;
}

/** Duration over time: X-axis bucket, Y-axis totalDurationMs */
export function ScraperLogsDurationOverTimeChart({
  meta,
}: ScraperLogsDurationOverTimeChartProps) {
  const data = meta.timeline.byHour;

  const chartConfig = {
    totalDurationMs: {
      label: "Duration (ms)",
      color: "hsl(142, 76%, 36%)",
    },
  } satisfies ChartConfig;

  if (data.length === 0) {
    return (
      <ChartCard
        title="Duration Over Time"
        description="Total duration by hour"
        icon={Clock}
        chartConfig={chartConfig}
        emptyStateMessage="No duration data available"
      />
    );
  }

  return (
    <ChartCard
      title="Duration Over Time"
      description="Total duration by hour"
      icon={Clock}
      chartConfig={chartConfig}
      chartClassName="h-[260px]"
    >
      <LineChart
        data={data}
        margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="bucket"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={formatBucketLabel}
          angle={-45}
          textAnchor="end"
          height={60}
          fontSize={12}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          fontSize={12}
          tickFormatter={(v) => formatDuration(v)}
        />
        <ChartTooltip
          content={<ChartTooltipContent />}
          formatter={(value: number) => [
            formatDuration(value),
            "Total Duration",
          ]}
          labelFormatter={(label) => formatBucketLabel(label)}
        />
        <Line
          type="monotone"
          dataKey="totalDurationMs"
          stroke="hsl(142, 76%, 36%)"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ChartCard>
  );
}
