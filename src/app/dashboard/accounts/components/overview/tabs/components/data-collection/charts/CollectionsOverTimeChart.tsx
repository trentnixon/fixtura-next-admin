"use client";

import {
  AccountStatsResponse,
  CollectionTimePoint,
} from "@/types/dataCollection";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Label, H4, SubsectionTitle, ByLine } from "@/components/type/titles";
import { EmptyState } from "@/components/ui-library";
import { formatPercentage } from "@/utils/chart-formatters";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { TrendingUp, AlertCircle } from "lucide-react";
import { ChartConfig } from "@/components/ui/chart";

interface CollectionsOverTimeChartProps {
  data: AccountStatsResponse;
}

/**
 * CollectionsOverTimeChart Component
 *
 * Displays collection count over time with:
 * - Collection count trend line
 * - Completion rate overlay
 * - Error indicators (color-coded dots)
 */
export default function CollectionsOverTimeChart({
  data,
}: CollectionsOverTimeChartProps) {
  const collections = data.data.timeSeries.collectionsOverTime || [];

  // Chart configuration
  const chartConfig = {
    count: {
      label: "Collections",
      color: "hsl(221, 83%, 53%)", // indigo-600
    },
    completionRate: {
      label: "Completion Rate",
      color: "hsl(142, 76%, 36%)", // emerald-600
    },
  } satisfies ChartConfig;

  // Format date for chart display (short format)
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

  // Custom dot component to show error indicators
  const CustomDot = (props: {
    cx?: number;
    cy?: number;
    payload?: CollectionTimePoint;
  }) => {
    const { cx, cy, payload } = props;
    // payload contains the data point: { date, count, hasError, completionRate }
    if (payload && payload.hasError) {
      return (
        <circle
          cx={cx}
          cy={cy}
          r={5}
          fill="hsl(var(--error))"
          stroke="#fff"
          strokeWidth={2}
        />
      );
    }
    return (
      <circle
        cx={cx}
        cy={cy}
        r={3}
        fill="hsl(var(--success))"
        stroke="#fff"
        strokeWidth={1}
      />
    );
  };

  // Calculate statistics for display
  const totalCollections = collections.reduce(
    (sum, point) => sum + point.count,
    0
  );
  const collectionsWithErrors = collections.filter(
    (point) => point.hasError
  ).length;
  const averageCompletionRate =
    collections.length > 0
      ? collections.reduce((sum, point) => sum + point.completionRate, 0) /
        collections.length
      : 0;

  if (collections.length === 0) {
    return (
      <ElementContainer variant="dark" border padding="md">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-indigo-500" />
          <SubsectionTitle className="m-0">
            Collections Over Time
          </SubsectionTitle>
        </div>
        <ByLine className="mb-4">
          Collection count and completion rate trends
        </ByLine>
        <EmptyState
          variant="minimal"
          description="No collection data available"
        />
      </ElementContainer>
    );
  }

  return (
    <ElementContainer variant="dark" border padding="md">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-500" />
          <SubsectionTitle className="m-0">
            Collections Over Time
          </SubsectionTitle>
        </div>
        {collectionsWithErrors > 0 && (
          <div className="flex items-center gap-2 text-sm text-error-600">
            <AlertCircle className="w-4 h-4" />
            <span>{collectionsWithErrors} with errors</span>
          </div>
        )}
      </div>
      <ByLine className="mb-4">
        Collection count and completion rate trends over time
      </ByLine>

      <div className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 pb-4 border-b">
          <div className="space-y-1">
            <Label className="text-xs m-0">Total Collections</Label>
            <H4 className="text-lg font-semibold m-0">{totalCollections}</H4>
          </div>
          <div className="space-y-1">
            <Label className="text-xs m-0">Avg Completion Rate</Label>
            <H4 className="text-lg font-semibold m-0 text-success-600">
              {formatPercentage(averageCompletionRate)}
            </H4>
          </div>
          <div className="space-y-1">
            <Label className="text-xs m-0">Data Points</Label>
            <H4 className="text-lg font-semibold m-0">{collections.length}</H4>
          </div>
        </div>

        {/* Chart */}
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart
            data={collections}
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
              tickFormatter={(value) => Math.round(value).toString()}
              label={{
                value: "Collections",
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
              domain={[0, 100]}
              tickFormatter={(value) => `${Math.round(value)}%`}
              label={{
                value: "Completion %",
                angle: 90,
                position: "insideRight",
                style: { textAnchor: "middle" },
              }}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number, name: string) => {
                if (name === "completionRate") {
                  return [formatPercentage(value), "Completion Rate"];
                }
                return [value.toString(), "Collections"];
              }}
              labelFormatter={(label) => formatChartDate(label)}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="count"
              stroke="hsl(221, 83%, 53%)" // indigo-600
              strokeWidth={2}
              dot={<CustomDot />}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="completionRate"
              stroke="hsl(var(--success))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ChartContainer>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-600" />
            <span>Collection Count</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 bg-success-600 border-dashed border border-success-600" />
            <span>Completion Rate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-error-500" />
            <span>Has Error</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success-600" />
            <span>No Error</span>
          </div>
        </div>
      </div>
    </ElementContainer>
  );
}
