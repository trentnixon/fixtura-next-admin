"use client";

import { AccountStatsResponse } from "@/types/dataCollection";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Label, H4, SubsectionTitle, ByLine } from "@/components/type/titles";
import { EmptyState } from "@/components/ui-library";
import { formatPercentage } from "@/utils/chart-formatters";
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
      <ElementContainer variant="dark" border padding="md">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="w-5 h-5 text-blue-500" />
          <SubsectionTitle className="m-0">Stage Distribution</SubsectionTitle>
        </div>
        <ByLine className="mb-4">
          Current stage distribution and pending stages
        </ByLine>
        <EmptyState
          variant="minimal"
          description="No stage distribution data available"
        />
      </ElementContainer>
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
    <ElementContainer variant="dark" border padding="md">
      <div className="flex items-center gap-2 mb-2">
        <Layers className="w-5 h-5 text-blue-500" />
        <SubsectionTitle className="m-0">Stage Distribution</SubsectionTitle>
      </div>
      <ByLine className="mb-4">
        Current stage distribution and most common pending stages
      </ByLine>

      <div className="space-y-6">
        {/* Stage Distribution Chart */}
        {sortedStages.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium m-0">
                Collections by Current Stage
              </Label>
              <ByLine className="text-sm m-0">
                Total: {totalCollections.toLocaleString()} collections
              </ByLine>
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
                        ? formatPercentage((value / totalCollections) * 100)
                        : "0.0%";
                    return [
                      `${value.toLocaleString()} (${percentage})`,
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
                <Label className="text-xs m-0">Total Stages</Label>
                <H4 className="text-lg font-semibold m-0">
                  {sortedStages.length}
                </H4>
              </div>
              <div className="space-y-1">
                <Label className="text-xs m-0">Most Common Stage</Label>
                <H4 className="text-lg font-semibold m-0 text-indigo-600">
                  {sortedStages.length > 0
                    ? formatStageName(sortedStages[0].stage)
                    : "N/A"}
                </H4>
                {sortedStages.length > 0 && (
                  <ByLine className="text-xs m-0">
                    {sortedStages[0].count.toLocaleString()} collections
                  </ByLine>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-xs m-0">Average per Stage</Label>
                <H4 className="text-lg font-semibold m-0">
                  {sortedStages.length > 0
                    ? (totalCollections / sortedStages.length).toFixed(0)
                    : "0"}
                </H4>
              </div>
              <div className="space-y-1">
                <Label className="text-xs m-0">Max Collections</Label>
                <H4 className="text-lg font-semibold m-0 text-purple-600">
                  {sortedStages.length > 0
                    ? sortedStages[0].count.toLocaleString()
                    : "0"}
                </H4>
              </div>
            </div>
          </div>
        )}

        {/* Most Common Pending Stages */}
        {mostCommonPendingStages.length > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-warning-500" />
              <SubsectionTitle className="text-sm m-0">
                Most Common Pending Stages
              </SubsectionTitle>
            </div>
            <div className="space-y-2">
              {mostCommonPendingStages.map((stage, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-warning-50 border border-warning-200 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-warning-500 text-white text-xs font-semibold flex items-center justify-center">
                      {index + 1}
                    </div>
                    <Label className="text-sm font-medium m-0">
                      {formatStageName(stage)}
                    </Label>
                  </div>
                  <ByLine className="text-xs m-0">Needs attention</ByLine>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state if no pending stages */}
        {mostCommonPendingStages.length === 0 && sortedStages.length > 0 && (
          <div className="pt-4 border-t">
            <EmptyState
              variant="minimal"
              description="No common pending stages identified"
            />
          </div>
        )}
      </div>
    </ElementContainer>
  );
}
