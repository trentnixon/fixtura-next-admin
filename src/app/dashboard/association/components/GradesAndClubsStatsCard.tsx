"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradesAndClubsAnalytics } from "@/types/associationInsights";
import ChartCard from "@/components/modules/charts/ChartCard";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import { formatNumber } from "@/utils/chart-formatters";
import type { ChartConfig } from "@/components/ui/chart";

/**
 * GradesAndClubsStatsCard Component
 *
 * Displays grades and clubs analytics:
 * - Total Grades & Total Clubs (summary stats)
 * - Average Grades/Clubs per Association
 * - Grade Distribution Chart/Table (zero, oneToFive, sixToTen, elevenPlus)
 * - Club Distribution Chart/Table (zero, oneToFive, sixToTen, elevenToTwenty, twentyOnePlus)
 */
interface GradesAndClubsStatsCardProps {
  data: GradesAndClubsAnalytics;
}

export default function GradesAndClubsStatsCard({
  data,
}: GradesAndClubsStatsCardProps) {
  // Prepare data for grade distribution chart
  const gradeChartData = useMemo(() => {
    return [
      {
        name: "Zero",
        label: "Zero grades",
        value: data.gradeDistribution.zero,
      },
      {
        name: "1-5",
        label: "1-5 grades",
        value: data.gradeDistribution.oneToFive,
      },
      {
        name: "6-10",
        label: "6-10 grades",
        value: data.gradeDistribution.sixToTen,
      },
      {
        name: "11+",
        label: "11+ grades",
        value: data.gradeDistribution.elevenPlus,
      },
    ];
  }, [data.gradeDistribution]);

  // Prepare data for club distribution chart
  const clubChartData = useMemo(() => {
    return [
      {
        name: "Zero",
        label: "Zero clubs",
        value: data.clubDistribution.zero,
      },
      {
        name: "1-5",
        label: "1-5 clubs",
        value: data.clubDistribution.oneToFive,
      },
      {
        name: "6-10",
        label: "6-10 clubs",
        value: data.clubDistribution.sixToTen,
      },
      {
        name: "11-20",
        label: "11-20 clubs",
        value: data.clubDistribution.elevenToTwenty,
      },
      {
        name: "21+",
        label: "21+ clubs",
        value: data.clubDistribution.twentyOnePlus,
      },
    ];
  }, [data.clubDistribution]);

  // Create chart configs
  const gradeChartConfig: ChartConfig = {
    value: {
      label: "Associations",
      color: "hsl(var(--chart-1))",
    },
  };

  const clubChartConfig: ChartConfig = {
    value: {
      label: "Associations",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats Card */}
      <Card className="bg-white border shadow-none">
        <CardHeader className="p-4">
          <CardTitle>Grades & Clubs Statistics</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat
              label="Total Grades"
              value={data.totalGrades.toLocaleString()}
            />
            <Stat
              label="Total Clubs"
              value={data.totalClubs.toLocaleString()}
            />
            <Stat
              label="Avg Grades/Association"
              value={data.averageGradesPerAssociation.toFixed(2)}
            />
            <Stat
              label="Avg Clubs/Association"
              value={data.averageClubsPerAssociation.toFixed(2)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution Chart */}
        <ChartCard
          title="Grade Distribution"
          description="Number of associations by grade count"
          chartConfig={gradeChartConfig}
          chartClassName="h-[300px]"
        >
          <BarChart data={gradeChartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatNumber(value)}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number) => [
                formatNumber(value),
                "Associations",
              ]}
            />
            <Bar
              dataKey="value"
              fill="var(--color-value)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartCard>

        {/* Club Distribution Chart */}
        <ChartCard
          title="Club Distribution"
          description="Number of associations by club count"
          chartConfig={clubChartConfig}
          chartClassName="h-[300px]"
        >
          <BarChart data={clubChartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatNumber(value)}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number) => [
                formatNumber(value),
                "Associations",
              ]}
            />
            <Bar
              dataKey="value"
              fill="var(--color-value)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartCard>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
