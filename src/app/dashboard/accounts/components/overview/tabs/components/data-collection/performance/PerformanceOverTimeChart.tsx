"use client";

import { AccountStatsResponse } from "@/types/dataCollection";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { EmptyState } from "@/components/ui-library";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { Clock, MemoryStick } from "lucide-react";
import { ChartConfig } from "@/components/ui/chart";
import { Label, H4, SubsectionTitle, ByLine } from "@/components/type/titles";
import { formatDuration, formatMemory } from "@/utils/chart-formatters";

interface PerformanceOverTimeChartProps {
  data: AccountStatsResponse;
}

/**
 * PerformanceOverTimeChart Component
 *
 * Displays performance trends over time with:
 * - Time Taken trend line (milliseconds, formatted as duration)
 * - Memory Usage trend line (bytes, formatted as memory)
 * - Dual-axis chart for proper visualization
 */
export default function PerformanceOverTimeChart({
  data,
}: PerformanceOverTimeChartProps) {
  const rawPerformance = data.data.timeSeries.performanceOverTime || [];

  // Filter out entries where timeTaken < 1 minute (60000ms) - these indicate "ran but no data found"
  const performance = rawPerformance.filter(
    (point) => point.timeTaken >= 60000
  );

  // Chart configuration
  const chartConfig = {
    timeTaken: {
      label: "Time Taken",
      color: "hsl(262, 83%, 58%)", // purple-600
    },
    memoryUsage: {
      label: "Memory Usage",
      color: "hsl(189, 94%, 43%)", // cyan-600
    },
  } satisfies ChartConfig;

  // Format date for chart display
  const formatChartDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Calculate statistics for display (using filtered data)
  const avgTimeTaken =
    performance.length > 0
      ? performance.reduce((sum, point) => sum + point.timeTaken, 0) /
        performance.length
      : 0;
  const avgMemoryUsage =
    performance.length > 0
      ? performance.reduce((sum, point) => sum + point.memoryUsage, 0) /
        performance.length
      : 0;
  const maxTimeTaken =
    performance.length > 0
      ? Math.max(...performance.map((point) => point.timeTaken))
      : 0;
  const maxMemoryUsage =
    performance.length > 0
      ? Math.max(...performance.map((point) => point.memoryUsage))
      : 0;

  if (performance.length === 0) {
    return (
      <ElementContainer variant="dark" border padding="md">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-purple-500" />
          <SubsectionTitle className="m-0">
            Performance Over Time
          </SubsectionTitle>
        </div>
        <ByLine className="mb-4">Time taken and memory usage trends</ByLine>
        <EmptyState
          title="No performance data available"
          description="No performance data available for this time period."
          variant="minimal"
        />
      </ElementContainer>
    );
  }

  return (
    <ElementContainer variant="dark" border padding="md">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-5 h-5 text-purple-500" />
        <SubsectionTitle className="m-0">Performance Over Time</SubsectionTitle>
      </div>
      <ByLine className="mb-4">
        Time taken and memory usage performance trends
      </ByLine>

      <div className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b">
          <div className="space-y-1">
            <Label className="text-xs m-0 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Avg Time Taken
            </Label>
            <H4 className="text-lg font-semibold m-0 text-purple-600">
              {formatDuration(avgTimeTaken, "milliseconds")}
            </H4>
          </div>
          <div className="space-y-1">
            <Label className="text-xs m-0 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Max Time Taken
            </Label>
            <H4 className="text-lg font-semibold m-0 text-error-600">
              {formatDuration(maxTimeTaken, "milliseconds")}
            </H4>
          </div>
          <div className="space-y-1">
            <Label className="text-xs m-0 flex items-center gap-1">
              <MemoryStick className="w-3 h-3" />
              Avg Memory Usage
            </Label>
            <H4 className="text-lg font-semibold m-0 text-cyan-600">
              {formatMemory(avgMemoryUsage, "bytes")}
            </H4>
          </div>
          <div className="space-y-1">
            <Label className="text-xs m-0 flex items-center gap-1">
              <MemoryStick className="w-3 h-3" />
              Max Memory Usage
            </Label>
            <H4 className="text-lg font-semibold m-0 text-error-600">
              {formatMemory(maxMemoryUsage, "bytes")}
            </H4>
          </div>
        </div>

        {/* Chart */}
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart
            data={performance}
            margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={formatChartDate}
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              label={{
                value: "Time Taken",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle" },
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              label={{
                value: "Memory Usage",
                angle: 90,
                position: "insideRight",
                style: { textAnchor: "middle" },
              }}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number, name: string) => {
                if (name === "timeTaken") {
                  return [formatDuration(value, "milliseconds"), "Time Taken"];
                }
                if (name === "memoryUsage") {
                  return [formatMemory(value, "bytes"), "Memory Usage"];
                }
                return [value.toString(), name];
              }}
              labelFormatter={(label) => formatChartDate(label)}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="timeTaken"
              stroke="hsl(262, 83%, 58%)" // purple-600
              strokeWidth={2}
              dot={{ fill: "hsl(262, 83%, 58%)", strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="memoryUsage"
              stroke="hsl(189, 94%, 43%)" // cyan-600
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: "hsl(189, 94%, 43%)", strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ChartContainer>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-purple-600" />
            <span>Time Taken</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-cyan-600 border-dashed border border-cyan-600" />
            <span>Memory Usage</span>
          </div>
        </div>
      </div>
    </ElementContainer>
  );
}
