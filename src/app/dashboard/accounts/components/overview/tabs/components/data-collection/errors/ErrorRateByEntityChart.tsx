"use client";

import { AccountStatsResponse } from "@/types/dataCollection";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { EmptyState } from "@/components/ui-library";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { AlertTriangle } from "lucide-react";
import { ChartConfig } from "@/components/ui/chart";
import { Label, H4, SubsectionTitle, ByLine } from "@/components/type/titles";
import { formatPercentage } from "@/utils/chart-formatters";

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
    },
    {
      entity: "Teams",
      errorRate: errorRates.teams || 0,
    },
    {
      entity: "Games",
      errorRate: errorRates.games || 0,
    },
  ];

  // Chart configuration
  const chartConfig = {
    errorRate: {
      label: "Error Rate",
      color: "hsl(0, 84%, 60%)", // red-500
    },
  } satisfies ChartConfig;

  // Get color based on error rate severity (using semantic colors)
  const getBarColor = (errorRate: number): string => {
    if (errorRate >= 0.2) return "hsl(var(--error))"; // critical
    if (errorRate >= 0.1) return "hsl(var(--error))"; // high
    if (errorRate >= 0.05) return "hsl(var(--warning))"; // medium
    return "hsl(var(--success))"; // low
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
      <ElementContainer variant="dark" border padding="md">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-error-500" />
          <SubsectionTitle className="m-0">
            Error Rate by Entity Type
          </SubsectionTitle>
        </div>
        <ByLine className="mb-4">
          Error rate comparison across competitions, teams, and games
        </ByLine>
        <EmptyState
          title="No error data available for entity types"
          description="No error data available for entity types in this time period."
          variant="minimal"
        />
      </ElementContainer>
    );
  }

  return (
    <ElementContainer variant="dark" border padding="md">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-5 h-5 text-error-500" />
        <SubsectionTitle className="m-0">
          Error Rate by Entity Type
        </SubsectionTitle>
      </div>
      <ByLine className="mb-4">
        Comparison of error rates across competitions, teams, and games
      </ByLine>

      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b">
          <div className="space-y-1">
            <Label className="text-xs m-0">Max Error Rate</Label>
            <H4 className="text-lg font-semibold m-0 text-error-600">
              {formatPercentage(maxErrorRate * 100)}
            </H4>
            <ByLine className="text-xs m-0">{highestErrorEntity.entity}</ByLine>
          </div>
          <div className="space-y-1">
            <Label className="text-xs m-0">Min Error Rate</Label>
            <H4 className="text-lg font-semibold m-0 text-success-600">
              {formatPercentage(minErrorRate * 100)}
            </H4>
          </div>
          <div className="space-y-1">
            <Label className="text-xs m-0">Average Error Rate</Label>
            <H4 className="text-lg font-semibold m-0">
              {formatPercentage(averageErrorRate * 100)}
            </H4>
          </div>
          <div className="space-y-1">
            <Label className="text-xs m-0">Overall Error Rate</Label>
            <H4 className="text-lg font-semibold m-0">
              {formatPercentage(errorAnalysis.overallErrorRate * 100)}
            </H4>
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
          <SubsectionTitle className="text-sm m-0">
            Error Rate Breakdown
          </SubsectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {chartData.map((item, index) => {
              const severity = getSeverityLevel(item.errorRate);
              const severityColors = {
                Critical: "bg-error-50 border-error-200 text-error-700",
                High: "bg-error-50 border-error-200 text-error-700",
                Medium: "bg-warning-50 border-warning-200 text-warning-700",
                Low: "bg-success-50 border-success-200 text-success-700",
              };
              const badgeColors = {
                Critical: "bg-error-500",
                High: "bg-error-500",
                Medium: "bg-warning-500",
                Low: "bg-success-500",
              };

              return (
                <div
                  key={index}
                  className={`p-3 border rounded-md ${
                    severityColors[severity as keyof typeof severityColors]
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm m-0">{item.entity}</Label>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full text-white ${
                        badgeColors[severity as keyof typeof badgeColors]
                      }`}
                    >
                      {severity}
                    </span>
                  </div>
                  <H4 className="text-2xl font-bold m-0">
                    {formatPercentage(item.errorRate * 100)}
                  </H4>
                  <ByLine className="text-xs m-0 mt-1">Error rate</ByLine>
                </div>
              );
            })}
          </div>
        </div>

        {/* Insights */}
        {maxErrorRate > 0 && (
          <div className="pt-4 border-t">
            <SubsectionTitle className="text-sm m-0 mb-2">
              Insights
            </SubsectionTitle>
            <div className="space-y-1 text-sm">
              {maxErrorRate >= 0.2 && (
                <div className="flex items-center gap-2 text-error-600">
                  <AlertTriangle className="w-4 h-4" />
                  <ByLine className="m-0">
                    {highestErrorEntity.entity} has a critical error rate (
                    {formatPercentage(highestErrorEntity.errorRate * 100)})
                    requiring immediate attention.
                  </ByLine>
                </div>
              )}
              {maxErrorRate < 0.2 && maxErrorRate >= 0.1 && (
                <div className="flex items-center gap-2 text-error-600">
                  <AlertTriangle className="w-4 h-4" />
                  <ByLine className="m-0">
                    {highestErrorEntity.entity} has the highest error rate (
                    {formatPercentage(highestErrorEntity.errorRate * 100)}) and
                    should be monitored.
                  </ByLine>
                </div>
              )}
              {maxErrorRate === minErrorRate && (
                <div className="text-success-600">
                  ✓ All entity types have consistent error rates.
                </div>
              )}
              {maxErrorRate !== minErrorRate && maxErrorRate < 0.1 && (
                <ByLine className="m-0">
                  Error rates vary across entity types, but all are below 10%.
                </ByLine>
              )}
            </div>
          </div>
        )}
      </div>
    </ElementContainer>
  );
}
