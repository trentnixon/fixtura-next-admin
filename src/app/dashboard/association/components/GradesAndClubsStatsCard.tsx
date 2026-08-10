"use client";

import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
      <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total Grades" value={data.totalGrades.toLocaleString()} />
        <Stat label="Total Clubs" value={data.totalClubs.toLocaleString()} />
        <Stat
          label="Avg Grades/Association"
          value={data.averageGradesPerAssociation.toFixed(2)}
        />
        <Stat
          label="Avg Clubs/Association"
          value={data.averageClubsPerAssociation.toFixed(2)}
        />
      </div>

      {/* Charts Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution Chart */}
        <ChartCard
          title="Grade Distribution"
          description="Number of associations by grade count"
          chartConfig={gradeChartConfig}
          chartClassName="h-[260px]"
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
          chartClassName="h-[260px]"
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

      <div className="grid gap-6 lg:grid-cols-2">
        <DistributionTable title="Grade Buckets" rows={gradeChartData} />
        <DistributionTable title="Club Buckets" rows={clubChartData} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-slate-200 px-4 py-3 last:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0">
      <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function DistributionTable({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ label: string; value: number }>;
}) {
  return (
    <div className="rounded-md border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-3">
        <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead>Range</TableHead>
            <TableHead className="text-right">Associations</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.label}>
              <TableCell className="text-sm font-medium text-slate-900">
                {row.label}
              </TableCell>
              <TableCell className="text-right">
                {row.value.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
