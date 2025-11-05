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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Layers, AlertCircle } from "lucide-react";
import { ChartConfig } from "@/components/ui/chart";

interface StageDistributionChartProps {
  data: AccountStatsResponse;
}

/**
 * StageDistributionChart Component
 *
 * Displays stage distribution visualization with:
 * - Bar chart for current stage distribution
 * - Visual breakdown of collections by stage
 * - Most common pending stages list
 */
export default function StageDistributionChart({
  data,
}: StageDistributionChartProps) {
  const stageAnalysis = data.data.stageAnalysis;

  // Convert currentStageDistribution Record to array for chart
  const stageDistribution = stageAnalysis.currentStageDistribution
    ? Object.entries(stageAnalysis.currentStageDistribution).map(
        ([stage, count]) => ({
          stage: stage,
          count: count,
        })
      )
    : [];

  // Sort by count descending for better visualization
  const sortedStages = [...stageDistribution].sort((a, b) => b.count - a.count);

  // Chart configuration
  const chartConfig = {
    count: {
      label: "Collections",
      color: "hsl(221, 83%, 53%)", // indigo-600
    },
  } satisfies ChartConfig;

  // Get most common pending stages
  const mostCommonPendingStages = stageAnalysis.mostCommonPendingStages || [];

  if (sortedStages.length === 0 && mostCommonPendingStages.length === 0) {
    return (
      <Card className="shadow-none bg-slate-50 border rounded-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-500" />
            Stage Distribution
          </CardTitle>
          <CardDescription>
            Current stage distribution and pending stages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No stage distribution data available
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate total for percentages
  const totalCollections = sortedStages.reduce(
    (sum, item) => sum + item.count,
    0
  );

  // Format stage names (capitalize and add spaces)
  const formatStageName = (stage: string): string => {
    return stage
      .replace(/([A-Z])/g, " $1")
      .trim()
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  return (
    <Card className="shadow-none bg-slate-50 border rounded-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-500" />
          <CardTitle className="text-lg font-semibold">
            Stage Distribution
          </CardTitle>
        </div>
        <CardDescription>
          Current stage distribution and most common pending stages
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Stage Distribution Chart */}
        {sortedStages.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-muted-foreground">
                Collections by Current Stage
              </div>
              <div className="text-sm text-muted-foreground">
                Total: {totalCollections.toLocaleString()} collections
              </div>
            </div>

            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart
                data={sortedStages}
                margin={{ top: 5, right: 10, left: 0, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="stage"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  fontSize={12}
                  tickFormatter={formatStageName}
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
                    const percentage =
                      totalCollections > 0
                        ? ((value / totalCollections) * 100).toFixed(1)
                        : "0.0";
                    return [
                      `${value.toLocaleString()} (${percentage}%)`,
                      "Collections",
                    ];
                  }}
                  labelFormatter={(label) => formatStageName(label)}
                />
                <Bar
                  dataKey="count"
                  fill="hsl(221, 83%, 53%)" // indigo-600
                  barSize={30}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>

            {/* Stage Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">
                  Total Stages
                </div>
                <div className="text-lg font-semibold">
                  {sortedStages.length}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">
                  Most Common Stage
                </div>
                <div className="text-lg font-semibold text-indigo-600">
                  {sortedStages.length > 0
                    ? formatStageName(sortedStages[0].stage)
                    : "N/A"}
                </div>
                {sortedStages.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    {sortedStages[0].count.toLocaleString()} collections
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">
                  Average per Stage
                </div>
                <div className="text-lg font-semibold">
                  {sortedStages.length > 0
                    ? (totalCollections / sortedStages.length).toFixed(0)
                    : "0"}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">
                  Max Collections
                </div>
                <div className="text-lg font-semibold text-purple-600">
                  {sortedStages.length > 0
                    ? sortedStages[0].count.toLocaleString()
                    : "0"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Most Common Pending Stages */}
        {mostCommonPendingStages.length > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <div className="text-sm font-medium text-muted-foreground">
                Most Common Pending Stages
              </div>
            </div>
            <div className="space-y-2">
              {mostCommonPendingStages.map((stage, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-semibold flex items-center justify-center">
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium">
                      {formatStageName(stage)}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Needs attention
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state if no pending stages */}
        {mostCommonPendingStages.length === 0 && sortedStages.length > 0 && (
          <div className="pt-4 border-t">
            <div className="text-center py-4 text-sm text-muted-foreground">
              No common pending stages identified
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
