"use client";

import { GlobalInsightsData } from "@/types/dataCollection";
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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { AlertTriangle, AlertCircle, Database } from "lucide-react";
import { ChartConfig } from "@/components/ui/chart";
import { formatDateShort } from "../utils/formatters";

interface ErrorsOverTimeChartProps {
  data: GlobalInsightsData;
}

/**
 * ErrorsOverTimeChart Component
 *
 * Displays error trends over time with:
 * - Error count trend line
 * - Incomplete count trend line
 * - Total collections trend line
 */
export default function ErrorsOverTimeChart({
  data,
}: ErrorsOverTimeChartProps) {
  const errors = data.timeSeries.errorsOverTime || [];

  // Chart configuration
  const chartConfig = {
    errorCount: {
      label: "Errors",
      color: "hsl(0, 84%, 60%)", // red-500
    },
    incompleteCount: {
      label: "Incomplete",
      color: "hsl(38, 92%, 50%)", // orange-500
    },
    totalCollections: {
      label: "Total Collections",
      color: "hsl(221, 83%, 53%)", // blue-600
    },
  } satisfies ChartConfig;

  // Prepare chart data
  const chartData = errors.map((point) => ({
    date: formatDateShort(point.date),
    errorCount: point.errorCount,
    incompleteCount: point.incompleteCount,
    totalCollections: point.totalCollections,
  }));

  // Calculate statistics for display
  const totalErrors =
    errors.length > 0
      ? errors.reduce((sum, point) => sum + point.errorCount, 0)
      : 0;
  const totalIncomplete =
    errors.length > 0
      ? errors.reduce((sum, point) => sum + point.incompleteCount, 0)
      : 0;
  const avgErrors = errors.length > 0 ? totalErrors / errors.length : 0;
  const maxErrors =
    errors.length > 0
      ? Math.max(...errors.map((point) => point.errorCount))
      : 0;

  if (errors.length === 0) {
    return (
      <Card className="shadow-none bg-slate-50 border rounded-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Errors Over Time
          </CardTitle>
          <CardDescription>
            Error trends over the last 12 months
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
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <CardTitle className="text-lg font-semibold">
            Errors Over Time
          </CardTitle>
        </div>
        <CardDescription>
          Error and incomplete collection trends over the last 12 months
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Total Errors
            </div>
            <div className="text-lg font-semibold text-red-600">
              {totalErrors.toLocaleString()}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Avg Errors/Day
            </div>
            <div className="text-lg font-semibold text-orange-600">
              {avgErrors.toFixed(1)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Max Errors/Day
            </div>
            <div className="text-lg font-semibold text-red-600">
              {maxErrors}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Database className="w-3 h-3" />
              Total Incomplete
            </div>
            <div className="text-lg font-semibold text-orange-600">
              {totalIncomplete.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Chart */}
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
              tickFormatter={(value) => {
                try {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                } catch {
                  return value;
                }
              }}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              label={{
                value: "Count",
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
                value: "Total Collections",
                angle: 90,
                position: "insideRight",
                style: { textAnchor: "middle" },
              }}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number, name: string) => {
                return [
                  value.toLocaleString(),
                  chartConfig[name as keyof typeof chartConfig]?.label || name,
                ];
              }}
              labelFormatter={(label) => {
                try {
                  const date = new Date(label);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                } catch {
                  return label;
                }
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              iconType="line"
              formatter={(value) => {
                return (
                  chartConfig[value as keyof typeof chartConfig]?.label || value
                );
              }}
            />
            {/* Error Count Line */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="errorCount"
              stroke="hsl(0, 84%, 60%)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            {/* Incomplete Count Line */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="incompleteCount"
              stroke="hsl(38, 92%, 50%)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            {/* Total Collections Line */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="totalCollections"
              stroke="hsl(221, 83%, 53%)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
