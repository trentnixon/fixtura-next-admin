"use client";

import { useMemo } from "react";
import { CompetitionTimelineEntry } from "@/types/clubInsights";
import ChartCard from "@/components/modules/charts/ChartCard";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  ComposedChart,
  Area,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { formatNumber } from "@/utils/chart-formatters";
import type { ChartConfig } from "@/components/ui/chart";

/**
 * CompetitionTimelineCard Component
 *
 * Displays monthly breakdown of competition activity:
 * - Competitions starting per month
 * - Competitions ending per month
 * - Competitions active per month
 */
interface CompetitionTimelineCardProps {
  data: CompetitionTimelineEntry[];
}

export default function CompetitionTimelineCard({
  data,
}: CompetitionTimelineCardProps) {
  // Sort data chronologically by month
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const dateA = new Date(a.month + "-01");
      const dateB = new Date(b.month + "-01");
      return dateA.getTime() - dateB.getTime();
    });
  }, [data]);

  // Format month for display (e.g., "2024-09" -> "Sep 2024")
  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split("-");
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  // Create chart config
  const chartConfig: ChartConfig = {
    competitionsActive: {
      label: "Active Competitions",
      color: "hsl(var(--chart-1))",
    },
    competitionsStarting: {
      label: "Starting",
      color: "hsl(var(--chart-2))",
    },
    competitionsEnding: {
      label: "Ending",
      color: "hsl(var(--chart-3))",
    },
  };

  if (sortedData.length === 0) {
    return (
      <ChartCard
        title="Competition Timeline"
        description="Monthly breakdown of competition activity"
        chartConfig={chartConfig}
        chartClassName="h-[300px]"
        emptyStateMessage="No competition timeline data available"
      >
        <div className="flex items-center justify-center h-full text-muted-foreground">
          No data available
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard
      title="Competition Timeline"
      description="Monthly breakdown of competition activity"
      chartConfig={chartConfig}
      chartClassName="h-[400px]"
    >
      <ComposedChart data={sortedData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          minTickGap={32}
          tickFormatter={formatMonth}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => formatNumber(value)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
          labelFormatter={(value) => formatMonth(value as string)}
        />
        <Area
          dataKey="competitionsActive"
          type="monotone"
          fill="var(--color-competitionsActive)"
          fillOpacity={0.4}
          stroke="var(--color-competitionsActive)"
          strokeWidth={2}
        />
        <Bar
          dataKey="competitionsStarting"
          fill="var(--color-competitionsStarting)"
          radius={[4, 4, 0, 0]}
          barSize={8}
        />
        <Bar
          dataKey="competitionsEnding"
          fill="var(--color-competitionsEnding)"
          radius={[4, 4, 0, 0]}
          barSize={8}
        />
      </ComposedChart>
    </ChartCard>
  );
}
