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
import { OverviewAnalytics } from "@/types/associationInsights";
import { Badge } from "@/components/ui/badge";
import ChartCard from "@/components/modules/charts/ChartCard";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";
import { formatNumber, formatPercentage } from "@/utils/chart-formatters";
import type { ChartConfig } from "@/components/ui/chart";

/**
 * OverviewStatsCard Component
 *
 * Displays overview analytics:
 * - Total Associations (with active/inactive breakdown)
 * - Associations with/without Accounts
 * - Sport Distribution Chart/Table (conditional - only show if not filtered, handle null)
 * - Account Count Distribution Chart/Table (zero, one, twoToFive, sixPlus)
 */
interface OverviewStatsCardProps {
  data: OverviewAnalytics;
}

export default function OverviewStatsCard({ data }: OverviewStatsCardProps) {
  const accountCountTableData = useMemo(() => {
    return [
      {
        name: "Zero accounts",
        value: data.associationsByAccountCount.zero,
      },
      {
        name: "One account",
        value: data.associationsByAccountCount.one,
      },
      {
        name: "2-5 accounts",
        value: data.associationsByAccountCount.twoToFive,
      },
      {
        name: "6+ accounts",
        value: data.associationsByAccountCount.sixPlus,
      },
    ];
  }, [data.associationsByAccountCount]);

  // Prepare data for pie chart
  const accountCountChartData = useMemo(() => {
    return accountCountTableData.filter((item) => item.value > 0);
  }, [accountCountTableData]);

  // Create chart config for account count distribution
  const accountCountChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    accountCountChartData.forEach((item, index) => {
      config[item.name] = {
        label: item.name,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      };
    });
    return config;
  }, [accountCountChartData]);

  return (
    <div className="space-y-6">
      {/* Summary Stats Grid */}
      <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Total Associations"
          value={data.totalAssociations.toLocaleString()}
        />
        <Stat
          label="Active Associations"
          value={data.activeAssociations.toLocaleString()}
        />
        <Stat
          label="With Accounts"
          value={data.associationsWithAccounts.toLocaleString()}
        />
        <Stat
          label="Without Accounts"
          value={data.associationsWithoutAccounts.toLocaleString()}
        />
      </div>

      {/* Active/Inactive Breakdown */}
      {data.inactiveAssociations > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Status Breakdown:</span>
          <Badge variant="default">{data.activeAssociations} Active</Badge>
          <Badge variant="secondary">
            {data.inactiveAssociations} Inactive
          </Badge>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Account Count Distribution - Pie Chart */}
        {accountCountChartData.length > 0 ? (
          <ChartCard
            title="Account Coverage"
            description="Associations by linked account count"
            chartConfig={accountCountChartConfig}
            chartClassName="h-[260px]"
            emptyStateMessage="No account count data available"
            cardClassName="lg:col-span-2"
          >
            <PieChart>
              <Pie
                data={accountCountChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${formatPercentage(percent * 100)}`
                }
                outerRadius={92}
                fill="#8884d8"
                dataKey="value"
              >
                {accountCountChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      accountCountChartConfig[entry.name]?.color ||
                      `hsl(var(--chart-${(index % 5) + 1}))`
                    }
                  />
                ))}
              </Pie>
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number, name: string) => [
                  formatNumber(value),
                  accountCountChartConfig[
                    name as keyof typeof accountCountChartConfig
                  ]?.label || name,
                ]}
              />
            </PieChart>
          </ChartCard>
        ) : null}

        {/* Sport Distribution - Only show if not filtered (not null) */}
        {data.sportDistribution && (
          <div className="rounded-md border border-slate-200 bg-white">
            <div className="border-b border-slate-200 p-4">
              <h4 className="text-sm font-semibold text-slate-900">
                Sport Distribution
              </h4>
              <p className="text-xs text-muted-foreground">
                Associations by sport.
              </p>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead>Sport</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(data.sportDistribution)
                  .sort(([, a], [, b]) => b - a)
                  .map(([sport, count]) => (
                    <TableRow key={sport}>
                      <TableCell className="text-sm font-medium text-slate-900">
                        {sport}
                      </TableCell>
                      <TableCell className="text-right">
                        {count.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-md border border-slate-200 bg-white lg:col-span-2">
          <div className="border-b border-slate-200 px-4 py-3">
            <h4 className="text-sm font-semibold text-slate-900">
              Account Count Buckets
            </h4>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead>Bucket</TableHead>
                <TableHead className="text-right">Associations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accountCountTableData.map((row) => (
                <TableRow key={row.name}>
                  <TableCell className="text-sm font-medium text-slate-900">
                    {row.name}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.value.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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
