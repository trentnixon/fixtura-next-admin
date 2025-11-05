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
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { CheckCircle2, Clock } from "lucide-react";
import { ChartConfig } from "@/components/ui/chart";

interface CompletionRateOverTimeChartProps {
  data: AccountStatsResponse;
}

/**
 * CompletionRateOverTimeChart Component
 *
 * Displays completion rate over time with:
 * - Line chart for completion rate percentage
 * - Area chart showing completed vs pending stages
 * - Stage information and trends
 */
export default function CompletionRateOverTimeChart({
  data,
}: CompletionRateOverTimeChartProps) {
  const completionData = data.data.timeSeries.completionRateOverTime || [];

  // Chart configuration
  const chartConfig = {
    completionRate: {
      label: "Completion Rate",
      color: "hsl(142, 76%, 36%)", // emerald-600
    },
    completedStages: {
      label: "Completed Stages",
      color: "hsl(142, 76%, 36%)", // emerald-600
    },
    pendingStages: {
      label: "Pending Stages",
      color: "hsl(38, 92%, 50%)", // amber-500
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
  const averageCompletionRate =
    completionData.length > 0
      ? completionData.reduce((sum, point) => sum + point.completionRate, 0) /
        completionData.length
      : 0;
  const maxCompletionRate =
    completionData.length > 0
      ? Math.max(...completionData.map((point) => point.completionRate))
      : 0;
  const minCompletionRate =
    completionData.length > 0
      ? Math.min(...completionData.map((point) => point.completionRate))
      : 0;
  const averageCompletedStages =
    completionData.length > 0
      ? completionData.reduce(
          (sum, point) => sum + point.completedStages,
          0
        ) / completionData.length
      : 0;
  const averagePendingStages =
    completionData.length > 0
      ? completionData.reduce((sum, point) => sum + point.pendingStages, 0) /
        completionData.length
      : 0;

  // Get most common current stage
  const stageCounts = completionData.reduce(
    (acc, point) => {
      acc[point.currentStage] = (acc[point.currentStage] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const mostCommonStage =
    Object.keys(stageCounts).length > 0
      ? Object.entries(stageCounts).reduce((a, b) =>
          stageCounts[a[0]] > stageCounts[b[0]] ? a : b
        )[0]
      : null;

  if (completionData.length === 0) {
    return (
      <Card className="shadow-none bg-slate-50 border rounded-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            Completion Rate Over Time
          </CardTitle>
          <CardDescription>
            Completion rate trends and stage progression
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No completion rate data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none bg-slate-50 border rounded-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <CardTitle className="text-lg font-semibold">
            Completion Rate Over Time
          </CardTitle>
        </div>
        <CardDescription>
          Completion rate percentage and stage progression over time
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pb-4 border-b">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">
              Avg Completion Rate
            </div>
            <div className="text-lg font-semibold text-emerald-600">
              {averageCompletionRate.toFixed(1)}%
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Max Completion</div>
            <div className="text-lg font-semibold text-emerald-600">
              {maxCompletionRate.toFixed(1)}%
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Min Completion</div>
            <div className="text-lg font-semibold text-amber-600">
              {minCompletionRate.toFixed(1)}%
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">
              Avg Completed Stages
            </div>
            <div className="text-lg font-semibold text-emerald-600">
              {averageCompletedStages.toFixed(1)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">
              Avg Pending Stages
            </div>
            <div className="text-lg font-semibold text-amber-600">
              {averagePendingStages.toFixed(1)}
            </div>
          </div>
        </div>

        {/* Most Common Stage */}
        {mostCommonStage && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground pb-2">
            <Clock className="w-4 h-4" />
            <span>
              Most common current stage: <strong>{mostCommonStage}</strong>
            </span>
          </div>
        )}

        {/* Chart */}
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ComposedChart
            data={completionData}
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
              domain={[0, 100]}
              label={{
                value: "Completion Rate (%)",
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
                value: "Stages",
                angle: 90,
                position: "insideRight",
                style: { textAnchor: "middle" },
              }}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number | string, name: string) => {
                if (name === "completionRate") {
                  return [`${value}%`, "Completion Rate"];
                }
                if (name === "currentStage") {
                  return [value, "Current Stage"];
                }
                return [
                  value,
                  chartConfig[name as keyof typeof chartConfig]?.label || name,
                ];
              }}
              labelFormatter={(label, payload) => {
                const dataPoint = payload?.[0]?.payload;
                if (dataPoint?.currentStage) {
                  return `${formatDate(label)} (${dataPoint.currentStage})`;
                }
                return formatDate(label);
              }}
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
            {/* Completed Stages Area (background) */}
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="completedStages"
              stroke="hsl(142, 76%, 36%)"
              fill="hsl(142, 76%, 36%)"
              fillOpacity={0.2}
            />
            {/* Pending Stages Area (overlay) */}
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="pendingStages"
              stroke="hsl(38, 92%, 50%)"
              fill="hsl(38, 92%, 50%)"
              fillOpacity={0.2}
            />
            {/* Completion Rate Line */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="completionRate"
              stroke="hsl(142, 76%, 36%)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ChartContainer>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground pt-2 border-t flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-emerald-600" />
            <span>Completion Rate (%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-600 rounded-sm opacity-20" />
            <span>Completed Stages</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-sm opacity-20" />
            <span>Pending Stages</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
