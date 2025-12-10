"use client";

import { AccountStatsResponse } from "@/types/dataCollection";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { EmptyState } from "@/components/ui-library";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Gauge } from "lucide-react";
import { ChartConfig } from "@/components/ui/chart";
import { Label, H4, SubsectionTitle, ByLine } from "@/components/type/titles";
import { formatDuration, formatMemory } from "@/utils/chart-formatters";

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
  const rawPerformanceData = data.data.timeSeries.performanceOverTime || [];

  // Filter out entries where timeTaken < 1 minute (60000ms) - these indicate "ran but no data found"
  const performanceData = rawPerformanceData.filter(
    (point) => point.timeTaken >= 60000
  );

  // Helper to format duration for histogram ranges (simplified format)
  const formatDurationForRange = (ms: number): string => {
    return formatDuration(ms, "milliseconds");
  };

  // Helper to format memory for histogram ranges (simplified format)
  const formatMemoryForRange = (bytes: number): string => {
    return formatMemory(bytes, "bytes");
  };

  // Create histogram bins for time taken
  const createTimeHistogram = (values: number[], bins: number = 10) => {
    if (values.length === 0) return [];
    const min = Math.min(...values);
    const max = Math.max(...values);
    let binWidth = (max - min) / bins;
    if (binWidth === 0) binWidth = 1;

    const bins_data = Array(bins)
      .fill(0)
      .map((_, i) => ({
        range: `${formatDurationForRange(
          min + i * binWidth
        )} - ${formatDurationForRange(min + (i + 1) * binWidth)}`,
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
    let binWidth = (max - min) / bins;
    if (binWidth === 0) binWidth = 1;

    const bins_data = Array(bins)
      .fill(0)
      .map((_, i) => ({
        range: `${formatMemoryForRange(
          min + i * binWidth
        )} - ${formatMemoryForRange(min + (i + 1) * binWidth)}`,
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

  // Extract values (already filtered for timeTaken >= 60000, but ensure positive values)
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
      <ElementContainer variant="dark" border padding="md">
        <div className="flex items-center gap-2 mb-2">
          <Gauge className="w-5 h-5 text-indigo-500" />
          <SubsectionTitle className="m-0">
            Performance Distribution
          </SubsectionTitle>
        </div>
        <ByLine className="mb-4">
          Distribution of time taken and memory usage across collections
        </ByLine>
        <EmptyState
          title="No performance distribution data available"
          description="No performance distribution data available for this time period."
          variant="minimal"
        />
      </ElementContainer>
    );
  }

  // Recalculate metrics from filtered data (instead of using API-provided metrics)
  const calculateMetrics = (values: number[]) => {
    if (values.length === 0) {
      return { average: 0, median: 0, min: 0, max: 0 };
    }
    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((acc, val) => acc + val, 0);
    const average = sum / values.length;
    const median =
      sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    return { average, median, min, max };
  };

  // Calculate reference lines for time taken (from filtered data)
  const timeMetrics = calculateMetrics(timeTakenValues);
  const timeAverage = timeMetrics.average;
  const timeMedian = timeMetrics.median;
  const timeMin = timeMetrics.min;
  const timeMax = timeMetrics.max;

  // Calculate reference lines for memory usage (from filtered data)
  const memoryMetrics = calculateMetrics(memoryUsageValues);
  const memoryAverage = memoryMetrics.average;
  const memoryMedian = memoryMetrics.median;
  const memoryMin = memoryMetrics.min;
  const memoryMax = memoryMetrics.max;

  return (
    <ElementContainer variant="dark" border padding="md">
      <div className="flex items-center gap-2 mb-2">
        <Gauge className="w-5 h-5 text-indigo-500" />
        <SubsectionTitle className="m-0">
          Performance Distribution
        </SubsectionTitle>
      </div>
      <ByLine className="mb-4">
        Distribution histograms for time taken and memory usage with summary
        statistics
      </ByLine>

      <div className="space-y-8">
        {/* Time Taken Distribution */}
        {timeTakenValues.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm m-0">Time Taken Distribution</Label>
              <ByLine className="text-xs m-0">
                {timeTakenValues.length} collections
              </ByLine>
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
                <Label className="text-xs m-0">Min</Label>
                <H4 className="text-sm font-semibold m-0">
                  {formatDuration(timeMin, "milliseconds")}
                </H4>
              </div>
              <div className="space-y-1">
                <Label className="text-xs m-0">Average</Label>
                <H4 className="text-sm font-semibold m-0 text-success-600">
                  {formatDuration(timeAverage, "milliseconds")}
                </H4>
              </div>
              <div className="space-y-1">
                <Label className="text-xs m-0">Median</Label>
                <H4 className="text-sm font-semibold m-0 text-warning-600">
                  {formatDuration(timeMedian, "milliseconds")}
                </H4>
              </div>
              <div className="space-y-1">
                <Label className="text-xs m-0">Max</Label>
                <H4 className="text-sm font-semibold m-0">
                  {formatDuration(timeMax, "milliseconds")}
                </H4>
              </div>
            </div>
          </div>
        )}

        {/* Memory Usage Distribution */}
        {memoryUsageValues.length > 0 && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label className="text-sm m-0">Memory Usage Distribution</Label>
              <ByLine className="text-xs m-0">
                {memoryUsageValues.length} collections
              </ByLine>
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
                <Label className="text-xs m-0">Min</Label>
                <H4 className="text-sm font-semibold m-0">
                  {formatMemory(memoryMin, "bytes")}
                </H4>
              </div>
              <div className="space-y-1">
                <Label className="text-xs m-0">Average</Label>
                <H4 className="text-sm font-semibold m-0 text-success-600">
                  {formatMemory(memoryAverage, "bytes")}
                </H4>
              </div>
              <div className="space-y-1">
                <Label className="text-xs m-0">Median</Label>
                <H4 className="text-sm font-semibold m-0 text-warning-600">
                  {formatMemory(memoryMedian, "bytes")}
                </H4>
              </div>
              <div className="space-y-1">
                <Label className="text-xs m-0">Max</Label>
                <H4 className="text-sm font-semibold m-0">
                  {formatMemory(memoryMax, "bytes")}
                </H4>
              </div>
            </div>
          </div>
        )}
      </div>
    </ElementContainer>
  );
}
