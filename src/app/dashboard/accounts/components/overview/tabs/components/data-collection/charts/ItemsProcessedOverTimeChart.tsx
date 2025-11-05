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
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { Package } from "lucide-react";
import { ChartConfig } from "@/components/ui/chart";

interface ItemsProcessedOverTimeChartProps {
  data: AccountStatsResponse;
}

/**
 * ItemsProcessedOverTimeChart Component
 *
 * Displays items processed over time with:
 * - Stacked area chart for itemsFound, itemsUpdated, itemsNew
 * - Line chart for cumulative items
 * - Visual breakdown of item processing trends
 */
export default function ItemsProcessedOverTimeChart({
  data,
}: ItemsProcessedOverTimeChartProps) {
  const itemsData = data.data.timeSeries.itemsProcessedOverTime || [];

  // Chart configuration
  const chartConfig = {
    itemsFound: {
      label: "Items Found",
      color: "hsl(221, 83%, 53%)", // indigo-600
    },
    itemsUpdated: {
      label: "Items Updated",
      color: "hsl(262, 83%, 58%)", // purple-600
    },
    itemsNew: {
      label: "Items New",
      color: "hsl(142, 76%, 36%)", // emerald-600
    },
    cumulativeItems: {
      label: "Cumulative Items",
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
  const totalItemsFound = itemsData.reduce(
    (sum, point) => sum + point.itemsFound,
    0
  );
  const totalItemsUpdated = itemsData.reduce(
    (sum, point) => sum + point.itemsUpdated,
    0
  );
  const totalItemsNew = itemsData.reduce(
    (sum, point) => sum + point.itemsNew,
    0
  );
  const maxCumulative =
    itemsData.length > 0
      ? Math.max(...itemsData.map((point) => point.cumulativeItems))
      : 0;
  const averageItemsPerCollection =
    itemsData.length > 0
      ? (totalItemsFound + totalItemsUpdated + totalItemsNew) / itemsData.length
      : 0;

  if (itemsData.length === 0) {
    return (
      <Card className="shadow-none bg-slate-50 border rounded-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-500" />
            Items Processed Over Time
          </CardTitle>
          <CardDescription>
            Items found, updated, and new over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No items processed data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none bg-slate-50 border rounded-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-indigo-500" />
          <CardTitle className="text-lg font-semibold">
            Items Processed Over Time
          </CardTitle>
        </div>
        <CardDescription>
          Stacked breakdown of items found, updated, and new with cumulative
          total
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pb-4 border-b">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Total Found</div>
            <div className="text-lg font-semibold text-indigo-600">
              {totalItemsFound.toLocaleString()}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Total Updated</div>
            <div className="text-lg font-semibold text-purple-600">
              {totalItemsUpdated.toLocaleString()}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Total New</div>
            <div className="text-lg font-semibold text-emerald-600">
              {totalItemsNew.toLocaleString()}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Max Cumulative</div>
            <div className="text-lg font-semibold text-orange-600">
              {maxCumulative.toLocaleString()}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">
              Avg Per Collection
            </div>
            <div className="text-lg font-semibold">
              {averageItemsPerCollection.toFixed(0)}
            </div>
          </div>
        </div>

        {/* Chart */}
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            data={itemsData}
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
                value: "Items",
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
                if (name === "cumulativeItems") {
                  return [value.toLocaleString(), "Cumulative Items"];
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
            {/* Stacked Areas */}
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="itemsFound"
              stackId="1"
              stroke="hsl(221, 83%, 53%)"
              fill="hsl(221, 83%, 53%)"
              fillOpacity={0.7}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="itemsUpdated"
              stackId="1"
              stroke="hsl(262, 83%, 58%)"
              fill="hsl(262, 83%, 58%)"
              fillOpacity={0.7}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="itemsNew"
              stackId="1"
              stroke="hsl(142, 76%, 36%)"
              fill="hsl(142, 76%, 36%)"
              fillOpacity={0.7}
            />
            {/* Cumulative Line */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cumulativeItems"
              stroke="hsl(24, 95%, 53%)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ChartContainer>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground pt-2 border-t flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-indigo-600 rounded-sm" />
            <span>Items Found</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-600 rounded-sm" />
            <span>Items Updated</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-600 rounded-sm" />
            <span>Items New</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-orange-600" />
            <span>Cumulative Items</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
