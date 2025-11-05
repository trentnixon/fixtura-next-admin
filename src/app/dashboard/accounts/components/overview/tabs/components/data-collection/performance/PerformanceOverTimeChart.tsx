"use client";

import { AccountStatsResponse } from "@/types/dataCollection";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { Clock, MemoryStick } from "lucide-react";
import { ChartConfig } from "@/components/ui/chart";

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
  const performance = data.data.timeSeries.performanceOverTime || [];

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

  // Format date for display
  const formatDate = (dateString: string): string => {
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

  // Format duration from milliseconds to readable format
  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    const seconds = ms / 1000;
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    const minutes = seconds / 60;
    if (minutes < 60) return `${minutes.toFixed(1)}m`;
    const hours = minutes / 60;
    return `${hours.toFixed(1)}h`;
  };

  // Format memory from bytes to readable format
  const formatMemory = (bytes: number): string => {
    if (bytes < 1024) return `${bytes.toFixed(0)} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    const mb = kb / 1024;
    if (mb < 1024) return `${mb.toFixed(2)} MB`;
    const gb = mb / 1024;
    return `${gb.toFixed(2)} GB`;
  };

  // Calculate statistics for display
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
      <Card className="shadow-none bg-slate-50 border rounded-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-500" />
            Performance Over Time
          </CardTitle>
          <CardDescription>Time taken and memory usage trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No performance data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none bg-slate-50 border rounded-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-500" />
          <CardTitle className="text-lg font-semibold">
            Performance Over Time
          </CardTitle>
        </div>
        <CardDescription>
          Time taken and memory usage performance trends
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Avg Time Taken
            </div>
            <div className="text-lg font-semibold text-purple-600">
              {formatDuration(avgTimeTaken)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Max Time Taken
            </div>
            <div className="text-lg font-semibold text-red-600">
              {formatDuration(maxTimeTaken)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <MemoryStick className="w-3 h-3" />
              Avg Memory Usage
            </div>
            <div className="text-lg font-semibold text-cyan-600">
              {formatMemory(avgMemoryUsage)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <MemoryStick className="w-3 h-3" />
              Max Memory Usage
            </div>
            <div className="text-lg font-semibold text-red-600">
              {formatMemory(maxMemoryUsage)}
            </div>
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
              tickFormatter={formatDate}
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
                  return [formatDuration(value), "Time Taken"];
                }
                if (name === "memoryUsage") {
                  return [formatMemory(value), "Memory Usage"];
                }
                return [value.toString(), name];
              }}
              labelFormatter={(label) => formatDate(label)}
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
      </CardContent>
    </Card>
  );
}
