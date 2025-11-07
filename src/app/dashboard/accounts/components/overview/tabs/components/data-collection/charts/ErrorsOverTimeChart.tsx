"use client";

import { AccountStatsResponse } from "@/types/dataCollection";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { EmptyState } from "@/components/ui-library";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { AlertTriangle } from "lucide-react";
import { ChartConfig } from "@/components/ui/chart";
import { Label, H4, SubsectionTitle, ByLine } from "@/components/type/titles";

interface ErrorsOverTimeChartProps {
  data: AccountStatsResponse;
}

/**
 * ErrorsOverTimeChart Component
 *
 * Displays errors over time with:
 * - Bar chart for errors per collection
 * - Line chart for cumulative errors trend
 * - Visual indicators for error patterns
 */
export default function ErrorsOverTimeChart({
  data,
}: ErrorsOverTimeChartProps) {
  const errorsData = data.data.timeSeries.errorsOverTime || [];

  // Chart configuration
  const chartConfig = {
    errors: {
      label: "Errors",
      color: "hsl(0, 84%, 60%)", // red-500
    },
    cumulativeErrors: {
      label: "Cumulative Errors",
      color: "hsl(24, 95%, 53%)", // orange-600
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

  // Calculate statistics for display
  const totalErrors = errorsData.reduce((sum, point) => sum + point.errors, 0);
  const collectionsWithErrors = errorsData.filter(
    (point) => point.hasError
  ).length;
  const maxErrors =
    errorsData.length > 0
      ? Math.max(...errorsData.map((point) => point.errors))
      : 0;
  const maxCumulative =
    errorsData.length > 0
      ? Math.max(...errorsData.map((point) => point.cumulativeErrors))
      : 0;
  const averageErrorsPerCollection =
    errorsData.length > 0 ? totalErrors / errorsData.length : 0;

  if (errorsData.length === 0) {
    return (
      <ElementContainer variant="dark" border padding="md">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-error-500" />
          <SubsectionTitle className="m-0">Errors Over Time</SubsectionTitle>
        </div>
        <ByLine className="mb-4">
          Error trends and cumulative error tracking
        </ByLine>
        <EmptyState
          title="No error data available"
          description="No error data available for this time period."
          variant="minimal"
        />
      </ElementContainer>
    );
  }

  return (
    <ElementContainer variant="dark" border padding="md">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-error-500" />
          <SubsectionTitle className="m-0">Errors Over Time</SubsectionTitle>
        </div>
        {collectionsWithErrors > 0 && (
          <div className="flex items-center gap-2 text-sm text-error-600">
            <AlertTriangle className="w-4 h-4" />
            <ByLine className="m-0">
              {collectionsWithErrors} collections with errors
            </ByLine>
          </div>
        )}
      </div>
      <ByLine className="mb-4">
        Errors per collection and cumulative error trends
      </ByLine>

      <div className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pb-4 border-b">
          <div className="space-y-1">
            <Label className="text-xs m-0">Total Errors</Label>
            <H4 className="text-lg font-semibold m-0 text-error-600">
              {totalErrors.toLocaleString()}
            </H4>
          </div>
          <div className="space-y-1">
            <Label className="text-xs m-0">Collections with Errors</Label>
            <H4 className="text-lg font-semibold m-0 text-error-600">
              {collectionsWithErrors}
            </H4>
          </div>
          <div className="space-y-1">
            <Label className="text-xs m-0">Max Errors</Label>
            <H4 className="text-lg font-semibold m-0 text-error-600">
              {maxErrors.toLocaleString()}
            </H4>
          </div>
          <div className="space-y-1">
            <Label className="text-xs m-0">Max Cumulative</Label>
            <H4 className="text-lg font-semibold m-0 text-warning-600">
              {maxCumulative.toLocaleString()}
            </H4>
          </div>
          <div className="space-y-1">
            <Label className="text-xs m-0">Avg Per Collection</Label>
            <H4 className="text-lg font-semibold m-0">
              {averageErrorsPerCollection.toFixed(1)}
            </H4>
          </div>
        </div>

        {/* Chart */}
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ComposedChart
            data={errorsData}
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
                value: "Errors",
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
                value: "Cumulative",
                angle: 90,
                position: "insideRight",
                style: { textAnchor: "middle" },
              }}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number, name: string) => {
                if (name === "cumulativeErrors") {
                  return [value.toLocaleString(), "Cumulative Errors"];
                }
                return [
                  value.toLocaleString(),
                  chartConfig[name as keyof typeof chartConfig]?.label || name,
                ];
              }}
              labelFormatter={(label) => formatChartDate(label)}
            />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              iconType="square"
              formatter={(value) => {
                return (
                  chartConfig[value as keyof typeof chartConfig]?.label || value
                );
              }}
            />
            {/* Errors Bar Chart */}
            <Bar
              yAxisId="left"
              dataKey="errors"
              fill="hsl(0, 84%, 60%)"
              radius={[4, 4, 0, 0]}
            />
            {/* Cumulative Errors Line */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cumulativeErrors"
              stroke="hsl(24, 95%, 53%)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ChartContainer>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground pt-2 border-t flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-error-500 rounded-sm" />
            <span>Errors per Collection</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-warning-600" />
            <span>Cumulative Errors</span>
          </div>
        </div>
      </div>
    </ElementContainer>
  );
}
