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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { AlertTriangle } from "lucide-react";
import { ChartConfig } from "@/components/ui/chart";

interface ErrorRateByEntityChartProps {
  data: AccountStatsResponse;
}

/**
 * ErrorRateByEntityChart Component
 *
 * Displays error rate comparison across entity types with:
 * - Bar chart comparing error rates for competitions, teams, and games
 * - Color-coded bars based on error severity
 * - Visual comparison of error rates by entity type
 */
export default function ErrorRateByEntityChart({
  data,
}: ErrorRateByEntityChartProps) {
  const errorAnalysis = data.data.errorAnalysis;
  const errorRates = errorAnalysis.errorRateByEntityType;

  // Prepare chart data
  const chartData = [
    {
      entity: "Competitions",
      errorRate: errorRates.competitions || 0,
      formattedRate: ((errorRates.competitions || 0) * 100).toFixed(1),
    },
    {
      entity: "Teams",
      errorRate: errorRates.teams || 0,
      formattedRate: ((errorRates.teams || 0) * 100).toFixed(1),
    },
    {
      entity: "Games",
      errorRate: errorRates.games || 0,
      formattedRate: ((errorRates.games || 0) * 100).toFixed(1),
    },
  ];

  // Chart configuration
  const chartConfig = {
    errorRate: {
      label: "Error Rate",
      color: "hsl(0, 84%, 60%)", // red-500
    },
  } satisfies ChartConfig;

  // Get color based on error rate severity
  const getBarColor = (errorRate: number): string => {
    if (errorRate >= 0.2) return "hsl(0, 84%, 60%)"; // red-500 - critical
    if (errorRate >= 0.1) return "hsl(24, 95%, 53%)"; // orange-600 - high
    if (errorRate >= 0.05) return "hsl(48, 96%, 53%)"; // yellow-500 - medium
    return "hsl(142, 76%, 36%)"; // emerald-600 - low
  };

  // Get severity level
  const getSeverityLevel = (errorRate: number): string => {
    if (errorRate >= 0.2) return "Critical";
    if (errorRate >= 0.1) return "High";
    if (errorRate >= 0.05) return "Medium";
    return "Low";
  };

  // Calculate statistics
  const maxErrorRate = Math.max(
    errorRates.competitions || 0,
    errorRates.teams || 0,
    errorRates.games || 0
  );
  const minErrorRate = Math.min(
    errorRates.competitions || 0,
    errorRates.teams || 0,
    errorRates.games || 0
  );
  const averageErrorRate =
    ((errorRates.competitions || 0) +
      (errorRates.teams || 0) +
      (errorRates.games || 0)) /
    3;

  // Find entity with highest error rate
  const highestErrorEntity = chartData.reduce((max, item) =>
    item.errorRate > max.errorRate ? item : max
  );

  if (
    (errorRates.competitions || 0) === 0 &&
    (errorRates.teams || 0) === 0 &&
    (errorRates.games || 0) === 0
  ) {
    return (
      <Card className="shadow-none bg-slate-50 border rounded-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Error Rate by Entity Type
          </CardTitle>
          <CardDescription>
            Error rate comparison across competitions, teams, and games
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No error data available for entity types
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none bg-slate-50 border rounded-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <CardTitle className="text-lg font-semibold">
            Error Rate by Entity Type
          </CardTitle>
        </div>
        <CardDescription>
          Comparison of error rates across competitions, teams, and games
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Max Error Rate</div>
            <div className="text-lg font-semibold text-red-600">
              {(maxErrorRate * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">
              {highestErrorEntity.entity}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Min Error Rate</div>
            <div className="text-lg font-semibold text-emerald-600">
              {(minErrorRate * 100).toFixed(1)}%
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">
              Average Error Rate
            </div>
            <div className="text-lg font-semibold">
              {(averageErrorRate * 100).toFixed(1)}%
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">
              Overall Error Rate
            </div>
            <div className="text-lg font-semibold">
              {(errorAnalysis.overallErrorRate * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Chart */}
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="entity"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              fontSize={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={12}
              domain={[0, "dataMax + 0.05"]}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              label={{
                value: "Error Rate (%)",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle" },
              }}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number) => [
                `${(value * 100).toFixed(2)}%`,
                "Error Rate",
              ]}
              labelFormatter={(label) => label}
            />
            <Bar dataKey="errorRate" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(entry.errorRate)}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>

        {/* Entity Breakdown */}
        <div className="space-y-3 pt-4 border-t">
          <div className="text-sm font-medium text-muted-foreground">
            Error Rate Breakdown
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {chartData.map((item, index) => {
              const severity = getSeverityLevel(item.errorRate);
              const severityColors = {
                Critical: "bg-red-50 border-red-200 text-red-700",
                High: "bg-orange-50 border-orange-200 text-orange-700",
                Medium: "bg-yellow-50 border-yellow-200 text-yellow-700",
                Low: "bg-emerald-50 border-emerald-200 text-emerald-700",
              };
              const badgeColors = {
                Critical: "bg-red-500",
                High: "bg-orange-500",
                Medium: "bg-yellow-500",
                Low: "bg-emerald-500",
              };

              return (
                <div
                  key={index}
                  className={`p-3 border rounded-md ${
                    severityColors[severity as keyof typeof severityColors]
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{item.entity}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full text-white ${
                        badgeColors[severity as keyof typeof badgeColors]
                      }`}
                    >
                      {severity}
                    </span>
                  </div>
                  <div className="text-2xl font-bold">
                    {item.formattedRate}%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Error rate
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Insights */}
        {maxErrorRate > 0 && (
          <div className="pt-4 border-t">
            <div className="text-sm font-medium text-muted-foreground mb-2">
              Insights
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              {maxErrorRate >= 0.2 && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span>
                    {highestErrorEntity.entity} has a critical error rate (
                    {highestErrorEntity.formattedRate}%) requiring immediate
                    attention.
                  </span>
                </div>
              )}
              {maxErrorRate < 0.2 && maxErrorRate >= 0.1 && (
                <div className="flex items-center gap-2 text-orange-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span>
                    {highestErrorEntity.entity} has the highest error rate (
                    {highestErrorEntity.formattedRate}%) and should be
                    monitored.
                  </span>
                </div>
              )}
              {maxErrorRate === minErrorRate && (
                <div className="text-emerald-600">
                  ✓ All entity types have consistent error rates.
                </div>
              )}
              {maxErrorRate !== minErrorRate && maxErrorRate < 0.1 && (
                <div className="text-muted-foreground">
                  Error rates vary across entity types, but all are below 10%.
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
