"use client";

import { useMemo } from "react";
import { CompetitionTimelineEntry } from "@/types/clubInsights";
import ChartCard from "@/components/modules/charts/ChartCard";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const dateA = new Date(a.month + "-01");
      const dateB = new Date(b.month + "-01");
      return dateA.getTime() - dateB.getTime();
    });
  }, [data]);

  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split("-");
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

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
    <div className="space-y-6">
      <ChartCard
        title="Competition Timeline"
        description="Monthly breakdown of competition activity"
        chartConfig={chartConfig}
        chartClassName="h-[320px]"
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

      <div className="rounded-md border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-4 py-3">
          <h4 className="text-sm font-semibold text-slate-900">
            Monthly Activity
          </h4>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead>Month</TableHead>
              <TableHead className="text-right">Starting</TableHead>
              <TableHead className="text-right">Ending</TableHead>
              <TableHead className="text-right">Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((row) => (
              <TableRow key={row.month}>
                <TableCell className="text-sm font-medium text-slate-900">
                  {formatMonth(row.month)}
                </TableCell>
                <TableCell className="text-right">
                  {row.competitionsStarting.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {row.competitionsEnding.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {row.competitionsActive.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
