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
  // Prepare data for pie chart
  const accountCountChartData = useMemo(() => {
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
    ].filter((item) => item.value > 0); // Only show segments with data
  }, [data.associationsByAccountCount]);

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
    <div className="p-4 space-y-6">
      {/* Summary Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Status Breakdown:</span>
          <Badge variant="default">{data.activeAssociations} Active</Badge>
          <Badge variant="secondary">
            {data.inactiveAssociations} Inactive
          </Badge>
        </div>
      )}

      {/* Sport Distribution - Only show if not filtered (not null) */}
      {data.sportDistribution && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Sport Distribution</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sport</TableHead>
                <TableHead className="text-right">Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(data.sportDistribution)
                .sort(([, a], [, b]) => b - a)
                .map(([sport, count]) => (
                  <TableRow key={sport}>
                    <TableCell className="font-medium">{sport}</TableCell>
                    <TableCell className="text-right">
                      {count.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Account Count Distribution - Pie Chart */}
      {accountCountChartData.length > 0 ? (
        <ChartCard
          title="Associations by Account Count"
          description="Distribution of associations by number of accounts"
          chartConfig={accountCountChartConfig}
          chartClassName="h-[300px]"
          emptyStateMessage="No account count data available"
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
              outerRadius={100}
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
