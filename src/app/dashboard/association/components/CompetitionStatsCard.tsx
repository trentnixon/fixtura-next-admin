"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AssociationCompetitionAnalytics } from "@/types/associationInsights";
import ChartCard from "@/components/modules/charts/ChartCard";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import { formatNumber } from "@/utils/chart-formatters";
import type { ChartConfig } from "@/components/ui/chart";

/**
 * CompetitionStatsCard Component
 *
 * Displays competition analytics:
 * - Total/Active/Inactive Competitions (summary stats)
 * - Competitions by Status Table (dynamic status keys from competitionsByStatus)
 * - Competition Size Distribution Chart/Table (small: 1-5, medium: 6-20, large: 21-50, xlarge: 51+)
 * - Competition Grade Distribution Chart/Table (single: 1, few: 2-5, many: 6-10, extensive: 11+)
 */
interface CompetitionStatsCardProps {
  data: AssociationCompetitionAnalytics;
}

export default function CompetitionStatsCard({
  data,
}: CompetitionStatsCardProps) {
  // Prepare data for competition size distribution chart
  const sizeChartData = useMemo(() => {
    return [
      {
        name: "Small",
        label: "Small (1-5 teams)",
        value: data.competitionSizeDistribution.small,
      },
      {
        name: "Medium",
        label: "Medium (6-20 teams)",
        value: data.competitionSizeDistribution.medium,
      },
      {
        name: "Large",
        label: "Large (21-50 teams)",
        value: data.competitionSizeDistribution.large,
      },
      {
        name: "XLarge",
        label: "XLarge (51+ teams)",
        value: data.competitionSizeDistribution.xlarge,
      },
    ];
  }, [data.competitionSizeDistribution]);

  // Prepare data for competition grade distribution chart
  const gradeChartData = useMemo(() => {
    return [
      {
        name: "Single",
        label: "Single (1 grade)",
        value: data.competitionGradeDistribution.single,
      },
      {
        name: "Few",
        label: "Few (2-5 grades)",
        value: data.competitionGradeDistribution.few,
      },
      {
        name: "Many",
        label: "Many (6-10 grades)",
        value: data.competitionGradeDistribution.many,
      },
      {
        name: "Extensive",
        label: "Extensive (11+ grades)",
        value: data.competitionGradeDistribution.extensive,
      },
    ];
  }, [data.competitionGradeDistribution]);

  // Prepare data for competitions by status chart
  const statusChartData = useMemo(() => {
    return Object.entries(data.competitionsByStatus)
      .map(([status, count]) => ({
        name: status,
        value: count,
      }))
      .sort((a, b) => b.value - a.value); // Sort descending by count
  }, [data.competitionsByStatus]);

  // Create chart configs
  const sizeChartConfig: ChartConfig = {
    value: {
      label: "Competitions",
      color: "hsl(var(--chart-1))",
    },
  };

  const gradeChartConfig: ChartConfig = {
    value: {
      label: "Competitions",
      color: "hsl(var(--chart-2))",
    },
  };

  const statusChartConfig: ChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    statusChartData.forEach((item, index) => {
      config[item.name] = {
        label: item.name,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      };
    });
    return config;
  }, [statusChartData]);

  return (
    <div className="space-y-6">
      <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-3">
        <Stat
          label="Total Competitions"
          value={data.totalCompetitions.toLocaleString()}
        />
        <Stat
          label="Active Competitions"
          value={data.activeCompetitions.toLocaleString()}
        />
        <Stat
          label="Inactive Competitions"
          value={data.inactiveCompetitions.toLocaleString()}
        />
      </div>

      {data.inactiveCompetitions > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Status Breakdown:</span>
          <Badge variant="default">{data.activeCompetitions} Active</Badge>
          <Badge variant="secondary">
            {data.inactiveCompetitions} Inactive
          </Badge>
        </div>
      )}

      {/* Charts Grid Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {statusChartData.length > 0 && (
          <ChartCard
            title="Competition Status"
            description="Competitions by current status"
            chartConfig={statusChartConfig}
            chartClassName="h-[260px]"
          >
            <BarChart data={statusChartData}>
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
                formatter={(value: number, name: string) => [
                  formatNumber(value),
                  statusChartConfig[name as keyof typeof statusChartConfig]
                    ?.label || name,
                ]}
              />
              <Bar
                dataKey="value"
                fill="var(--color-value)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartCard>
        )}

        {/* Competition Size Distribution Chart */}
        <ChartCard
          title="Competition Size"
          description="Competitions by team size"
          chartConfig={sizeChartConfig}
          chartClassName="h-[260px]"
        >
          <BarChart data={sizeChartData}>
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
                "Competitions",
              ]}
            />
            <Bar
              dataKey="value"
              fill="var(--color-value)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartCard>

        {/* Competition Grade Distribution Chart */}
        <ChartCard
          title="Competition Grades"
          description="Competitions by grade count"
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
                "Competitions",
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

      <div className="grid gap-6 lg:grid-cols-3">
        <DistributionTable
          title="Status Buckets"
          valueLabel="Competitions"
          rows={statusChartData.map((row) => ({
            label: row.name,
            value: row.value,
          }))}
        />
        <DistributionTable
          title="Team Size Buckets"
          valueLabel="Competitions"
          rows={sizeChartData}
        />
        <DistributionTable
          title="Grade Buckets"
          valueLabel="Competitions"
          rows={gradeChartData}
        />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-slate-200 px-4 py-3 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function DistributionTable({
  title,
  valueLabel,
  rows,
}: {
  title: string;
  valueLabel: string;
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
            <TableHead className="text-right">{valueLabel}</TableHead>
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
