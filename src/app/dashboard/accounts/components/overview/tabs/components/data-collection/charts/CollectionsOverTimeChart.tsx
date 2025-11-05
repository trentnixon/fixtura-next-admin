"use client";

import {
  AccountStatsResponse,
  CollectionTimePoint,
} from "@/types/dataCollection";
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

  // Format date for display
  const formatDate = (dateString: string): string => {
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
          fill="hsl(0, 84%, 60%)" // red-500
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
        fill="hsl(142, 76%, 36%)" // emerald-600
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
      <Card className="shadow-none bg-slate-50 border rounded-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            Collections Over Time
          </CardTitle>
          <CardDescription>
            Collection count and completion rate trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No collection data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none bg-slate-50 border rounded-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            <CardTitle className="text-lg font-semibold">
              Collections Over Time
            </CardTitle>
          </div>
          {collectionsWithErrors > 0 && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span>{collectionsWithErrors} with errors</span>
            </div>
          )}
        </div>
        <CardDescription>
          Collection count and completion rate trends over time
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 pb-4 border-b">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">
              Total Collections
            </div>
            <div className="text-lg font-semibold">{totalCollections}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">
              Avg Completion Rate
            </div>
            <div className="text-lg font-semibold text-emerald-600">
              {averageCompletionRate.toFixed(1)}%
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Data Points</div>
            <div className="text-lg font-semibold">{collections.length}</div>
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
              tickFormatter={formatDate}
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
                  return [`${value.toFixed(1)}%`, "Completion Rate"];
                }
                return [value.toString(), "Collections"];
              }}
              labelFormatter={(label) => formatDate(label)}
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
              stroke="hsl(142, 76%, 36%)" // emerald-600
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
            <div className="w-3 h-1 bg-emerald-600 border-dashed border border-emerald-600" />
            <span>Completion Rate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span>Has Error</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>No Error</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
