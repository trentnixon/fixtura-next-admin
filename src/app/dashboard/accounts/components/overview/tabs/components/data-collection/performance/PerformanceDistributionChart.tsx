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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Gauge } from "lucide-react";
import { ChartConfig } from "@/components/ui/chart";

interface PerformanceDistributionChartProps {
  data: AccountStatsResponse;
}

/**
 * PerformanceDistributionChart Component
 *
 * Displays performance distribution visualizations with:
 * - Histogram distribution for Time Taken
 * - Histogram distribution for Memory Usage
 * - Summary statistics overlays (average, median, min, max)
 */
export default function PerformanceDistributionChart({
  data,
}: PerformanceDistributionChartProps) {
  const performanceData = data.data.timeSeries.performanceOverTime || [];
  const performanceMetrics = data.data.performanceMetrics;

  // Helper to format duration
  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    if (ms < 3600000) return `${(ms / 60000).toFixed(1)}m`;
    return `${(ms / 3600000).toFixed(1)}h`;
  };

  // Helper to format memory
  const formatMemory = (bytes: number): string => {
    if (bytes < 1024) return `${Math.round(bytes)}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)}GB`;
  };

  // Create histogram bins for time taken
  const createTimeHistogram = (values: number[], bins: number = 10) => {
    if (values.length === 0) return [];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binWidth = (max - min) / bins;
    const bins_data = Array(bins)
      .fill(0)
      .map((_, i) => ({
        range: `${formatDuration(min + i * binWidth)} - ${formatDuration(
          min + (i + 1) * binWidth
        )}`,
        min: min + i * binWidth,
        max: min + (i + 1) * binWidth,
        count: 0,
      }));

    values.forEach((value) => {
      const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
      bins_data[binIndex].count++;
    });

    return bins_data;
  };

  // Create histogram bins for memory usage
  const createMemoryHistogram = (values: number[], bins: number = 10) => {
    if (values.length === 0) return [];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binWidth = (max - min) / bins;
    const bins_data = Array(bins)
      .fill(0)
      .map((_, i) => ({
        range: `${formatMemory(min + i * binWidth)} - ${formatMemory(
          min + (i + 1) * binWidth
        )}`,
        min: min + i * binWidth,
        max: min + (i + 1) * binWidth,
        count: 0,
      }));

    values.forEach((value) => {
      const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
      bins_data[binIndex].count++;
    });

    return bins_data;
  };

  // Extract values
  const timeTakenValues = performanceData
    .map((p) => p.timeTaken)
    .filter((v) => v > 0);
  const memoryUsageValues = performanceData
    .map((p) => p.memoryUsage)
    .filter((v) => v > 0);

  // Create histograms
  const timeHistogram = createTimeHistogram(timeTakenValues, 10);
  const memoryHistogram = createMemoryHistogram(memoryUsageValues, 10);

  // Chart configurations
  const timeChartConfig = {
    count: {
      label: "Collections",
      color: "hsl(221, 83%, 53%)", // indigo-600
    },
  } satisfies ChartConfig;

  const memoryChartConfig = {
    count: {
      label: "Collections",
      color: "hsl(262, 83%, 58%)", // purple-600
    },
  } satisfies ChartConfig;

  if (timeTakenValues.length === 0 && memoryUsageValues.length === 0) {
    return (
      <Card className="shadow-none bg-slate-50 border rounded-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Gauge className="w-5 h-5 text-indigo-500" />
            Performance Distribution
          </CardTitle>
          <CardDescription>
            Distribution of time taken and memory usage across collections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No performance distribution data available
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate reference lines for time taken
  const timeMetrics = performanceMetrics.timeTaken;
  const timeAverage = timeMetrics.average || 0;
  const timeMedian = timeMetrics.median || 0;
  const timeMin = timeMetrics.min || 0;
  const timeMax = timeMetrics.max || 0;

  // Calculate reference lines for memory usage
  const memoryMetrics = performanceMetrics.memoryUsage;
  const memoryAverage = memoryMetrics.average || 0;
  const memoryMedian = memoryMetrics.median || 0;
  const memoryMin = memoryMetrics.min || 0;
  const memoryMax = memoryMetrics.max || 0;

  return (
    <Card className="shadow-none bg-slate-50 border rounded-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-indigo-500" />
          <CardTitle className="text-lg font-semibold">
            Performance Distribution
          </CardTitle>
        </div>
        <CardDescription>
          Distribution histograms for time taken and memory usage with summary
          statistics
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Time Taken Distribution */}
        {timeTakenValues.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-muted-foreground">
                Time Taken Distribution
              </div>
              <div className="text-xs text-muted-foreground">
                {timeTakenValues.length} collections
              </div>
            </div>

            <ChartContainer
              config={timeChartConfig}
              className="h-[250px] w-full"
            >
              <BarChart
                data={timeHistogram}
                margin={{ top: 5, right: 10, left: 0, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="range"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={11}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  label={{
                    value: "Collections",
                    angle: -90,
                    position: "insideLeft",
                    style: { textAnchor: "middle" },
                  }}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [
                    `${value} collections`,
                    "Count",
                  ]}
                />
                <Bar
                  dataKey="count"
                  fill="hsl(221, 83%, 53%)" // indigo-600
                  barSize={20}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Min</div>
                <div className="text-sm font-semibold">
                  {formatDuration(timeMin)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Average</div>
                <div className="text-sm font-semibold text-emerald-600">
                  {formatDuration(timeAverage)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Median</div>
                <div className="text-sm font-semibold text-orange-600">
                  {formatDuration(timeMedian)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Max</div>
                <div className="text-sm font-semibold">
                  {formatDuration(timeMax)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Memory Usage Distribution */}
        {memoryUsageValues.length > 0 && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-muted-foreground">
                Memory Usage Distribution
              </div>
              <div className="text-xs text-muted-foreground">
                {memoryUsageValues.length} collections
              </div>
            </div>

            <ChartContainer
              config={memoryChartConfig}
              className="h-[250px] w-full"
            >
              <BarChart
                data={memoryHistogram}
                margin={{ top: 5, right: 10, left: 0, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="range"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={11}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  label={{
                    value: "Collections",
                    angle: -90,
                    position: "insideLeft",
                    style: { textAnchor: "middle" },
                  }}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [
                    `${value} collections`,
                    "Count",
                  ]}
                />
                <Bar
                  dataKey="count"
                  fill="hsl(262, 83%, 58%)" // purple-600
                  barSize={20}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Min</div>
                <div className="text-sm font-semibold">
                  {formatMemory(memoryMin)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Average</div>
                <div className="text-sm font-semibold text-emerald-600">
                  {formatMemory(memoryAverage)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Median</div>
                <div className="text-sm font-semibold text-orange-600">
                  {formatMemory(memoryMedian)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Max</div>
                <div className="text-sm font-semibold">
                  {formatMemory(memoryMax)}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
