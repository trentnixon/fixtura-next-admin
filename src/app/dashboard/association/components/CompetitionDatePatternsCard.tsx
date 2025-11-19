"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
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
      {/* Summary Stats Card */}
      <Card className="bg-white border shadow-none">
        <CardHeader className="p-4">
          <CardTitle>Competition Date Patterns</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-6">
          {/* Average Duration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
              <span className="text-sm font-medium">Average Competition Duration</span>
              <span className="text-lg font-semibold">
                {data.averageCompetitionDurationDays.toFixed(1)} days
              </span>
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Date Range</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Earliest Start Date</TableCell>
                  <TableCell className="text-right">
                    {formatDate(data.earliestStartDate)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Latest End Date</TableCell>
                  <TableCell className="text-right">
                    {formatDate(data.latestEndDate)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Temporal Patterns Chart */}
      <ChartCard
        title="Competitions Starting & Ending"
        description="Number of competitions starting and ending this month and next month"
        chartConfig={temporalChartConfig}
        chartClassName="h-[300px]"
      >
        <BarChart data={temporalChartData}>
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
          <Bar
            dataKey="starting"
            fill="var(--color-starting)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="ending"
            fill="var(--color-ending)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartCard>
    </div>
  );
}
