"use client";

import { AccountStatsResponse } from "@/types/dataCollection";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  const performance = data.data.performanceMetrics;
  const { timeTaken, memoryUsage } = performance;

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
    if (spread > 100) return "text-red-600";
    if (spread > 50) return "text-yellow-600";
    return "text-emerald-600";
  };

  const getSpreadBadgeVariant = (
    spread: number
  ): "default" | "secondary" | "destructive" | "outline" => {
    if (spread > 100) return "destructive";
    if (spread > 50) return "secondary";
    return "default";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Time Taken Metrics */}
      <Card className="shadow-none bg-slate-50 border rounded-md">
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
              <div className="text-lg font-semibold text-emerald-600">
                {formatDuration(timeTaken.min)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Max</div>
              <div className="text-lg font-semibold text-red-600">
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
                  <TrendingUp className="w-3 h-3 text-yellow-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-emerald-500" />
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
      <Card className="shadow-none bg-slate-50 border rounded-md">
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
              <div className="text-lg font-semibold text-emerald-600">
                {formatMemory(memoryUsage.min)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Max</div>
              <div className="text-lg font-semibold text-red-600">
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
                  <TrendingUp className="w-3 h-3 text-yellow-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-emerald-500" />
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
    </div>
  );
}
