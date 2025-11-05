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
      <Card className="shadow-none bg-slate-50 border rounded-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Errors Over Time
          </CardTitle>
          <CardDescription>
            Error trends and cumulative error tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No error data available
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
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <CardTitle className="text-lg font-semibold">Errors Over Time</CardTitle>
          </div>
          {collectionsWithErrors > 0 && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertTriangle className="w-4 h-4" />
              <span>{collectionsWithErrors} collections with errors</span>
            </div>
          )}
        </div>
        <CardDescription>
          Errors per collection and cumulative error trends
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pb-4 border-b">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Total Errors</div>
            <div className="text-lg font-semibold text-red-600">
              {totalErrors.toLocaleString()}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">
              Collections with Errors
            </div>
            <div className="text-lg font-semibold text-red-600">
              {collectionsWithErrors}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Max Errors</div>
            <div className="text-lg font-semibold text-red-600">
              {maxErrors.toLocaleString()}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Max Cumulative</div>
            <div className="text-lg font-semibold text-orange-600">
              {maxCumulative.toLocaleString()}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Avg Per Collection</div>
            <div className="text-lg font-semibold">
              {averageErrorsPerCollection.toFixed(1)}
            </div>
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
              labelFormatter={(label) => formatDate(label)}
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
            <div className="w-3 h-3 bg-red-500 rounded-sm" />
            <span>Errors per Collection</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-orange-600" />
            <span>Cumulative Errors</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
