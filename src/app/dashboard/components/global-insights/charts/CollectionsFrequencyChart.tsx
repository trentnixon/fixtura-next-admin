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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Activity, TrendingUp } from "lucide-react";
import { ChartConfig } from "@/components/ui/chart";
import { formatDateShort } from "../utils/formatters";

interface CollectionsFrequencyChartProps {
  data: GlobalInsightsData;
}

/**
 * CollectionsFrequencyChart Component
 *
 * Displays collection frequency over time with:
 * - Daily collection count as a bar chart
 * - Trend line showing collection frequency patterns
 */
export default function CollectionsFrequencyChart({
  data,
}: CollectionsFrequencyChartProps) {
  const frequency = data.timeSeries.collectionsFrequencyOverTime || [];

  // Chart configuration
  const chartConfig = {
    count: {
      label: "Collections",
      color: "hsl(221, 83%, 53%)", // blue-600
    },
  } satisfies ChartConfig;

  // Prepare chart data
  const chartData = frequency.map((point) => ({
    date: formatDateShort(point.date),
    count: point.count,
  }));

  // Calculate statistics for display
  const totalCollections =
    frequency.length > 0
      ? frequency.reduce((sum, point) => sum + point.count, 0)
      : 0;
  const avgPerDay =
    frequency.length > 0 ? totalCollections / frequency.length : 0;
  const maxPerDay =
    frequency.length > 0
      ? Math.max(...frequency.map((point) => point.count))
      : 0;
  const daysWithCollections = frequency.filter(
    (point) => point.count > 0
  ).length;

  if (frequency.length === 0) {
    return (
      <Card className="shadow-none bg-slate-50 border rounded-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Collections Frequency Over Time
          </CardTitle>
          <CardDescription>
            Collection frequency trends over the last 12 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No frequency data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none bg-slate-50 border rounded-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          <CardTitle className="text-lg font-semibold">
            Collections Frequency Over Time
          </CardTitle>
        </div>
        <CardDescription>
          Daily collection count over the last 12 months
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Activity className="w-3 h-3" />
              Total Collections
            </div>
            <div className="text-lg font-semibold text-blue-600">
              {totalCollections.toLocaleString()}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Avg Per Day
            </div>
            <div className="text-lg font-semibold text-blue-600">
              {avgPerDay.toFixed(1)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Activity className="w-3 h-3" />
              Max Per Day
            </div>
            <div className="text-lg font-semibold text-blue-600">
              {maxPerDay}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Activity className="w-3 h-3" />
              Active Days
            </div>
            <div className="text-lg font-semibold text-blue-600">
              {daysWithCollections}
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
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number) => {
                return [value.toLocaleString(), "Collections"];
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
            <Bar
              dataKey="count"
              fill="hsl(221, 83%, 53%)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
