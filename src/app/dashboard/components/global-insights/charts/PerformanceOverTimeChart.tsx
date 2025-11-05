"use client";

import { GlobalInsightsData } from "@/types/dataCollection";
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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { Clock, MemoryStick } from "lucide-react";
import { ChartConfig } from "@/components/ui/chart";
import {
  formatDuration,
  formatMemory,
  formatDateShort,
} from "../utils/formatters";

interface PerformanceOverTimeChartProps {
  data: GlobalInsightsData;
}

/**
 * PerformanceOverTimeChart Component
 *
 * Displays performance trends over time with:
 * - Average Time Taken trend line (seconds)
 * - Average Memory Usage trend line (MB)
 * - Max Time Taken trend line
 * - Max Memory Usage trend line
 */
export default function PerformanceOverTimeChart({
  data,
}: PerformanceOverTimeChartProps) {
  const performance = data.timeSeries.performanceOverTime || [];

  // Chart configuration
  const chartConfig = {
    averageTimeTaken: {
      label: "Avg Time (s)",
      color: "hsl(262, 83%, 58%)", // purple-600
    },
    averageMemoryUsage: {
      label: "Avg Memory (MB)",
      color: "hsl(189, 94%, 43%)", // cyan-600
    },
    maxTimeTaken: {
      label: "Max Time (s)",
      color: "hsl(262, 83%, 40%)", // purple-800
    },
    maxMemoryUsage: {
      label: "Max Memory (MB)",
      color: "hsl(189, 94%, 30%)", // cyan-800
    },
  } satisfies ChartConfig;

  // Prepare chart data
  const chartData = performance.map((point) => ({
    date: formatDateShort(point.date),
    averageTimeTaken: point.averageTimeTaken,
    averageMemoryUsage: point.averageMemoryUsage,
    maxTimeTaken: point.maxTimeTaken,
    maxMemoryUsage: point.maxMemoryUsage,
  }));

  // Calculate statistics for display
  const avgTimeTaken =
    performance.length > 0
      ? performance.reduce((sum, point) => sum + point.averageTimeTaken, 0) /
        performance.length
      : 0;
  const avgMemoryUsage =
    performance.length > 0
      ? performance.reduce((sum, point) => sum + point.averageMemoryUsage, 0) /
        performance.length
      : 0;
  const maxTimeTaken =
    performance.length > 0
      ? Math.max(...performance.map((point) => point.maxTimeTaken))
      : 0;
  const maxMemoryUsage =
    performance.length > 0
      ? Math.max(...performance.map((point) => point.maxMemoryUsage))
      : 0;

  if (performance.length === 0) {
    return (
      <Card className="shadow-none bg-slate-50 border rounded-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-500" />
            Performance Over Time
          </CardTitle>
          <CardDescription>
            Performance trends over the last 12 months
          </CardDescription>
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
          Performance trends over the last 12 months (grouped by day)
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
            data={chartData}
            margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
              tickFormatter={(value) => {
                // Format date for display
                try {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                } catch {
                  return value;
                }
              }}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              label={{
                value: "Time (seconds)",
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
                value: "Memory (MB)",
                angle: 90,
                position: "insideRight",
                style: { textAnchor: "middle" },
              }}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number, name: string) => {
                if (name.includes("Time")) {
                  return [
                    formatDuration(value),
                    chartConfig[name as keyof typeof chartConfig]?.label ||
                      name,
                  ];
                }
                if (name.includes("Memory")) {
                  return [
                    formatMemory(value),
                    chartConfig[name as keyof typeof chartConfig]?.label ||
                      name,
                  ];
                }
                return [
                  value,
                  chartConfig[name as keyof typeof chartConfig]?.label || name,
                ];
              }}
              labelFormatter={(label) => {
                try {
                  const date = new Date(label);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                } catch {
                  return label;
                }
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              iconType="line"
              formatter={(value) => {
                return (
                  chartConfig[value as keyof typeof chartConfig]?.label || value
                );
              }}
            />
            {/* Average Time Taken Line */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="averageTimeTaken"
              stroke="hsl(262, 83%, 58%)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            {/* Max Time Taken Line */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="maxTimeTaken"
              stroke="hsl(262, 83%, 40%)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 6 }}
            />
            {/* Average Memory Usage Line */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="averageMemoryUsage"
              stroke="hsl(189, 94%, 43%)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            {/* Max Memory Usage Line */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="maxMemoryUsage"
              stroke="hsl(189, 94%, 30%)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
