"use client";

import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DatePatterns } from "@/types/associationInsights";
import ChartCard from "@/components/modules/charts/ChartCard";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { formatNumber } from "@/utils/chart-formatters";
import type { ChartConfig } from "@/components/ui/chart";

/**
 * CompetitionDatePatternsCard Component
 *
 * Displays date patterns and temporal analytics:
 * - Competitions Starting/Ending This Month
 * - Competitions Starting/Ending Next Month
 * - Average Competition Duration (in days)
 * - Earliest Start Date / Latest End Date (with null handling)
 */
interface CompetitionDatePatternsCardProps {
  data: DatePatterns;
}

export default function CompetitionDatePatternsCard({
  data,
}: CompetitionDatePatternsCardProps) {
  // Format date string or return placeholder
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-AU", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Prepare data for temporal patterns chart
  const temporalChartData = useMemo(() => {
    return [
      {
        name: "This Month",
        label: "Starting This Month",
        starting: data.competitionsStartingThisMonth,
        ending: data.competitionsEndingThisMonth,
      },
      {
        name: "Next Month",
        label: "Starting Next Month",
        starting: data.competitionsStartingNextMonth,
        ending: data.competitionsEndingNextMonth,
      },
    ];
  }, [
    data.competitionsStartingThisMonth,
    data.competitionsEndingThisMonth,
    data.competitionsStartingNextMonth,
    data.competitionsEndingNextMonth,
  ]);

  // Create chart config
  const temporalChartConfig: ChartConfig = {
    starting: {
      label: "Starting",
      color: "hsl(var(--chart-1))",
    },
    ending: {
      label: "Ending",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white md:grid-cols-3">
        <Stat
          label="Avg Duration"
          value={`${data.averageCompetitionDurationDays.toFixed(1)} days`}
        />
        <Stat
          label="Earliest Start"
          value={formatDate(data.earliestStartDate)}
        />
        <Stat label="Latest End" value={formatDate(data.latestEndDate)} />
      </div>

      {/* Temporal Patterns Chart */}
      <ChartCard
        title="Competition Timeline"
        description="Monthly breakdown of competition activity"
        chartConfig={temporalChartConfig}
        chartClassName="h-[260px]"
      >
        <LineChart data={temporalChartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatNumber(value)}
          />
          <ChartTooltip
            content={<ChartTooltipContent />}
            formatter={(value: number, name: string) => [
              formatNumber(value),
              temporalChartConfig[name as keyof typeof temporalChartConfig]
                ?.label || name,
            ]}
          />
          <Line
            type="monotone"
            dataKey="starting"
            stroke="var(--color-starting)"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="ending"
            stroke="var(--color-ending)"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
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
              <TableHead>Period</TableHead>
              <TableHead className="text-right">Starting</TableHead>
              <TableHead className="text-right">Ending</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {temporalChartData.map((row) => (
              <TableRow key={row.name}>
                <TableCell className="text-sm font-medium text-slate-900">
                  {row.name}
                </TableCell>
                <TableCell className="text-right">
                  {row.starting.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {row.ending.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-slate-200 px-4 py-3 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
      <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}
