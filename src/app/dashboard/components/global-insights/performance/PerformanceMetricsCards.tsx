"use client";

import { GlobalInsightsData } from "@/types/dataCollection";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MemoryStick, TrendingUp, TrendingDown } from "lucide-react";
import { formatDuration, formatMemory } from "../utils/formatters";
import MetricGrid from "@/components/ui-library/metrics/MetricGrid";

interface PerformanceMetricsCardsProps {
  data: GlobalInsightsData;
}

/**
 * PerformanceMetricsCards Component
 *
 * Displays performance metrics including:
 * - Time Taken metrics (average, median, min, max)
 * - Memory Usage metrics (average, median, min, max)
 * - Visual comparison and variance indicators
 */
export default function PerformanceMetricsCards({
  data,
}: PerformanceMetricsCardsProps) {
  const performance = data.performanceMetrics;
  const { timeTaken, memoryUsage } = performance;

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

  const getSpreadBadgeVariant = (
    spread: number
  ): "default" | "secondary" | "destructive" | "outline" => {
    if (spread > 100) return "destructive";
    if (spread > 50) return "secondary";
    return "default";
  };

  return (
    <MetricGrid columns={2} gap="lg">
      {/* Time Taken Metrics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-500" />
              <CardTitle className="text-lg font-semibold">
                Time Taken Performance
              </CardTitle>
            </div>
            <Badge
              variant={getSpreadBadgeVariant(timeSpread)}
              className="text-xs"
            >
              {timeSpread > 100
                ? "High Variance"
                : timeSpread > 50
                ? "Moderate Variance"
                : "Low Variance"}
            </Badge>
          </div>
          <CardDescription>
            Collection time metrics across all runs
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Average Time */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Average
              </span>
              <span className="text-2xl font-bold text-purple-600">
                {formatDuration(timeTaken.average)}
              </span>
            </div>
          </div>

          {/* Median, Min, Max Grid */}
          <div className="grid grid-cols-3 gap-4 pt-2 border-t">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Median</div>
              <div className="text-lg font-semibold">
                {formatDuration(timeTaken.median)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Min</div>
              <div className="text-lg font-semibold text-success-500">
                {formatDuration(timeTaken.min)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Max</div>
              <div className="text-lg font-semibold text-error-500">
                {formatDuration(timeTaken.max)}
              </div>
            </div>
          </div>

          {/* Spread Indicator */}
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Variance Spread</span>
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
            <div className="text-xs text-muted-foreground mt-1">
              Range: {formatDuration(timeTaken.min)} -{" "}
              {formatDuration(timeTaken.max)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Memory Usage Metrics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MemoryStick className="w-5 h-5 text-cyan-500" />
              <CardTitle className="text-lg font-semibold">
                Memory Usage Performance
              </CardTitle>
            </div>
            <Badge
              variant={getSpreadBadgeVariant(memorySpread)}
              className="text-xs"
            >
              {memorySpread > 100
                ? "High Variance"
                : memorySpread > 50
                ? "Moderate Variance"
                : "Low Variance"}
            </Badge>
          </div>
          <CardDescription>
            Memory consumption metrics across all runs
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Average Memory */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Average
              </span>
              <span className="text-2xl font-bold text-cyan-600">
                {formatMemory(memoryUsage.average)}
              </span>
            </div>
          </div>

          {/* Median, Min, Max Grid */}
          <div className="grid grid-cols-3 gap-4 pt-2 border-t">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Median</div>
              <div className="text-lg font-semibold">
                {formatMemory(memoryUsage.median)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Min</div>
              <div className="text-lg font-semibold text-success-500">
                {formatMemory(memoryUsage.min)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Max</div>
              <div className="text-lg font-semibold text-error-500">
                {formatMemory(memoryUsage.max)}
              </div>
            </div>
          </div>

          {/* Spread Indicator */}
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Variance Spread</span>
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
            <div className="text-xs text-muted-foreground mt-1">
              Range: {formatMemory(memoryUsage.min)} -{" "}
              {formatMemory(memoryUsage.max)}
            </div>
          </div>
        </CardContent>
      </Card>
    </MetricGrid>
  );
}
