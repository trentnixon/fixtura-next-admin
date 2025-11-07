"use client";

import { AccountStatsResponse } from "@/types/dataCollection";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { Badge } from "@/components/ui/badge";
import { Label, H4, SubsectionTitle, ByLine } from "@/components/type/titles";
import { formatDuration, formatMemory } from "@/utils/chart-formatters";
import { Clock, MemoryStick, TrendingUp, TrendingDown } from "lucide-react";

interface PerformanceMetricsCardsProps {
  data: AccountStatsResponse;
}

/**
 * PerformanceMetricsCards Component
 *
 * Displays performance metrics including:
 * - Time Taken metrics (average, median, min, max)
 * - Memory Usage metrics (average, median, min, max)
 * - Visual comparison and trend indicators
 */
export default function PerformanceMetricsCards({
  data,
}: PerformanceMetricsCardsProps) {
  // Get raw time series data and filter out "no data found" runs (timeTaken < 1 minute)
  const rawPerformanceData = data.data.timeSeries.performanceOverTime || [];
  const filteredPerformanceData = rawPerformanceData.filter(
    (point) => point.timeTaken >= 60000 // Filter out runs under 1 minute
  );

  // Recalculate metrics from filtered data
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

  const timeTakenValues = filteredPerformanceData.map((p) => p.timeTaken);
  const memoryUsageValues = filteredPerformanceData.map((p) => p.memoryUsage);

  const timeTaken = calculateMetrics(timeTakenValues);
  const memoryUsage = calculateMetrics(memoryUsageValues);

  // Calculate spread percentage (difference between min and max as percentage of average)
  const calculateSpread = (min: number, max: number, avg: number): number => {
    if (avg === 0) return 0;
    return ((max - min) / avg) * 100;
  };

  const timeSpread = calculateSpread(
    timeTaken.min,
    timeTaken.max,
    timeTaken.average
  );
  const memorySpread = calculateSpread(
    memoryUsage.min,
    memoryUsage.max,
    memoryUsage.average
  );

  // Get color based on spread (higher spread = more variance = yellow/red)
  const getSpreadColor = (spread: number): string => {
    if (spread > 100) return "text-error-600";
    if (spread > 50) return "text-warning-600";
    return "text-success-600";
  };

  const getSpreadBadgeColor = (spread: number): string => {
    if (spread > 100) return "bg-error-500";
    if (spread > 50) return "bg-warning-500";
    return "bg-success-500";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Time Taken Metrics */}
      <ElementContainer variant="dark" border padding="md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-500" />
            <SubsectionTitle className="m-0">
              Time Taken Performance
            </SubsectionTitle>
          </div>
          <Badge
            className={`${getSpreadBadgeColor(
              timeSpread
            )} text-white border-0 rounded-full text-xs`}
          >
            {timeSpread > 100
              ? "High Variance"
              : timeSpread > 50
              ? "Moderate Variance"
              : "Low Variance"}
          </Badge>
        </div>
        <ByLine className="mb-4">
          Collection time metrics across all runs
        </ByLine>

        <div className="space-y-4">
          {/* Average Time */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm m-0">Average</Label>
              <H4 className="text-2xl font-bold m-0 text-purple-600">
                {formatDuration(timeTaken.average, "milliseconds")}
              </H4>
            </div>
          </div>

          {/* Median, Min, Max Grid */}
          <div className="grid grid-cols-3 gap-4 pt-2 border-t">
            <div className="space-y-1">
              <Label className="text-xs m-0">Median</Label>
              <H4 className="text-lg font-semibold m-0">
                {formatDuration(timeTaken.median, "milliseconds")}
              </H4>
            </div>
            <div className="space-y-1">
              <Label className="text-xs m-0">Min</Label>
              <H4 className="text-lg font-semibold m-0 text-success-600">
                {formatDuration(timeTaken.min, "milliseconds")}
              </H4>
            </div>
            <div className="space-y-1">
              <Label className="text-xs m-0">Max</Label>
              <H4 className="text-lg font-semibold m-0 text-error-600">
                {formatDuration(timeTaken.max, "milliseconds")}
              </H4>
            </div>
          </div>

          {/* Spread Indicator */}
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-xs">
              <Label className="text-xs m-0">Variance Spread</Label>
              <div className="flex items-center gap-1">
                {timeSpread > 50 ? (
                  <TrendingUp className="w-3 h-3 text-warning-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-success-500" />
                )}
                <span className={getSpreadColor(timeSpread)}>
                  {timeSpread.toFixed(1)}%
                </span>
              </div>
            </div>
            <ByLine className="text-xs m-0 mt-1">
              Range: {formatDuration(timeTaken.min, "milliseconds")} -{" "}
              {formatDuration(timeTaken.max, "milliseconds")}
            </ByLine>
          </div>
        </div>
      </ElementContainer>

      {/* Memory Usage Metrics */}
      <ElementContainer variant="dark" border padding="md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <MemoryStick className="w-5 h-5 text-cyan-500" />
            <SubsectionTitle className="m-0">
              Memory Usage Performance
            </SubsectionTitle>
          </div>
          <Badge
            className={`${getSpreadBadgeColor(
              memorySpread
            )} text-white border-0 rounded-full text-xs`}
          >
            {memorySpread > 100
              ? "High Variance"
              : memorySpread > 50
              ? "Moderate Variance"
              : "Low Variance"}
          </Badge>
        </div>
        <ByLine className="mb-4">
          Memory consumption metrics across all runs
        </ByLine>

        <div className="space-y-4">
          {/* Average Memory */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm m-0">Average</Label>
              <H4 className="text-2xl font-bold m-0 text-cyan-600">
                {formatMemory(memoryUsage.average, "bytes")}
              </H4>
            </div>
          </div>

          {/* Median, Min, Max Grid */}
          <div className="grid grid-cols-3 gap-4 pt-2 border-t">
            <div className="space-y-1">
              <Label className="text-xs m-0">Median</Label>
              <H4 className="text-lg font-semibold m-0">
                {formatMemory(memoryUsage.median, "bytes")}
              </H4>
            </div>
            <div className="space-y-1">
              <Label className="text-xs m-0">Min</Label>
              <H4 className="text-lg font-semibold m-0 text-success-600">
                {formatMemory(memoryUsage.min, "bytes")}
              </H4>
            </div>
            <div className="space-y-1">
              <Label className="text-xs m-0">Max</Label>
              <H4 className="text-lg font-semibold m-0 text-error-600">
                {formatMemory(memoryUsage.max, "bytes")}
              </H4>
            </div>
          </div>

          {/* Spread Indicator */}
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-xs">
              <Label className="text-xs m-0">Variance Spread</Label>
              <div className="flex items-center gap-1">
                {memorySpread > 50 ? (
                  <TrendingUp className="w-3 h-3 text-warning-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-success-500" />
                )}
                <span className={getSpreadColor(memorySpread)}>
                  {memorySpread.toFixed(1)}%
                </span>
              </div>
            </div>
            <ByLine className="text-xs m-0 mt-1">
              Range: {formatMemory(memoryUsage.min, "bytes")} -{" "}
              {formatMemory(memoryUsage.max, "bytes")}
            </ByLine>
          </div>
        </div>
      </ElementContainer>
    </div>
  );
}
